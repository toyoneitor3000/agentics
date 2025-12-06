"""
Callbacks module for Purrpur Agent System.

Implements guardrails and validation logic that runs before/after
agent model calls to ensure quality, safety, and proper workflow.
"""

from .orchestrator_callbacks import (
    validate_user_brief,
    log_delegation_summary,
    ensure_delegation_template
)

from .tech_callbacks import (
    validate_tech_context,
    validate_build_success,
    block_on_critical_failures
)

from .marketing_callbacks import (
    validate_brand_assets,
    ensure_triptico_specs
)

__all__ = [
    'validate_user_brief',
    'log_delegation_summary',
    'ensure_delegation_template',
    'validate_tech_context',
    'validate_build_success',
    'block_on_critical_failures',
    'validate_brand_assets',
    'ensure_triptico_specs',
]

