from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import json

from app.database.db import get_db, ScanRecord
from app.ml.predictor import predictor

router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp", "image/gif"}


def _save_record(db: Session, filename: str, predictions: list, mode: str = "single") -> ScanRecord:
    """Helper to persist a scan result to the database."""
    top_pred = predictions[0]
    record = ScanRecord(
        filename=filename,
        top_prediction=top_pred["class_id"],
        confidence=top_pred["confidence"],
        all_predictions=json.dumps(predictions),
        scan_mode=mode,
    )
    db.add(record)
    return record


@router.post("/single")
async def scan_single(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="File must be a valid image (JPEG, PNG, WEBP, BMP).")

    try:
        contents = await file.read()
        if len(contents) < 100:
            raise HTTPException(status_code=400, detail="Image file is too small or empty.")

        predictions = predictor.predict(contents)
        record = _save_record(db, file.filename, predictions, mode="single")
        db.commit()
        db.refresh(record)

        return {
            "status": "success",
            "filename": file.filename,
            "predictions": predictions,
            "record_id": record.id,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/batch")
async def scan_batch(files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    if len(files) > 20:
        raise HTTPException(status_code=400, detail="Maximum 20 images per batch.")

    results = []
    for file in files:
        if file.content_type not in ALLOWED_CONTENT_TYPES:
            results.append({"filename": file.filename, "error": "Not a supported image type."})
            continue

        try:
            contents = await file.read()
            predictions = predictor.predict(contents)
            _save_record(db, file.filename, predictions, mode="batch")
            results.append({"filename": file.filename, "predictions": predictions})
        except Exception as e:
            results.append({"filename": file.filename, "error": str(e)})

    db.commit()
    return {"status": "success", "processed_count": len(files), "results": results}


@router.get("/history")
async def get_history(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    records = (
        db.query(ScanRecord)
        .order_by(ScanRecord.scanned_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return {"records": records}


@router.delete("/history/{scan_id}")
async def delete_history_record(scan_id: int, db: Session = Depends(get_db)):
    record = db.query(ScanRecord).filter(ScanRecord.id == scan_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
    return {"status": "success", "message": "Record deleted"}


@router.delete("/history")
async def clear_history(db: Session = Depends(get_db)):
    db.query(ScanRecord).delete()
    db.commit()
    return {"status": "success", "message": "All history cleared"}


@router.get("/analytics")
async def get_analytics(db: Session = Depends(get_db)):
    total = db.query(ScanRecord).count()

    distribution = (
        db.query(ScanRecord.top_prediction, func.count(ScanRecord.id))
        .group_by(ScanRecord.top_prediction)
        .all()
    )
    dist_dict = {item[0]: item[1] for item in distribution}

    healthy  = dist_dict.get("healthy", 0)
    diseased = total - healthy
    health_score = 100 if total == 0 else int((healthy / total) * 100)

    recent = db.query(ScanRecord).order_by(ScanRecord.scanned_at.desc()).limit(10).all()

    return {
        "total_scans": total,
        "healthy_count": healthy,
        "diseased_count": diseased,
        "health_score": health_score,
        "disease_distribution": dist_dict,
        "recent_scans": recent,
    }
