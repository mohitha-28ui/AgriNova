"""
AgriNova Authentication & Role Authorization Middleware
Validates Bearer tokens and checks user roles (farmer / admin).
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any, Optional

from backend.app.utils.security import decode_access_token
from backend.app.database.mongodb import users_col

security_bearer = HTTPBearer(auto_error=False)

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)) -> Dict[str, Any]:
    """Dependency that extracts and validates the logged-in user from the JWT Bearer token."""
    if not credentials:
        # For demonstration or unauthenticated queries in development, return guest if token missing
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Bearer authentication token. Please login to access this resource.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing subject identifier.",
        )
    
    user = users_col.find_one({"email": email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account associated with this token no longer exists.",
        )
    
    return user

def require_admin(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Enforces Admin role authorization."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required to access this endpoint.",
        )
    return current_user
