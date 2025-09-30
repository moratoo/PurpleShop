"""
Custom exceptions for PurpleShop API
"""
from typing import Any, Dict, List, Optional
from fastapi import HTTPException, status


class ValidationException(HTTPException):
    """Exception raised for validation errors"""

    def __init__(
        self,
        detail: str = "Validation error",
        errors: Optional[List[Dict[str, Any]]] = None
    ):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail
        )
        self.errors = errors or []


class NotFoundError(HTTPException):
    """Exception raised when a resource is not found"""

    def __init__(self, detail: str = "Resource not found"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail
        )


class UnauthorizedError(HTTPException):
    """Exception raised for unauthorized access"""

    def __init__(self, detail: str = "Not authenticated"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail
        )


class ForbiddenError(HTTPException):
    """Exception raised for forbidden access"""

    def __init__(self, detail: str = "Access forbidden"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail
        )


class ConflictError(HTTPException):
    """Exception raised for resource conflicts"""

    def __init__(self, detail: str = "Resource conflict"):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail
        )


class RateLimitError(HTTPException):
    """Exception raised for rate limiting"""

    def __init__(self, detail: str = "Rate limit exceeded"):
        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=detail
        )


class BusinessLogicError(HTTPException):
    """Exception raised for business logic violations"""

    def __init__(self, detail: str = "Business logic error"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )


# Specific exceptions for common use cases
class UserNotFoundError(NotFoundError):
    """Exception raised when a user is not found"""

    def __init__(self, user_id: Optional[int] = None):
        detail = "User not found"
        if user_id:
            detail = f"User with ID {user_id} not found"
        super().__init__(detail=detail)


class ProductNotFoundError(NotFoundError):
    """Exception raised when a product is not found"""

    def __init__(self, product_id: Optional[int] = None):
        detail = "Product not found"
        if product_id:
            detail = f"Product with ID {product_id} not found"
        super().__init__(detail=detail)


class EmailAlreadyExistsError(ConflictError):
    """Exception raised when trying to register with existing email"""

    def __init__(self, email: str):
        super().__init__(detail=f"Email {email} is already registered")


class UsernameAlreadyExistsError(ConflictError):
    """Exception raised when trying to register with existing username"""

    def __init__(self, username: str):
        super().__init__(detail=f"Username {username} is already taken")


class ProductAlreadySoldError(ConflictError):
    """Exception raised when trying to buy an already sold product"""

    def __init__(self, product_id: int):
        super().__init__(detail=f"Product {product_id} is already sold")


class InsufficientPermissionsError(ForbiddenError):
    """Exception raised when user lacks required permissions"""

    def __init__(self, required_permission: str):
        super().__init__(detail=f"Insufficient permissions: {required_permission} required")


class InvalidCredentialsError(UnauthorizedError):
    """Exception raised for invalid login credentials"""

    def __init__(self):
        super().__init__(detail="Invalid email or password")


class AccountNotVerifiedError(ForbiddenError):
    """Exception raised when account is not verified"""

    def __init__(self):
        super().__init__(detail="Account not verified. Please check your email")


class AccountSuspendedError(ForbiddenError):
    """Exception raised when account is suspended"""

    def __init__(self):
        super().__init__(detail="Account suspended. Please contact support")