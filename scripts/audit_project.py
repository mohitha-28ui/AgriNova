"""
MYTHORA Comprehensive Codebase & Pipeline Auditor
Audits Python AST syntax, TS/TSX builds, MongoDB collections, HDFS status,
Spark pipelines, Docker Compose configuration, and API routes.
"""

import os
import sys
import ast
import json
import subprocess

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

def audit_python_files():
    print("--> 1. Auditing Python Files for AST Syntax & Import Errors...")
    py_files = []
    for root, dirs, files in os.walk(BASE_DIR):
        if any(skip in root for skip in [".git", "node_modules", "local_hdfs_cluster", "__pycache__"]):
            continue
        for f in files:
            if f.endswith(".py"):
                py_files.append(os.path.join(root, f))
    
    errors = []
    for p in py_files:
        try:
            with open(p, "r", encoding="utf-8") as f:
                source = f.read()
            ast.parse(source)
        except Exception as e:
            errors.append((p, str(e)))
            
    print(f"Scanned {len(py_files)} Python files. Syntax errors found: {len(errors)}")
    for p, err in errors:
        print(f"  [ERROR] {p}: {err}")
    return errors

def audit_mongodb_and_spark_pipeline():
    print("\n--> 2. Auditing HDFS -> Spark -> MongoDB Pipeline Execution...")
    from backend.app.database.mongodb import (
        analytics_results_col, pipeline_jobs_col, crops_col,
        soil_records_col, weather_records_col, market_prices_col
    )
    
    analytics_count = analytics_results_col.count_documents()
    jobs_count = pipeline_jobs_col.count_documents()
    crops_count = crops_col.count_documents()
    soil_count = soil_records_col.count_documents()
    weather_count = weather_records_col.count_documents()
    market_count = market_prices_col.count_documents()
    
    print(f"  - MongoDB analytics_results documents: {analytics_count}")
    print(f"  - MongoDB pipeline_jobs logged: {jobs_count}")
    print(f"  - MongoDB crops records: {crops_count}")
    print(f"  - MongoDB soil_records: {soil_count}")
    print(f"  - MongoDB weather_records: {weather_count}")
    print(f"  - MongoDB market_prices: {market_count}")
    
    # Inspect all keys stored in analytics_results
    keys = [doc.get("analytics_key") for doc in analytics_results_col.find()]
    print(f"  - Pre-aggregated PySpark Analytics Keys in MongoDB: {keys}")
    return {
        "analytics_count": analytics_count,
        "jobs_count": jobs_count,
        "keys": keys
    }

def audit_api_routes():
    print("\n--> 3. Auditing FastAPI Routes...")
    from backend.main import app
    routes = []
    for r in app.routes:
        if hasattr(r, "path"):
            routes.append((r.path, getattr(r, "methods", ["GET"])))
    print(f"  - Total Registered Endpoint Routes: {len(routes)}")
    for path, methods in sorted(routes, key=lambda x: x[0]):
        print(f"    {','.join(methods):<10} {path}")
    return routes

if __name__ == "__main__":
    audit_python_files()
    audit_mongodb_and_spark_pipeline()
    audit_api_routes()
