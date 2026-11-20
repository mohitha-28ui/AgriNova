"""
AgriNova MongoDB Database Architecture & Connection Manager
Smart Farming, Better Tomorrow.
Database: agrinova_db
Collections:
1. users
2. farmer_profiles
3. crops
4. soil_records
5. weather_records
6. market_prices
7. crop_recommendations
8. yield_predictions
9. fertilizer_recommendations
10. disease_detection_history
11. analytics_results
12. streaming_events
13. pipeline_jobs
14. model_versions
15. notifications
16. feedback
17. admin_users
"""

import os
import json
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
import pymongo
from pymongo import MongoClient

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LOCAL_DATA_DIR = os.path.join(BASE_DIR, "backend", "app", "database", "local_store")
os.makedirs(LOCAL_DATA_DIR, exist_ok=True)

MONGODB_URI = os.getenv("MONGODB_URI", "").strip()
DATABASE_NAME = os.getenv("DATABASE_NAME", "agrinova_db")

COLLECTIONS = [
    "users", "farmer_profiles", "crops", "soil_records", "weather_records",
    "market_prices", "crop_recommendations", "yield_predictions",
    "fertilizer_recommendations", "disease_detection_history", "analytics_results",
    "streaming_events", "pipeline_jobs", "model_versions", "notifications",
    "feedback", "admin_users"
]

class LocalCollection:
    """High-fidelity file-backed document collection mirroring MongoDB API."""
    def __init__(self, name: str, data_dir: str):
        self.name = name
        self.file_path = os.path.join(data_dir, f"{name}.json")
        self.docs: List[Dict[str, Any]] = []
        self._load()

    def _load(self):
        if os.path.exists(self.file_path):
            try:
                with open(self.file_path, "r", encoding="utf-8") as f:
                    self.docs = json.load(f)
            except Exception:
                self.docs = []
        else:
            self.docs = []

    def _save(self):
        try:
            with open(self.file_path, "w", encoding="utf-8") as f:
                json.dump(self.docs, f, indent=2, default=str)
        except Exception as e:
            print(f"Error saving collection {self.name}: {e}")

    def insert_one(self, doc: Dict[str, Any]):
        doc_copy = dict(doc)
        if "_id" not in doc_copy:
            doc_copy["_id"] = str(uuid.uuid4())
        self.docs.append(doc_copy)
        self._save()
        class InsertResult:
            inserted_id = doc_copy["_id"]
        return InsertResult()

    def insert_many(self, docs: List[Dict[str, Any]]):
        ids = []
        for d in docs:
            d_copy = dict(d)
            if "_id" not in d_copy:
                d_copy["_id"] = str(uuid.uuid4())
            self.docs.append(d_copy)
            ids.append(d_copy["_id"])
        self._save()
        class InsertManyResult:
            inserted_ids = ids
        return InsertManyResult()

    def find_one(self, query: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
        query = query or {}
        for d in self.docs:
            match = True
            for k, v in query.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                return dict(d)
        return None

    def find(self, query: Dict[str, Any] = None, limit: int = 1000, sort: Optional[List] = None) -> List[Dict[str, Any]]:
        query = query or {}
        matches = []
        for d in self.docs:
            match = True
            for k, v in query.items():
                if isinstance(v, dict):
                    # basic range or in queries
                    val = d.get(k)
                    if "$gte" in v and not (val is not None and val >= v["$gte"]):
                        match = False; break
                    if "$lte" in v and not (val is not None and val <= v["$lte"]):
                        match = False; break
                    if "$in" in v and not (val in v["$in"]):
                        match = False; break
                else:
                    if d.get(k) != v:
                        match = False; break
            if match:
                matches.append(dict(d))
        
        if sort:
            sort_key, direction = sort[0]
            matches.sort(key=lambda x: x.get(sort_key, ""), reverse=(direction == -1))
            
        return matches[:limit]

    def count_documents(self, query: Dict[str, Any] = None) -> int:
        return len(self.find(query, limit=100000))

    def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        for idx, d in enumerate(self.docs):
            match = True
            for k, v in query.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                payload = update.get("$set", update)
                d.update(payload)
                if "" in d:
                    del d[""]
                self._save()
                return True
        return False

    def delete_one(self, query: Dict[str, Any]):
        target = self.find_one(query)
        if target:
            self.docs.remove(target)
            self._save()
            return True
        return False

    def create_index(self, keys, **kwargs):
        return "index_created"


class MongoAtlasCollectionWrapper:
    """Production-grade wrapper around PyMongo Collection ensuring serialization safety and API parity."""
    def __init__(self, raw_col):
        self.raw_col = raw_col
        self.name = raw_col.name

    def insert_one(self, doc: Dict[str, Any]):
        doc_copy = dict(doc)
        res = self.raw_col.insert_one(doc_copy)
        class InsertResult:
            inserted_id = str(res.inserted_id)
        return InsertResult()

    def insert_many(self, docs: List[Dict[str, Any]]):
        docs_copy = [dict(d) for d in docs]
        res = self.raw_col.insert_many(docs_copy)
        class InsertManyResult:
            inserted_ids = [str(i) for i in res.inserted_ids]
        return InsertManyResult()

    def find_one(self, query: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
        query = query or {}
        try:
            doc = self.raw_col.find_one(query)
            if doc:
                doc = dict(doc)
                if "_id" in doc:
                    doc["_id"] = str(doc["_id"])
                return doc
        except Exception as e:
            print(f"[MongoDB Atlas] find_one error on {self.name}: {e}")
        return None

    def find(self, query: Dict[str, Any] = None, limit: int = 1000, sort: Optional[List] = None) -> List[Dict[str, Any]]:
        query = query or {}
        try:
            cursor = self.raw_col.find(query)
            if sort:
                cursor = cursor.sort(sort)
            if limit:
                cursor = cursor.limit(limit)
            results = []
            for d in cursor:
                d_copy = dict(d)
                if "_id" in d_copy:
                    d_copy["_id"] = str(d_copy["_id"])
                results.append(d_copy)
            return results
        except Exception as e:
            print(f"[MongoDB Atlas] find error on {self.name}: {e}")
            return []

    def count_documents(self, query: Dict[str, Any] = None) -> int:
        query = query or {}
        try:
            return self.raw_col.count_documents(query)
        except Exception:
            return 0

    def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        try:
            if not any(k.startswith("$") for k in update.keys()):
                update = {"$set": update}
            res = self.raw_col.update_one(query, update)
            return res.modified_count > 0 or res.matched_count > 0
        except Exception as e:
            print(f"[MongoDB Atlas] update_one error on {self.name}: {e}")
            return False

    def delete_one(self, query: Dict[str, Any]):
        try:
            res = self.raw_col.delete_one(query or {})
            return res.deleted_count > 0
        except Exception:
            return False

    def create_index(self, keys, **kwargs):
        try:
            return self.raw_col.create_index(keys, **kwargs)
        except Exception:
            return "index_ready"


class AgriNovaCollectionProxy:
    """Dynamic Collection Proxy routing calls to live Atlas or resilient local fallback."""
    def __init__(self, manager: 'AgriNovaDatabase', name: str):
        self.manager = manager
        self.name = name

    def _target(self):
        return self.manager.get_active_collection(self.name)

    def insert_one(self, doc: Dict[str, Any]):
        return self._target().insert_one(doc)

    def insert_many(self, docs: List[Dict[str, Any]]):
        return self._target().insert_many(docs)

    def find_one(self, query: Dict[str, Any] = None):
        return self._target().find_one(query)

    def find(self, query: Dict[str, Any] = None, limit: int = 1000, sort: Optional[List] = None):
        return self._target().find(query, limit=limit, sort=sort)

    def count_documents(self, query: Dict[str, Any] = None):
        return self._target().count_documents(query)

    def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        return self._target().update_one(query, update)

    def delete_one(self, query: Dict[str, Any]):
        return self._target().delete_one(query)

    def create_index(self, keys, **kwargs):
        return self._target().create_index(keys, **kwargs)


class AgriNovaDatabase:
    """Unified Database client supporting live MongoDB / MongoDB Atlas with resilient fallback."""
    def __init__(self):
        self.uri = MONGODB_URI
        self.db_name = DATABASE_NAME
        self.client: Optional[MongoClient] = None
        self.db = None
        self.is_connected = False
        self._local_cache: Dict[str, LocalCollection] = {}
        self._atlas_cache: Dict[str, MongoAtlasCollectionWrapper] = {}
        self._init_connection()

    def _mask_uri(self, uri: str) -> str:
        """Sanitizes connection URI to prevent credential leakage in logs."""
        if not uri or "@" not in uri:
            return uri
        try:
            prefix, rest = uri.split("@", 1)
            scheme = prefix.split("://")[0]
            return f"{scheme}://***:***@{rest}"
        except Exception:
            return "mongodb+srv://***:***@hidden"

    def _init_connection(self):
        if not self.uri:
            self.is_connected = False
            return

        try:
            # 5-second timeout for cloud MongoDB Atlas connectivity checks
            self.client = MongoClient(
                self.uri,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000,
                socketTimeoutMS=10000
            )
            self.client.server_info()  # triggers live ping verification
            self.db = self.client[self.db_name]
            self.is_connected = True
            masked = self._mask_uri(self.uri)
            print(f"[AgriNova DB] Successfully connected to live MongoDB Atlas [{self.db_name}] at {masked}")
        except Exception as e:
            self.is_connected = False
            self.client = None
            self.db = None
            print(f"[AgriNova DB] Notice: Live MongoDB connection unavailable ({e}). Running on resilient local persistence.")

    def get_active_collection(self, name: str):
        if self.is_connected and self.db is not None:
            if name not in self._atlas_cache:
                self._atlas_cache[name] = MongoAtlasCollectionWrapper(self.db[name])
            return self._atlas_cache[name]

        if name not in self._local_cache:
            self._local_cache[name] = LocalCollection(name, LOCAL_DATA_DIR)
        return self._local_cache[name]

    def get_collection(self, name: str):
        return AgriNovaCollectionProxy(self, name)

    def auto_seed_initial_data(self):
        """Ensures baseline admin, farmer and metadata exist when deploying to fresh MongoDB Atlas."""
        try:
            from backend.app.utils.security import get_password_hash
            users = self.get_collection("users")
            admin_users = self.get_collection("admin_users")
            farmer_profiles = self.get_collection("farmer_profiles")
            crops = self.get_collection("crops")

            # Seed Admin Account
            if users.count_documents({"email": "admin@agrinova.ai"}) == 0:
                admin_doc = {
                    "email": "admin@agrinova.ai",
                    "hashed_password": get_password_hash("Admin@12345"),
                    "full_name": "Sana Mohitha",
                    "role": "admin",
                    "phone": "+91-9876543210",
                    "is_active": True,
                    "created_at": datetime.now().isoformat()
                }
                users.insert_one(admin_doc)
                admin_users.insert_one(admin_doc)
                print("[AgriNova DB] Auto-seeded default admin user: admin@agrinova.ai")

            # Seed Farmer Account
            if users.count_documents({"email": "farmer@agrinova.ai"}) == 0:
                farmer_doc = {
                    "email": "farmer@agrinova.ai",
                    "hashed_password": get_password_hash("Farmer@12345"),
                    "full_name": "Ramesh Kumar Patel",
                    "role": "farmer",
                    "phone": "+91-9123456789",
                    "is_active": True,
                    "created_at": datetime.now().isoformat()
                }
                res = users.insert_one(farmer_doc)
                farmer_profiles.insert_one({
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
                print("[AgriNova DB] Auto-seeded default farmer user: farmer@agrinova.ai")

            # Seed Crop Catalog
            if crops.count_documents() == 0:
                crops_list = [
                    {"name": "Rice", "type": "Cereal", "category": "Kharif", "water_req_mm": "1200-1500", "ideal_ph": "5.5-6.5", "growing_days": 120},
                    {"name": "Wheat", "type": "Cereal", "category": "Rabi", "water_req_mm": "450-650", "ideal_ph": "6.0-7.0", "growing_days": 140},
                    {"name": "Maize", "type": "Cereal", "category": "Kharif", "water_req_mm": "500-800", "ideal_ph": "5.8-7.2", "growing_days": 100},
                    {"name": "Cotton", "type": "Fiber", "category": "Kharif", "water_req_mm": "700-1200", "ideal_ph": "6.5-8.0", "growing_days": 160},
                    {"name": "Chickpea", "type": "Pulse", "category": "Rabi", "water_req_mm": "250-400", "ideal_ph": "6.0-7.5", "growing_days": 100}
                ]
                crops.insert_many(crops_list)
                print("[AgriNova DB] Auto-seeded baseline crop catalog.")
        except Exception as e:
            print(f"[AgriNova DB] Auto-seed status: {e}")

    def check_health(self) -> Dict[str, Any]:
        return {
            "database_name": self.db_name,
            "connected_to_live_mongo": self.is_connected,
            "engine": "MongoDB Atlas" if self.is_connected else "Resilient Local Data Engine",
            "collections_count": len(COLLECTIONS),
            "status": "HEALTHY",
            "timestamp": datetime.now().isoformat()
        }

db_manager = AgriNovaDatabase()

# Collection accessors
users_col = db_manager.get_collection("users")
farmer_profiles_col = db_manager.get_collection("farmer_profiles")
crops_col = db_manager.get_collection("crops")
soil_records_col = db_manager.get_collection("soil_records")
weather_records_col = db_manager.get_collection("weather_records")
market_prices_col = db_manager.get_collection("market_prices")
crop_recommendations_col = db_manager.get_collection("crop_recommendations")
yield_predictions_col = db_manager.get_collection("yield_predictions")
fertilizer_recommendations_col = db_manager.get_collection("fertilizer_recommendations")
disease_detection_col = db_manager.get_collection("disease_detection_history")
analytics_results_col = db_manager.get_collection("analytics_results")
streaming_events_col = db_manager.get_collection("streaming_events")
pipeline_jobs_col = db_manager.get_collection("pipeline_jobs")
model_versions_col = db_manager.get_collection("model_versions")
notifications_col = db_manager.get_collection("notifications")
feedback_col = db_manager.get_collection("feedback")
admin_users_col = db_manager.get_collection("admin_users")
