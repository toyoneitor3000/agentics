# 🤖 Chat con Agentes PURPUR

Interfaz de chat para interactuar con los agentes de PURPUR.

## 🚀 Cómo usar

### Opción 1: Abrir directamente (Recomendado)
```bash
# Desde la carpeta Agentics
open chat-interfaz/index.html
```

### Opción 2: Con servidor local
```bash
# Ve a la carpeta
cd chat-interfaz

# Inicia un servidor simple
python3 -m http.server 8080

# Abre en tu navegador
# http://localhost:8080
```

## ⚙️ Requisitos

**IMPORTANTE:** El servidor de agentes debe estar corriendo en `http://localhost:7001`

Para iniciar el servidor:
```bash
# Desde la carpeta Agentics
cd "/Users/camilotoloza/Library/CloudStorage/GoogleDrive-camilotoloza1136@gmail.com/My Drive/PURPUR/Agentics"

# Activa el entorno virtual
source venv/bin/activate

# Inicia el servidor
python agents/api.py
```

## 📋 Características

✅ Interfaz tipo WhatsApp moderna y limpia
✅ Mensajes con animaciones suaves
✅ Indicador de "pensando..." mientras el agente procesa
✅ Soporte para Enter para enviar mensajes
✅ Manejo de errores con mensajes claros
✅ Scroll automático a nuevos mensajes
✅ Preparado para adjuntar archivos (próximamente)

## 🎨 Personalización

El archivo `index.html` es completamente autocontenido (HTML + CSS + JavaScript).
Puedes modificar:

- **Colores:** Busca `#075e54` (verde principal) y `#dcf8c6` (verde claro)
- **Tamaño:** Modifica `max-width: 600px` y `height: 80vh`
- **Endpoint API:** Cambia `http://localhost:7001/generate` en el JavaScript

## 🔧 Solución de problemas

### Error: "Error al conectar con el agente"
- Verifica que el servidor esté corriendo en puerto 7001
- Ejecuta: `curl http://localhost:7001/health` para verificar

### El chat no se ve bien
- Asegúrate de usar un navegador moderno (Chrome, Firefox, Safari)
- Limpia la caché del navegador

### Los mensajes no se envían
- Abre la consola del navegador (F12) para ver errores
- Verifica que no haya bloqueadores de CORS

## 📝 Ejemplo de uso

1. Abre el chat
2. Escribe: "Crea un botón azul"
3. El agente responderá con el código HTML/CSS
4. Puedes copiar y usar el código generado

## 🔗 Endpoints disponibles

- `POST /generate` - Genera código basado en un prompt
- `GET /health` - Verifica el estado del servidor

## 📦 Estructura

```
chat-interfaz/
├── index.html    # Interfaz completa (HTML + CSS + JS)
└── README.md     # Este archivo
```

## 🎯 Próximas mejoras

- [ ] Soporte para subir imágenes
- [ ] Historial de conversaciones
- [ ] Exportar conversación
- [ ] Temas claro/oscuro
- [ ] Markdown rendering
- [ ] Syntax highlighting para código
