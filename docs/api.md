# API Documentation - PurpleShop

## 🌐 API REST

### Base URL
```
Production: https://api.purpleshop.com/v1
Development: http://localhost:3000/api/v1
```

### Autenticación
Todas las rutas protegidas requieren un token JWT en el header:
```
Authorization: Bearer <jwt_token>
```

## 🔐 Autenticación

### POST /auth/google
Autenticación con Google OAuth

**Request Body:**
```json
{
  "token": "google_oauth_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar_url": "https://...",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token",
    "expires_in": 604800
  }
}
```

### POST /auth/microsoft
Autenticación con Microsoft OAuth

**Request Body:**
```json
{
  "code": "microsoft_auth_code",
  "redirect_uri": "https://app.purpleshop.com/callback"
}
```

### POST /auth/refresh
Renovar token JWT

**Request Body:**
```json
{
  "refresh_token": "refresh_token"
}
```

### POST /auth/logout
Cerrar sesión

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## 👤 Usuarios

### GET /users/profile
Obtener perfil del usuario autenticado

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar_url": "https://...",
    "phone": "+34600000000",
    "location": {
      "city": "Madrid",
      "coordinates": [40.4168, -3.7038]
    },
    "bio": "User bio",
    "rating": 4.5,
    "total_ratings": 10,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /users/profile
Actualizar perfil del usuario

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+34600000001",
  "location": {
    "city": "Barcelona",
    "coordinates": [41.3851, 2.1734]
  },
  "bio": "Updated bio"
}
```

### GET /users/:id
Obtener perfil público de un usuario

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "avatar_url": "https://...",
    "rating": 4.5,
    "total_ratings": 10,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /users/:id/products
Obtener productos de un usuario

**Query Parameters:**
- `page` (number): Página (default: 1)
- `limit` (number): Elementos por página (default: 20)
- `status` (string): Estado del producto (active, sold, etc.)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

## 📦 Productos

### GET /products
Listar productos

**Query Parameters:**
- `page` (number): Página (default: 1)
- `limit` (number): Elementos por página (default: 20)
- `category` (string): ID de categoría
- `condition` (string): new, used, free
- `location` (string): Ciudad
- `search` (string): Término de búsqueda
- `min_price` (number): Precio mínimo
- `max_price` (number): Precio máximo
- `sort` (string): created_at, price, popularity

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "title": "iPhone 13",
        "description": "Excelente estado",
        "price": 599.99,
        "condition": "used",
        "category": {
          "id": "uuid",
          "name": "Tecnología",
          "slug": "tecnologia"
        },
        "images": [
          "https://storage.purpleshop.com/products/image1.jpg"
        ],
        "location": {
          "city": "Madrid",
          "coordinates": [40.4168, -3.7038]
        },
        "user": {
          "id": "uuid",
          "name": "John Doe",
          "avatar_url": "https://...",
          "rating": 4.5
        },
        "views_count": 150,
        "favorites_count": 12,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### POST /products
Crear nuevo producto

**Headers:** `Authorization: Bearer <token>`

**Request Body (multipart/form-data):**
```
title: "iPhone 13"
description: "Excelente estado, sin arañazos"
price: 599.99
condition: "used"
category_id: "uuid"
location: {"city": "Madrid", "coordinates": [40.4168, -3.7038]}
tags: ["smartphone", "apple"]
images: [File, File, ...]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "iPhone 13",
    "description": "Excelente estado",
    "price": 599.99,
    "condition": "used",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### GET /products/:id
Obtener producto específico

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "iPhone 13",
    "description": "Descripción completa del producto...",
    "price": 599.99,
    "condition": "used",
    "category": {
      "id": "uuid",
      "name": "Tecnología",
      "slug": "tecnologia"
    },
    "images": [
      "https://storage.purpleshop.com/products/image1.jpg",
      "https://storage.purpleshop.com/products/image2.jpg"
    ],
    "location": {
      "city": "Madrid",
      "coordinates": [40.4168, -3.7038]
    },
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "avatar_url": "https://...",
      "rating": 4.5,
      "total_ratings": 10
    },
    "views_count": 150,
    "favorites_count": 12,
    "tags": ["smartphone", "apple"],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /products/:id
Actualizar producto

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "iPhone 13 - Actualizado",
  "description": "Nueva descripción",
  "price": 549.99,
  "status": "active"
}
```

### DELETE /products/:id
Eliminar producto

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### POST /products/:id/images
Subir imágenes adicionales

**Headers:** `Authorization: Bearer <token>`

**Request Body (multipart/form-data):**
```
images: [File, File, ...]
```

### POST /products/:id/view
Registrar visualización de producto

**Response:**
```json
{
  "success": true,
  "data": {
    "views_count": 151
  }
}
```

## ❤️ Favoritos

### GET /favorites
Obtener productos favoritos del usuario

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Página (default: 1)
- `limit` (number): Elementos por página (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": "uuid",
        "product": {
          "id": "uuid",
          "title": "iPhone 13",
          "price": 599.99,
          "images": ["https://..."],
          "location": {"city": "Madrid"}
        },
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

### POST /favorites
Agregar producto a favoritos

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "product_id": "uuid"
}
```

### DELETE /favorites/:product_id
Eliminar producto de favoritos

**Headers:** `Authorization: Bearer <token>`

## 📂 Categorías

### GET /categories
Obtener todas las categorías

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Tecnología",
      "slug": "tecnologia",
      "emoji": "💻",
      "parent_id": null,
      "children": [
        {
          "id": "uuid",
          "name": "Móviles",
          "slug": "moviles",
          "emoji": "📱"
        }
      ]
    }
  ]
}
```

### GET /categories/:slug/products
Obtener productos de una categoría

**Query Parameters:** (mismos que GET /products)

## 💬 Mensajería

### GET /conversations
Obtener conversaciones del usuario

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "product": {
        "id": "uuid",
        "title": "iPhone 13",
        "images": ["https://..."]
      },
      "other_user": {
        "id": "uuid",
        "name": "John Doe",
        "avatar_url": "https://..."
      },
      "last_message": {
        "content": "¿Sigue disponible?",
        "created_at": "2024-01-01T12:00:00Z"
      },
      "unread_count": 2,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /conversations
Crear nueva conversación

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "product_id": "uuid",
  "message": "Hola, ¿sigue disponible este producto?"
}
```

### GET /conversations/:id/messages
Obtener mensajes de una conversación

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Página (default: 1)
- `limit` (number): Elementos por página (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "sender": {
          "id": "uuid",
          "name": "John Doe"
        },
        "content": "Hola, ¿sigue disponible?",
        "message_type": "text",
        "is_read": true,
        "created_at": "2024-01-01T12:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

### POST /conversations/:id/messages
Enviar mensaje

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "Sí, sigue disponible",
  "message_type": "text"
}
```

### PUT /conversations/:id/messages/read
Marcar mensajes como leídos

**Headers:** `Authorization: Bearer <token>`

## 🔍 Búsqueda

### GET /search
Búsqueda avanzada

**Query Parameters:**
- `q` (string): Término de búsqueda
- `category` (string): Categoría
- `location` (string): Ciudad
- `condition` (string): Estado del producto
- `min_price` (number): Precio mínimo
- `max_price` (number): Precio máximo
- `radius` (number): Radio en km desde ubicación
- `lat` (number): Latitud para búsqueda por proximidad
- `lng` (number): Longitud para búsqueda por proximidad

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "suggestions": ["iphone", "smartphone", "apple"],
    "filters": {
      "categories": [
        {"id": "uuid", "name": "Tecnología", "count": 45}
      ],
      "locations": [
        {"city": "Madrid", "count": 30}
      ],
      "price_ranges": [
        {"min": 0, "max": 100, "count": 15},
        {"min": 100, "max": 500, "count": 25}
      ]
    },
    "pagination": {...}
  }
}
```

### GET /search/suggestions
Obtener sugerencias de búsqueda

**Query Parameters:**
- `q` (string): Término parcial

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      "iPhone 13",
      "iPhone 12",
      "iPad Pro"
    ]
  }
}
```

## 📊 Analytics

### POST /analytics/events
Registrar evento de analytics

**Request Body:**
```json
{
  "event_type": "product_view",
  "entity_type": "product",
  "entity_id": "uuid",
  "data": {
    "source": "search",
    "query": "iphone"
  }
}
```

## 🚨 Reportes

### POST /reports
Reportar usuario o producto

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "reported_user_id": "uuid", // O reported_product_id
  "reason": "inappropriate_content",
  "description": "Descripción del problema"
}
```

## 📱 Notificaciones

### GET /notifications
Obtener notificaciones del usuario

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "new_message",
      "title": "Nuevo mensaje",
      "message": "Tienes un nuevo mensaje de John Doe",
      "data": {
        "conversation_id": "uuid"
      },
      "is_read": false,
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### PUT /notifications/:id/read
Marcar notificación como leída

**Headers:** `Authorization: Bearer <token>`

## 🔄 WebSocket Events

### Conexión
```javascript
const socket = io('wss://api.purpleshop.com', {
  auth: {
    token: 'jwt_token'
  }
});
```

### Eventos de Chat
```javascript
// Unirse a conversación
socket.emit('join-conversation', conversationId);

// Enviar mensaje
socket.emit('send-message', {
  conversation_id: 'uuid',
  content: 'Hola',
  message_type: 'text'
});

// Recibir mensaje
socket.on('new-message', (message) => {
  console.log('Nuevo mensaje:', message);
});

// Usuario escribiendo
socket.emit('typing', { conversation_id: 'uuid' });
socket.on('user-typing', (data) => {
  console.log(`${data.user_name} está escribiendo...`);
});
```

## ❌ Códigos de Error

### Códigos HTTP
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

### Formato de Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos proporcionados no son válidos",
    "details": [
      {
        "field": "title",
        "message": "El título es requerido"
      }
    ]
  }
}
```

## 🔒 Rate Limiting

### Límites por Endpoint
- **General**: 100 requests/15min
- **Auth**: 5 requests/15min
- **Upload**: 10 requests/hour
- **Search**: 60 requests/min

### Headers de Rate Limit
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```