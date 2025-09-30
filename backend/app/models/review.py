"""
Review model for PurpleShop
"""
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.product import Product


class Review(Base):
    """Review model - for product and user reviews"""
    __tablename__ = "reviews"

    # Review content
    title: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True
    )
    content: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    rating: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )  # 1-5 stars

    # Review type (product or user review)
    review_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="product"
    )

    # Foreign keys
    reviewer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )
    product_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("products.id"),
        nullable=True,
        index=True
    )
    reviewed_user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
        index=True
    )

    # Status
    is_verified_purchase: Mapped[bool] = mapped_column(
        default=False,
        nullable=False
    )
    is_public: Mapped[bool] = mapped_column(
        default=True,
        nullable=False
    )

    # Relationships
    reviewer: Mapped["User"] = relationship(
        "User",
        back_populates="reviews_given",
        foreign_keys=[reviewer_id]
    )
    reviewed_user: Mapped[Optional["User"]] = relationship(
        "User",
        back_populates="reviews_received",
        foreign_keys=[reviewed_user_id]
    )
    product: Mapped[Optional["Product"]] = relationship(
        "Product",
        back_populates="reviews"
    )

    def to_dict(self) -> dict:
        """Convert review to dictionary"""
        data = super().to_dict()
        if self.reviewer:
            data["reviewer"] = self.reviewer.to_public_dict()
        if self.reviewed_user:
            data["reviewed_user"] = self.reviewed_user.to_public_dict()
        if self.product:
            data["product"] = {
                "id": self.product.id,
                "title": self.product.title
            }
        return data

    def to_public_dict(self) -> dict:
        """Convert review to public dictionary"""
        data = self.to_dict()
        # Remove sensitive reviewer info if not public
        if not self.is_public:
            data.pop("reviewer", None)
        return data

    @property
    def is_valid_rating(self) -> bool:
        """Check if rating is valid (1-5)"""
        return 1 <= self.rating <= 5