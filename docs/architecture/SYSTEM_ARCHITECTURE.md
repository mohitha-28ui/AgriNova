# AgriNova System Architecture & Data Engineering Specification
## High-Level Architecture, ETL Pipeline, and Database Schema

### 1. High-Level Distributed Architecture Diagram

```mermaid
flowchart TD
    subgraph Data Sources Layer
        S1["Automated Weather Stations (AWS)"]
        S2["IoT Field Probes (Soil Moisture & EC)"]
        S3["AGMARKNET Mandi Price Feeds"]
        S4["Historical ICAR & FAO Harvest Statistics"]
    end

    subgraph Real-Time Streaming Ingestion
        KP["AgriNova Kafka Event Producers"]
        KB["Apache Kafka Cluster\n(4 Topics: agrinova-weather, soil, market, irrigation)"]
        S1 --> KP
        S2 --> KP
        S3 --> KP
        KP --> KB
    end

    subgraph Distributed Big Data Storage (Hadoop HDFS)
        HDFS["Hadoop Distributed File System (HDFS 3.3.6)\nNameNode (Port 9870) + DataNodes\n/agrinova/raw/*\n/agrinova/processed/*\n/agrinova/analytics/*"]
        S4 --> HDFS
    end

    subgraph Distributed Processing Engine (Apache Spark & PySpark)
        SparkSS["Spark Structured Streaming\n(Tumbling Window Ingestion)"]
        SparkBatch["PySpark Distributed Batch ETL\n(Schema Validation, Deduplication, Feature Store)"]
        KB --> SparkSS
        HDFS <--> SparkBatch
        SparkBatch --> HDFS
    end

    subgraph Serving & Operational Layer
        MongoDB[("MongoDB 6.0 (agrinova_db)\n17 Collections: operational & aggregated analytics")]
        FastAPI["FastAPI High-Performance Async Backend\n(17 Routers, JWT Auth, Swagger UI)"]
        SparkSS --> MongoDB
        SparkBatch --> MongoDB
        FastAPI <--> MongoDB
        FastAPI <--> HDFS
    end

    subgraph Client Experience Layer
        Frontend["AgriNova Web Platform (React 18 + TS + Tailwind)\n22 Enterprise Pages & Live Visualizations"]
        FastAPI <--> Frontend
    end
```

---

### 2. PySpark Data Processing Flow (ETL Architecture)

```mermaid
sequenceDiagram
    autonumber
    actor Farmer as Farmer / Admin
    participant Web as React Web Client
    participant API as FastAPI Backend
    participant HDFS as Hadoop HDFS Cluster
    participant Spark as Apache Spark / PySpark
    participant DB as MongoDB (agrinova_db)

    Farmer->>Web: Interacts with Dashboard / Triggers Pipeline
    Web->>API: POST /api/bigdata/spark/run { pipeline_name: 'ALL' }
    API->>Spark: Invokes SparkJobManager.run_all_pipelines()
    Spark->>HDFS: Reads Raw Datasets (/agrinova/raw/*.csv)
    Note over Spark: Schema Validation, Deduplication, NPK Z-Score Normalization
    Spark->>Spark: Executes Spark SQL Analytical Aggregations
    Spark->>HDFS: Writes Partitioned Parquet (/agrinova/processed/*.parquet)
    Spark->>DB: Upserts Analytical Documents (analytics_results, pipeline_jobs)
    API-->>Web: Returns Execution Success (Duration, Records In/Out)
    Web-->>Farmer: Live Dashboard Cards & Interactive Recharts Update
```

---

### 3. MongoDB Document Database Design (`agrinova_db`)

The database architecture consists of 17 dedicated collections:

```mermaid
erDiagram
    USERS ||--o{ FARMER_PROFILES : "has one"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ FEEDBACK : "submits"
    CROPS ||--o{ CROP_RECOMMENDATIONS : "classified into"
    CROPS ||--o{ YIELD_PREDICTIONS : "predicted for"
    SOIL_RECORDS ||--o{ FERTILIZER_RECOMMENDATIONS : "informs"
    WEATHER_RECORDS ||--o{ PIPELINE_JOBS : "processed in"
    STREAMING_EVENTS }|--|| KAFKA_TOPICS : "ingested from"

    USERS {
        string _id PK
        string email UK
        string hashed_password
        string full_name
        string role
        string phone
        boolean is_active
        string created_at
    }

    FARMER_PROFILES {
        string _id PK
        string user_id FK
        string full_name
        string farm_name
        string state
        string district
        float total_land_acres
        string soil_type
        list primary_crops
    }

    CROP_RECOMMENDATIONS {
        string _id PK
        string recommended_crop
        float suitability_score
        list alternative_crops
        string soil_suitability
        string weather_suitability
        string explanation
        string timestamp
    }

    YIELD_PREDICTIONS {
        string _id PK
        string crop
        string state
        string season
        float area_hectares
        float predicted_yield_tonnes_per_ha
        float predicted_total_production_tonnes
        float benchmark_yield_tonnes_per_ha
        string yield_trend
        string timestamp
    }

    SOIL_RECORDS {
        string _id PK
        string Sample_ID UK
        string State
        string District
        string Soil_Type
        float Nitrogen_kg_ha
        float Phosphorus_kg_ha
        float Potassium_kg_ha
        float Soil_pH
        float Organic_Carbon_pct
        string Health_Status
    }

    PIPELINE_JOBS {
        string _id PK
        string job_id UK
        string job_name
        string engine
        string input_hdfs_path
        int input_records
        int output_records
        float duration_seconds
        string status
        string executed_at
    }
```
