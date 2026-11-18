"""
AgriNova Pydantic Request & Response Data Schemas
Enforces strict type validation, field constraints, and Swagger schemas across all 17 routers.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# 1. AUTHENTICATION & USERS
class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    role: str = Field(default="farmer", pattern="^(farmer|admin)$")
    phone: Optional[str] = None
    state: Optional[str] = "Punjab"
    district: Optional[str] = "Ludhiana"

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

# 2. CROP RECOMMENDATION
class CropRecommendationRequest(BaseModel):
    N: float = Field(..., ge=0, le=250, description="Nitrogen content in soil (kg/ha)")
    P: float = Field(..., ge=0, le=200, description="Phosphorus content in soil (kg/ha)")
    K: float = Field(..., ge=0, le=250, description="Potassium content in soil (kg/ha)")
    temperature: float = Field(..., ge=5, le=55, description="Ambient temperature (°C)")
    humidity: float = Field(..., ge=10, le=100, description="Relative humidity (%)")
    ph: float = Field(..., ge=3.5, le=10.0, description="Soil pH value")
    rainfall: float = Field(..., ge=0, le=500, description="Rainfall accumulation (mm)")

# 3. CROP YIELD PREDICTION
class YieldPredictionRequest(BaseModel):
    state: str = Field(..., description="Agro-ecological State")
    crop: str = Field(..., description="Crop Variety")
    season: str = Field(..., description="Cropping Season: Kharif, Rabi, Summer, Whole Year")
    area_hectares: float = Field(..., gt=0, description="Cultivated Land in Hectares")
    annual_rainfall_mm: float = Field(..., ge=100, le=3000, description="Annual District Rainfall (mm)")
    fertilizer_used_kg: float = Field(..., ge=0, description="Total Fertilizer Applied (kg)")
    pesticide_used_kg: float = Field(..., ge=0, description="Total Pesticide Applied (kg)")

# 4. FERTILIZER RECOMMENDATION
class FertilizerRecommendationRequest(BaseModel):
    crop: str
    current_n: float = Field(..., ge=0)
    current_p: float = Field(..., ge=0)
    current_k: float = Field(..., ge=0)
    soil_ph: float = Field(..., ge=3.5, le=10.0)
    land_acres: float = Field(default=1.0, gt=0)

# 5. DISEASE DETECTION
class DiseaseDetectionRequest(BaseModel):
    crop: str = Field(..., description="Crop category: Potato, Tomato, Rice, Maize, etc.")
    symptom_description: Optional[str] = "Visible leaf lesions and yellowing"
    image_base64: Optional[str] = None

# 6. COPILOT
class CopilotRequest(BaseModel):
    question: str = Field(..., min_length=2)
    context: Optional[Dict[str, Any]] = None

# 7. SOIL RECORD
class SoilRecordCreate(BaseModel):
    state: str
    district: str
    soil_type: str
    nitrogen_kg_ha: float
    phosphorus_kg_ha: float
    potassium_kg_ha: float
    soil_ph: float
    electrical_conductivity: float
    organic_carbon_pct: float
    moisture_pct: float

# 8. FEEDBACK
class FeedbackCreate(BaseModel):
    name: str
    email: EmailStr
    rating: int = Field(..., ge=1, le=5)
    category: str
    comments: str

# 9. PIPELINE TRIGGER
class PipelineRunRequest(BaseModel):
    pipeline_name: Optional[str] = "ALL"
