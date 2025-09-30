#!/usr/bin/env python3
"""
Development runner for PurpleShop backend
"""
import uvicorn
import argparse
import os
from app.core.config import settings
from app.core.logging import logger


def main():
    """Main entry point for development server"""

    parser = argparse.ArgumentParser(description="PurpleShop Backend Development Server")
    parser.add_argument(
        "--host",
        default=settings.HOST,
        help=f"Host to bind to (default: {settings.HOST})"
    )
    parser.add_argument(
        "--port",
        type=int,
        default=settings.PORT,
        help=f"Port to bind to (default: {settings.PORT})"
    )
    parser.add_argument(
        "--reload",
        action="store_true",
        default=True,
        help="Enable auto-reload for development"
    )
    parser.add_argument(
        "--create-tables",
        action="store_true",
        help="Create database tables on startup"
    )
    parser.add_argument(
        "--drop-tables",
        action="store_true",
        help="Drop database tables on startup (dangerous!)"
    )

    args = parser.parse_args()

    # Log startup information
    logger.info("🚀 Starting PurpleShop Backend API")
    logger.info(f"📍 Host: {args.host}")
    logger.info(f"🔌 Port: {args.port}")
    logger.info(f"📚 Database: {settings.SQLALCHEMY_DATABASE_URI}")
    logger.info(f"🔄 Auto-reload: {args.reload}")
    logger.info(f"📖 Docs URL: http://{args.host}:{args.port}/docs")

    # Run server
    try:
        uvicorn.run(
            "app.main:app",
            host=args.host,
            port=args.port,
            reload=args.reload,
            reload_dirs=["app"] if args.reload else None,
            log_level="info"
        )
    except KeyboardInterrupt:
        logger.info("👋 Server stopped by user")
    except Exception as e:
        logger.error(f"💥 Server error: {e}")
        raise


if __name__ == "__main__":
    main()