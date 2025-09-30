"""
Authentication schemas for PurpleShop API
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

from app.schemas.base import BaseSchema


class Token(BaseSchema):
    """Schema for access token"""
    access_token: str
    token_type: str = "bearer"
    expires_at: datetime


class TokenData(BaseSchema):
    """Schema for token data"""
    email: Optional[str] = None
    user_id: Optional[int] = None
    exp: Optional[datetime] = None


class LoginRequest(BaseSchema):
    """Schema for login request"""
    email: EmailStr
    password: str = Field(..., min_length=1)


class OAuthLoginRequest(BaseSchema):
    """Schema for OAuth login request"""
    provider: str = Field(..., regex="^(google|facebook)$")
    access_token: str
    id_token: Optional[str] = None  # For Google OAuth


class RegisterRequest(BaseSchema):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    location: Optional[str] = Field(None, max_length=100)
    accept_terms: bool = Field(..., description="Must accept terms and conditions")

    def __init__(self, **data):
        super().__init__(**data)
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")


class PasswordChange(BaseSchema):
    """Schema for password change"""
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str

    def __init__(self, **data):
        super().__init__(**data)
        if self.new_password != self.confirm_password:
            raise ValueError("New passwords do not match")


class EmailVerificationRequest(BaseSchema):
    """Schema for email verification request"""
    email: EmailStr


class PasswordResetRequest(BaseSchema):
    """Schema for password reset request"""
    email: EmailStr


class PasswordResetConfirm(BaseSchema):
    """Schema for password reset confirmation"""
    token: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str

    def __init__(self, **data):
        super().__init__(**data)
        if self.new_password != self.confirm_password:
            raise ValueError("Passwords do not match")


class RefreshTokenRequest(BaseSchema):
    """Schema for refresh token request"""
    refresh_token: str = Field(..., min_length=1)


class LogoutRequest(BaseSchema):
    """Schema for logout request"""
    refresh_token: Optional[str] = None


class AuthResponse(BaseSchema):
    """Schema for authentication response"""
    user: dict
    access_token: Token
    refresh_token: Optional[str] = None


class OAuthURLResponse(BaseSchema):
    """Schema for OAuth authorization URL"""
    authorization_url: str
    state: str


class UserInfo(BaseSchema):
    """Schema for user info from OAuth providers"""
    id: str
    email: str
    name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    picture: Optional[str] = None
    locale: Optional[str] = None