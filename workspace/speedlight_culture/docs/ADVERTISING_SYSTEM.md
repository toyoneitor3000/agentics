# Speedlight Native Advertising System

## Filosofía: "Publicidad que aporta valor"
En Speedlight Culture, la publicidad no es un impuesto visual que el usuario paga por consumir contenido gratuito. Es contenido curado que enriquece la experiencia. 

Para los usuarios gratuitos, estos elementos se presentan como recomendaciones patrocinadas. Para los usuarios Premium que pagan para "no ver anuncios", estos elementos no desaparecen, sino que pierden su etiqueta de patrocinio explícito y se convierten en "Recomendaciones de Expertos", manteniendo la estética pero eliminando el ruido comercial.

---

## Catálogo de Componentes Nativos

### 1. Hero Sponsor ("The Powered By Badge")
*   **Concepto:** Branding de alto nivel similar a los patrocinios de F1. Asocia una marca con la identidad del sitio sin interrumpir la navegación.
*   **Ubicación:** 
    *   `Navbar`: Esquina superior derecha o junto al CTA de "Acceder".
    *   `Home Hero`: Sobrepuesto sutilmente en la imagen principal.
*   **Comportamiento:** Estático, glassmorphism. Solo logo monocromático.

### 2. Native Feed Card ("Spotlight Product")
*   **Concepto:** Un producto patrocinado que vive dentro del grid de contenido orgánico. Se ve idéntico a un producto normal pero tiene prioridad visual o una etiqueta discreta.
*   **Ubicación:** 
    *   `Marketplace`: Insertado cada 8 productos orgánicos.
    *   `Galería`: Como una "Foto Destacada" que lleva a la marca del fotógrafo o equipo.
*   **Comportamiento:** Hover effects iguales al resto. Etiqueta "Partner Spotlight" en dorado/naranja.

### 3. Sidebar Tech Spec ("Educational Ad")
*   **Concepto:** En lugar de un banner gráfico genérico, mostramos una ficha técnica útil relacionada con el contexto.
*   **Ubicación:** 
    *   `Foro`: En la barra lateral de hilos de discusión técnica.
    *   `Artículos`: Al lado del contenido de lectura.
*   **Comportamiento:** Parece un widget de información. Muestra stats (ej: Grip Rating de una llanta).

### 4. Workshop Trust Badge ("Verified Partner")
*   **Concepto:** Distintivo de confianza para negocios físicos.
*   **Ubicación:** 
    *   `Talleres (Mapa)`: Pines dorados en el mapa.
    *   `Directorio`: Tarjetas con borde dorado y sello "Verified".
*   **Comportamiento:** Prioridad en búsquedas. Genera confianza inmediata en el usuario.

### 5. Academy Cinematic Intro ("The Sponsor")
*   **Concepto:** Pre-roll de alta calidad tipo "Cine" o "Netflix Originals".
*   **Ubicación:** 
    *   `Speedlight Academy`: Antes de iniciar un curso o módulo gratuito.
*   **Comportamiento:** Video corto o estática de alto impacto visual. Botón de "Saltar" discreto.

---

## Reglas de Implementación

1.  **Detección de Contexto:**
    La publicidad debe ser relevante.
    *   Si el usuario está en el Foro de "Mecánica", el *Sidebar Spec* debe mostrar aceites o herramientas, no cámaras.
    
2.  **Frecuencia (Frequency Capping):**
    *   *Feed Card:* Máximo 1 cada 8 items.
    *   *Academy Intro:* Máximo 1 por sesión de estudio o cada 3 videos.

3.  **Estética Innegociable:**
    *   Prohibido usar banners estándar de Google Adsense (Iframe).
    *   Todos los assets deben pasar por un filtro de diseño (monocromáticos, alto contraste, sin fondos blancos planos).
