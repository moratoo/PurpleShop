"""
Products router for PurpleShop API
"""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func, text
from sqlalchemy.orm import selectinload
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.core.database import get_db
from app.models.product import Product, ProductStatus, ProductType, ProductCondition
from app.models.user import User
from app.schemas.product import (
    Product,
    ProductCreate,
    ProductUpdate,
    ProductList,
    ProductSearchParams,
    ProductDetail
)
from app.schemas.base import PaginationParams, PaginatedResponse
from app.utils.exceptions import ProductNotFoundError, UnauthorizedError

router = APIRouter()


@router.get("/", response_model=ProductList)
async def list_products(
    db: AsyncSession = Depends(get_db),
    search_params: ProductSearchParams = Depends(),
    pagination: PaginationParams = Depends(),
    current_user: Optional[User] = None
):
    """List products with filtering and pagination"""

    # Base query
    query = select(Product).options(
        selectinload(Product.seller)
    ).where(
        Product.status == ProductStatus.ACTIVE
    )

    # Apply filters
    if search_params.search:
        search_filter = f"%{search_params.search}%"
        query = query.where(
            or_(
                Product.title.ilike(search_filter),
                Product.description.ilike(search_filter),
                Product.tags.ilike(search_filter)
            )
        )

    if search_params.category:
        query = query.where(Product.category == search_params.category)

    if search_params.subcategory:
        query = query.where(Product.subcategory == search_params.subcategory)

    if search_params.location:
        query = query.where(Product.location == search_params.location)

    if search_params.min_price is not None:
        query = query.where(Product.price >= search_params.min_price)

    if search_params.max_price is not None:
        query = query.where(Product.price <= search_params.max_price)

    if search_params.condition:
        query = query.where(Product.condition == search_params.condition)

    if search_params.product_type:
        query = query.where(Product.product_type == search_params.product_type)

    if search_params.seller_id:
        query = query.where(Product.seller_id == search_params.seller_id)

    # Location-based search with radius
    if search_params.latitude and search_params.longitude and search_params.radius_km:
        # Using simplified distance calculation (for demo purposes)
        # In production, consider using PostGIS for accurate geospatial queries
        lat_range = search_params.radius_km / 111.0  # Approximate km per degree
        query = query.where(
            and_(
                Product.latitude.between(
                    search_params.latitude - lat_range,
                    search_params.latitude + lat_range
                ),
                Product.longitude.between(
                    search_params.longitude - lat_range,
                    search_params.longitude + lat_range
                )
            )
        )

    # Count total results
    count_query = select(func.count()).select_from(query)
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # Apply pagination and ordering
    query = query.order_by(Product.created_at.desc())
    query = query.offset((pagination.page - 1) * pagination.size)
    query = query.limit(pagination.size)

    # Execute query
    result = await db.execute(query)
    products = result.scalars().all()

    # Convert to response format
    product_schemas = []
    for product in products:
        product_dict = product.to_public_dict()
        product_schemas.append(Product(**product_dict))

    return ProductList(
        products=product_schemas,
        total=total,
        page=pagination.page,
        size=pagination.size,
        pages=(total + pagination.size - 1) // pagination.size
    )


@router.get("/{product_id}", response_model=ProductDetail)
async def get_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = None
):
    """Get product by ID"""

    # Query product with seller info
    query = select(Product).options(
        selectinload(Product.seller),
        selectinload(Product.reviews)
    ).where(
        and_(
            Product.id == product_id,
            Product.status == ProductStatus.ACTIVE
        )
    )

    result = await db.execute(query)
    product = result.scalar_one_or_none()

    if not product:
        raise ProductNotFoundError(product_id)

    # Increment view count
    product.views_count += 1
    await db.commit()

    # Convert to response format
    product_dict = product.to_public_dict()

    # Add additional data for detailed view
    product_dict.update({
        "seller_info": product.seller.to_public_dict() if product.seller else None,
        "related_products": [],  # TODO: Implement related products logic
        "reviews": [
            review.to_public_dict() for review in product.reviews
            if review.is_public
        ] if product.reviews else []
    })

    return ProductDetail(**product_dict)


@router.post("/", response_model=Product)
async def create_product(
    product_data: ProductCreate,
    current_user: User,  # Requires authentication
    db: AsyncSession = Depends(get_db)
):
    """Create a new product"""

    # Create product instance
    product = Product(
        **product_data.model_dump(),
        seller_id=current_user.id,
        status=ProductStatus.ACTIVE
    )

    # Add to database
    db.add(product)
    await db.commit()
    await db.refresh(product)

    # Update user's product count
    current_user.products_count += 1
    await db.commit()

    return Product(**product.to_public_dict())


@router.put("/{product_id}", response_model=Product)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    current_user: User,  # Requires authentication
    db: AsyncSession = Depends(get_db)
):
    """Update a product"""

    # Get product
    query = select(Product).where(Product.id == product_id)
    result = await db.execute(query)
    product = result.scalar_one_or_none()

    if not product:
        raise ProductNotFoundError(product_id)

    # Check ownership
    if product.seller_id != current_user.id and not current_user.is_admin:
        raise UnauthorizedError("You can only edit your own products")

    # Update fields
    update_data = product_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    await db.commit()
    await db.refresh(product)

    return Product(**product.to_public_dict())


@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    current_user: User,  # Requires authentication
    db: AsyncSession = Depends(get_db)
):
    """Delete a product"""

    # Get product
    query = select(Product).where(Product.id == product_id)
    result = await db.execute(query)
    product = result.scalar_one_or_none()

    if not product:
        raise ProductNotFoundError(product_id)

    # Check ownership
    if product.seller_id != current_user.id and not current_user.is_admin:
        raise UnauthorizedError("You can only delete your own products")

    # Soft delete
    product.status = ProductStatus.DELETED
    await db.commit()

    return {"message": "Product deleted successfully"}


@router.post("/{product_id}/favorite")
async def favorite_product(
    product_id: int,
    current_user: User,  # Requires authentication
    db: AsyncSession = Depends(get_db)
):
    """Add product to favorites"""

    # Check if product exists
    product_query = select(Product).where(
        and_(
            Product.id == product_id,
            Product.status == ProductStatus.ACTIVE
        )
    )
    product_result = await db.execute(product_query)
    product = product_result.scalar_one_or_none()

    if not product:
        raise ProductNotFoundError(product_id)

    # Check if already favorited
    from app.models.favorite import Favorite
    favorite_query = select(Favorite).where(
        and_(
            Favorite.user_id == current_user.id,
            Favorite.product_id == product_id
        )
    )
    favorite_result = await db.execute(favorite_query)
    existing_favorite = favorite_result.scalar_one_or_none()

    if existing_favorite:
        return {"message": "Product already in favorites"}

    # Add to favorites
    favorite = Favorite(user_id=current_user.id, product_id=product_id)
    db.add(favorite)

    # Update counts
    product.favorites_count += 1
    current_user.favorites_count += 1

    await db.commit()

    return {"message": "Product added to favorites"}


@router.delete("/{product_id}/favorite")
async def unfavorite_product(
    product_id: int,
    current_user: User,  # Requires authentication
    db: AsyncSession = Depends(get_db)
):
    """Remove product from favorites"""

    # Find and remove favorite
    from app.models.favorite import Favorite
    favorite_query = select(Favorite).where(
        and_(
            Favorite.user_id == current_user.id,
            Favorite.product_id == product_id
        )
    )
    favorite_result = await db.execute(favorite_query)
    favorite = favorite_result.scalar_one_or_none()

    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not in favorites"
        )

    # Update counts before deletion
    if favorite.product:
        favorite.product.favorites_count -= 1
    current_user.favorites_count -= 1

    # Remove favorite
    await db.delete(favorite)
    await db.commit()

    return {"message": "Product removed from favorites"}


@router.get("/categories/list")
async def list_categories(
    db: AsyncSession = Depends(get_db)
):
    """Get list of available categories"""

    # Query distinct categories
    category_query = select(Product.category).distinct().where(
        Product.status == ProductStatus.ACTIVE
    )
    category_result = await db.execute(category_query)
    categories = [row[0] for row in category_result.all()]

    # Query distinct locations
    location_query = select(Product.location).distinct().where(
        Product.status == ProductStatus.ACTIVE
    )
    location_result = await db.execute(location_query)
    locations = [row[0] for row in location_result.all()]

    return {
        "categories": sorted(categories),
        "locations": sorted(locations)
    }


@router.get("/stats/summary")
async def get_products_stats(
    db: AsyncSession = Depends(get_db)
):
    """Get products statistics"""

    # Total products
    total_query = select(func.count(Product.id)).where(
        Product.status == ProductStatus.ACTIVE
    )
    total_result = await db.execute(total_query)
    total_products = total_result.scalar()

    # Products by type
    type_stats = {}
    for product_type in ProductType:
        type_query = select(func.count(Product.id)).where(
            and_(
                Product.status == ProductStatus.ACTIVE,
                Product.product_type == product_type
            )
        )
        type_result = await db.execute(type_query)
        type_stats[product_type.value] = type_result.scalar()

    # Products by category
    category_query = select(
        Product.category,
        func.count(Product.id)
    ).where(
        Product.status == ProductStatus.ACTIVE
    ).group_by(Product.category)

    category_result = await db.execute(category_query)
    category_stats = {row[0]: row[1] for row in category_result.all()}

    # Average price (excluding free products)
    avg_price_query = select(func.avg(Product.price)).where(
        and_(
            Product.status == ProductStatus.ACTIVE,
            Product.price.isnot(None)
        )
    )
    avg_price_result = await db.execute(avg_price_query)
    avg_price = float(avg_price_result.scalar() or 0)

    return {
        "total_products": total_products,
        "products_by_type": type_stats,
        "products_by_category": category_stats,
        "average_price": round(avg_price, 2)
    }