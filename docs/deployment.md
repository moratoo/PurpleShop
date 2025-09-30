# Guía de Despliegue - PurpleShop

## 🚀 Opciones de Despliegue

### 1. Netlify (Recomendado para Frontend)

#### Despliegue Automático desde Git
```bash
# 1. Conectar repositorio en Netlify Dashboard
# 2. Configurar build settings:
Build command: npm run build
Publish directory: dist
Node version: 18

# 3. Variables de entorno en Netlify:
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
VITE_APPLE_CLIENT_ID=your_apple_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
VITE_TWITTER_CLIENT_ID=your_twitter_client_id
```

#### Despliegue Manual
```bash
# Build local
npm run build

# Instalar Netlify CLI
npm install -g netlify-cli

# Login y deploy
netlify login
netlify deploy --prod --dir=dist
```

#### Configuración de Redirects
```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 2. Vercel

#### Despliegue con CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configurar variables de entorno
vercel env add VITE_GOOGLE_CLIENT_ID
```

#### Configuración vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3. AWS S3 + CloudFront

#### Script de Despliegue
```bash
#!/bin/bash
# deploy-aws.sh

# Variables
BUCKET_NAME="purpleshop-frontend"
DISTRIBUTION_ID="E1234567890123"
REGION="us-east-1"

# Build
npm run build

# Sync to S3
aws s3 sync dist/ s3://$BUCKET_NAME --delete --region $REGION

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment completed!"
```

#### Configuración de S3 Bucket
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::purpleshop-frontend/*"
    }
  ]
}
```

#### CloudFront Distribution
```yaml
# cloudformation-template.yml
Resources:
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt S3Bucket.DomainName
            Id: S3Origin
            S3OriginConfig:
              OriginAccessIdentity: !Sub "origin-access-identity/cloudfront/${OriginAccessIdentity}"
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad # Managed-CachingOptimized
        CustomErrorResponses:
          - ErrorCode: 404
            ResponseCode: 200
            ResponsePagePath: /index.html
```

### 4. Google Cloud Platform

#### App Engine
```yaml
# app.yaml
runtime: nodejs18

handlers:
  - url: /static
    static_dir: dist/static
    secure: always

  - url: /.*
    static_files: dist/index.html
    upload: dist/index.html
    secure: always

env_variables:
  VITE_GOOGLE_CLIENT_ID: "your_client_id"
```

#### Cloud Run
```dockerfile
# Dockerfile para Cloud Run
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Deploy a Cloud Run
gcloud run deploy purpleshop \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### 5. DigitalOcean App Platform

#### Configuración app.yaml
```yaml
name: purpleshop
services:
- name: frontend
  source_dir: /
  github:
    repo: your-username/purpleshop
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  routes:
  - path: /
  envs:
  - key: VITE_GOOGLE_CLIENT_ID
    value: your_client_id
    type: SECRET
```

### 6. Heroku

#### Configuración
```json
// package.json - agregar scripts
{
  "scripts": {
    "start": "serve -s dist -l $PORT",
    "heroku-postbuild": "npm run build"
  }
}
```

```bash
# Instalar serve
npm install --save serve

# Crear Procfile
echo "web: npm start" > Procfile

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Configurar variables de entorno
heroku config:set VITE_GOOGLE_CLIENT_ID=your_client_id
```

## 🐳 Despliegue con Docker

### Dockerfile Optimizado
```dockerfile
# Multi-stage build
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production --silent

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Add labels
LABEL maintainer="PurpleShop Team"
LABEL version="1.0"

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security
        location ~ /\. {
            deny all;
        }
    }
}
```

### Docker Compose para Desarrollo
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Futuro: Backend services
  # backend:
  #   build: ./backend
  #   ports:
  #     - "3000:3000"
  #   environment:
  #     - DATABASE_URL=postgresql://user:pass@db:5432/purpleshop
  #   depends_on:
  #     - db

  # db:
  #   image: postgres:15
  #   environment:
  #     POSTGRES_DB: purpleshop
  #     POSTGRES_USER: user
  #     POSTGRES_PASSWORD: pass
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data

# volumes:
#   postgres_data:
```

### Comandos Docker
```bash
# Build imagen
docker build -t purpleshop:latest .

# Run contenedor
docker run -d -p 80:80 --name purpleshop purpleshop:latest

# Con docker-compose
docker-compose up -d

# Ver logs
docker logs purpleshop

# Actualizar
docker-compose pull
docker-compose up -d
```

## ☸️ Kubernetes Deployment

### Deployment Manifest
```yaml
# k8s/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: purpleshop-frontend
  labels:
    app: purpleshop-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: purpleshop-frontend
  template:
    metadata:
      labels:
        app: purpleshop-frontend
    spec:
      containers:
      - name: frontend
        image: purpleshop:latest
        ports:
        - containerPort: 80
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: purpleshop-frontend-service
spec:
  selector:
    app: purpleshop-frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```

### Ingress Configuration
```yaml
# k8s/ingress.yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: purpleshop-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - purpleshop.com
    secretName: purpleshop-tls
  rules:
  - host: purpleshop.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: purpleshop-frontend-service
            port:
              number: 80
```

### ConfigMap para Variables de Entorno
```yaml
# k8s/configmap.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: purpleshop-config
data:
  NODE_ENV: "production"
  VITE_API_URL: "https://api.purpleshop.com"
---
apiVersion: v1
kind: Secret
metadata:
  name: purpleshop-secrets
type: Opaque
stringData:
  VITE_GOOGLE_CLIENT_ID: "your_google_client_id"
  VITE_MICROSOFT_CLIENT_ID: "your_microsoft_client_id"
```

### Deploy Commands
```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get services

# View logs
kubectl logs -f deployment/purpleshop-frontend

# Scale deployment
kubectl scale deployment purpleshop-frontend --replicas=5

# Rolling update
kubectl set image deployment/purpleshop-frontend \
  frontend=purpleshop:v2.0.0

# Rollback
kubectl rollout undo deployment/purpleshop-frontend
```

## 🔧 Variables de Entorno por Ambiente

### Development
```env
NODE_ENV=development
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=dev_google_client_id
VITE_MICROSOFT_CLIENT_ID=dev_microsoft_client_id
VITE_APPLE_CLIENT_ID=dev_apple_client_id
VITE_FACEBOOK_APP_ID=dev_facebook_app_id
VITE_TWITTER_CLIENT_ID=dev_twitter_client_id
```

### Staging
```env
NODE_ENV=staging
VITE_API_URL=https://api-staging.purpleshop.com/api
VITE_GOOGLE_CLIENT_ID=staging_google_client_id
VITE_MICROSOFT_CLIENT_ID=staging_microsoft_client_id
VITE_APPLE_CLIENT_ID=staging_apple_client_id
VITE_FACEBOOK_APP_ID=staging_facebook_app_id
VITE_TWITTER_CLIENT_ID=staging_twitter_client_id
```

### Production
```env
NODE_ENV=production
VITE_API_URL=https://api.purpleshop.com/api
VITE_GOOGLE_CLIENT_ID=prod_google_client_id
VITE_MICROSOFT_CLIENT_ID=prod_microsoft_client_id
VITE_APPLE_CLIENT_ID=prod_apple_client_id
VITE_FACEBOOK_APP_ID=prod_facebook_app_id
VITE_TWITTER_CLIENT_ID=prod_twitter_client_id
```

## 📊 Monitoreo Post-Despliegue

### Health Checks
```bash
# Script de health check
#!/bin/bash
# health-check.sh

URL="https://purpleshop.com"
EXPECTED_STATUS=200

response=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $response -eq $EXPECTED_STATUS ]; then
    echo "✅ Site is healthy (Status: $response)"
    exit 0
else
    echo "❌ Site is down (Status: $response)"
    exit 1
fi
```

### Uptime Monitoring
```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: uptime-kuma
    volumes:
      - uptime-kuma:/app/data
    ports:
      - "3001:3001"
    restart: unless-stopped

volumes:
  uptime-kuma:
```

### Performance Monitoring
```javascript
// Google Analytics 4
gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: document.title,
  page_location: window.location.href
});

// Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🚨 Rollback Procedures

### Netlify Rollback
```bash
# Ver deployments
netlify sites:list

# Rollback a deployment anterior
netlify api rollbackSiteDeploy --data='{"deploy_id":"DEPLOY_ID"}'
```

### Docker Rollback
```bash
# Tag anterior
docker tag purpleshop:v1.0.0 purpleshop:latest

# Restart containers
docker-compose up -d
```

### Kubernetes Rollback
```bash
# Ver historial de rollouts
kubectl rollout history deployment/purpleshop-frontend

# Rollback a versión anterior
kubectl rollout undo deployment/purpleshop-frontend

# Rollback a versión específica
kubectl rollout undo deployment/purpleshop-frontend --to-revision=2
```

## 📋 Checklist de Despliegue

### Pre-Despliegue
- [ ] Tests pasando
- [ ] Build exitoso
- [ ] Variables de entorno configuradas
- [ ] SSL/TLS configurado
- [ ] DNS configurado
- [ ] Backup de datos (si aplica)

### Post-Despliegue
- [ ] Health checks pasando
- [ ] Funcionalidades críticas funcionando
- [ ] Performance acceptable
- [ ] Logs sin errores críticos
- [ ] Monitoreo configurado
- [ ] Equipo notificado

### Rollback Plan
- [ ] Procedimiento de rollback documentado
- [ ] Acceso a versión anterior
- [ ] Tiempo estimado de rollback
- [ ] Responsables identificados