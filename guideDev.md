## 🚀 **GUÍA COMPLETA: ARRANCAR PURPLESHOP EN MODO DESARROLLO**

Aquí tienes la guía paso a paso para arrancar PurpleShop en modo desarrollo local:

---

## 📋 **PREREQUISITOS**

**✅ Software necesario:**
- **Node.js 18+** ([Descargar](https://nodejs.org/))
- **Python 3.8+** (ya incluido en macOS/Linux)
- **Git** ([Descargar](https://git-scm.com/))
- **PostgreSQL** (opcional, usa SQLite por defecto)

---

## 🛠️ **PASO 1: INSTALACIÓN DE DEPENDENCIAS**

### **Frontend (React/TypeScript)**
```bash
# Instalar dependencias del frontend
npm install

# Verificar instalación
npm --version  # Debe mostrar 9.x+
node --version  # Debe mostrar v18.x+
```

### **Backend (Python/FastAPI)**
```bash
# Navegar al directorio backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En macOS/Linux:
source venv/bin/activate
# En Windows:
# venv\Scripts\activate

# Instalar dependencias Python
pip install -r requirements.txt

# Verificar instalación
python --version  # Debe mostrar Python 3.8+
pip list | grep fastapi  # Debe mostrar fastapi instalado
```

---

## 🌍 **PASO 2: CONFIGURACIÓN DE ENTORNO**

### **Variables de Entorno Frontend**
```bash
# Copiar archivo de configuración
cp .env.example .env

# Editar configuración (opcional)
nano .env
```

**Contenido de `.env` por defecto:**
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_FACEBOOK_APP_ID=your-facebook-app-id
```

### **Variables de Entorno Backend**
```bash
# Copiar configuración backend
cp backend/.env.example backend/.env

# Editar configuración (opcional)
nano backend/.env
```

**Contenido de `backend/.env` por defecto:**
```env
DEBUG=true
DATABASE_URL=sqlite+aiosqlite:///./purpleshop.db
SECRET_KEY=your-secret-key-change-in-production
```

---

## 🗄️ **PASO 3: CONFIGURACIÓN DE BASE DE DATOS**

### **Opción A: SQLite (Automático - Recomendado para desarrollo)**
```bash
# No requiere configuración adicional
# La base de datos se crea automáticamente en backend/purpleshop.db
```

### **Opción B: PostgreSQL (Opcional - Para desarrollo avanzado)**
```bash
# Crear base de datos PostgreSQL
createdb purpleshop

# Crear usuario
createuser purpleshop -P

# Configurar conexión en backend/.env
DATABASE_URL=postgresql+asyncpg://purpleshop:password@localhost/purpleshop
```

---

## 🚀 **PASO 4: ARRANQUE DE SERVIDORES**

### **Método 1: Terminales Separadas (Recomendado)**

**Terminal 1 - Frontend:**
```bash
# Desde el directorio raíz
npm run dev
# ✅ Frontend disponible en: http://localhost:5173/
```

**Terminal 2 - Backend:**
```bash
# Desde el directorio raíz, navegar a backend
cd backend

# Activar entorno virtual (si no está activo)
source venv/bin/activate

# Ejecutar servidor de desarrollo
python run.py
# ✅ Backend disponible en: http://localhost:8000/
# ✅ Documentación API en: http://localhost:8000/docs
```

**Terminal 3 - Base de Datos (opcional):**
```bash
# Si usas PostgreSQL con Docker
docker-compose up db -d
# ✅ PostgreSQL disponible en: localhost:5432
```

### **Método 2: Script Automático (Más fácil)**

**Backend automático:**
```bash
# Desde el directorio raíz
cd backend

# Instalar y configurar automáticamente
python setup.py

# Ejecutar servidor
python run.py
```

### **Método 3: Docker Compose (Ambiente completo)**
```bash
# Desde el directorio raíz
docker-compose up -d

# ✅ Servicios disponibles:
# Frontend: http://localhost:5173/
# Backend: http://localhost:8000/
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

---

## ✅ **PASO 5: VERIFICACIÓN DE FUNCIONAMIENTO**

### **Verificar Frontend:**
```bash
# Deberías ver en el navegador:
curl -s http://localhost:5173 | head -5
# <!doctype html>...
```

### **Verificar Backend:**
```bash
# Health check del backend
curl http://localhost:8000/health
# {"status":"healthy","service":"PurpleShop API","version":"1.0.0"}

# Documentación API
open http://localhost:8000/docs
```

### **Verificar Base de Datos:**
```bash
# Verificar conexión a base de datos
cd backend
python -c "from app.core.database import check_database_connection; import asyncio; print(asyncio.run(check_database_connection()))"
# True (si está conectado correctamente)
```

---

## 🔧 **PASO 6: DESARROLLO Y DEBUGGING**

### **Flujo de Desarrollo Típico:**

**1. Desarrollo Frontend:**
```bash
# Terminal siempre corriendo
npm run dev
# ✅ Hot reload automático en cambios
```

**2. Desarrollo Backend:**
```bash
# Terminal siempre corriendo
cd backend && python run.py
# ✅ Auto-reload automático en cambios Python
```

**3. Ver Logs:**
```bash
# Frontend logs: Ver terminal de npm run dev
# Backend logs: Ver terminal de python run.py
# Base de datos: docker-compose logs db
```

### **Debugging Común:**

**❌ Error: "Backend API not available"**
```bash
# Solución:
cd backend
source venv/bin/activate
python run.py --host 0.0.0.0 --port 8000
```

**❌ Error: "Database connection failed"**
```bash
# Solución:
# 1. Verificar que PostgreSQL esté corriendo
docker-compose up db -d

# 2. O usar SQLite (más fácil)
# Editar backend/.env:
# DATABASE_URL=sqlite+aiosqlite:///./purpleshop.db
```

**❌ Error: "Module not found"**
```bash
# Solución:
cd backend
pip install -r requirements.txt
```

---

## 📊 **PASO 7: URLs IMPORTANTES**

| Servicio | URL | Estado |
|---|---|---|
| **Frontend** | http://localhost:5173/ | ⚡ Desarrollo |
| **Backend API** | http://localhost:8000/ | ⚡ Desarrollo |
| **API Docs** | http://localhost:8000/docs | 📚 Swagger |
| **API ReDoc** | http://localhost:8000/redoc | 📚 Documentación |
| **Health Check** | http://localhost:8000/health | 💚 Monitoreo |
| **Base de Datos** | localhost:5432 | 🗄️ PostgreSQL |

---

## 🛑 **PASO 8: PARAR SERVIDORES**

### **Parar Frontend:**
```bash
# En terminal de npm run dev: Ctrl+C
```

### **Parar Backend:**
```bash
# En terminal de python run.py: Ctrl+C
```

### **Parar Docker (si usas):**
```bash
docker-compose down
```

---

## 🚨 **SOLUCIÓN DE PROBLEMAS FRECUENTES**

### **🔴 Problema: Puerto ocupado**
```bash
# Ver qué usa el puerto
lsof -i :8000  # Para backend
lsof -i :5173  # Para frontend

# Solución: Cambiar puertos en configuración
```

### **🔴 Problema: Dependencias faltantes**
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### **🔴 Problema: Base de datos**
```bash
# Resetear base de datos SQLite
cd backend
rm -f purpleshop.db
python -c "from app.core.database import create_tables; import asyncio; asyncio.run(create_tables())"
```

---

## 🎯 **COMANDOS RÁPIDOS DE DESARROLLO**

### **Inicio Rápido (1 comando):**
```bash
# Terminal 1: Frontend
npm run dev &

# Terminal 2: Backend
cd backend && python run.py &

# Terminal 3: Base de datos (opcional)
docker-compose up db -d &
```

### **Estado de Servicios:**
```bash
# Ver procesos corriendo
ps aux | grep -E "(node|python|npm)" | grep -v grep

# Ver logs en tiempo real
# Terminal frontend: ya muestra logs
# Terminal backend: ya muestra logs
# Docker: docker-compose logs -f
```

---

## 📚 **RECURSOS DE DESARROLLO**

### **🔍 Debugging:**
- **React DevTools** - Extension del navegador
- **Redux DevTools** - Para estado de aplicación
- **Network Tab** - Ver llamadas API
- **Console** - Logs de JavaScript

### **📖 Documentación:**
- **API Docs**: http://localhost:8000/docs
- **Proyecto**: README.md
- **Backend**: backend/README.md

---

## ✅ **¿QUÉ DEBERÍAS VER?**

**🎨 Frontend:**
- Página principal de PurpleShop
- Indicador "API OK" en verde (conectado al backend)
- Funcionalidad completa de navegación

**⚡ Backend:**
- Respuesta JSON en health check
- Documentación Swagger funcional
- Logs de desarrollo en terminal

**🗄️ Base de Datos:**
- Tablas creadas automáticamente
- Datos de ejemplo disponibles
- Consultas funcionando correctamente

---

## 🚨 **PRÓXIMOS PASOS DESPUÉS DE ARRANCAR**

1. **✅ Verificar** que ambos servidores funcionan
2. **🎨 Desarrollar** nuevas funcionalidades
3. **🧪 Probar** la integración frontend-backend
4. **🐛 Debuggear** cualquier problema
5. **📦 Preparar** para despliegue

**¡PurpleShop debería estar corriendo completamente en modo desarrollo!** 🎉

¿Necesitas ayuda con algún paso específico o encuentras algún problema al seguir esta guía?