import { execFile, spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const SCRIPTS_DIR = path.join(__dirname, '..', '..', '..', 'scripts');

export type ScanErrorCode =
  | 'NOT_FOUND'
  | 'DEVICE_OFFLINE'
  | 'PAPER_JAM'
  | 'BUSY'
  | 'NO_PAPER'
  | 'UNKNOWN'
  | 'STOPPED'
  | 'READ_ERROR';

export interface ScanError {
  message: string;
  code: ScanErrorCode;
}

export interface ScannerDevice {
  index: number;
  name: string;
}

export interface MultiScanState {
  running: boolean;
  images: string[];
  error: string | null;
  code: ScanErrorCode | null;
}

const errorMessages: Record<ScanErrorCode, string> = {
  NOT_FOUND: 'No se encontró el escáner. Verifica que esté conectado.',
  DEVICE_OFFLINE: 'El escáner está desconectado o apagado. Enciéndelo e intenta de nuevo.',
  PAPER_JAM: 'Hay un atasco de papel en el escáner. Revisa el alimentador.',
  BUSY: 'El escáner está ocupado en otra tarea. Espera un momento e intenta de nuevo.',
  NO_PAPER: 'No hay papel en el escáner. Coloca un documento e intenta de nuevo.',
  UNKNOWN: 'Ocurrió un error inesperado al escanear.',
  STOPPED: 'Escaneo detenido por el usuario.',
  READ_ERROR: 'No se pudo leer el archivo escaneado.',
};

function resolveErrorCode(raw: string): ScanErrorCode {
  const cleaned = (raw || '').trim();
  return (cleaned in errorMessages ? cleaned : 'UNKNOWN') as ScanErrorCode;
}

// ---------- Seguimiento compartido del proceso PowerShell en curso (escaneo simple O multipágina) ----------
// Solo un escaneo (simple o multipágina) puede estar corriendo a la vez en esta app, así que
// una única referencia basta para poder detenerlo en cualquier momento vía stopMultiScan()/"/scan/stop".
let currentProcess: ChildProcess | null = null;
let stopRequested = false;

// ---------- Listado de escáneres ----------

export function listScanners(): Promise<ScannerDevice[]> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(SCRIPTS_DIR, 'list-scanners.ps1');

    execFile(
      'powershell.exe',
      ['-ExecutionPolicy', 'Bypass', '-File', scriptPath],
      (error, stdout, stderr) => {
        if (error) {
          if (stderr && stderr.trim()) {
            console.error('[listScanners] Detalle del error (stderr):', stderr.trim());
          }
          return reject(new Error('No se pudo listar escáneres'));
        }
        try {
          const devices = JSON.parse(stdout || '[]');
          resolve(Array.isArray(devices) ? devices : [devices]);
        } catch {
          resolve([]);
        }
      }
    );
  });
}

// ---------- Escaneo de una sola página (también se puede detener en el camino) ----------

export function scanDocument(scannerIndex: number | string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const tempPath = path.join(os.tmpdir(), `scan-${Date.now()}.jpg`);
    const scriptPath = path.join(SCRIPTS_DIR, 'scan.ps1');

    stopRequested = false;

    currentProcess = execFile(
      'powershell.exe',
      [
        '-ExecutionPolicy', 'Bypass',
        '-File', scriptPath,
        '-outputPath', tempPath,
        '-scannerIndex', String(scannerIndex),
        '-mode', 'single',
      ],
      (error, stdout, stderr) => {
        currentProcess = null;

        // El usuario hizo clic en "Detener escaneo": cortocircuitamos todo el resto
        // (el kill() del proceso puede generar por sí mismo un "error" aquí, no es un fallo real).
        if (stopRequested) {
          return reject({ message: errorMessages.STOPPED, code: 'STOPPED' } as ScanError);
        }

        // Fix: en Windows, PowerShell termina sus líneas con \r\n.
        // Al hacer split solo con '\n', cada línea conserva un '\r' residual,
        // lo que impedía que errorCode coincidiera con las claves de errorMessages
        // (el código siempre caía en UNKNOWN). Se hace trim() a cada línea.
        const output = (stdout || '').trim();
        const errOutput = (stderr || '').trim();

        if (output.includes('ERROR:')) {
          const errorLine = output
            .split('\n')
            .map((l) => l.trim())
            .find((l) => l.includes('ERROR:'))!;
          const errorCode = resolveErrorCode(errorLine.split(':')[1]);

          if (errOutput) {
            console.error(`[scanDocument] Código: ${errorCode} — Detalle (stderr):`, errOutput);
          }

          return reject({ message: errorMessages[errorCode], code: errorCode } as ScanError);
        }

        if (error || !fs.existsSync(tempPath)) {
          if (errOutput) {
            console.error('[scanDocument] Error inesperado — Detalle (stderr):', errOutput);
          }
          return reject({ message: errorMessages.UNKNOWN, code: 'UNKNOWN' } as ScanError);
        }

        fs.readFile(tempPath, (readErr, data) => {
          if (readErr) {
            return reject({ message: errorMessages.READ_ERROR, code: 'READ_ERROR' } as ScanError);
          }
          const dataUrl = `data:image/jpeg;base64,${data.toString('base64')}`;
          fs.unlink(tempPath, () => {});
          resolve([dataUrl]);
        });
      }
    );
  });
}

// ---------- Escaneo multipágina (ADF), con seguimiento en tiempo real + parada posible ----------

let multiScanState: MultiScanState = { running: false, images: [], error: null, code: null };

function resetMultiScanState(): void {
  multiScanState = { running: false, images: [], error: null, code: null };
}

export function startMultiScan(scannerIndex: number | string): void {
  if (multiScanState.running) return; // ya en curso

  resetMultiScanState();
  multiScanState.running = true;
  stopRequested = false;

  const tempBasePath = path.join(os.tmpdir(), `scan-${Date.now()}.jpg`);
  const scriptPath = path.join(SCRIPTS_DIR, 'scan.ps1');

  const proc = spawn('powershell.exe', [
    '-ExecutionPolicy', 'Bypass',
    '-File', scriptPath,
    '-outputPath', tempBasePath,
    '-scannerIndex', String(scannerIndex),
    '-mode', 'multi',
  ]);
  currentProcess = proc;

  let buffer = '';
  let stderrBuffer = '';

  proc.stdout.on('data', (chunk: Buffer) => {
    buffer += chunk.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? ''; // conserva la última línea incompleta para la próxima vez

    lines.forEach((rawLine) => {
      const line = rawLine.trim();
      if (!line) return;

      if (line.startsWith('PAGE:')) {
        const pagePath = line.substring(5);
        try {
          const data = fs.readFileSync(pagePath);
          const dataUrl = `data:image/jpeg;base64,${data.toString('base64')}`;
          multiScanState.images.push(dataUrl);
          fs.unlink(pagePath, () => {});
        } catch {
          // página ilegible, se ignora
        }
      } else if (line === 'DONE') {
        multiScanState.running = false;
      } else if (line.startsWith('ERROR:')) {
        const errorCode = resolveErrorCode(line.split(':')[1]);
        multiScanState.error = errorMessages[errorCode];
        multiScanState.code = errorCode;
        multiScanState.running = false;

        if (errorCode === 'UNKNOWN' && stderrBuffer.trim()) {
          console.error('[startMultiScan] Detalle del error (stderr):', stderrBuffer.trim());
        }
      }
    });
  });

  proc.stderr.on('data', (chunk: Buffer) => {
    stderrBuffer += chunk.toString();
  });

  proc.on('close', (closeCode) => {
    if (stderrBuffer.trim()) {
      console.error(`[startMultiScan] stderr acumulado (proceso cerrado, code=${closeCode}):`, stderrBuffer.trim());
    }
    multiScanState.running = false;
    currentProcess = null;
  });

  proc.on('error', (err) => {
    console.error('[startMultiScan] Error al lanzar el proceso PowerShell:', err.message);
    multiScanState.error = errorMessages.UNKNOWN;
    multiScanState.code = 'UNKNOWN';
    multiScanState.running = false;
    currentProcess = null;
  });
}

// Detiene el escaneo en curso, ya sea un escaneo simple (scanDocument) o multipágina (startMultiScan).
export function stopMultiScan(): void {
  stopRequested = true;

  if (currentProcess) {
    try {
      currentProcess.kill();
    } catch {
      // el proceso ya había terminado
    }
    currentProcess = null;
  }

  if (multiScanState.running) {
    multiScanState.error = errorMessages.STOPPED;
    multiScanState.code = 'STOPPED';
  }
  multiScanState.running = false;
}

export function getMultiScanState(): MultiScanState {
  return multiScanState;
}