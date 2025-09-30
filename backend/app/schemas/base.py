"""
Base schemas for PurpleShop API
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class BaseSchema(BaseModel):
    """Base schema with common configuration"""
    model_config = ConfigDict(from_attributes=True)


class TimestampSchema(BaseSchema):
    """Schema with timestamp fields"""
    created_at: datetime
    updated_at: datetime


class OptionalTimestampSchema(BaseSchema):
    """Schema with optional timestamp fields"""
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class PaginationParams(BaseSchema):
    """Schema for pagination parameters"""
    page: int = 1
    size: int = 20

    def __init__(self, **data):
        super().__init__(**data)
        # Validate page and size
        if self.page < 1:
            self.page = 1
        if self.size < 1:
            self.size = 20
        if self.size > 100:  # Max page size
            self.size = 100


class PaginatedResponse(BaseSchema):
    """Schema for paginated responses"""
    items: list
    total: int
    page: int
    size: int
    pages: int

    @classmethod
    def from_queryset(
        cls,
        items: list,
        total: int,
        page: int,
        size: int
    ) -> "PaginatedResponse":
        """Create paginated response from queryset data"""
        return cls(
            items=items,
            total=total,
            page=page,
            size=size,
            pages=(total + size - 1) // size  # Ceiling division
        )


class FilterParams(BaseSchema):
    """Schema for filter parameters"""
    search: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    condition: Optional[str] = None
    product_type: Optional[str] = None