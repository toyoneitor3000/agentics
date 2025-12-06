# ✅ Checklist de Producción - Purrpur Agent

Lista de verificación para asegurar que el agente tenga todas las herramientas y configuraciones necesarias cuando esté en línea.

---

## 🔧 Herramientas Disponibles (16 tools)

### ✅ Tools Registrados en `root_agent.yaml`:

1. ✅ `command_runner` - Ejecución segura de comandos (npm, git, npx)
2. ✅ `request_deploy_approval` - Aprobación HITL para deploys
3. ✅ `vercel_deploy_trigger` - Deploy real a Vercel
4. ✅ `infra_preview` - Preview de cambios de infraestructura
5. ✅ `read_files` - Lectura de archivos del repositorio
6. ✅ `write_files_tool` - Escritura de archivos
7. ✅ `search_files` - Búsqueda de archivos por patrón
8. ✅ `google_search` - Búsqueda web
9. ✅ `design_tokens_sync` - Sincronización de design tokens
10. ✅ `brand_library_lookup` - Búsqueda de assets de marca
11. ✅ `next_scaffolder` - Generación de proyectos Next.js
12. ✅ `scrape_url_tool` - Scraping de URLs
13. ✅ `youtube_transcript_tool` - Transcripción de videos
14. ✅ `system_stats_tool` - Estadísticas del sistema
15. ✅ `text_to_speech` - Generación de audio
16. ✅ `sleep_tool` - Utilidad de pausa

### ⚠️ Tools Adicionales Disponibles (no registrados aún):

- `generate_image` - Generación de imágenes con Vertex AI
- `edit_image` - Edición de imágenes
- `generate_video` - Generación de videos con Veo
- `image_to_video` - Conversión imagen a video
- `generate_music` - Generación de música
- `generate_sound_effects` - Efectos de sonido

---

## 🔐 Variables de Entorno Requeridas

### Google Cloud / Vertex AI
```bash
GOOGLE_CLOUD_PROJECT=tu-proyecto-gcp
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json  # O usar ADC
```

### GitHub
```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GIT_USER_NAME="Camilo Toloza"
GIT_USER_EMAIL=cto@purrpur.com
GITHUB_REPO=https://github.com/<usuario>/purpur-landing-page.git
```

### Vercel
```bash
VERCEL_TOKEN=vercel_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VERCEL_ORG_ID=team_xxxxxxxxxxxxx
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxx
VERCEL_SCOPE=personal  # o slug del equipo
VERCEL_DEPLOY_PATH=.   # o purrpurr_web
```

### ADK Server (si se ejecuta como servicio)
```bash
ADK_HOST=0.0.0.0  # o 127.0.0.1 para local
ADK_PORT=8000
```

---

## 📦 Dependencias Python Requeridas

```bash
# Instalar desde requirements.txt o manualmente:
google-adk
google-cloud-aiplatform
google-cloud-texttospeech
google-cloud-storage  # Si usas GCS para assets
```

**Verificar instalación:**
```bash
python3 -c "import google.adk; print('✅ ADK instalado')"
python3 -c "import google.cloud.aiplatform; print('✅ Vertex AI instalado')"
python3 -c "import google.cloud.texttospeech; print('✅ TTS instalado')"
```

---

## 🌐 Configuración del Servidor ADK

### Opción 1: Servidor Local (desarrollo)
```bash
./start_adk.sh
# Accede en http://127.0.0.1:8000
```

### Opción 2: Servidor en Red Local
```bash
ADK_HOST=0.0.0.0 ADK_PORT=8000 adk web purrpurragent/
# Accesible desde otros dispositivos en tu red
```

### Opción 3: Servidor en Producción (Vercel/Cloud Run)
- Necesitas exponer el servidor ADK como API
- Crear un API route en Next.js que actúe como proxy
- O desplegar ADK como servicio separado (Cloud Run, Railway, etc.)

---

## 🔗 Integración con Interfaz Web

### Requisitos para la Interfaz Web:

1. **API Route Proxy** (`/api/agent`)
   - Conecta la interfaz Next.js con el servidor ADK
   - Maneja autenticación y rate limiting
   - Procesa requests/responses del agente

2. **Componente de Chat** (`/agent`)
   - Interfaz de chat para interactuar con el agente
   - Muestra historial de conversación
   - Maneja streaming de respuestas

3. **Variables de Entorno en Vercel**
   - Todas las variables de `.env` deben estar en Vercel Dashboard
   - Configurar como "Environment Variables" en el proyecto

---

## ✅ Verificación Pre-Deploy

Ejecuta este script antes de desplegar:

```bash
# IMPORTANTE: Activa el entorno virtual primero
source .venv/bin/activate

# Verificar que todas las herramientas estén disponibles
python3 purrpurragent/verify_tools.py

# Verificar variables de entorno (si existe)
# python3 purrpurragent/verify_env.py

# Verificar conectividad con servicios externos (si existe)
# python3 purrpurragent/verify_connections.py
```

**Nota:** El script `verify_tools.py` debe ejecutarse con el entorno virtual activado para que pueda importar correctamente todas las dependencias.

---

## 🚀 Pasos para Deploy en Producción

1. ✅ **Verificar herramientas**: Ejecutar `verify_tools.py`
2. ✅ **Configurar variables**: Agregar todas las ENV en Vercel
3. ✅ **Desplegar servidor ADK**: Como servicio separado o API route
4. ✅ **Desplegar interfaz web**: Next.js en Vercel
5. ✅ **Probar conectividad**: Verificar que la interfaz se conecte al agente
6. ✅ **Probar herramientas**: Ejecutar comandos de prueba desde la UI

---

## 📝 Notas Importantes

- **Seguridad**: Nunca exponer tokens directamente en el frontend
- **Rate Limiting**: Implementar límites de requests por usuario
- **Logging**: Registrar todas las interacciones para debugging
- **Backup**: Mantener backup de configuraciones y credenciales
- **Monitoring**: Configurar alertas para errores del agente

---

**Última actualización:** 2025-01-XX  
**Estado:** ✅ Listo para producción (tras completar checklist)

