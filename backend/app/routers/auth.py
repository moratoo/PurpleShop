"""
Authentication router for PurpleShop API
"""
from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.config import settings
from app.models.user import User, UserStatus
from app.schemas.auth import (
    Token,
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    OAuthLoginRequest,
    PasswordChange,
    RefreshTokenRequest
)
from app.utils.exceptions import (
    InvalidCredentialsError,
    EmailAlreadyExistsError,
    AccountNotVerifiedError,
    AccountSuspendedError
)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/access-token")


@router.post("/register", response_model=AuthResponse)
async def register(
    user_data: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user"""

    # Check if email already exists
    email_query = select(User).where(User.email == user_data.email)
    email_result = await db.execute(email_query)
    existing_user = email_result.scalar_one_or_none()

    if existing_user:
        raise EmailAlreadyExistsError(user_data.email)

    # Check if username already exists (if provided)
    if user_data.username:
        username_query = select(User).where(User.username == user_data.username)
        username_result = await db.execute(username_query)
        existing_username = username_result.scalar_one_or_none()

        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Username {user_data.username} is already taken"
            )

    # Create new user
    hashed_password = hash_password(user_data.password)
    user = User(
        email=user_data.email,
        username=user_data.username,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        location=user_data.location,
        hashed_password=hashed_password,
        status=UserStatus.ACTIVE,
        is_verified=False
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)

    # Generate tokens
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id}
    )

    return AuthResponse(
        user=user.to_public_dict(),
        access_token=Token(
            access_token=access_token,
            token_type="bearer",
            expires_at=datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
    )


@router.post("/login", response_model=AuthResponse)
async def login(
    credentials: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """Login user"""

    # Get user by email
    query = select(User).where(User.email == credentials.email)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        raise InvalidCredentialsError()

    # Verify password
    if not verify_password(credentials.password, user.hashed_password):
        raise InvalidCredentialsError()

    # Check account status
    if user.status == UserStatus.SUSPENDED:
        raise AccountSuspendedError()

    if not user.is_verified:
        raise AccountNotVerifiedError()

    # Update last login
    user.last_login_at = datetime.utcnow()
    await db.commit()

    # Generate tokens
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id}
    )

    return AuthResponse(
        user=user.to_public_dict(),
        access_token=Token(
            access_token=access_token,
            token_type="bearer",
            expires_at=datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
    )


@router.post("/access-token")
async def get_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """Get access token for OAuth2"""

    # Get user by email
    query = select(User).where(User.email == form_data.username)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        raise InvalidCredentialsError()

    # Verify password
    if not verify_password(form_data.password, user.hashed_password):
        raise InvalidCredentialsError()

    # Check account status
    if user.status == UserStatus.SUSPENDED:
        raise AccountSuspendedError()

    if not user.is_verified:
        raise AccountNotVerifiedError()

    # Update last login
    user.last_login_at = datetime.utcnow()
    await db.commit()

    # Generate token
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id}
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_at=datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )


@router.post("/oauth/google")
async def oauth_google(
    oauth_data: OAuthLoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """OAuth login with Google"""

    # TODO: Implement Google OAuth verification
    # For now, return placeholder response
    return {
        "message": "Google OAuth not implemented yet",
        "provider": oauth_data.provider
    }


@router.post("/oauth/facebook")
async def oauth_facebook(
    oauth_data: OAuthLoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """OAuth login with Facebook"""

    # TODO: Implement Facebook OAuth verification
    # For now, return placeholder response
    return {
        "message": "Facebook OAuth not implemented yet",
        "provider": oauth_data.provider
    }


@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: User,  # Requires authentication
    db: AsyncSession = Depends(get_db)
):
    """Change user password"""

    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    # Update password
    current_user.hashed_password = hash_password(password_data.new_password)
    await db.commit()

    return {"message": "Password changed successfully"}


@router.post("/forgot-password")
async def forgot_password(
    email_data: dict,  # {"email": "user@example.com"}
    db: AsyncSession = Depends(get_db)
):
    """Request password reset"""

    # TODO: Implement password reset email sending
    return {
        "message": "Password reset email sent (not implemented yet)",
        "email": email_data.get("email")
    }


@router.post("/reset-password")
async def reset_password(
    reset_data: dict,  # {"token": "...", "new_password": "..."}
    db: AsyncSession = Depends(get_db)
):
    """Reset password with token"""

    # TODO: Implement password reset with token verification
    return {
        "message": "Password reset not implemented yet"
    }


@router.post("/verify-email")
async def verify_email(
    token_data: dict,  # {"token": "..."}
    db: AsyncSession = Depends(get_db)
):
    """Verify email with token"""

    # TODO: Implement email verification
    return {
        "message": "Email verification not implemented yet"
    }


@router.post("/refresh-token")
async def refresh_access_token(
    refresh_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """Refresh access token"""

    # TODO: Implement refresh token logic
    return {
        "message": "Token refresh not implemented yet"
    }


@router.post("/logout")
async def logout(
    current_user: User = None  # Optional authentication
):
    """Logout user"""

    # TODO: Implement logout logic (invalidate tokens)
    return {"message": "Logged out successfully"}


# Helper functions (to be implemented in utils/security.py)
def hash_password(password: str) -> str:
    """Hash password"""
    # TODO: Implement proper password hashing
    return f"hashed_{password}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password"""
    # TODO: Implement proper password verification
    return hashed_password == f"hashed_{plain_password}"


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    # TODO: Implement proper JWT token creation
    import json
    return f"jwt_token_{json.dumps(data)}"


def verify_token(token: str) -> Optional[dict]:
    """Verify and decode JWT token"""
    # TODO: Implement proper JWT token verification
    try:
        # Placeholder implementation
        return {"sub": "user@example.com", "user_id": 1}
    except:
        return None