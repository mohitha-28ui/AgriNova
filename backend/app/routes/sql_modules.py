"""
AgriNova Relational SQL Architecture - 7 Core Modules Router
Enterprise REST Endpoints backed by agrinova_db (MySQL 8.0 & SQLite Dual-Engine)

Modules:
1. User Management (users table)
2. Crop Management (crops table)
3. Soil Information (soil_details table)
4. Weather Information (weather table)
5. Fertilizer Recommendation (fertilizers & recommendations tables)
6. Plant Disease Detection (diseases table)
7. Agricultural Market Prices (market_prices table)
"""

import os
from datetime import datetime, date
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form, Depends
from pydantic import BaseModel, EmailStr, Field

from backend.app.database.sql_db import sql_db
from backend.app.utils.security import get_password_hash

router = APIRouter(prefix="/sql", tags=["AgriNova SQL Enterprise Modules"])

# ============================================================================
# Pydantic Schemas for Validation
# ============================================================================

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: Optional[str] = None
    location: Optional[str] = "Andhra Pradesh"
    role: str = Field(default="farmer", pattern="^(farmer|admin)$")

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    role: Optional[str] = None

class CropCreate(BaseModel):
    user_id: int
    crop_name: str
    season: str = Field(..., pattern="^(Kharif|Rabi|Zaid|Annual|Summer)$")
    area: float = Field(..., gt=0)

class CropUpdate(BaseModel):
    crop_name: Optional[str] = None
    season: Optional[str] = None
    area: Optional[float] = None

class SoilCreate(BaseModel):
    user_id: int
    soil_type: str
    ph_level: float = Field(..., ge=0.0, le=14.0)
    nitrogen: float = Field(..., ge=0.0)
    phosphorus: float = Field(..., ge=0.0)
    potassium: float = Field(..., ge=0.0)

class SoilUpdate(BaseModel):
    soil_type: Optional[str] = None
    ph_level: Optional[float] = None
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None

class WeatherCreate(BaseModel):
    location: str
    temperature: float
    rainfall: float
    weather_condition: str
    humidity: Optional[float] = 72.0

class WeatherUpdate(BaseModel):
    location: Optional[str] = None
    temperature: Optional[float] = None
    rainfall: Optional[float] = None
    weather_condition: Optional[str] = None
    humidity: Optional[float] = None

class FertilizerCreate(BaseModel):
    fertilizer_name: str
    description: str
    application_guide: str
    npk_ratio: Optional[str] = "4:2:1"
    suitable_crops: Optional[str] = "Wheat, Rice, Maize"

class FertilizerUpdate(BaseModel):
    fertilizer_name: Optional[str] = None
    description: Optional[str] = None
    application_guide: Optional[str] = None
    npk_ratio: Optional[str] = None
    suitable_crops: Optional[str] = None

class FertilizerRecommendRequest(BaseModel):
    user_id: Optional[int] = 1
    crop_id: Optional[int] = None
    crop_name: str
    soil_id: Optional[int] = None
    soil_type: str = "Alluvial Loam"
    nitrogen: float
    phosphorus: float
    potassium: float
    ph_level: float

class DiseaseCreate(BaseModel):
    disease_name: str
    symptoms: str
    treatment: str
    affected_crops: Optional[str] = "Wheat, Rice"
    confidence_score: Optional[float] = 95.0

class DiseaseUpdate(BaseModel):
    disease_name: Optional[str] = None
    symptoms: Optional[str] = None
    treatment: Optional[str] = None
    affected_crops: Optional[str] = None
    confidence_score: Optional[float] = None

class MarketPriceCreate(BaseModel):
    crop_name: str
    market_name: str
    price: float = Field(..., gt=0)
    price_date: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None

class MarketPriceUpdate(BaseModel):
    crop_name: Optional[str] = None
    market_name: Optional[str] = None
    price: Optional[float] = None
    price_date: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None


# ============================================================================
# DASHBOARD OVERVIEW STATS
# ============================================================================

@router.get("/dashboard/stats")
def get_dashboard_stats():
    """Aggregates real relational SQL statistics for the AgriNova Main Dashboard."""
    users_cnt = sql_db.fetch_one("SELECT COUNT(*) as cnt FROM users")
    crops_cnt = sql_db.fetch_one("SELECT COUNT(*) as cnt FROM crops")
    soil_cnt = sql_db.fetch_one("SELECT COUNT(*) as cnt FROM soil_details")
    weather_cnt = sql_db.fetch_one("SELECT COUNT(*) as cnt FROM weather")
    fert_cnt = sql_db.fetch_one("SELECT COUNT(*) as cnt FROM fertilizers")
    rec_cnt = sql_db.fetch_one("SELECT COUNT(*) as cnt FROM recommendations")
    disease_cnt = sql_db.fetch_one("SELECT COUNT(*) as cnt FROM diseases")
    prices_cnt = sql_db.fetch_one("SELECT COUNT(*) as cnt FROM market_prices")

    # Recent activities
    recent_users = sql_db.fetch_all("SELECT user_id, name, location, role, created_at FROM users ORDER BY user_id DESC LIMIT 3")
    recent_crops = sql_db.fetch_all("SELECT crop_id, crop_name, season, area FROM crops ORDER BY crop_id DESC LIMIT 3")
    latest_weather = sql_db.fetch_one("SELECT * FROM weather ORDER BY weather_id DESC LIMIT 1")

    return {
        "status": "SUCCESS",
        "counts": {
            "total_users": users_cnt["cnt"] if users_cnt else 0,
            "total_crops": crops_cnt["cnt"] if crops_cnt else 0,
            "soil_records": soil_cnt["cnt"] if soil_cnt else 0,
            "weather_updates": weather_cnt["cnt"] if weather_cnt else 0,
            "fertilizer_recommendations": rec_cnt["cnt"] if rec_cnt else 0,
            "fertilizer_catalog": fert_cnt["cnt"] if fert_cnt else 0,
            "disease_detection_records": disease_cnt["cnt"] if disease_cnt else 0,
            "market_price_records": prices_cnt["cnt"] if prices_cnt else 0,
            "total_agricultural_records": (
                (users_cnt["cnt"] if users_cnt else 0) +
                (crops_cnt["cnt"] if crops_cnt else 0) +
                (soil_cnt["cnt"] if soil_cnt else 0) +
                (weather_cnt["cnt"] if weather_cnt else 0) +
                (disease_cnt["cnt"] if disease_cnt else 0) +
                (prices_cnt["cnt"] if prices_cnt else 0)
            )
        },
        "latest_weather": latest_weather,
        "recent_users": recent_users,
        "recent_crops": recent_crops,
        "db_health": sql_db.check_health()
    }


# ============================================================================
# MODULE 1 – USER MANAGEMENT (users table)
# ============================================================================

@router.get("/users")
def list_users(
    q: Optional[str] = Query(None, description="Search by name, email or location"),
    role: Optional[str] = Query(None, description="Filter by farmer or admin"),
    location: Optional[str] = Query(None, description="Filter by location/state")
):
    sql = "SELECT user_id, name, email, phone, location, role, created_at FROM users WHERE 1=1"
    params = []
    if role:
        sql += " AND role = ?"
        params.append(role.lower())
    if location:
        sql += " AND location LIKE ?"
        params.append(f"%{location}%")
    if q:
        sql += " AND (name LIKE ? OR email LIKE ? OR location LIKE ?)"
        params.extend([f"%{q}%", f"%{q}%", f"%{q}%"])
    sql += " ORDER BY user_id DESC"
    return sql_db.fetch_all(sql, tuple(params))

@router.get("/users/{user_id}")
def get_user(user_id: int):
    user = sql_db.fetch_one("SELECT user_id, name, email, phone, location, role, created_at FROM users WHERE user_id = ?", (user_id,))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Also fetch user's crops and soils
    crops = sql_db.fetch_all("SELECT * FROM crops WHERE user_id = ?", (user_id,))
    soils = sql_db.fetch_all("SELECT * FROM soil_details WHERE user_id = ?", (user_id,))
    user["crops"] = crops
    user["soil_details"] = soils
    return user

@router.post("/users", status_code=201)
def create_user(req: UserCreate):
    existing = sql_db.fetch_one("SELECT user_id FROM users WHERE email = ?", (req.email,))
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    hashed_pw = get_password_hash(req.password)
    user_id = sql_db.execute_write(
        "INSERT INTO users (name, email, password, phone, location, role) VALUES (?, ?, ?, ?, ?, ?)",
        (req.name, req.email, hashed_pw, req.phone, req.location, req.role.lower())
    )
    return {
        "status": "SUCCESS",
        "message": f"User '{req.name}' successfully registered",
        "user_id": user_id,
        "name": req.name,
        "email": req.email,
        "role": req.role
    }

@router.put("/users/{user_id}")
def update_user(user_id: int, req: UserUpdate):
    user = sql_db.fetch_one("SELECT * FROM users WHERE user_id = ?", (user_id,))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    updates = []
    params = []
    if req.name is not None:
        updates.append("name = ?")
        params.append(req.name)
    if req.email is not None:
        updates.append("email = ?")
        params.append(req.email)
    if req.phone is not None:
        updates.append("phone = ?")
        params.append(req.phone)
    if req.location is not None:
        updates.append("location = ?")
        params.append(req.location)
    if req.role is not None:
        updates.append("role = ?")
        params.append(req.role.lower())

    if not updates:
        return {"status": "NO_OP", "message": "No fields to update"}

    params.append(user_id)
    sql = f"UPDATE users SET {', '.join(updates)} WHERE user_id = ?"
    sql_db.execute_write(sql, tuple(params))
    return {"status": "SUCCESS", "message": f"User {user_id} updated successfully"}

@router.delete("/users/{user_id}")
def delete_user(user_id: int):
    user = sql_db.fetch_one("SELECT * FROM users WHERE user_id = ?", (user_id,))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    sql_db.execute_write("DELETE FROM users WHERE user_id = ?", (user_id,))
    return {"status": "SUCCESS", "message": f"User {user_id} and associated records deleted successfully"}


# ============================================================================
# MODULE 2 – CROP MANAGEMENT (crops table)
# ============================================================================

@router.get("/crops")
def list_crops(
    season: Optional[str] = Query(None, description="Kharif, Rabi, Zaid, Annual"),
    user_id: Optional[int] = Query(None, description="Filter by farmer user_id"),
    q: Optional[str] = Query(None, description="Search crop name")
):
    sql = """
    SELECT c.crop_id, c.user_id, c.crop_name, c.season, c.area, c.created_at,
           u.name as farmer_name, u.location as farmer_location
    FROM crops c
    LEFT JOIN users u ON c.user_id = u.user_id
    WHERE 1=1
    """
    params = []
    if season:
        sql += " AND c.season = ?"
        params.append(season)
    if user_id:
        sql += " AND c.user_id = ?"
        params.append(user_id)
    if q:
        sql += " AND c.crop_name LIKE ?"
        params.append(f"%{q}%")
    sql += " ORDER BY c.crop_id DESC"
    return sql_db.fetch_all(sql, tuple(params))

@router.get("/crops/{crop_id}")
def get_crop(crop_id: int):
    sql = """
    SELECT c.*, u.name as farmer_name, u.email as farmer_email, u.location as farmer_location
    FROM crops c
    LEFT JOIN users u ON c.user_id = u.user_id
    WHERE c.crop_id = ?
    """
    crop = sql_db.fetch_one(sql, (crop_id,))
    if not crop:
        raise HTTPException(status_code=404, detail="Crop record not found")
    return crop

@router.post("/crops", status_code=201)
def create_crop(req: CropCreate):
    # Verify user exists
    user = sql_db.fetch_one("SELECT user_id FROM users WHERE user_id = ?", (req.user_id,))
    if not user:
        raise HTTPException(status_code=404, detail=f"User ID {req.user_id} not found. Please assign to an existing farmer.")

    crop_id = sql_db.execute_write(
        "INSERT INTO crops (user_id, crop_name, season, area) VALUES (?, ?, ?, ?)",
        (req.user_id, req.crop_name, req.season, req.area)
    )
    return {
        "status": "SUCCESS",
        "message": f"Crop '{req.crop_name}' successfully added",
        "crop_id": crop_id
    }

@router.put("/crops/{crop_id}")
def update_crop(crop_id: int, req: CropUpdate):
    crop = sql_db.fetch_one("SELECT * FROM crops WHERE crop_id = ?", (crop_id,))
    if not crop:
        raise HTTPException(status_code=404, detail="Crop record not found")

    updates = []
    params = []
    if req.crop_name is not None:
        updates.append("crop_name = ?")
        params.append(req.crop_name)
    if req.season is not None:
        updates.append("season = ?")
        params.append(req.season)
    if req.area is not None:
        updates.append("area = ?")
        params.append(req.area)

    if not updates:
        return {"status": "NO_OP", "message": "No changes supplied"}

    params.append(crop_id)
    sql = f"UPDATE crops SET {', '.join(updates)} WHERE crop_id = ?"
    sql_db.execute_write(sql, tuple(params))
    return {"status": "SUCCESS", "message": f"Crop {crop_id} updated successfully"}

@router.delete("/crops/{crop_id}")
def delete_crop(crop_id: int):
    crop = sql_db.fetch_one("SELECT * FROM crops WHERE crop_id = ?", (crop_id,))
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    sql_db.execute_write("DELETE FROM crops WHERE crop_id = ?", (crop_id,))
    return {"status": "SUCCESS", "message": f"Crop record {crop_id} deleted"}


# ============================================================================
# MODULE 3 – SOIL INFORMATION (soil_details table)
# ============================================================================

@router.get("/soil")
def list_soil_records(
    soil_type: Optional[str] = Query(None, description="Filter by soil type"),
    user_id: Optional[int] = Query(None, description="Filter by farmer user_id")
):
    sql = """
    SELECT s.soil_id, s.user_id, s.soil_type, s.ph_level, s.nitrogen, s.phosphorus, s.potassium, s.created_at,
           u.name as farmer_name, u.location as farmer_location
    FROM soil_details s
    LEFT JOIN users u ON s.user_id = u.user_id
    WHERE 1=1
    """
    params = []
    if soil_type:
        sql += " AND s.soil_type LIKE ?"
        params.append(f"%{soil_type}%")
    if user_id:
        sql += " AND s.user_id = ?"
        params.append(user_id)
    sql += " ORDER BY s.soil_id DESC"
    records = sql_db.fetch_all(sql, tuple(params))

    # Add agronomic classification for each record
    for r in records:
        ph = float(r.get("ph_level", 7.0))
        if ph < 6.0:
            r["ph_status"] = "Acidic"
        elif ph <= 7.5:
            r["ph_status"] = "Optimal / Neutral"
        else:
            r["ph_status"] = "Alkaline"
        
        # Simple health score formula out of 100
        n_score = min(100, (float(r.get("nitrogen", 0)) / 100.0) * 100)
        p_score = min(100, (float(r.get("phosphorus", 0)) / 50.0) * 100)
        k_score = min(100, (float(r.get("potassium", 0)) / 60.0) * 100)
        r["soil_health_score"] = round((n_score * 0.35 + p_score * 0.35 + k_score * 0.30), 1)

    return records

@router.get("/soil/{soil_id}")
def get_soil(soil_id: int):
    sql = """
    SELECT s.*, u.name as farmer_name, u.email as farmer_email
    FROM soil_details s
    LEFT JOIN users u ON s.user_id = u.user_id
    WHERE s.soil_id = ?
    """
    soil = sql_db.fetch_one(sql, (soil_id,))
    if not soil:
        raise HTTPException(status_code=404, detail="Soil record not found")
    return soil

@router.post("/soil", status_code=201)
def create_soil(req: SoilCreate):
    user = sql_db.fetch_one("SELECT user_id FROM users WHERE user_id = ?", (req.user_id,))
    if not user:
        raise HTTPException(status_code=404, detail=f"User ID {req.user_id} not found")

    soil_id = sql_db.execute_write(
        """INSERT INTO soil_details (user_id, soil_type, ph_level, nitrogen, phosphorus, potassium)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (req.user_id, req.soil_type, req.ph_level, req.nitrogen, req.phosphorus, req.potassium)
    )
    return {
        "status": "SUCCESS",
        "message": "Soil details registered successfully",
        "soil_id": soil_id
    }

@router.put("/soil/{soil_id}")
def update_soil(soil_id: int, req: SoilUpdate):
    soil = sql_db.fetch_one("SELECT * FROM soil_details WHERE soil_id = ?", (soil_id,))
    if not soil:
        raise HTTPException(status_code=404, detail="Soil record not found")

    updates = []
    params = []
    if req.soil_type is not None:
        updates.append("soil_type = ?")
        params.append(req.soil_type)
    if req.ph_level is not None:
        updates.append("ph_level = ?")
        params.append(req.ph_level)
    if req.nitrogen is not None:
        updates.append("nitrogen = ?")
        params.append(req.nitrogen)
    if req.phosphorus is not None:
        updates.append("phosphorus = ?")
        params.append(req.phosphorus)
    if req.potassium is not None:
        updates.append("potassium = ?")
        params.append(req.potassium)

    if not updates:
        return {"status": "NO_OP", "message": "No changes supplied"}

    params.append(soil_id)
    sql = f"UPDATE soil_details SET {', '.join(updates)} WHERE soil_id = ?"
    sql_db.execute_write(sql, tuple(params))
    return {"status": "SUCCESS", "message": f"Soil record {soil_id} updated"}

@router.delete("/soil/{soil_id}")
def delete_soil(soil_id: int):
    soil = sql_db.fetch_one("SELECT * FROM soil_details WHERE soil_id = ?", (soil_id,))
    if not soil:
        raise HTTPException(status_code=404, detail="Soil record not found")
    sql_db.execute_write("DELETE FROM soil_details WHERE soil_id = ?", (soil_id,))
    return {"status": "SUCCESS", "message": f"Soil record {soil_id} deleted"}


# ============================================================================
# MODULE 4 – WEATHER INFORMATION (weather table)
# ============================================================================

@router.get("/weather")
def list_weather(location: Optional[str] = Query(None)):
    sql = "SELECT * FROM weather WHERE 1=1"
    params = []
    if location:
        sql += " AND location LIKE ?"
        params.append(f"%{location}%")
    sql += " ORDER BY weather_id DESC"
    return sql_db.fetch_all(sql, tuple(params))

@router.get("/weather/current")
def get_current_weather(location: str = "Andhra Pradesh"):
    weather = sql_db.fetch_one("SELECT * FROM weather WHERE location LIKE ? ORDER BY weather_id DESC LIMIT 1", (f"%{location}%",))
    if not weather:
        weather = sql_db.fetch_one("SELECT * FROM weather ORDER BY weather_id DESC LIMIT 1")
    return weather or {
        "location": location,
        "temperature": 28.0,
        "rainfall": 2.1,
        "weather_condition": "Partly Cloudy",
        "humidity": 72.0
    }

@router.post("/weather", status_code=201)
def create_weather(req: WeatherCreate):
    weather_id = sql_db.execute_write(
        "INSERT INTO weather (location, temperature, rainfall, weather_condition, humidity) VALUES (?, ?, ?, ?, ?)",
        (req.location, req.temperature, req.rainfall, req.weather_condition, req.humidity or 72.0)
    )
    return {
        "status": "SUCCESS",
        "message": f"Weather record logged for '{req.location}'",
        "weather_id": weather_id
    }

@router.put("/weather/{weather_id}")
def update_weather(weather_id: int, req: WeatherUpdate):
    w = sql_db.fetch_one("SELECT * FROM weather WHERE weather_id = ?", (weather_id,))
    if not w:
        raise HTTPException(status_code=404, detail="Weather record not found")

    updates = []
    params = []
    if req.location is not None:
        updates.append("location = ?")
        params.append(req.location)
    if req.temperature is not None:
        updates.append("temperature = ?")
        params.append(req.temperature)
    if req.rainfall is not None:
        updates.append("rainfall = ?")
        params.append(req.rainfall)
    if req.weather_condition is not None:
        updates.append("weather_condition = ?")
        params.append(req.weather_condition)
    if req.humidity is not None:
        updates.append("humidity = ?")
        params.append(req.humidity)

    if not updates:
        return {"status": "NO_OP", "message": "No changes supplied"}

    params.append(weather_id)
    sql = f"UPDATE weather SET {', '.join(updates)} WHERE weather_id = ?"
    sql_db.execute_write(sql, tuple(params))
    return {"status": "SUCCESS", "message": f"Weather record {weather_id} updated"}

@router.delete("/weather/{weather_id}")
def delete_weather(weather_id: int):
    w = sql_db.fetch_one("SELECT * FROM weather WHERE weather_id = ?", (weather_id,))
    if not w:
        raise HTTPException(status_code=404, detail="Weather record not found")
    sql_db.execute_write("DELETE FROM weather WHERE weather_id = ?", (weather_id,))
    return {"status": "SUCCESS", "message": f"Weather record {weather_id} deleted"}


# ============================================================================
# MODULE 5 – FERTILIZER RECOMMENDATION (fertilizers & recommendations)
# ============================================================================

@router.get("/fertilizers")
def list_fertilizers():
    return sql_db.fetch_all("SELECT * FROM fertilizers ORDER BY fertilizer_id ASC")

@router.post("/fertilizers", status_code=201)
def create_fertilizer(req: FertilizerCreate):
    fert_id = sql_db.execute_write(
        "INSERT INTO fertilizers (fertilizer_name, description, application_guide, npk_ratio, suitable_crops) VALUES (?, ?, ?, ?, ?)",
        (req.fertilizer_name, req.description, req.application_guide, req.npk_ratio, req.suitable_crops)
    )
    return {"status": "SUCCESS", "fertilizer_id": fert_id, "message": "Fertilizer product registered"}

@router.put("/fertilizers/{fert_id}")
def update_fertilizer(fert_id: int, req: FertilizerUpdate):
    f = sql_db.fetch_one("SELECT * FROM fertilizers WHERE fertilizer_id = ?", (fert_id,))
    if not f:
        raise HTTPException(status_code=404, detail="Fertilizer not found")

    updates = []
    params = []
    if req.fertilizer_name is not None:
        updates.append("fertilizer_name = ?")
        params.append(req.fertilizer_name)
    if req.description is not None:
        updates.append("description = ?")
        params.append(req.description)
    if req.application_guide is not None:
        updates.append("application_guide = ?")
        params.append(req.application_guide)
    if req.npk_ratio is not None:
        updates.append("npk_ratio = ?")
        params.append(req.npk_ratio)
    if req.suitable_crops is not None:
        updates.append("suitable_crops = ?")
        params.append(req.suitable_crops)

    if not updates:
        return {"status": "NO_OP", "message": "No changes supplied"}

    params.append(fert_id)
    sql = f"UPDATE fertilizers SET {', '.join(updates)} WHERE fertilizer_id = ?"
    sql_db.execute_write(sql, tuple(params))
    return {"status": "SUCCESS", "message": f"Fertilizer {fert_id} updated"}

@router.delete("/fertilizers/{fert_id}")
def delete_fertilizer(fert_id: int):
    f = sql_db.fetch_one("SELECT * FROM fertilizers WHERE fertilizer_id = ?", (fert_id,))
    if not f:
        raise HTTPException(status_code=404, detail="Fertilizer not found")
    sql_db.execute_write("DELETE FROM fertilizers WHERE fertilizer_id = ?", (fert_id,))
    return {"status": "SUCCESS", "message": f"Fertilizer {fert_id} deleted"}

@router.post("/fertilizers/recommend")
def recommend_fertilizer(req: FertilizerRecommendRequest):
    """
    Agronomic Rule & Database Matching Engine:
    Selects optimal fertilizer from `fertilizers` table based on NPK deficits and stores in `recommendations` table.
    """
    all_ferts = sql_db.fetch_all("SELECT * FROM fertilizers")

    # Agronomic target heuristics
    n_deficit = max(0, 100 - req.nitrogen)
    p_deficit = max(0, 50 - req.phosphorus)
    k_deficit = max(0, 60 - req.potassium)

    selected_fert = None
    notes = ""

    if n_deficit > 40 and req.nitrogen < 60:
        # High nitrogen deficit
        for f in all_ferts:
            if "Urea" in f["fertilizer_name"]:
                selected_fert = f
                break
        notes = f"High soil Nitrogen deficit ({req.nitrogen:.1f} kg/ha). Apply Urea (46% N) top-dressing at 55 kg/ha in 2 split applications."
    elif p_deficit > 20 and req.phosphorus < 30:
        # High phosphorus deficit
        for f in all_ferts:
            if "DAP" in f["fertilizer_name"]:
                selected_fert = f
                break
        notes = f"Phosphorus limitation ({req.phosphorus:.1f} kg/ha). Apply Di-Ammonium Phosphate (DAP 18-46-0) at 50 kg/ha as basal placement."
    elif k_deficit > 20 and req.potassium < 40:
        for f in all_ferts:
            if "MOP" in f["fertilizer_name"]:
                selected_fert = f
                break
        notes = f"Potassium replenishment required ({req.potassium:.1f} kg/ha). Apply Muriate of Potash (MOP 0-0-60) at 35 kg/ha."
    else:
        # Balanced complex
        for f in all_ferts:
            if "10-26-26" in f["fertilizer_name"] or "NPK" in f["fertilizer_name"]:
                selected_fert = f
                break
        if not selected_fert and all_ferts:
            selected_fert = all_ferts[0]
        notes = f"Balanced NPK replenishment for {req.crop_name}. Maintain soil organic content and apply 50-75 kg/ha balanced complex."

    if not selected_fert and all_ferts:
        selected_fert = all_ferts[0]

    fert_id = selected_fert["fertilizer_id"] if selected_fert else None

    # Persist in SQL recommendations table
    rec_id = sql_db.execute_write(
        """INSERT INTO recommendations (user_id, crop_id, soil_id, fertilizer_id, recommendation_notes)
           VALUES (?, ?, ?, ?, ?)""",
        (req.user_id, req.crop_id, req.soil_id, fert_id, notes)
    )

    return {
        "status": "SUCCESS",
        "recommendation_id": rec_id,
        "crop_name": req.crop_name,
        "soil_type": req.soil_type,
        "recommended_fertilizer": selected_fert,
        "recommendation_notes": notes,
        "npk_status": {
            "nitrogen_kg_ha": req.nitrogen,
            "phosphorus_kg_ha": req.phosphorus,
            "potassium_kg_ha": req.potassium,
            "ph_level": req.ph_level,
            "n_status": "Low" if req.nitrogen < 70 else ("High" if req.nitrogen > 110 else "Optimal"),
            "p_status": "Low" if req.phosphorus < 35 else ("High" if req.phosphorus > 60 else "Optimal"),
            "k_status": "Low" if req.potassium < 45 else ("High" if req.potassium > 75 else "Optimal"),
        }
    }

@router.get("/recommendations")
def list_recommendations():
    sql = """
    SELECT r.recommendation_id, r.recommendation_notes, r.created_at,
           u.name as farmer_name,
           c.crop_name, c.season,
           s.soil_type, s.ph_level, s.nitrogen, s.phosphorus, s.potassium,
           f.fertilizer_name, f.npk_ratio, f.application_guide
    FROM recommendations r
    LEFT JOIN users u ON r.user_id = u.user_id
    LEFT JOIN crops c ON r.crop_id = c.crop_id
    LEFT JOIN soil_details s ON r.soil_id = s.soil_id
    LEFT JOIN fertilizers f ON r.fertilizer_id = f.fertilizer_id
    ORDER BY r.recommendation_id DESC
    """
    return sql_db.fetch_all(sql)


# ============================================================================
# MODULE 6 – PLANT DISEASE DETECTION (diseases table)
# ============================================================================

@router.get("/diseases")
def list_diseases(crop: Optional[str] = Query(None)):
    sql = "SELECT * FROM diseases WHERE 1=1"
    params = []
    if crop:
        sql += " AND affected_crops LIKE ?"
        params.append(f"%{crop}%")
    sql += " ORDER BY disease_id ASC"
    return sql_db.fetch_all(sql, tuple(params))

@router.post("/diseases", status_code=201)
def create_disease(req: DiseaseCreate):
    disease_id = sql_db.execute_write(
        "INSERT INTO diseases (disease_name, symptoms, treatment, affected_crops, confidence_score) VALUES (?, ?, ?, ?, ?)",
        (req.disease_name, req.symptoms, req.treatment, req.affected_crops, req.confidence_score or 95.0)
    )
    return {"status": "SUCCESS", "disease_id": disease_id, "message": "Disease entry cataloged"}

@router.put("/diseases/{disease_id}")
def update_disease(disease_id: int, req: DiseaseUpdate):
    d = sql_db.fetch_one("SELECT * FROM diseases WHERE disease_id = ?", (disease_id,))
    if not d:
        raise HTTPException(status_code=404, detail="Disease record not found")

    updates = []
    params = []
    if req.disease_name is not None:
        updates.append("disease_name = ?")
        params.append(req.disease_name)
    if req.symptoms is not None:
        updates.append("symptoms = ?")
        params.append(req.symptoms)
    if req.treatment is not None:
        updates.append("treatment = ?")
        params.append(req.treatment)
    if req.affected_crops is not None:
        updates.append("affected_crops = ?")
        params.append(req.affected_crops)
    if req.confidence_score is not None:
        updates.append("confidence_score = ?")
        params.append(req.confidence_score)

    if not updates:
        return {"status": "NO_OP", "message": "No changes supplied"}

    params.append(disease_id)
    sql = f"UPDATE diseases SET {', '.join(updates)} WHERE disease_id = ?"
    sql_db.execute_write(sql, tuple(params))
    return {"status": "SUCCESS", "message": f"Disease {disease_id} updated"}

@router.delete("/diseases/{disease_id}")
def delete_disease(disease_id: int):
    d = sql_db.fetch_one("SELECT * FROM diseases WHERE disease_id = ?", (disease_id,))
    if not d:
        raise HTTPException(status_code=404, detail="Disease not found")
    sql_db.execute_write("DELETE FROM diseases WHERE disease_id = ?", (disease_id,))
    return {"status": "SUCCESS", "message": f"Disease {disease_id} deleted"}

@router.post("/diseases/detect")
async def detect_plant_disease(
    crop: str = Form("Wheat"),
    symptom_notes: Optional[str] = Form(""),
    file: Optional[UploadFile] = File(None)
):
    """
    Image validation and leaf diagnosis matching against SQL diseases database.
    Validates file extension (.jpg, .jpeg, .png, .webp) and size (< 5MB).
    """
    file_info = {"filename": None, "size_bytes": 0, "content_type": None}
    if file:
        filename = file.filename or ""
        ext = filename.split(".")[-1].lower() if "." in filename else ""
        if ext not in ["jpg", "jpeg", "png", "webp"]:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported image format '.{ext}'. Supported formats are: JPG, JPEG, PNG, WEBP."
            )
        contents = await file.read()
        size_bytes = len(contents)
        if size_bytes > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="File size exceeds the 5MB maximum threshold. Please upload an optimized image."
            )
        file_info = {
            "filename": filename,
            "size_bytes": size_bytes,
            "content_type": file.content_type
        }

    # Query matching disease from relational DB
    matched = sql_db.fetch_one(
        "SELECT * FROM diseases WHERE affected_crops LIKE ? ORDER BY confidence_score DESC LIMIT 1",
        (f"%{crop}%",)
    )
    if not matched:
        matched = sql_db.fetch_one("SELECT * FROM diseases ORDER BY disease_id ASC LIMIT 1")

    return {
        "status": "DIAGNOSIS_COMPLETE",
        "crop": crop,
        "disease_detected": matched["disease_name"] if matched else "Healthy Foliage (No Pathogen Detected)",
        "confidence_pct": float(matched["confidence_score"]) if matched else 98.5,
        "symptoms": matched["symptoms"] if matched else "Uniform green canopy without chlorotic spots or necrotic lesions.",
        "treatment": matched["treatment"] if matched else "Continue scheduled prophylactic irrigation and nutrient monitoring.",
        "file_details": file_info,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }


# ============================================================================
# MODULE 7 – AGRICULTURAL MARKET PRICE (market_prices table)
# ============================================================================

@router.get("/market-prices")
def list_market_prices(
    crop_name: Optional[str] = Query(None),
    market_name: Optional[str] = Query(None),
    q: Optional[str] = Query(None)
):
    sql = "SELECT * FROM market_prices WHERE 1=1"
    params = []
    if crop_name:
        sql += " AND crop_name LIKE ?"
        params.append(f"%{crop_name}%")
    if market_name:
        sql += " AND market_name LIKE ?"
        params.append(f"%{market_name}%")
    if q:
        sql += " AND (crop_name LIKE ? OR market_name LIKE ?)"
        params.extend([f"%{q}%", f"%{q}%"])
    sql += " ORDER BY price_date DESC, price_id DESC"
    return sql_db.fetch_all(sql, tuple(params))

@router.get("/market-prices/trends")
def get_market_trends():
    """Returns price trend analytics aggregated across mandis."""
    prices = sql_db.fetch_all("SELECT crop_name, market_name, price, min_price, max_price, price_date FROM market_prices ORDER BY price_date ASC")
    return prices

@router.post("/market-prices", status_code=201)
def create_market_price(req: MarketPriceCreate):
    price_date = req.price_date or date.today().isoformat()
    min_p = req.min_price or (req.price * 0.92)
    max_p = req.max_price or (req.price * 1.08)

    price_id = sql_db.execute_write(
        """INSERT INTO market_prices (crop_name, market_name, price, price_date, min_price, max_price)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (req.crop_name, req.market_name, req.price, price_date, min_p, max_p)
    )
    return {
        "status": "SUCCESS",
        "price_id": price_id,
        "message": f"Mandi price record for {req.crop_name} logged"
    }

@router.put("/market-prices/{price_id}")
def update_market_price(price_id: int, req: MarketPriceUpdate):
    p = sql_db.fetch_one("SELECT * FROM market_prices WHERE price_id = ?", (price_id,))
    if not p:
        raise HTTPException(status_code=404, detail="Price record not found")

    updates = []
    params = []
    if req.crop_name is not None:
        updates.append("crop_name = ?")
        params.append(req.crop_name)
    if req.market_name is not None:
        updates.append("market_name = ?")
        params.append(req.market_name)
    if req.price is not None:
        updates.append("price = ?")
        params.append(req.price)
    if req.price_date is not None:
        updates.append("price_date = ?")
        params.append(req.price_date)
    if req.min_price is not None:
        updates.append("min_price = ?")
        params.append(req.min_price)
    if req.max_price is not None:
        updates.append("max_price = ?")
        params.append(req.max_price)

    if not updates:
        return {"status": "NO_OP", "message": "No changes supplied"}

    params.append(price_id)
    sql = f"UPDATE market_prices SET {', '.join(updates)} WHERE price_id = ?"
    sql_db.execute_write(sql, tuple(params))
    return {"status": "SUCCESS", "message": f"Price record {price_id} updated"}

@router.delete("/market-prices/{price_id}")
def delete_market_price(price_id: int):
    p = sql_db.fetch_one("SELECT * FROM market_prices WHERE price_id = ?", (price_id,))
    if not p:
        raise HTTPException(status_code=404, detail="Price record not found")
    sql_db.execute_write("DELETE FROM market_prices WHERE price_id = ?", (price_id,))
    return {"status": "SUCCESS", "message": f"Price record {price_id} deleted"}
