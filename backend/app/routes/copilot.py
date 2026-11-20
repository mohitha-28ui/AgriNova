"""
MYTHORA AI Farming Copilot Assistant Router
"""

from fastapi import APIRouter
from backend.app.schemas.schemas import CopilotRequest
from backend.app.services.ml_service import ml_service

router = APIRouter(prefix="/copilot", tags=["AI Farming Copilot"])

@router.post("/query")
def chat_with_copilot(req: CopilotRequest):
    return ml_service.copilot_query(req.question, req.context)
