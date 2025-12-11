# Speedlight Culture: Implementación PWA y Notificaciones (Guía Técnica)

Esta guía detalla cómo se transformó Speedlight Culture en una PWA (Progressive Web App) completamente funcional con capacidades de instalación nativa y suporte para notificaciones push en iOS y Android.

## 1. Arquitectura PWA Implementada

Hemos integrado `next-pwa` para generar automáticamente los Service Workers necesarios y `react-onesignal` para notificaciones push.

### Componentes Clave:
1.  **Service Worker (`sw.js`):** Generado por `next-pwa`. Hemos configurado en `next.config.ts` para que importe automáticamente la lógica de OneSignal.
2.  **Service Worker Proxy (`public/OneSignalSDKWorker.js`):** Archivo puente que carga el motor oficial de OneSignal desde su CDN.
3.  **Inicializador (`app/components/pwa/OneSignalInit.tsx`):** Componente cliente que arranca OneSignal al abrir la web y vincula al usuario.
4.  **Install Prompt (`InstallPrompt.tsx`):** UI inteligente que enseña a los usuarios cómo instalar la app (especialmente útil en iOS).

## 2. Configuración Requerida (OneSignal)

Para activar el envío de mensajes, debes configurar tu cuenta de OneSignal:

1.  Crear cuenta en [onesignal.com](https://onesignal.com).
2.  Crear una nueva "App" seleccionando **Web Push**.
3.  Obtener el **App ID**.
4.  Añadir el ID a tu archivo `.env.local`:
    ```env
    NEXT_PUBLIC_ONESIGNAL_APP_ID=tu-id-aqui
    ```

## 3. Experiencia del Usuario

### Instalación (Paso Crítico)
Las notificaciones en iOS **SOLO** funcionan si la App está instalada en el inicio (Standalone Mode).
1.  **iOS:** Banner guía al usuario -> Compartir -> Agregar a Inicio.
2.  **Android:** Botón directo de instalación.

### Recepción de Notificaciones
Una vez instalada:
- La app pedirá permiso para notificar (prompt nativo del sistema).
- **Offline:** La app abre instantáneamente gracias al cacheo de `next-pwa`.
- **Background:** OneSignal escuchará mensajes incluso con la app cerrada.

## 4. Pruebas

1.  Ejecuta `npm run dev` (o despliega a Vercel/Producción).
2.  Abre desde tu móvil.
3.  Instala la App.
4.  Acepta permisos.
5.  Desde el panel de OneSignal, envía un mensaje de prueba ("Test Message"). Debería llegar a tu móvil como una notificación nativa.
