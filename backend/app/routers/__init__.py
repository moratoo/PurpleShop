"""
Routers package for PurpleShop API
"""
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.products import router as products_router
from app.routers.categories import router as categories_router

__all__ = [
    "auth_router",
    "users_router",
    "products_router",
    "categories_router"
]