#!/bin/bash

# 🚀 Script de inicio para Purrpur Agent System v2.0
# Última actualización: 2025-11-22

echo "🎨 =========================================="
echo "   PURRPUR AGENT SYSTEM v2.0"
echo "   Estructura Organizacional Mejorada"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorio actual
AGENT_DIR="$(pwd)"

echo -e "${BLUE}📂 Directorio de trabajo:${NC}"
echo "   $AGENT_DIR"
echo ""

# Verificar estructura
echo -e "${BLUE}🔍 Verificando estructura...${NC}"

if [ -d "agents" ]; then
    echo -e "   ${GREEN}✅${NC} agents/ (Root Agent)"
else
    echo -e "   ${YELLOW}⚠️${NC}  agents/ no encontrado"
fi

if [ -d "workers" ]; then
    echo -e "   ${GREEN}✅${NC} workers/ (13 agentes principales)"
    echo -e "      ${GREEN}✅${NC} workers/tech/ (6 agentes)"
    echo -e "      ${GREEN}✅${NC} workers/marketing/ (3 agentes)"
    echo -e "      ${GREEN}✅${NC} workers/content/ (4 agentes)"
else
    echo -e "   ${YELLOW}⚠️${NC}  workers/ no encontrado"
fi

if [ -d "subagents" ]; then
    echo -e "   ${GREEN}✅${NC} subagents/ (36 sub-agentes)"
else
    echo -e "   ${YELLOW}⚠️${NC}  subagents/ no encontrado"
fi

if [ -d "tools" ]; then
    echo -e "   ${GREEN}✅${NC} tools/ (10 módulos)"
else
    echo -e "   ${YELLOW}⚠️${NC}  tools/ no encontrado"
fi

echo ""
echo -e "${BLUE}🔧 Activando entorno virtual...${NC}"

# Detectar si estamos en purrpurragent/ o en el directorio padre
if [ -f ".venv/bin/activate" ]; then
    # Estamos en el directorio padre
    source .venv/bin/activate
    AGENT_DIR="purrpurragent"
    echo -e "   ${GREEN}✅${NC} Entorno virtual activado (desde directorio padre)"
elif [ -f "../.venv/bin/activate" ]; then
    # Estamos en purrpurragent/
    source ../.venv/bin/activate
    cd ..
    AGENT_DIR="purrpurragent"
    echo -e "   ${GREEN}✅${NC} Entorno virtual activado (desde purrpurragent/)"
else
    echo -e "   ${YELLOW}⚠️${NC}  No se encontró entorno virtual"
    exit 1
fi

echo ""
echo -e "${BLUE}🚀 Iniciando ADK Web Server...${NC}"
echo -e "   ${YELLOW}Comando:${NC} adk web $AGENT_DIR/"
echo -e "   ${GREEN}URL:${NC} http://127.0.0.1:8000"
echo ""

# Iniciar ADK
adk web $AGENT_DIR/

# Si ADK falla, mostrar mensaje de ayuda
if [ $? -ne 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Error iniciando ADK${NC}"
    echo ""
    echo "Posibles soluciones:"
    echo "1. Verifica que ADK esté instalado: pip install google-adk"
    echo "2. Verifica las rutas en agents/root_agent.yaml"
    echo "3. Revisa los logs arriba para más detalles"
    echo ""
fi
