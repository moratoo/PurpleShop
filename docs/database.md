# Base de Datos - PurpleShop

## 🗄️ Diseño de Base de Datos

### Motor de Base de Datos
**PostgreSQL 15+** (Recomendado)
- Soporte completo para JSON
- Búsqueda de texto completo
- Extensiones geoespaciales (PostGIS)
- Excelente rendimiento para aplicaciones web

### Esquema de Base de Datos

```sql
-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Tabla de usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(20),
    location JSONB,
    bio TEXT,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    oauth_provider VARCHAR(50) NOT NULL, -- 'google', 'microsoft', 'apple', etc.
    oauth_id VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de categorías
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    emoji VARCHAR(10),
    parent_id UUID REFERENCES categories(id),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2), -- NULL para productos gratuitos
    condition VARCHAR(20) NOT NULL CHECK (condition IN ('new', 'used', 'free')),
    category_id UUID NOT NULL REFERENCES categories(id),
    user_id UUID NOT NULL REFERENCES users(id),
    images JSONB DEFAULT '[]'::jsonb,
    location JSONB NOT NULL, -- {city, coordinates: [lat, lng]}
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'reserved', 'inactive')),
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de conversaciones
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'blocked')),
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, buyer_id, seller_id)
);

-- Tabla de mensajes
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    sender_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'offer')),
    metadata JSONB, -- Para ofertas, imágenes, etc.
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de favoritos
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    product_id UUID NOT NULL REFERENCES products(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Tabla de transacciones
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(10,2),
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('sale', 'donation')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    payment_method VARCHAR(50),
    payment_id VARCHAR(255), -- ID del procesador de pagos
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    reviewer_id UUID NOT NULL REFERENCES users(id),
    reviewed_id UUID NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(transaction_id, reviewer_id)
);

-- Tabla de reportes
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES users(id),
    reported_user_id UUID REFERENCES users(id),
    reported_product_id UUID REFERENCES products(id),
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de notificaciones
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de eventos de analytics
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50), -- 'product', 'user', 'search'
    entity_id UUID,
    data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📊 Índices para Optimización

```sql
-- Índices para productos
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_user ON products(user_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_condition ON products(condition);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_location ON products USING GIN(location);
CREATE INDEX idx_products_search ON products USING GIN(to_tsvector('spanish', title || ' ' || description));

-- Índices para mensajes
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Índices para conversaciones
CREATE INDEX idx_conversations_buyer ON conversations(buyer_id);
CREATE INDEX idx_conversations_seller ON conversations(seller_id);
CREATE INDEX idx_conversations_product ON conversations(product_id);

-- Índices para favoritos
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_product ON favorites(product_id);

-- Índices para eventos
CREATE INDEX idx_events_user ON events(user_id);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
```

## 🔧 Triggers y Funciones

### Trigger para actualizar updated_at
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Trigger para actualizar rating de usuarios
```sql
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users 
    SET 
        rating = (
            SELECT AVG(rating)::DECIMAL(3,2) 
            FROM reviews 
            WHERE reviewed_id = NEW.reviewed_id
        ),
        total_ratings = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE reviewed_id = NEW.reviewed_id
        )
    WHERE id = NEW.reviewed_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_rating_trigger
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_user_rating();
```

### Trigger para actualizar contador de favoritos
```sql
CREATE OR REPLACE FUNCTION update_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE products 
        SET favorites_count = favorites_count + 1 
        WHERE id = NEW.product_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE products 
        SET favorites_count = favorites_count - 1 
        WHERE id = OLD.product_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER favorites_count_trigger
    AFTER INSERT OR DELETE ON favorites
    FOR EACH ROW EXECUTE FUNCTION update_favorites_count();
```

## 📈 Datos de Ejemplo

### Insertar categorías
```sql
INSERT INTO categories (name, slug, emoji, parent_id) VALUES
('Tecnología', 'tecnologia', '💻', NULL),
('Hogar', 'hogar', '🏠', NULL),
('Ropa', 'ropa', '👕', NULL),
('Deportes', 'deportes', '⚽', NULL),
('Libros', 'libros', '📚', NULL),
('Gaming', 'gaming', '🎮', NULL);

-- Subcategorías de Tecnología
INSERT INTO categories (name, slug, emoji, parent_id) VALUES
('Móviles', 'moviles', '📱', (SELECT id FROM categories WHERE slug = 'tecnologia')),
('Ordenadores', 'ordenadores', '💻', (SELECT id FROM categories WHERE slug = 'tecnologia')),
('Accesorios', 'accesorios-tech', '🔌', (SELECT id FROM categories WHERE slug = 'tecnologia'));
```

### Insertar usuarios de ejemplo
```sql
INSERT INTO users (email, name, oauth_provider, oauth_id, location) VALUES
('juan@example.com', 'Juan Pérez', 'google', 'google_123', '{"city": "Madrid", "coordinates": [40.4168, -3.7038]}'),
('maria@example.com', 'María García', 'microsoft', 'ms_456', '{"city": "Barcelona", "coordinates": [41.3851, 2.1734]}'),
('carlos@example.com', 'Carlos López', 'apple', 'apple_789', '{"city": "Valencia", "coordinates": [39.4699, -0.3763]}');
```

## 🔍 Consultas Comunes

### Buscar productos por ubicación
```sql
SELECT p.*, u.name as seller_name, c.name as category_name
FROM products p
JOIN users u ON p.user_id = u.id
JOIN categories c ON p.category_id = c.id
WHERE p.status = 'active'
  AND p.location->>'city' = 'Madrid'
ORDER BY p.created_at DESC
LIMIT 20;
```

### Búsqueda de texto completo
```sql
SELECT p.*, 
       ts_rank(to_tsvector('spanish', p.title || ' ' || p.description), 
               plainto_tsquery('spanish', 'iPhone')) as rank
FROM products p
WHERE to_tsvector('spanish', p.title || ' ' || p.description) @@ plainto_tsquery('spanish', 'iPhone')
  AND p.status = 'active'
ORDER BY rank DESC, p.created_at DESC;
```

### Productos más populares por categoría
```sql
SELECT p.*, c.name as category_name, p.views_count + p.favorites_count as popularity
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.status = 'active'
  AND c.slug = 'tecnologia'
ORDER BY popularity DESC
LIMIT 10;
```

### Conversaciones activas de un usuario
```sql
SELECT c.*, 
       p.title as product_title,
       p.images->0 as product_image,
       CASE 
         WHEN c.buyer_id = $1 THEN seller.name 
         ELSE buyer.name 
       END as other_user_name,
       m.content as last_message,
       m.created_at as last_message_at
FROM conversations c
JOIN products p ON c.product_id = p.id
JOIN users buyer ON c.buyer_id = buyer.id
JOIN users seller ON c.seller_id = seller.id
LEFT JOIN LATERAL (
    SELECT content, created_at 
    FROM messages 
    WHERE conversation_id = c.id 
    ORDER BY created_at DESC 
    LIMIT 1
) m ON true
WHERE (c.buyer_id = $1 OR c.seller_id = $1)
  AND c.status = 'active'
ORDER BY COALESCE(m.created_at, c.created_at) DESC;
```

## 🚀 Optimizaciones de Rendimiento

### Particionado de tablas grandes
```sql
-- Particionar eventos por mes
CREATE TABLE events_y2024m01 PARTITION OF events
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE events_y2024m02 PARTITION OF events
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

### Vistas materializadas para analytics
```sql
CREATE MATERIALIZED VIEW popular_products AS
SELECT 
    p.id,
    p.title,
    p.price,
    p.views_count,
    p.favorites_count,
    c.name as category_name,
    p.views_count + p.favorites_count * 2 as popularity_score
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.status = 'active'
ORDER BY popularity_score DESC;

-- Refrescar cada hora
CREATE INDEX ON popular_products (popularity_score DESC);
```

## 🔒 Seguridad de Datos

### Row Level Security (RLS)
```sql
-- Habilitar RLS en productos
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo pueden ver productos activos o sus propios productos
CREATE POLICY products_select_policy ON products
FOR SELECT USING (
    status = 'active' OR 
    user_id = current_setting('app.current_user_id')::UUID
);

-- Los usuarios solo pueden actualizar sus propios productos
CREATE POLICY products_update_policy ON products
FOR UPDATE USING (user_id = current_setting('app.current_user_id')::UUID);
```

### Encriptación de datos sensibles
```sql
-- Extensión para encriptación
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Función para encriptar datos sensibles
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(encrypt(data::bytea, 'encryption_key', 'aes'), 'base64');
END;
$$ LANGUAGE plpgsql;
```

## 📊 Monitoreo y Mantenimiento

### Estadísticas de uso
```sql
-- Consulta para estadísticas diarias
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_products,
    COUNT(*) FILTER (WHERE condition = 'free') as free_products,
    COUNT(*) FILTER (WHERE condition = 'used') as used_products,
    COUNT(*) FILTER (WHERE condition = 'new') as new_products
FROM products
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Limpieza automática
```sql
-- Eliminar eventos antiguos (más de 1 año)
DELETE FROM events 
WHERE created_at < NOW() - INTERVAL '1 year';

-- Eliminar notificaciones leídas antiguas (más de 3 meses)
DELETE FROM notifications 
WHERE is_read = true 
  AND created_at < NOW() - INTERVAL '3 months';
```

## 🔄 Backup y Recuperación

### Script de backup
```bash
#!/bin/bash
# backup.sh
pg_dump -h localhost -U postgres -d purpleshop \
  --format=custom \
  --compress=9 \
  --file="backup_$(date +%Y%m%d_%H%M%S).dump"
```

### Restauración
```bash
pg_restore -h localhost -U postgres -d purpleshop_new backup_file.dump
```