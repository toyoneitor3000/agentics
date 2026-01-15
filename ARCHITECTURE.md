# Protocolo de Arquitectura y Escalabilidad: Speedlight Culture
> **Visión:** Crear la red social automotriz definitiva, escalable globalmente, manteniendo soberanía de datos y eficiencia de costos.

## 1. Principios Fundamentales
1.  **Soberanía de Datos:** La base de datos (Postgres) es el activo más valioso. Evitar lógica propietaria que impida migrarla (ej: evitar excesiva dependencia de funciones Edge propietarias de un solo proveedor si no es estándar).
2.  **Cost-Efficiency en Video:** El video es lo más costoso. No usar almacenamiento de base de datos estándar para streaming masivo a largo plazo.
3.  **Automatización:** El despliegue (CI/CD) debe ser invisible y automático.

## 2. Hoja de Ruta de Infraestructura

### Fase 1: Lanzamiento y Tracción (ESTADO ACTUAL)
*   **Frontend/Backend:** Next.js hospedado en Vercel (Capa Pro/Hobby).
    *   *Por qué:* Iteración instantánea, CDN global incluida.
*   **Base de Datos:** Supabase (Postgres Managed).
    *   *Por qué:* Auth robusto incluido, Realtime nativo.
*   **Video Storage:** Supabase Storage (S3 wrapper).
    *   *Límite:* Hasta 50GB-100GB es manejable. Más allá, los costos de ancho de banda (egress) se disparan.

### Fase 2: Optimización de Media (Cuando pasemos los 1,000 usuarios activos)
*   **Cambio Crítico:** Migrar el *bucket* de videos de "Cinema" a **Cloudflare R2**.
    *   *Ventaja:* Cloudflare R2 no cobra tarifas de salida (egress bandwidth). Para una red social de video, esto es un ahorro del 90% vs AWS o Vercel Blob.
*   **Infraestructura:** Evaluar migración de Vercel a **Railway** si los "Serverless Functions" se vuelven limitantes por tiempos de ejecución (timeouts en procesamiento de video).

### Fase 3: Soberanía Total (Escala Masiva / Millones de usuarios)
*   **Infraestructura:** "Self-Hosted" utilizando **Coolify** (alternativa Open Source a Vercel).
*   **Hardware:** Servidores dedicados (Bare Metal) en Hetzner o AWS.
    *   *Ventaja:* Potencia bruta. Un servidor de $60/mes puede manejar el tráfico que en Vercel costaría $1000/mes.
*   **Base de Datos:** Cluster de Postgres propio o Supabase Self-Hosted gestionado por nosotros dentro de la misma red privada para latencia cero.

## 3. Flujo de Trabajo (DevOps)
El objetivo es "Commit -> Live" sin intervención humana.

1.  **Desarrollo:** Local (npm run dev).
2.  **Push:** Git push a rama `main`.
3.  **CI/CD (Vercel/Github Actions):**
    *   Linting y Type Checking automático.
    *   Construcción (Build).
    *   Migración de DB automática (si aplica).
    *   Promoción a Producción.
4.  **Notificación:** El sistema debe notificar el éxito/fracaso vía Webhook (Discord/Slack/Terminal), no requerir visita al dashboard.

## 4. Plan de Contingencia (Exit Strategy)
*   Todo el código es Next.js estándar (puede correr en cualquier contenedor Docker).
*   La base de datos es Postgres estándar (se puede exportar e importar en cualquier DB SQL).
*   Los archivos son objetos S3 estándar.
*   **Riesgo de Vendor Lock-in:** BAJO.

---
*Documento vivo. Actualizar conforme la infraestructura evolucione.*
