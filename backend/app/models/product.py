"""
Product model for PurpleShop
"""
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, Float, Boolean, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class ProductCondition(str, enum.Enum):
    """Product condition enumeration"""
    NEW = "new"
    LIKE_NEW = "like_new"
    GOOD = "good"
    FAIR = "fair"
    POOR = "poor"


class ProductStatus(str, enum.Enum):
    """Product status enumeration"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    SOLD = "sold"
    DELETED = "deleted"
    PENDING = "pending"


class ProductType(str, enum.Enum):
    """Product type enumeration"""
    FREE = "free"
    SECOND_HAND = "second_hand"
    NEW = "new"


class Product(Base):
    """Product model"""
    __tablename__ = "products"

    # Basic information
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    price: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
        index=True
    )

    # Categorization
    category: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True
    )
    subcategory: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        index=True
    )

    # Condition and type
    condition: Mapped[ProductCondition] = mapped_column(
        Enum(ProductCondition),
        nullable=False
    )
    product_type: Mapped[ProductType] = mapped_column(
        Enum(ProductType),
        nullable=False,
        index=True
    )

    # Location
    location: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True
    )
    latitude: Mapped[Optional[float]] = mapped_column(nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(nullable=True)

    # Images
    image_urls: Mapped[Optional[str]] = mapped_column(
        Text,  # JSON string of image URLs
        nullable=True
    )
    main_image_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )

    # Status and visibility
    status: Mapped[ProductStatus] = mapped_column(
        Enum(ProductStatus),
        default=ProductStatus.ACTIVE,
        nullable=False,
        index=True
    )
    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    # Seller information
    seller_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    # Statistics
    views_count: Mapped[int] = mapped_column(
        default=0,
        nullable=False
    )
    favorites_count: Mapped[int] = mapped_column(
        default=0,
        nullable=False
    )
    inquiries_count: Mapped[int] = mapped_column(
        default=0,
        nullable=False
    )

    # Metadata
    tags: Mapped[Optional[str]] = mapped_column(
        Text,  # JSON string of tags
        nullable=True
    )
    brand: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    model: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )

    # Shipping information
    shipping_available: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    shipping_cost: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True
    )
    local_pickup: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    # Timestamps
    sold_at: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    expires_at: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )

    # Relationships
    seller: Mapped["User"] = relationship(
        "User",
        back_populates="products"
    )
    favorites: Mapped[List["Favorite"]] = relationship(
        "Favorite",
        back_populates="product",
        cascade="all, delete-orphan"
    )
    reviews: Mapped[List["Review"]] = relationship(
        "Review",
        back_populates="product",
        cascade="all, delete-orphan"
    )

    @property
    def is_available(self) -> bool:
        """Check if product is available for purchase"""
        return (
            self.status == ProductStatus.ACTIVE and
            not self.sold_at and
            (not self.expires_at or self.expires_at > str(self.created_at))
        )

    @property
    def location_display(self) -> str:
        """Get formatted location display"""
        return f"{self.location}"

    def increment_views(self):
        """Increment view count"""
        self.views_count += 1

    def mark_as_sold(self):
        """Mark product as sold"""
        from datetime import datetime
        self.status = ProductStatus.SOLD
        self.sold_at = datetime.utcnow().isoformat()

    def to_dict(self) -> dict:
        """Convert product to dictionary"""
        data = super().to_dict()
        data["is_available"] = self.is_available
        data["location_display"] = self.location_display
        return data

    def to_public_dict(self) -> dict:
        """Convert product to public dictionary"""
        data = self.to_dict()
        # Add seller info (public only)
        if self.seller:
            data["seller"] = {
                "id": self.seller.id,
                "display_name": self.seller.display_name,
                "avatar_url": self.seller.avatar_url,
                "location": self.seller.location
            }
        return data