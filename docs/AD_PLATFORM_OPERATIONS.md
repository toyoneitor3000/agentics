# MANUAL DE OPERACIONES PUBLICITARIAS: SPEEDLIGHT CULTURE
**Versión 2.0 - Operations Ready**

Este documento detalla el proceso técnico y operativo para gestionar publicidad en la plataforma.
**Objetivo:** Transición de "Demos Estáticos" a "Campaña Activa" para las empresas del grupo.

---

## 1. FLUJO DE TRABAJO (WORKFLOW)

### Paso 1: Recepción de Solicitud
La empresa (cliente) solicita un espacio publicitario. Se define el **Tipo de Anuncio** más adecuado para su producto (ver Catálogo).

### Paso 2: Recolección de Assets (El "Formulario")
Para cada campaña, es OBLIGATORIO completar la siguiente ficha de datos. Sin estos datos, el anuncio no se publica.

#### A. Campos Generales (Para todos)
| Campo | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `id` | Texto (Slug) | Identificador único interno | `brembo_navidad_2025` |
| `clientName` | Texto | Nombre legal del cliente | `Brembo S.p.A.` |
| `ctaLink` | URL | A dónde enviamos el tráfico | `https://brembo.com/store` |
| `active` | Booleano | Estado del anuncio | `true` |

#### B. Campos Específicos por Tipo de Anuncio

**1. Hero Sponsor (Badge Superior)**
*   `brandName`: Nombre corto de la marca (Máx 12 caracteres).
*   `badgeText`: Texto pequeño superior (Default: "Presented By").
*   **Asset Gráfico:** Logo en formato SVG o PNG transparente (Blanco puro).

**2. Feed Card (Tarjeta en Rejilla)**
*   `title`: Título del producto/oferta (Máx 25 caracteres).
*   `description`: Gancho de venta (Máx 90 caracteres).
*   `badgeText`: Etiqueta (Ej: "Partner", "Oferta").
*   `ctaText`: Texto del botón (Ej: "Ver Oferta").
*   **Asset Gráfico:** Imagen del producto. 
    *   *Formato:* JPG/WebP.
    *   *Ratio:* 4:3 o 1:1.
    *   *Estilo:* Fondo oscuro o silueta. Evitar fondos blancos planos.

**3. Sidebar Tech Spec (Ficha Técnica)**
*   `title`: Nombre del modelo (Ej: "PS4S").
*   `subtitle`: Categoría (Ej: "Michelin Pilot Sport").
*   `rating`: Puntuación (Ej: "9.8" o "A+").
*   `specs`: Lista de hasta 3 pares Clave/Valor (Ej: "Durability: 30k").
*   **Asset Gráfico:** No requiere imagen grande, solo iconos opcionales.

**4. Workshop Badge (Mapa/Directorio)**
*   `brandName`: Nombre del Taller.
*   `description`: Especialidad (Ej: "Detailing & PPF").
*   `rating`: Texto de calidad (Ej: "TOP RATED").
*   **Asset Gráfico:** Logo cuadrado pequeño (Avatar).

**5. Academy Intro (Video/Cinematic)**
*   `brandName`: Marca principal.
*   `subtitle`: Eslogan o categoría.
*   **Asset Gráfico:** Imagen de fondo de muy alta resolución (1920x1080).
    *   *Estilo:* Cinematográfico, oscuro, poca distracción.

---

## 2. INSTRUCCIONES TÉCNICAS (PARA DESARROLLO)

Cómo reemplazar un anuncio Demo por uno Real en el código:

1.  Abrir `app/data/ads.ts`.
2.  Localizar el array `activeCampaigns`.
3.  Duplicar un objeto existente o crear uno nuevo siguiendo la interfaz `AdCampaign`.
4.  Cambiar `isActive: true` y asegurarse de que el `type` coincida con el espacio deseado.

*Nota: Actualmente el sistema muestra el primer anuncio activo que encuentra para cada tipo. En el futuro implementaremos rotación ponderada.*

---

## 3. ESPECIFICACIONES DE DISEÑO (IMÁGENES)

Para garantizar la estética "Premium Black/Orange":

*   **Paleta:** Negro (`#000000`, `#0A0604`), Gris Oscuro (`#111111`), Naranja Speedlight (`#FF9800`) y Blanco (`#FFFFFF`).
*   **Fotografía:** Estilo "Low Key" (Claro-oscuro). Sombras marcadas, luces de neon o naturales suaves.
*   **Tipografía:** Textos en las imágenes deben ser mínimos. Usamos la fuente del sistema (Inter/Oswald) para accesibilidad SEO.

---

## 4. ESTRATEGIA DE OPTIMIZACIÓN (ROADMAP)

Para escalar de 7 empresas a 7,000:

1.  **Migración a Server Components:** Mover la lógica de selección de anuncios al servidor para mejorar SEO y carga inicial.
2.  **Sistema de Rotación Ponderada:** Permitir múltiples clientes en el mismo espacio con probabilidades de aparición (Ej: Cliente Gold 80%, Silver 20%).
3.  **Portal de Autoservicio:** Crear `/admin/ads` para que el cliente suba sus propios assets y pague con tarjeta, eliminando el proceso manual por email.
4.  **Telemetría de Viewability:** Cobrar por "Vistas Reales" (más de 1s en pantalla) y no solo por impresiones técnicas.
5.  **Fallback Inteligente:** Si no hay anuncios vendidos, mostrar automáticamente promos internas de Speedlight (Merch, Suscripción).

---

**Creado por MIndFist Agent**
*Fecha: 10/12/2025*
