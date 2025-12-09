# Speedlight Ecosystem: Culture & Academy Integration Strategy

## 1. Integración del Ecosistema (Cross-Promotion)

Como Speedlight Academy y Speedlight Culture son entidades hermanas dentro del mismo ecosistema, la navegación fluida entre ambas es crítica.

### Estrategia de Banners "Mirror"
Se implementará un sistema de banners persistentes pero no intrusivos en ambas plataformas para redirigir el tráfico según el interés del usuario.

*   **En Speedlight Culture (Marketplace/Foro/Galería):**
    *   *Ubicación:* Banner delgado bajo el Navbar principal o Tarjeta destacada en el Sidebar del Dashboard.
    *   *Mensaje:* "¿Quieres aprender a construir esto? Únete a **Speedlight Academy**." o "Mejora tus fotos en **Speedlight Academy**."
    *   *Acción:* Link directo a `speedlightacademy.com` (o ruta `/academy`).

*   **En Speedlight Academy (Educación/Concursos):**
    *   *Ubicación:* Banner en el Footer o en la sección de "Recursos".
    *   *Mensaje:* "Consigue las partes para tu proyecto en **Speedlight Culture**." o "Muestra tu portafolio en la Galería de **Speedlight Culture**."
    *   *Acción:* Link directo a `speedlightculture.com`.

---

## 2. Plan de Suscripciones: Las 5 Probabilidades

Para maximizar la monetización y la retención, diseñamos 5 escenarios "Probabilidades" de suscripción que cubren distintos perfiles de usuario, desde el espectador casual hasta el negocio automotriz.

### Probabilidad 1: The "Spectator" (Nivel Gratuito)
*El punto de entrada para la masa crítica.*
*   **Costo:** $0 / mes
*   **Speedlight Culture:**
    *   Acceso de lectura a Foros y Galería.
    *   Poder comprar en Marketplace.
    *   Perfil básico de usuario.
*   **Speedlight Academy:**
    *   Acceso a cursos "Introductorios" gratuitos (cebos).
    *   Poder ver los ganadores de concursos.
*   **Objetivo:** Captación de leads y tráfico masivo.

### Probabilidad 2: The "Rookie" (Academy Focus - Estudiante)
*Para el usuario enfocado en aprender y mejorar sus habilidades.*
*   **Costo:** ~$9.99 USD / mes (o ~40.000 COP)
*   **Speedlight Academy:**
    *   **Acceso Total** a todos los cursos estándar (Foto, Edición, Mecánica Básica).
    *   Derecho a **Postular** en concursos (Semanal/Mensual).
    *   Badge de "Estudiante" en el perfil.
*   **Speedlight Culture:**
    *   Beneficios del nivel Gratuito.
    *   Descuento del 5% en Merch oficial.
*   **Objetivo:** Monetizar la base educativa.

### Probabilidad 3: The "Builder" (Culture Focus - Comerciante/Entusiasta)
*Para el usuario que vive en el garaje comprando, vendiendo y mostrando.*
*   **Costo:** ~$12.99 USD / mes (o ~50.000 COP)
*   **Speedlight Culture:**
    *   Publicación de productos **Ilimitada** en Marketplace.
    *   Publicaciones destacadas en el Foro.
    *   Subida de fotos en **4K/Original** en la Galería.
    *   Badge de "Builder Pro".
*   **Speedlight Academy:**
    *   Acceso a cursos de nivel medio.
    *   Descuento en talleres presenciales.
*   **Objetivo:** Monetizar el comercio y la vanidad (display).

### Probabilidad 4: The "Elite Racer" (Ecosystem Bundle - All Access)
*La experiencia definitiva. El usuario Power User.*
*   **Costo:** ~$19.99 USD / mes (o ~80.000 COP)
*   **Beneficios Combinados:**
    *   **TODO** lo de "Rookie" + **TODO** lo de "Builder".
    *   Acceso a concursos exclusivos "Prize Money".
    *   **Early Access** a nuevos drops de merch y eventos.
    *   Insignia Dorada/Elite en ambas plataformas.
    *   Votos con doble peso en concursos de la Academia (Jurado Junior).
*   **Objetivo:** Maximizar el ARPU (Average Revenue Per User) y crear embajadores de marca.

### Probabilidad 5: The "Sponsor/Garage" (Nivel Empresas)
*Para talleres, marcas y fotógrafos profesionales que buscan exposición.*
*   **Costo:** ~$49.99+ USD / mes (o ~200.000 COP)
*   **Speedlight Culture:**
    *   Perfil de **Empresa Verificada** en el Mapa de Talleres.
    *   Analytics de visitas a su perfil.
    *   Posts promocionados en el feed.
*   **Speedlight Academy:**
    *   Posibilidad de patrocinar un concurso (con aprobación).
    *   Crear su propio curso "Brand Partner" (ej: "Cómo instalar suspensión X").
    *   Acceso a base de talentos (bolsa de empleo).
*   **Objetivo:** B2B Revenue y partners estratégicos.

---

## 3. Implementación Técnica Sugerida

1.  **Unified Auth (SSO):** Utilizar la misma instancia de Supabase Auth para que el usuario "Juan" sea el mismo en Culture y Academy.
2.  **Role Management:** Tabla `subscriptions` en Supabase que dicta el `tier_id` (1-5) y propaga los permisos a ambas UI.
3.  **Shared UI Component:** Crear un componente `<EcosystemBanner />` en la librería compartida que detecte en qué app está y muestre el link a la opuesta.
