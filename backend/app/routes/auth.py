"""
MYTHORA Authentication & Profile Router
"""

from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from backend.app.schemas.schemas import UserRegisterRequest, UserLoginRequest, TokenResponse
from backend.app.database.mongodb import users_col, farmer_profiles_col, admin_users_col
from backend.app.utils.security import verify_password, get_password_hash, create_access_token
from backend.app.middleware.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication & Profiles"])

@router.post("/register", response_model=TokenResponse)
def register_user(req: UserRegisterRequest):
    existing = users_col.find_one({"email": req.email})
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    hashed_pwd = get_password_hash(req.password)
    user_doc = {
        "email": req.email,
        "hashed_password": hashed_pwd,
        "full_name": req.full_name,
        "role": req.role,
        "phone": req.phone,
        "is_active": True,
        "created_at": datetime.now().isoformat()
    }
    res = users_col.insert_one(user_doc)
    user_doc["_id"] = res.inserted_id

    if req.role == "farmer":
        farmer_profiles_col.insert_one({
            "user_id": res.inserted_id,
            "full_name": req.full_name,
            "farm_name": f"{req.full_name}'s Farm",
            "state": req.state or "Punjab",
            "district": req.district or "Ludhiana",
            "total_land_acres": 5.0,
            "soil_type": "Alluvial",
            "primary_crops": ["Wheat", "Rice"],
            "created_at": datetime.now().isoformat()
        })
    elif req.role == "admin":
        admin_users_col.insert_one(user_doc)

    token = create_access_token({"sub": req.email, "role": req.role, "name": req.full_name})
    safe_user = {k: v for k, v in user_doc.items() if k != "hashed_password"}
    return {"access_token": token, "token_type": "bearer", "user": safe_user}

@router.post("/login", response_model=TokenResponse)
def login_user(req: UserLoginRequest):
    user = users_col.find_one({"email": req.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if not verify_password(req.password, user.get("hashed_password", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token({"sub": user["email"], "role": user.get("role", "farmer"), "name": user.get("full_name")})
    safe_user = {k: v for k, v in user.items() if k != "hashed_password"}
    return {"access_token": token, "token_type": "bearer", "user": safe_user}

@router.get("/me")
def get_current_user_profile(user: dict = Depends(get_current_user)):
    safe_user = {k: v for k, v in user.items() if k != "hashed_password"}
    profile = farmer_profiles_col.find_one({"user_id": user.get("_id")}) or {}
    safe_user["profile"] = profile
    return safe_user
