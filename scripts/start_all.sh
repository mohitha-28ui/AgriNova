#!/usr/bin/env bash
# AgriNova Linux/macOS One-Click Platform Launcher
echo "=========================================================="
echo "   AGRINOVA - Smart Agriculture Big Data AI Platform     "
echo "=========================================================="

echo -e "\n[1/3] Seeding Database and Model Weights..."
python3 scripts/seed_database.py

echo -e "\n[2/3] Launching FastAPI Backend on port 8000..."
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

sleep 2

echo -e "\n[3/3] Launching Vite React Frontend on port 5173..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo -e "\n>>> AgriNova Platform is LIVE! <<<"
echo "Frontend Dashboard: http://localhost:5173"
echo "Backend Swagger UI: http://localhost:8000/api/docs"

wait $BACKEND_PID $FRONTEND_PID
