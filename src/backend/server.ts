import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './openapiSpec';
import {
  listScanners,
  scanDocument,
  startMultiScan,
  stopMultiScan,
  getMultiScanState,
  ScanError,
} from './scanService';

export function createServer(): Express {
  const server = express();
  server.use(cors());
  server.use(express.json({ limit: '50mb' }));

  // Documentación interactiva de la API, disponible en http://localhost:8888/api-docs
  server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

  server.get('/status', (_req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Servidor Electron funcionando' });
  });

  server.get('/devices', async (_req: Request, res: Response) => {
    try {
      const devices = await listScanners();
      res.json({ devices });
    } catch (err) {
      console.error('Error listando escáneres:', err);
      res.status(500).json({ error: 'No se pudo listar escáneres' });
    }
  });

  // Escaneo de una sola página (síncrono, rápido)
  server.get('/scan', async (req: Request, res: Response) => {
    const scannerIndex = (req.query.scannerIndex as string) || '1';
    try {
      const images = await scanDocument(scannerIndex);
      res.json({ status: 'ok', images });
    } catch (err) {
      const scanErr = err as ScanError;
      console.error('Error de escaneo:', scanErr);
      res.status(400).json({ error: scanErr.message, code: scanErr.code });
    }
  });

  // Escaneo multipágina (asíncrono, con seguimiento + parada)
  server.get('/scan/start', (req: Request, res: Response) => {
    const scannerIndex = (req.query.scannerIndex as string) || '1';
    startMultiScan(scannerIndex);
    res.json({ status: 'started' });
  });

  server.get('/scan/poll', (_req: Request, res: Response) => {
    res.json(getMultiScanState());
  });

  server.get('/scan/stop', (_req: Request, res: Response) => {
    stopMultiScan();
    res.json({ status: 'stopped' });
  });

  // Subida de archivo existente en base64
  server.post('/convert', (req: Request, res: Response) => {
    const { dataUrl, filename } = req.body as { dataUrl: string; filename: string };
    if (!dataUrl || !filename) {
      res.status(400).json({ error: 'dataUrl y filename son requeridos' });
      return;
    }
    res.json({ status: 'ok', dataUrl, filename });
  });

  return server;
}