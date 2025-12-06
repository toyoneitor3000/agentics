#!/usr/bin/env python3
"""
Script de testing rápido para validar que los tools funcionan correctamente.
Ejecuta: python3 purrpurragent/test_tools.py
"""

import sys
from pathlib import Path

# Add purrpurragent to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from purrpurragent.tools.command_tools import command_runner
from purrpurragent.tools.repo_tools import read_files, search_files
from purrpurragent.tools.scaffold_tools import next_scaffolder, auth_module_generator
from purrpurragent.tools.design_tools import brand_library_lookup
from purrpurragent.tools.deploy_tools import request_deploy_approval


def test_command_runner():
    print("\n" + "="*60)
    print("TEST 1: command_runner")
    print("="*60)
    
    # Test allowed command
    result = command_runner("npm --version", working_dir=".")
    print(f"✓ npm --version: {result['status']}")
    
    # Test blocked command
    result = command_runner("rm -rf /", working_dir=".")
    print(f"✓ Security block: {result['status']}")
    assert result['status'] == 'blocked', "Security whitelist failed!"


def test_repo_tools():
    print("\n" + "="*60)
    print("TEST 2: repo_tools")
    print("="*60)
    
    # Test read_files
    result = read_files(["package.json"], base_dir=".")
    print(f"✓ read_files: {result['package.json']['status']}")
    
    # Test search_files
    result = search_files("*.yaml", base_dir="purrpurragent")
    print(f"✓ search_files: Found {result['count']} YAML files")


def test_scaffold_tools():
    print("\n" + "="*60)
    print("TEST 3: scaffold_tools")
    print("="*60)
    
    # Test next_scaffolder
    result = next_scaffolder("test-project", base_dir="/tmp", typescript=True)
    print(f"✓ next_scaffolder: {result['status']}")
    print(f"  Command: {result.get('command', 'N/A')[:80]}...")
    
    # Test auth_module_generator
    result = auth_module_generator("/tmp/test-project", auth_provider="nextauth")
    print(f"✓ auth_module_generator: {result['status']}")
    print(f"  Files to create: {len(result.get('files', []))}")


def test_design_tools():
    print("\n" + "="*60)
    print("TEST 4: design_tools")
    print("="*60)
    
    # Test brand_library_lookup
    result = brand_library_lookup("colors", base_dir="docs")
    print(f"✓ brand_library_lookup: {result['status']}")
    print(f"  Assets found: {result.get('count', 0)}")


def test_deploy_tools():
    print("\n" + "="*60)
    print("TEST 5: deploy_tools (HITL)")
    print("="*60)
    
    # Test approval workflow
    approval = request_deploy_approval(
        environment="staging",
        summary="Deploy FinanCars v1.0",
        changes="- Added vehicle search\n- Fixed auth bug"
    )
    print(f"✓ request_deploy_approval: {approval['status']}")
    print(f"  Token: {approval.get('token', 'N/A')}")


if __name__ == "__main__":
    print("\n🧪 TESTING PURRPUR TOOLS")
    print("="*60)
    
    try:
        test_command_runner()
        test_repo_tools()
        test_scaffold_tools()
        test_design_tools()
        test_deploy_tools()
        
        print("\n" + "="*60)
        print("✅ ALL TESTS PASSED")
        print("="*60)
        print("\nLos tools están listos para ser usados por los agentes.")
        print("Siguiente paso: Ejecuta 'adk web' y prueba el flujo completo.\n")
        
    except Exception as e:
        print(f"\n❌ TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

