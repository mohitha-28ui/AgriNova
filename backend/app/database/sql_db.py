"""
AgriNova Production SQL Database Architecture
Supports MySQL 8.0 with automatic SQLite persistence fallback for sandbox/local zero-dependency reliability.
Database: agrinova_db
Tables:
1. users
2. crops
3. soil_details
4. weather
5. fertilizers
6. diseases
7. market_prices
8. recommendations
"""

import os
import sys
import sqlite3
from datetime import datetime, date
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path
from backend.app.utils.security import get_password_hash

# Configuration
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "agrinova_db")

DB_DIR = Path(__file__).resolve().parent.parent.parent.parent / "database"
DB_DIR.mkdir(parents=True, exist_ok=True)
SQLITE_DB_PATH = str(DB_DIR / "agrinova_db.sqlite")

class SQLDatabaseManager:
    """Enterprise SQL Database Manager for AgriNova Smart Agriculture."""

    def __init__(self):
        self.is_mysql = False
        self.connection = None
        self._init_db()

    def _get_connection(self):
        # 1. Try MySQL if pymysql is available and configured
        try:
            import pymysql
            conn = pymysql.connect(
                host=MYSQL_HOST,
                port=MYSQL_PORT,
                user=MYSQL_USER,
                password=MYSQL_PASSWORD,
                database=MYSQL_DATABASE,
                cursorclass=pymysql.cursors.DictCursor,
                autocommit=True
            )
            self.is_mysql = True
            return conn
        except Exception:
            # 2. Resilient SQLite local persistence fallback
            self.is_mysql = False
            conn = sqlite3.connect(SQLITE_DB_PATH, check_same_thread=False)
            conn.row_factory = sqlite3.Row
            conn.execute("PRAGMA foreign_keys = ON;")
            return conn

    def _init_db(self):
        conn = self._get_connection()
        cursor = conn.cursor()

        # Create Schema (compatible with both MySQL and SQLite)
        if self.is_mysql:
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                location VARCHAR(150),
                role VARCHAR(50) DEFAULT 'farmer',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS crops (
                crop_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                crop_name VARCHAR(100) NOT NULL,
                season VARCHAR(50) NOT NULL,
                area DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_crops_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS soil_details (
                soil_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                soil_type VARCHAR(100) NOT NULL,
                ph_level DECIMAL(4, 2) NOT NULL,
                nitrogen DECIMAL(10, 2) NOT NULL,
                phosphorus DECIMAL(10, 2) NOT NULL,
                potassium DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_soil_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS weather (
                weather_id INT AUTO_INCREMENT PRIMARY KEY,
                location VARCHAR(150) NOT NULL,
                temperature DECIMAL(5, 2) NOT NULL,
                rainfall DECIMAL(6, 2) NOT NULL,
                weather_condition VARCHAR(100) NOT NULL,
                humidity DECIMAL(5, 2) DEFAULT 72.0,
                recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS fertilizers (
                fertilizer_id INT AUTO_INCREMENT PRIMARY KEY,
                fertilizer_name VARCHAR(150) NOT NULL,
                description TEXT NOT NULL,
                application_guide TEXT NOT NULL,
                npk_ratio VARCHAR(50) DEFAULT '4:2:1',
                suitable_crops VARCHAR(255) DEFAULT 'Wheat, Rice, Maize'
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS diseases (
                disease_id INT AUTO_INCREMENT PRIMARY KEY,
                disease_name VARCHAR(150) NOT NULL,
                symptoms TEXT NOT NULL,
                treatment TEXT NOT NULL,
                affected_crops VARCHAR(255) DEFAULT 'Potato, Tomato, Wheat',
                confidence_score DECIMAL(5, 2) DEFAULT 95.0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS market_prices (
                price_id INT AUTO_INCREMENT PRIMARY KEY,
                crop_name VARCHAR(100) NOT NULL,
                market_name VARCHAR(150) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                price_date DATE NOT NULL,
                min_price DECIMAL(10, 2) DEFAULT 0.0,
                max_price DECIMAL(10, 2) DEFAULT 0.0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS recommendations (
                recommendation_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                crop_id INT,
                soil_id INT,
                fertilizer_id INT,
                recommendation_notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_rec_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
                CONSTRAINT fk_rec_crop FOREIGN KEY (crop_id) REFERENCES crops(crop_id) ON DELETE SET NULL,
                CONSTRAINT fk_rec_soil FOREIGN KEY (soil_id) REFERENCES soil_details(soil_id) ON DELETE SET NULL,
                CONSTRAINT fk_rec_fertilizer FOREIGN KEY (fertilizer_id) REFERENCES fertilizers(fertilizer_id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            """)
        else:
            # SQLite Syntax
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                phone TEXT,
                location TEXT,
                role TEXT DEFAULT 'farmer',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS crops (
                crop_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                crop_name TEXT NOT NULL,
                season TEXT NOT NULL,
                area REAL NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS soil_details (
                soil_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                soil_type TEXT NOT NULL,
                ph_level REAL NOT NULL,
                nitrogen REAL NOT NULL,
                phosphorus REAL NOT NULL,
                potassium REAL NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS weather (
                weather_id INTEGER PRIMARY KEY AUTOINCREMENT,
                location TEXT NOT NULL,
                temperature REAL NOT NULL,
                rainfall REAL NOT NULL,
                weather_condition TEXT NOT NULL,
                humidity REAL DEFAULT 72.0,
                recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS fertilizers (
                fertilizer_id INTEGER PRIMARY KEY AUTOINCREMENT,
                fertilizer_name TEXT NOT NULL,
                description TEXT NOT NULL,
                application_guide TEXT NOT NULL,
                npk_ratio TEXT DEFAULT '4:2:1',
                suitable_crops TEXT DEFAULT 'Wheat, Rice, Maize'
            );
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS diseases (
                disease_id INTEGER PRIMARY KEY AUTOINCREMENT,
                disease_name TEXT NOT NULL,
                symptoms TEXT NOT NULL,
                treatment TEXT NOT NULL,
                affected_crops TEXT DEFAULT 'Potato, Tomato, Wheat',
                confidence_score REAL DEFAULT 95.0
            );
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS market_prices (
                price_id INTEGER PRIMARY KEY AUTOINCREMENT,
                crop_name TEXT NOT NULL,
                market_name TEXT NOT NULL,
                price REAL NOT NULL,
                price_date DATE NOT NULL,
                min_price REAL DEFAULT 0.0,
                max_price REAL DEFAULT 0.0
            );
            """)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS recommendations (
                recommendation_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                crop_id INTEGER,
                soil_id INTEGER,
                fertilizer_id INTEGER,
                recommendation_notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
                FOREIGN KEY (crop_id) REFERENCES crops(crop_id) ON DELETE SET NULL,
                FOREIGN KEY (soil_id) REFERENCES soil_details(soil_id) ON DELETE SET NULL,
                FOREIGN KEY (fertilizer_id) REFERENCES fertilizers(fertilizer_id) ON DELETE SET NULL
            );
            """)
            conn.commit()

        # Seed standard initial dataset if users table is empty
        cursor.execute("SELECT COUNT(*) FROM users;")
        user_count = cursor.fetchone()
        user_count_val = user_count[0] if isinstance(user_count, tuple) else (user_count.get("COUNT(*)") if isinstance(user_count, dict) else user_count[0])

        if user_count_val == 0:
            self._seed_initial_data(cursor, conn)

        conn.close()

    def _seed_initial_data(self, cursor, conn):
        hashed_admin = get_password_hash("Admin@12345")
        hashed_farmer = get_password_hash("Farmer@12345")

        # 1. Users
        users = [
            ("Sana Mohitha", "admin@agrinova.ai", hashed_admin, "+91-9876543210", "Andhra Pradesh", "admin"),
            ("Ramesh Kumar Patel", "farmer@agrinova.ai", hashed_farmer, "+91-9876543211", "Punjab", "farmer"),
            ("Suresh Reddy", "suresh@agrinova.ai", hashed_farmer, "+91-9876543212", "Andhra Pradesh", "farmer"),
            ("Venkata Rao", "venkat@agrinova.ai", hashed_farmer, "+91-9876543213", "Andhra Pradesh", "farmer")
        ]
        ph = "%s" if self.is_mysql else "?"
        cursor.executemany(f"""
        INSERT INTO users (name, email, password, phone, location, role)
        VALUES ({ph}, {ph}, {ph}, {ph}, {ph}, {ph})
        """, users)

        # 2. Crops
        crops = [
            (1, "Wheat", "Rabi", 14.5),
            (2, "Rice (Paddy)", "Kharif", 12.0),
            (3, "Cotton", "Kharif", 8.5),
            (4, "Sugarcane", "Annual", 6.0),
            (3, "Chilli", "Rabi", 4.0),
            (4, "Maize", "Kharif", 5.5)
        ]
        cursor.executemany(f"""
        INSERT INTO crops (user_id, crop_name, season, area)
        VALUES ({ph}, {ph}, {ph}, {ph})
        """, crops)

        # 3. Soil Details
        soils = [
            (1, "Alluvial Loam", 6.8, 85.0, 44.0, 48.0),
            (2, "Clayey Loam", 7.2, 75.0, 38.0, 52.0),
            (3, "Black Soil", 7.5, 90.0, 48.0, 60.0),
            (4, "Red Sandy Loam", 6.4, 65.0, 32.0, 40.0)
        ]
        cursor.executemany(f"""
        INSERT INTO soil_details (user_id, soil_type, ph_level, nitrogen, phosphorus, potassium)
        VALUES ({ph}, {ph}, {ph}, {ph}, {ph}, {ph})
        """, soils)

        # 4. Weather
        weather_rows = [
            ("Andhra Pradesh", 28.0, 2.1, "Partly Cloudy", 72.0),
            ("Amaravati", 28.5, 1.8, "Partly Cloudy", 70.0),
            ("Guntur", 29.0, 0.0, "Sunny", 68.0),
            ("Kurnool", 31.0, 0.0, "Clear Sky", 55.0),
            ("Visakhapatnam", 27.5, 4.2, "Breezy & Humid", 82.0),
            ("Ludhiana", 24.0, 0.0, "Sunny", 62.0)
        ]
        cursor.executemany(f"""
        INSERT INTO weather (location, temperature, rainfall, weather_condition, humidity)
        VALUES ({ph}, {ph}, {ph}, {ph}, {ph})
        """, weather_rows)

        # 5. Fertilizers
        fertilizers = [
            ("Urea (46% N)", "Primary concentrated nitrogen fertilizer promoting vegetative tillering and leaf biomass.", "Apply 50-60 kg/ha in 2-3 split doses; top-dress before irrigation.", "46:0:0", "Wheat, Rice, Maize"),
            ("Di-Ammonium Phosphate (DAP 18-46-0)", "High-phosphorus basal fertilizer for root establishment and early seedling vigor.", "Apply 50 kg/ha at sowing as basal placement near the seed furrow.", "18:46:0", "Wheat, Cotton, Pulses"),
            ("Muriate of Potash (MOP 0-0-60)", "Potassium chloride providing drought resistance, disease resilience, and grain filling.", "Apply 30-40 kg/ha during final land preparation or second top-dressing.", "0:0:60", "Rice, Sugarcane, Potato"),
            ("NPK 10-26-26", "Balanced complex fertilizer ideal for heavy soils and fruit-bearing crops.", "Apply 75 kg/ha as basal dressing.", "10:26:26", "Cotton, Chilli, Groundnut"),
            ("Single Super Phosphate (SSP 16% P2O5)", "Phosphorus and sulphur source for oilseed and pulse nodulation.", "Apply 100 kg/ha basal dressing.", "0:16:0", "Mustard, Soybean, Groundnut")
        ]
        cursor.executemany(f"""
        INSERT INTO fertilizers (fertilizer_name, description, application_guide, npk_ratio, suitable_crops)
        VALUES ({ph}, {ph}, {ph}, {ph}, {ph})
        """, fertilizers)

        # 6. Diseases
        diseases = [
            ("Late Blight (Phytophthora infestans)", "Water-soaked irregular dark lesions on leaves with white fungal mildew on underside during humid weather.", "Foliar spray with Mancozeb (2.5 g/L) or Metalaxyl-Mancozeb (2 g/L) at 7-10 day intervals.", "Potato, Tomato", 96.5),
            ("Early Blight (Alternaria solani)", "Concentric target-board rings on older foliage with yellow chlorotic halos.", "Apply Chlorothalonil (2 g/L) or Azoxystrobin (1 ml/L); destroy infected crop debris.", "Tomato, Potato", 94.0),
            ("Yellow Stripe Rust (Puccinia striiformis)", "Linear yellow-orange pustules arranged in parallel stripes along leaf veins in cool conditions.", "Spray Propiconazole 25% EC (1 ml/L) or Tebuconazole upon first pustule appearance.", "Wheat, Barley", 97.2),
            ("Leaf Blast (Magnaporthe oryzae)", "Spindle-shaped elliptical lesions with grey centers and brown margins on leaves and panicle neck.", "Foliar application of Tricyclazole 75% WP (0.6 g/L); avoid excessive nitrogen top-dressing.", "Rice (Paddy)", 95.8),
            ("Powdery Mildew (Erysiphe cruciferarum)", "White powdery superficial patches covering leaves, stems, and siliquae.", "Spray Wettable Sulphur 80% WP (3 g/L) or Dinocap (1 ml/L).", "Mustard, Peas, Grapes", 93.5)
        ]
        cursor.executemany(f"""
        INSERT INTO diseases (disease_name, symptoms, treatment, affected_crops, confidence_score)
        VALUES ({ph}, {ph}, {ph}, {ph}, {ph})
        """, diseases)

        # 7. Market Prices
        prices = [
            ("Wheat", "Guntur APMC", 2450.00, "2026-11-20", 2300.00, 2600.00),
            ("Rice (Paddy)", "Vijayawada Mandi", 2280.00, "2026-11-20", 2150.00, 2400.00),
            ("Cotton", "Kurnool APMC", 6850.00, "2026-11-20", 6400.00, 7200.00),
            ("Chilli (Teja)", "Guntur Mandi", 14500.00, "2026-11-20", 13200.00, 16000.00),
            ("Maize", "Nandyal APMC", 2100.00, "2026-11-20", 1950.00, 2250.00),
            ("Wheat", "Ludhiana Mandi", 2420.00, "2026-11-20", 2320.00, 2550.00),
            ("Mustard", "Alwar APMC", 5400.00, "2026-11-20", 5100.00, 5650.00),
            ("Potato", "Agra Mandi", 1350.00, "2026-11-20", 1200.00, 1500.00)
        ]
        cursor.executemany(f"""
        INSERT INTO market_prices (crop_name, market_name, price, price_date, min_price, max_price)
        VALUES ({ph}, {ph}, {ph}, {ph}, {ph}, {ph})
        """, prices)

        # 8. Recommendations
        recs = [
            (1, 1, 1, 1, "Optimal NPK balance observed for Wheat tillering in Alluvial Loam. Apply 50 kg/ha Urea prior to CRI irrigation."),
            (2, 2, 2, 2, "Apply basal DAP at 50 kg/ha for Paddy root proliferation in Clayey Loam."),
            (3, 3, 3, 4, "Black soil exhibits high potassium reserves; apply balanced NPK 10-26-26 for boll development.")
        ]
        cursor.executemany(f"""
        INSERT INTO recommendations (user_id, crop_id, soil_id, fertilizer_id, recommendation_notes)
        VALUES ({ph}, {ph}, {ph}, {ph}, {ph})
        """, recs)

        if not self.is_mysql:
            conn.commit()

    def _normalize_sql(self, sql: str) -> str:
        """Adapts parameter placeholders for MySQL (%s) vs SQLite (?)."""
        if self.is_mysql:
            return sql.replace("?", "%s")
        else:
            return sql.replace("%s", "?")

    def fetch_all(self, sql: str, params: Tuple = ()) -> List[Dict[str, Any]]:
        conn = self._get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(self._normalize_sql(sql), params)
            if self.is_mysql:
                results = cursor.fetchall()
            else:
                columns = [col[0] for col in cursor.description] if cursor.description else []
                results = [dict(zip(columns, row)) for row in cursor.fetchall()]
            return results
        finally:
            conn.close()

    def fetch_one(self, sql: str, params: Tuple = ()) -> Optional[Dict[str, Any]]:
        conn = self._get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(self._normalize_sql(sql), params)
            if self.is_mysql:
                res = cursor.fetchone()
            else:
                row = cursor.fetchone()
                if not row:
                    return None
                columns = [col[0] for col in cursor.description] if cursor.description else []
                res = dict(zip(columns, row))
            return res
        finally:
            conn.close()

    def execute_write(self, sql: str, params: Tuple = ()) -> int:
        """Executes INSERT/UPDATE/DELETE and returns lastrowid or affected rows."""
        conn = self._get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(self._normalize_sql(sql), params)
            if not self.is_mysql:
                conn.commit()
            last_id = cursor.lastrowid or cursor.rowcount
            return last_id
        finally:
            conn.close()

    def check_health(self) -> Dict[str, Any]:
        """Diagnostic check of SQL database connectivity."""
        try:
            row = self.fetch_one("SELECT COUNT(*) as count FROM users")
            count = row["count"] if row else 0
            return {
                "status": "HEALTHY",
                "engine": "MySQL 8.0" if self.is_mysql else "SQLite (MySQL-Compatible Schema)",
                "database": MYSQL_DATABASE,
                "users_count": count
            }
        except Exception as e:
            return {
                "status": "DEGRADED",
                "error": str(e)
            }

sql_db = SQLDatabaseManager()
