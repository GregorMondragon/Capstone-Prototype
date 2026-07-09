from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, text
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.sql import func
import os

DATABASE_URL = "sqlite:///./bananaguard.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class ScanRecord(Base):
    __tablename__ = "scan_history"

    id              = Column(Integer, primary_key=True, index=True)
    filename        = Column(String, index=True)
    top_prediction  = Column(String, index=True)
    confidence      = Column(Float)
    all_predictions = Column(Text, nullable=True)   # JSON string of full prediction list
    scan_mode       = Column(String, default="single")  # single | batch | camera
    scanned_at      = Column(DateTime(timezone=True), server_default=func.now())


def run_migrations():
    """
    Safely apply schema migrations using raw SQLite ALTER TABLE.
    SQLAlchemy create_all() does NOT add columns to existing tables,
    so we handle it here manually for each new column added.
    """
    migrations = {
        "all_predictions": "ALTER TABLE scan_history ADD COLUMN all_predictions TEXT",
        "scan_mode":       "ALTER TABLE scan_history ADD COLUMN scan_mode TEXT DEFAULT 'single'",
    }

    try:
        with engine.connect() as conn:
            result = conn.execute(text("PRAGMA table_info(scan_history)"))
            existing_cols = {row[1] for row in result.fetchall()}

            for col_name, sql in migrations.items():
                if col_name not in existing_cols:
                    conn.execute(text(sql))
                    conn.commit()
                    print(f"[DB] Migration applied: added column '{col_name}'")
    except Exception as exc:
        print(f"[DB] Migration skipped (table may not exist yet): {exc}")


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
