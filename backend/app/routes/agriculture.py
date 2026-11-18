"""
AgriNova Agricultural Operational Endpoints
Handles crops, soil samples, weather observations, mandi prices, and smart irrigation.
"""

from fastapi import APIRouter, HTTPException
from typing import Optional, List, Dict, Any
from datetime import datetime
from backend.app.schemas.schemas import SoilRecordCreate
from backend.app.database.mongodb import (
    crops_col, soil_records_col, weather_records_col, market_prices_col
)

router = APIRouter(prefix="/agriculture", tags=["Agricultural Domain Data"])

# CROPS
@router.get("/crops")
def list_crops():
    return crops_col.find({}, limit=100)

# SOIL RECORDS
@router.get("/soil/records")
def list_soil_records(state: Optional[str] = None, limit: int = 50):
    query = {"State": state} if state else {}
    return soil_records_col.find(query, limit=limit)

@router.post("/soil/records")
def create_soil_record(req: SoilRecordCreate):
    doc = {
        "Sample_ID": f"SOIL-{int(datetime.now().timestamp())}",
        "State": req.state,
        "District": req.district,
        "Soil_Type": req.soil_type,
        "Nitrogen_kg_ha": req.nitrogen_kg_ha,
        "Phosphorus_kg_ha": req.phosphorus_kg_ha,
        "Potassium_kg_ha": req.potassium_kg_ha,
        "Soil_pH": req.soil_ph,
        "Electrical_Conductivity_dS_m": req.electrical_conductivity,
        "Organic_Carbon_pct": req.organic_carbon_pct,
        "Moisture_pct": req.moisture_pct,
        "Health_Status": "Optimal" if 6.0 <= req.soil_ph <= 7.5 and req.organic_carbon_pct >= 0.6 else "Moderate",
        "Sample_Date": datetime.now().strftime("%Y-%m-%d")
    }
    res = soil_records_col.insert_one(doc)
    doc["_id"] = res.inserted_id
    return doc

# WEATHER
@router.get("/weather/current")
def get_current_weather(state: str = "Punjab", district: str = "Ludhiana"):
    rec = weather_records_col.find_one({"State": state, "District": district})
    if not rec:
        rec = weather_records_col.find_one() or {
            "Station_ID": "STN-DEF",
            "State": state,
            "District": district,
            "Max_Temp_C": 28.5,
            "Min_Temp_C": 18.2,
            "Mean_Temp_C": 23.3,
            "Relative_Humidity_pct": 65.0,
            "Precipitation_mm": 0.0,
            "Wind_Speed_kmh": 12.0,
            "Weather_Condition": "Sunny & Favorable"
        }
    return rec

@router.get("/weather/records")
def list_weather_records(state: Optional[str] = None, limit: int = 50):
    query = {"State": state} if state else {}
    return weather_records_col.find(query, limit=limit)

# MARKET PRICES
@router.get("/market/prices")
def list_market_prices(commodity: Optional[str] = None, state: Optional[str] = None, limit: int = 60):
    query = {}
    if commodity:
        query["Commodity"] = commodity
    if state:
        query["State"] = state
    return market_prices_col.find(query, limit=limit)

# IRRIGATION ANALYTICS
@router.get("/irrigation/status")
def get_irrigation_status():
    return {
        "irrigation_zones": [
            {"zone_id": "ZONE-A1", "field_name": "North Wheat Acreage", "crop": "Wheat", "soil_moisture_pct": 24.5, "valve_status": "CLOSED", "next_schedule": "Tomorrow 06:00 AM", "water_required_liters": 15000},
            {"zone_id": "ZONE-B2", "field_name": "Canal-fed Rice Field", "crop": "Rice", "soil_moisture_pct": 36.2, "valve_status": "OPTIMAL", "next_schedule": "In 3 Days", "water_required_liters": 28000},
            {"zone_id": "ZONE-C3", "field_name": "South Mustard Plot", "crop": "Mustard", "soil_moisture_pct": 18.1, "valve_status": "OPEN (IRRIGATING)", "next_schedule": "Active Now", "water_required_liters": 8500}
        ],
        "evapotranspiration_rate_mm_day": 4.2,
        "water_saving_percentage": 32.4,
        "smart_valve_automation_mode": "WEATHER_AND_SOIL_LINKED",
        "timestamp": datetime.now().isoformat()
    }
