# AgriNova Presentation Deck & Technical Slide Outline

> **Tagline:** Smart Farming, Better Tomorrow.  
> **Full Title:** AgriNova – AI and Big Data Powered Smart Agriculture Intelligence and Predictive Analytics Platform.
## College Major Project & Placement Technical Demonstration

---

### Slide 1: Title & Overview
- **Title:** AgriNova – AI-Powered Big Data Intelligence Platform for Smart Agriculture
- **Tagline:** Unifying Hadoop HDFS, Apache Spark, Kafka Streaming, MongoDB, and Machine Learning
- **Target:** Smart Farming, Agro-Informatics, Enterprise Big Data Analytics
- **Author:** Student / Lead Software & Data Engineer

---

### Slide 2: The Problem Space in Modern Agriculture
- **Data Fragmentation:** Soil test cards, weather stations, Mandi spot trades, and historical harvest census exist in isolated silos.
- **Volume & Velocity Challenges:** Traditional relational databases buckle under gigabytes of raw IoT sensor feeds and census archives.
- **Predictive Gap:** Farmers lack accessible, machine-learning-backed insights for crop selection, exact fertilizer bag calculation, disease remediation, and yield forecasting.

---

### Slide 3: The AgriNova Solution Architecture
- **Layer 1: Data Ingestion:** Real-time IoT sensors (Soil & Weather) + APMC Mandi feeds + Historical ICAR datasets.
- **Layer 2: Streaming:** Apache Kafka (4 dedicated topics: `agrinova-weather`, `soil`, `market`, `irrigation`).
- **Layer 3: Distributed Storage:** Hadoop HDFS cluster (`/agrinova/raw/*` and `/agrinova/processed/*`).
- **Layer 4: Processing Engine:** Apache Spark & PySpark in-memory distributed ETL and SQL aggregations outputting Parquet.
- **Layer 5: Database & Serving:** MongoDB document store (`agrinova_db` with 17 collections) + FastAPI asynchronous backend.
- **Layer 6: User Interface:** React 18 + Vite + TypeScript + Tailwind CSS with 22 dedicated functional modules.

---

### Slide 4: Big Data Implementation Details
- **Hadoop HDFS:**
  - NameNode health, DataNodes live status, block distribution, $2\times$ replication factor.
  - Standardized namespace hierarchy for raw CSVs and processed Parquet.
- **Apache Spark & PySpark:**
  - 8 independent analytical pipelines.
  - Cleansing, deduplication, Z-score normalization, Spark SQL group aggregations.
  - Columnar Parquet generation with snappy compression.

---

### Slide 5: Machine Learning & Agronomic Intelligence
- **Crop Recommender:**
  - Random Forest Classifier (100 estimators, max depth 16).
  - Accuracy: **98.86%**, F1-Score: **0.9886**.
  - Evaluates NPK, ambient temp, relative humidity, pH, and rainfall.
- **Crop Yield Predictor:**
  - Gradient Boosting Regressor (GBDT) with ColumnTransformer.
  - **R² Score: 0.9865**, **RMSE: 2.59 Tonnes/Ha**, **MAE: 0.91 Tonnes/Ha**.
- **Fertilizer Advisor:**
  - ICAR $4:2:1$ target balance. Converts nutrient deficits into commercial Urea ($46\%$), DAP ($18:46:0$), and MOP ($60\%$) $50\text{ kg}$ bags across a 3-stage split schedule.

---

### Slide 6: Plant Pathology & AI Farming Copilot
- **Disease Detection:**
  - Integrated pest management (IPM) knowledge engine identifying 15 foliar diseases (Potato Late Blight, Tomato TYLCV, Rice Blast).
  - Supplies verified organic and chemical fungicide protocols.
- **AI Farming Copilot:**
  - Conversational decision assistant delivering authoritative, non-fabricated agronomic advice for crop planning, irrigation windows, and pest remediation.

---

### Slide 7: Live Demonstration Walkthrough
1. **Farmer Dashboard:** Executive KPIs (43,940 records, 8 Spark jobs, live weather, yield trends).
2. **Big Data Analytics Center:** HDFS capacity, DataNode health, real-time pipeline execution trigger.
3. **Kafka Streaming Monitor:** Ingestion buffer across 4 topics with live synthetic event generation.
4. **Interactive ML Doctor:** Real-time crop recommendation and yield regression inference.

---

### Slide 8: Technical Defense Q&A
- Demonstrates deep mastery of distributed computing, Big Data architectures, CAP theorem tradeoffs, in-memory DAG execution in Spark, and ML model evaluation.
