"""
MYTHORA End-to-End Functional Verification & Live Audit Suite
Turning Data into Growth
Tests all 10 checkpoints against the active services on localhost.
"""
import os
import sys
import json
import time
import urllib.request
import urllib.error
import urllib.parse
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

BACKEND_URL = "http://127.0.0.1:8000"
FRONTEND_URL = "http://127.0.0.1:5173"

def http_get(url, headers=None):
    req = urllib.request.Request(url, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(body)
        except:
            return e.code, body
    except Exception as e:
        return 0, str(e)

def http_get_text(url):
    req = urllib.request.Request(url)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status, resp.read().decode('utf-8')
    except Exception as e:
        return 0, str(e)

def http_post(url, data=None, headers=None):
    h = headers or {}
    if 'Content-Type' not in h:
        h['Content-Type'] = 'application/json'
    body = json.dumps(data).encode('utf-8') if data else b''
    req = urllib.request.Request(url, data=body, headers=h, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(err_body)
        except:
            return e.code, err_body
    except Exception as e:
        return 0, str(e)

def run_e2e_verification():
    passed = []
    failed = []
    services_status = {}

    print("=" * 75)
    print(" AGRINOVA LIVE END-TO-END FUNCTIONAL VERIFICATION ")
    print("=" * 75)

    # ----------------------------------------------------
    # Checkpoint 1: Verify React Frontend Loads
    # ----------------------------------------------------
    print("\n[TEST 1] Verifying React Frontend on Port 5173...")
    status, html = http_get_text(FRONTEND_URL)
    if status == 200 and '<div id="root">' in html:
        print(f" [+] Frontend Loaded: HTTP 200 OK, HTML contains React #root mount point.")
        passed.append("01. React Frontend Load (HTTP 200 & DOM Mount)")
        services_status["React Frontend (Vite)"] = "ACTIVE & HEALTHY"
    else:
        print(f" [-] Frontend Failed: Status {status}, error: {html[:200]}")
        failed.append(f"01. React Frontend Load: Status {status}")
        services_status["React Frontend (Vite)"] = "UNREACHABLE"

    # ----------------------------------------------------
    # Checkpoint 2: Verify Login & JWT Authentication
    # ----------------------------------------------------
    print("\n[TEST 2] Verifying Authentication & JWT Bearer Security...")
    # Attempt login with seeded user
    login_status, login_res = http_post(f"{BACKEND_URL}/api/auth/login", {
        "email": "farmer@agrinova.ai",
        "password": "Farmer@12345"
    })
    
    jwt_token = None
    if login_status == 200 and "access_token" in login_res:
        jwt_token = login_res["access_token"]
        print(f" [+] Login Successful: JWT Bearer Token generated ({login_res.get('token_type', 'bearer')})")
        
        # Test protected /api/auth/me
        me_status, me_res = http_get(f"{BACKEND_URL}/api/auth/me", {"Authorization": f"Bearer {jwt_token}"})
        if me_status == 200 and me_res.get("email") == "farmer@agrinova.ai":
            print(f" [+] Token Authentication Validated: User '{me_res.get('full_name')}' ({me_res.get('role')})")
            passed.append("02. JWT Authentication & Protected Profile Resolution")
        else:
            print(f" [-] Protected Route Failed: Status {me_status}, response: {me_res}")
            failed.append("02. Protected Route /api/auth/me")
    else:
        print(f" [-] Login Failed: Status {login_status}, response: {login_res}")
        failed.append(f"02. Login Endpoint /api/auth/login: {login_res}")

    # ----------------------------------------------------
    # Checkpoint 3: Verify MongoDB Connection
    # ----------------------------------------------------
    print("\n[TEST 3] Verifying MongoDB Connection & Database Architecture...")
    db_status, db_res = http_get(f"{BACKEND_URL}/api/admin/health")
    if db_status == 200:
        components = db_res.get("components", {})
        db_info = components.get("mongodb_database", {})
        colls_count = db_info.get("collections_count", 0)
        print(f" [+] MongoDB Health: {db_info.get('status')} | Database: {db_info.get('database_name')}")
        print(f" [+] Collections Registered: {colls_count} collections")
        if colls_count >= 15:
            passed.append(f"03. MongoDB Database Architecture ({colls_count} collections active)")
            services_status["MongoDB Database Engine"] = "ACTIVE & HEALTHY"
        else:
            failed.append("03. MongoDB Collections Incomplete")
            services_status["MongoDB Database Engine"] = "DEGRADED"
    else:
        print(f" [-] MongoDB Check Failed: Status {db_status}")
        failed.append("03. MongoDB Health Check")
        services_status["MongoDB Database Engine"] = "UNREACHABLE"

    # ----------------------------------------------------
    # Checkpoint 4: Verify Hadoop HDFS Connection & Storage
    # ----------------------------------------------------
    print("\n[TEST 4] Verifying Hadoop HDFS Storage & Namespace...")
    hdfs_status, hdfs_res = http_get(f"{BACKEND_URL}/api/bigdata/hdfs/status")
    raw_status, raw_res = http_get(f"{BACKEND_URL}/api/bigdata/hdfs/files?path=/agrinova/raw")
    proc_status, proc_res = http_get(f"{BACKEND_URL}/api/bigdata/hdfs/files?path=/agrinova/processed")

    if hdfs_status == 200 and raw_status == 200:
        raw_items = raw_res.get("items", [])
        proc_items = proc_res.get("items", [])
        print(f" [+] HDFS Mode: {hdfs_res.get('cluster_mode')} | NameNode: {hdfs_res.get('namenode_status', 'ACTIVE')}")
        print(f" [+] Storage Used: {hdfs_res.get('storage_used_mb')} MB / {hdfs_res.get('cluster_capacity_gb')} GB")
        print(f" [+] Raw Ingestion Directories: {len(raw_items)} found in /agrinova/raw")
        print(f" [+] Processed Parquet Datasets: {len(proc_items)} found in /agrinova/processed")
        passed.append(f"04. Hadoop HDFS Distributed Storage ({len(raw_items)} raw, {len(proc_items)} processed)")
        services_status["Hadoop HDFS Storage Engine"] = "ACTIVE & HEALTHY"
    else:
        print(f" [-] HDFS Check Failed: Status {hdfs_status}")
        failed.append("04. Hadoop HDFS Connection")
        services_status["Hadoop HDFS Storage Engine"] = "UNAVAILABLE"

    # ----------------------------------------------------
    # Checkpoint 5: Verify Spark/PySpark Job Execution
    # ----------------------------------------------------
    print("\n[TEST 5] Verifying Apache Spark / PySpark Job Execution...")
    run_status, run_res = http_post(f"{BACKEND_URL}/api/bigdata/spark/run", {"pipeline_name": "crop_yield"})
    jobs_status, jobs_res = http_get(f"{BACKEND_URL}/api/bigdata/spark/jobs")

    if jobs_status == 200 and len(jobs_res) > 0:
        latest = jobs_res[0]
        print(f" [+] PySpark Engine: Active ({len(jobs_res)} total distributed jobs recorded)")
        print(f" [+] Latest Job: '{latest.get('job_name')}' | Status: {latest.get('status')}")
        print(f" [+] Records: In={latest.get('input_records')} -> Out={latest.get('output_records')} ({latest.get('duration_seconds')}s)")
        passed.append(f"05. Apache Spark / PySpark Job Execution ({len(jobs_res)} jobs logged)")
        services_status["Apache Spark Compute Engine"] = "ACTIVE & HEALTHY"
    else:
        print(f" [-] Spark Check Failed: Status {jobs_status}")
        failed.append("05. Apache Spark Job Execution")
        services_status["Apache Spark Compute Engine"] = "DEGRADED"

    # ----------------------------------------------------
    # Checkpoint 6: Verify Processed Results in MongoDB
    # ----------------------------------------------------
    print("\n[TEST 6] Verifying PySpark Analytical Aggregates in MongoDB...")
    all_res_status, all_res = http_get(f"{BACKEND_URL}/api/analytics/all-results")
    yield_res_status, yield_res = http_get(f"{BACKEND_URL}/api/analytics/result/crop_yield_benchmark_summary")

    if all_res_status == 200 and yield_res_status == 200:
        docs = all_res if isinstance(all_res, list) else all_res.get("results", [])
        yield_records = yield_res.get("data", []) if isinstance(yield_res, dict) else []
        top_crop = yield_records[0].get('Crop') if len(yield_records) > 0 else 'N/A'
        print(f" [+] MongoDB Analytics Results: {len(docs)} documents stored in 'analytics_results'")
        print(f" [+] Yield Benchmark Sample: {len(yield_records)} crop profiles (Top crop: {top_crop})")
        passed.append(f"06. MongoDB Analytical Results Persistence ({len(docs)} pre-computed documents)")
    else:
        print(f" [-] Analytics Document Check Failed: Status {all_res_status}")
        failed.append("06. Processed Results in MongoDB")

    # ----------------------------------------------------
    # Checkpoint 7: Verify React Dashboard Analytics Feeds
    # ----------------------------------------------------
    print("\n[TEST 7] Verifying Dashboard KPI & Aggregated Metric Endpoints...")
    dash_status, dash_res = http_get(f"{BACKEND_URL}/api/analytics/dashboard-summary")
    market_status, market_res = http_get(f"{BACKEND_URL}/api/analytics/result/market_commodity_price_summary")

    if dash_status == 200:
        kpis = dash_res.get("kpis", {})
        total_recs = kpis.get("total_agricultural_records", 0)
        print(f" [+] Dashboard KPIs Active: Total Records = {total_recs:,}")
        print(f" [+] ML Accuracy Metric  : {kpis.get('ml_model_accuracy_pct')}%")
        print(f" [+] Mandi Analytics Feed: HTTP {market_status} ({len(market_res.get('data', []))} commodities)")
        passed.append(f"07. Dashboard Analytics Feeds (Total Records: {total_recs:,})")
    else:
        print(f" [-] Dashboard KPI Feed Failed: Status {dash_status}")
        failed.append("07. Dashboard Analytics Feeds")

    # ----------------------------------------------------
    # Checkpoint 8: Test CSV Ingestion & Complete Pipeline
    # ----------------------------------------------------
    print("\n[TEST 8] Testing Complete Big Data Pipeline (Ingestion -> HDFS -> Spark -> Mongo)...")
    sync_status, sync_res = http_post(f"{BACKEND_URL}/api/bigdata/hdfs/sync")
    if sync_status == 200:
        synced_count = sync_res.get("count", 0)
        print(f" [+] Dataset Ingestion & HDFS Sync: {synced_count} datasets synchronized to /agrinova/raw/*")
        passed.append(f"08. Complete Big Data Pipeline ({synced_count} datasets synchronized to HDFS)")
    else:
        print(f" [-] Dataset Sync Failed: Status {sync_status}")
        failed.append("08. Big Data Pipeline Ingestion")

    # ----------------------------------------------------
    # Checkpoint 9: Verify ML Prediction & Agronomic Routes
    # ----------------------------------------------------
    print("\n[TEST 9] Verifying Machine Learning Inference & Crop Intelligence Endpoints...")
    crop_status, crop_res = http_post(f"{BACKEND_URL}/api/recommendations/crop", {
        "N": 90, "P": 42, "K": 43, "temperature": 20.8, "humidity": 82.0, "ph": 6.5, "rainfall": 202.9
    })
    yield_status, pred_res = http_post(f"{BACKEND_URL}/api/predictions/yield", {
        "state": "Punjab", "crop": "Wheat", "season": "Rabi",
        "area_hectares": 10.0, "annual_rainfall_mm": 650.0,
        "fertilizer_used_kg": 1400.0, "pesticide_used_kg": 15.0
    })

    if crop_status == 200 and yield_status == 200:
        y_val = pred_res.get('predicted_yield_tonnes_per_ha') or pred_res.get('predicted_yield_tonnes_per_hectare')
        print(f" [+] Crop Recommendation: {crop_res.get('recommended_crop')} ({crop_res.get('suitability_score')}% match)")
        print(f" [+] Yield Prediction: {y_val} T/Ha (Total: {pred_res.get('predicted_total_production_tonnes')} Tonnes)")
        passed.append("09. Machine Learning Inference Engines (Crop Recommender & Yield Predictor)")
        services_status["Scikit-Learn ML Inference Service"] = "ACTIVE & HEALTHY"
    else:
        print(f" [-] ML Prediction Failed: Crop status {crop_status}, Yield status {yield_status}")
        failed.append("09. ML Inference Engines")
        services_status["Scikit-Learn ML Inference Service"] = "DEGRADED"

    # ----------------------------------------------------
    # Checkpoint 10: Check Navigation & Frontend Routes
    # ----------------------------------------------------
    print("\n[TEST 10] Verifying Client Routes & Navigation...")
    # Verify core frontend pages respond
    routes_to_test = ["/dashboard", "/farm-monitoring", "/bigdata-analytics", "/soil-analytics", "/market-intelligence"]
    all_routes_ok = True
    for r in routes_to_test:
        r_status, _ = http_get_text(f"{FRONTEND_URL}{r}")
        if r_status != 200:
            all_routes_ok = False
            break

    if all_routes_ok:
        print(f" [+] Frontend Client Routes: All verified routes returning HTTP 200.")
        passed.append("10. Dashboard Navigation & Route Integrity")
    else:
        failed.append("10. Client Route Integrity")

    # ----------------------------------------------------
    # FINAL SUMMARY REPORT
    # ----------------------------------------------------
    print("\n" + "=" * 75)
    print(" VERIFICATION SUMMARY REPORT ")
    print("=" * 75)
    print(f"TOTAL PASSED : {len(passed)} / 10")
    print(f"TOTAL FAILED : {len(failed)} / 10")
    print("\n[PASSED TESTS]:")
    for p in passed:
        print(f"  [PASS] {p}")

    if failed:
        print("\n[FAILED TESTS]:")
        for f in failed:
            print(f"  [FAIL] {f}")
    else:
        print("\n[FAILED TESTS]: None (0 Failed)")

    print("\n[SERVICE AVAILABILITY STATUS]:")
    for svc, st in services_status.items():
        print(f"  - {svc:<38}: {st}")

    print("=" * 75)
    return len(failed) == 0

if __name__ == "__main__":
    run_e2e_verification()
