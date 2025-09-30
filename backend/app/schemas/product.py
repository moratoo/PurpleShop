"""
Product schemas for PurpleShop API
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

from app.schemas.base import BaseSchema, TimestampSchema


class ProductBase(BaseSchema):
    """Base product schema"""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    price: Optional[float] = Field(None, ge=0)
    category: str = Field(..., min_length=1, max_length=100)
    subcategory: Optional[str] = Field(None, max_length=100)
    location: str = Field(..., min_length=1, max_length=100)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_urls: Optional[List[str]] = None
    main_image_url: Optional[str] = Field(None, max_length=500)
    tags: Optional[List[str]] = None
    brand: Optional[str] = Field(None, max_length=100)
    model: Optional[str] = Field(None, max_length=100)
    shipping_available: bool = False
    shipping_cost: Optional[float] = Field(None, ge=0)
    local_pickup: bool = True


class ProductCreate(ProductBase):
    """Schema for creating a product"""
    condition: str = Field(..., regex="^(new|like_new|good|fair|poor)$")
    product_type: str = Field(..., regex="^(free|second_hand|new)$")


class ProductUpdate(ProductBase):
    """Schema for updating a product"""
    condition: Optional[str] = Field(None, regex="^(new|like_new|good|fair|poor)$")
    product_type: Optional[str] = Field(None, regex="^(free|second_hand|new)$")
    status: Optional[str] = Field(None, regex="^(active|inactive|sold|deleted|pending)$")


class ProductInDBBase(ProductBase, TimestampSchema):
    """Base schema for product in database"""
    id: int
    status: str
    condition: str
    product_type: str
    is_featured: bool = False
    views_count: int = 0
    favorites_count: int = 0
    inquiries_count: int = 0
    sold_at: Optional[str] = None
    expires_at: Optional[str] = None

    model_config = {"from_attributes": True}


class Product(ProductInDBBase):
    """Schema for product response"""
    seller: Optional[dict] = None  # Will be populated with seller info


class ProductDetail(Product):
    """Schema for detailed product response"""
    # Additional fields for detailed view
    seller_info: Optional[dict] = None
    related_products: Optional[List[dict]] = None
    reviews: Optional[List[dict]] = None


class ProductList(BaseSchema):
    """Schema for list of products"""
    products: List[Product]
    total: int
    page: int
    size: int
    pages: int


class ProductSearchParams(BaseSchema):
    """Schema for product search parameters"""
    search: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    location: Optional[str] = None
    min_price: Optional[float] = Field(None, ge=0)
    max_price: Optional[float] = Field(None, ge=0)
    condition: Optional[str] = None
    product_type: Optional[str] = None
    status: Optional[str] = "active"
    is_featured: Optional[bool] = None
    seller_id: Optional[int] = None
    tags: Optional[List[str]] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius_km: Optional[float] = Field(None, ge=0, le=100)  # Max 100km radius

    @field_validator("max_price")
    @classmethod
    def validate_price_range(cls, v: Optional[float], info) -> Optional[float]:
        """Validate price range"""
        if v is not None and "min_price" in info.data:
            min_price = info.data["min_price"]
            if min_price is not None and v < min_price:
                raise ValueError("max_price must be greater than min_price")
        return v


class ProductStats(BaseSchema):
    """Schema for product statistics"""
    total_products: int
    active_products: int
    sold_products: int
    free_products: int
    second_hand_products: int
    new_products: int
    average_price: Optional[float] = None
    products_by_category: dict = {}
    products_by_location: dict = {}


class ProductImageUpload(BaseSchema):
    """Schema for product image upload"""
    product_id: int
    image_data: str  # Base64 encoded image or URL

    @field_validator("image_data")
    @classmethod
    def validate_image_data(cls, v: str) -> str:
        """Validate image data"""
        if not v:
            raise ValueError("Image data cannot be empty")
        # Add more validation for base64 or URL format
        return v


class FavoriteProduct(BaseSchema):
    """Schema for favorite product response"""
    product_id: int
    user_id: int
    created_at: datetime


class ProductReview(BaseSchema):
    """Schema for product review"""
    product_id: int
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = Field(None, max_length=2000)
    is_verified_purchase: bool = False


class ProductReport(BaseSchema):
    """Schema for reporting a product"""
    product_id: int
    reason: str = Field(..., max_length=500)
    description: Optional[str] = Field(None, max_length=1000)