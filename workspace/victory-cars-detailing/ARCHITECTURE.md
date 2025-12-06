# Arquitectura del Proyecto - Victory Cars Web

## 1. Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilado:** Tailwind CSS
- **Iconografía:** Lucide React
- **Fuentes:** `next/font/google` (Orbitron, Inter, Style Script)

## 2. Estructura de Directorios

```
workspace/victory-cars-detailing/
├── app/                      # Lógica principal de Next.js
│   ├── components/           # Biblioteca de componentes UI
│   │   ├── HeroSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── InteractiveComparisonSlider.tsx  <-- Componente Clave
│   │   ├── ...
│   ├── globals.css           # Definiciones globales de Tailwind y CSS base
│   ├── layout.tsx            # Layout raíz (Fuentes, Header, Footer)
│   └── page.tsx              # Landing Page (Composición de secciones)
├── public/                   # Assets estáticos
│   ├── logo.png              # LOGO OFICIAL
│   ├── gallery/              # Imágenes de antes/después
│   └── services/             # Imágenes de servicios
├── tailwind.config.js        # Configuración del Sistema de Diseño (Tokens)
└── package.json              # Dependencias
```

## 3. Componentes Clave

### `InteractiveComparisonSlider.tsx`
Componente crítico para la conversión. Permite al usuario deslizar una barra vertical para comparar el estado "Antes" y "Después" de un vehículo. Utiliza eventos de puntero (mouse/touch) para modificar dinámicamente el ancho de un contenedor con `overflow: hidden`.

### `ServiceCard.tsx`
Componente reutilizable para mostrar servicios. Implementa efectos de hover (`group-hover`) para escalar la imagen de fondo y revelar el botón de cotización. Está diseñado para ser modular y aceptar props de `title`, `description`, `price`, etc.

## 4. Decisiones de Diseño Técnico

### Sistema de Diseño en Tailwind
No utilizamos valores arbitrarios (ej. `bg-[#123456]`) en los componentes. Todo está centralizado en `tailwind.config.js` bajo la clave `colors: { brand: { ... } }`. Esto permite cambiar el tema de todo el sitio modificando un solo archivo.

### Optimización de Fuentes
Las fuentes se cargan a través de `next/font` para evitar CLS (Cumulative Layout Shift) y mejorar el rendimiento de carga inicial.

### Estrategia de Imágenes
Se utiliza el componente `Image` de Next.js para optimización automática, carga diferida (lazy loading) y prevención de reflujos de diseño.
