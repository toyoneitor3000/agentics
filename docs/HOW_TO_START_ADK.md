# 🚀 Cómo Iniciar ADK Correctamente

## ⚠️ Problema Común

Si al ejecutar `adk web` ves una lista de carpetas (callbacks, playbooks, subagents, tools, workers, workspace), significa que estás ejecutando ADK desde **dentro** de `purrpurragent/`.

ADK necesita ejecutarse desde el **directorio padre** apuntando a `purrpurragent/`.

---

## ✅ Solución: Usar el Script

### **Opción 1: Desde cualquier lugar (Recomendado)**

```bash
cd /path/to/purrpurragent
./start_purrpur.sh
```

El script detecta automáticamente dónde estás y ejecuta ADK correctamente.

---

### **Opción 2: Manual desde directorio padre**

```bash
# 1. Ve al directorio padre
cd "/Users/camilotoloza/Library/CloudStorage/GoogleDrive-camilotoloza1136@gmail.com/My Drive/PURPUR/purpur-landing-page"

# 2. Activa el entorno virtual
source .venv/bin/activate

# 3. Ejecuta ADK apuntando a purrpurragent/
adk web purrpurragent/
```

---

### **Opción 3: Manual desde dentro de purrpurragent/**

```bash
# 1. Estás en purrpurragent/
cd /path/to/purrpurragent

# 2. Sube un nivel
cd ..

# 3. Activa el entorno virtual
source .venv/bin/activate

# 4. Ejecuta ADK
adk web purrpurragent/
```

---

## 📊 Estructura Correcta

```
purpur-landing-page/              ← Ejecuta ADK desde AQUÍ
├── .venv/
├── purrpurragent/                ← Apunta a ESTE directorio
│   ├── root_agent.yaml          ← ADK carga ESTE archivo
│   ├── workers/
│   ├── subagents/
│   └── ...
└── ...
```

**Comando correcto:**
```bash
adk web purrpurragent/
```

---

## ❌ Qué NO Hacer

### **Error 1: Ejecutar desde dentro de purrpurragent/**
```bash
cd purrpurragent/
adk web              # ❌ INCORRECTO - Lista carpetas internas
```

### **Error 2: Ejecutar sin especificar directorio**
```bash
cd purpur-landing-page/
adk web              # ❌ INCORRECTO - No sabe qué agente cargar
```

---

## ✅ Qué SÍ Hacer

### **Correcto: Desde directorio padre**
```bash
cd purpur-landing-page/
adk web purrpurragent/    # ✅ CORRECTO
```

### **Correcto: Usar el script**
```bash
cd purrpurragent/
./start_purrpur.sh        # ✅ CORRECTO (se auto-corrige)
```

---

## 🔍 Cómo Saber que Funcionó

Cuando ADK inicia correctamente, verás:

```
+-----------------------------------------------------------------------------+
| ADK Web Server started                                                      |
|                                                                             |
| For local testing, access at http://127.0.0.1:8000.                         |
+-----------------------------------------------------------------------------+
```

Y en el navegador (http://127.0.0.1:8000):
- ✅ Verás **"purrpurragent"** como agente disponible
- ✅ Al hacer clic, carga directamente el chat
- ✅ **NO** verás lista de carpetas (callbacks, workers, etc.)

---

## 🐛 Troubleshooting

### Problema: "Lista de carpetas aparece"
**Causa:** Ejecutando desde dentro de `purrpurragent/`  
**Solución:** Ejecuta desde el directorio padre

### Problema: "No root_agent found"
**Causa:** ADK no encuentra `root_agent.yaml`  
**Solución:** Verifica que el archivo exista:
```bash
ls purrpurragent/root_agent.yaml
```

### Problema: "Command not found: adk"
**Causa:** Entorno virtual no activado  
**Solución:** 
```bash
source .venv/bin/activate
```

---

## 📝 Comando Final (Copia y Pega)

Desde el **directorio principal del proyecto**:

```bash
cd "/Users/camilotoloza/Library/CloudStorage/GoogleDrive-camilotoloza1136@gmail.com/My Drive/PURPUR/purpur-landing-page" && source .venv/bin/activate && adk web purrpurragent/
```

O simplemente:

```bash
cd purrpurragent && ./start_purrpur.sh
```

---

## 🎯 Resumen

| Desde dónde ejecutas | Comando |
|---------------------|---------|
| `purpur-landing-page/` | `adk web purrpurragent/` ✅ |
| `purrpurragent/` | `./start_purrpur.sh` ✅ |
| `purrpurragent/` | `adk web` ❌ (lista carpetas) |

---

**¡Usa el script `start_purrpur.sh` y todo funcionará automáticamente!** 🚀
