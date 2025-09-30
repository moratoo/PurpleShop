# Frontend - PurpleShop

## 🏗️ Arquitectura del Frontend

### Stack Tecnológico
- **React 18** con TypeScript
- **Vite** como build tool y dev server
- **Tailwind CSS** para estilos
- **React i18next** para internacionalización
- **Lucide React** para iconos

### Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── AuthModal.tsx   # Modal de autenticación
│   └── LanguageSelector.tsx # Selector de idioma
├── pages/              # Páginas de la aplicación
│   ├── company/        # Páginas corporativas
│   │   ├── About.tsx
│   │   ├── Careers.tsx
│   │   ├── Press.tsx
│   │   └── SocialImpact.tsx
│   └── legal/          # Páginas legales
│       ├── Terms.tsx
│       ├── Privacy.tsx
│       ├── Cookies.tsx
│       └── Legal.tsx
├── i18n/               # Configuración de internacionalización
│   ├── index.ts        # Configuración principal
│   └── locales/        # Archivos de traducción
│       ├── en.json
│       ├── es.json
│       ├── de.json
│       ├── fr.json
│       ├── it.json
│       └── pt.json
├── App.tsx             # Componente principal
├── main.tsx            # Punto de entrada
└── index.css           # Estilos globales
```

## 🎨 Sistema de Diseño

### Colores
- **Primario**: Purple-600 (#9333ea)
- **Secundario**: Gray-800 (#1f2937)
- **Fondo**: Gray-50 (#f9fafb)
- **Texto**: Gray-900 (#111827)

### Tipografía
- **Font Family**: Sistema (sans-serif)
- **Tamaños**: text-sm, text-base, text-lg, text-xl, text-2xl, text-4xl, text-5xl

### Espaciado
- **Sistema**: Múltiplos de 4px (1, 2, 3, 4, 6, 8, 12, 16, 20, 24...)
- **Contenedores**: max-w-[2000px] para contenido principal

## 🧩 Componentes Principales

### App.tsx
Componente raíz que maneja:
- Routing client-side
- Estado global de la aplicación
- Datos mock de productos
- Layout principal

### AuthModal.tsx
Modal de autenticación que incluye:
- Login con Google OAuth
- Login con Microsoft
- Login con Apple
- Login con Facebook
- Login con Twitter/X

### LanguageSelector.tsx
Selector de idioma con:
- 6 idiomas soportados
- Flags de países
- Dropdown interactivo

## 🌐 Internacionalización (i18n)

### Configuración
```typescript
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Configuración automática de detección de idioma
// Fallback a español
// Interpolación habilitada
```

### Idiomas Soportados
- **es**: Español (por defecto)
- **en**: English
- **de**: Deutsch
- **fr**: Français
- **it**: Italiano
- **pt**: Português

### Uso de Traducciones
```typescript
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <h1>{t('nav.explore')}</h1>;
}
```

## 📱 Responsive Design

### Breakpoints (Tailwind)
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### Grid System
```css
/* Productos */
grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4

/* Footer */
grid-cols-2 md:grid-cols-3 lg:grid-cols-6
```

## 🔄 Estado de la Aplicación

### Estado Local (useState)
- `searchQuery`: Término de búsqueda
- `isAuthModalOpen`: Estado del modal de auth
- `currentPage`: Página actual (routing)

### Datos Mock
```typescript
interface Product {
  id: string;
  title: string;
  image: string;
  location: string;
  price?: number;
}

interface Categories {
  free: CategorySection;
  secondHand: CategorySection;
  new: CategorySection;
}
```

## 🖼️ Gestión de Imágenes

### Fuentes de Imágenes
- **Unsplash**: Para imágenes de productos y contenido
- **Favicons**: Para iconos de redes sociales
- **Lucide React**: Para iconografía de UI

### Optimización
- Lazy loading automático del navegador
- Aspect ratio fijo para productos
- Responsive images con object-cover

## 🔐 Autenticación

### Proveedores OAuth
1. **Google**: @react-oauth/google
2. **Microsoft**: Redirect a Microsoft OAuth
3. **Apple**: Redirect a Apple ID
4. **Facebook**: react-facebook
5. **Twitter**: Redirect a Twitter OAuth

### Flujo de Autenticación
1. Usuario hace clic en "Crear Cuenta"
2. Se abre AuthModal
3. Usuario selecciona proveedor
4. Redirect o popup según proveedor
5. Callback maneja respuesta
6. Modal se cierra automáticamente

## 🚀 Optimizaciones de Performance

### Vite Optimizations
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'], // Evita pre-bundling
  },
});
```

### Code Splitting
- Páginas como componentes separados
- Lazy loading potencial para rutas
- Tree shaking automático

### Bundle Analysis
```bash
npm run build
npx vite-bundle-analyzer dist
```

## 🧪 Testing (Futuro)

### Setup Recomendado
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

### Estructura de Tests
```
src/
├── components/
│   ├── __tests__/
│   │   ├── AuthModal.test.tsx
│   │   └── LanguageSelector.test.tsx
└── pages/
    └── __tests__/
        └── App.test.tsx
```

## 🔧 Configuración de Desarrollo

### ESLint
```javascript
// eslint.config.js
export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    // ... configuración específica
  }
);
```

### TypeScript
```json
// tsconfig.app.json
{
  "compilerOptions": {
    "target": "ES2020",
    "jsx": "react-jsx",
    "strict": true,
    // ... configuración específica
  }
}
```

## 📦 Build y Despliegue

### Build de Producción
```bash
npm run build
# Genera carpeta dist/ con assets optimizados
```

### Assets Generados
- HTML minificado
- CSS con Tailwind purged
- JavaScript con tree shaking
- Assets con hash para cache busting

### Variables de Entorno
```env
VITE_GOOGLE_CLIENT_ID=
VITE_MICROSOFT_CLIENT_ID=
VITE_APPLE_CLIENT_ID=
VITE_FACEBOOK_APP_ID=
VITE_TWITTER_CLIENT_ID=
```

## 🐛 Debugging

### React DevTools
- Instalar extensión del navegador
- Inspeccionar componentes y estado
- Profiler para performance

### Vite DevTools
- Hot Module Replacement (HMR)
- Source maps habilitados
- Error overlay en desarrollo

### Console Logging
```typescript
// Solo en desarrollo
if (import.meta.env.DEV) {
  console.log('Debug info:', data);
}
```