
# ==============================================================================
# AgriNova - Unified Production Dockerfile
# Frontend: React + Vite
# Backend: FastAPI + Python
# Deployment: Render
# ==============================================================================

# ------------------------------------------------------------------------------
# STAGE 1: BUILD FRONTEND
# ------------------------------------------------------------------------------

FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ ./

RUN npm run build


# ------------------------------------------------------------------------------
# STAGE 2: PYTHON PRODUCTION SERVER
# ------------------------------------------------------------------------------

FROM python:3.11-slim AS production

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=10000 \
    DATABASE_NAME=agrinova_db

WORKDIR /app

# Install required system packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

# Copy backend and supporting project directories
COPY backend/ ./backend/
COPY bigdata/ ./bigdata/
COPY database/ ./database/
COPY datasets/ ./datasets/
COPY models/ ./models/
COPY scripts/ ./scripts/

# Copy production frontend build
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose application port
EXPOSE 10000

# Container health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://127.0.0.1:${PORT}/api/ping || exit 1

# Start FastAPI application
CMD ["sh", "-c", "exec uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-10000}"]
