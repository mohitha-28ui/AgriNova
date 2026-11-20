"""
MYTHORA Recommendations Router (Crop & Fertilizer)
"""

from fastapi import APIRouter
from backend.app.schemas.schemas import (
    CropRecommendationRequest, FertilizerRecommendationRequest
)
from backend.app.services.ml_service import ml_service
from backend.app.database.mongodb import crop_recommendations_col, fertilizer_recommendations_col

router = APIRouter(prefix="/recommendations", tags=["Smart Agricultural Recommendations"])

@router.post("/crop")
def recommend_crop(req: CropRecommendationRequest):
    result = ml_service.predict_crop(
        N=req.N, P=req.P, K=req.K,
        temperature=req.temperature,
        humidity=req.humidity,
        ph=req.ph,
        rainfall=req.rainfall
    )
    # Record recommendation in MongoDB
    crop_recommendations_col.insert_one(result)
    return result

@router.post("/fertilizer")
def recommend_fertilizer(req: FertilizerRecommendationRequest):
    result = ml_service.recommend_fertilizer(
        crop=req.crop,
        current_n=req.current_n,
        current_p=req.current_p,
        current_k=req.current_k,
        soil_ph=req.soil_ph,
        land_acres=req.land_acres
    )
    fertilizer_recommendations_col.insert_one(result)
    return result

@router.get("/history/crop")
def get_crop_recommendation_history(limit: int = 20):
    return crop_recommendations_col.find({}, limit=limit, sort=[("timestamp", -1)])

@router.get("/history/fertilizer")
def get_fertilizer_recommendation_history(limit: int = 20):
    return fertilizer_recommendations_col.find({}, limit=limit, sort=[("timestamp", -1)])
