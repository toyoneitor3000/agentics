# Speedlight Culture - Design System

## Filosofía de Diseño
Diseño mobile-first orientado a aplicación real, que combina la pasión de la cultura automotriz con una experiencia de usuario moderna y fluida. Inspirado en la estética automotriz oriental y colombiana.

## Paleta de Colores

### Colores Primarios (Del rojo al amarillo, tonos ocres)
```
Rojo Speedlight: #D32F2F
  - RGB: 211, 47, 47
  - Uso: Botones principales, acentos, alertas

Naranja Cultura: #FF9800
  - RGB: 255, 152, 0
  - Uso: Botones secundarios, highlights, badges

Amarillo Energía: #FFEB3B
  - RGB: 255, 235, 59
  - Uso: Acentos, estados activos, llamadas a la acción

Ocre Tradición: #C17D11
  - RGB: 193, 125, 17
  - Uso: Elementos de fondo, bordes, texto secundario
```

### Colores de Fondo
```
Fondo Oscuro Principal: #1A1A1A
  - RGB: 26, 26, 26
  - Uso: Fondo principal de la aplicación

Fondo Secundario: #2D2D2D
  - RGB: 45, 45, 45
  - Uso: Tarjetas, modales, secciones

Fondo Terciario: #3D3D3D
  - RGB: 61, 61, 61
  - Uso: Elementos hover, estados activos
```

### Colores de Texto
```
Texto Primario: #FFFFFF
  - RGB: 255, 255, 255
  - Uso: Texto principal sobre fondos oscuros

Texto Secundario: #B0B0B0
  - RGB: 176, 176, 176
  - Uso: Texto secundario, descripciones

Texto Terciario: #808080
  - RGB: 128, 128, 128
  - Uso: Texto deshabilitado, placeholders
```

### Colores de Estado
```
Éxito: #4CAF50
Error: #F44336
Advertencia: #FF9800
Información: #2196F3
```

## Tipografía

### Fuentes
- **Primaria**: Inter (sans-serif) - Moderna, legible en pantallas
- **Secundaria**: Roboto Mono (monospace) - Para código y datos técnicos
- **Display**: Oswald (para títulos y elementos de marca) - Estilo automotriz

### Escala de Tipografía
```
Display XL: 3.5rem (56px) - Títulos hero
Display L: 2.5rem (40px) - Títulos de página
Display M: 2rem (32px) - Títulos de sección
Heading L: 1.5rem (24px) - Subtítulos
Heading M: 1.25rem (20px) - Encabezados de tarjeta
Body L: 1rem (16px) - Texto cuerpo
Body M: 0.875rem (14px) - Texto secundario
Body S: 0.75rem (12px) - Texto pequeño, captions
```

## Espaciado y Layout

### Sistema de 8px
Todas las medidas de espaciado se basan en múltiplos de 8px:
```
xs: 4px (0.25rem)
sm: 8px (0.5rem)
md: 16px (1rem)
lg: 24px (1.5rem)
xl: 32px (2rem)
2xl: 48px (3rem)
3xl: 64px (4rem)
```

### Breakpoints (Mobile-first)
```
sm: 640px (móvil)
md: 768px (tablet)
lg: 1024px (desktop)
xl: 1280px (desktop grande)
2xl: 1536px (desktop extra grande)
```

## Componentes Base

### Botones
```css
/* Botón Primario */
.btn-primary {
  background: linear-gradient(135deg, #D32F2F 0%, #FF9800 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
}

/* Botón Secundario */
.btn-secondary {
  background: transparent;
  color: #FF9800;
  border: 2px solid #FF9800;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: rgba(255, 152, 0, 0.1);
}
```

### Tarjetas (Cards)
```css
.card {
  background: #2D2D2D;
  border-radius: 12px;
  border: 1px solid #3D3D3D;
  padding: 24px;
  transition: all 0.2s ease;
}

.card:hover {
  border-color: #FF9800;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
```

### Inputs
```css
.input {
  background: #2D2D2D;
  border: 1px solid #3D3D3D;
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  transition: all 0.2s ease;
}

.input:focus {
  border-color: #FF9800;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.1);
}
```

## Iconografía

### Temática Automotriz
- Íconos de herramientas, engranajes, llaves
- Siluetas de vehículos
- Elementos de carrera (banderas, trofeos)
- Símbolos de comunidad (personas, conversación)

### Tamaños de Íconos
```
xs: 16px
sm: 20px
md: 24px
lg: 32px
xl: 40px
```

## Animaciones y Transiciones

### Duraciones
```
rápida: 150ms
media: 300ms
lenta: 500ms
```

### Curvas de Easing
```
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
ease-out: cubic-bezier(0, 0, 0.2, 1)
ease-in: cubic-bezier(0.4, 0, 1, 1)
```

### Animaciones Específicas
```css
@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

## Layout Patterns

### Grid System
Sistema de 12 columnas con gutter de 24px:
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}
```

### Hero Section
Combinación de gradiente rojo-amarillo con contenido centrado:
```css
.hero-section {
  background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #D32F2F, #FF9800, #FFEB3B);
}
```

## Estados de Componentes

### Hover States
- Elevación ligera (translateY)
- Cambio de color de borde
- Sombra suave

### Active States
- Reducción de escala (scale: 0.98)
- Intensificación de color

### Disabled States
- Opacidad reducida (0.5)
- Cursor not-allowed
- Colores desaturados

## Accesibilidad

### Contraste
- Ratio mínimo de 4.5:1 para texto normal
- Ratio mínimo de 3:1 para texto grande
- Herramientas de alto contraste disponibles

### Navegación por Teclado
- Focus visible en todos los elementos interactivos
- Orden lógico de tabulación
- Atajos de teclado para acciones comunes

### Screen Readers
- Etiquetas ARIA apropiadas
- Texto alternativo para imágenes
- Anuncios de cambios dinámicos

## Implementación en Tailwind CSS

### Configuración de Colores
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'speedlight-red': '#D32F2F',
        'culture-orange': '#FF9800',
        'energy-yellow': '#FFEB3B',
        'tradition-ocher': '#C17D11',
        'dark-primary': '#1A1A1A',
        'dark-secondary': '#2D2D2D',
        'dark-tertiary': '#3D3D3D',
      }
    }
  }
}
```

### Clases de Utilidad Personalizadas
```css
/* En globals.css o archivo CSS principal */
@layer utilities {
  .gradient-speedlight {
    background: linear-gradient(135deg, #D32F2F 0%, #FF9800 100%);
  }
  
  .text-glow {
    text-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
  }
  
  .border-speedlight {
    border-image: linear-gradient(90deg, #D32F2F, #FF9800) 1;
  }
}
```

## Guías de Uso por Sección

### Landing Page
- Hero con gradiente y llamada a la acción prominente
- Secciones con bordes superiores de color
- Tarjetas con hover effects
- Animaciones sutiles al hacer scroll

### Dashboard
- Layout de grid responsivo
- Tarjetas de métricas con iconografía clara
- Gráficos con colores de la paleta
- Navegación lateral fija en desktop

### Marketplace
- Grid de productos con imágenes prominentes
- Filtros laterales colapsables en móvil
- Badges de estado con colores de la paleta
- Animaciones al agregar al carrito

### Galería
- Masonry grid para imágenes
- Lightbox con fondo oscuro
- Efectos de zoom suaves
- Overlay de información con gradiente

---

*Documento de referencia para el equipo de diseño y desarrollo*
*Última actualización: Diciembre 2025*
