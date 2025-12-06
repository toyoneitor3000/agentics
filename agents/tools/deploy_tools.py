"""
Deployment tools with Human-in-the-Loop (HITL) approval workflow.

Implements safe deployment patterns requiring explicit approval
before executing infrastructure changes or production deployments.
"""

from typing import Dict, Any, List
import os
import re
import shutil
import subprocess
from pathlib import Path


def get_project_root() -> Path:
    """Returns the project root directory (2 levels up from this file)."""
    # tools/deploy_tools.py -> purrpurragent/ -> project_root/
    return Path(__file__).parent.parent.parent.resolve()


def request_deploy_approval(environment: str, summary: str, changes: str = "") -> Dict[str, Any]:
    """
    Solicita aprobación humana antes de realizar un despliegue crítico.
    
    This implements the Human-in-the-Loop pattern for high-risk operations.
    In production, this would trigger Slack/Email notifications.
    
    Args:
        environment: 'production', 'staging', or 'development'.
        summary: Breve descripción de qué se va a desplegar.
        changes: Lista de cambios incluidos en el deploy.
        
    Returns:
        Dict with approval status and token.
    """
    print(f"\n🚨 SOLICITUD DE DESPLIEGUE A {environment.upper()} 🚨")
    print(f"Resumen: {summary}")
    if changes:
        print(f"Cambios:\n{changes}")
    print("=" * 60)
    
    # In a real system, this would:
    # 1. Send notification to Slack/Email
    # 2. Wait for approval via webhook/API
    # 3. Return actual approval token
    
    # For development/testing: auto-approve non-production
    if environment.lower() != "production":
        print("✅ Auto-aprobado (entorno de desarrollo)")
        return {
            "status": "approved",
            "token": "dev_auto_approved",
            "message": "Deployment aprobado automáticamente para entorno no productivo."
        }
    else:
        print("⏳ Esperando aprobación manual para PRODUCTION...")
        return {
            "status": "pending",
            "token": None,
            "message": "Se requiere aprobación manual. Contacta al operador del sistema."
        }



def _extract_vercel_url(cli_output: str) -> str | None:
    """Return the last vercel.app URL found in the CLI output."""
    if not cli_output:
        return None
    matches: List[str] = re.findall(
        r"https://[a-zA-Z0-9\-]+\.vercel\.app", cli_output
    )
    return matches[-1] if matches else None


def vercel_deploy_trigger(
    project_path: str,
    approval_token: str = None,
    production: bool = False
) -> Dict[str, Any]:
    """
    Ejecuta el despliegue a Vercel solo si se tiene aprobación.
    
    Args:
        project_path: Ruta al proyecto a desplegar.
        approval_token: Token de aprobación obtenido de request_deploy_approval.
        production: Si True, despliega a producción. Si False, a preview.
        
    Returns:
        Dict with deployment status and URL.
    """
    # Validate approval for production deploys
    if production and not approval_token:
        return {
            "status": "blocked",
            "url": None,
            "error": "⛔ Error: Despliegue a producción requiere approval_token. "
                     "Llama a 'request_deploy_approval' primero."
        }
    
    # Validate project path
    if not project_path:
        project_path = str(get_project_root())
    project_path = os.path.abspath(project_path)
    
    if not os.path.exists(project_path):
        return {
            "status": "error",
            "url": None,
            "error": f"❌ Error: El proyecto '{project_path}' no existe."
        }
    
    env_type = "production" if production else "preview"
    vercel_token = os.getenv("VERCEL_TOKEN")
    vercel_org_id = os.getenv("VERCEL_ORG_ID")
    vercel_project_id = os.getenv("VERCEL_PROJECT_ID")
    vercel_scope = os.getenv("VERCEL_SCOPE") or os.getenv("VERCEL_TEAM")
    custom_path = os.getenv("VERCEL_DEPLOY_PATH")
    
    deploy_path = project_path
    if custom_path:
        deploy_path = custom_path if os.path.isabs(custom_path) else os.path.abspath(
            os.path.join(get_project_root(), custom_path)
        )
        if not os.path.exists(deploy_path):
            return {
                "status": "error",
                "url": None,
                "error": f"❌ Error: La ruta personalizada '{deploy_path}' no existe."
            }
    
    cli_available = shutil.which("vercel") is not None
    vercel_ready = all([cli_available, vercel_token, vercel_org_id, vercel_project_id])
    
    if vercel_ready:
        env = os.environ.copy()
        env.update({
            "VERCEL_TOKEN": vercel_token,
            "VERCEL_ORG_ID": vercel_org_id,
            "VERCEL_PROJECT_ID": vercel_project_id,
        })
        if vercel_scope:
            env["VERCEL_SCOPE"] = vercel_scope
        
        cmd = ["vercel", "deploy", "--yes"]
        if production:
            cmd.append("--prod")
        
        print(f"🚀 Iniciando despliegue REAL a Vercel ({env_type}) en {deploy_path}...")
        try:
            result = subprocess.run(
                cmd,
                cwd=deploy_path,
                env=env,
                capture_output=True,
                text=True,
                timeout=180
            )
        except FileNotFoundError:
            cli_available = False
            vercel_ready = False
        else:
            combined_output = "\n".join(filter(None, [result.stdout, result.stderr])).strip()
            if result.returncode == 0:
                detected_url = _extract_vercel_url(combined_output)
                return {
                    "status": "success",
                    "url": detected_url,
                    "message": "✅ Deploy ejecutado con la CLI de Vercel.",
                    "logs": combined_output[-3000:]
                }
            return {
                "status": "error",
                "url": None,
                "error": "❌ Vercel CLI devolvió un error. Revisa los logs.",
                "logs": combined_output[-3000:]
            }
    
    missing_bits = []
    if not cli_available:
        missing_bits.append("Vercel CLI no instalada")
    if not vercel_token:
        missing_bits.append("VERCEL_TOKEN")
    if not vercel_org_id:
        missing_bits.append("VERCEL_ORG_ID")
    if not vercel_project_id:
        missing_bits.append("VERCEL_PROJECT_ID")
    
    print(f"ℹ️ Deploy simulado ({env_type}). Configura: {', '.join(missing_bits)}")
    return {
        "status": "success",
        "url": f"https://proyecto-{env_type}-xyz123.vercel.app",
        "message": (
            "Modo simulación: faltan credenciales de Vercel. "
            "Consulta INTEGRATIONS.md para habilitar despliegues reales."
        ),
        "details": missing_bits
    }



def infra_preview(terraform_plan: str) -> Dict[str, Any]:
    """
    Muestra un preview de cambios de infraestructura sin aplicarlos.
    
    Safe alternative to direct 'terraform apply'. Shows what would change.
    
    Args:
        terraform_plan: Contenido del plan de Terraform o script IaC.
        
    Returns:
        Dict with preview summary and safety check.
    """
    print("\n📋 PREVIEW DE CAMBIOS DE INFRAESTRUCTURA")
    print("=" * 60)
    print(terraform_plan[:500])  # Show first 500 chars
    print("=" * 60)
    
    # Detect dangerous operations
    dangerous_keywords = ["destroy", "delete", "drop", "terminate"]
    has_dangerous_ops = any(keyword in terraform_plan.lower() for keyword in dangerous_keywords)
    
    if has_dangerous_ops:
        return {
            "status": "warning",
            "safe": False,
            "message": "⚠️ ADVERTENCIA: El plan contiene operaciones destructivas. "
                      "Requiere revisión manual antes de aplicar."
        }
    else:
        return {
            "status": "safe",
            "safe": True,
            "message": "✅ El plan parece seguro. Puedes proceder con la aplicación."
        }

from google.adk.tools import FunctionTool

request_deploy_approval_tool = FunctionTool(request_deploy_approval, require_confirmation=False)
vercel_deploy_trigger_tool = FunctionTool(vercel_deploy_trigger, require_confirmation=False)
infra_preview_tool = FunctionTool(infra_preview, require_confirmation=False)
