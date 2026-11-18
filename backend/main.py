"""
AgriNova Main FastAPI Application Entrypoint
AI-Powered Big Data Intelligence Platform for Smart Agriculture
"""

import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from backend.app.routes import (
    auth, recommendations, predictions, disease,
    copilot, bigdata, agriculture, analytics, admin
)

app = FastAPI(
    title="AgriNova Smart Agriculture Big Data Intelligence Platform",
    description="""
    ## AgriNova Production REST API
    Enterprise Big Data platform integrating:
    - **Hadoop HDFS**: Distributed File System storage & WebHDFS management
    - **Apache Spark & PySpark**: Distributed ETL, feature engineering, and analytics
    - **Apache Kafka**: Real-time agro-telemetry event streaming
    - **MongoDB**: Operational records and aggregated analytical document storage
    - **Machine Learning**: Random Forest Crop Recommender, Gradient Boosting Yield Predictor, Computer Vision Disease Diagnosis
    - **AI Farming Copilot**: Agronomic intelligent conversational assistant
    """,
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(recommendations.router, prefix="/api")
app.include_router(predictions.router, prefix="/api")
app.include_router(disease.router, prefix="/api")
app.include_router(copilot.router, prefix="/api")
app.include_router(bigdata.router, prefix="/api")
app.include_router(agriculture.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/api/docs")

@app.get("/api/ping")
def ping():
    return {"status": "pong", "message": "AgriNova API is live and responsive"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
