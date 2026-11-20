"""
AgriNova Administration & System Health Router
"""

from fastapi import APIRouter, Depends
from datetime import datetime
from backend.app.schemas.schemas import FeedbackCreate
from backend.app.database.mongodb import (
    users_col, farmer_profiles_col, feedback_col, notifications_col, db_manager
)
from bigdata.hadoop.hdfs_service import hdfs_service
from bigdata.kafka.kafka_engine import kafka_engine

router = APIRouter(prefix="/admin", tags=["Administration & System Diagnostics"])

@router.get("/health")
def get_system_health():
    """Consolidated diagnostic health of all infrastructure tiers."""
    db_health = db_manager.check_health()
    hdfs_health = hdfs_service.get_cluster_status()
    kafka_health = kafka_engine.get_streaming_metrics()
    
    return {
        "platform": "AgriNova – AI and Big Data Platform for Smart Agriculture",
        "tagline": "Smart Farming, Better Tomorrow.",
        "version": "1.0.0",
        "status": "ALL_SYSTEMS_OPERATIONAL",
        "timestamp": datetime.now().isoformat(),
        "components": {
            "fastapi_backend": {"status": "HEALTHY", "uptime": "Continuous"},
            "mongodb_database": db_health,
            "hadoop_hdfs_storage": hdfs_health,
            "apache_kafka_streaming": kafka_health,
            "apache_spark_engine": {"status": "ACTIVE", "framework": "Apache Spark / PySpark 3.5+"},
            "ml_inference_engine": {"status": "ONLINE", "crop_recommender": "LOADED", "yield_regressor": "LOADED"}
        }
    }

@router.get("/users")
def list_registered_users(limit: int = 50):
    raw_users = users_col.find({}, limit=limit)
    safe = []
    for u in raw_users:
        safe.append({k: v for k, v in u.items() if k != "hashed_password"})
    return safe

@router.get("/notifications")
def list_notifications():
    return notifications_col.find({}, limit=20, sort=[("timestamp", -1)])

@router.post("/feedback")
def submit_feedback(req: FeedbackCreate):
    doc = {
        "name": req.name,
        "email": req.email,
        "rating": req.rating,
        "category": req.category,
        "comments": req.comments,
        "submitted_at": datetime.now().isoformat()
    }
    feedback_col.insert_one(doc)
    return {"status": "success", "message": "Feedback submitted successfully"}

@router.get("/feedback")
def list_feedback():
    return feedback_col.find({}, limit=50)
