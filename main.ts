import { app, BrowserWindow, ipcMain, session, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { createServer } from './src/backend/server';
import { stopMultiScan } from './src/backend/scanService';

const PORT = 8888;
const SCAN_SUBFOLDER_NAME = 'Scan';

let mainWindow: BrowserWindow | null = null;

function getSettingsPath(): string {
  return path.join(app.getPath('userData'), 'settings.json');
}

function readSettings(): Record<string, unknown> {
  try {
    const raw = fs.readFileSync(getSettingsPath(), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeSettings(settings: Record<string, unknown>): void {
  fs.writeFileSync(getSettingsPath(), JSON.stringify(settings, null, 2), 'utf-8');
}

// ---------- Bloqueo de instancia única ----------
const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  // Ya hay otra instancia en ejecución: cerramos esta inmediatamente
  app.quit();
} else {
  app.on('second-instance', () => {
    // Un usuario intentó relanzar la app: devolvemos el foco a la ventana existente
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  function startBackend(): void {
    const server = createServer();

    const httpServer = server.listen(PORT, () => {
      console.log(`Servidor local escuchando en http://localhost:${PORT}`);
    });

    httpServer.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `El puerto ${PORT} ya está en uso. ¿Otra instancia de la app ya está corriendo?`
        );
      } else {
        console.error('Error al iniciar el servidor local:', err.message);
      }
      app.quit();
    });
  }

  function createWindow(): void {
    mainWindow = new BrowserWindow({
      width: 900,
      height: 700,
      webPreferences: {
        // preload.ts se compila junto a main.ts (dist/preload.js), en la misma carpeta que dist/main.js
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    mainWindow.loadFile(path.join(__dirname, '..', 'src', 'frontend', 'index.html'));

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }

  // ---------- IPC: carpeta de destino persistente + subcarpeta fija "Scan" ----------
  // El usuario elige UNA SOLA VEZ la carpeta base (memorizada en disco vía settings.json,
  // por lo que no se vuelve a pedir en el próximo lanzamiento de la app). Se crea dentro
  // una subcarpeta fija llamada "Scan", y TODAS las sesiones de escaneo (sin importar el
  // número de páginas, ni cuándo se hagan) escriben ahí — los nombres de archivo (número
  // de página + fecha/hora de la sesión) permiten distinguir los distintos escaneos dentro
  // de esa carpeta compartida.

  ipcMain.handle('choose-destination-folder', async () => {
    if (!mainWindow) return null;
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory', 'createDirectory'],
      defaultPath: app.getPath('downloads'),
      title: 'Selecciona la carpeta donde guardar los documentos escaneados',
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
  });

  ipcMain.handle('get-saved-destination', () => {
    const settings = readSettings();
    // Si el usuario todavía no eligió ninguna carpeta, usamos silenciosamente
    // Descargas por defecto (sin popup en el primer escaneo) — modificable después
    // mediante el botón "Carpeta de destino".
    return (settings.destinationFolder as string) || app.getPath('downloads');
  });

  ipcMain.handle('save-destination', (_event, folderPath: string) => {
    try {
      const settings = readSettings();
      settings.destinationFolder = folderPath;
      writeSettings(settings);
      return { success: true };
    } catch (err) {
      console.error('[save-destination] Error al guardar la preferencia:', err);
      return { success: false };
    }
  });

  ipcMain.handle(
    'save-pdfs',
    async (_event, destinationFolder: string, files: { filename: string; data: ArrayBuffer }[]) => {
      try {
        const targetDir = path.join(destinationFolder, SCAN_SUBFOLDER_NAME);
        fs.mkdirSync(targetDir, { recursive: true });

        for (const file of files) {
          const fullPath = path.join(targetDir, file.filename);
          fs.writeFileSync(fullPath, Buffer.from(file.data));
        }
        return { success: true, savedPath: targetDir };
      } catch (err) {
        console.error('[save-pdfs] Error al guardar los archivos:', err);
        return { success: false };
      }
    }
  );

  app.whenReady().then(() => {
    // Autoriza explícitamente el acceso a cámara/micrófono (necesario para la función
    // "Usar cámara"). Sin este handler, Electron puede rechazar getUserMedia() de forma
    // silenciosa en algunas configuraciones.
    session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
      callback(permission === 'media');
    });

    startBackend();
    createWindow();
  });

  // ---------- Limpieza antes de cerrar ----------
  app.on('before-quit', () => {
    try {
      stopMultiScan();
    } catch {
      // no hay escaneo en curso, o ya se detuvo
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}