# 📋 Resumen de Herramientas del Agente Purrpur

Este documento lista todas las herramientas disponibles para el agente y su estado de disponibilidad.

---

## ✅ Herramientas Registradas en `root_agent.yaml` (16 tools)

### 🔧 Comandos y Deploy
1. ✅ `command_runner` - Ejecuta comandos seguros (npm, git, npx)
2. ✅ `request_deploy_approval` - Solicita aprobación antes de deploy
3. ✅ `vercel_deploy_trigger` - Ejecuta deploy real a Vercel
4. ✅ `infra_preview` - Preview de cambios de infraestructura

### 📁 Gestión de Archivos
5. ✅ `read_files` - Lee archivos del repositorio
6. ✅ `write_files_tool` - Escribe/actualiza archivos
7. ✅ `search_files` - Busca archivos por patrón glob

### 🎨 Diseño y Branding
8. ✅ `design_tokens_sync` - Sincroniza design tokens
9. ✅ `brand_library_lookup` - Busca assets de marca

### 🏗️ Scaffolding
10. ✅ `next_scaffolder` - Genera proyectos Next.js
11. ✅ `auth_module_generator` - Genera módulos de autenticación

### 🌐 Web y Búsqueda
12. ✅ `google_search` - Búsqueda web
13. ✅ `scrape_url_tool` - Scraping de URLs
14. ✅ `youtube_transcript_tool` - Transcripción de videos

### 🎵 Multimedia (Disponibles pero no registradas aún)
- ⚠️ `generate_image` - Generación de imágenes (Vertex AI Imagen 3)
- ⚠️ `edit_image` - Edición de imágenes
- ⚠️ `generate_video` - Generación de videos (Veo)
- ⚠️ `image_to_video` - Conversión imagen a video
- ⚠️ `text_to_speech` - Generación de audio (✅ registrado)
- ⚠️ `generate_music` - Generación de música
- ⚠️ `generate_sound_effects` - Efectos de sonido

### 🛠️ Utilidades
15. ✅ `system_stats_tool` - Estadísticas del sistema
16. ✅ `sleep_tool` - Utilidad de pausa

---

## 📊 Estadísticas

- **Total de herramientas disponibles**: ~22
- **Registradas en root_agent.yaml**: 16
- **Pendientes de registro**: 6 (multimedia)

---

## 🔍 Verificar Disponibilidad

Ejecuta el script de verificación:

```bash
python3 purrpurragent/verify_tools.py
```

Este script verifica:
- ✅ Que todas las herramientas puedan importarse
- ✅ Que estén registradas en `root_agent.yaml`
- ✅ Que las dependencias estén instaladas

---

## ➕ Agregar Nuevas Herramientas

Para agregar una nueva herramienta:

1. **Crear la función** en `purrpurragent/tools/`
2. **Exportarla** en `purrpurragent/tools/__init__.py`
3. **Registrarla** en `purrpurragent/root_agent.yaml` bajo `tools:`
4. **Verificar** con `verify_tools.py`

Ejemplo:
```yaml
# root_agent.yaml
tools:
  - name: purrpurragent.tools.nueva_tool.nueva_funcion
```

---

**Última actualización:** 2025-01-XX

