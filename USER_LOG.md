# Speedlight Culture - Engineering Status Update
**Fecha:** 2025-12-14
**Versión de Componentes:** Cinema Module v2.1 (Hybrid Social)

## 1. Módulo: Cinema (Streaming & Social)
Hemos migrado de un concepto de "Scroll Vertical" y luego "Streaming Netflix" hacia una **Plataforma Social Híbrida**.

### Estado Actual:
- **Hero Interactivo (Social):** La página principal muestra el video más relevante (o el último post trending) en pantalla completa, pero NO como un fondo, sino como una **Publicación de Usuario**.
- **Metadatos Reales:** Se visualiza avatar del creador, nombre de usuario, título personalizado por el usuario, descripción y botones de seguimiento.
- **Interacción (Estilo Vertical):** Botones de Likes, Comentarios y Compartir dispuestos verticalmente a la derecha para consistencia con patrones de UX social.
- **Cinema Mode (Immersive):** Al hacer clic en "Ver Película +15s", se activa un reproductor inmersivo dedicado que oculta la interfaz tras 1.2s de inactividad.

### Notas Técnicas & Limitaciones Actuales:
1.  **Hardcoding en Producción (Hotfix):** 
    -   *Situación:* Se ha introducido manualmente (`mockFeaturedPost`) el video "THE ULTIMATE INTRO" de *LIMITED* para pruebas visuales inmediatas.
    -   *Razón:* Para garantizar que el video específico de prueba (`v=2nbXhW7oFZ8`) se visualice con los metadatos exactos solicitados durante la revisión de diseño, sin depender de que exista en la DB local del entorno de desarrollo.
    -   *Próximo Paso:* Eliminar el objeto `mockFeaturedPost` y conectar `featuredPost` directamente al resultado `feed[0]` de `getCinemaFeed()`.

2.  **Logo de YouTube en "Autoplay":**
    -   *Problema:* En algunas cargas, aparece el botón rojo de reproducción de YouTube en el centro.
    -   *Causa:* Las políticas de "Autoplay Policy" de navegadores modernos (Chrome/Safari) bloquean la reproducción automática de videos con sonidos si el usuario no ha interactuado primero con el dominio. El iframe de YouTube, al ser bloqueado, muestra su estado "Pauser" (botón gigante).
    -   *Solución Definitiva:* Implementar una "Capa de Portada" (Thumbnail Image) que solo desaparezca cuando el player reporte el evento `onStateChange: PLAYING`. Actualmente, dependemos de un `setTimeout` que puede no estar sincronizado con el bloqueo del navegador.

## 2. Próximos Pasos (Roadmap Inmediato)
1.  **Conexión DB Total:** Remover los mocks en `page.tsx` y permitir que el CMS alimente el Hero desde `cinema_videos`.
2.  **Smart Autoplay:** Detectar si el navegador permite autoplay. Si no, mostrar botón de "Play" nativo de Speedlight sobre la portada estática, y solo cargar el iframe de YouTube al hacer clic (Lazy Load). Esto elimina el logo de YouTube para siempre.
