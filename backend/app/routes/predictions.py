"""
MYTHORA Crop Yield Prediction Router
"""

from fastapi import APIRouter
from backend.app.schemas.schemas import YieldPredictionRequest
from backend.app.services.ml_service import ml_service
from backend.app.database.mongodb import yield_predictions_col

router = APIRouter(prefix="/predictions", tags=["Yield Prediction & Productivity"])

@router.post("/yield")
def predict_crop_yield(req: YieldPredictionRequest):
    result = ml_service.predict_yield(
        state=req.state,
        crop=req.crop,
        season=req.season,
        area_hectares=req.area_hectares,
        annual_rainfall_mm=req.annual_rainfall_mm,
        fertilizer_used_kg=req.fertilizer_used_kg,
        pesticide_used_kg=req.pesticide_used_kg
    )
    yield_predictions_col.insert_one(result)
    return result

@router.get("/history/yield")
def get_yield_prediction_history(limit: int = 20):
    return yield_predictions_col.find({}, limit=limit, sort=[("timestamp", -1)])
