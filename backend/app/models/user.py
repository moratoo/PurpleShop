"""
User model for PurpleShop
"""
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Boolean, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.models.base import Base


class UserRole(str, enum.Enum):
    """User role enumeration"""
    USER = "user"
    ADMIN = "admin"
    MODERATOR = "moderator"


class UserStatus(str, enum.Enum):
    """User status enumeration"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING = "pending"


class User(Base):
    """User model"""
    __tablename__ = "users"

    # Authentication fields
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )
    username: Mapped[Optional[str]] = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=True
    )
    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    salt: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True
    )

    # Profile fields
    first_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    last_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    display_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    avatar_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )
    bio: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    # Location
    location: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    latitude: Mapped[Optional[float]] = mapped_column(nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(nullable=True)

    # Account settings
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole),
        default=UserRole.USER,
        nullable=False
    )
    status: Mapped[UserStatus] = mapped_column(
        Enum(UserStatus),
        default=UserStatus.ACTIVE,
        nullable=False
    )
    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    email_verified_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    # OAuth fields
    google_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        unique=True,
        nullable=True
    )
    facebook_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        unique=True,
        nullable=True
    )

    # Statistics
    products_count: Mapped[int] = mapped_column(default=0, nullable=False)
    favorites_count: Mapped[int] = mapped_column(default=0, nullable=False)
    reviews_count: Mapped[int] = mapped_column(default=0, nullable=False)

    # Timestamps
    last_login_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    # Relationships
    products: Mapped[List["Product"]] = relationship(
        "Product",
        back_populates="seller",
        cascade="all, delete-orphan"
    )
    favorites: Mapped[List["Favorite"]] = relationship(
        "Favorite",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    reviews_given: Mapped[List["Review"]] = relationship(
        "Review",
        back_populates="reviewer",
        foreign_keys="Review.reviewer_id",
        cascade="all, delete-orphan"
    )
    reviews_received: Mapped[List["Review"]] = relationship(
        "Review",
        back_populates="reviewed_user",
        foreign_keys="Review.reviewed_user_id",
        cascade="all, delete-orphan"
    )

    @property
    def full_name(self) -> Optional[str]:
        """Get user's full name"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.display_name or self.username

    @property
    def is_active(self) -> bool:
        """Check if user is active"""
        return self.status == UserStatus.ACTIVE and not self.deleted_at

    @property
    def is_admin(self) -> bool:
        """Check if user is admin"""
        return self.role == UserRole.ADMIN

    def to_dict(self) -> dict:
        """Convert user to dictionary"""
        data = super().to_dict()
        data["full_name"] = self.full_name
        data["is_active"] = self.is_active
        data["is_admin"] = self.is_admin
        return data

    def to_public_dict(self) -> dict:
        """Convert user to public dictionary (excluding sensitive data)"""
        data = self.to_dict()
        # Remove sensitive fields
        sensitive_fields = [
            "hashed_password", "salt", "google_id", "facebook_id",
            "last_login_at", "deleted_at"
        ]
        for field in sensitive_fields:
            data.pop(field, None)
        return data