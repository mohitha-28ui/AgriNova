
"""
AgriNova Main FastAPI Application Entrypoint
AgriNova – AI and Big Data Platform for Smart Agriculture
Tagline: Smart Farming, Better Tomorrow.
"""

import os
import sys
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, FileResponse
from fastapi.staticfiles import StaticFiles

# --------------------------------------------------
# PROJECT PATH CONFIGURATION
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

FRONTEND_DIST_DIR = os.path.join(BASE_DIR, "frontend", "dist")
FRONTEND_ASSETS_DIR = os.path.join(FRONTEND_DIST_DIR, "assets")

# --------------------------------------------------
# DATABASE AND ROUTER IMPORTS
# --------------------------------------------------

from backend.app.database.mongodb import db_manager

from backend.app.routes import (
    auth,
    recommendations,
    predictions,
    disease,
    copilot,
    bigdata,
    agriculture,
    analytics,
    admin,
    sql_modules,
)

# --------------------------------------------------
# FASTAPI APPLICATION
# --------------------------------------------------

app = FastAPI(
    title="AgriNova – AI and Big Data Platform for Smart Agriculture",
    description="""
    ## AgriNova Production REST API

    **Smart Farming, Better Tomorrow.**

    Enterprise AI and Big Data platform integrating:

    - Hadoop HDFS: Distributed File System storage
    - Apache Spark & PySpark: Distributed ETL and analytics
    - Apache Kafka: Real-time agro-telemetry streaming
    - MongoDB Atlas & SQL Engine: Data persistence
    - Machine Learning: Crop recommendation and yield prediction
    - Computer Vision: Crop disease diagnosis
    - AI Farming Copilot: Intelligent farming assistant
    """,
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# --------------------------------------------------
# CORS CONFIGURATION
# --------------------------------------------------

cors_env = os.getenv("CORS_ALLOWED_ORIGINS", "").strip()

if cors_env:
    origins = [
        origin.strip()
        for origin in cors_env.split(",")
        if origin.strip()
    ]
else:
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

# Wildcard origins cannot safely use credentialed CORS.
if "*" in origins:
    origins = ["*"]
    allow_credentials = False
else:
    allow_credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# DATABASE STARTUP
# --------------------------------------------------

@app.on_event("startup")
def on_startup():
    """Initialize database seed data when the application starts."""
    db_manager.auto_seed_initial_data()


# --------------------------------------------------
# API ROUTERS
# --------------------------------------------------

app.include_router(auth.router, prefix="/api")
app.include_router(recommendations.router, prefix="/api")
app.include_router(predictions.router, prefix="/api")
app.include_router(disease.router, prefix="/api")
app.include_router(copilot.router, prefix="/api")
app.include_router(bigdata.router, prefix="/api")
app.include_router(agriculture.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(sql_modules.router, prefix="/api")


# --------------------------------------------------
# FRONTEND STATIC ASSETS
# --------------------------------------------------

if os.path.isdir(FRONTEND_ASSETS_DIR):
    app.mount(
        "/assets",
        StaticFiles(directory=FRONTEND_ASSETS_DIR),
        name="static-assets",
    )


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/api/health", tags=["System Health"])
def health():
    """Unified application health endpoint."""

    db_info = db_manager.check_health()

    return {
        "status": "HEALTHY",
        "service": "AgriNova Single-Container Production Service",
        "platform": "AgriNova – AI and Big Data Platform for Smart Agriculture",
        "tagline": "Smart Farming, Better Tomorrow.",
        "database": db_info,
        "frontend_mounted": os.path.isfile(
            os.path.join(FRONTEND_DIST_DIR, "index.html")
        ),
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.get("/api/ping", tags=["System Health"])
def ping():
    return {
        "status": "pong",
        "message": "AgriNova API is live and responsive",
        "tagline": "Smart Farming, Better Tomorrow.",
    }


# --------------------------------------------------
# FRONTEND SPA ROUTING
# --------------------------------------------------

@app.get("/", include_in_schema=False)
def serve_homepage():
    index_file = os.path.join(FRONTEND_DIST_DIR, "index.html")

    if os.path.isfile(index_file):
        return FileResponse(index_file)

    return RedirectResponse(url="/api/docs")


@app.get("/{full_path:path}", include_in_schema=False)
def serve_spa_frontend(full_path: str):

    # Do not redirect unknown API endpoints to frontend.
    if full_path == "api" or full_path.startswith("api/"):
        raise HTTPException(
            status_code=404,
            detail="API endpoint not found",
        )

    # Serve existing frontend files safely.
    candidate_file = os.path.abspath(
        os.path.join(FRONTEND_DIST_DIR, full_path)
    )

    dist_root = os.path.abspath(FRONTEND_DIST_DIR)

    try:
        is_inside_dist = (
            os.path.commonpath([dist_root, candidate_file]) == dist_root
        )
    except ValueError:
        is_inside_dist = False

    if is_inside_dist and os.path.isfile(candidate_file):
        return FileResponse(candidate_file)

    # React/Vite client-side routing fallback.
    index_file = os.path.join(FRONTEND_DIST_DIR, "index.html")

    if os.path.isfile(index_file):
        return FileResponse(index_file)

    return RedirectResponse(url="/api/docs")


# --------------------------------------------------
# LOCAL DEVELOPMENT SERVER
# --------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))

    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
    )
