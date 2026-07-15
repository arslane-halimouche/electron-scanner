import { contextBridge, ipcRenderer } from 'electron';

export interface SavePdfFile {
  filename: string;
  data: ArrayBuffer;
}

contextBridge.exposeInMainWorld('electronAPI', {
  // Abre el selector de carpeta nativo de Electron. Devuelve la ruta elegida, o null si se canceló.
  chooseDestinationFolder: (): Promise<string | null> => ipcRenderer.invoke('choose-destination-folder'),

  // Recupera la carpeta de destino memorizada en un lanzamiento anterior (o null si aún
  // no se ha elegido ninguna).
  getSavedDestination: (): Promise<string | null> => ipcRenderer.invoke('get-saved-destination'),

  // Memoriza de forma duradera (en disco, entre lanzamientos de la app) la carpeta elegida.
  saveDestination: (folderPath: string): Promise<{ success: boolean }> =>
    ipcRenderer.invoke('save-destination', folderPath),

  // Escribe cada archivo PDF en la subcarpeta fija "Scan" creada dentro de la carpeta
  // de destino, vía fs en el proceso principal.
  savePdfsToFolder: (
    destinationFolder: string,
    files: SavePdfFile[]
  ): Promise<{ success: boolean; savedPath?: string }> =>
    ipcRenderer.invoke('save-pdfs', destinationFolder, files),
});