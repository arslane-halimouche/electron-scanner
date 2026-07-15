# Electron Scanner

Aplicación de escritorio (Electron) para escanear, importar y fotografiar documentos, con recorte automático, corrección de perspectiva, filtros tipo "escáner profesional" y exportación a PDF/ZIP/imágenes.

## Funcionalidades

- **Escaneo físico** (WIA vía PowerShell): modo cama plana (single) y modo ADF (multipágina, hasta 200 páginas), con detección de errores (atasco, sin papel, escáner desconectado, ocupado...).
- **Cámara tipo CamScanner**: detección automática de bordes del documento, recorte manual con 4 esquinas arrastrables, corrección de perspectiva (homografía), y 3 filtros (blanco y negro, escala de grises, color).
- **Importación de archivos**: imágenes y PDF.
- **Edición de páginas**: reordenar (drag & drop), eliminar, fusionar varias páginas en una, deshacer (undo).
- **Exportación**: PDF único, ZIP con un PDF por página, o ZIP/imagen con las páginas en JPEG/PNG.
- **Guardado automático**: cada página escaneada se guarda automáticamente en PDF en una carpeta de destino elegida por el usuario (subcarpeta fija `Scan`).

## Arquitectura

```
scanner-electron/
├── scripts/              # Scripts PowerShell (control del escáner vía WIA)
│   ├── list-scanners.ps1
│   └── scan.ps1
├── src/
│   ├── backend/           # Servidor Express local (puerto 8888)
│   │   ├── openapiSpec.ts # Documentación Swagger de la API
│   │   ├── scanService.ts # Lógica de escaneo (llama a los scripts PowerShell)
│   │   └── server.ts      # Rutas HTTP
│   └── frontend/          # Interfaz de usuario (TypeScript vanilla)
│       ├── app.ts
│       ├── index.html
│       └── style.css
├── main.ts                 # Proceso principal de Electron
├── preload.ts               # Puente seguro entre Electron y el frontend
├── package.json
└── tsconfig.json
```

- **Backend**: servidor Express local en `http://localhost:8888`, expone una API documentada en Swagger (`/api-docs`) que controla el escáner físico mediante scripts PowerShell (WIA).
- **Frontend**: interfaz vanilla TypeScript, sin framework, que consume la API local y gestiona la cámara, el recorte, los filtros y la exportación directamente en el navegador (Chromium embebido en Electron).
- **Electron**: gestiona la ventana, el diálogo de selección de carpeta y el guardado de archivos en disco (vía IPC).

## Requisitos

- Node.js (v18 o superior recomendado)
- Windows (los scripts de escaneo usan WIA vía PowerShell, específico de Windows)
- Un escáner compatible con WIA (para la función de escaneo físico; la cámara y la importación funcionan sin escáner)

## Instalación

```powershell
git clone https://github.com/arslane-halimouche/electron-scanner.git
cd electron-scanner
npm install
```

## Desarrollo

Compilar TypeScript y lanzar la app:

```powershell
npm run build
npm start
```

(Ajusta estos comandos según los scripts definidos en `package.json` si difieren.)

## Documentación de la API

Con la app en marcha, la documentación interactiva Swagger está disponible en:

```
http://localhost:8888/api-docs
```

## Notas

- El endpoint `/convert` y el botón "Enviar a KnowledgeHub" son actualmente **placeholders** (no conectados a una integración real todavía).
- El límite de páginas por sesión es de 200, con un aviso no bloqueante al llegar al 80%.
