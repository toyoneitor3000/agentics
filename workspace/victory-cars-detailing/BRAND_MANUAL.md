# Manual de Identidad Visual - Victory Cars S.A.S.

> **Versión:** 2.0 (Sistema "Victory Midnight")  
> **Última Actualización:** 2025

Este documento establece los lineamientos visuales y de comunicación para la presencia digital de Victory Cars S.A.S. Su cumplimiento es obligatorio para mantener la consistencia de la marca premium.

---

## 1. El Logotipo

El activo principal de la marca es el logotipo. 

- **Ubicación del Archivo Maestro:** `/public/logo.png`
- **Uso:** Debe utilizarse siempre sobre fondos oscuros (`bg-brand-dark-blue` o negro). 
- **Restricciones:** 
  - No deformar.
  - No cambiar el color (debe mantenerse blanco/cyan/plateado según el original).
  - No usar sombras paralelas que ensucien la legibilidad.

---

## 2. Paleta de Color: "Victory Midnight"

La marca abandona los dorados antiguos para adoptar una estética "Tech/Night" que evoca profundidad, limpieza y tecnología.

### Colores Primarios
| Nombre | Token Tailwind | Hex | Uso |
| :--- | :--- | :--- | :--- |
| **Deep Night** | `bg-brand-dark-blue` | `#020617` | Fondo principal. Evoca exclusividad y profundidad. |
| **Electric Cyan** | `text-brand-cyan` | `#06b6d4` | Color de acento principal. Botones, enlaces, brillos, palabra "Detailing". |
| **Victory White** | `text-white` | `#ffffff` | Títulos y textos de alto contraste. |

### Colores Secundarios
| Nombre | Token Tailwind | Hex | Uso |
| :--- | :--- | :--- | :--- |
| **Carbon Slate** | `bg-brand-mid-blue` | `#0f172a` | Tarjetas, secciones secundarias, modales. |
| **Tech Grey** | `text-brand-slate` | `#94a3b8` | Textos de párrafo, descripciones, metadatos. |

---

## 3. Tipografía

La tipografía combina deportividad futurista con legibilidad técnica.

### Títulos y Encabezados
- **Familia:** `Orbitron`
- **Variable:** `--font-orbitron`
- **Uso:** `h1`, `h2`, `h3`, Botones, KPIs.
- **Carácter:** Fuerte, ancho, tecnológico, mayúsculas sostenidas en H1/H2.

### Cuerpo de Texto
- **Familia:** `Inter`
- **Variable:** `--font-inter`
- **Uso:** Párrafos, listas, formularios.
- **Carácter:** Limpio, legible, neutral.

### Acentos
- **Familia:** `Style Script`
- **Variable:** `--font-style-script`
- **Uso:** Exclusivamente para detalles caligráficos o firmas.

---

## 4. Elementos de Interfaz (UI Tokens)

### Botones (Primary)
- Fondo: `bg-brand-cyan`
- Texto: `text-brand-dark-blue` (Negro profundo para contraste)
- Hover: `hover:bg-white` + `shadow-glow`
- Forma: `rounded-full` (Píldora)

### Tarjetas (Glassmorphism)
- Fondo: `bg-brand-mid-blue` con ligera transparencia.
- Borde: `border-white/5` (Sutil).
- Hover: Borde se ilumina a `border-brand-cyan/50`.

### Fotografía
- Las imágenes de vehículos deben tener alto contraste.
- Preferiblemente tomadas en entornos oscuros con iluminación artificial (luces de estudio) para resaltar el brillo de la pintura.
