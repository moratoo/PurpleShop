"""
Logging configuration for PurpleShop backend
"""
import logging
import sys
from typing import Optional
from app.core.config import settings


def get_logger(name: str = "purpleshop") -> logging.Logger:
    """Get configured logger instance"""
    return logging.getLogger(name)


def setup_logging(
    level: str = "INFO",
    format_string: Optional[str] = None
) -> None:
    """Setup logging configuration"""

    if format_string is None:
        format_string = (
            "%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s"
        )

    # Create formatter
    formatter = logging.Formatter(format_string)

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)

    # File handler (optional)
    file_handler = None
    if settings.DEBUG:
        file_handler = logging.FileHandler("purpleshop.log")
        file_handler.setFormatter(formatter)

    # Root logger configuration
    root_logger = logging.getLogger("purpleshop")
    root_logger.setLevel(getattr(logging, level.upper()))
    root_logger.addHandler(console_handler)

    if file_handler:
        root_logger.addHandler(file_handler)

    # Reduce noise from external libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy").setLevel(logging.WARNING)

    # Set specific levels for different modules
    if settings.DEBUG:
        logging.getLogger("uvicorn").setLevel(logging.DEBUG)
        logging.getLogger("fastapi").setLevel(logging.DEBUG)
    else:
        logging.getLogger("uvicorn").setLevel(logging.INFO)
        logging.getLogger("fastapi").setLevel(logging.INFO)


# Initialize logging when module is imported
setup_logging(level="DEBUG" if settings.DEBUG else "INFO")

# Create logger instance
logger = get_logger("purpleshop")