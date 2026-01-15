# Speedlight Culture: Hoja de ruta para App Móvil (Estrategia Costo Eficiente)

Este documento detalla la estrategia evolutiva para llevar Speedlight Culture a móviles, priorizando el bajo costo inicial y la experiencia de usuario inmediata.

## Fase 1: PWA (Priority Zero - Implementado) ✅
**Objetivo:** Tener una App instalable en el móvil sin pagar licencias de tiendas ni esperar aprobaciones.
**Costo:** $0.
**Estado:** En progreso / Implementado.

**Características:**
- **Instalable:** Los usuarios pueden "Instalar" la web en su inicio (iOS/Android).
- **Fullscreen:** Se elimina la barra de navegación del navegador para una experiencia nativa.
- **Acceso Directo:** Icono propio en el escritorio del móvil.
- **Prompt Inteligente:** Banner automático que invita a instalar si detecta que no es la App.

**Acciones Realizadas:**
- [x] Configuración de `manifest.json` y metadatos de Apple.
- [x] Creación del componente `InstallPrompt` para guiar al usuario.
- [x] Activación de modo `standalone` en iOS.

## Fase 2: Aplicación Híbrida (Capacitor) - Futuro
**Objetivo:** Publicar en App Store y Google Play cuando haya presupuesto.
**Costo:** ~$99/año (Apple) + $25 (Google).

**Pasos Técnicos (Para cuando estemos listos):**
1. Instalar Capacitor:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
   npx cap init "Speedlight Culture" com.speedlight.culture
   ```
2. Generar proyectos nativos:
   ```bash
   npx cap add ios
   npx cap add android
   ```
3. Sincronizar cambios:
   ```bash
   npm run build
   npx cap sync
   ```

## Fase 3: Funcionalidades Nativas (Push & Camera)
**Objetivo:** Aprovechar el hardware del dispositivo.
- **Notificaciones Push:** Avisar de nuevos eventos o likes.
- **Cámara Nativa:** Subida directa de Reels comprimiendo en el dispositivo.

---

**Recomendación Actual:**
Mantenernos en la **Fase 1**. Es la forma más rápida de estar "a un click" del usuario sin invertir dinero. La experiencia es casi indistinguible de una app nativa para el uso diario (ver contenido, navegar).
