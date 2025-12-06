"""
Orchestrator callbacks for root agent.

Implements validation and logging for the main orchestration layer,
ensuring proper delegation and brief completeness.
"""

import logging
from typing import Optional
from pathlib import Path

logger = logging.getLogger(__name__)


def validate_user_brief(callback_context, llm_request) -> Optional[dict]:
    """
    Callback 'before_model' para el Root Agent.
    Analiza si el input del usuario tiene suficiente contexto.
    
    Args:
        callback_context: Context object from ADK.
        llm_request: The LLM request about to be sent.
        
    Returns:
        None to continue normally, or a response dict to skip the model call.
    """
    # Extract user message from request
    user_messages = [
        part.text for content in llm_request.contents
        if content.role == 'user'
        for part in content.parts
        if hasattr(part, 'text') and part.text
    ]
    
    if not user_messages:
        return None
    
    user_text = " ".join(user_messages).lower()
    
    # Check for minimum context
    required_keywords = [
        "crear", "construir", "diseñar", "desarrollar", "web", "app",
        "landing", "página", "plataforma", "sistema"
    ]
    
    has_context = any(word in user_text for word in required_keywords)
    is_too_short = len(user_text.strip()) < 15
    
    if is_too_short and not has_context:
        logger.warning("⚠️ Brief de usuario demasiado corto o vago.")
        
        # Inject system instruction to ask for more details
        system_parts = [
            part for content in llm_request.contents
            if content.role == 'system'
            for part in content.parts
        ]
        
        # if system_parts and hasattr(system_parts[0], 'text'):
        #     system_parts[0].text += (
        #         "\n\n[SYSTEM INTERVENTION]: El usuario ha proporcionado un brief muy vago. "
        #         "NO intentes delegar tareas todavía. Responde amablemente pidiendo más "
        #         "detalles sobre: 1) Qué tipo de proyecto quiere, 2) Objetivo del negocio, "
        #         "3) Audiencia objetivo, 4) Restricciones técnicas o de tiempo."
        #     )
    
    return None  # Continue with model call


def log_delegation_summary(callback_context, llm_response) -> Optional[dict]:
    """
    Callback 'after_model' para el Root Agent.
    Registra qué decidió hacer el orquestador.
    
    Args:
        callback_context: Context object from ADK.
        llm_response: The response from the LLM.
        
    Returns:
        None to use the original response, or modified response dict.
    """
    # Extract response text
    response_parts = [
        part.text for content in llm_response.candidates[0].content.parts
        if hasattr(part, 'text') and part.text
    ]
    
    output = " ".join(response_parts)
    
    # Log delegation decisions
    logger.info(f"🤖 [RootAgent Finalizó]: Respuesta de {len(output)} caracteres.")
    
    # Detect which agents were mentioned
    agent_keywords = [
        "cto", "frontend", "backend", "mobile", "qa", "design",
        "cmo", "marketing", "seo", "traffic", "social", "copy", "gráfico"
    ]
    
    mentioned_agents = [kw for kw in agent_keywords if kw in output.lower()]
    
    if mentioned_agents:
        logger.info(f"📋 Agentes mencionados en delegación: {', '.join(mentioned_agents)}")
    
    return None  # Use original response


def ensure_delegation_template(callback_context, llm_request) -> Optional[dict]:
    """
    Callback 'before_model' que asegura que el template de delegación esté disponible.
    
    Args:
        callback_context: Context object from ADK.
        llm_request: The LLM request about to be sent.
        
    Returns:
        None to continue normally.
    """
    # Check if delegation template exists
    template_path = Path("purrpurragent/playbooks/delegation_template.md")
    
    if not template_path.exists():
        logger.warning("⚠️ Delegation template no encontrado. Creando referencia...")
        
        # Could inject a reminder into the system instruction
        system_parts = [
            part for content in llm_request.contents
            if content.role == 'system'
            for part in content.parts
        ]
        
        if system_parts and hasattr(system_parts[0], 'text'):
            system_parts[0].text += (
                "\n\n[SYSTEM NOTE]: El template de delegación no está disponible. "
                "Usa el formato estándar: Contexto, Objetivo, Restricciones, Entregables, KPIs."
            )
    else:
        logger.debug("✅ Delegation template disponible.")
    
    return None

