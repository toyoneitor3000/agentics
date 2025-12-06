# 📁 Estructura del Sistema Purrpur

## 🗂️ Organización de Archivos

```
purrpurragent/
│
├── 👑 agents/                          # AGENTE PRINCIPAL
│   ├── root_agent.yaml                 # Purrpur (CEO/Orquestador)
│   └── README.md                       # Documentación del root agent
│
├── 👷 workers/                         # AGENTES PRINCIPALES (12)
│   │
│   ├── 🔧 tech/                        # División Tecnología (6 agentes)
│   │   ├── cto_architect_agent.yaml
│   │   ├── frontend_web_agent.yaml
│   │   ├── mobile_dev_agent.yaml
│   │   ├── backend_cloud_agent.yaml
│   │   ├── qa_testing_agent.yaml
│   │   ├── ui_ux_designer_agent.yaml
│   │   └── README.md
│   │
│   ├── 📊 marketing/                   # División Marketing (3 agentes)
│   │   ├── cmo_agent.yaml
│   │   ├── data_seo_agent.yaml
│   │   ├── traffic_manager_agent.yaml
│   │   └── README.md
│   │
│   ├── 🎨 content/                     # División Contenido (4 agentes)
│   │   ├── social_media_manager_agent.yaml
│   │   ├── copywriter_storyteller_agent.yaml
│   │   ├── graphic_multimedia_agent.yaml    # ⭐ Multimedia AI
│   │   ├── translator_simplifier_agent.yaml
│   │   └── README.md
│   │
│   └── README.md                       # Documentación de workers
│
├── 🤖 subagents/                       # SUB-AGENTES (36)
│   ├── cto_architect/                  # 3 sub-agentes
│   ├── frontend_web/                   # 3 sub-agentes
│   ├── mobile_dev/                     # 3 sub-agentes
│   ├── backend_cloud/                  # 3 sub-agentes
│   ├── qa_testing/                     # 3 sub-agentes
│   ├── ui_ux_designer/                 # 3 sub-agentes
│   ├── cmo/                            # 3 sub-agentes
│   ├── data_seo/                       # 3 sub-agentes
│   ├── traffic_manager/                # 3 sub-agentes
│   ├── social_media_manager/           # 3 sub-agentes
│   ├── copywriter_storyteller/         # 3 sub-agentes
│   └── graphic_multimedia/             # 3 sub-agentes
│
├── 🛠️ tools/                           # HERRAMIENTAS (10 módulos)
│   ├── command_tools.py                # Ejecución de comandos
│   ├── repo_tools.py                   # Gestión de archivos
│   ├── scaffold_tools.py               # Generadores de código
│   ├── deploy_tools.py                 # Deploys con HITL
│   ├── design_tools.py                 # Design tokens
│   ├── image_generation_tools.py       # ⭐ Imágenes (Imagen 3)
│   ├── video_generation_tools.py       # ⭐ Videos (Veo)
│   ├── audio_generation_tools.py       # ⭐ Audio (TTS)
│   ├── search_tools.py                 # Búsqueda web
│   └── README.md
│
├── 🛡️ callbacks/                       # GUARDRAILS (8 funciones)
│   ├── orchestrator_callbacks.py       # Validación de briefs
│   ├── tech_callbacks.py               # Validación técnica
│   └── marketing_callbacks.py          # Validación de marca
│
├── 📚 playbooks/                       # TEMPLATES
│   └── delegation_template.md          # Template de delegación
│
└── 📖 docs/                            # DOCUMENTACIÓN
    ├── STATUS.md                       # Estado del sistema
    ├── QUICK_START.md                  # Guía de inicio
    ├── IMPLEMENTATION_GUIDE.md         # Arquitectura completa
    ├── CALLBACKS_INTEGRATION.md        # Integración de callbacks
    └── STRUCTURE.md                    # Este archivo
```

---

## 🎯 Jerarquía de Agentes

```
                    👑 Purrpur (Root Agent)
                    CEO/Orquestador Principal
                            |
        ┌───────────────────┼───────────────────┐
        |                   |                   |
    🔧 TECH            📊 MARKETING        🎨 CONTENT
   (6 workers)         (3 workers)        (4 workers)
        |                   |                   |
   ┌────┴────┐         ┌────┴────┐         ┌────┴────┐
   |         |         |         |         |         |
  CTO    Frontend    CMO    Data/SEO   Social   Graphic
  QA     Backend     Traffic          Copy     Translator
  Mobile  UI/UX                                
        |                   |                   |
   [18 sub]            [9 sub]             [9 sub]
```

---

## 📊 Conteo Total

| Nivel | Cantidad | Descripción |
|-------|----------|-------------|
| **Root** | 1 | Purrpur (CEO/Orquestador) |
| **Workers** | 13 | Agentes principales (Tech: 6, Marketing: 3, Content: 4) |
| **Sub-agents** | 36 | Especialistas (3 por cada worker) |
| **TOTAL** | **50 agentes** | Sistema completo |

---

## 🚀 Cómo Usar Esta Estructura

### 1. Iniciar el sistema
```bash
cd /path/to/purrpurragent
adk web agents/
```

ADK cargará automáticamente `agents/root_agent.yaml` como punto de entrada.

### 2. El Root Agent delega a Workers
```yaml
# agents/root_agent.yaml
sub_agents:
  # Tech Workers
  - config_path: ../workers/tech/cto_architect_agent.yaml
  - config_path: ../workers/tech/frontend_web_agent.yaml
  # ... etc
```

### 3. Los Workers delegan a Sub-agents
```yaml
# workers/tech/frontend_web_agent.yaml
sub_agents:
  - config_path: ../../subagents/frontend_web/frontend_component_library_agent.yaml
  - config_path: ../../subagents/frontend_web/frontend_seo_performance_agent.yaml
  # ... etc
```

---

## 🎨 Agentes Destacados

### ⭐ Graphic & Multimedia Agent
**Ubicación:** `workers/content/graphic_multimedia_agent.yaml`

**Capacidades:**
- 🖼️ Generación de imágenes (Vertex AI Imagen 3)
- 🎬 Generación de videos (Veo)
- 🎙️ Text-to-speech (voces Neural2)
- ✏️ Edición de imágenes (inpainting/outpainting)
- 🎞️ Animación de imágenes (image-to-video)

**Tools:**
- `generate_image`, `edit_image`
- `generate_video`, `image_to_video`
- `text_to_speech`

---

## 📝 Ventajas de Esta Estructura

✅ **Clara separación de responsabilidades**
- Root Agent = Orquestador
- Workers = Agentes principales por división
- Sub-agents = Especialistas

✅ **Fácil navegación**
- Cada división tiene su carpeta
- READMEs en cada nivel
- Documentación clara

✅ **Escalable**
- Agregar nuevos workers es simple
- Cada división puede crecer independientemente

✅ **Mantenible**
- Archivos organizados lógicamente
- Fácil encontrar y editar agentes específicos

---

## 🔄 Migración desde Estructura Anterior

La estructura anterior tenía todos los archivos YAML en la raíz:
```
purrpurragent/
├── root_agent.yaml
├── cto_architect_agent.yaml
├── frontend_web_agent.yaml
├── ... (todos mezclados)
```

**Nueva estructura:**
- ✅ Root agent en `agents/`
- ✅ Workers organizados por división en `workers/tech|marketing|content/`
- ✅ Sub-agents permanecen en `subagents/`
- ✅ Tools y callbacks sin cambios

**Rutas actualizadas:**
- Root agent ahora referencia `../workers/tech/...`
- Workers referencian `../../subagents/...`

---

## 📖 Documentación por Nivel

| Nivel | README | Contenido |
|-------|--------|-----------|
| `agents/` | ✅ | Descripción del Root Agent |
| `workers/` | ✅ | Overview de las 3 divisiones |
| `workers/tech/` | ✅ | 6 agentes técnicos |
| `workers/marketing/` | ✅ | 3 agentes de marketing |
| `workers/content/` | ✅ | 4 agentes de contenido |
| `tools/` | ✅ | 10 módulos de herramientas |

---

**Última actualización:** 2025-11-22  
**Versión de estructura:** 2.0  
**Total de agentes:** 50
