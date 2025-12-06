# Guía de Implementación - Sistema Purrpur

## 🎯 Arquitectura Implementada

Has construido un **sistema multi-agente orquestado** con 48 agentes especializados:
- **1 Root Agent** (Purrpur - CEO/Orquestador)
- **12 Agentes Principales** (divisiones Tech + Marketing)
- **36 Sub-agentes** (especialistas dentro de cada división)

## 📁 Estructura de Archivos

```
purrpurragent/
├── root_agent.yaml                    # Orquestador principal
├── [12 agentes principales].yaml      # CTO, Frontend, Backend, etc.
├── subagents/                         # 36 sub-agentes organizados por división
│   ├── cto_architect/
│   ├── frontend_web/
│   ├── mobile_dev/
│   ├── backend_cloud/
│   ├── qa_testing/
│   ├── ui_ux_designer/
│   ├── cmo/
│   ├── data_seo/
│   ├── traffic_manager/
│   ├── social_media_manager/
│   ├── copywriter_storyteller/
│   └── graphic_multimedia/
├── tools/                             # Herramientas ejecutables
│   ├── command_tools.py               # Ejecución de comandos con whitelist
│   ├── deploy_tools.py                # Deploys con HITL
│   ├── repo_tools.py                  # Read/Write/Search de archivos
│   ├── scaffold_tools.py              # Generadores de boilerplate
│   └── design_tools.py                # Sincronización de design tokens
├── callbacks/                         # Guardrails de validación
│   ├── orchestrator_callbacks.py      # Validación de briefs
│   ├── tech_callbacks.py              # Validación de builds/QA
│   └── marketing_callbacks.py         # Validación de assets de marca
├── playbooks/
│   └── delegation_template.md         # Template estándar de delegación
└── tmp/                               # Copias temporales del builder UI
```

## 🔧 Tools Implementados

### Agentes Técnicos (CTO, Frontend, Backend, Mobile, QA)
- ✅ `command_runner`: Ejecuta npm, git, npx (con whitelist de seguridad)
- ✅ `read_files` / `write_files`: Manipulación segura de archivos
- ✅ `search_files`: Búsqueda por patrones glob
- ✅ `next_scaffolder`: Prepara proyectos Next.js
- ✅ `auth_module_generator`: Genera NextAuth/Clerk
- ✅ `infra_preview`: Preview de cambios IaC sin aplicarlos
- ✅ `vercel_deploy_trigger`: Deploy con aprobación HITL

### Agentes Creativos (UI/UX, Social, Copy, Diseño)
- ✅ `design_tokens_sync`: Convierte design system a código
- ✅ `brand_library_lookup`: Busca logos, colores, tipografías

## 🛡️ Callbacks (Guardrails)

### Root Agent
- `validate_user_brief`: Detecta briefs vagos y pide más contexto
- `log_delegation_summary`: Registra qué agentes fueron activados
- `ensure_delegation_template`: Valida que el template esté disponible

### Agentes Técnicos
- `validate_tech_context`: Verifica que existan docs técnicos
- `validate_build_success`: Detecta errores en compilación
- `block_on_critical_failures`: Bloquea deploys si QA encuentra issues críticos

### Agentes Creativos
- `validate_brand_assets`: Verifica que existan BRAND.md y DESIGN-SYSTEM.md
- `ensure_triptico_specs`: Inyecta specs del formato Instagram
- `validate_content_tone`: Detecta tono no alineado con marca

## 🚀 Cómo Usar el Sistema

### 1. Iniciar el servidor ADK
```bash
cd "/Users/camilotoloza/Library/CloudStorage/GoogleDrive-camilotoloza1136@gmail.com/My Drive/PURPUR/purpur-landing-page"
source .venv/bin/activate
adk web .
```

**O usa el script helper:**
```bash
./start_adk.sh
```

**Importante:** ADK espera que el directorio de agentes sea el **padre** de `purrpurragent/`. Por eso ejecutamos `adk web .` desde el directorio raíz del proyecto.

Accede a: `http://127.0.0.1:8000`

### 2. Ejemplo de interacción

**Usuario dice:**
> "Necesito una plataforma web para vender carros usados llamada FinanCars"

**Purrpur (root_agent) responde:**
1. Analiza que es un proyecto web complejo
2. Activa `cto_architect_agent` para definir arquitectura
3. CTO activa sus 3 sub-agentes:
   - `cto_architect_tech_strategy_agent`: Define stack (Next.js + NestJS + PostgreSQL + AWS)
   - `cto_architect_security_agent`: Especifica auth, HTTPS, validaciones
   - `cto_architect_devops_agent`: Diseña pipelines CI/CD
4. Delega a `frontend_web_agent` → activa `next_scaffolder`
5. Delega a `backend_cloud_agent` → usa `infra_preview` para mostrar plan AWS
6. Delega a `ui_ux_designer_agent` → usa `brand_library_lookup` para mantener consistencia
7. Consolida todo y entrega roadmap ejecutable

### 3. Flujo de desarrollo típico

```
Usuario: "Construye FinanCars"
  ↓
Root Agent analiza → Delega a CTO
  ↓
CTO define arquitectura → Delega a Frontend + Backend
  ↓
Frontend usa next_scaffolder → command_runner ejecuta
  ↓
Backend genera APIs → write_files crea endpoints
  ↓
QA valida con command_runner("npm test")
  ↓
Si pasa: vercel_deploy_trigger (con HITL approval)
  ↓
Root Agent reporta: "✅ FinanCars desplegado en https://financars.vercel.app"
```

## 🔒 Seguridad

### Whitelist de Comandos
Solo estos comandos pueden ejecutarse:
- `npm install`, `npm run`, `npm test`
- `npx create-next-app`, `npx expo`, `npx playwright`
- `git status`, `git log`, `git diff`, `git add`, `git commit`
- `ls`, `pwd`, `echo`, `mkdir`, `cat`
- `vercel`, `netlify`

**Bloqueados:** `rm`, `sudo`, `curl` arbitrarios, `dd`, etc.

### Path Traversal Protection
Todas las operaciones de archivos validan que las rutas estén dentro del proyecto.

### Human-in-the-Loop (HITL)
Deploys a producción requieren aprobación explícita vía `request_deploy_approval`.

## 📊 Monitoreo y Logs

Todos los tools y callbacks escriben logs con prefijos:
- `⚡ [CommandRunner]`: Ejecución de comandos
- `⚠️ [Callback]`: Validaciones y advertencias
- `✅ [Success]`: Operaciones exitosas
- `⛔ [BLOCKED]`: Operaciones bloqueadas por seguridad

## 🐛 Troubleshooting

### Error: "ValidationError: Field required"
- **Causa**: Algún YAML tiene campos vacíos o falta `name`/`instruction`.
- **Solución**: Ejecuta el validador:
  ```bash
  source .venv/bin/activate
  python3 -c "import yaml; from pathlib import Path; [print(f) for f in Path('purrpurragent').rglob('*.yaml') if not yaml.safe_load(open(f)).get('name')]"
  ```

### Error: "Module not found: purrpurragent.tools"
- **Causa**: Python no encuentra el módulo tools.
- **Solución**: Asegúrate de que `purrpurragent/__init__.py` existe y que estás ejecutando desde el directorio raíz del proyecto.

### Los cambios en el UI no se guardan
- **Causa**: El builder trabaja con carpeta `tmp/` y solo persiste al hacer clic en ✓.
- **Solución**: Edita los YAML directamente o asegúrate de hacer clic en el botón de "Save" (✓) en el UI.

## 🎓 Próximos Pasos

### Fase Actual: Tools + Callbacks ✅
- [x] Implementar 5 módulos de tools
- [x] Implementar 3 módulos de callbacks
- [x] Conectar tools a agentes principales
- [x] Validar estructura YAML

### Fase Siguiente: Testing
- [ ] Probar flujo end-to-end con "Construye FinanCars"
- [ ] Validar que `command_runner` ejecute npm correctamente
- [ ] Probar `next_scaffolder` + `auth_module_generator`
- [ ] Verificar que callbacks intercepten briefs vagos

### Fase Futura: Expansión
- [ ] Agregar `docker_tools` para containerización
- [ ] Implementar `analytics_tools` para métricas reales
- [ ] Crear `content_templates` para copy automatizado
- [ ] Integrar browser testing automatizado

## 📝 Notas Importantes

1. **El UI es solo para visualizar**: Los cambios reales se hacen en los YAML del directorio `purrpurragent/` (no en `tmp/`).

2. **Los tools no están "decorados" aún**: Para que ADK los reconozca automáticamente, necesitarás registrarlos en el sistema o usar el decorador `@tool` de ADK. Por ahora están como funciones Python estándar que puedes invocar manualmente.

3. **Los callbacks necesitan configuración adicional**: Para que se ejecuten automáticamente, debes agregar la sección `callbacks:` en los YAML (ver ejemplo en el código que te compartí).

4. **Modo de prueba recomendado**: Usa `adk run purrpurragent` en CLI antes de probar en el UI para ver logs más claros.

## 🎉 Estado Actual

Tu sistema está **arquitectónicamente completo**. Tienes:
- ✅ Jerarquía de 48 agentes
- ✅ 10 tools funcionales
- ✅ 8 callbacks de guardrails
- ✅ Template de delegación
- ✅ Validación de estructura

**Listo para testing end-to-end.**

