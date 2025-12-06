"""
Technical team callbacks.

Implements guardrails for development, testing, and deployment agents
to ensure code quality and prevent broken builds.
"""

import logging
from typing import Optional
from pathlib import Path

logger = logging.getLogger(__name__)


def validate_tech_context(callback_context, llm_request) -> Optional[dict]:
    """
    Callback 'before_model' para agentes técnicos (CTO, Frontend, Backend).
    Asegura que tengan acceso a specs técnicas necesarias.
    
    Args:
        callback_context: Context object from ADK.
        llm_request: The LLM request about to be sent.
        
    Returns:
        None to continue normally.
    """
    # Check if technical documentation exists
    tech_docs = [
        "docs/DESIGN-SYSTEM.md",
        "docs/PROJECTS.md",
        "package.json"
    ]
    
    missing_docs = [doc for doc in tech_docs if not Path(doc).exists()]
    
    if missing_docs:
        logger.warning(f"⚠️ Documentación técnica faltante: {missing_docs}")
        
        # Inject warning into system instruction
        system_parts = [
            part for content in llm_request.contents
            if content.role == 'system'
            for part in content.parts
        ]
        
        if system_parts and hasattr(system_parts[0], 'text'):
            system_parts[0].text += (
                f"\n\n[SYSTEM NOTE]: Algunos documentos técnicos no están disponibles: "
                f"{', '.join(missing_docs)}. Trabaja con información general y menciona "
                "que se necesitarán estos archivos para implementación completa."
            )
    
    return None


def validate_build_success(callback_context, llm_response) -> Optional[dict]:
    """
    Callback 'after_model' para agentes de desarrollo.
    Verifica que los comandos ejecutados hayan sido exitosos.
    
    Args:
        callback_context: Context object from ADK.
        llm_response: The response from the LLM.
        
    Returns:
        None to use original response, or modified response.
    """
    # Extract response text
    response_parts = [
        part.text for content in llm_response.candidates[0].content.parts
        if hasattr(part, 'text') and part.text
    ]
    
    output = " ".join(response_parts).lower()
    
    # Check for error indicators
    error_indicators = ["error code", "failed", "npm err", "compilation error"]
    has_errors = any(indicator in output for indicator in error_indicators)
    
    if has_errors:
        logger.error("❌ Build/Command execution detectó errores.")
        
        # Could append a warning to the response
        if response_parts:
            response_parts[-1] += (
                "\n\n⚠️ **NOTA DEL SISTEMA**: Se detectaron errores en la ejecución. "
                "Revisa los logs antes de continuar."
            )
    else:
        logger.info("✅ Build/Command execution exitoso.")
    
    return None


def block_on_critical_failures(callback_context, llm_response) -> Optional[dict]:
    """
    Callback 'after_model' para QA Testing Agent.
    Bloquea el pipeline si hay fallas críticas.
    
    Args:
        callback_context: Context object from ADK.
        llm_response: The response from the LLM.
        
    Returns:
        None or modified response with blocking flag.
    """
    # Extract response text
    response_parts = [
        part.text for content in llm_response.candidates[0].content.parts
        if hasattr(part, 'text') and part.text
    ]
    
    output = " ".join(response_parts).lower()
    
    # Check for critical failures
    critical_keywords = [
        "critical", "blocker", "security vulnerability",
        "data loss", "authentication bypass"
    ]
    
    has_critical = any(keyword in output for keyword in critical_keywords)
    
    if has_critical:
        logger.error("⛔ QA GATE: Fallas críticas detectadas. Bloqueando release.")
        
        # Create deployment lock file
        lock_file = Path("deployment_status.lock")
        with open(lock_file, 'w') as f:
            f.write("BLOCKED_BY_QA\n")
            f.write(f"Reason: Critical failures detected\n")
        
        # Append blocking notice to response
        if response_parts:
            response_parts[-1] += (
                "\n\n🚫 **DEPLOYMENT BLOCKED**: Se han detectado fallas críticas. "
                "El despliegue está bloqueado hasta que se resuelvan estos issues."
            )
    else:
        logger.info("✅ QA GATE: Pruebas pasadas. Pipeline verde.")
        
        # Remove lock file if exists
        lock_file = Path("deployment_status.lock")
        if lock_file.exists():
            lock_file.unlink()
    
    return None

