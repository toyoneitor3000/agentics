# Integración de Callbacks en ADK

## ⚠️ Nota Importante sobre Callbacks

Los callbacks están **implementados como funciones Python** en `purrpurragent/callbacks/`, pero **ADK desde YAML no soporta callbacks directamente** en la versión actual.

Los callbacks funcionan cuando creas agentes **desde código Python**, no desde YAML config.

## 🔄 Dos Formas de Usar el Sistema

### Opción A: Solo YAML (Actual)
**Ventajas:**
- Fácil de editar y visualizar en el UI
- No requiere código Python
- Ideal para iterar rápido

**Limitaciones:**
- No puedes usar callbacks automáticos
- Los tools deben ser invocados explícitamente por el agente

### Opción B: Python + YAML (Avanzado)
**Ventajas:**
- Callbacks automáticos (guardrails)
- Control total sobre el flujo
- Mejor para producción

**Requiere:**
- Crear un archivo `agent.py` que cargue los YAML y adjunte callbacks

## 🛠️ Cómo Habilitar Callbacks (Opción B)

Si quieres que los callbacks se ejecuten automáticamente, necesitas crear un wrapper en Python:

### 1. Crea `purrpurragent/agent.py`

```python
"""
Main agent loader with callbacks integration.
"""

from google.adk.agents import LlmAgent
from google.adk.agents.config_agent_utils import from_config
from pathlib import Path

# Import callbacks
from .callbacks.orchestrator_callbacks import (
    validate_user_brief,
    log_delegation_summary,
    ensure_delegation_template
)
from .callbacks.tech_callbacks import (
    validate_tech_context,
    validate_build_success,
    block_on_critical_failures
)
from .callbacks.marketing_callbacks import (
    validate_brand_assets,
    ensure_triptico_specs
)

# Load root agent from YAML
config_path = Path(__file__).parent / "root_agent.yaml"
root_agent = from_config(str(config_path))

# Attach callbacks to root agent
root_agent.before_model_callback = [
    validate_user_brief,
    ensure_delegation_template
]
root_agent.after_model_callback = log_delegation_summary

# Find and attach callbacks to specific sub-agents
for sub_agent in root_agent.sub_agents:
    agent_name = sub_agent.name
    
    # Tech agents get tech callbacks
    if any(tech in agent_name for tech in ['cto', 'frontend', 'backend', 'mobile']):
        sub_agent.before_model_callback = validate_tech_context
        sub_agent.after_model_callback = validate_build_success
    
    # QA agent gets blocking callback
    if 'qa_testing' in agent_name:
        sub_agent.after_model_callback = block_on_critical_failures
    
    # Creative agents get brand validation
    if any(creative in agent_name for creative in ['social', 'copy', 'graphic', 'ui_ux']):
        sub_agent.before_model_callback = validate_brand_assets
    
    # Social triptico gets specific validation
    if 'social_media' in agent_name:
        # Find triptico sub-agent
        for sub_sub in getattr(sub_agent, 'sub_agents', []):
            if 'triptico' in sub_sub.name:
                sub_sub.before_model_callback = ensure_triptico_specs

# Export for ADK
__all__ = ['root_agent']
```

### 2. Modifica cómo inicias el servidor

En lugar de:
```bash
adk web
```

Usa:
```bash
adk web --reload_agents
```

Esto hará que ADK cargue el `agent.py` en lugar del YAML directo.

## 🎯 Callbacks Disponibles

### Orchestrator (Root Agent)

| Callback | Cuándo | Qué hace |
|----------|--------|----------|
| `validate_user_brief` | before_model | Detecta briefs vagos, inyecta instrucción para pedir más detalles |
| `log_delegation_summary` | after_model | Registra qué agentes fueron mencionados en la delegación |
| `ensure_delegation_template` | before_model | Verifica que el template de delegación exista |

### Tech Callbacks

| Callback | Cuándo | Qué hace |
|----------|--------|----------|
| `validate_tech_context` | before_model | Verifica que existan docs técnicos (DESIGN-SYSTEM.md, etc.) |
| `validate_build_success` | after_model | Detecta errores en output de compilación |
| `block_on_critical_failures` | after_model | Crea archivo `deployment_status.lock` si hay fallas críticas |

### Marketing Callbacks

| Callback | Cuándo | Qué hace |
|----------|--------|----------|
| `validate_brand_assets` | before_model | Verifica que existan BRAND.md y assets |
| `ensure_triptico_specs` | before_model | Inyecta especificaciones del formato Instagram |
| `validate_content_tone` | after_model | Detecta tono no alineado con marca Purpur |

## 🔍 Cómo Funcionan los Callbacks

### Before Model Callback
Se ejecuta **antes** de que el LLM reciba el prompt. Puede:
- Modificar el `system_instruction`
- Agregar contexto adicional
- Bloquear la llamada si falta información crítica

**Ejemplo:**
```python
def validate_user_brief(callback_context, llm_request):
    # Analiza el input del usuario
    user_text = extract_user_message(llm_request)
    
    if len(user_text) < 15:
        # Inyecta instrucción para pedir más detalles
        inject_system_note(llm_request, "Pide más contexto al usuario")
    
    return None  # Continue with model call
```

### After Model Callback
Se ejecuta **después** de que el LLM responde. Puede:
- Analizar la respuesta
- Agregar advertencias o notas
- Crear archivos de estado (locks)
- Modificar la respuesta antes de enviarla al usuario

**Ejemplo:**
```python
def block_on_critical_failures(callback_context, llm_response):
    output = extract_response_text(llm_response)
    
    if "critical error" in output:
        # Crea archivo de bloqueo
        Path("deployment_status.lock").write_text("BLOCKED")
        
        # Agrega advertencia a la respuesta
        append_to_response(llm_response, "🚫 DEPLOYMENT BLOCKED")
    
    return None  # Use modified response
```

## 🚀 Recomendación

**Para empezar:** Usa el sistema actual (solo YAML). Los agentes son lo suficientemente inteligentes para auto-validarse mediante sus instrucciones.

**Para producción:** Implementa la Opción B (Python + callbacks) cuando necesites:
- Guardrails automáticos estrictos
- Integración con sistemas externos (Slack, monitoring)
- Auditoría completa de operaciones
- Bloqueos automáticos de seguridad

## 📝 Estado Actual

✅ **Callbacks implementados** (código Python listo)  
⏸️ **Integración automática** (requiere wrapper Python)  
✅ **Validación manual** (funciona vía instrucciones en YAML)

Los callbacks están listos para cuando decidas migrar a la arquitectura Python híbrida.

