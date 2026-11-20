"""
MYTHORA Database Seeding Engine
Tagline: Turning Data into Growth
Initializes agrinova_db with initial administrative accounts, farmer profiles,
crop catalogues, benchmark soil records, and pre-computed pipeline metadata.
"""

import os
import sys
import pandas as pd
from datetime import datetime

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.database.mongodb import (
    users_col, admin_users_col, farmer_profiles_col,
    crops_col, soil_records_col, weather_records_col,
    market_prices_col, model_versions_col, notifications_col
)
from backend.app.utils.security import get_password_hash

def hash_password(password: str) -> str:
    return get_password_hash(password)

def seed_users():
    print("--> Seeding Users and Roles...")
    if users_col.count_documents({"email": "admin@agrinova.ai"}) == 0:
        admin_doc = {
            "email": "admin@agrinova.ai",
            "hashed_password": hash_password("Admin@12345"),
            "full_name": "Sana Mohitha",
            "role": "admin",
            "phone": "+91-9876543210",
            "is_active": True,
            "created_at": datetime.now().isoformat()
        }
        users_col.insert_one(admin_doc)
        admin_users_col.insert_one(admin_doc)
        print("Created Admin User: admin@agrinova.ai")

    if users_col.count_documents({"email": "farmer@agrinova.ai"}) == 0:
        farmer_doc = {
            "email": "farmer@agrinova.ai",
            "hashed_password": hash_password("Farmer@12345"),
            "full_name": "Ramesh Kumar Patel",
            "role": "farmer",
            "phone": "+91-9123456789",
            "is_active": True,
            "created_at": datetime.now().isoformat()
        }
        res = users_col.insert_one(farmer_doc)
        
        # Farmer profile
        farmer_profiles_col.insert_one({
            "user_id": res.inserted_id,
            "full_name": "Ramesh Kumar Patel",
            "farm_name": "Surya Organic Farms",
            "state": "Punjab",
            "district": "Ludhiana",
            "total_land_acres": 14.5,
            "soil_type": "Alluvial",
            "primary_crops": ["Wheat", "Rice", "Mustard"],
            "irrigation_type": "Canal & Tube Well",
            "created_at": datetime.now().isoformat()
        })
        print("Created Farmer User: farmer@agrinova.ai")

def seed_sample_agricultural_records():
    print("--> Seeding Sample Operational Records from Datasets...")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    raw_dir = os.path.join(base_dir, "datasets", "raw")
    
    # 1. Crops catalogue
    if crops_col.count_documents() == 0:
        crops = [
            {"name": "Rice", "type": "Cereal", "category": "Kharif", "water_req_mm": "1200-1500", "ideal_ph": "5.5-6.5", "growing_days": 120},
            {"name": "Wheat", "type": "Cereal", "category": "Rabi", "water_req_mm": "450-650", "ideal_ph": "6.0-7.0", "growing_days": 140},
            {"name": "Maize", "type": "Cereal", "category": "Kharif", "water_req_mm": "500-800", "ideal_ph": "5.8-7.2", "growing_days": 100},
            {"name": "Cotton", "type": "Fiber", "category": "Kharif", "water_req_mm": "700-1200", "ideal_ph": "6.5-8.0", "growing_days": 160},
            {"name": "Sugarcane", "type": "Cash Crop", "category": "Whole Year", "water_req_mm": "1500-2500", "ideal_ph": "6.0-7.5", "growing_days": 360},
            {"name": "Soybean", "type": "Oilseed / Pulse", "category": "Kharif", "water_req_mm": "450-700", "ideal_ph": "6.0-7.0", "growing_days": 95},
            {"name": "Mustard", "type": "Oilseed", "category": "Rabi", "water_req_mm": "300-450", "ideal_ph": "6.0-7.5", "growing_days": 110},
            {"name": "Gram (Chickpea)", "type": "Pulse", "category": "Rabi", "water_req_mm": "350-450", "ideal_ph": "6.0-7.5", "growing_days": 105}
        ]
        crops_col.insert_many(crops)
        print(f"Seeded {len(crops)} crop varieties.")

    # 2. Sample soil records
    if soil_records_col.count_documents() == 0:
        soil_csv = os.path.join(raw_dir, "soil", "soil_health_records.csv")
        if os.path.exists(soil_csv):
            df_soil = pd.read_csv(soil_csv).head(50)
            soil_records_col.insert_many(df_soil.to_dict(orient="records"))
            print("Seeded 50 baseline soil health records.")

    # 3. Sample weather records
    if weather_records_col.count_documents() == 0:
        weather_csv = os.path.join(raw_dir, "weather", "weather_daily_records.csv")
        if os.path.exists(weather_csv):
            df_weather = pd.read_csv(weather_csv).head(60)
            weather_records_col.insert_many(df_weather.to_dict(orient="records"))
            print("Seeded 60 baseline meteorological records.")

    # 4. Sample market prices
    if market_prices_col.count_documents() == 0:
        market_csv = os.path.join(raw_dir, "market", "mandi_market_prices.csv")
        if os.path.exists(market_csv):
            df_market = pd.read_csv(market_csv).head(100)
            market_prices_col.insert_many(df_market.to_dict(orient="records"))
            print("Seeded 100 benchmark mandi price transactions.")

    # 5. Model versions
    if model_versions_col.count_documents() == 0:
        model_versions_col.insert_many([
            {
                "model_id": "MOD-CR-V1",
                "name": "MYTHORA Crop Recommendation Engine",
                "algorithm": "RandomForestClassifier",
                "accuracy": 0.9886,
                "version": "1.0.0",
                "status": "PRODUCTION",
                "last_trained": datetime.now().isoformat()
            },
            {
                "model_id": "MOD-CYP-V1",
                "name": "MYTHORA Crop Yield Predictor",
                "algorithm": "GradientBoostingRegressor",
                "r2_score": 0.9865,
                "rmse": 2.5964,
                "version": "1.0.0",
                "status": "PRODUCTION",
                "last_trained": datetime.now().isoformat()
            }
        ])
        print("Seeded MLOps model versioning records.")

    # 6. Notifications
    if notifications_col.count_documents() == 0:
        notifications_col.insert_many([
            {
                "title": "Welcome to MYTHORA",
                "message": "MYTHORA – Turning Data into Growth. Smart Agriculture Platform is online and operational.",
                "type": "INFO",
                "timestamp": datetime.now().isoformat(),
                "read": False
            },
            {
                "title": "Mandi Spot Alert",
                "message": "Wheat arrivals in Ludhiana Mandi increased by 14% with modal price at ₹2,420/Quintal.",
                "type": "ALERT",
                "timestamp": datetime.now().isoformat(),
                "read": False
            }
        ])
        print("Seeded notifications.")

if __name__ == "__main__":
    print("Beginning Database Seeding...")
    seed_users()
    seed_sample_agricultural_records()
    print("Database Seeding Completed Successfully!")
