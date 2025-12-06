#!/usr/bin/env python3
"""
Script de verificación de herramientas del agente Purrpur.
Ejecuta: python3 purrpurragent/verify_tools.py
"""

import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

def check_tool_imports():
    """Verifica que todas las herramientas puedan importarse."""
    print("🔍 Verificando importación de herramientas...\n")
    
    tools_to_check = {
        'command_tools': ['command_runner'],
        'deploy_tools': ['request_deploy_approval', 'vercel_deploy_trigger', 'infra_preview'],
        'repo_tools': ['read_files', 'write_files', 'search_files'],
        'scaffold_tools': ['next_scaffolder', 'auth_module_generator'],
        'design_tools': ['design_tokens_sync', 'brand_library_lookup'],
        'image_generation_tools': ['generate_image', 'edit_image'],
        'video_generation_tools': ['generate_video', 'image_to_video'],
        'audio_generation_tools': ['text_to_speech', 'generate_music', 'generate_sound_effects'],
        'web_tools': ['scrape_url_tool', 'youtube_transcript_tool'],
        'system_tools': ['system_stats_tool'],
        'utility_tools': ['sleep_tool'],
        'search_tools': ['google_search'],
    }
    
    results = {}
    for module_name, tool_names in tools_to_check.items():
        try:
            module = __import__(f'purrpurragent.tools.{module_name}', fromlist=tool_names)
            for tool_name in tool_names:
                if hasattr(module, tool_name):
                    results[f'{module_name}.{tool_name}'] = '✅'
                else:
                    results[f'{module_name}.{tool_name}'] = '❌ NO ENCONTRADO'
        except ImportError as e:
            for tool_name in tool_names:
                results[f'{module_name}.{tool_name}'] = f'❌ ERROR: {str(e)}'
    
    # Print results
    for tool_path, status in results.items():
        print(f"  {status} {tool_path}")
    
    failed = [k for k, v in results.items() if '❌' in v]
    if failed:
        print(f"\n⚠️  {len(failed)} herramienta(s) con problemas:")
        for tool in failed:
            print(f"   - {tool}")
        return False
    else:
        print(f"\n✅ Todas las {len(results)} herramientas están disponibles")
        return True


def check_agent_config():
    """Verifica que el root_agent.yaml tenga todas las herramientas registradas."""
    print("\n🔍 Verificando configuración del agente...\n")
    
    import yaml
    
    config_path = Path(__file__).parent / 'root_agent.yaml'
    if not config_path.exists():
        print("❌ root_agent.yaml no encontrado")
        return False
    
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    
    tools = config.get('tools', [])
    print(f"📋 Herramientas registradas en root_agent.yaml: {len(tools)}\n")
    
    for tool in tools:
        tool_name = tool.get('name', tool) if isinstance(tool, dict) else tool
        print(f"  ✅ {tool_name}")
    
    return True


def check_dependencies():
    """Verifica que las dependencias principales estén instaladas."""
    print("\n🔍 Verificando dependencias Python...\n")
    
    dependencies = {
        'google.adk': 'Google ADK',
        'google.cloud.aiplatform': 'Vertex AI',
        'google.cloud.texttospeech': 'Cloud TTS',
        'yaml': 'PyYAML',
    }
    
    results = {}
    for module_name, display_name in dependencies.items():
        try:
            __import__(module_name)
            results[display_name] = '✅'
        except ImportError:
            results[display_name] = '❌ NO INSTALADO'
    
    for name, status in results.items():
        print(f"  {status} {name}")
    
    failed = [k for k, v in results.items() if '❌' in v]
    if failed:
        print(f"\n⚠️  Dependencias faltantes: {', '.join(failed)}")
        print("   Instala con: pip install google-adk google-cloud-aiplatform google-cloud-texttospeech pyyaml")
        return False
    else:
        print("\n✅ Todas las dependencias están instaladas")
        return True


def main():
    print("=" * 60)
    print("  VERIFICACIÓN DE HERRAMIENTAS - PURRPUR AGENT")
    print("=" * 60)
    
    # Verificar que estamos en el entorno virtual
    import sys
    venv_path = '.venv'
    if not (hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix)):
        print("\n⚠️  ADVERTENCIA: No parece que estés en un entorno virtual.")
        print("   Ejecuta: source .venv/bin/activate")
        print("   Luego vuelve a ejecutar este script.\n")
        # Continuar de todas formas, pero advertir
    
    checks = [
        ("Importación de herramientas", check_tool_imports),
        ("Configuración del agente", check_agent_config),
        ("Dependencias Python", check_dependencies),
    ]
    
    results = []
    for name, check_func in checks:
        print(f"\n{'='*60}")
        print(f"  {name.upper()}")
        print('='*60)
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print(f"\n❌ Error en verificación: {e}")
            import traceback
            traceback.print_exc()
            results.append((name, False))
    
    # Summary
    print("\n" + "=" * 60)
    print("  RESUMEN")
    print("=" * 60)
    
    all_passed = True
    for name, result in results:
        status = "✅ PASÓ" if result else "❌ FALLÓ"
        print(f"  {status}: {name}")
        if not result:
            all_passed = False
    
    print("\n" + "=" * 60)
    if all_passed:
        print("✅ TODAS LAS VERIFICACIONES PASARON")
        print("   El agente está listo para producción")
    else:
        print("⚠️  ALGUNAS VERIFICACIONES FALLARON")
        print("   Revisa los errores arriba antes de desplegar")
    print("=" * 60 + "\n")
    
    return 0 if all_passed else 1


if __name__ == '__main__':
    sys.exit(main())

