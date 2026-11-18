# AgriNova: Technical Viva & Placement Interview Preparation Guide
## Top 30 Placement & Defense Questions (Big Data, Distributed Systems, ML & Architecture)

---

### Q1. Why did you choose Hadoop HDFS for AgriNova instead of storing everything in a relational database or object storage like Amazon S3?
**Answer:**
Agricultural datasets aggregate high-velocity IoT telemetric time-series (soil moisture, leaf wetness), meteorological satellite imagery/indices (NDVI/EVI), and decadal district harvest records from ICAR and APMC Mandis (amounting to tens of gigabytes over time).
1. **Block-Structured Scalability:** HDFS splits files into large blocks (default 128 MB) distributed across commodity DataNodes. It scales horizontally simply by appending DataNodes, eliminating the storage ceilings and expensive scaling hardware of traditional RDBMS.
2. **Data Locality for Spark:** Apache Spark achieves near-linear distributed compute speedup by scheduling executors on the exact physical nodes hosting the HDFS blocks (Data Locality: `PROCESS_LOCAL` and `NODE_LOCAL`), avoiding heavy network saturation when reading multi-gigabyte agricultural tables.
3. **Write-Once-Read-Many (WORM):** Raw agricultural telemetry and historical census tables are immutable sensor recordings. HDFS's append-only model is architecturally aligned with this access pattern.

---

### Q2. How does Apache Spark's in-memory processing differ from traditional Hadoop MapReduce in AgriNova's ETL pipeline?
**Answer:**
- **MapReduce Disk Bottlenecks:** Traditional Hadoop MapReduce writes all intermediate shuffle and partition states to disk (`dfs.data.dir`), incurring severe disk I/O and serialization penalties across iterative stages.
- **Spark Resilient Distributed Datasets (RDDs) & DataFrames:** Spark maintains execution graphs as Directed Acyclic Graphs (DAGs) and executes transformations in-memory (RAM) across JVM executor heaps. In our 8 PySpark pipelines (such as soil health classification and seasonal yield correlations), data stays cached in memory between transformations, running **up to 100x faster** than disk-bound MapReduce jobs.

---

### Q3. Explain the role of Apache Kafka in AgriNova. How does it handle streaming sensor telemetry?
**Answer:**
Agricultural sensors (soil moisture probes, weather stations) emit readings asynchronously every few seconds.
1. **Decoupled Ingestion & Backpressure:** Direct HTTP writes from thousands of field probes into a database would create thread exhaustion and connection lock contention. Kafka acts as an elastic message buffer, absorbing velocity spikes.
2. **Topic Partitioning:** We maintain 4 topics: `agrinova-weather`, `agrinova-soil`, `agrinova-market`, and `agrinova-irrigation`. Each topic is partitioned (3 partitions) allowing parallel consumption by Spark Structured Streaming consumer groups (`spark-streaming-agrinova-cg1`) and dashboard WebSocket broadcasters.
3. **Fault Tolerance:** Kafka persists messages on disk with configurable retention, allowing consumer offsets to resume exactly where they left off in case of temporary node reboots.

---

### Q4. Why was MongoDB chosen as the serving layer instead of PostgreSQL?
**Answer:**
1. **Flexible Polymorphic Schemas:** Agricultural entities exhibit varying dimensional schemas. For example, a soil test record in Punjab includes micronutrients (Zinc, Iron, Manganese), whereas a basic field test in a rural Mandi may only record N-P-K and pH. MongoDB's BSON document model natively supports polymorphic schema variations without complex schema migrations or sparse SQL null columns.
2. **Spark-to-MongoDB Connector:** PySpark aggregations output denormalized analytical documents directly matching frontend dashboard requirements, avoiding expensive multi-table relational joins during web client reads.
3. **Atlas Global Replication:** MongoDB Atlas provides native sharding and replica set failover with sub-second read latency for farmer queries.

---

### Q5. What Machine Learning algorithms were selected for Crop Recommendation and Yield Prediction, and what were the measured evaluation metrics?
**Answer:**
- **Crop Recommendation (Multi-class Classification):**
  - **Algorithm:** Random Forest Classifier (100 estimators, max depth 16) with StandardScaler preprocessing.
  - **Why:** Random Forest handles non-linear feature boundaries and multi-collinear interactions between soil NPK, pH, and precipitation effectively without overfitting.
  - **Metrics:** **98.86% Accuracy**, Weighted F1-score: **0.9886**, 5-Fold Cross-Validation: **98.9% ± 0.4%**.
- **Crop Yield Prediction (Continuous Regression):**
  - **Algorithm:** Gradient Boosting Regressor (GBDT) with ColumnTransformer (OneHotEncoder for categorical features: State, Crop, Season; StandardScaler for numerical: Area, Rainfall, Fertilizer, Pesticide).
  - **Why:** Gradient boosting iteratively minimizes residuals using decision trees as weak learners, capturing regional productivity curves.
  - **Metrics:** **R² Score: 0.9865**, **RMSE: 2.59 Tonnes/Ha**, **MAE: 0.91 Tonnes/Ha**.

---

### Q6. How does the Fertilizer Recommendation engine calculate exact commercial fertilizer bags?
**Answer:**
The engine implements agronomic deficit calculus based on ICAR benchmark standards:
1. It queries the target crop's optimal nutrient requirement (e.g. Wheat: $120\text{ kg N}, 60\text{ kg P}_2\text{O}_5, 40\text{ kg K}_2\text{O}$).
2. It subtracts available soil test levels to determine net nutrient deficits ($\Delta N, \Delta P, \Delta K$).
3. It maps deficits to commercial formulations:
   - **DAP ($18\%\text{ N}, 46\%\text{ P}_2\text{O}_5$):** Satisifies Phosphorus deficit: $\text{DAP (kg)} = \Delta P \times 2.17$.
   - **Urea ($46\%\text{ N}$):** Calculates remaining Nitrogen after DAP contribution: $\text{Urea (kg)} = (\Delta N - \text{DAP}_N) \times 2.17$.
   - **MOP ($60\%\text{ K}_2\text{O}$):** $\text{MOP (kg)} = \Delta K \times 1.67$.
4. It converts kilograms into standard $50\text{ kg}$ bags and outputs a 3-stage split schedule (30% Basal at sowing, 40% Tillering at 25-30 DAS, 30% Panicle emergence at 50-60 DAS) to prevent nitrogen leaching.

---

### Q7. How does the system handle high-availability and failover?
**Answer:**
- **HDFS:** Active NameNode with secondary NameNode checkpointing and automated block replication ($2\times$ factor). If a DataNode crashes, the NameNode detects missed heartbeats (10 minutes) and replicates under-replicated blocks to surviving DataNodes.
- **Kafka:** Multiple broker replicas and Zookeeper/KRaft quorum leader election ensure zero message loss if a broker goes offline.
- **FastAPI Backend:** Stateless REST microservice running under Uvicorn workers behind Nginx reverse proxy load balancers.
- **MongoDB:** Distributed 3-node replica set with automated primary election in under 2 seconds.

---

### Q8. What is the significance of Parquet format in AgriNova's Big Data pipeline?
**Answer:**
All PySpark ETL jobs serialize cleaned data to Apache Parquet (`/agrinova/processed/*.parquet`):
1. **Columnar Storage:** Only requested feature columns are loaded into RAM during analytical queries (Projection Pushdown), drastically reducing memory and I/O footprint compared to row-based CSV.
2. **Snappy Compression:** Reduces raw dataset storage footprint by **up to 75%** while enabling fast decompression.
3. **Embedded Schema Metadata:** Stores schema data types and column statistics (min/max), enabling predicate pushdown (skipping whole row-groups that do not match the query filter).
