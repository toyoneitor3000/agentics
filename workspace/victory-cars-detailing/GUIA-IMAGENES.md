# 📸 GUÍA DE IMÁGENES - VICTORY CARS S.A.S.

## 🎨 IMPORTANTE: Branding y Estética

**VICTORY CARS** es el nombre del detailing y las características visuales son:
- ✅ **Nombre:** VICTORY CARS (usar en todas las fotos)
- ✅ **Paredes del taller:** NEGRAS
- ✅ **Iluminación:** LED profesional (reflectores pequeños a 90 grados)
- ✅ **Merchandising:** "VC Detailing" visible en uniformes/herramientas
- ✅ **Estética:** Moderna, premium, minimalista

## 📁 ESTRUCTURA COMPLETA DE IMÁGENES DEL SITIO

### 1. 🖼️ **CARRUSEL HERO (Sección Principal - "ARTESANOS DE LA PERFECCIÓN")**
**Ubicación:** `public/carrusel/`
**Propósito:** Imágenes de fondo del carrusel hero (sección principal arriba del fold)
**Especificaciones:**
- Formato: WebP (optimizado)
- Tamaño: < 500 KB cada una
- Dimensiones: Mínimo 1920x1080px (16:9)
- Cantidad: 7 imágenes actuales

**Imágenes actuales:**
1. `IMG_0547.webp`
2. `IMG_0556.webp`
3. `IMG_5419.webp`
4. `IMG_0561 2.webp` (nota: espacio en el nombre)
5. `IMG_0583.webp`
6. `IMG_5440.webp`
7. `IMG_0584 2.webp` (nota: espacio en el nombre)

### 2. 🛠️ **SERVICIOS (Sección "Nuestros Servicios")**
**Ubicación:** `public/services/`
**Propósito:** Iconos/thumbnails para cada servicio ofrecido
**Especificaciones:**
- Formato: JPG o WebP
- Tamaño: < 300 KB
- Dimensiones: 800x600px (4:3)

**Imágenes actuales:**
- ✅ `aqua-wash.jpg` - Lavado Premium
- ✅ `basic-wash.jpg` - Lavado Normal
- ✅ `ceramic-coating.jpg` - Protección Cerámica
- ✅ `detailing-pro-finish.jpg` - Detailing Profesional
- ✅ `glass-polish.jpg` - Brillado de Vidrios
- ✅ `ppf.jpg` - PPF Protection
- ✅ `style-wrap.jpg` - Personalización Style Wrap
- ✅ `sun-guard.jpg` - Polarizado SUN GUARD
- ✅ `upholstery.jpg` - Tapicería
- ✅ `wheel-wash.jpg` - Lavado Llanta a Llanta

### 3. 🖼️ **GALERÍA BEFORE/AFTER (3 COMPARATIVAS ESPECÍFICAS)**
**Ubicación:** `public/gallery/`
**Propósito:** Comparativas antes/después para demostrar resultados
**Especificaciones:**
- Formato: JPG
- Tamaño: < 400 KB
- Dimensiones: 1200x800px (3:2)
- **IMPORTANTE:** Para el efecto mágico del slider, las imágenes BEFORE y AFTER deben tener EXACTAMENTE el mismo ángulo, iluminación y composición.

#### **COMPARATIVA 1: MICRO-RAYONES (SWIRL MARKS)**
**Nombres de archivo:**
- `swirl-marks-before.jpg` - Antes: Micro-rayones visibles bajo luz rasante
- `swirl-marks-after.jpg` - Después: Pintura perfectamente corregida

**Especificaciones:**
- Vehículo: Mercedes-Benz GLE 2023 Gris Iridium
- Ubicación: Puerta del conductor, panel lateral
- Ángulo: Plano medio-corto
- Iluminación: 2 reflectores LED pequeños a 90 grados

#### **COMPARATIVA 2: INTERIOR**
**Nombres de archivo:**
- `interior-before.jpg` - Antes: Interior sucio y desgastado
- `interior-after.jpg` - Después: Interior perfectamente detallado

**Especificaciones:**
- Vehículo: BMW X7 2024 Negro Carbon
- Ubicación: Interior completo (asientos, consola, volante)
- Ángulo: Plano general desde asiento trasero
- Iluminación: Luz natural + reflector LED a 45 grados

#### **COMPARATIVA 3: PINTURA**
**Nombres de archivo:**
- `paint-before.jpg` - Antes: Pintura desgastada con defectos (ya existe)
- `paint-after.jpg` - Después: Pintura restaurada a perfección (ya existe)

**Especificaciones:**
- Vehículo: Porsche 911 Carrera 4S 2023 Rojo Carmine
- Ubicación: Capó completo y guardafango derecho
- Ángulo: Plano americano 3/4 frontal
- Iluminación: 3 reflectores LED (principal, fill, hair light)

### 4. 🏢 **IMÁGENES GENERALES DEL SITIO**
**Ubicación:** `public/`
**Propósito:** Imágenes de uso general en toda la página

**Imágenes actuales:**
- ✅ `about-us.jpg` - Imagen para sección "Sobre Nosotros"
- ✅ `hero-bg.jpg` - Imagen de fondo alternativa
- ✅ `logo.png` - Logo principal de VICTORY CARS (512x512px, PNG transparente)

### 5. 📱 **IMÁGENES RESPONSIVE Y OPTIMIZACIÓN**

**Configuración Next.js (next.config.mjs):**
- Formatos soportados: WebP, AVIF
- Device Sizes: 640, 750, 828, 1080, 1200, 1920, 2048, 3840px
- Image Sizes: 16, 32, 48, 64, 96, 128, 256, 384px
- Cache: 30 días

## 📋 **CHECKLIST DE IMPLEMENTACIÓN**

### ✅ COMPLETADO:
- [x] Estructura de carpetas creada
- [x] Placeholders para servicios generados
- [x] Configuración Next.js optimizada
- [x] Carrusel hero con 7 imágenes
- [x] Logo profesional en PNG transparente

### 🔄 EN PROCESO:
- [ ] Tomar fotos reales del taller VICTORY CARS
- [ ] Convertir formatos a WebP donde sea posible

### ✅ **ARCHIVOS CREADOS Y OPTIMIZADOS:**

**En carpeta `public/gallery/`:**
1. ✅ `swirl-marks-before.jpg` - Micro-rayones visibles (73KB, calidad 95%)
2. ✅ `swirl-marks-after.jpg` - Pintura corregida (58KB, calidad 95%)
3. ✅ `interior-before.jpg` - Interior sucio (197KB, calidad 95%)
4. ✅ `interior-after.jpg` - Interior detallado (171KB, calidad 95%)
5. ✅ `paint-before.jpg` - Pintura desgastada (222KB, calidad 95%)
6. ✅ `paint-after.jpg` - Pintura restaurada (78KB, calidad 95%)

**Todas las imágenes están optimizadas con calidad 95% y tamaño menor a 400KB.**

## 🔗 **REFERENCIAS DE ARCHIVOS EN CÓDIGO**

### Componentes que usan imágenes:

1. **HeroSection.tsx** → `public/carrusel/*.webp`
2. **ServicesSection.tsx** → `public/services/*.jpg`
3. **BeforeAfterGallery.tsx** → `public/gallery/*.jpg`
4. **ContactSection.tsx** → `public/logo.png`
5. **layout.tsx** → `public/logo.png`
6. **ServiceCard.tsx** → `public/services/*.jpg`

### Rutas absolutas vs relativas:
- Rutas absolutas: `'/carrusel/IMG_0547.webp'`
- Rutas relativas: `'/services/aqua-wash.jpg'`

---

**Última actualización:** 4 de Diciembre, 2025  
**Responsable:** Equipo de Marketing VICTORY CARS  
**Estado:** Fase de implementación - 70% completado

> **Nota:** Este documento debe actualizarse cada vez que se agreguen nuevas imágenes o se modifique la estructura del sitio.
