"""
Schemas package for PurpleShop API
"""
from app.schemas.base import BaseSchema, TimestampSchema, PaginationParams, PaginatedResponse
from app.schemas.user import User, UserCreate, UserUpdate, UserInDB, UserProfile
from app.schemas.product import Product, ProductCreate, ProductUpdate, ProductSearchParams
from app.schemas.auth import Token, LoginRequest, RegisterRequest, AuthResponse

__all__ = [
    "BaseSchema",
    "TimestampSchema",
    "PaginationParams",
    "PaginatedResponse",
    "User",
    "UserCreate",
    "UserUpdate",
    "UserInDB",
    "UserProfile",
    "Product",
    "ProductCreate",
    "ProductUpdate",
    "ProductSearchParams",
    "Token",
    "LoginRequest",
    "RegisterRequest",
    "AuthResponse"
]