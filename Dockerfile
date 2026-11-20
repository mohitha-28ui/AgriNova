# ==============================================================================
# AgriNova – Production Unified Multi-Stage Dockerfile for Render
# AI & Big Data Smart Agriculture Intelligence and Predictive Analytics Platform
# Single Container: Node.js (React Build) + Python (FastAPI + ML + Unified Serving)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build the React.js + Vite Frontend
# ------------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Install dependencies with caching
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source code and compile production distribution
COPY frontend/ ./
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Production Python Runtime & Application Server
# ------------------------------------------------------------------------------
FROM python:3.11-slim AS production

# Set environment variables for Python & Render
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=10000 \
    DATABASE_NAME=agrinova_db

WORKDIR /app

# Install system dependencies (build-essential, curl for healthchecks)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python backend dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application directories into container
COPY backend/ ./backend/
COPY bigdata/ ./bigdata/
COPY database/ ./database/
COPY datasets/ ./datasets/
COPY models/ ./models/
COPY scripts/ ./scripts/

# Copy compiled frontend assets from Stage 1 into /app/frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose Render PORT
EXPOSE ${PORT}

# Healthcheck configuration using curl against the FastAPI healthcheck endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://127.0.0.1:${PORT}/api/health || exit 1

# Start the unified Uvicorn server dynamically binding to Render's $PORT
CMD ["sh", "-c", "exec uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-10000}"]
