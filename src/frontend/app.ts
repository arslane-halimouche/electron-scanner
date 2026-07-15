// jsPDF (UMD)
interface JsPdfInstance {
  internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
  addPage: () => void;
  addImage: (imageData: string, format: string, x: number, y: number, width: number, height: number) => void;
  save: (filename: string) => void;
  output: (type: 'arraybuffer') => ArrayBuffer;
}
interface JsPdfConstructorOptions { unit?: string; format?: string; }

// JSZip (UMD)
interface JSZipInstance {
  file: (name: string, data: ArrayBuffer) => void;
  generateAsync: (options: { type: string }) => Promise<Blob>;
}

interface Window {
  jspdf: { jsPDF: new (options?: JsPdfConstructorOptions) => JsPdfInstance };
  JSZip: new () => JSZipInstance;
  electronAPI: {
    chooseDestinationFolder: () => Promise<string | null>;
    getSavedDestination: () => Promise<string | null>;
    saveDestination: (folderPath: string) => Promise<{ success: boolean }>;
    savePdfsToFolder: (
      destinationFolder: string,
      files: { filename: string; data: ArrayBuffer }[]
    ) => Promise<{ success: boolean; savedPath?: string }>;
  };
}

interface ScannerDevice {
  index: number;
  name: string;
  port?: string;
}

interface MultiScanState {
  running: boolean;
  images: string[];
  error: string | null;
  code: string | null;
}

interface SingleScanResponse {
  status?: string;
  images?: string[];
  error?: string;
  code?: string;
}

// Documentos PDF importados, pendientes de envío a KnowledgeHub (aún no conectado)
interface PendingDoc {
  filename: string;
  dataUrl: string;
}

interface HistorySnapshot {
  pages: string[];
  pendingDocs: PendingDoc[];
  label: string;
}

// DOM
const homeActions       = document.getElementById('homeActions')       as HTMLDivElement;
const homeScanBtn       = document.getElementById('homeScanBtn')       as HTMLButtonElement;
const homeCameraBtn     = document.getElementById('homeCameraBtn')     as HTMLButtonElement;
const homeImportBtn     = document.getElementById('homeImportBtn')     as HTMLButtonElement;

const deviceActions     = document.getElementById('deviceActions')     as HTMLDivElement;
const refreshDevicesBtn = document.getElementById('refreshDevicesBtn') as HTMLButtonElement;
const backHomeBtn       = document.getElementById('backHomeBtn')       as HTMLButtonElement;

const importFileInput   = document.getElementById('importFileInput')   as HTMLInputElement;
const importMoreFileInput = document.getElementById('importMoreFileInput') as HTMLInputElement;

const devicesDiv         = document.getElementById('devices')            as HTMLDivElement;
const resultDiv          = document.getElementById('result')             as HTMLDivElement;
const pagesDiv           = document.getElementById('pages')              as HTMLDivElement;
const dragHint           = document.getElementById('dragHint')           as HTMLParagraphElement;
const actionsDiv         = document.getElementById('actions')            as HTMLDivElement;
const downloadPdfBtn     = document.getElementById('downloadPdfBtn')     as HTMLButtonElement;
const clearBtn           = document.getElementById('clearBtn')           as HTMLButtonElement;
const settingsBtn        = document.getElementById('settingsBtn')        as HTMLButtonElement;
const scanMoreBtn        = document.getElementById('scanMoreBtn')        as HTMLButtonElement;
const importMoreBtn      = document.getElementById('importMoreBtn')      as HTMLButtonElement;
const cameraMoreBtn      = document.getElementById('cameraMoreBtn')      as HTMLButtonElement;
const scanModeChoice     = document.getElementById('scanModeChoice')     as HTMLDivElement;
const modeSingleBtn      = document.getElementById('modeSingleBtn')      as HTMLButtonElement;
const modeMultiBtn       = document.getElementById('modeMultiBtn')       as HTMLButtonElement;
const stopScanBtn        = document.getElementById('stopScanBtn')        as HTMLButtonElement;
const mergeSelectBtn     = document.getElementById('mergeSelectBtn')     as HTMLButtonElement;
const mergeBar           = document.getElementById('mergeBar')           as HTMLDivElement;
const mergeCount         = document.getElementById('mergeCount')         as HTMLSpanElement;
const mergeConfirmBtn    = document.getElementById('mergeConfirmBtn')    as HTMLButtonElement;
const mergeCancelBtn     = document.getElementById('mergeCancelBtn')     as HTMLButtonElement;
const undoBtn            = document.getElementById('undoBtn')            as HTMLButtonElement;
const exportModal        = document.getElementById('exportModal')        as HTMLDivElement;
const exportOverlay      = document.getElementById('exportOverlay')      as HTMLDivElement;
const exportPdfSingleBtn = document.getElementById('exportPdfSingleBtn') as HTMLButtonElement;
const exportZipBtn       = document.getElementById('exportZipBtn')       as HTMLButtonElement;
const exportImagesBtn    = document.getElementById('exportImagesBtn')    as HTMLButtonElement;
const exportCancelBtn    = document.getElementById('exportCancelBtn')    as HTMLButtonElement;

const sendKnowledgeHubBtn = document.getElementById('sendKnowledgeHubBtn') as HTMLButtonElement;
const pendingDocsDiv      = document.getElementById('pendingDocs')        as HTMLDivElement;

// Cámara (estilo CamScanner)
const cameraOverlay       = document.getElementById('cameraOverlay')       as HTMLDivElement;
const cameraModal         = document.getElementById('cameraModal')         as HTMLDivElement;
const cameraLiveView      = document.getElementById('cameraLiveView')      as HTMLDivElement;
const cameraVideo         = document.getElementById('cameraVideo')         as HTMLVideoElement;
const capturePhotoBtn     = document.getElementById('capturePhotoBtn')     as HTMLButtonElement;
const cameraCancelBtn     = document.getElementById('cameraCancelBtn')     as HTMLButtonElement;
const cameraCropView      = document.getElementById('cameraCropView')      as HTMLDivElement;
const cameraDetectingHint = document.getElementById('cameraDetectingHint') as HTMLDivElement;
const cameraCropContainer = document.getElementById('cameraCropContainer') as HTMLDivElement;
const capturedPhotoImg    = document.getElementById('capturedPhotoImg')    as HTMLImageElement;
const cropOverlaySvg      = document.getElementById('cropOverlaySvg')      as unknown as SVGSVGElement;
const cropHandleTL        = document.getElementById('cropHandleTL')        as HTMLDivElement;
const cropHandleTR        = document.getElementById('cropHandleTR')        as HTMLDivElement;
const cropHandleBR        = document.getElementById('cropHandleBR')        as HTMLDivElement;
const cropHandleBL        = document.getElementById('cropHandleBL')        as HTMLDivElement;
const confirmCropBtn      = document.getElementById('confirmCropBtn')      as HTMLButtonElement;
const retakePhotoBtn      = document.getElementById('retakePhotoBtn')      as HTMLButtonElement;
const cameraCropCancelBtn = document.getElementById('cameraCropCancelBtn') as HTMLButtonElement;

const cameraFilterView       = document.getElementById('cameraFilterView')       as HTMLDivElement;
const filterPreviewImg       = document.getElementById('filterPreviewImg')       as HTMLImageElement;
const filterBwBtn            = document.getElementById('filterBwBtn')            as HTMLButtonElement;
const filterGrayscaleBtn     = document.getElementById('filterGrayscaleBtn')     as HTMLButtonElement;
const filterColorBtn         = document.getElementById('filterColorBtn')         as HTMLButtonElement;
const confirmFilterBtn       = document.getElementById('confirmFilterBtn')       as HTMLButtonElement;
const backToCropBtn          = document.getElementById('backToCropBtn')          as HTMLButtonElement;
const cameraFilterCancelBtn  = document.getElementById('cameraFilterCancelBtn')  as HTMLButtonElement;

const API_BASE = 'http://localhost:8888';

// Límite de páginas para evitar un consumo excesivo de memoria
// (cada página se guarda en base64 tanto en el backend como en el frontend).
const MAX_PAGES = 200;
const WARNING_THRESHOLD = Math.floor(MAX_PAGES * 0.8); // aviso no bloqueante al 80%
let pageLimitWarningShown = false;

// Añade una advertencia (una sola vez por sesión) al acercarse a MAX_PAGES,
// sin bloquear nunca la acción en curso.
function maybeAppendLimitWarning(baseMsg: string): string {
  if (pages.length >= WARNING_THRESHOLD && pages.length < MAX_PAGES && !pageLimitWarningShown) {
    pageLimitWarningShown = true;
    return `${baseMsg}<br>⚠️ Te estás acercando al límite de ${MAX_PAGES} páginas (${pages.length}/${MAX_PAGES}). Considera exportar o enviar antes de seguir escaneando.`;
  }
  return baseMsg;
}

// ---------- Formato real de una dataURL de imagen ----------
// Las páginas se generan a veces en JPEG (grayscale, color, cámara sin filtro) y a veces
// en PNG (filtro "bw", que usa toDataURL('image/png') para conservar el blanco/negro puro).
// jsPDF necesita el formato EXACTO como segundo argumento de addImage(), y no lo detecta
// solo — pasarle 'JPEG' a una imagen que en realidad es PNG (o al revés) puede generar un
// PDF corrupto o mal renderizado. Estas dos funciones evitan tener 'JPEG' fijo en el código
// en cada sitio donde se genera un PDF o se exporta una imagen.
function getImageFormat(dataUrl: string): 'JPEG' | 'PNG' {
  return dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
}
function getImageExtension(dataUrl: string): 'png' | 'jpg' {
  return dataUrl.startsWith('data:image/png') ? 'png' : 'jpg';
}

// State
let pages: string[] = [];
let pendingDocs: PendingDoc[] = [];
let currentScannerIndex: number | null = null;
let currentMode: 'single' | 'multi' = 'single';
let draggedIndex: number | null = null;
let isScanning = false;
let pollInterval: ReturnType<typeof setInterval> | null = null;
let imagesAddedThisSession = 0;

// Modo fusión
let isMergeMode = false;
let selectedIndexes: number[] = [];

// Guardado automático en disco al terminar cada escaneo.
// - destinationFolderPath: elegido UNA SOLA VEZ por el usuario, memorizado en disco entre
//   los lanzamientos de la app (vía preload/main). NUNCA se reinicia al hacer "Volver"/"Borrar todo".
// - Una subcarpeta fija "Scan" (creada en main.ts) recibe SIEMPRE todos los PDF, sin importar
//   la sesión de escaneo.
// - autoSaveSessionLabel (fecha + hora) identifica una sesión de escaneo en el nombre de archivo,
//   para distinguir varios escaneos que comparten la misma carpeta "Scan".
let destinationFolderPath: string | null = null;
let autoSaveSessionLabel: string | null = null;
let autoSavedPageCount = 0;

// Deshacer
const MAX_HISTORY = 10;
let pagesHistory: HistorySnapshot[] = [];

function saveSnapshot(label: string): void {
  pagesHistory.push({ pages: [...pages], pendingDocs: [...pendingDocs], label });
  if (pagesHistory.length > MAX_HISTORY) pagesHistory.shift();
  updateUndoBtn();
}

function updateUndoBtn(): void {
  undoBtn.disabled = pagesHistory.length === 0;
  undoBtn.title = pagesHistory.length > 0
    ? `Deshacer: ${pagesHistory[pagesHistory.length - 1].label}`
    : 'Nada que deshacer';
}

function doUndo(): void {
  if (pagesHistory.length === 0) return;
  const snapshot = pagesHistory.pop()!;
  pages = [...snapshot.pages];
  pendingDocs = [...snapshot.pendingDocs];
  exitMergeMode();
  renderPages();
  renderPendingDocs();
  updateActionsVisibility();
  setResult('success', `↩️ Deshecho: ${snapshot.label}`);
}

// UI
function setResult(type: string, html: string): void {
  resultDiv.className = `result-${type} show`;
  resultDiv.innerHTML = html;
}
function hideResult(): void {
  resultDiv.className = '';
  resultDiv.innerHTML = '';
}

function showHome(): void {
  homeActions.style.display = 'flex';
  deviceActions.style.display = 'none';
  refreshDevicesBtn.style.display = 'inline-flex';
  backHomeBtn.style.display = 'inline-flex';
  devicesDiv.style.display = 'none';
  scanModeChoice.style.display = 'none';
}

function showDevicesScreen(): void {
  homeActions.style.display = 'none';
  deviceActions.style.display = 'flex';
  refreshDevicesBtn.style.display = 'inline-flex';
  backHomeBtn.style.display = 'inline-flex';
  devicesDiv.style.display = 'flex';
  scanModeChoice.style.display = 'none';
}

function enterImportMode(): void {
  homeActions.style.display = 'none';
  deviceActions.style.display = 'flex';
  refreshDevicesBtn.style.display = 'none';
  backHomeBtn.style.display = 'inline-flex';

  devicesDiv.style.display = 'none';
  scanModeChoice.style.display = 'none';
}

function finishImport(): void {
  homeActions.style.display = 'none';
  deviceActions.style.display = 'flex';
  refreshDevicesBtn.style.display = 'none';
  backHomeBtn.style.display = 'inline-flex';

  devicesDiv.style.display = 'none';
  scanModeChoice.style.display = 'none';
}

// "Volver" = vacía todo y vuelve al inicio (igual que "Borrar todo")
function doClearAll(): void {
  saveSnapshot('Borrar todo');
  pages = [];
  pendingDocs = [];
  currentScannerIndex = null;
  pageLimitWarningShown = false;
  // destinationFolderPath NO se reinicia: es una preferencia persistente,
  // no un estado de sesión. Solo cambia la etiqueta con fecha/hora (nombre de archivo) en la próxima sesión.
  autoSaveSessionLabel = null;
  autoSavedPageCount = 0;
  renderPages();
  renderPendingDocs();
  updateActionsVisibility();
  hideResult();
  showHome();
  devicesDiv.innerHTML = '';
}

function updateActionsVisibility(): void {
  const hasPages = pages.length > 0;
  const hasPendingDocs = pendingDocs.length > 0;
  const hasContent = hasPages || hasPendingDocs;
  const isScanSession = currentScannerIndex !== null;

  actionsDiv.classList.toggle('show', hasContent);
  dragHint.style.display = pages.length > 1 ? 'flex' : 'none';
  mergeSelectBtn.style.display = hasPages && pages.length >= 2 ? 'inline-flex' : 'none';

  // Estos 2 botones solo tienen sentido en sesión de escaneo (no en importación pura)
  downloadPdfBtn.style.display = isScanSession && hasPages ? 'inline-flex' : 'none';
  scanMoreBtn.style.display = isScanSession ? 'inline-flex' : 'none';

  const atLimit = pages.length >= MAX_PAGES;
  if (isScanSession && atLimit && !isScanning) {
    scanMoreBtn.disabled = true;
    scanMoreBtn.title = `Límite de ${MAX_PAGES} páginas alcanzado`;
  } else if (!isScanning) {
    scanMoreBtn.disabled = false;
    scanMoreBtn.title = '';
  }

  // "Importar más" solo tiene sentido en sesión de importación pura, no durante una sesión de escaneo
  importMoreBtn.style.display = !isScanSession && hasContent ? 'inline-flex' : 'none';
  sendKnowledgeHubBtn.style.display = hasContent ? 'inline-flex' : 'none';

  updateUndoBtn();

  if (!hasPages) {
    scanModeChoice.style.display = 'none';
    exitMergeMode();
  }
}

// Ayudantes de importación
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('READ_ERROR'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}
function isImageDataUrl(dataUrl: string): boolean { return dataUrl.startsWith('data:image/'); }
function isPdfDataUrl(dataUrl: string): boolean { return dataUrl.startsWith('data:application/pdf'); }

async function handleImportedFiles(files: File[]): Promise<void> {
  if (files.length === 0) return;

  saveSnapshot(`Importar ${files.length} archivo${files.length !== 1 ? 's' : ''}`);

  let importedImages = 0;
  let importedPdfs = 0;
  let failed = 0;
  let skippedByLimit = 0;

  setResult('loading', `<div class="spinner"></div> Importando ${files.length} archivo(s)...`);

  for (const file of files) {
    try {
      const dataUrl = await readFileAsDataUrl(file);

      if (isImageDataUrl(dataUrl)) {
        if (pages.length >= MAX_PAGES) {
          skippedByLimit++;
          continue;
        }
        pages.push(dataUrl);
        importedImages++;
        continue;
      }

      if (isPdfDataUrl(dataUrl)) {
        // Se guarda el PDF en memoria (frontend), a la espera de un futuro envío a KnowledgeHub.
        // Ninguna llamada al servidor aquí: /convert es solo un placeholder por ahora.
        pendingDocs.push({ filename: file.name, dataUrl });
        importedPdfs++;
        continue;
      }

      failed++;
    } catch {
      failed++;
    }
  }

  renderPages();
  renderPendingDocs();
  updateActionsVisibility();

  let msg = `✅ Importación terminada — ${importedImages} imagen${importedImages !== 1 ? 'es' : ''} añadida${importedImages !== 1 ? 's' : ''} a la vista previa`;
  if (importedPdfs > 0) {
    msg += `, ${importedPdfs} documento${importedPdfs !== 1 ? 's' : ''} PDF guardado${importedPdfs !== 1 ? 's' : ''} (pendiente${importedPdfs !== 1 ? 's' : ''} de envío a KnowledgeHub)`;
  }
  if (failed > 0) msg += `, ${failed} error${failed !== 1 ? 'es' : ''}`;
  if (skippedByLimit > 0) msg += `, ${skippedByLimit} imagen${skippedByLimit !== 1 ? 'es' : ''} no añadida${skippedByLimit !== 1 ? 's' : ''} por límite de ${MAX_PAGES} páginas`;

  setResult('success', maybeAppendLimitWarning(msg));
}

// Renderizar páginas
function renderPages(): void {
  pagesDiv.innerHTML = '';

  pages.forEach((img, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'page-thumb';
    thumb.dataset.index = String(i);

    if (!isMergeMode) thumb.draggable = true;
    if (isMergeMode && selectedIndexes.includes(i)) thumb.classList.add('selected');

    thumb.innerHTML = `
      <span class="page-num">${i + 1}</span>
      <img src="${img}" />
      <button class="remove-btn" data-index="${i}">✕</button>
    `;
    pagesDiv.appendChild(thumb);
  });

  document.querySelectorAll<HTMLButtonElement>('.remove-btn').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      if (isMergeMode) return;
      saveSnapshot(`Eliminar página ${Number(btn.dataset.index) + 1}`);
      pages.splice(Number(btn.dataset.index), 1);
      renderPages();
      updateActionsVisibility();
    };
  });

  document.querySelectorAll<HTMLDivElement>('.page-thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      if (!isMergeMode) return;
      const idx = Number(thumb.dataset.index);
      if (selectedIndexes.includes(idx)) {
        selectedIndexes = selectedIndexes.filter((x) => x !== idx);
        thumb.classList.remove('selected');
      } else {
        selectedIndexes.push(idx);
        thumb.classList.add('selected');
      }
      updateMergeBar();
    });

    if (isMergeMode) return;

    thumb.addEventListener('dragstart', () => {
      draggedIndex = Number(thumb.dataset.index);
      thumb.classList.add('dragging');
    });
    thumb.addEventListener('dragend', () => thumb.classList.remove('dragging'));
    thumb.addEventListener('dragover', (e) => { e.preventDefault(); thumb.classList.add('drag-over'); });
    thumb.addEventListener('dragleave', () => thumb.classList.remove('drag-over'));
    thumb.addEventListener('drop', (e) => {
      e.preventDefault();
      thumb.classList.remove('drag-over');
      const targetIndex = Number(thumb.dataset.index);
      if (draggedIndex === null || draggedIndex === targetIndex) return;
      saveSnapshot(`Mover página ${draggedIndex + 1} → posición ${targetIndex + 1}`);
      const [moved] = pages.splice(draggedIndex, 1);
      pages.splice(targetIndex, 0, moved);
      draggedIndex = null;
      renderPages();
    });
  });
}

// Renderizar documentos PDF pendientes (KnowledgeHub)
function renderPendingDocs(): void {
  if (pendingDocs.length === 0) {
    pendingDocsDiv.style.display = 'none';
    pendingDocsDiv.innerHTML = '';
    return;
  }

  pendingDocsDiv.style.display = 'flex';
  pendingDocsDiv.innerHTML = `
    <span class="pending-doc-label">📎 Documentos PDF pendientes de envío (${pendingDocs.length})</span>
  `;

  pendingDocs.forEach((doc, i) => {
    const chip = document.createElement('div');
    chip.className = 'pending-doc-chip';
    chip.innerHTML = `
      <span class="pending-doc-icon">📄</span>
      <span class="pending-doc-name">${doc.filename}</span>
      <button class="pending-doc-remove" data-index="${i}">✕</button>
    `;
    pendingDocsDiv.appendChild(chip);
  });

  document.querySelectorAll<HTMLButtonElement>('.pending-doc-remove').forEach((btn) => {
    btn.onclick = () => {
      const idx = Number(btn.dataset.index);
      saveSnapshot(`Eliminar documento "${pendingDocs[idx].filename}"`);
      pendingDocs.splice(idx, 1);
      renderPendingDocs();
      updateActionsVisibility();
    };
  });
}

// Fusión
function enterMergeMode(): void {
  isMergeMode = true;
  selectedIndexes = [];
  document.body.classList.add('merge-mode');
  mergeBar.style.display = 'flex';
  updateMergeBar();
  renderPages();
}
function exitMergeMode(): void {
  isMergeMode = false;
  selectedIndexes = [];
  document.body.classList.remove('merge-mode');
  mergeBar.style.display = 'none';
  renderPages();
}
function updateMergeBar(): void {
  const count = selectedIndexes.length;
  mergeCount.textContent = `${count} página${count !== 1 ? 's' : ''} seleccionada${count !== 1 ? 's' : ''}`;
  mergeConfirmBtn.disabled = count < 2;
}
mergeSelectBtn.addEventListener('click', () => enterMergeMode());
mergeCancelBtn.addEventListener('click', () => exitMergeMode());
mergeConfirmBtn.addEventListener('click', () => doMerge());

function doMerge(): void {
  if (selectedIndexes.length < 2) return;

  const sorted = [...selectedIndexes].sort((a, b) => a - b);
  const selectedImages = sorted.map((i) => pages[i]);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const imgElements: HTMLImageElement[] = selectedImages.map((src) => {
    const img = new Image();
    img.src = src;
    return img;
  });

  Promise.all(imgElements.map((img) => new Promise<void>((resolve) => {
    if (img.complete) return resolve();
    img.onload = () => resolve();
  }))).then(() => {
    const maxWidth = Math.max(...imgElements.map((img) => img.naturalWidth));
    const totalHeight = imgElements.reduce((sum, img) => sum + img.naturalHeight, 0);

    canvas.width = maxWidth;
    canvas.height = totalHeight;

    let offsetY = 0;
    imgElements.forEach((img) => {
      const offsetX = Math.floor((maxWidth - img.naturalWidth) / 2);
      ctx.drawImage(img, offsetX, offsetY, img.naturalWidth, img.naturalHeight);
      offsetY += img.naturalHeight;
    });

    const mergedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const insertAt = sorted[0];

    saveSnapshot(`Fusionar páginas ${sorted.map((i) => i + 1).join(', ')}`);
    [...sorted].reverse().forEach((i) => pages.splice(i, 1));
    pages.splice(insertAt, 0, mergedDataUrl);

    exitMergeMode();
    renderPages();
    updateActionsVisibility();
    setResult('success', `✅ ${sorted.length} páginas fusionadas correctamente`);
  });
}

// Deshacer
undoBtn.addEventListener('click', () => doUndo());
document.addEventListener('keydown', (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !isScanning) {
    e.preventDefault();
    doUndo();
  }
});

// ---------- Cámara (estilo CamScanner) ----------
// Detección de bordes + transformación de perspectiva + filtros BW/gris/color.
// Portado directo desde un proyecto equivalente ya validado: detección por gradientes de
// Sobel + perfiles de proyección (TypeScript puro, sin dependencias externas, sin necesidad
// de internet), homografía calculada a mano, y umbralización adaptativa de Bradley-Roth
// para el aspecto "documento escaneado" en blanco y negro.

type Point = { x: number; y: number };
type Quad = [Point, Point, Point, Point]; // coordenadas normalizadas 0-1: [tl, tr, br, bl]
type FilterMode = 'bw' | 'grayscale' | 'color';

let cameraStream: MediaStream | null = null;
let rawCapturedDataUrl: string | null = null; // foto en bruto, sin recortar
let warpedDataUrl: string | null = null;      // tras recorte/perspectiva, antes del filtro
let selectedFilterMode: FilterMode = 'bw';

let quad: Quad = [
  { x: 0.08, y: 0.08 },
  { x: 0.92, y: 0.08 },
  { x: 0.92, y: 0.92 },
  { x: 0.08, y: 0.92 },
];
let draggingCorner: number | null = null;

// ---------- Detección automática de bordes (gradientes de Sobel + perfiles de proyección) ----------

function defaultQuad(): Quad {
  return [
    { x: 0.08, y: 0.08 },
    { x: 0.92, y: 0.08 },
    { x: 0.92, y: 0.92 },
    { x: 0.08, y: 0.92 },
  ];
}

function detectDocumentCorners(dataUrl: string): Promise<Quad> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const MAX = 600;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        const gray = new Uint8Array(w * h);
        for (let i = 0; i < w * h; i++) {
          gray[i] = Math.round(
            0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]
          );
        }

        const edges = new Uint8Array(w * h);
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const gx =
              -gray[(y - 1) * w + (x - 1)] + gray[(y - 1) * w + (x + 1)] +
              -2 * gray[y * w + (x - 1)] + 2 * gray[y * w + (x + 1)] +
              -gray[(y + 1) * w + (x - 1)] + gray[(y + 1) * w + (x + 1)];
            const gy =
              -gray[(y - 1) * w + (x - 1)] - 2 * gray[(y - 1) * w + x] - gray[(y - 1) * w + (x + 1)] +
              gray[(y + 1) * w + (x - 1)] + 2 * gray[(y + 1) * w + x] + gray[(y + 1) * w + (x + 1)];
            edges[y * w + x] = Math.min(255, Math.sqrt(gx * gx + gy * gy));
          }
        }

        const threshold = 60;
        const MARGIN = 0.05;
        const minX = Math.round(w * MARGIN);
        const maxX = Math.round(w * (1 - MARGIN));
        const minY = Math.round(h * MARGIN);
        const maxY = Math.round(h * (1 - MARGIN));

        const hProj = new Float32Array(h);
        const vProj = new Float32Array(w);
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            if (edges[y * w + x] > threshold) {
              hProj[y]++;
              vProj[x]++;
            }
          }
        }

        const hThresh = w * 0.03;
        const vThresh = h * 0.03;
        let top = minY, bottom = maxY, left = minX, right = maxX;

        for (let y = minY; y < h / 2; y++) { if (hProj[y] > hThresh) { top = y; break; } }
        for (let y = maxY; y > h / 2; y--) { if (hProj[y] > hThresh) { bottom = y; break; } }
        for (let x = minX; x < w / 2; x++) { if (vProj[x] > vThresh) { left = x; break; } }
        for (let x = maxX; x > w / 2; x--) { if (vProj[x] > vThresh) { right = x; break; } }

        const docW = right - left;
        const docH = bottom - top;
        if (docW / w < 0.2 || docH / h < 0.2 || left >= right || top >= bottom) {
          resolve(defaultQuad());
          return;
        }

        resolve([
          { x: left / w, y: top / h },
          { x: right / w, y: top / h },
          { x: right / w, y: bottom / h },
          { x: left / w, y: bottom / h },
        ]);
      } catch {
        resolve(defaultQuad());
      }
    };
    img.onerror = () => resolve(defaultQuad());
    img.src = dataUrl;
  });
}

// ---------- Transformación de perspectiva (homografía calculada a mano) ----------

function computeHomography(srcPts: Point[], dstPts: Point[]): number[] | null {
  const A: number[][] = [];
  const b: number[] = [];

  for (let i = 0; i < 4; i++) {
    const { x: sx, y: sy } = srcPts[i];
    const { x: dx, y: dy } = dstPts[i];
    A.push([sx, sy, 1, 0, 0, 0, -dx * sx, -dx * sy]);
    b.push(dx);
    A.push([0, 0, 0, sx, sy, 1, -dy * sx, -dy * sy]);
    b.push(dy);
  }

  const n = 8;
  const M: number[][] = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let maxRow = col;
    let maxVal = Math.abs(M[col][col]);
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) > maxVal) {
        maxVal = Math.abs(M[row][col]);
        maxRow = row;
      }
    }
    if (maxVal < 1e-12) return null;
    [M[col], M[maxRow]] = [M[maxRow], M[col]];
    const pivot = M[col][col];
    for (let k = col; k <= n; k++) M[col][k] /= pivot;
    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = M[row][col];
      for (let k = col; k <= n; k++) M[row][k] -= factor * M[col][k];
    }
  }

  return M.map((row) => row[n]);
}

function applyPerspectiveWarp(dataUrl: string, q: Quad): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const W = img.width;
      const H = img.height;

      const srcCanvas = document.createElement('canvas');
      srcCanvas.width = W;
      srcCanvas.height = H;
      const srcCtx = srcCanvas.getContext('2d')!;
      srcCtx.drawImage(img, 0, 0);
      const srcPixels = srcCtx.getImageData(0, 0, W, H).data;

      const [tl, tr, br, bl] = q;
      const srcPts: Point[] = [
        { x: tl.x * W, y: tl.y * H },
        { x: tr.x * W, y: tr.y * H },
        { x: br.x * W, y: br.y * H },
        { x: bl.x * W, y: bl.y * H },
      ];

      const wTop = Math.hypot(srcPts[1].x - srcPts[0].x, srcPts[1].y - srcPts[0].y);
      const wBot = Math.hypot(srcPts[2].x - srcPts[3].x, srcPts[2].y - srcPts[3].y);
      const hLeft = Math.hypot(srcPts[3].x - srcPts[0].x, srcPts[3].y - srcPts[0].y);
      const hRight = Math.hypot(srcPts[2].x - srcPts[1].x, srcPts[2].y - srcPts[1].y);

      const outW = Math.round(Math.max(wTop, wBot));
      const outH = Math.round(Math.max(hLeft, hRight));

      if (outW < 10 || outH < 10) {
        resolve(dataUrl);
        return;
      }

      const dstPts: Point[] = [
        { x: 0, y: 0 },
        { x: outW - 1, y: 0 },
        { x: outW - 1, y: outH - 1 },
        { x: 0, y: outH - 1 },
      ];

      const H_inv = computeHomography(dstPts, srcPts);

      if (!H_inv) {
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = outW;
        fallbackCanvas.height = outH;
        const fCtx = fallbackCanvas.getContext('2d')!;
        fCtx.drawImage(
          img,
          srcPts[0].x, srcPts[0].y,
          srcPts[2].x - srcPts[0].x, srcPts[2].y - srcPts[0].y,
          0, 0, outW, outH
        );
        resolve(fallbackCanvas.toDataURL('image/jpeg', 0.93));
        return;
      }

      const [h0, h1, h2, h3, h4, h5, h6, h7] = H_inv;

      const dstCanvas = document.createElement('canvas');
      dstCanvas.width = outW;
      dstCanvas.height = outH;
      const dstCtx = dstCanvas.getContext('2d')!;
      const dstImageData = dstCtx.createImageData(outW, outH);
      const dstPixels = dstImageData.data;

      for (let dy = 0; dy < outH; dy++) {
        for (let dx = 0; dx < outW; dx++) {
          const denom = h6 * dx + h7 * dy + 1.0;
          if (Math.abs(denom) < 1e-10) continue;

          const sx = (h0 * dx + h1 * dy + h2) / denom;
          const sy = (h3 * dx + h4 * dy + h5) / denom;

          const x0 = Math.floor(sx);
          const y0 = Math.floor(sy);
          const x1 = x0 + 1;
          const y1 = y0 + 1;

          const dstIdx = (dy * outW + dx) * 4;

          if (x0 < 0 || y0 < 0 || x1 >= W || y1 >= H) {
            dstPixels[dstIdx] = 255;
            dstPixels[dstIdx + 1] = 255;
            dstPixels[dstIdx + 2] = 255;
            dstPixels[dstIdx + 3] = 255;
            continue;
          }

          const fx = sx - x0;
          const fy = sy - y0;
          const w00 = (1 - fx) * (1 - fy);
          const w10 = fx * (1 - fy);
          const w01 = (1 - fx) * fy;
          const w11 = fx * fy;

          const i00 = (y0 * W + x0) * 4;
          const i10 = (y0 * W + x1) * 4;
          const i01 = (y1 * W + x0) * 4;
          const i11 = (y1 * W + x1) * 4;

          dstPixels[dstIdx]     = Math.round(srcPixels[i00] * w00 + srcPixels[i10] * w10 + srcPixels[i01] * w01 + srcPixels[i11] * w11);
          dstPixels[dstIdx + 1] = Math.round(srcPixels[i00 + 1] * w00 + srcPixels[i10 + 1] * w10 + srcPixels[i01 + 1] * w01 + srcPixels[i11 + 1] * w11);
          dstPixels[dstIdx + 2] = Math.round(srcPixels[i00 + 2] * w00 + srcPixels[i10 + 2] * w10 + srcPixels[i01 + 2] * w01 + srcPixels[i11 + 2] * w11);
          dstPixels[dstIdx + 3] = 255;
        }
      }

      dstCtx.putImageData(dstImageData, 0, 0);
      resolve(dstCanvas.toDataURL('image/jpeg', 0.97));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

// ---------- Filtros "escáner profesional" (bw / grayscale / color) ----------

function applyDocumentFilter(dataUrl: string, mode: FilterMode): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const W = img.width;
      const H = img.height;

      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, W, H);
      const data = imageData.data;

      if (mode === 'color') {
        for (let i = 0; i < data.length; i += 4) {
          data[i]     = Math.min(255, Math.max(0, (data[i]     - 128) * 1.3 + 148));
          data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.3 + 148));
          data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.3 + 148));
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.95));
        return;
      }

      // Paso 1: escala de grises
      const gray = new Uint8Array(W * H);
      for (let i = 0; i < W * H; i++) {
        gray[i] = Math.round(0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]);
      }

      if (mode === 'grayscale') {
        let minV = 255, maxV = 0;
        for (let i = 0; i < gray.length; i++) {
          if (gray[i] < minV) minV = gray[i];
          if (gray[i] > maxV) maxV = gray[i];
        }
        const range = maxV - minV || 1;
        for (let i = 0; i < W * H; i++) {
          const v = Math.round(((gray[i] - minV) / range) * 255);
          data[i * 4] = v;
          data[i * 4 + 1] = v;
          data[i * 4 + 2] = v;
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.95));
        return;
      }

      // Paso 2: ligero desenfoque 3x3 para suavizar el ruido JPEG/sensor antes de umbralizar
      // (sin esto, el ruido fragmenta los trazos finos del texto en pequeñas islas negras/blancas).
      const blurred = new Uint8Array(W * H);
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const x0 = Math.max(0, x - 1), x1 = Math.min(W - 1, x + 1);
          const y0 = Math.max(0, y - 1), y1 = Math.min(H - 1, y + 1);
          let sum = 0, count = 0;
          for (let yy = y0; yy <= y1; yy++) {
            for (let xx = x0; xx <= x1; xx++) {
              sum += gray[yy * W + xx];
              count++;
            }
          }
          blurred[y * W + x] = Math.round(sum / count);
        }
      }

      // Paso 3: umbralización adaptativa de Bradley-Roth (vía imagen integral) — esto es lo que
      // da el verdadero aspecto "documento escaneado": texto negro nítido sobre fondo blanco puro.
      const S = Math.round(Math.min(W, H) / 16);
      const T = 0.15;

      const integral = new Float64Array((W + 1) * (H + 1));
      for (let y = 1; y <= H; y++) {
        for (let x = 1; x <= W; x++) {
          integral[y * (W + 1) + x] =
            blurred[(y - 1) * W + (x - 1)] +
            integral[(y - 1) * (W + 1) + x] +
            integral[y * (W + 1) + (x - 1)] -
            integral[(y - 1) * (W + 1) + (x - 1)];
        }
      }

      const result = new Uint8Array(W * H);
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const x1 = Math.max(0, x - S);
          const y1 = Math.max(0, y - S);
          const x2 = Math.min(W - 1, x + S);
          const y2 = Math.min(H - 1, y + S);
          const count = (x2 - x1) * (y2 - y1);
          const sum =
            integral[(y2 + 1) * (W + 1) + (x2 + 1)] -
            integral[y1 * (W + 1) + (x2 + 1)] -
            integral[(y2 + 1) * (W + 1) + x1] +
            integral[y1 * (W + 1) + x1];
          const mean = sum / count;
          // Se compara el píxel ORIGINAL (nítido) con la media local calculada sobre la versión
          // desenfocada: esto estabiliza el umbral sin difuminar los bordes del texto.
          result[y * W + x] = gray[y * W + x] < mean * (1 - T) ? 0 : 255;
        }
      }

      // Paso 3: eliminación de ruido aislado (píxeles negros rodeados de blanco)
      const cleaned = new Uint8Array(result);
      for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
          if (result[y * W + x] === 0) {
            let whiteNeighbors = 0;
            if (result[(y - 1) * W + x] === 255) whiteNeighbors++;
            if (result[(y + 1) * W + x] === 255) whiteNeighbors++;
            if (result[y * W + (x - 1)] === 255) whiteNeighbors++;
            if (result[y * W + (x + 1)] === 255) whiteNeighbors++;
            if (whiteNeighbors === 4) cleaned[y * W + x] = 255;
          }
        }
      }

      for (let i = 0; i < W * H; i++) {
        data[i * 4] = cleaned[i];
        data[i * 4 + 1] = cleaned[i];
        data[i * 4 + 2] = cleaned[i];
        data[i * 4 + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
      // Nota: el modo "bw" se exporta en PNG (no JPEG) para conservar el blanco/negro puro
      // sin artefactos de compresión. Ver getImageFormat()/getImageExtension() más abajo,
      // usadas en todos los sitios donde se genera un PDF o se exporta esta imagen.
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

// ---------- Orquestación de la UI de la cámara ----------

async function openCamera(): Promise<void> {
  cameraOverlay.style.display = 'block';
  cameraModal.style.display = 'flex';
  cameraLiveView.style.display = 'block';
  cameraCropView.style.display = 'none';
  cameraFilterView.style.display = 'none';

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    });
    cameraVideo.srcObject = cameraStream;
  } catch {
    setResult('error', '❌ No se pudo acceder a la cámara. Verifica los permisos.');
    closeCamera();
  }
}

function closeCamera(): void {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  cameraVideo.srcObject = null;
  cameraOverlay.style.display = 'none';
  cameraModal.style.display = 'none';
  rawCapturedDataUrl = null;
  warpedDataUrl = null;
}

async function capturePhoto(): Promise<void> {
  if (!cameraVideo.videoWidth || !cameraVideo.videoHeight) return;

  const canvas = document.createElement('canvas');
  canvas.width = cameraVideo.videoWidth;
  canvas.height = cameraVideo.videoHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(cameraVideo, 0, 0);
  rawCapturedDataUrl = canvas.toDataURL('image/jpeg', 0.95);

  cameraLiveView.style.display = 'none';
  cameraCropView.style.display = 'block';
  cameraDetectingHint.style.display = 'flex';
  capturedPhotoImg.style.visibility = 'hidden';

  capturedPhotoImg.src = rawCapturedDataUrl;
  quad = defaultQuad();

  const detected = await detectDocumentCorners(rawCapturedDataUrl);
  quad = detected;

  cameraDetectingHint.style.display = 'none';
  capturedPhotoImg.style.visibility = 'visible';
  updateCropOverlay();
}

function retakePhoto(): void {
  rawCapturedDataUrl = null;
  warpedDataUrl = null;
  cameraCropView.style.display = 'none';
  cameraFilterView.style.display = 'none';
  cameraLiveView.style.display = 'block';
}

// Convierte los puntos normalizados (0-1) del quad en coordenadas % para mostrar
function updateCropOverlay(): void {
  const handles = [cropHandleTL, cropHandleTR, cropHandleBR, cropHandleBL];
  quad.forEach((point, i) => {
    handles[i].style.left = `${point.x * 100}%`;
    handles[i].style.top = `${point.y * 100}%`;
  });

  const pts = quad.map((p) => `${p.x * 100},${p.y * 100}`).join(' ');
  // Zona oscurecida fuera del documento (máscara SVG) + polígono + líneas guía (tercios)
  cropOverlaySvg.innerHTML = `
    <defs>
      <mask id="docMask">
        <rect width="100" height="100" fill="white" />
        <polygon points="${pts}" fill="black" />
      </mask>
    </defs>
    <rect width="100" height="100" fill="rgba(0,0,0,0.55)" mask="url(#docMask)" />
    <polygon points="${pts}" fill="rgba(79,142,247,0.12)" stroke="#4F8EF7" stroke-width="0.6" vector-effect="non-scaling-stroke" />
  `;
  cropOverlaySvg.setAttribute('viewBox', '0 0 100 100');
  cropOverlaySvg.setAttribute('preserveAspectRatio', 'none');
}

function makeHandleDraggable(handleEl: HTMLDivElement, index: number): void {
  handleEl.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    draggingCorner = index;
    handleEl.setPointerCapture(e.pointerId);
  });

  handleEl.addEventListener('pointermove', (e) => {
    if (draggingCorner !== index) return;
    const rect = cameraCropContainer.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    quad[index] = { x, y };
    updateCropOverlay();
  });

  handleEl.addEventListener('pointerup', (e) => {
    if (draggingCorner === index) draggingCorner = null;
    handleEl.releasePointerCapture(e.pointerId);
  });
}

makeHandleDraggable(cropHandleTL, 0);
makeHandleDraggable(cropHandleTR, 1);
makeHandleDraggable(cropHandleBR, 2);
makeHandleDraggable(cropHandleBL, 3);

async function confirmCrop(): Promise<void> {
  if (!rawCapturedDataUrl) return;

  setResult('loading', `<div class="spinner"></div> Recortando...`);
  cameraCropView.style.display = 'none';

  warpedDataUrl = await applyPerspectiveWarp(rawCapturedDataUrl, quad);
  hideResult();

  selectedFilterMode = 'bw';
  updateFilterSelection();
  await refreshFilterPreview();

  cameraFilterView.style.display = 'block';
}

async function refreshFilterPreview(): Promise<void> {
  if (!warpedDataUrl) return;
  filterPreviewImg.src = warpedDataUrl; // vista previa rápida sin filtro mientras se procesa
  const filtered = await applyDocumentFilter(warpedDataUrl, selectedFilterMode);
  filterPreviewImg.src = filtered;
}

function updateFilterSelection(): void {
  [filterBwBtn, filterGrayscaleBtn, filterColorBtn].forEach((btn) => {
    btn.classList.toggle('selected', btn.dataset.filter === selectedFilterMode);
  });
}

[filterBwBtn, filterGrayscaleBtn, filterColorBtn].forEach((btn) => {
  btn.addEventListener('click', async () => {
    selectedFilterMode = (btn.dataset.filter as FilterMode) || 'bw';
    updateFilterSelection();
    await refreshFilterPreview();
  });
});

function backToCrop(): void {
  cameraFilterView.style.display = 'none';
  cameraCropView.style.display = 'block';
  updateCropOverlay();
}

async function confirmFilterAndSave(): Promise<void> {
  if (!warpedDataUrl) return;

  if (pages.length >= MAX_PAGES) {
    setResult('error', `⚠️ Se alcanzó el límite de ${MAX_PAGES} páginas. Borra, exporta o envía algunas antes de continuar.`);
    closeCamera();
    return;
  }

  setResult('loading', `<div class="spinner"></div> Aplicando filtro...`);
  const finalDataUrl = await applyDocumentFilter(warpedDataUrl, selectedFilterMode);

  closeCamera();

  pages.push(finalDataUrl);
  renderPages();
  updateActionsVisibility();

  const savedPath = await autoSaveNewPages([finalDataUrl]);
  const baseMsg = maybeAppendLimitWarning(`✅ Foto escaneada y añadida como página ${pages.length}`);
  const savedMsg = savedPath ? `<br>💾 Guardado en: ${savedPath}` : '';
  setResult('success', baseMsg + savedMsg);
}

homeCameraBtn.addEventListener('click', () => openCamera());
cameraMoreBtn.addEventListener('click', () => openCamera());
capturePhotoBtn.addEventListener('click', () => capturePhoto());
cameraCancelBtn.addEventListener('click', () => closeCamera());
cameraCropCancelBtn.addEventListener('click', () => closeCamera());
cameraFilterCancelBtn.addEventListener('click', () => closeCamera());
retakePhotoBtn.addEventListener('click', () => retakePhoto());
confirmCropBtn.addEventListener('click', () => confirmCrop());
backToCropBtn.addEventListener('click', () => backToCrop());
confirmFilterBtn.addEventListener('click', () => confirmFilterAndSave());
cameraOverlay.addEventListener('click', () => closeCamera());

// Modal de exportación
function openExportModal(): void { exportModal.style.display = 'flex'; exportOverlay.style.display = 'block'; }
function closeExportModal(): void { exportModal.style.display = 'none'; exportOverlay.style.display = 'none'; }
exportCancelBtn.addEventListener('click', () => closeExportModal());
exportOverlay.addEventListener('click', () => closeExportModal());

downloadPdfBtn.addEventListener('click', () => {
  if (pages.length === 0 || isScanning) return;
  openExportModal();
});

function doExportPdfSingle(): void {
  closeExportModal();
  if (pages.length === 0) return;

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });

  pages.forEach((imgData, i) => {
    if (i > 0) pdf.addPage();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, getImageFormat(imgData), 0, 0, pageWidth, pageHeight);
  });

  pdf.save(`documento-${Date.now()}.pdf`);
  setResult('success', `✅ PDF descargado — ${pages.length} página${pages.length !== 1 ? 's' : ''}`);
}

async function doExportZip(): Promise<void> {
  closeExportModal();
  if (pages.length === 0) return;

  setResult('loading', `<div class="spinner"></div> Generando ZIP...`);

  const { jsPDF } = window.jspdf;
  const zip = new window.JSZip();

  pages.forEach((imgData, i) => {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, getImageFormat(imgData), 0, 0, pageWidth, pageHeight);
    const pdfBuffer = pdf.output('arraybuffer');
    zip.file(`pagina_${String(i + 1).padStart(2, '0')}.pdf`, pdfBuffer);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `documentos-${Date.now()}.zip`;
  link.click();
  URL.revokeObjectURL(url);

  setResult('success', `✅ ZIP descargado — ${pages.length} PDF${pages.length !== 1 ? 's' : ''} en el archivo`);
}

// Exportar como imágenes: descarga directa si hay 1 sola página, ZIP de imágenes si hay varias.
// Usa getImageExtension() para nombrar cada archivo con la extensión real (jpg o png), ya que
// el filtro "bw" genera PNG mientras que los demás modos generan JPEG.
async function doExportImages(): Promise<void> {
  closeExportModal();
  if (pages.length === 0) return;

  if (pages.length === 1) {
    const ext = getImageExtension(pages[0]);
    const link = document.createElement('a');
    link.href = pages[0];
    link.download = `documento-${Date.now()}.${ext}`;
    link.click();
    setResult('success', `✅ Imagen descargada`);
    return;
  }

  setResult('loading', `<div class="spinner"></div> Generando ZIP de imágenes...`);

  const zip = new window.JSZip();

  for (let i = 0; i < pages.length; i++) {
    // pages[i] es una dataURL "data:image/xxx;base64,...." -> nos quedamos solo con la parte base64
    const ext = getImageExtension(pages[i]);
    const base64 = pages[i].split(',')[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let j = 0; j < binary.length; j++) bytes[j] = binary.charCodeAt(j);
    zip.file(`pagina_${String(i + 1).padStart(2, '0')}.${ext}`, bytes.buffer);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `imagenes-${Date.now()}.zip`;
  link.click();
  URL.revokeObjectURL(url);

  setResult('success', `✅ ZIP descargado — ${pages.length} imagen${pages.length !== 1 ? 'es' : ''} en el archivo`);
}

// Genera una etiqueta fecha+hora legible para identificar una sesión de escaneo en los nombres
// de archivo, ej: 2026-07-12_20h44
function buildSessionLabel(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}h${pad(now.getMinutes())}`;
}

// ---------- Guardado automático en disco tras cada escaneo ----------
// Escribe directamente cada página escaneada en PDF en <carpeta elegida>/Scan/pagina_XX_fecha_hora.pdf,
// sin acción del usuario. La carpeta base se elige UNA SOLA VEZ y se memoriza entre los
// lanzamientos de la app; todas las sesiones de escaneo escriben ahí, distinguidas por el nombre de archivo.

// Asegura que haya una carpeta de destino disponible: retoma la ya memorizada en disco,
// o usa silenciosamente Descargas por defecto (devuelto directamente por getSavedDestination
// en main.ts — nunca hay un popup impuesto en el primer escaneo).
async function ensureDestinationFolder(): Promise<string | null> {
  if (!window.electronAPI) return null; // guardado automático no disponible fuera de la app de escritorio
  if (destinationFolderPath) return destinationFolderPath;

  const saved = await window.electronAPI.getSavedDestination();
  if (!saved) return null;

  destinationFolderPath = saved;
  return destinationFolderPath;
}

// Permite al usuario cambiar la carpeta de destino en cualquier momento (icono dedicado),
// sobrescribiendo la preferencia memorizada.
async function changeDestinationFolder(): Promise<void> {
  if (!window.electronAPI) {
    setResult('error', '❌ Esta función solo está disponible dentro de la aplicación de escritorio.');
    return;
  }

  const chosen = await window.electronAPI.chooseDestinationFolder();
  if (!chosen) return; // cancelado

  destinationFolderPath = chosen;
  await window.electronAPI.saveDestination(chosen);
  setResult('success', `✅ Carpeta de destino actualizada: ${chosen}\\Scan`);
}

settingsBtn.addEventListener('click', () => changeDestinationFolder());

async function ensureAutoSaveSession(): Promise<boolean> {
  const folder = await ensureDestinationFolder();
  if (!folder) return false;
  if (!autoSaveSessionLabel) autoSaveSessionLabel = buildSessionLabel();
  return true;
}

// Guarda las páginas recién escaneadas (newPages), en PDF individuales, en la subcarpeta
// fija "Scan" de la carpeta de destino. Devuelve la ruta completa de la carpeta si el
// guardado tuvo éxito, o null en caso contrario.
async function autoSaveNewPages(newPages: string[]): Promise<string | null> {
  if (newPages.length === 0) return null;

  const ready = await ensureAutoSaveSession();
  if (!ready || !window.electronAPI || !destinationFolderPath || !autoSaveSessionLabel) {
    return null;
  }

  try {
    const { jsPDF } = window.jspdf;
    const files: { filename: string; data: ArrayBuffer }[] = [];

    newPages.forEach((imgData) => {
      autoSavedPageCount++;
      const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, getImageFormat(imgData), 0, 0, pageWidth, pageHeight);
      const pdfBuffer = pdf.output('arraybuffer');
      const filename = `pagina_${String(autoSavedPageCount).padStart(2, '0')}_${autoSaveSessionLabel}.pdf`;
      files.push({ filename, data: pdfBuffer });
    });

    const result = await window.electronAPI.savePdfsToFolder(destinationFolderPath, files);
    if (result && result.success) {
      return result.savedPath || `${destinationFolderPath}\\Scan`;
    }
    return null;
  } catch {
    return null;
  }
}

exportPdfSingleBtn.addEventListener('click', () => doExportPdfSingle());
exportZipBtn.addEventListener('click', () => doExportZip());
exportImagesBtn.addEventListener('click', () => doExportImages());

// Placeholder KnowledgeHub
sendKnowledgeHubBtn.addEventListener('click', () => {
  if (pages.length === 0 && pendingDocs.length === 0) return;
  setResult('loading', '📤 Enviar a KnowledgeHub: próximamente...');
});

// Listado de dispositivos
async function loadDevices(): Promise<void> {
  showDevicesScreen();
  devicesDiv.innerHTML = '<div class="device"><div class="spinner" style="color:#4F8EF7"></div> Buscando escáneres...</div>';

  try {
    const res = await fetch(`${API_BASE}/devices`);
    const data: { devices: ScannerDevice[] } = await res.json();

    if (!data.devices || data.devices.length === 0) {
      devicesDiv.innerHTML = '<div class="device" style="color:#94A3B8;">No se encontraron escáneres.</div>';
      return;
    }

    devicesDiv.innerHTML = '';
    data.devices.forEach((d) => {
      const btn = document.createElement('button');
      btn.className = 'device';

      const portLabel = d.port ? `<span class="device-port">${d.port}</span>` : '';
      btn.innerHTML = `
        <span class="device-icon">📠</span>
        <span class="device-info">
          <span class="device-name">${d.name}</span>
          ${portLabel}
        </span>
      `;

      btn.onclick = () => {
        currentScannerIndex = d.index;
        showModeChoice();
      };

      devicesDiv.appendChild(btn);
    });
  } catch {
    devicesDiv.innerHTML = '<div class="device" style="color:#f87171;">❌ No se pudo conectar al servidor local.</div>';
  }
}

// Botones de inicio
homeScanBtn.addEventListener('click', () => loadDevices());
refreshDevicesBtn.addEventListener('click', () => loadDevices());

// "Volver" = vacía todo y vuelve al inicio
backHomeBtn.addEventListener('click', () => {
  if (isScanning) return;
  doClearAll();
});

// Importar -> abre el selector de archivos (MÚLTIPLE)
homeImportBtn.addEventListener('click', () => {
  enterImportMode();
  importFileInput.value = '';
  importFileInput.click();
});

// Selección de importación (MÚLTIPLE)
importFileInput.addEventListener('change', async () => {
  const files = Array.from(importFileInput.files ?? []);

  if (files.length === 0) {
    showHome();
    return;
  }

  await handleImportedFiles(files);
  finishImport();
});

// "Importar más" -> añadir documentos/fotos en cualquier momento, sin cambiar de pantalla
importMoreBtn.addEventListener('click', () => {
  importMoreFileInput.value = '';
  importMoreFileInput.click();
});

importMoreFileInput.addEventListener('change', async () => {
  const files = Array.from(importMoreFileInput.files ?? []);
  if (files.length === 0) return;
  await handleImportedFiles(files);
});

// Elección del modo de escaneo
function showModeChoice(): void {
  devicesDiv.style.display = 'none';
  scanModeChoice.style.display = 'block';
}

modeSingleBtn.addEventListener('click', () => {
  currentMode = 'single';
  scanModeChoice.style.display = 'none';
  if (currentScannerIndex !== null) doSingleScan(currentScannerIndex);
});

modeMultiBtn.addEventListener('click', () => {
  currentMode = 'multi';
  scanModeChoice.style.display = 'none';
  if (currentScannerIndex !== null) doMultiScan(currentScannerIndex);
});

scanMoreBtn.addEventListener('click', () => {
  if (currentScannerIndex === null) return;
  currentMode === 'multi' ? doMultiScan(currentScannerIndex) : doSingleScan(currentScannerIndex);
});

// Escaneo simple
async function doSingleScan(scannerIndex: number): Promise<void> {
  if (pages.length >= MAX_PAGES) {
    setResult('error', `⚠️ Se alcanzó el límite de ${MAX_PAGES} páginas. Borra, exporta o envía algunas antes de escanear más.`);
    return;
  }

  setScanningUI(true);
  setResult('loading', `<div class="spinner"></div> Escaneando página ${pages.length + 1}...`);

  try {
    const res = await fetch(`${API_BASE}/scan?scannerIndex=${scannerIndex}`);
    const data: SingleScanResponse = await res.json();

    if (data.status === 'ok' && data.images) {
      pages.push(...data.images);
      renderPages();
      const savedPath = await autoSaveNewPages(data.images);
      const baseMsg = maybeAppendLimitWarning(`✅ Página ${pages.length} escaneada correctamente`);
      const savedMsg = savedPath ? `<br>💾 Guardado en: ${savedPath}` : '';
      setResult('success', baseMsg + savedMsg);
    } else if (data.code === 'STOPPED') {
      setResult('success', '⏹️ Escaneo detenido por el usuario.');
    } else {
      setResult('error', `⚠️ ${data.error}`);
    }
  } catch {
    setResult('error', '❌ Error de conexión con el servidor local.');
  } finally {
    setScanningUI(false);
    updateActionsVisibility();
  }
}

// Escaneo multipágina
async function doMultiScan(scannerIndex: number): Promise<void> {
  if (pages.length >= MAX_PAGES) {
    setResult('error', `⚠️ Se alcanzó el límite de ${MAX_PAGES} páginas. Borra, exporta o envía algunas antes de escanear más.`);
    return;
  }

  setScanningUI(true);
  imagesAddedThisSession = 0;
  let lastSavedPath: string | null = null;

  // Número máximo de páginas nuevas que aún se pueden añadir antes de alcanzar MAX_PAGES
  const maxNewPages = MAX_PAGES - pages.length;
  let limitReached = false;

  setResult('loading', `<div class="spinner"></div> Escaneando desde el alimentador (ADF)... 0 páginas`);

  try {
    await fetch(`${API_BASE}/scan/start?scannerIndex=${scannerIndex}`);
  } catch {
    setResult('error', '❌ Error de conexión con el servidor local.');
    setScanningUI(false);
    updateActionsVisibility();
    return;
  }

  let pollInFlight = false;

  pollInterval = setInterval(async () => {
    // Evita que 2 ciclos de sondeo se ejecuten a la vez si un ciclo anterior (guardado
    // automático en curso, etc.) aún no ha terminado a los 700ms — sin este candado, se
    // podían "perder" páginas en el guardado (contadores compartidos modificados por 2
    // ejecuciones solapadas).
    if (pollInFlight) return;
    pollInFlight = true;

    try {
      const res = await fetch(`${API_BASE}/scan/poll`);
      const state: MultiScanState = await res.json();

      const newCount = state.images.length - imagesAddedThisSession;
      if (newCount > 0 && !limitReached) {
        const capacityLeft = maxNewPages - imagesAddedThisSession;
        const imagesToTake = Math.min(newCount, capacityLeft);
        const newImages = state.images.slice(imagesAddedThisSession, imagesAddedThisSession + imagesToTake);

        pages.push(...newImages);
        imagesAddedThisSession += imagesToTake;
        renderPages();
        setResult('loading', `<div class="spinner"></div> Escaneando desde el alimentador (ADF)... ${imagesAddedThisSession} página${imagesAddedThisSession !== 1 ? 's' : ''}`);

        const savedPath = await autoSaveNewPages(newImages);
        if (savedPath) lastSavedPath = savedPath;

        if (imagesAddedThisSession >= maxNewPages) {
          limitReached = true;
          // Se detiene el escaneo en el backend (kill del proceso PowerShell), no solo la
          // visualización, para no seguir escaneando páginas que de todos modos se van a ignorar.
          try {
            await fetch(`${API_BASE}/scan/stop`);
          } catch {
            // no importa si la llamada falla, se sale del sondeo de todos modos
          }
        }
      }

      if (!state.running || limitReached) {
        if (pollInterval !== null) clearInterval(pollInterval);
        pollInterval = null;

        if (limitReached) {
          setResult('success', `⚠️ Límite de ${MAX_PAGES} páginas alcanzado — escaneo detenido automáticamente. ${imagesAddedThisSession} página${imagesAddedThisSession !== 1 ? 's' : ''} guardada${imagesAddedThisSession !== 1 ? 's' : ''}.${lastSavedPath ? `<br>💾 Guardado en: ${lastSavedPath}` : ''}`);
        } else if (state.error && state.code !== 'STOPPED') {
          setResult('error', `⚠️ ${state.error}`);
        } else if (state.code === 'STOPPED') {
          setResult('success', maybeAppendLimitWarning(`⏹️ Escaneo detenido — ${imagesAddedThisSession} página${imagesAddedThisSession !== 1 ? 's' : ''} guardada${imagesAddedThisSession !== 1 ? 's' : ''}`) + (lastSavedPath ? `<br>💾 Guardado en: ${lastSavedPath}` : ''));
        } else {
          setResult('success', maybeAppendLimitWarning(`✅ ${imagesAddedThisSession} página${imagesAddedThisSession !== 1 ? 's' : ''} escaneada${imagesAddedThisSession !== 1 ? 's' : ''} correctamente`) + (lastSavedPath ? `<br>💾 Guardado en: ${lastSavedPath}` : ''));
        }

        setScanningUI(false);
        updateActionsVisibility();
      }
    } catch {
      if (pollInterval !== null) clearInterval(pollInterval);
      pollInterval = null;
      setResult('error', '❌ Error de conexión con el servidor local.');
      setScanningUI(false);
      updateActionsVisibility();
    } finally {
      pollInFlight = false;
    }
  }, 700);
}

stopScanBtn.addEventListener('click', async () => {
  stopScanBtn.disabled = true;
  try {
    await fetch(`${API_BASE}/scan/stop`);
  } catch {
    setResult('error', '❌ No se pudo detener el escaneo — error de conexión con el servidor local.');
  } finally {
    stopScanBtn.disabled = false;
  }
});

function setScanningUI(scanning: boolean): void {
  isScanning = scanning;
  homeActions.style.display = 'none';
  // El banner con "Volver" permanece visible DURANTE y DESPUÉS del escaneo (incluso en caso
  // de error), para no dejar nunca al usuario bloqueado en una pantalla sin salida.
  deviceActions.style.display = 'flex';
  refreshDevicesBtn.style.display = 'none';
  backHomeBtn.style.display = 'inline-flex';
  devicesDiv.style.display = 'none';
  scanModeChoice.style.display = 'none';

  scanMoreBtn.disabled = scanning;
  downloadPdfBtn.disabled = scanning;
  clearBtn.disabled = scanning;
  undoBtn.disabled = scanning;
  importMoreBtn.disabled = scanning;
  cameraMoreBtn.disabled = scanning;
  settingsBtn.disabled = scanning;
  // "Volver" solo se desactiva DURANTE un escaneo activo (para no interrumpir un escaneo
  // multipágina en curso sin pasar por "Detener escaneo"), pero vuelve a ser clicable en
  // cuanto el escaneo termina, con éxito o con error.
  backHomeBtn.disabled = scanning;

  // El botón "Detener escaneo" ahora es visible durante CUALQUIER escaneo en curso (simple o
  // multipágina), no solo el multipágina — el backend sabe detener ambos.
  stopScanBtn.style.display = scanning ? 'inline-flex' : 'none';
  stopScanBtn.disabled = false;
}

// Borrar ("Borrar todo" = mismo comportamiento que "Volver")
clearBtn.addEventListener('click', () => {
  if (isScanning) return;
  doClearAll();
});

// Inicialización
updateActionsVisibility();
showHome();

// Precarga silenciosamente la carpeta de destino memorizada (si ya se eligió en un
// lanzamiento anterior), para no tener que pedirla de nuevo en el primer escaneo.
if (window.electronAPI) {
  window.electronAPI.getSavedDestination().then((saved) => {
    if (saved) destinationFolderPath = saved;
  });
}