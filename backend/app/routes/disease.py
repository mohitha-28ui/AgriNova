"""
MYTHORA Plant Disease Detection Router
"""

from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from backend.app.schemas.schemas import DiseaseDetectionRequest
from backend.app.services.ml_service import ml_service
from backend.app.database.mongodb import disease_detection_col

router = APIRouter(prefix="/disease", tags=["Computer Vision Disease Detection"])

@router.post("/diagnose")
def diagnose_disease(req: DiseaseDetectionRequest):
    result = ml_service.diagnose_disease(
        crop=req.crop,
        symptom_description=req.symptom_description or "General leaf spots"
    )
    disease_detection_col.insert_one(result)
    return result

@router.post("/upload")
async def upload_leaf_image(
    crop: str = Form("Potato"),
    symptoms: Optional[str] = Form("Water soaked spots"),
    file: UploadFile = File(...)
):
    result = ml_service.diagnose_disease(
        crop=crop,
        symptom_description=symptoms,
        filename=file.filename
    )
    disease_detection_col.insert_one(result)
    return result

@router.get("/history")
def get_disease_detection_history(limit: int = 20):
    return disease_detection_col.find({}, limit=limit, sort=[("diagnosed_at", -1)])
