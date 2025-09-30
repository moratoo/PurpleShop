"""
User schemas for PurpleShop API
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator

from app.schemas.base import BaseSchema, TimestampSchema


class UserBase(BaseSchema):
    """Base user schema"""
    email: EmailStr
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    display_name: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None


class UserCreate(UserBase):
    """Schema for creating a user"""
    password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str

    @field_validator("confirm_password")
    @classmethod
    def validate_passwords_match(cls, v: str, info) -> str:
        """Validate that passwords match"""
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v


class UserUpdate(UserBase):
    """Schema for updating a user"""
    password: Optional[str] = Field(None, min_length=8, max_length=128)
    confirm_password: Optional[str] = None

    @field_validator("confirm_password")
    @classmethod
    def validate_passwords_match(cls, v: str, info) -> Optional[str]:
        """Validate that passwords match if provided"""
        if v is not None:
            password = info.data.get("password")
            if password != v:
                raise ValueError("Passwords do not match")
        return v


class UserInDBBase(UserBase, TimestampSchema):
    """Base schema for user in database"""
    id: int
    avatar_url: Optional[str] = None
    is_verified: bool = False
    email_verified_at: Optional[datetime] = None
    last_login_at: Optional[datetime] = None
    products_count: int = 0
    favorites_count: int = 0
    reviews_count: int = 0

    model_config = {"from_attributes": True}


class User(UserInDBBase):
    """Schema for user response (public)"""
    pass


class UserInDB(UserInDBBase):
    """Schema for user in database (includes sensitive data)"""
    hashed_password: str
    salt: Optional[str] = None
    google_id: Optional[str] = None
    facebook_id: Optional[str] = None


class UserProfile(UserInDBBase):
    """Schema for user profile response"""
    pass


class UserList(BaseSchema):
    """Schema for list of users"""
    users: list[User]
    total: int


class PasswordReset(BaseSchema):
    """Schema for password reset request"""
    email: EmailStr


class PasswordResetConfirm(BaseSchema):
    """Schema for password reset confirmation"""
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str

    @field_validator("confirm_password")
    @classmethod
    def validate_passwords_match(cls, v: str, info) -> str:
        """Validate that passwords match"""
        if v != info.data["new_password"]:
            raise ValueError("Passwords do not match")
        return v


class EmailVerification(BaseSchema):
    """Schema for email verification"""
    token: str


class OAuthUser(BaseSchema):
    """Schema for OAuth user data"""
    provider: str  # "google" or "facebook"
    provider_id: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None


class UserStats(BaseSchema):
    """Schema for user statistics"""
    total_products: int
    active_products: int
    sold_products: int
    total_favorites: int
    total_reviews: int
    average_rating: Optional[float] = None