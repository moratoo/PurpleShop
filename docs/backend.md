# Backend - PurpleShop

## 🏗️ Arquitectura del Backend (Propuesta)

> **Nota**: Actualmente PurpleShop es una aplicación frontend-only con datos mock. Esta documentación describe la arquitectura backend propuesta para futuras implementaciones.

### Stack Tecnológico Recomendado
- **Node.js** con **Express.js**
- **TypeScript** para tipado estático
- **PostgreSQL** como base de datos principal
- **Redis** para cache y sesiones
- **JWT** para autenticación
- **Multer** para upload de archivos
- **Nodemailer** para emails
- **Socket.io** para chat en tiempo real

### Estructura del Proyecto Backend

```
backend/
├── src/
│   ├── controllers/        # Controladores de rutas
│   │   ├── auth.controller.ts
│   │   ├── products.controller.ts
│   │   ├── users.controller.ts
│   │   ├── categories.controller.ts
│   │   └── messages.controller.ts
│   ├── middleware/         # Middlewares
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── upload.middleware.ts
│   │   └── rateLimit.middleware.ts
│   ├── models/            # Modelos de datos
│   │   ├── User.model.ts
│   │   ├── Product.model.ts
│   │   ├── Category.model.ts
│   │   ├── Message.model.ts
│   │   └── Transaction.model.ts
│   ├── routes/            # Definición de rutas
│   │   ├── auth.routes.ts
│   │   ├── products.routes.ts
│   │   ├── users.routes.ts
│   │   └── messages.routes.ts
│   ├── services/          # Lógica de negocio
│   │   ├── auth.service.ts
│   │   ├── products.service.ts
│   │   ├── email.service.ts
│   │   ├── upload.service.ts
│   │   └── notification.service.ts
│   ├── utils/             # Utilidades
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── validation.ts
│   │   └── helpers.ts
│   ├── types/             # Tipos TypeScript
│   │   ├── auth.types.ts
│   │   ├── product.types.ts
│   │   └── user.types.ts
│   └── app.ts             # Configuración principal
├── uploads/               # Archivos subidos
├── tests/                 # Tests
├── docker/                # Configuración Docker
├── package.json
└── tsconfig.json
```

## 🔐 Sistema de Autenticación

### OAuth Integration
```typescript
// src/services/auth.service.ts
export class AuthService {
  async googleAuth(token: string): Promise<AuthResponse> {
    // Verificar token con Google
    // Crear o actualizar usuario
    // Generar JWT
  }

  async microsoftAuth(code: string): Promise<AuthResponse> {
    // Intercambiar código por token
    // Obtener datos del usuario
    // Crear o actualizar usuario
  }

  async generateJWT(user: User): Promise<string> {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
}
```

### Middleware de Autenticación
```typescript
// src/middleware/auth.middleware.ts
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
```

## 📦 Gestión de Productos

### Modelo de Producto
```typescript
// src/models/Product.model.ts
export interface Product {
  id: string;
  title: string;
  description: string;
  price?: number;
  category: string;
  subcategory: string;
  condition: 'new' | 'used' | 'free';
  images: string[];
  location: {
    city: string;
    coordinates: [number, number];
  };
  userId: string;
  status: 'active' | 'sold' | 'reserved' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

### Controlador de Productos
```typescript
// src/controllers/products.controller.ts
export class ProductsController {
  async getProducts(req: Request, res: Response) {
    const { category, location, search, page = 1, limit = 20 } = req.query;
    
    const filters = {
      ...(category && { category }),
      ...(location && { 'location.city': location }),
      ...(search && { 
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      })
    };

    const products = await ProductService.getProducts(filters, page, limit);
    res.json(products);
  }

  async createProduct(req: Request, res: Response) {
    const productData = req.body;
    const userId = req.user.userId;
    const images = req.files?.map(file => file.path) || [];

    const product = await ProductService.createProduct({
      ...productData,
      userId,
      images
    });

    res.status(201).json(product);
  }
}
```

## 💬 Sistema de Mensajería

### WebSocket para Chat en Tiempo Real
```typescript
// src/services/chat.service.ts
import { Server } from 'socket.io';

export class ChatService {
  private io: Server;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"]
      }
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      socket.on('join-room', (roomId) => {
        socket.join(roomId);
      });

      socket.on('send-message', async (data) => {
        const message = await MessageService.createMessage(data);
        this.io.to(data.roomId).emit('new-message', message);
      });
    });
  }
}
```

## 📧 Sistema de Notificaciones

### Email Service
```typescript
// src/services/email.service.ts
import nodemailer from 'nodemailer';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendWelcomeEmail(user: User) {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: 'Bienvenido a PurpleShop',
      template: 'welcome',
      context: { userName: user.name }
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendProductInterestEmail(product: Product, interestedUser: User) {
    // Notificar al vendedor sobre interés en su producto
  }
}
```

## 🔍 Sistema de Búsqueda

### Elasticsearch Integration (Opcional)
```typescript
// src/services/search.service.ts
import { Client } from '@elastic/elasticsearch';

export class SearchService {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL
    });
  }

  async indexProduct(product: Product) {
    return this.client.index({
      index: 'products',
      id: product.id,
      body: {
        title: product.title,
        description: product.description,
        category: product.category,
        location: product.location,
        price: product.price
      }
    });
  }

  async searchProducts(query: string, filters: any) {
    const searchBody = {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query,
                fields: ['title^2', 'description']
              }
            }
          ],
          filter: Object.entries(filters).map(([key, value]) => ({
            term: { [key]: value }
          }))
        }
      }
    };

    return this.client.search({
      index: 'products',
      body: searchBody
    });
  }
}
```

## 📊 Analytics y Métricas

### Tracking de Eventos
```typescript
// src/services/analytics.service.ts
export class AnalyticsService {
  async trackProductView(productId: string, userId?: string) {
    // Registrar visualización de producto
    await EventModel.create({
      type: 'product_view',
      productId,
      userId,
      timestamp: new Date()
    });
  }

  async trackSearch(query: string, results: number) {
    // Registrar búsqueda
    await EventModel.create({
      type: 'search',
      data: { query, results },
      timestamp: new Date()
    });
  }

  async getProductStats(productId: string) {
    return EventModel.aggregate([
      { $match: { productId, type: 'product_view' } },
      { $group: { _id: null, views: { $sum: 1 } } }
    ]);
  }
}
```

## 🔒 Seguridad

### Rate Limiting
```typescript
// src/middleware/rateLimit.middleware.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas solicitudes, intenta más tarde'
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // máximo 5 intentos de login por ventana
  skipSuccessfulRequests: true
});
```

### Validación de Datos
```typescript
// src/middleware/validation.middleware.ts
import Joi from 'joi';

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    price: Joi.number().min(0).optional(),
    category: Joi.string().required(),
    location: Joi.object({
      city: Joi.string().required(),
      coordinates: Joi.array().items(Joi.number()).length(2)
    }).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
```

## 🚀 API Endpoints

### Productos
```
GET    /api/products              # Listar productos
POST   /api/products              # Crear producto
GET    /api/products/:id          # Obtener producto
PUT    /api/products/:id          # Actualizar producto
DELETE /api/products/:id          # Eliminar producto
POST   /api/products/:id/images   # Subir imágenes
```

### Usuarios
```
GET    /api/users/profile         # Perfil del usuario
PUT    /api/users/profile         # Actualizar perfil
GET    /api/users/:id/products    # Productos del usuario
POST   /api/users/:id/follow      # Seguir usuario
```

### Autenticación
```
POST   /api/auth/google           # Login con Google
POST   /api/auth/microsoft        # Login con Microsoft
POST   /api/auth/refresh          # Renovar token
POST   /api/auth/logout           # Cerrar sesión
```

## 🐳 Containerización

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/purpleshop
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: purpleshop
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```