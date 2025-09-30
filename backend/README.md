# PurpleShop Backend API

FastAPI backend for PurpleShop marketplace application.

## 🚀 Features

- **FastAPI Framework**: Modern, fast web framework for building APIs
- **Async Support**: Full async/await support for high performance
- **SQLAlchemy 2.0**: Modern ORM with async support
- **JWT Authentication**: Secure token-based authentication
- **OAuth Integration**: Google and Facebook login support
- **Rate Limiting**: Built-in rate limiting protection
- **File Uploads**: Image upload support for products
- **Comprehensive Logging**: Structured logging with configurable levels
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- **Database Migrations**: Alembic for database schema management
- **Testing Ready**: Pytest configuration for comprehensive testing

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.104.1
- **ORM**: SQLAlchemy 2.0.23 (async)
- **Database**: PostgreSQL (primary) / SQLite (development)
- **Authentication**: JWT with OAuth2
- **Validation**: Pydantic 2.5.0
- **Password Hashing**: bcrypt
- **CORS**: Configurable CORS support
- **Rate Limiting**: SlowAPI
- **Documentation**: OpenAPI 3.0

## 📋 Prerequisites

- Python 3.8+
- PostgreSQL (recommended) or SQLite (development)
- Redis (optional, for caching)

## ⚡ Quick Start

### 1. Installation

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Edit .env file with your configuration
nano .env  # or your preferred editor
```

### 3. Database Setup

#### PostgreSQL (Recommended)

```bash
# Create database
createdb purpleshop

# Create user
createuser purpleshop -P

# Grant permissions
psql -c "GRANT ALL PRIVILEGES ON DATABASE purpleshop TO purpleshop;"
```

#### SQLite (Development)

No setup required - database file will be created automatically.

### 4. Run Development Server

```bash
# Run with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or use the run script
python -m app.main
```

The API will be available at:
- **API Base**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 📚 API Documentation

### Interactive API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login** to get access token
2. **Include token** in Authorization header: `Bearer <your-token>`
3. **Protected endpoints** will validate the token

## 🗂️ Project Structure

```
backend/
├── app/
│   ├── core/                 # Core configuration
│   │   ├── config.py         # Settings and configuration
│   │   ├── database.py       # Database connection and session
│   │   ├── dependencies.py   # FastAPI dependencies
│   │   └── logging.py        # Logging configuration
│   ├── models/               # Database models
│   │   ├── base.py           # Base model class
│   │   ├── user.py           # User model
│   │   ├── product.py        # Product model
│   │   ├── favorite.py       # Favorite model
│   │   └── review.py         # Review model
│   ├── routers/              # API route handlers
│   │   ├── auth.py           # Authentication endpoints
│   │   ├── users.py          # User management endpoints
│   │   ├── products.py       # Product CRUD endpoints
│   │   └── categories.py     # Category endpoints
│   ├── schemas/              # Pydantic schemas
│   │   ├── base.py           # Base schemas
│   │   ├── user.py           # User schemas
│   │   ├── product.py        # Product schemas
│   │   └── auth.py           # Authentication schemas
│   └── utils/                # Utility functions
│       └── exceptions.py     # Custom exceptions
├── requirements.txt          # Python dependencies
├── .env.example             # Environment configuration template
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | - |
| `SQLITE_URL` | SQLite database path | `./purpleshop.db` |
| `SECRET_KEY` | JWT secret key | `your-secret-key` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | `30` |
| `BACKEND_CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |

### Database Configuration

#### PostgreSQL (Production)

```env
DATABASE_URL=postgresql+asyncpg://username:password@localhost/purpleshop
```

#### SQLite (Development)

```env
DATABASE_URL=sqlite+aiosqlite:///./purpleshop.db
```

## 🧪 Testing

```bash
# Run tests
pytest

# Run tests with coverage
pytest --cov=app

# Run specific test file
pytest app/tests/test_products.py
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build image
docker build -t purpleshop-backend .

# Run container
docker run -d \
  --name purpleshop-backend \
  -p 8000:8000 \
  -e DATABASE_URL=your-database-url \
  purpleshop-backend
```

### Production Deployment

1. **Set production environment variables**
2. **Configure production database**
3. **Set up reverse proxy (nginx)**
4. **Configure SSL certificates**
5. **Set up monitoring and logging**

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt password hashing
- **CORS Protection**: Configurable CORS settings
- **Rate Limiting**: Built-in rate limiting
- **Input Validation**: Comprehensive input validation with Pydantic
- **SQL Injection Protection**: Parameterized queries with SQLAlchemy

## 📈 Monitoring

- **Health Checks**: `/health` endpoint for monitoring
- **Structured Logging**: JSON logging for better observability
- **Error Tracking**: Sentry integration (optional)
- **Performance Metrics**: Built-in FastAPI metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@purpleshop.com
- 💬 Discord: [Join our community](https://discord.gg/purpleshop)
- 🐛 Issues: [GitHub Issues](https://github.com/purpleshop/backend/issues)

---

**Made with ❤️ by the PurpleShop Team**