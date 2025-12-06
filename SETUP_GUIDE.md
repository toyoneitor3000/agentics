# 🚀 Agentics Router/Auditor - Setup Guide

## 📋 Sistema Actualizado

Este sistema usa **Groq (Llama 3.3 70B)** y **Anthropic (Claude Sonnet)** para generación de código con validación automática.

---

## ⚡ Opción 1: Ejecutar Localmente (RECOMENDADO)

### 1. Instalar dependencias

```bash
cd agents
pip install fastapi uvicorn groq anthropic python-dotenv httpx pillow
```

### 2. Configurar API Keys

Edita el archivo `.env` en la raíz del proyecto:

```env
GROQ_API_KEY=tu_groq_api_key_aqui
ANTHROPIC_API_KEY=tu_anthropic_api_key_aqui
```

### 3. Ejecutar el servidor

```bash
# Desde el directorio /agents/
python3 -m uvicorn api:app --reload --port 7001
```

### 4. Probar el API

```bash
# Health check
curl http://localhost:7001/

# Generar código
curl -X POST http://localhost:7001/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a React button component with TypeScript"}'

# Ver documentación interactiva
open http://localhost:7001/docs
```

---

## 🐳 Opción 2: Docker (Requiere Fix)

### Problema actual:
El contenedor no puede importar el módulo `api` correctamente.

### Solución temporal:
Ejecutar localmente (Opción 1) mientras se resuelve el issue de Docker.

### Para intentar con Docker:

```bash
# Rebuild completo
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Ver logs
docker-compose logs agent-builder
```

---

## 📊 Arquitectura del Sistema

```
Cliente
  ↓
FastAPI Server (puerto 7001)
  ↓
Router (selecciona modelo)
  ↓
┌─────────────┴──────────────┐
↓                            ↓
Groq Llama 3.3 70B      Claude Sonnet 3.5
(texto rápido)          (visión + texto largo)
↓                            ↓
└─────────────┬──────────────┘
              ↓
          Auditor
              ↓
      Respuesta validada
```

---

## 🎯 Endpoints Disponibles

### GET `/`
Health check del sistema

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "models_available": ["llama-groq", "claude-sonnet"]
}
```

### POST `/generate`
Genera código desde un prompt

**Request:**
```json
{
  "prompt": "Create a React component",
  "image_base64": "optional_base64_image"
}
```

**Response:**
```json
{
  "code": "// Generated code here",
  "model_used": "llama-groq",
  "audit_result": {
    "passed": true,
    "score": 95,
    "issues": []
  }
}
```

### POST `/generate/upload`
Genera código con upload de imagen

**Form Data:**
- `prompt`: string
- `image`: file (optional)

### POST `/audit`
Audita código existente

**Request:**
```json
{
  "code": "const Button = () => <button>Click</button>"
}
```

---

## 🔧 Troubleshooting

### Error: "No module named 'uvicorn'"
```bash
pip install uvicorn fastapi
```

### Error: "No module named 'groq'"
```bash
pip install groq anthropic
```

### Error: "GROQ_API_KEY not found"
Verifica que el archivo `.env` esté en la raíz del proyecto y contenga las keys correctas.

### Docker no inicia
```bash
# Ver logs detallados
docker-compose logs agent-builder --tail 50

# Rebuild sin cache
docker-compose build --no-cache agent-builder
```

---

## 📝 Próximos Pasos

1. ✅ **Ejecutar localmente** - Más rápido para desarrollo
2. 🎨 **Crear Dashboard Streamlit** - Visualizar el flujo
3. 🔗 **Integrar con Purrpur** - Sistema de 50 agentes
4. 🐳 **Fix Docker** - Resolver import issue

---

## 🆘 Soporte

Si encuentras problemas:

1. Verifica que las API keys estén configuradas
2. Asegúrate de tener Python 3.11+
3. Instala todas las dependencias
4. Ejecuta desde el directorio correcto (`/agents/`)

---

**Última actualización:** 2025-12-03
**Versión:** 2.0.0 (Sin Together API)
