"""
AgriNova Automated Test Suite
Verifies API endpoints, ML predictions, HDFS storage, PySpark jobs, and Kafka streaming.
"""

import unittest
from fastapi.testclient import TestClient
from backend.main import app

class TestAgriNovaPlatform(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_01_health_check(self):
        response = self.client.get("/api/admin/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "ALL_SYSTEMS_OPERATIONAL")
        self.assertIn("fastapi_backend", data["components"])
        self.assertIn("hadoop_hdfs_storage", data["components"])
        self.assertIn("apache_kafka_streaming", data["components"])

    def test_02_login_admin(self):
        response = self.client.post("/api/auth/login", json={
            "email": "admin@agrinova.ai",
            "password": "Admin@12345"
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["user"]["role"], "admin")

    def test_03_crop_recommendation_ml(self):
        payload = {
            "N": 80,
            "P": 45,
            "K": 40,
            "temperature": 24.5,
            "humidity": 82.0,
            "ph": 6.5,
            "rainfall": 220.0
        }
        response = self.client.post("/api/recommendations/crop", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("recommended_crop", data)
        self.assertGreaterEqual(data["suitability_score"], 80.0)
        self.assertEqual(data["recommended_crop"], "rice")

    def test_04_crop_yield_prediction_ml(self):
        payload = {
            "state": "Punjab",
            "crop": "Wheat",
            "season": "Rabi",
            "area_hectares": 10.0,
            "annual_rainfall_mm": 650.0,
            "fertilizer_used_kg": 1400.0,
            "pesticide_used_kg": 15.0
        }
        response = self.client.post("/api/predictions/yield", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("predicted_yield_tonnes_per_ha", data)
        self.assertGreater(data["predicted_yield_tonnes_per_ha"], 2.0)
        self.assertGreater(data["predicted_total_production_tonnes"], 20.0)

    def test_05_fertilizer_recommendation(self):
        payload = {
            "crop": "Wheat",
            "current_n": 80,
            "current_p": 30,
            "current_k": 25,
            "soil_ph": 6.8,
            "land_acres": 2.0
        }
        response = self.client.post("/api/recommendations/fertilizer", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("recommended_fertilizers", data)
        self.assertGreater(data["recommended_fertilizers"]["urea_kg"], 0)

    def test_06_disease_diagnosis(self):
        payload = {
            "crop": "Potato",
            "symptom_description": "Dark water-soaked lesions and fungal mould on leaves"
        }
        response = self.client.post("/api/disease/diagnose", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("Late Blight", data["detected_disease"])
        self.assertIn("organic_treatment", data)
        self.assertIn("chemical_treatment", data)

    def test_07_hdfs_cluster_status(self):
        response = self.client.get("/api/bigdata/hdfs/status")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["namenode_status"], "ACTIVE")
        self.assertGreater(data["capacity_total_bytes"], 0)

    def test_08_hdfs_file_listing(self):
        response = self.client.get("/api/bigdata/hdfs/files?path=/agrinova/raw")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(len(data["items"]), 5)

    def test_09_spark_jobs_history(self):
        response = self.client.get("/api/bigdata/spark/jobs")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)

    def test_10_kafka_metrics_and_events(self):
        # 1. Fetch metrics
        res_m = self.client.get("/api/bigdata/kafka/metrics")
        self.assertEqual(res_m.status_code, 200)
        self.assertEqual(res_m.json()["broker_status"], "ONLINE")
        
        # 2. Publish synthetic telemetry
        res_p = self.client.post("/api/bigdata/kafka/generate-events?count=5")
        self.assertEqual(res_p.status_code, 200)
        self.assertEqual(res_p.json()["events_count"], 5)
        
        # 3. Consume events
        res_c = self.client.get("/api/bigdata/kafka/events?limit=5")
        self.assertEqual(res_c.status_code, 200)
        self.assertGreaterEqual(len(res_c.json()), 5)

    def test_11_copilot_assistant(self):
        payload = {"question": "What is the recommended NPK ratio for Wheat?"}
        response = self.client.post("/api/copilot/query", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("4:2:1", data["response"])

    def test_12_dashboard_kpis(self):
        response = self.client.get("/api/analytics/dashboard-summary")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("kpis", data)
        self.assertGreaterEqual(data["kpis"]["total_agricultural_records"], 40000)

if __name__ == "__main__":
    unittest.main()
