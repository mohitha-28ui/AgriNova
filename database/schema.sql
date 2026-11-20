-- ======================================================================
-- AgriNova Smart Agriculture Database Schema
-- Database: agrinova_db (MySQL 8.0+ Compatible)
-- Primary Relational Store for 7 Operational Modules
-- ======================================================================

CREATE DATABASE IF NOT EXISTS agrinova_db;
USE agrinova_db;

-- ----------------------------------------------------------------------
-- 1. MODULE 1: USERS TABLE
-- ----------------------------------------------------------------------
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

-- ----------------------------------------------------------------------
-- 2. MODULE 2: CROPS TABLE
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS crops (
    crop_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    season VARCHAR(50) NOT NULL,
    area DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_crops_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------
-- 3. MODULE 3: SOIL DETAILS TABLE
-- ----------------------------------------------------------------------
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

-- ----------------------------------------------------------------------
-- 4. MODULE 4: WEATHER TABLE
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS weather (
    weather_id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(150) NOT NULL,
    temperature DECIMAL(5, 2) NOT NULL,
    rainfall DECIMAL(6, 2) NOT NULL,
    weather_condition VARCHAR(100) NOT NULL,
    humidity DECIMAL(5, 2) DEFAULT 72.0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------
-- 5. MODULE 5: FERTILIZERS TABLE
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fertilizers (
    fertilizer_id INT AUTO_INCREMENT PRIMARY KEY,
    fertilizer_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    application_guide TEXT NOT NULL,
    npk_ratio VARCHAR(50) DEFAULT '4:2:1',
    suitable_crops VARCHAR(255) DEFAULT 'Wheat, Rice, Maize'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------
-- 6. MODULE 6: DISEASES TABLE
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS diseases (
    disease_id INT AUTO_INCREMENT PRIMARY KEY,
    disease_name VARCHAR(150) NOT NULL,
    symptoms TEXT NOT NULL,
    treatment TEXT NOT NULL,
    affected_crops VARCHAR(255) DEFAULT 'Potato, Tomato, Wheat',
    confidence_score DECIMAL(5, 2) DEFAULT 95.0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------
-- 7. MODULE 7: MARKET PRICES TABLE
-- ----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS market_prices (
    price_id INT AUTO_INCREMENT PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,
    market_name VARCHAR(150) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    price_date DATE NOT NULL,
    min_price DECIMAL(10, 2) DEFAULT 0.0,
    max_price DECIMAL(10, 2) DEFAULT 0.0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------
-- 8. RECOMMENDATIONS TABLE (Integration between Crops, Soil, Fertilizers)
-- ----------------------------------------------------------------------
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
