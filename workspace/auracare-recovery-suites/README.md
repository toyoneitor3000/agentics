# Beauty & Comfort Recovery House - MVP Landing Page

![Beauty & Comfort](https://img.shields.io/badge/Status-MVP-success)
![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38bdf8)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 📋 Descripción

Landing page MVP para **Beauty & Comfort Recovery House**, una casa de recuperación post-operatoria de lujo en Bogotá, Colombia. Este proyecto fue diseñado para presentar una propuesta profesional que refleje los valores de la marca: cuidado profesional, comodidad y acompañamiento integral.

## 🎨 Identidad de Marca

### Colores
- **Púrpura** (#8B5CF6) - Color principal
- **Turquesa/Teal** (#14B8A6) - Color secundario
- **Dorado** (#F59E0B) - Acentos
- **Blanco** (#FFFFFF) - Base

### Tipografía
- **Display:** Playfair Display (títulos)
- **Body:** Inter (texto)

### Valores
- 🩺 Cuidados profesionales
- 🏕️ Hospedaje de calidad
- 🍽️ Alimentación especializada
- 🤝 Acompañamiento integral

## 🚀 Características

### Secciones Implementadas
1. **Hero Section** - Presentación impactante con animaciones
2. **Servicios** - 4 servicios principales con iconos
3. **Por Qué Elegirnos** - Beneficios y diferenciadores
4. **Cómo Funciona** - Proceso en 4 pasos
5. **Testimonios** - Reseñas de pacientes
6. **CTA/Contacto** - Llamado a la acción con WhatsApp e Instagram
7. **Footer** - Información de contacto y redes sociales

### Características Técnicas
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Animaciones suaves y profesionales
- ✅ Sistema de diseño completo con CSS variables
- ✅ SEO optimizado con metadata
- ✅ Accesibilidad (ARIA labels, focus states)
- ✅ Performance optimizado
- ✅ Gradientes y glassmorphism
- ✅ Componentes reutilizables

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 14.2.3 (App Router)
- **Lenguaje:** TypeScript 5
- **Estilos:** TailwindCSS 3.4.1 + CSS Custom Properties
- **Fuentes:** Google Fonts (Playfair Display, Inter)
- **Iconos:** Heroicons (SVG)

## 📦 Instalación

```bash
# Clonar el repositorio
git clone [repository-url]

# Navegar al directorio
cd auracare-recovery-suites

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Abrir en el navegador
# http://localhost:3000
```

## 🏗️ Estructura del Proyecto

```
auracare-recovery-suites/
├── app/
│   ├── globals.css          # Sistema de diseño completo
│   ├── layout.tsx            # Layout principal con metadata
│   └── page.tsx              # Landing page MVP
├── docs/
│   ├── auracare_brand_documentation.md
│   └── beauty_comfort_brand_analysis.md
├── public/                   # Assets estáticos (agregar imágenes aquí)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🎯 Próximos Pasos

### Fase 1: Contenido Real
- [ ] Agregar logo real de Beauty & Comfort
- [ ] Fotografías profesionales de las instalaciones
- [ ] Imágenes de habitaciones y áreas comunes
- [ ] Fotos de comidas y servicios
- [ ] Testimonios reales con fotos de pacientes (con permiso)

### Fase 2: Funcionalidades
- [ ] Formulario de contacto funcional
- [ ] Integración con WhatsApp Business API
- [ ] Sistema de reservas online
- [ ] Galería de fotos interactiva
- [ ] Blog/noticias
- [ ] Versión en inglés (i18n)

### Fase 3: Optimización
- [ ] Optimización de imágenes (Next.js Image)
- [ ] Analytics (Google Analytics / Meta Pixel)
- [ ] Chat en vivo
- [ ] Sistema de reseñas
- [ ] Integración con redes sociales

### Fase 4: Marketing
- [ ] Landing pages específicas por servicio
- [ ] Páginas de aterrizaje para ads
- [ ] Contenido SEO optimizado
- [ ] Schema markup para rich snippets

## 📱 Redes Sociales

- **Instagram:** [@beautyandcomfortbogota](https://instagram.com/beautyandcomfortbogota)
- **TikTok:** [@beautyandcomfortco](https://tiktok.com/@beautyandcomfortco)
- **Ubicación:** Bogotá, Colombia

## 🎨 Sistema de Diseño

### Componentes Disponibles

```css
/* Botones */
.btn-primary      /* Púrpura con gradiente */
.btn-secondary    /* Teal con gradiente */
.btn-outline      /* Borde púrpura */
.btn-gold         /* Dorado con gradiente */

/* Cards */
.card             /* Card básico con sombra */
.card-gradient    /* Card con fondo gradiente sutil */

/* Animaciones */
.animate-fade-in
.animate-fade-in-up
.animate-slide-in-left
.animate-slide-in-right
.animate-scale-in
.animate-float

/* Utilidades */
.text-gradient-purple
.text-gradient-teal
.text-gradient-sunset
.glass            /* Glassmorphism claro */
.glass-dark       /* Glassmorphism oscuro */
.divider          /* Línea decorativa */
.bg-pattern       /* Patrón de fondo sutil */
```

## 🔧 Configuración

### Variables CSS Principales

```css
--primary-purple: #8B5CF6
--secondary-teal: #14B8A6
--accent-gold: #F59E0B
--gradient-purple: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)
--gradient-teal: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)
--gradient-sunset: linear-gradient(135deg, #8B5CF6 0%, #14B8A6 100%)
```

## 📄 Licencia

Este proyecto fue creado como propuesta para Beauty & Comfort Recovery House.

## 👥 Contacto

Para consultas sobre este proyecto:
- **Email:** info@beautyandcomfort.com
- **WhatsApp:** [Agregar número]
- **Instagram:** @beautyandcomfortbogota

---

**Desarrollado con ❤️ para Beauty & Comfort Recovery House**
