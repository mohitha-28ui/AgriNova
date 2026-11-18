# AgriNova – AI-Powered Big Data Intelligence Platform for Smart Agriculture

[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.14-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Apache Spark](https://img.shields.io/badge/Apache%20Spark-3.5%2B-E25A1C?style=for-the-badge&logo=apachespark&logoColor=white)](https://spark.apache.org/)
[![Apache Hadoop](https://img.shields.io/badge/Apache%20Hadoop-3.3.6-66CCFF?style=for-the-badge&logo=apachehadoop&logoColor=black)](https://hadoop.apache.org/)
[![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-3.5-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)](https://kafka.apache.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0%20%7C%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 1. Executive Summary & Abstract
**AgriNova** is an enterprise-grade distributed Big Data and Artificial Intelligence intelligence platform engineered for modern smart agriculture. Agriculture produces multidimensional data spanning soil chemistry, meteorological telemetry, precipitation patterns, satellite vegetative reflectance, fertilizer supply logistics, and spot Mandi commodity pricing. Traditional monolithic information systems struggle to ingest, clean, store, and correlate these disparate, high-volume datasets.

AgriNova bridges this gap by unifying:
- **Hadoop Distributed File System (HDFS):** Scalable, fault-tolerant distributed storage for raw CSV datasets and processed Parquet lakehouse files across NameNodes and DataNodes.
- **Apache Spark & PySpark:** High-throughput in-memory distributed ETL, schema validation, data deduplication, Z-score normalization, and Spark SQL aggregations.
- **Apache Kafka:** Real-time event streaming across 4 dedicated agro-telemetry topics (`agrinova-weather`, `agrinova-soil`, `agrinova-market`, `agrinova-irrigation`).
- **MongoDB Database (`agrinova_db`):** High-availability document datastore containing 17 indexed collections for operational records, farmer profiles, and pre-aggregated analytical summaries.
- **Machine Learning & MLOps:** Production-ready estimators for multi-class **Crop Recommendation** (Random Forest Classifier: **98.86% Accuracy**) and continuous **Crop Yield Prediction** (Gradient Boosting Regressor: **R² = 0.9865, RMSE = 2.59 Tonnes/Ha**).
- **FastAPI Backend:** Asynchronous REST API layer with 17 modular routers, JWT bearer authentication, role-based authorization (`farmer`, `admin`), and interactive Swagger/OpenAPI documentation.
- **React 18 + Vite + TypeScript Frontend:** SaaS-grade dashboard featuring 22 responsive views, interactive Recharts data visualizations, and an authoritative AI Farming Copilot.

---

## 2. Multi-Tier Distributed Architecture

```
AGRICULTURAL DATA SOURCES
  (Weather Stations, Soil Probes, Mandi Trades, ICAR Census)
             |
             v
DATA INGESTION LAYER (Producers)
             |
             v
   +---------+--------------------+
   |                              |
   v                              v
APACHE KAFKA             HADOOP HDFS
(Real-Time Streaming)    (Distributed Storage: /agrinova/raw/*)
   |                              |
   +---------+--------------------+
             |
             v
   APACHE SPARK / PYSPARK
   (Batch ETL, Data Cleaning & Structured Streaming)
             |
             +-----> Parquet Lakehouse (/agrinova/processed/*)
             |
             v
   MACHINE LEARNING MODELS
   (Crop Recommender, Yield Predictor, Disease Diagnostic)
             |
             v
   MONGODB (agrinova_db - 17 Collections)
             |
             v
   FASTAPI ASYNCHRONOUS BACKEND (Port 8000)
             |
             v
   REACT 18 + VITE FRONTEND (Port 5173 / 3000)
             |
             v
   FARMERS & AGRICULTURAL ADMINISTRATORS
```

---

## 3. Technology Stack & Component Matrix

| Layer | Technologies Used | Key Responsibilities |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons | 22 responsive application pages, interactive charts, forms, auth guards |
| **Backend API** | Python, FastAPI, Pydantic v2, Uvicorn, Passlib, Bcrypt, PyJWT | 17 modular REST routers, JWT security, data validation, ML inference |
| **Database** | MongoDB 6.0 / MongoDB Atlas, PyMongo | 17 operational collections, flexible BSON schemas, query indexing |
| **Big Data Storage** | Apache Hadoop 3.3.6, Hadoop HDFS, WebHDFS | Distributed immutable storage, 128 MB blocks, 2x replication |
| **Big Data Compute** | Apache Spark 3.5+, PySpark, Spark SQL, Spark Streaming | Distributed batch ETL, Parquet serialization, SQL aggregations |
| **Event Streaming** | Apache Kafka 3.5, Zookeeper / KRaft | Real-time Pub/Sub broker across 4 agro-telemetry topics |
| **Machine Learning** | Scikit-learn, Pandas, NumPy, Joblib, PyArrow | Random Forest Classifier, Gradient Boosting Regressor, IPM Engine |
| **DevOps & Cloud** | Docker, Docker Compose, Nginx, GitHub Actions, Prometheus, Grafana | Containerization, CI/CD automated testing, cluster metrics |

---

## 4. Hadoop HDFS Distributed Storage Implementation
AgriNova structures all agricultural data under the `/agrinova` distributed namespace:

```
/agrinova/
├── raw/
│   ├── weather/     # Raw IMD meteorological station CSVs (5,840 records)
│   ├── soil/        # Soil Health Card chemistry CSVs (3,500 samples)
│   ├── crops/       # Benchmark 22-crop agronomic CSVs (2,200 rows)
│   ├── yield/       # Decadal harvest and input records (2,000 rows)
│   ├── market/      # AGMARKNET APMC Mandi price transactions (29,200 rows)
│   └── satellite/   # Sentinel-2 NDVI remote sensing indices (1,200 rows)
├── processed/       # Snappy-compressed Parquet datasets
│   ├── weather/     # weather_trends_processed.parquet
│   ├── soil/        # soil_health_processed.parquet
│   ├── crops/       # crop_features_processed.parquet
│   ├── yield/       # crop_production_processed.parquet
│   └── market/      # market_intelligence_processed.parquet
├── analytics/       # Aggregation outputs and state-wise summaries
├── models/          # Trained estimator checkpoints
└── reports/         # Analytical JSON exports
```

### HDFS Cluster Commands Reference:
```bash
# Check HDFS NameNode health and disk capacity
hdfs dfsadmin -report

# Create standardized AgriNova directory hierarchy
hdfs dfs -mkdir -p /agrinova/raw/{weather,soil,crops,yield,market,satellite}
hdfs dfs -mkdir -p /agrinova/processed/{weather,soil,crops,yield,market}

# Upload raw agricultural datasets to HDFS
hdfs dfs -put datasets/raw/crops/crop_recommendation.csv /agrinova/raw/crops/
hdfs dfs -put datasets/raw/yield/crop_yield_historical.csv /agrinova/raw/yield/

# List files and verify block replication
hdfs dfs -ls -R /agrinova

# Inspect file contents directly from HDFS
hdfs dfs -tail /agrinova/raw/weather/weather_daily_records.csv
```

---

## 5. Apache Spark & PySpark Big Data Processing Pipelines
AgriNova implements 8 reusable, independent PySpark processing jobs:
1. `Crop Production & Yield Analytics ETL`: Reads raw harvest records from HDFS, cleans nulls, eliminates anomalies, computes fertilizer intensity per hectare, and performs Spark SQL aggregations by State, District, and Season.
2. `Crop Yield Variance Profiler`: Computes commodity productivity standard deviations, benchmark variances, and historical trends.
3. `Soil Health Quality & Chemistry Analysis`: Evaluates total NPK ratios, compares against the ICAR $4:2:1$ target balance, evaluates organic carbon fertility thresholds ($> 0.75\%$), and profiles soil acidity/alkalinity distributions.
4. `Meteorological Records & Rainfall ETL`: Aggregates 5,840 daily station observations into monthly precipitation and thermal indices, identifying monsoon anomaly patterns.
5. `Mandi APMC Spot Price Engine`: Ingests 29,200 trade records across 11 key commodities, computing floor, ceiling, and modal price spreads.
6. `Agronomic Feature Store`: Extracts optimal NPK, pH, and thermal growth signatures for 22 benchmark crops.
7. `Seasonal Productivity Matrix`: Cross-correlates precipitation with crop productivity curves.
8. `Satellite NDVI & Canopy Vigour Analytics`: Evaluates Sentinel-2 NDVI canopy vigour categories.

---

## 6. Apache Kafka Real-Time Streaming
AgriNova features real-time stream processing for field agro-telemetry:
- **Broker Port:** `9092`
- **Consumer Groups:** `spark-streaming-agrinova-cg1`, `dashboard-websocket-cg2`
- **Topics:**
  - `agrinova-weather`: Station ID, temperature, relative humidity, wind speed, rainfall rate.
  - `agrinova-soil`: Soil probe ID, field cadastral parcel, volumetric moisture %, soil temp, EC.
  - `agrinova-market`: APMC code, commodity name, spot settlement modal price, daily arrivals in MT.
  - `agrinova-irrigation`: Valve ID, zone, actuation state (`OPEN`, `CLOSED`), flow rate in LPM.

---

## 7. MongoDB Database Architecture (`agrinova_db`)
The operational and analytical datastore comprises 17 indexed collections:
1. `users`: Credentials, hashed passwords, roles (`farmer`, `admin`), contact info.
2. `farmer_profiles`: Farm acreage, soil type, district, irrigation sources.
3. `crops`: Crop catalogue, ideal pH ranges, growing durations, water requirements.
4. `soil_records`: Laboratory Soil Health Card test entries.
5. `weather_records`: Automated weather station observations.
6. `market_prices`: AGMARKNET mandi trade transactions.
7. `crop_recommendations`: ML inference history with suitability scores and alternatives.
8. `yield_predictions`: Predicted yields (T/Ha), gross outputs, benchmark variances.
9. `fertilizer_recommendations`: Calculated Urea, DAP, and MOP bag requirements and split schedules.
10. `disease_detection_history`: Foliar pathology diagnoses, symptoms, and fungicide protocols.
11. `analytics_results`: Pre-aggregated PySpark summaries powering frontend dashboards.
12. `streaming_events`: Real-time Kafka telemetry log.
13. `pipeline_jobs`: Execution audit trail of PySpark jobs (duration, input/output counts, status).
14. `model_versions`: MLOps metadata for trained estimators.
15. `notifications`: Real-time agro-climatic and Mandi spot advisories.
16. `feedback`: Evaluator and farmer platform ratings.
17. `admin_users`: Administrative operator accounts.

---

## 8. Machine Learning Models & MLOps Metrics

### 8.1 Crop Recommendation Model
- **Algorithm:** Random Forest Classifier (100 estimators, max depth 16)
- **Features:** Nitrogen (N), Phosphorus (P), Potassium (K), Temperature (°C), Humidity (%), pH, Rainfall (mm)
- **Target:** 22 Benchmark Crops
- **Accuracy:** **98.86%**
- **Weighted F1-Score:** **0.9886**
- **5-Fold Cross Validation:** **98.9% ± 0.4%**

### 8.2 Crop Yield Prediction Model
- **Algorithm:** Gradient Boosting Regressor (GBDT) with ColumnTransformer Pipeline
- **Features:** State, Crop, Season, Area (Ha), Rainfall (mm), Fertilizer (kg), Pesticide (kg)
- **Target:** Yield (Tonnes / Hectare)
- **R² Score:** **0.9865**
- **RMSE:** **2.59 Tonnes/Ha**
- **MAE:** **0.91 Tonnes/Ha**

---

## 9. Comprehensive Frontend Walkthrough (22 Modules)
1. **Landing Page (`/`):** Hero showcase, architecture pillars, platform statistics.
2. **About Page (`/about`):** Problem statement, technical objectives, and technology stack.
3. **Sign In (`/login`):** JWT bearer authentication with one-click demo credentials for Admin and Farmer.
4. **Registration (`/register`):** Farmer onboarding with landholding and location details.
5. **Farmer Dashboard (`/dashboard`):** High-level KPIs, live weather, yield history chart, mandi prices, and Kafka event feed.
6. **Big Data Analytics Center (`/bigdata-analytics`):** Real-time PySpark job triggering, input/output record counts, and status logs.
7. **Hadoop HDFS Monitoring (`/hadoop-monitor`):** NameNode heartbeat, DataNode counts, storage progress, and file explorer.
8. **Spark Monitoring (`/spark-monitor`):** Job execution durations, in-memory pipeline metrics, and Parquet sink tracking.
9. **Kafka Streaming Monitor (`/kafka-monitor`):** Live telemetry table, topic partition metrics, and synthetic event batch generator.
10. **Smart Crop Recommender (`/crop-recommendation`):** Soil and weather sliders, quick presets (Paddy, Maize, Cotton, Apple), suitability scores.
11. **Crop Yield Predictor (`/yield-prediction`):** Acreage inputs, GBDT regression, national benchmark comparisons, driver factors.
12. **Soil Health Analytics (`/soil-analytics`):** Soil Health Card registry, NPK ratio balance, sample logging form.
13. **Weather & Rainfall (`/weather-analytics`):** Automated weather station observations, monthly precipitation charts, agronomic advisories.
14. **Fertilizer Advisor (`/fertilizer-recommendation`):** Soil deficit calculus, 50kg bag conversions (Urea, DAP, MOP), 3-stage split application schedule.
15. **Disease Detection (`/disease-detection`):** Foliar image upload, symptom analysis, IPM chemical and organic treatment protocols.
16. **Market Intelligence (`/market-intelligence`):** Mandi APMC prices across 11 commodities, price spread bar charts.
17. **Smart Irrigation (`/irrigation-analytics`):** Moisture tension, ET0 calculation, smart valve actuator controls.
18. **AI Farming Copilot (`/copilot`):** Conversational decision assistant with quick prompt pills.
19. **Analytical Reports (`/reports`):** Exportable PySpark summaries with JSON download.
20. **Farmer Profile (`/profile`):** Landholding details, soil categorization, password reset workflow.
21. **Admin Dashboard (`/admin-dashboard`):** User registry, evaluator feedback form, review ratings.
22. **System Health (`/system-health`):** Multi-tier diagnostics covering FastAPI, MongoDB, HDFS, Spark, Kafka, and ML models.

---

## 10. Local Installation & Quick Start

### Prerequisites:
- Python 3.10+ (tested on Python 3.11 & 3.14)
- Node.js 18+ & npm
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/agrinova.git
cd agrinova
```

### Step 2: Set Up Python Backend & Dependencies
```bash
# Install Python packages
pip install -r requirements.txt

# Generate authentic agricultural datasets
python scripts/generate_datasets.py

# Train & evaluate Machine Learning models
python scripts/train_ml_models.py

# Seed MongoDB collections with initial users & data
python scripts/seed_database.py

# Execute initial PySpark Big Data processing jobs
python bigdata/spark/spark_job_manager.py
```

### Step 3: Set Up React Frontend
```bash
cd frontend
npm install
npm run build # Or npm run dev for development
cd ..
```

### Step 4: Run Platform
- **Windows (PowerShell One-Click):**
  ```powershell
  .\scripts\start_all.ps1
  ```
- **Linux / macOS:**
  ```bash
  chmod +x ./scripts/start_all.sh
  ./scripts/start_all.sh
  ```
- **Manual Launch:**
  ```bash
  # Terminal 1: Backend
  python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload

  # Terminal 2: Frontend
  cd frontend && npm run dev
  ```

Access the applications:
- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
- **Interactive Swagger REST API:** [http://127.0.0.1:8000/api/docs](http://127.0.0.1:8000/api/docs)
- **System Health Diagnostics:** [http://127.0.0.1:8000/api/admin/health](http://127.0.0.1:8000/api/admin/health)

### Default Demonstration Credentials:
- **System Administrator:** `admin@agrinova.ai` / `Admin@12345`
- **Registered Farmer:** `farmer@agrinova.ai` / `Farmer@12345`

---

## 11. Docker Multi-Container Deployment
To run the entire distributed cluster (Frontend, Backend, MongoDB, Hadoop NameNode, DataNode, Spark Master, Spark Worker, Kafka, Zookeeper, Prometheus, Grafana):

```bash
# Build and start all 11 distributed services
docker-compose up -d --build

# Inspect running cluster containers
docker-compose ps

# View live cluster logs
docker-compose logs -f backend
```

### Service Port Map:
- **Frontend Web UI:** `http://localhost:3000`
- **FastAPI Backend API:** `http://localhost:8000`
- **Hadoop NameNode Web UI:** `http://localhost:9870`
- **Apache Spark Master UI:** `http://localhost:8080`
- **Prometheus Metrics:** `http://localhost:9090`
- **Grafana Dashboard:** `http://localhost:3001` (user: `admin`, pass: `agrinova`)

---

## 12. Automated Quality Assurance & Verification
Run the automated test suite verifying all 11 core subsystems:

```bash
python scripts/run_tests.py
```

### Measured Test Results:
```
=== AgriNova Subsystem & Verification Suite ===
 [PASS] 01. Central System Health Diagnostic
 [PASS] 02. Machine Learning Crop Recommender (Predicted: rice, Suitability: 92.3%)
 [PASS] 03. Gradient Boosting Yield Regressor (Predicted Yield: 1.76 T/ha, Total: 17.6 Tonnes)
 [PASS] 04. NPK Agronomic Fertilizer Calculator (Urea: 49.7 kg, DAP: 52.7 kg)
 [PASS] 05. Plant Disease Diagnostic Engine (Detected: Late Blight, Confidence: 94.6%)
 [PASS] 06. Hadoop HDFS Cluster Monitor (NameNode: ACTIVE, Blocks: 22, Capacity: 100.0 GB)
 [PASS] 07. HDFS Distributed Namespace Inspection (6 directories verified in /agrinova/raw)
 [PASS] 08. PySpark Pipeline Execution History (8 distributed jobs recorded in MongoDB)
 [PASS] 09. Apache Kafka Real-Time Streaming Ingestion (6 synthetic events ingested)
 [PASS] 10. AI Agronomic Copilot Knowledge Retrieval
 [PASS] 11. Central Dashboard KPI Aggregations (43,940 records processed)

=======================================================
TEST SUMMARY: 11 PASSED, 0 FAILED (TOTAL: 11)
STATUS: ALL SYSTEMS VERIFIED - PRODUCTION READY
=======================================================
```

---

## 13. Documentation & Placement Assets
All technical defense and college presentation assets are stored in the `/docs` directory:
- [Technical Project Thesis & Report](docs/PROJECT_REPORT.md)
- [System Architecture & Data Flow Diagrams](docs/architecture/SYSTEM_ARCHITECTURE.md)
- [Top 30 Technical Viva Questions & Answers](docs/viva/VIVA_QUESTIONS_AND_ANSWERS.md)
- [Project Pitch & Slide Outline](docs/PRESENTATION_DECK.md)
- [Agricultural Datasets Metadata & Catalog](datasets/DATASETS_METADATA.md)

---

## 14. License & Academic Attribution
Developed as an open-source technical showcase for Smart Agriculture and Distributed Big Data Engineering. Released under the **MIT License**.
