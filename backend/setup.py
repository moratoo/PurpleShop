#!/usr/bin/env python3
"""
Setup script for PurpleShop backend
"""
import os
import sys
import subprocess
import venv
from pathlib import Path


def run_command(command, shell=True):
    """Run a command and return the result"""
    try:
        result = subprocess.run(
            command,
            shell=shell,
            check=True,
            capture_output=True,
            text=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running command '{command}': {e}")
        print(f"Error output: {e.stderr}")
        return None


def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ is required")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} detected")
    return True


def create_venv():
    """Create virtual environment"""
    print("📦 Creating virtual environment...")
    venv_path = Path("venv")

    if venv_path.exists():
        print("✅ Virtual environment already exists")
        return True

    try:
        venv.create(venv_path, with_pip=True)
        print("✅ Virtual environment created")
        return True
    except Exception as e:
        print(f"❌ Failed to create virtual environment: {e}")
        return False


def activate_venv():
    """Activate virtual environment"""
    venv_path = Path("venv")
    if os.name == "nt":  # Windows
        activate_script = venv_path / "Scripts" / "activate.bat"
        bin_path = venv_path / "Scripts"
    else:  # Unix/Linux/Mac
        activate_script = venv_path / "bin" / "activate"
        bin_path = venv_path / "bin"

    if not activate_script.exists():
        print("❌ Virtual environment not found")
        return None, None

    python_path = bin_path / "python"
    pip_path = bin_path / "pip"

    return python_path, pip_path


def install_dependencies():
    """Install Python dependencies"""
    print("📥 Installing Python dependencies...")

    python_path, pip_path = activate_venv()
    if not python_path or not pip_path:
        return False

    # Upgrade pip first
    print("⬆️ Upgrading pip...")
    run_command(f'"{pip_path}" install --upgrade pip')

    # Install requirements
    requirements_file = Path("requirements.txt")
    if requirements_file.exists():
        print("📦 Installing from requirements.txt...")
        result = run_command(f'"{pip_path}" install -r requirements.txt')
        if result:
            print("✅ Dependencies installed successfully")
            return True
        else:
            print("❌ Failed to install dependencies")
            return False
    else:
        print("❌ requirements.txt not found")
        return False


def setup_database():
    """Setup database (SQLite for development)"""
    print("🗄️ Setting up database...")

    python_path, _ = activate_venv()
    if not python_path:
        return False

    # Create .env file if it doesn't exist
    env_file = Path(".env")
    if not env_file.exists():
        print("📝 Creating .env file...")
        env_example = Path(".env.example")
        if env_example.exists():
            import shutil
            shutil.copy(env_example, env_file)
            print("✅ .env file created from .env.example")
        else:
            print("⚠️ .env.example not found, creating basic .env...")
            with open(env_file, "w") as f:
                f.write("DEBUG=true\n")
                f.write("DATABASE_URL=sqlite+aiosqlite:///./purpleshop.db\n")
                f.write("SECRET_KEY=your-secret-key-change-in-production\n")

    # Create database tables
    print("🏗️ Creating database tables...")
    result = run_command(f'"{python_path}" -c "from app.core.database import create_tables; import asyncio; asyncio.run(create_tables())"')
    if result is not None:
        print("✅ Database tables created")
        return True
    else:
        print("❌ Failed to create database tables")
        return False


def main():
    """Main setup function"""
    print("🚀 PurpleShop Backend Setup")
    print("=" * 50)

    # Check Python version
    if not check_python_version():
        sys.exit(1)

    # Create virtual environment
    if not create_venv():
        sys.exit(1)

    # Install dependencies
    if not install_dependencies():
        sys.exit(1)

    # Setup database
    if not setup_database():
        sys.exit(1)

    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Activate virtual environment:")
    print("   source venv/bin/activate")
    print("\n2. Run development server:")
    print("   python run.py")
    print("\n3. Open API documentation:")
    print("   http://localhost:8000/docs")
    print("\n4. For production, configure your .env file with proper values")


if __name__ == "__main__":
    main()