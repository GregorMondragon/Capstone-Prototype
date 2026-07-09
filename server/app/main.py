from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from app.routes import scan, library
from app.database.db import engine, Base, run_migrations


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup -- ensure tables exist and apply any schema migrations
    Base.metadata.create_all(bind=engine)
    run_migrations()  # Safely adds new columns to existing DB

    model_path = os.path.join("app", "ml", "model", "best_model.pt")
    if os.path.exists(model_path):
        size_mb = os.path.getsize(model_path) / (1024 * 1024)
        print(f"[BananaGuard] [OK]  Trained model found ({size_mb:.1f} MB) -- real CNN active.")
    else:
        print("[BananaGuard] [WARN]️   No trained model found. Running in SIMULATION mode.")
        print("[BananaGuard]     Run 'python download_dataset.py' then 'python train.py' to train.")

    yield


app = FastAPI(
    title="BananaGuard API",
    description="API for Banana Leaf Disease Detection using CNN (MobileNetV2 / PyTorch)",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan.router,    prefix="/api/scan",    tags=["Scan"])
app.include_router(library.router, prefix="/api/library", tags=["Library"])


@app.get("/api/health", tags=["Health"])
async def health_check():
    model_path = os.path.join("app", "ml", "model", "best_model.pt")
    model_ready = os.path.exists(model_path)
    return {
        "status": "online",
        "message": "BananaGuard API is running.",
        "model_ready": model_ready,
        "mode": "CNN" if model_ready else "simulation",
    }
