# Conceptos para el Sistema de Mensajes (Inbox) - Speedlight Culture

Este documento detalla ideas innovadoras para el sistema de mensajería privada, diseñadas para alinearse con la estética "Premium Automotive" de la plataforma.

## 1. "Quick Revs" (Notas de Voz con Tacómetro)
**Concepto:** Reemplazar la visualización de onda de audio tradicional por una experiencia automotriz.
- **Funcionamiento:** Al grabar o reproducir un audio, en lugar de barras, se muestra una aguja de tacómetro digital.
- **Visual:** La aguja sube de RPM (revoluciones) según la intensidad/volumen de la voz.
- **Estética:** Colores neón/ámbar sobre fondo oscuro, estilo tablero de instrumentos.

## 2. Negociación Integrada (Marketplace System)
**Concepto:** Facilitar la compra-venta de piezas y vehículos directamente en el chat.
- **Rich Cards:** Si se comparte un link del Marketplace, aparece una tarjeta interactiva en el chat.
- **Acciones:**
    - Botón **"Hacer Oferta"**: Permite ingresar un monto monetario.
    - Botón **"Aceptar Trato"**: El vendedor puede aceptar inmediatamente, marcando el ítem como "Reservado" o "Vendido".

## 3. Modo "Pit Stop" (Respuestas de Estado Rápido)
**Concepto:** Comunicación rápida para usuarios que están conduciendo o trabajando en sus autos.
- **Iconos/Estados:**
    - 🔧 (Llave): "En el taller / Wrenching"
    - 🏎️ (Volante): "Rodando / Driving"
    - ⛽ (Surtidor): "Cargando combustible"
- **Funcionalidad:** Un toque para enviar el estado como respuesta automática o mostrarlo junto al avatar en la lista de chats.

## 4. "Build Sheets" Interactivas
**Concepto:** Compartir proyectos no como un link simple, sino como una ficha técnica.
- **Contenido del Mensaje:**
    - Foto principal del auto.
    - Stats clave: HP, Modelo, Año, % de Proyecto completado.
    - Botón **"Ver Build"**: Lleva al detalle del proyecto.

## 5. Mensajes "Burnout" (Efímeros)
**Concepto:** Mensajes privados para información sensible (ubicaciones de meets secretos, precios especiales).
- **Mecánica:** El mensaje se autodestruye después de ser visto o tras un tiempo definido (ej. 1 hora).
- **Efecto Visual:** Animación de humo de llanta (burnout) disipándose cuando el mensaje desaparece.

---

# Ubicación de los Botones de "Enviar Mensaje" (Entry Points)

Para asegurar una experiencia fluida, el acceso al chat debe estar contextualizado:

### 1. Perfil del Usuario (Principal)
- **Ubicación:** En el encabezado del perfil público (`ProfileHeader`), junto al botón de "Seguir".
- **Comportamiento:**
    - Si ya se siguen: Botón primario grande "Mensaje".
    - Si no se siguen: Botón secundario (icono de sobre) al lado de "Seguir".

### 2. Marketplace (Transaccional)
- **Ubicación:** En la página de detalle del producto (`ListingDetail`).
- **Texto del Botón:** "Contactar Vendedor" o "Hacer Oferta".
- **Comportamiento:** Abre un chat nuevo pre-llenado con el link del producto interesado.

### 3. Tarjetas de Feed / Proyectos (Casual)
- **Ubicación:** Al hacer hover sobre el nombre del usuario o en un menú de "..." (Más opciones).
- **Comportamiento:** Opción "Enviar mensaje privado".

### 4. Lista de Seguidores/Seguidos
- **Ubicación:** Un icono de "avión de papel" o "burbuja de chat" a la derecha de cada usuario en la lista.
