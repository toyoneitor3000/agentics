# 🎨 Purrpur Agent System v2.0

**Sistema multi-agente empresarial para construcción de productos digitales de alta calidad**

![Version](https://img.shields.io/badge/version-2.0.0-purple)
![Status](https://img.shields.io/badge/status-operational-green)
![Agents](https://img.shields.io/badge/agents-50-blue)
![Structure](https://img.shields.io/badge/structure-organized-orange)

---

## 🚀 Inicio Rápido

### Opción 1: Script automático (Recomendado)
```bash
cd purrpurragent
./start_purrpur.sh
```

### Opción 2: Manual
```bash
cd /path/to/purpur-landing-page
source .venv/bin/activate
adk web purrpurragent/
```

Luego abre: **http://127.0.0.1:8000**

---

## 📁 Estructura Organizacional

```
purrpurragent/
├── 👑 agents/              # AGENTE PRINCIPAL
│   └── root_agent.yaml     # Purrpur (CEO/Orquestador)
│
├── 👷 workers/             # 14 AGENTES PRINCIPALES
│   ├── tech/               # 6 agentes técnicos
│   ├── marketing/          # 3 agentes de marketing
│   ├── content/            # 4 agentes de contenido
│   └── finance/            # 1 agente financiero
│
├── 🤖 subagents/           # 39 SUB-AGENTES ESPECIALIZADOS
│
├── 🛠️ tools/               # 10 MÓDULOS DE HERRAMIENTAS
│   ├── image_generation_tools.py    # ⭐ Imágenes (Imagen 3)
│   ├── video_generation_tools.py    # ⭐ Videos (Veo)
│   └── audio_generation_tools.py    # ⭐ Audio (TTS)
│
└── 🛡️ callbacks/           # 8 GUARDRAILS DE VALIDACIÓN
```

**Ver diagrama completo:** [STRUCTURE.md](STRUCTURE.md)

---

## 🎯 Jerarquía de Agentes

```
                    👑 Purrpur (Root Agent)
                            |
        ┌───────────────────┼───────────────────┐
        |                   |                   |
    🔧 TECH            📊 MARKETING        🎨 CONTENT         💰 FINANCE
   (6 workers)         (3 workers)        (4 workers)        (1 worker)
        |                   |                   |                   |
   [18 sub]            [9 sub]             [12 sub]            [3 sub]
```

### División Tecnología (Tech Workers)
- **CTO Architect** - Arquitectura y estrategia
- **Frontend Web** - Next.js/React (TailwindCSS, Framer Motion)
- **Mobile Dev** - React Native/Expo
- **Backend Cloud** - APIs y cloud infrastructure
- **QA Testing** - Quality assurance
- **UI/UX Designer** - Design systems y experiencia

### División Marketing (Marketing Workers)
- **CMO** - Estrategia de marketing
- **Data & SEO** - Analytics y optimización
- **Traffic Manager** - Gestión de ads y tráfico

### División Contenido (Content Workers)
- **Social Media Manager** - Redes sociales
- **Copywriter & Storyteller** - Redacción y narrativa
- **Graphic & Multimedia** ⭐ - Imágenes, videos, audio
- **Translator & Simplifier** - Traducción y simplificación

### División Financiera (Finance Workers)
- **CFO** - Estrategia financiera, control de costos, ROI


---

## ⭐ Capacidades Multimedia

### Generación de Imágenes
- **Modelo:** Vertex AI Imagen 3
- **Calidad:** 8k, cinematic lighting
- **Ratios:** 1:1, 16:9, 9:16, 4:3, 3:4
- **Tool:** `generate_image`, `edit_image`

### Generación de Videos
- **Modelo:** Veo
- **Tipos:** text-to-video, image-to-video
- **Duración:** hasta ~8 segundos
- **Tool:** `generate_video`, `image_to_video`

### Text-to-Speech
- **Servicio:** Google Cloud TTS
- **Voces:** Neural2 (natural)
- **Idiomas:** Español, Inglés, Portugués
- **Tool:** `text_to_speech`

---

## 📊 Métricas del Sistema

| Métrica | Valor |
|---------|-------|
| **Total de agentes** | 54 |
| **Root Agent** | 1 |
| **Workers** | 14 |
| **Sub-agents** | 39 |
| **Tools** | 10 módulos |
| **Callbacks** | 8 funciones |
| **Líneas de código** | ~1,500 |

---

## 🎯 Casos de Uso

### 1. Crear una Web App Completa
```
"Construye FinanCars: plataforma de venta de vehículos"
```
**Agentes activados:** CTO → Frontend → Backend → QA → UI/UX

### 2. Generar Contenido Multimedia
```
"Necesito imágenes y videos para campaña de Instagram"
```
**Agentes activados:** Social Media → Copywriter → Graphic Multimedia

### 3. Estrategia de Marketing
```
"Quiero lanzar mi producto al mercado"
```
**Agentes activados:** CMO → Data/SEO → Traffic Manager

---

## 🔒 Seguridad

✅ **Whitelist de comandos** - Solo comandos pre-aprobados  
✅ **Path traversal protection** - Validación de rutas  
✅ **Human-in-the-Loop** - Aprobación para deploys críticos  
✅ **Timeouts** - Comandos limitados a 120s  
✅ **Guardrails** - Callbacks de validación automática

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [STATUS.md](STATUS.md) | Estado actual del sistema |
| [STRUCTURE.md](STRUCTURE.md) | Estructura organizacional completa |
| [QUICK_START.md](QUICK_START.md) | Guía de inicio rápido |
| [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) | Arquitectura técnica |
| [CALLBACKS_INTEGRATION.md](CALLBACKS_INTEGRATION.md) | Integración de callbacks |
| [tools/README.md](tools/README.md) | Documentación de herramientas |
| [workers/README.md](workers/README.md) | Documentación de workers |
| [INTEGRATIONS.md](INTEGRATIONS.md) | Conectar UI + GitHub + Vercel |

---

## 🆕 Novedades v2.0

### Estructura Reorganizada
- ✅ Agente principal en `agents/`
- ✅ Workers organizados por división en `workers/tech|marketing|content/`
- ✅ READMEs en cada nivel
- ✅ Rutas actualizadas en todos los YAML

### Mejoras de Documentación
- ✅ Diagrama de estructura completo
- ✅ READMEs específicos por división
- ✅ Script de inicio mejorado
- ✅ Guías actualizadas

---

## 🛠️ Requisitos

- Python 3.10+
- Google ADK
- Vertex AI (para multimedia)
- Credenciales de Google Cloud

### Instalación
```bash
pip install google-adk google-cloud-aiplatform google-cloud-texttospeech
```

### Configuración
```bash
# Configurar proyecto de Google Cloud
export GOOGLE_CLOUD_PROJECT="tu-proyecto"
export GOOGLE_CLOUD_LOCATION="us-central1"

# Autenticación
gcloud auth application-default login
```

---

## 🎉 Estado Actual

✅ **Sistema 100% operacional**  
✅ **Estructura organizacional clara**  
✅ **Documentación completa**  
✅ **Capacidades multimedia avanzadas**  
✅ **Seguridad implementada**  
✅ **Listo para producción**

---

## 🌐 Acceso desde el Navegador Web

El agente puede ser accedido desde una interfaz web desplegada en Vercel:

### Interfaz Web
- **Ruta**: `/agent` en `purrpurr_web`
- **API Route**: `/api/agent` que se conecta al servidor ADK
- **Componente**: `purrpurr_web/src/app/agent/page.tsx`

### Verificación de Herramientas
Antes de desplegar, ejecuta:
```bash
python3 purrpurragent/verify_tools.py
```

### Documentación de Deployment
- [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - Checklist completo de producción
- [docs/AGENT_DEPLOYMENT.md](../docs/AGENT_DEPLOYMENT.md) - Guía de deployment en Vercel
- [INTEGRATIONS.md](INTEGRATIONS.md) - Integración con GitHub/Vercel

---

## 📞 Soporte

Para debugging y troubleshooting, consulta:
- [STATUS.md](STATUS.md) - Issues conocidos
- [QUICK_START.md](QUICK_START.md) - Troubleshooting
- [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - Verificación pre-deployment

---

**Última actualización:** 2025-01-XX  
**Versión:** 2.1.0  
**Licencia:** Propietario - Purrpur  

🚀 **¡A construir productos increíbles!**
