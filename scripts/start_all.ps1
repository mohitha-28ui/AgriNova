# MYTHORA One-Click Launcher for Windows PowerShell
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "   MYTHORA - Turning Data into Growth (AI & Big Data)     " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green

Write-Host "`n[1/3] Verifying Datasets & Database Seeding..." -ForegroundColor Cyan
python scripts/seed_database.py

Write-Host "`n[2/3] Starting FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Cyan
Start-Process -FilePath "python" -ArgumentList "-m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload" -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host "`n[3/3] Starting Vite Frontend on http://localhost:5173..." -ForegroundColor Cyan
Set-Location frontend
Start-Process -FilePath "npm" -ArgumentList "run dev" -WindowStyle Normal

Write-Host "`n>>> MYTHORA Platform is LIVE! <<<" -ForegroundColor Green
Write-Host "Frontend Dashboard: http://localhost:5173" -ForegroundColor White
Write-Host "Swagger REST API:   http://127.0.0.1:8000/api/docs" -ForegroundColor White
Write-Host "System Health:      http://127.0.0.1:8000/api/admin/health" -ForegroundColor White
