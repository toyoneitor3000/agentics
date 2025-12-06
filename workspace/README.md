# 🗂️ Workspace de Purrpur Agent

Este directorio contiene todos los archivos generados por los agentes de forma organizada.

## 📁 Estructura

```
workspace/
├── projects/       # Proyectos completos generados (web apps, landing pages, etc.)
├── assets/         # Assets multimedia (imágenes, videos, audio)
├── exports/        # Archivos exportados (PDFs, reportes, documentos)
└── temp/           # Archivos temporales (se limpian automáticamente)
```

---

## 📂 **projects/** - Proyectos Completos

Aquí se guardan todos los proyectos de código generados:

### Estructura típica:
```
projects/
├── financars/              # Proyecto de ejemplo
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── mi-landing-page/
│   └── ...
```

### Tipos de proyectos:
- ✅ Web apps (Next.js, React)
- ✅ Landing pages
- ✅ Mobile apps (React Native)
- ✅ Backend APIs (NestJS, Express)

---

## 🎨 **assets/** - Assets Multimedia

Todos los archivos multimedia generados por los agentes:

### Estructura:
```
assets/
├── images/                 # Imágenes generadas (Imagen 3)
│   ├── product-hero.png
│   ├── logo-variants/
│   └── social-media/
│
├── videos/                 # Videos generados (Veo)
│   ├── promo-video.mp4
│   └── animations/
│
├── audio/                  # Audio generado (TTS)
│   ├── voiceovers/
│   └── podcasts/
│
└── design/                 # Design tokens y sistemas
    ├── tokens.ts
    └── brand-guidelines.pdf
```

### Formatos soportados:
- **Imágenes:** PNG, SVG, JPG
- **Videos:** MP4, WebM
- **Audio:** MP3, WAV

---

## 📄 **exports/** - Documentos y Reportes

Archivos exportados y documentación generada:

```
exports/
├── reports/                # Reportes de analytics
├── documentation/          # Documentación técnica
├── presentations/          # Presentaciones
└── briefs/                 # Briefs de marketing
```

---

## 🗑️ **temp/** - Archivos Temporales

Archivos temporales que se limpian automáticamente:

- Archivos de compilación intermedios
- Caches temporales
- Archivos de prueba

**Nota:** Esta carpeta se limpia automáticamente cada 24 horas.

---

## 🔒 Reglas de Organización

### ✅ Hacer:
1. **Siempre usar rutas relativas** desde `workspace/`
2. **Nombrar proyectos con kebab-case** (ej: `mi-proyecto`)
3. **Agrupar assets por tipo** (images/, videos/, audio/)
4. **Documentar cada proyecto** con README.md

### ⛔ No hacer:
1. **No crear archivos en la raíz** de purrpurragent/
2. **No mezclar tipos de archivos** (código con assets)
3. **No usar espacios en nombres** de archivos/carpetas
4. **No dejar archivos temporales** sin limpiar

---

## 🛠️ Configuración de Tools

Todos los tools están configurados para usar este workspace:

### `scaffold_tools.py`
```python
PROJECT_ROOT = "./workspace/projects/"
```

### `image_generation_tools.py`
```python
ASSETS_ROOT = "./workspace/assets/images/"
```

### `video_generation_tools.py`
```python
ASSETS_ROOT = "./workspace/assets/videos/"
```

### `audio_generation_tools.py`
```python
ASSETS_ROOT = "./workspace/assets/audio/"
```

---

## 📊 Limpieza Automática

El workspace se mantiene limpio automáticamente:

- **temp/**: Se limpia cada 24 horas
- **projects/**: Se archivan proyectos inactivos después de 30 días
- **assets/**: Se optimizan imágenes/videos automáticamente

---

## 🚀 Uso

### Crear un nuevo proyecto:
```bash
# Los agentes crearán automáticamente en workspace/projects/
"Construye FinanCars"
# → workspace/projects/financars/
```

### Generar assets:
```bash
# Los agentes guardarán en workspace/assets/
"Genera una imagen de un gato"
# → workspace/assets/images/gato.png
```

### Exportar documentación:
```bash
# Los agentes exportarán a workspace/exports/
"Crea un reporte de SEO"
# → workspace/exports/reports/seo-report.pdf
```

---

**Última actualización:** 2025-11-22  
**Versión:** 2.0.0
