# Protocolo de Diseño: Speedlight Culture
> **Estatus:** VIVO. Cualquier desviación de este documento es un ERROR.

## 1. Filosofía Visual: "Liquid Glass Retro-Futurism"
La identidad de Speedlight Culture NO ES minimalismo plano. Es profundidad, textura y luz.
*   **Concepto:** Imagina un tablero de instrumentos de un coche deportivo de los 80s pero hecho de cristal líquido flotando en el espacio.

## 2. Reglas de Oro (NO ROMPER)
1.  **NO COLOR SOLIDO:** Nunca usar fondos 100% opacos (`bg-black`, `bg-white`).
2.  **SIEMPRE GLASSMORPHISM:** Todo panel debe ser translúcido (`bg-black/40`), con desenfoque (`backdrop-blur-xl`) y bordes sutiles (`border-white/10`).
3.  **PALETA DE COLORES:**
    *   **Fondo Principal:** NO ES NEGRO. Es "Café Asfalto Profundo" o "Dark Roast".
        *   Hex aproximado para fondos oscuros: `#050505` (Casi negro) pero con tintes cálidos en degradados.
    *   **Acentos:**
        *   🟠 **Naranja Speedlight:** `#FF9800` (Energía, Acción).
        *   🔴 **Rojo RPM:** `#FF0000` (Alerta, Notificación, Peligro).
        *   🟡 **Amarillo Nitro:** Acentos de luz.
    *   **Texto:** Blanco (`text-white`) o Blanco Humo (`text-white/80`).

## 3. Componentes Específicos

### A. Botones y Paneles
*   **Estilo "Liquid Glass":** 
    *   Fondo: `bg-white/5` o `bg-black/20`.
    *   Borde: `border border-white/10`.
    *   Efecto: `backdrop-blur-md` o `backdrop-blur-xl`.
    *   Hover: Debe "iluminarse" desde adentro (`hover:bg-white/10` o `hover:border-[#FF9800]/50`).

### B. Notificaciones y Alertas
*   **Prohibido:** Toast planos de color sólido (como el banner de Instagram anterior).
*   **Requerido:** Paneles flotantes de cristal.
    *   Si es alerta crítica (In-App Browser), usar un cristal tintado de Naranja/Rojo pero manteniendo la translucidez.

## 4. Tipografía
*   **Títulos / Impacto:** `Font-Oswald`. Mayúsculas. Tracking amplio (`tracking-widest`).
*   **Cuerpo / Lectura:** `Sans-Serif` limpia (Inter/Roboto).
*   **Datos / Técnico:** `Monospace`.

---
*Este documento invalida cualquier decisión de diseño anterior que use "Solid Black" o "Solid White" en grandes superficies.*
