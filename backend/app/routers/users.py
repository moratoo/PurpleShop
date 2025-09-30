"""
Users router for PurpleShop API
"""
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import get_db
from app.models.user import User, UserStatus
from app.schemas.user import User, UserCreate, UserUpdate, UserProfile, UserList
from app.schemas.base import PaginationParams
from app.utils.exceptions import UserNotFoundError, UnauthorizedError

router = APIRouter()


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(
    current_user: User,  # Requires authentication
    db: AsyncSession = Depends(get_db)
):
    """Get current user profile"""

    # Reload user with fresh data
    query = select(User).options(
        selectinload(User.products),
        selectinload(User.favorites)
    ).where(User.id == current_user.id)

    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        raise UserNotFoundError(current_user.id)

    return UserProfile(**user.to_dict())


@router.get("/{user_id}", response_model=UserProfile)
async def get_user_profile(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = None  # Optional authentication
):
    """Get user profile by ID"""

    query = select(User).options(
        selectinload(User.products),
        selectinload(User.favorites)
    ).where(
        User.id == user_id
    )

    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        raise UserNotFoundError(user_id)

    # Check if user is active
    if user.status != UserStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return UserProfile(**user.to_public_dict())


@router.get("/", response_model=UserList)
async def list_users(
    db: AsyncSession = Depends(get_db),
    pagination: PaginationParams = Depends(),
    current_user: User = None  # Optional authentication
):
    """List users with pagination"""

    # Only admins can list all users
    if current_user and not current_user.is_admin:
        raise UnauthorizedError("Admin access required")

    # Query users
    query = select(User).where(
        User.status == UserStatus.ACTIVE
    ).order_by(User.created_at.desc())

    # Count total
    count_query = select(func.count()).select_from(query)
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # Apply pagination
    query = query.offset((pagination.page - 1) * pagination.size)
    query = query.limit(pagination.size)

    result = await db.execute(query)
    users = result.scalars().all()

    user_schemas = [User(**user.to_public_dict()) for user in users]

    return UserList(
        users=user_schemas,
        total=total
    )


@router.put("/me", response_model=UserProfile)
async def update_current_user(
    user_data: UserUpdate,
    current_user: User,  # Requires authentication
    db: AsyncSession = Depends(get_db)
):
    """Update current user profile"""

    # Update user fields
    update_data = user_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field not in ["password", "confirm_password"]:  # Handle password separately
            setattr(current_user, field, value)

    await db.commit()
    await db.refresh(current_user)

    return UserProfile(**current_user.to_dict())


@router.delete("/me")
async def deactivate_current_user(
    current_user: User,  # Requires authentication
    db: AsyncSession = Depends(get_db)
):
    """Deactivate current user account"""

    current_user.status = UserStatus.INACTIVE
    await db.commit()

    return {"message": "Account deactivated successfully"}


@router.get("/{user_id}/products")
async def get_user_products(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    pagination: PaginationParams = Depends(),
    status_filter: str = "active"
):
    """Get products by user"""

    # Verify user exists and is active
    user_query = select(User).where(
        and_(
            User.id == user_id,
            User.status == UserStatus.ACTIVE
        )
    )
    user_result = await db.execute(user_query)
    user = user_result.scalar_one_or_none()

    if not user:
        raise UserNotFoundError(user_id)

    # Query user's products
    from app.models.product import Product, ProductStatus

    query = select(Product).where(
        and_(
            Product.seller_id == user_id,
            getattr(ProductStatus, status_filter.upper()) == Product.status
        )
    ).order_by(Product.created_at.desc())

    # Count total
    count_query = select(func.count()).select_from(query)
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # Apply pagination
    query = query.offset((pagination.page - 1) * pagination.size)
    query = query.limit(pagination.size)

    result = await db.execute(query)
    products = result.scalars().all()

    product_schemas = [Product(**product.to_public_dict()) for product in products]

    return {
        "products": product_schemas,
        "total": total,
        "page": pagination.page,
        "size": pagination.size,
        "pages": (total + pagination.size - 1) // pagination.size
    }


@router.get("/{user_id}/favorites")
async def get_user_favorites(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    pagination: PaginationParams = Depends(),
    current_user: User = None
):
    """Get user's favorite products"""

    # Check permissions
    if current_user and current_user.id != user_id and not current_user.is_admin:
        raise UnauthorizedError("Can only view your own favorites")

    # Verify user exists and is active
    user_query = select(User).where(
        and_(
            User.id == user_id,
            User.status == UserStatus.ACTIVE
        )
    )
    user_result = await db.execute(user_query)
    user = user_result.scalar_one_or_none()

    if not user:
        raise UserNotFoundError(user_id)

    # Query favorites with product details
    from app.models.favorite import Favorite
    from app.models.product import Product

    query = (
        select(Product)
        .join(Favorite, Product.id == Favorite.product_id)
        .where(
            and_(
                Favorite.user_id == user_id,
                Product.status == ProductStatus.ACTIVE
            )
        )
        .options(selectinload(Product.seller))
        .order_by(Favorite.created_at.desc())
    )

    # Count total
    count_query = select(func.count()).select_from(query)
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # Apply pagination
    query = query.offset((pagination.page - 1) * pagination.size)
    query = query.limit(pagination.size)

    result = await db.execute(query)
    products = result.scalars().all()

    product_schemas = [Product(**product.to_public_dict()) for product in products]

    return {
        "products": product_schemas,
        "total": total,
        "page": pagination.page,
        "size": pagination.size,
        "pages": (total + pagination.size - 1) // pagination.size
    }