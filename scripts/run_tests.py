"""
AgriNova Automated Subsystem Verification Engine
Tests all agricultural intelligence modules, ML pipelines, HDFS, Spark, and Kafka.
"""

import os
import sys
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from backend.app.services.ml_service import ml_service
from backend.app.schemas.schemas import (
    CropRecommendationRequest, YieldPredictionRequest,
    FertilizerRecommendationRequest, DiseaseDetectionRequest, CopilotRequest
)
from backend.app.routes.recommendations import recommend_crop, recommend_fertilizer
from backend.app.routes.predictions import predict_crop_yield
from backend.app.routes.disease import diagnose_disease
from backend.app.routes.copilot import chat_with_copilot
from backend.app.routes.admin import get_system_health
from backend.app.routes.bigdata import get_hdfs_status, list_hdfs_files, get_spark_jobs, get_kafka_metrics, generate_kafka_test_events
from backend.app.routes.analytics import get_dashboard_summary

def run_tests():
    print(f"=== AgriNova Subsystem & Verification Suite [{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] ===", flush=True)
    passed = 0
    failed = 0

    # Test 1: System Health Diagnostic
    try:
        health = get_system_health()
        assert health["status"] == "ALL_SYSTEMS_OPERATIONAL"
        assert health["components"]["mongodb_database"]["status"] == "HEALTHY"
        print(" [PASS] 01. Central System Health Diagnostic", flush=True)
        passed += 1
    except Exception as e:
        print(" [FAIL] 01. Central System Health Diagnostic:", e, flush=True)
        failed += 1

    # Test 2: Crop Recommendation ML Inference
    try:
        req = CropRecommendationRequest(
            N=80, P=45, K=40, temperature=24.5, humidity=82.0, ph=6.5, rainfall=220.0
        )
        res = recommend_crop(req)
        assert res["recommended_crop"] == "rice"
        assert res["suitability_score"] >= 80.0
        assert len(res["alternative_crops"]) > 0
        print(f" [PASS] 02. Machine Learning Crop Recommender (Predicted: {res['recommended_crop']}, Suitability: {res['suitability_score']}%)", flush=True)
        passed += 1
    except Exception as e:
        print(" [FAIL] 02. Machine Learning Crop Recommender:", e, flush=True)
        failed += 1

    # Test 3: Crop Yield Prediction Regressor
    try:
        req = YieldPredictionRequest(
            state="Punjab", crop="Wheat", season="Rabi",
            area_hectares=10.0, annual_rainfall_mm=650.0,
            fertilizer_used_kg=1400.0, pesticide_used_kg=15.0
        )
        res = predict_crop_yield(req)
        assert res["predicted_yield_tonnes_per_ha"] > 1.5
        assert res["predicted_total_production_tonnes"] > 15.0
        print(f" [PASS] 03. Gradient Boosting Yield Regressor (Predicted Yield: {res['predicted_yield_tonnes_per_ha']} T/ha, Total: {res['predicted_total_production_tonnes']} Tonnes)", flush=True)
        passed += 1
    except Exception as e:
        print(" [FAIL] 03. Gradient Boosting Yield Regressor:", e, flush=True)
        failed += 1

    # Test 4: Fertilizer Agronomic Recommendation Engine
    try:
        req = FertilizerRecommendationRequest(
            crop="Wheat", current_n=80, current_p=30, current_k=25,
            soil_ph=6.8, land_acres=2.0
        )
        res = recommend_fertilizer(req)
        assert res["recommended_fertilizers"]["urea_kg"] > 0
        assert len(res["application_schedule"]) == 3
        print(f" [PASS] 04. NPK Agronomic Fertilizer Calculator (Urea: {res['recommended_fertilizers']['urea_kg']} kg, DAP: {res['recommended_fertilizers']['dap_kg']} kg)", flush=True)
        passed += 1
    except Exception as e:
        print(" [FAIL] 04. NPK Agronomic Fertilizer Calculator:", e, flush=True)
        failed += 1

    # Test 5: Plant Disease Diagnosis Knowledge Engine
    try:
        req = DiseaseDetectionRequest(
            crop="Potato", symptom_description="Dark water-soaked lesions and fungal mould on leaves"
        )
        res = diagnose_disease(req)
        assert "Late Blight" in res["detected_disease"]
        assert "chemical_treatment" in res
        print(f" [PASS] 05. Plant Disease Diagnostic Engine (Detected: {res['detected_disease']}, Confidence: {res['confidence_score']}%)", flush=True)
        passed += 1
    except Exception as e:
        print(" [FAIL] 05. Plant Disease Diagnostic Engine:", e, flush=True)
        failed += 1

    # Test 6: Hadoop HDFS Cluster Monitor
    try:
        res = get_hdfs_status()
        assert res["namenode_status"] == "ACTIVE"
        assert res["capacity_total_bytes"] > 0
        assert res["datanodes_live"] >= 1
        print(f" [PASS] 06. Hadoop HDFS Cluster Monitor (NameNode: {res['namenode_status']}, Blocks: {res['total_blocks']}, Capacity: {round(res['capacity_total_bytes']/(1024**3), 1)} GB)", flush=True)
        passed += 1
    except Exception as e:
        print(" [FAIL] 06. Hadoop HDFS Cluster Monitor:", e, flush=True)
        failed += 1

    # Test 7: HDFS Distributed Namespace File Listing
    try:
        res = list_hdfs_files(path="/agrinova/raw")
        assert len(res["items"]) >= 5
        print(f" [PASS] 07. HDFS Distributed Namespace Inspection ({len(res['items'])} directories verified in /agrinova/raw)", flush=True)
        passed += 1
    except Exception as e:
        print(" [FAIL] 07. HDFS Distributed Namespace Inspection:", e, flush=True)
        failed += 1

    # Test 8: Apache Spark Pipeline Execution History
    try:
        jobs = get_spark_jobs(limit=10)
        assert len(jobs) >= 8
        print(f" [PASS] 08. PySpark Pipeline Execution History ({len(jobs)} distributed jobs recorded in MongoDB)", flush=True)
        passed += 1
    except Exception as e:
        print(" [FAIL] 08. PySpark Pipeline Execution History:", e, flush=True)
        failed += 1

    # Test 9: Apache Kafka Real-Time Streaming
    try:
        m = get_kafka_metrics()
        assert m["broker_status"] == "ONLINE"
        gen = generate_kafka_test_events(count=6)
        assert gen["events_count"] == 6
        print(f" [PASS] 09. Apache Kafka Real-Time Streaming Ingestion ({gen['events_count']} synthetic events ingested)", flush=True)
        passed += 1
    except Exception as e:
        print(" [FAIL] 09. Apache Kafka Real-Time Streaming Ingestion:", e, flush=True)
        failed += 1

    # Test 10: AI Agronomic Farming Copilot
    try:
        req = CopilotRequest(question="What is the recommended NPK ratio for Wheat?")
        res = chat_with_copilot(req)
        assert "4:2:1" in res["response"]
        print(" [PASS] 10. AI Agronomic Copilot Knowledge Retrieval", flush=True)
        passed += 1
    except Exception as e:
        print(" [FAIL] 10. AI Agronomic Copilot Knowledge Retrieval:", e, flush=True)
        failed += 1

    # Test 11: Big Data Central Dashboard KPI Aggregations
    try:
        res = get_dashboard_summary()
        assert res["kpis"]["total_agricultural_records"] >= 40000
        assert res["kpis"]["spark_pipelines_completed"] >= 8
        print(f" [PASS] 11. Central Dashboard KPI Aggregations ({res['kpis']['total_agricultural_records']} records processed)", flush=True)
        passed += 1
    except Exception as e:
        print(" [FAIL] 11. Central Dashboard KPI Aggregations:", e, flush=True)
        failed += 1

    print("\n=======================================================", flush=True)
    print(f"TEST SUMMARY: {passed} PASSED, {failed} FAILED (TOTAL: {passed + failed})", flush=True)
    print(f"STATUS: {'ALL SYSTEMS VERIFIED - PRODUCTION READY' if failed == 0 else 'TEST FAILURES DETECTED'}", flush=True)
    print("=======================================================\n", flush=True)
    return 0 if failed == 0 else 1

if __name__ == "__main__":
    code = run_tests()
    sys.exit(code)
