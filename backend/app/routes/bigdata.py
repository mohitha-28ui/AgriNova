"""
AgriNova Big Data Infrastructure Router
Endpoints for Hadoop HDFS, Apache Spark ETL Pipelines, and Apache Kafka Streaming.
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Optional, List, Dict, Any
from backend.app.schemas.schemas import PipelineRunRequest
from bigdata.hadoop.hdfs_service import hdfs_service
from bigdata.spark.spark_job_manager import spark_job_manager
from bigdata.kafka.kafka_engine import kafka_engine

router = APIRouter(prefix="/bigdata", tags=["Big Data Infrastructure (Hadoop, Spark, Kafka)"])

# 1. HADOOP HDFS ENDPOINTS
@router.get("/hdfs/status")
def get_hdfs_status():
    """Returns NameNode health, DataNodes, storage capacity, and replication metrics."""
    return hdfs_service.get_cluster_status()

@router.get("/hdfs/files")
def list_hdfs_files(path: str = "/agrinova"):
    """Lists files and directories within HDFS."""
    return {"path": path, "items": hdfs_service.list_directory(path)}

@router.post("/hdfs/sync")
def sync_raw_datasets():
    """Synchronizes all raw agricultural datasets into the HDFS directory hierarchy."""
    return hdfs_service.sync_all_raw_datasets()

# 2. APACHE SPARK & PYSPARK ENDPOINTS
@router.get("/spark/jobs")
def get_spark_jobs(limit: int = 50):
    """Retrieves execution history of PySpark Big Data pipelines."""
    return spark_job_manager.get_all_jobs(limit=limit)

@router.post("/spark/run")
def trigger_spark_pipeline(req: PipelineRunRequest, background_tasks: BackgroundTasks):
    """Executes distributed PySpark processing pipelines."""
    if req.pipeline_name == "ALL" or not req.pipeline_name:
        results = spark_job_manager.run_all_pipelines()
        return {
            "status": "success",
            "message": "All 8 PySpark Big Data pipelines executed successfully",
            "executed_jobs_count": len(results),
            "jobs": results
        }
    elif req.pipeline_name == "CROP_PRODUCTION":
        job = spark_job_manager.run_crop_production_etl()
        return {"status": "success", "job": job}
    elif req.pipeline_name == "SOIL_HEALTH":
        job = spark_job_manager.run_soil_health_etl()
        return {"status": "success", "job": job}
    elif req.pipeline_name == "WEATHER":
        job = spark_job_manager.run_weather_rainfall_etl()
        return {"status": "success", "job": job}
    elif req.pipeline_name == "MARKET":
        job = spark_job_manager.run_market_price_analytics()
        return {"status": "success", "job": job}
    else:
        raise HTTPException(status_code=400, detail=f"Unknown pipeline: {req.pipeline_name}")

# 3. APACHE KAFKA STREAMING ENDPOINTS
@router.get("/kafka/metrics")
def get_kafka_metrics():
    """Returns Kafka broker status, registered topics, partitions, and buffer volumes."""
    return kafka_engine.get_streaming_metrics()

@router.get("/kafka/events")
def consume_kafka_events(topic: Optional[str] = None, limit: int = 40):
    """Consumes real-time streaming agro-telemetry events."""
    return kafka_engine.consume_latest_events(topic=topic, limit=limit)

@router.post("/kafka/generate-events")
def generate_kafka_test_events(count: int = 10):
    """Publishes a batch of synthetic IoT sensor and Mandi trade events to Kafka."""
    events = kafka_engine.generate_demo_batch(count=count)
    return {
        "status": "published",
        "events_count": len(events),
        "events": events
    }
