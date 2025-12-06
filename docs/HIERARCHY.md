# 🎯 Jerarquía Completa del Sistema Purrpur

## 📊 **Flujo de Ejecución Completo**

```
1. 👤 USUARIO
   ↓ (envía prompt)
   
2. 👑 ROOT AGENT (Purrpur - CEO)
   ↓ (analiza y delega)
   
3. 👷 WORKER (Agente Principal)
   ↓ (coordina y delega)
   
4. 🤖 SUBAGENT (Especialista)
   ↓ (ejecuta tareas específicas)
   
5. 🛠️ TOOLS (Herramientas)
   ↓ (realizan acciones reales)
   
6. 📁 WORKSPACE (Archivos generados)
   ↓ (resultado final)
   
7. 👤 USUARIO (recibe resultado)
```

---

## 🔢 **Niveles de la Jerarquía**

### **Nivel 0: Usuario**
- **Rol:** Envía solicitudes al sistema
- **Ejemplo:** "Construye una landing page para FinanCars"

### **Nivel 1: Root Agent** 👑
- **Nombre:** Purrpur (CEO/Orquestador)
- **Cantidad:** 1 agente
- **Archivo:** `root_agent.yaml`
- **Responsabilidad:** 
  - Analizar la solicitud del usuario
  - Decidir qué workers activar
  - Supervisar la calidad del resultado
  - Rechazar resultados básicos o experimentales

**Ejemplo de decisión:**
```
Usuario: "Construye FinanCars"
Root Agent piensa:
  - Es un proyecto web → Activo Frontend Worker
  - Necesita diseño → Activo UI/UX Worker
  - Necesita contenido → Activo Copywriter Worker
```

---

### **Nivel 2: Workers** 👷
- **Cantidad:** 14 agentes principales
- **Ubicación:** `workers/tech/`, `workers/marketing/`, `workers/content/`, `workers/finance/`
- **Responsabilidad:**
  - Coordinar tareas complejas de su especialidad
  - Delegar a sus sub-agentes
  - Consolidar resultados

**División Tecnología (6 workers):**
1. **CTO Architect** - Arquitectura y estrategia
2. **Frontend Web** - Desarrollo web (Next.js/React)
3. **Mobile Dev** - Desarrollo móvil
4. **Backend Cloud** - APIs y cloud
5. **QA Testing** - Quality assurance
6. **UI/UX Designer** - Diseño de experiencia

**División Marketing (3 workers):**
7. **CMO** - Estrategia de marketing
8. **Data & SEO** - Analytics y SEO
9. **Traffic Manager** - Gestión de ads

**División Contenido (4 workers):**
10. **Social Media Manager** - Redes sociales
11. **Copywriter & Storyteller** - Redacción
12. **Graphic & Multimedia** - Diseño y multimedia
13. **Translator & Simplifier** - Traducción

**Ejemplo de delegación:**
```
Frontend Worker recibe: "Crea la landing page"
Frontend Worker delega:
  - Component Library Subagent → Crea componentes reutilizables
  - SEO Performance Subagent → Optimiza para SEO
  - Accessibility Subagent → Asegura accesibilidad
```

---

### **Nivel 3: Subagents** 🤖
- **Cantidad:** 39 sub-agentes (3 por worker)
- **Ubicación:** `subagents/`
- **Responsabilidad:**
  - Ejecutar tareas ultra-específicas
  - Usar tools para realizar acciones reales
  - Reportar resultados al worker

**Ejemplos por división:**

**Tech Subagents:**
- `frontend_component_library_agent` - Biblioteca de componentes
- `backend_api_design_agent` - Diseño de APIs
- `qa_automation_agent` - Automatización de pruebas

**Marketing Subagents:**
- `cmo_market_research_agent` - Investigación de mercado
- `seo_technical_agent` - SEO técnico
- `paid_search_agent` - Publicidad en buscadores

**Content Subagents:**
- `design_motion_agent` - Motion graphics y videos
- `copy_brand_voice_agent` - Voz de marca
- `social_triptico_agent` - Formato Instagram

**Finance Subagents:**
- `financial_planning_agent` - Planificación y presupuesto
- `cost_controller_agent` - Control de costos operativos
- `roi_monetization_agent` - Estrategia de ROI

**Ejemplo de ejecución:**
```
Design Motion Subagent recibe: "Crea un video promocional"
Design Motion Subagent:
  1. Usa generate_video tool
  2. Guarda en workspace/assets/videos/
  3. Reporta al Graphic Multimedia Worker
```

---

### **Nivel 4: Tools** 🛠️
- **Cantidad:** 10 módulos de herramientas
- **Ubicación:** `tools/`
- **Responsabilidad:**
  - Ejecutar acciones reales en el sistema
  - Generar archivos
  - Ejecutar comandos
  - Interactuar con APIs externas

**Categorías de Tools:**

**1. Generación de Código:**
- `scaffold_tools.py` - Genera proyectos Next.js
- `command_tools.py` - Ejecuta comandos npm/git

**2. Generación Multimedia:**
- `image_generation_tools.py` - Imágenes con Imagen 3
- `video_generation_tools.py` - Videos con Veo
- `audio_generation_tools.py` - Audio con TTS

**3. Gestión de Archivos:**
- `repo_tools.py` - Read/Write/Search de archivos

**4. Diseño:**
- `design_tools.py` - Design tokens y brand assets

**5. Deploy:**
- `deploy_tools.py` - Deploys con HITL

**6. Búsqueda:**
- `search_tools.py` - Búsqueda web

**Ejemplo de uso:**
```python
# El subagent llama al tool:
result = generate_image(
    prompt="Modern car dealership hero image",
    output_path="./workspace/assets/images/hero.png"
)
# Tool ejecuta:
# 1. Llama a Vertex AI Imagen 3
# 2. Genera la imagen
# 3. Guarda en workspace/assets/images/hero.png
# 4. Retorna resultado al subagent
```

---

### **Nivel 5: Workspace** 📁
- **Ubicación:** `workspace/`
- **Responsabilidad:**
  - Almacenar todos los archivos generados
  - Mantener organización
  - Evitar desorden

**Estructura:**
```
workspace/
├── projects/       # Proyectos completos
│   └── financars/
│       ├── src/
│       ├── public/
│       └── package.json
│
├── assets/         # Assets multimedia
│   ├── images/
│   ├── videos/
│   └── audio/
│
├── exports/        # Documentos y reportes
│   └── reports/
│
└── temp/           # Archivos temporales
```

---

## 🔄 **Ejemplo de Flujo Completo**

### Solicitud: "Construye FinanCars con imágenes premium"

```
1. USUARIO
   └─> "Construye FinanCars con imágenes premium"

2. ROOT AGENT (Purrpur)
   ├─> Analiza: Es un proyecto web + multimedia
   ├─> Delega a: Frontend Worker, UI/UX Worker, Graphic Worker
   └─> Supervisa calidad

3. FRONTEND WORKER
   ├─> Recibe: "Crea la estructura web"
   ├─> Delega a: Component Library Subagent
   └─> Consolida: Proyecto Next.js

4. COMPONENT LIBRARY SUBAGENT
   ├─> Recibe: "Genera componentes"
   ├─> Usa: next_scaffolder tool
   └─> Ejecuta: npx create-next-app financars

5. NEXT_SCAFFOLDER TOOL
   ├─> Ejecuta comando en workspace/projects/
   ├─> Crea: workspace/projects/financars/
   └─> Retorna: Proyecto creado exitosamente

6. GRAPHIC WORKER
   ├─> Recibe: "Genera imágenes premium"
   ├─> Delega a: Brand Assets Subagent
   └─> Consolida: 5 imágenes generadas

7. BRAND ASSETS SUBAGENT
   ├─> Recibe: "Crea hero image"
   ├─> Usa: generate_image tool
   └─> Ejecuta: Vertex AI Imagen 3

8. GENERATE_IMAGE TOOL
   ├─> Llama a Vertex AI
   ├─> Genera imagen 8k
   ├─> Guarda en: workspace/assets/images/hero.png
   └─> Retorna: Imagen guardada

9. WORKSPACE
   ├─> workspace/projects/financars/ (proyecto completo)
   └─> workspace/assets/images/hero.png (imagen)

10. ROOT AGENT
    ├─> Revisa calidad
    ├─> Consolida resultados
    └─> Reporta al usuario

11. USUARIO
    └─> Recibe: "✅ FinanCars creado en workspace/projects/financars/"
```

---

## 📊 **Resumen de Cantidades**

| Nivel | Tipo | Cantidad | Ubicación |
|-------|------|----------|-----------|
| 1 | Root Agent | 1 | `root_agent.yaml` |
| 2 | Workers | 13 | `workers/` |
| 3 | Subagents | 36 | `subagents/` |
| 4 | Tools | 10 | `tools/` |
| 5 | Workspace | 1 | `workspace/` |
| **TOTAL** | **Agentes** | **50** | - |

---

## 🎯 **Reglas de Delegación**

### Root Agent → Worker
- ✅ Delega tareas complejas
- ✅ Especifica objetivos claros
- ✅ Supervisa calidad

### Worker → Subagent
- ✅ Delega tareas específicas
- ✅ Coordina múltiples subagents
- ✅ Consolida resultados

### Subagent → Tool
- ✅ Ejecuta acciones reales
- ✅ Usa tools apropiados
- ✅ Maneja errores

### Tool → Workspace
- ✅ Guarda en ubicación correcta
- ✅ Crea carpetas si no existen
- ✅ Retorna rutas absolutas

---

## 🚫 **Lo que NO hace cada nivel**

### Root Agent NO:
- ❌ Ejecuta tools directamente
- ❌ Genera código
- ❌ Crea archivos

### Worker NO:
- ❌ Ejecuta tools (delega a subagents)
- ❌ Toma decisiones del Root Agent
- ❌ Genera archivos directamente

### Subagent NO:
- ❌ Delega a otros subagents
- ❌ Toma decisiones de workers
- ❌ Crea archivos sin usar tools

### Tool NO:
- ❌ Toma decisiones
- ❌ Delega tareas
- ❌ Analiza contexto

---

**Última actualización:** 2025-11-22  
**Versión:** 2.0.0
