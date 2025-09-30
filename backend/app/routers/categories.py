"""
Categories router for PurpleShop API
"""
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from fastapi import APIRouter, Depends

from app.core.database import get_db
from app.models.product import Product, ProductStatus

router = APIRouter()


@router.get("/")
async def list_categories(
    db: AsyncSession = Depends(get_db)
):
    """List all available categories with product counts"""

    # Query categories with product counts
    category_query = (
        select(
            Product.category,
            func.count(Product.id).label("product_count")
        )
        .where(Product.status == ProductStatus.ACTIVE)
        .group_by(Product.category)
        .order_by(func.count(Product.id).desc())
    )

    category_result = await db.execute(category_query)
    categories = [
        {"name": row[0], "product_count": row[1]}
        for row in category_result.all()
    ]

    # Query subcategories
    subcategory_query = (
        select(
            Product.category,
            Product.subcategory,
            func.count(Product.id).label("product_count")
        )
        .where(
            and_(
                Product.status == ProductStatus.ACTIVE,
                Product.subcategory.isnot(None)
            )
        )
        .group_by(Product.category, Product.subcategory)
        .order_by(Product.category, func.count(Product.id).desc())
    )

    subcategory_result = await db.execute(subcategory_query)
    subcategories = {}
    for row in subcategory_result.all():
        category = row[0]
        subcategory = row[1]
        count = row[2]

        if category not in subcategories:
            subcategories[category] = []
        subcategories[category].append({
            "name": subcategory,
            "product_count": count
        })

    return {
        "categories": categories,
        "subcategories": subcategories
    }


@router.get("/{category_name}")
async def get_category_details(
    category_name: str,
    db: AsyncSession = Depends(get_db)
):
    """Get category details with statistics"""

    # Query category statistics
    stats_query = (
        select(
            func.count(Product.id).label("total_products"),
            func.avg(Product.price).label("average_price"),
            func.min(Product.price).label("min_price"),
            func.max(Product.price).label("max_price")
        )
        .where(
            and_(
                Product.category == category_name,
                Product.status == ProductStatus.ACTIVE,
                Product.price.isnot(None)
            )
        )
    )

    stats_result = await db.execute(stats_query)
    stats_row = stats_result.first()

    # Query locations for this category
    location_query = (
        select(
            Product.location,
            func.count(Product.id).label("product_count")
        )
        .where(
            and_(
                Product.category == category_name,
                Product.status == ProductStatus.ACTIVE
            )
        )
        .group_by(Product.location)
        .order_by(func.count(Product.id).desc())
    )

    location_result = await db.execute(location_query)
    locations = [
        {"name": row[0], "product_count": row[1]}
        for row in location_result.all()
    ]

    # Query product types distribution
    type_query = (
        select(
            Product.product_type,
            func.count(Product.id).label("product_count")
        )
        .where(
            and_(
                Product.category == category_name,
                Product.status == ProductStatus.ACTIVE
            )
        )
        .group_by(Product.product_type)
        .order_by(func.count(Product.id).desc())
    )

    type_result = await db.execute(type_query)
    product_types = [
        {"type": row[0], "product_count": row[1]}
        for row in type_result.all()
    ]

    return {
        "category": category_name,
        "statistics": {
            "total_products": stats_row[0] if stats_row else 0,
            "average_price": float(stats_row[1]) if stats_row and stats_row[1] else None,
            "min_price": float(stats_row[2]) if stats_row and stats_row[2] else None,
            "max_price": float(stats_row[3]) if stats_row and stats_row[3] else None,
        },
        "locations": locations,
        "product_types": product_types
    }


@router.get("/{category_name}/subcategories")
async def list_category_subcategories(
    category_name: str,
    db: AsyncSession = Depends(get_db)
):
    """List subcategories for a specific category"""

    subcategory_query = (
        select(
            Product.subcategory,
            func.count(Product.id).label("product_count")
        )
        .where(
            and_(
                Product.category == category_name,
                Product.status == ProductStatus.ACTIVE,
                Product.subcategory.isnot(None)
            )
        )
        .group_by(Product.subcategory)
        .order_by(func.count(Product.id).desc())
    )

    subcategory_result = await db.execute(subcategory_query)
    subcategories = [
        {"name": row[0], "product_count": row[1]}
        for row in subcategory_result.all()
    ]

    return {
        "category": category_name,
        "subcategories": subcategories
    }