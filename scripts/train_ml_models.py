"""
AgriNova Machine Learning & MLOps Pipeline
Trains, evaluates, versions, and persists genuine ML models:
1. Crop Recommendation (Random Forest Classifier)
2. Crop Yield Prediction (Gradient Boosting Regressor with Pipeline)
Generates comprehensive evaluation reports with authentic metrics (R2, RMSE, MAE, Accuracy, F1).
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    mean_absolute_error, root_mean_squared_error, r2_score
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASETS_RAW = os.path.join(BASE_DIR, "datasets", "raw")
MODELS_DIR = os.path.join(BASE_DIR, "models")
SAVED_MODELS_DIR = os.path.join(MODELS_DIR, "saved")

os.makedirs(SAVED_MODELS_DIR, exist_ok=True)

def train_crop_recommender():
    print("--> Training Crop Recommendation Model...")
    csv_path = os.path.join(DATASETS_RAW, "crops", "crop_recommendation.csv")
    df = pd.read_csv(csv_path)
    
    feature_cols = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    X = df[feature_cols]
    y = df["label"]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("classifier", RandomForestClassifier(n_estimators=100, max_depth=16, random_state=42))
    ])
    
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, average="weighted"))
    rec = float(recall_score(y_test, y_pred, average="weighted"))
    f1 = float(f1_score(y_test, y_pred, average="weighted"))
    
    cv_scores = cross_val_score(pipeline, X, y, cv=5)
    
    metrics = {
        "model_name": "AgriNova Crop Recommender",
        "algorithm": "RandomForestClassifier",
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "cv_mean_accuracy": round(float(np.mean(cv_scores)), 4),
        "cv_std_accuracy": round(float(np.std(cv_scores)), 4),
        "num_classes": len(pipeline.classes_),
        "classes": list(pipeline.classes_),
        "trained_samples": len(X_train),
        "test_samples": len(X_test),
        "trained_at": datetime.now().isoformat(),
        "version": "1.0.0"
    }
    
    model_path = os.path.join(SAVED_MODELS_DIR, "crop_recommendation_model.joblib")
    joblib.dump(pipeline, model_path)
    print(f"Crop Recommender trained successfully. Accuracy: {acc*100:.2f}%, F1: {f1:.4f}. Saved at {model_path}")
    return metrics

def train_yield_predictor():
    print("--> Training Crop Yield Prediction Regressor...")
    csv_path = os.path.join(DATASETS_RAW, "yield", "crop_yield_historical.csv")
    df = pd.read_csv(csv_path)
    
    categorical_features = ["State", "Crop", "Season"]
    numerical_features = [
        "Area_Hectares", "Annual_Rainfall_mm", "Fertilizer_Used_kg", "Pesticide_Used_kg"
    ]
    
    X = df[categorical_features + numerical_features]
    y = df["Yield_Tonnes_Per_Hectare"]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numerical_features),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features)
        ]
    )
    
    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("regressor", GradientBoostingRegressor(
            n_estimators=150, learning_rate=0.08, max_depth=5, random_state=42
        ))
    ])
    
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    
    mae = float(mean_absolute_error(y_test, y_pred))
    rmse = float(root_mean_squared_error(y_test, y_pred))
    r2 = float(r2_score(y_test, y_pred))
    
    metrics = {
        "model_name": "AgriNova Crop Yield Predictor",
        "algorithm": "GradientBoostingRegressor",
        "r2_score": round(r2, 4),
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "mean_actual_yield": round(float(y.mean()), 2),
        "trained_samples": len(X_train),
        "test_samples": len(X_test),
        "trained_at": datetime.now().isoformat(),
        "version": "1.0.0"
    }
    
    model_path = os.path.join(SAVED_MODELS_DIR, "crop_yield_model.joblib")
    joblib.dump(pipeline, model_path)
    print(f"Crop Yield Regressor trained successfully. R2: {r2:.4f}, RMSE: {rmse:.4f}, MAE: {mae:.4f}. Saved at {model_path}")
    return metrics

if __name__ == "__main__":
    recommender_metrics = train_crop_recommender()
    yield_metrics = train_yield_predictor()
    
    report = {
        "project": "AgriNova Smart Agriculture Platform",
        "generated_at": datetime.now().isoformat(),
        "models": {
            "crop_recommendation": recommender_metrics,
            "crop_yield_prediction": yield_metrics
        }
    }
    
    report_path = os.path.join(MODELS_DIR, "model_evaluation_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    print(f"MLOps Evaluation Report saved to {report_path}")
