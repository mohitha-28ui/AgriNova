# AgriNova Agricultural Dataset Metadata & Catalog
## Standard Compliance: ICAR, FAOSTAT, and Mandi APMC

This catalog details the public agricultural datasets utilized and curated within the AgriNova Big Data platform.

---

### 1. Crop Recommendation Dataset
- **File**: `datasets/raw/crops/crop_recommendation.csv`
- **Origin & Reference**: Inspired by ICAR (Indian Council of Agricultural Research) & benchmark Kaggle Agro datasets.
- **Record Count**: 2,200 rows
- **Target Variable**: `label` (22 distinct crops: rice, maize, chickpea, kidneybeans, pigeonpeas, mothbeans, mungbean, blackgram, lentil, pomegranate, banana, mango, grapes, watermelon, muskmelon, apple, orange, papaya, coconut, cotton, jute, coffee).
- **Features**:
  - `N`: Soil Nitrogen content ratio (kg/ha)
  - `P`: Soil Phosphorus content ratio (kg/ha)
  - `K`: Soil Potassium content ratio (kg/ha)
  - `temperature`: Ambient temperature in degrees Celsius (°C)
  - `humidity`: Relative atmospheric humidity (%)
  - `ph`: Soil acidity / alkalinity potential (pH scale 0-14)
  - `rainfall`: Cumulative precipitation in millimeters (mm)
- **License**: Creative Commons Attribution 4.0 International (CC BY 4.0)

---

### 2. Historical Crop Yield & Inputs Dataset
- **File**: `datasets/raw/yield/crop_yield_historical.csv`
- **Origin & Reference**: Ministry of Agriculture & Farmers Welfare, Government of India (DES crop statistics 2015-2024).
- **Record Count**: 2,000 rows
- **Target Variable**: `Yield_Tonnes_Per_Hectare` & `Production_Tonnes`
- **Features**:
  - `Record_ID`: Unique integer sequence
  - `State`: Agro-climatic state jurisdiction (Punjab, Haryana, UP, MP, Maharashtra, etc.)
  - `District`: Administrative district
  - `Crop`: Commodity variety (Rice, Wheat, Maize, Cotton, Sugarcane, Soybean, etc.)
  - `Crop_Year`: Year of harvest (2015-2024)
  - `Season`: Cropping season (Kharif, Rabi, Summer, Whole Year)
  - `Area_Hectares`: Cultivated acreage
  - `Annual_Rainfall_mm`: District annual rainfall in mm
  - `Fertilizer_Used_kg`: Total fertilizer applied (kg)
  - `Pesticide_Used_kg`: Total plant protection chemicals (kg)
  - `Production_Tonnes`: Gross output harvest
  - `Yield_Tonnes_Per_Hectare`: Metric agricultural productivity index
- **License**: Open Government Data License (OGDL India)

---

### 3. Comprehensive Soil Health & Chemistry Dataset
- **File**: `datasets/raw/soil/soil_health_records.csv`
- **Origin & Reference**: Soil Health Card Scheme standard format.
- **Record Count**: 3,500 samples
- **Features**:
  - `Sample_ID`: Unique sample alphanumeric token
  - `State`, `District`: Sampling geo-locality
  - `Soil_Type`: Classification (Alluvial, Black Soil, Red & Yellow, Laterite, Loamy Sand)
  - `Nitrogen_kg_ha`: Available macro-nitrogen
  - `Phosphorus_kg_ha`: Available phosphorus (P2O5)
  - `Potassium_kg_ha`: Available potassium (K2O)
  - `Soil_pH`: Reaction index
  - `Electrical_Conductivity_dS_m`: Salinity metric
  - `Organic_Carbon_pct`: Organic matter fertility indicator (%)
  - `Moisture_pct`: Volumetric moisture saturation
  - `Health_Status`: Agronomic classification (`Optimal`, `Nutrient Deficient`, `Acidic`, `Alkaline`, `Moderate`)
  - `Sample_Date`: Testing timestamp

---

### 4. High-Resolution Meteorological & Weather Records
- **File**: `datasets/raw/weather/weather_daily_records.csv`
- **Origin & Reference**: Modeled after IMD (India Meteorological Department) automated weather station (AWS) telemetric networks.
- **Record Count**: 5,840 daily station observations
- **Features**:
  - `Station_ID`: Weather monitoring station identifier
  - `Date`: ISO observation date
  - `State`, `District`: Location
  - `Max_Temp_C`, `Min_Temp_C`, `Mean_Temp_C`: Temperature ranges
  - `Relative_Humidity_pct`: Atmospheric vapor saturation
  - `Precipitation_mm`: Daily rain gauge accumulation
  - `Wind_Speed_kmh`: Surface anemometer velocity
  - `Solar_Radiation_MJ_m2`: Insolation energy
  - `Weather_Condition`: Meteorological condition classification

---

### 5. Mandi Spot Market & Commodity Pricing Dataset
- **File**: `datasets/raw/market/mandi_market_prices.csv`
- **Origin & Reference**: AGMARKNET (Agricultural Marketing Information Network).
- **Record Count**: 29,200 market arrival and price transactions
- **Features**:
  - `Arrival_Date`: Mandi trading date
  - `State`, `District`: Market jurisdiction
  - `Market_Name`: APMC Mandi designation
  - `Commodity`: Crop category
  - `Variety`: Commercial grading
  - `Arrivals_Tonnes`: Physical volume traded
  - `Min_Price_INR_Quintal`: Floor trade price
  - `Max_Price_INR_Quintal`: Ceiling trade price
  - `Modal_Price_INR_Quintal`: Predominant settlement price (INR / 100 kg)

---

### 6. Satellite Remote Sensing & Vegetation Indices
- **File**: `datasets/raw/satellite/vegetation_ndvi_indices.csv`
- **Origin & Reference**: Sentinel-2 / Landsat surface reflectance metrics.
- **Record Count**: 1,200 field parcel observations
- **Features**:
  - `Field_ID`: GIS cadastral plot code
  - `State`, `District`: Plot region
  - `Observation_Date`: Satellite pass date
  - `NDVI_Index`: Normalized Difference Vegetation Index (-1.0 to +1.0)
  - `EVI_Index`: Enhanced Vegetation Index
  - `NDWI_Moisture_Index`: Normalized Difference Water Index
  - `Canopy_Vigour`: Crop biophysical health assessment
