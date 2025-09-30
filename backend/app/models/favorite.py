"""
Favorite model for PurpleShop
"""
from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.product import Product


class Favorite(Base):
    """Favorite model - represents user's favorite products"""
    __tablename__ = "favorites"

    # Foreign keys
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"),
        nullable=False,
        index=True
    )

    # Relationships
    user: Mapped["User"] = relationship(
        "User",
        back_populates="favorites"
    )
    product: Mapped["Product"] = relationship(
        "Product",
        back_populates="favorites"
    )

    # Constraints
    __table_args__ = (
        UniqueConstraint("user_id", "product_id", name="unique_user_product_favorite"),
    )

    def to_dict(self) -> dict:
        """Convert favorite to dictionary"""
        data = super().to_dict()
        if self.product:
            data["product"] = self.product.to_public_dict()
        if self.user:
            data["user"] = self.user.to_public_dict()
        return data