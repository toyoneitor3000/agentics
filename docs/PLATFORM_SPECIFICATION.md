# Speedlight Culture Platform - Especificación Técnica

## Visión General
Speedlight Culture es una plataforma virtual web dedicada a la cultura automotriz, con enfoque en Colombia para el mundo. Combina marketplace, foro, galería de alta resolución, mapa de talleres, sistema de roles, agentes de IA, integración de video (tipo YouTube), y dashboards detallados.

## Características Principales

### 1. Autenticación y Usuarios
- Autenticación nativa (email/contraseña)
- Autenticación con Google (Gmail)
- Perfiles de usuario personalizables
- Sistema de roles: Gratuito, Creador, Empresa, Administrador

### 2. Marketplace
- Listado de productos/servicios automotrices
- Sistema de compras/ventas integrado
- Reseñas y calificaciones
- Categorías: Partes, Accesorios, Servicios, Merchandising

### 3. Foro Comunitario
- Categorías temáticas (tuning, carreras, restauración, etc.)
- Hilos de discusión
- Sistema de votos y reputación
- Moderación comunitaria

### 4. Galería de Alta Resolución
- Plataforma para fotógrafos automotrices
- Resolución 4K+ con zoom detallado
- Categorías por tipo de vehículo, evento, ubicación
- Sistema de derechos digitales
- Integración con cámaras profesionales

### 5. Mapa de Talleres
- Mapa interactivo con talleres de personalización
- Filtros por especialidad, ubicación, calificación
- Sistema de reservas/citas
- Perfiles de talleres con portafolio

### 6. Sistema de Video (YouTube-like)
- Subida y streaming de video
- Categorías: Reviews, Tutoriales, Eventos, Carreras
- Sistema de comentarios y likes
- Monetización para creadores
- Live streaming para eventos

### 7. Sistema de Agentes de IA
- Asistentes virtuales para recomendaciones
- Análisis de tendencias del mercado
- Asistente para compras inteligentes
- Moderación automática de contenido
- Generación de contenido personalizado

### 8. Dashboards
- **Dashboard de Usuario**: Actividad, estadísticas, contenido guardado
- **Dashboard de Creador**: Métricas de contenido, ingresos, audiencia
- **Dashboard de Empresa**: Analytics de publicidad, engagement, ROI
- **Dashboard de Administrador**: Moderación, analytics global, gestión de usuarios

### 9. Sistema de Publicidad y Monetización
- Modelo Freemium:
  - **Gratuito**: Contenido con publicidad de empresas patrocinadoras
  - **Suscripción Premium**: Sin publicidad, contenido orgánico, features exclusivas
- Sistema de publicidad para empresas
- Programas de afiliados
- Sponsorships y partnerships

### 10. Chat en Tiempo Real
- Chat privado entre usuarios
- Grupos temáticos
- Integración de multimedia
- Notificaciones push

### 11. Panel de Configuración
- Personalización de perfil
- Preferencias de notificaciones
- Configuración de privacidad
- Gestión de suscripción

### 12. Calendario de Eventos Global
- **Vista Unificada**: Calendario interactivo (mensual/agenda) que consolida actividades.
- **Tipos de Eventos**:
    - *Speedlight Culture*: Car Meets, Rodadas, Track Days, Exposiciones.
    - *Speedlight Academy*: Talleres presenciales, Webinars, Fechas límite de concursos.
- **Funcionalidades**:
    - RSVP / Registro de asistencia (Gratis o Pago).
    - Integración con calendarios personales (Google/Apple).
    - Geolocalización de eventos.
    - Filtros por Ciudad/Tipo.


## Arquitectura Técnica

### Stack Tecnológico
- **Frontend**: Next.js 14 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth (nativo + OAuth)
- **Base de Datos**: PostgreSQL (Supabase)
- **Almacenamiento**: Supabase Storage (para imágenes/videos)
- **Real-time**: Supabase Realtime
- **IA**: Integración con APIs (OpenAI, Google AI)
- **Mapas**: Mapbox/Google Maps API
- **Video**: Cloudflare Stream o Vimeo API
- **Despliegue**: Vercel

### Estructura de Base de Datos (Esquema Principal)
- `users` (extensión de auth.users)
- `profiles` (información extendida de usuario)
- `products` (marketplace)
- `forum_posts`, `forum_comments`
- `gallery_images`, `gallery_albums`
- `workshops` (talleres)
- `videos`, `video_comments`
- `subscriptions` (planes de suscripción)
- `advertisements` (anuncios)
- `events` (calendario de eventos)
- `event_registrations` (asistentes y tickets)
- `chat_messages`, `chat_rooms`
- `ai_agents` (configuración de agentes)

### Diseño UI/UX
- **Filosofía**: Mobile-first, aplicación real
- **Paleta de Colores**: Del rojo al amarillo, pasando por tonos ocres
  - Rojo: #D32F2F (pasión, velocidad)
  - Naranja: #FF9800 (energía, creatividad)
  - Amarillo: #FFEB3B (optimismo, atención)
  - Ocre: #C17D11 (tradición, tierra)
  - Fondo oscuro: #1A1A1A (contraste, elegancia)
- **Tipografía**: Fuentes modernas pero legibles
- **Componentes**: Design system cohesivo con elementos automotrices

## Plan de Implementación por Fases

### Fase 1: Fundación (4-6 semanas)
1. Configurar proyecto Next.js con estructura completa
2. Implementar autenticación con Supabase
3. Diseñar sistema de diseño con paleta de colores
4. Crear landing page mejorada
5. Configurar base de datos básica

### Fase 2: Núcleo Comunitario (6-8 semanas)
1. Sistema de perfiles de usuario
2. Foro básico (posts, comentarios)
3. Galería simple de imágenes
4. Chat básico
5. Dashboard de usuario

### Fase 3: Marketplace y Video (8-10 semanas)
1. Sistema de marketplace (listados, búsqueda)
2. Plataforma de video (subida, reproducción)
3. Mapa de talleres básico
4. Sistema de suscripciones
5. Calendario de Eventos (MVP)

### Fase 4: Avanzado y Escalado (10-12 semanas)
1. Agentes de IA integrados
2. Dashboards avanzados (analytics)
3. Sistema de publicidad complejo
4. Optimización mobile (PWA)
5. Preparación para lanzamiento

## Modelo de Negocio

### Fuentes de Ingresos
1. **Suscripciones Premium**: $9.99/mes o $99/año
2. **Comisiones de Marketplace**: 5-10% por transacción
3. **Publicidad para Empresas**: Desde $500/mes
4. **Featured Listings**: $50-200/mes para talleres
5. **Programa de Afiliados**: Comisiones por referidos

### Estrategia de Marketing
- Contenido orgánico en redes sociales
- Colaboraciones con influencers automotrices
- Eventos presenciales y virtuales
- Programa de referidos
- SEO especializado en nicho automotriz

## Requisitos Técnicos Específicos

### Performance
- Tiempo de carga < 3s en móvil
- PWA con offline capabilities
- Optimización de imágenes/videos
- CDN global

### Seguridad
- HTTPS obligatorio
- Protección contra XSS, CSRF, SQL injection
- Validación de archivos subidos
- GDPR/CCPA compliance

### Escalabilidad
- Arquitectura serverless
- Auto-scaling de recursos
- Database indexing optimizado
- Caching estratégico

## Equipo y Recursos
- **Desarrolladores Full-stack**: 3-4
- **Diseñador UI/UX**: 1-2
- **Especialista en IA**: 1
- **Community Manager**: 1-2
- **Marketing Specialist**: 1

## Timeline Estimado
- **MVP**: 3-4 meses
- **Lanzamiento Público**: 6 meses
- **Escalado Internacional**: 12 meses

---

*Documento vivo - Última actualización: Diciembre 2025*
