"""SurakshaPay JWT Authentication Module.

Self-contained JWT authentication for merchants with local hashing,
1-tap Demo Merchant access, and Google OAuth simulation.
"""
from __future__ import annotations

import hashlib
import time
from typing import Optional
import jwt
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["auth"])

JWT_SECRET = "suraksha-pay-jwt-secret-key-2026-production"
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_SECONDS = 7 * 24 * 3600  # 7 days

# Default in-memory demo merchants
DEMO_MERCHANTS = {
    "aarav@textiles.in": {
        "name": "Aarav Textiles",
        "email": "aarav@textiles.in",
        "password_hash": hashlib.sha256("aarav123".encode()).hexdigest(),
        "gmv": "₹50L monthly GMV",
        "role": "D2C Fashion Merchant",
        "store_id": "MID-78432",
    },
    "founder@noisetech.in": {
        "name": "Noise Electronics",
        "email": "founder@noisetech.in",
        "password_hash": hashlib.sha256("noise123".encode()).hexdigest(),
        "gmv": "₹1.5 Cr monthly GMV",
        "role": "Consumer Electronics",
        "store_id": "MID-91204",
    },
}

# Dynamic registered users
_registered_users = dict(DEMO_MERCHANTS)


class LoginIn(BaseModel):
    email: str
    password: str
    remember: bool = True


class RegisterIn(BaseModel):
    name: str
    email: str
    password: str
    gmv: Optional[str] = "₹25L monthly GMV"


class GoogleIn(BaseModel):
    email: Optional[str] = "merchant.aarav@gmail.com"
    name: Optional[str] = "Aarav Shukla"


def create_token(user: dict) -> str:
    payload = {
        "sub": user["email"],
        "name": user["name"],
        "gmv": user["gmv"],
        "role": user.get("role", "Merchant"),
        "store_id": user.get("store_id", "MID-DEMO"),
        "exp": int(time.time()) + JWT_EXPIRE_SECONDS,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_token(token: str) -> Optional[dict]:
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded
    except Exception:
        return None


@router.post("/login")
def login(payload: LoginIn):
    email = payload.email.lower().strip()
    user = _registered_users.get(email)
    
    # Check demo bypass or password match
    hashed_input = hashlib.sha256(payload.password.encode()).hexdigest()
    
    if not user or user["password_hash"] != hashed_input:
        # If user typed any password for demo account, allow for smooth hackathon presentations
        if email in _registered_users:
            user = _registered_users[email]
        else:
            # Auto-provision merchant for painless demo testing
            user = {
                "name": email.split("@")[0].capitalize() + " Store",
                "email": email,
                "password_hash": hashed_input,
                "gmv": "₹30L monthly GMV",
                "role": "Merchant Partner",
                "store_id": f"MID-{int(time.time()) % 100000}",
            }
            _registered_users[email] = user

    token = create_token(user)
    return {
        "ok": True,
        "token": token,
        "user": {
            "name": user["name"],
            "email": user["email"],
            "gmv": user["gmv"],
            "role": user["role"],
            "store_id": user["store_id"],
        },
    }


@router.post("/register")
def register(payload: RegisterIn):
    email = payload.email.lower().strip()
    hashed = hashlib.sha256(payload.password.encode()).hexdigest()
    
    user = {
        "name": payload.name.strip() or "My Brand Store",
        "email": email,
        "password_hash": hashed,
        "gmv": payload.gmv or "₹25L monthly GMV",
        "role": "D2C Brand Owner",
        "store_id": f"MID-{int(time.time()) % 100000}",
    }
    _registered_users[email] = user
    token = create_token(user)
    return {
        "ok": True,
        "token": token,
        "user": {
            "name": user["name"],
            "email": user["email"],
            "gmv": user["gmv"],
            "role": user["role"],
            "store_id": user["store_id"],
        },
    }


@router.post("/google")
def google_login(payload: GoogleIn):
    email = (payload.email or "merchant.aarav@gmail.com").lower().strip()
    name = payload.name or "Aarav Textiles"
    
    user = _registered_users.get(email)
    if not user:
        user = {
            "name": name,
            "email": email,
            "password_hash": "google-oauth-authenticated",
            "gmv": "₹50L monthly GMV",
            "role": "Verified Google Merchant",
            "store_id": f"MID-{int(time.time()) % 100000}",
        }
        _registered_users[email] = user
        
    token = create_token(user)
    return {
        "ok": True,
        "token": token,
        "user": {
            "name": user["name"],
            "email": user["email"],
            "gmv": user["gmv"],
            "role": user["role"],
            "store_id": user["store_id"],
        },
    }


@router.get("/me")
def get_me(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = authorization.split(" ")[1]
    decoded = verify_token(token)
    if not decoded:
        raise HTTPException(status_code=401, detail="Token expired or invalid")
    return {"ok": True, "user": decoded}
