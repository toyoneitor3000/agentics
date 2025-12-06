# Estrategia Técnica: Pigmento Stickers

## 1. Visión General
Desarrollo de e-commerce y showcase para 'Pigmento Stickers' (pigmentostckrs.com).

## 2. Estado del Proyecto
- **Directorio**: `./pigmentostkts-web`
- **Estado Actual**: 🚧 En Desarrollo (Funcionalidad Core Implementada)

## 3. Funcionalidades Implementadas
- ✅ **Landing Page**: Grid de productos destacados.
- ✅ **Página de Producto**: Ruta dinámica `/stickers/[id]` con detalles y características.
- ✅ **Carrito de Compras**: 
  - Estado global con Context API.
  - Persistencia en LocalStorage.
  - Sidebar animado para gestión del carrito.
- ✅ **Arquitectura UI**: Componentes globales (Navbar, Footer, CartSidebar) en `layout.tsx`.

## 4. Stack Tecnológico
- **Frontend**: Next.js 14+ (App Router) con TypeScript.
- **Estilos**: Tailwind CSS + Shadcn/UI pattern.
- **Estado**: React Context.

## 5. Próximos Pasos (Roadmap)
1.  **Checkout**: Implementar página de pago (integración con Stripe/MercadoPago).
2.  **CMS**: Conectar con una base de datos real (Supabase/Postgres) en lugar de `data.ts`.
3.  **SEO**: Optimizar metadatos para cada producto dinámicamente.

## 6. Cómo Probar
```bash
cd pigmentostkts-web
npm run dev
```
Visita `http://localhost:3000` para ver el flujo completo de compra (sin pago real).
