"""
AgriNova Deployment Verification Script
Tests FastAPI unified endpoints, SPA client-side routing, static assets, and ML services.
"""

import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from fastapi.testclient import TestClient
from backend.main import app

def run_tests():
    with TestClient(app) as client:
        print("1. Testing Health Endpoint (/api/health)...")
        res = client.get("/api/health")
        print("Response:", res.status_code, res.json())
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "HEALTHY"
        assert data["frontend_mounted"] is True
        print("✓ Health check PASSED\n")

        print("2. Testing Ping Endpoint (/api/ping)...")
        res = client.get("/api/ping")
        assert res.status_code == 200
        assert res.json()["status"] == "pong"
        print("✓ Ping check PASSED\n")

        print("3. Testing Single-URL SPA Root (GET /)...")
        res = client.get("/")
        assert res.status_code == 200
        assert '<div id="root">' in res.text
        print("✓ Root SPA index.html serving PASSED\n")

        print("4. Testing Single-URL SPA Route (GET /dashboard)...")
        res = client.get("/dashboard")
        assert res.status_code == 200
        assert '<div id="root">' in res.text
        print("✓ Catch-all SPA route PASSED\n")

        print("5. Testing API Agriculture Crops List (/api/agriculture/crops)...")
        res = client.get("/api/agriculture/crops")
        assert res.status_code == 200
        crops = res.json()
        assert len(crops) > 0
        print(f"✓ Crops catalog PASSED (Found {len(crops)} crops)\n")

        print("6. Testing ML Crop Recommendation Engine (/api/recommendations/crop)...")
        payload = {
            "N": 90, "P": 42, "K": 43,
            "temperature": 20.87, "humidity": 82.0,
            "ph": 6.5, "rainfall": 202.9
        }
        res = client.post("/api/recommendations/crop", json=payload)
        assert res.status_code == 200
        rec = res.json()
        assert "recommended_crop" in rec
        print(f"✓ ML Recommendation PASSED (Result: {rec['recommended_crop']}, confidence: {rec['confidence_score']}%)\n")

        print("7. Testing SQL Modules Statistics (/api/sql/dashboard/stats)...")
        res = client.get("/api/sql/dashboard/stats")
        assert res.status_code == 200
        stats = res.json()
        print(f"✓ SQL Modules stats PASSED (Users: {stats.get('users_count')}, Crops: {stats.get('crops_count')})\n")

    print("==================================================")
    print("ALL AGRI-NOVA UNIFIED DEPLOYMENT TESTS PASSED 100%")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
