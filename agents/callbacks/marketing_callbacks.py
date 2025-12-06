"""
Marketing and creative team callbacks.

Validates that brand assets and design specifications are available
before creative agents start producing content.
"""

import logging
from typing import Optional
from pathlib import Path

logger = logging.getLogger(__name__)


def validate_brand_assets(callback_context, llm_request) -> Optional[dict]:
    """
    Callback 'before_model' para agentes creativos.
    Verifica que los assets de marca estén disponibles.
    
    Args:
        callback_context: Context object from ADK.
        llm_request: The LLM request about to be sent.
        
    Returns:
        None to continue normally.
    """
    # Check for essential brand assets
    required_assets = [
        "docs/BRAND.md",
        "docs/DESIGN-SYSTEM.md"
    ]
    
    missing_assets = [asset for asset in required_assets if not Path(asset).exists()]
    
    if missing_assets:
        logger.warning(f"⚠️ Assets de marca faltantes: {missing_assets}")
        
        # Inject warning into system instruction
        system_parts = [
            part for content in llm_request.contents
            if content.role == 'system'
            for part in content.parts
        ]
        
        if system_parts and hasattr(system_parts[0], 'text'):
            system_parts[0].text += (
                f"\n\n[SYSTEM NOTE]: Algunos assets de marca no están disponibles: "
                f"{', '.join(missing_assets)}. Trabaja con lineamientos generales y "
                "menciona que se necesitarán estos archivos para producción final."
            )
    else:
        logger.info("✅ Assets de marca disponibles.")
    
    return None


def ensure_triptico_specs(callback_context, llm_request) -> Optional[dict]:
    """
    Callback específico para social_triptico_agent.
    Valida que se tengan las especificaciones del formato Tríptico.
    
    Args:
        callback_context: Context object from ADK.
        llm_request: The LLM request about to be sent.
        
    Returns:
        None to continue normally.
    """
    # Triptico specifications
    triptico_specs = {
        "total_width": 3240,
        "total_height": 1080,
        "panel_width": 1080,
        "panel_height": 1080,
        "panels": 3,
        "order": "izquierda -> centro -> derecha"
    }
    
    logger.info("📐 Validando specs de Tríptico Instagram...")
    
    # Inject specs into system instruction for reference
    system_parts = [
        part for content in llm_request.contents
        if content.role == 'system'
        for part in content.parts
    ]
    
    if system_parts and hasattr(system_parts[0], 'text'):
        system_parts[0].text += (
            f"\n\n[TRIPTICO SPECS REMINDER]: "
            f"Canvas total: {triptico_specs['total_width']}x{triptico_specs['total_height']}px. "
            f"División: {triptico_specs['panels']} paneles de {triptico_specs['panel_width']}x{triptico_specs['panel_height']}px. "
            f"Orden: {triptico_specs['order']}. "
            "Asegura continuidad visual entre paneles y posición correcta del logo."
        )
    
    logger.info("✅ Specs de Tríptico inyectadas en el contexto.")
    
    return None


def validate_content_tone(callback_context, llm_response) -> Optional[dict]:
    """
    Callback 'after_model' para copywriter y social media agents.
    Valida que el tono de voz sea consistente con la marca Purpur.
    
    Args:
        callback_context: Context object from ADK.
        llm_response: The response from the LLM.
        
    Returns:
        None or modified response.
    """
    # Extract response text
    response_parts = [
        part.text for content in llm_response.candidates[0].content.parts
        if hasattr(part, 'text') and part.text
    ]
    
    output = " ".join(response_parts).lower()
    
    # Check for brand voice consistency
    # Purpur should be: professional, empathetic, strategic, visionary
    negative_indicators = [
        "spam", "clickbait", "urgente!!!", "compra ya",
        "oferta limitada", "último día"
    ]
    
    has_negative_tone = any(indicator in output for indicator in negative_indicators)
    
    if has_negative_tone:
        logger.warning("⚠️ Tono de voz detectado no alineado con marca Purpur.")
        
        # Append tone correction notice
        if response_parts:
            response_parts[-1] += (
                "\n\n⚠️ **NOTA DE REVISIÓN**: El contenido generado puede contener "
                "elementos de tono no alineados con la voz de marca Purpur. "
                "Revisa y ajusta para mantener un tono profesional y estratégico."
            )
    else:
        logger.info("✅ Tono de voz consistente con marca.")
    
    return None

