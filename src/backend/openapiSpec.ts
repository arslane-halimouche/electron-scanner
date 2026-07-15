// Documentación OpenAPI (Swagger) de la API local expuesta por server.ts (puerto 8888).
// Sirve como contrato claro para el equipo frontend: solo necesitan este archivo
// para saber qué rutas llamar, con qué parámetros, y qué respuestas esperar.
// Consultable de forma interactiva en http://localhost:8888/api-docs una vez lanzada la app.

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Scanner Electron - API local',
    version: '1.0.0',
    description:
      'API HTTP local (puerto 8888) lanzada por la aplicación Electron. Sirve de intermediario entre el frontend y los scripts PowerShell que controlan el escáner físico (WIA).',
  },
  servers: [{ url: 'http://localhost:8888', description: 'Servidor local Electron' }],
  tags: [
    { name: 'Estado', description: 'Verificación de que el servidor local está funcionando' },
    { name: 'Dispositivos', description: 'Listado de los escáneres disponibles' },
    { name: 'Escaneo', description: 'Inicio y seguimiento de escaneos (simple y multipágina/ADF)' },
    { name: 'Importación', description: 'Conversión de archivos importados' },
  ],
  components: {
    schemas: {
      ScannerDevice: {
        type: 'object',
        properties: {
          index: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Canon CanoScan LiDE 300' },
          port: { type: 'string', example: 'USB001', nullable: true },
        },
        required: ['index', 'name'],
      },
      ScanErrorCode: {
        type: 'string',
        enum: [
          'NOT_FOUND',
          'DEVICE_OFFLINE',
          'PAPER_JAM',
          'BUSY',
          'NO_PAPER',
          'UNKNOWN',
          'STOPPED',
          'READ_ERROR',
        ],
      },
      ScanError: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Hay un atasco de papel en el escáner. Revisa el alimentador.' },
          code: { '$ref': '#/components/schemas/ScanErrorCode' },
        },
      },
      MultiScanState: {
        type: 'object',
        properties: {
          running: { type: 'boolean', example: true },
          images: {
            type: 'array',
            items: { type: 'string', format: 'byte', description: 'Data URL en base64 (image/jpeg)' },
          },
          error: { type: 'string', nullable: true },
          code: {
            allOf: [{ '$ref': '#/components/schemas/ScanErrorCode' }],
            nullable: true,
          },
        },
      },
    },
  },
  paths: {
    '/status': {
      get: {
        tags: ['Estado'],
        summary: 'Verifica que el servidor local está activo',
        responses: {
          '200': {
            description: 'Servidor operativo',
            content: {
              'application/json': {
                example: { status: 'ok', message: 'Servidor Electron funcionando' },
              },
            },
          },
        },
      },
    },

    '/devices': {
      get: {
        tags: ['Dispositivos'],
        summary: 'Lista los escáneres físicos detectados',
        responses: {
          '200': {
            description: 'Listado de escáneres disponibles',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    devices: {
                      type: 'array',
                      items: { '$ref': '#/components/schemas/ScannerDevice' },
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'No se pudieron listar los escáneres (error del script PowerShell)',
            content: {
              'application/json': { example: { error: 'No se pudo listar escáneres' } },
            },
          },
        },
      },
    },

    '/scan': {
      get: {
        tags: ['Escaneo'],
        summary: 'Escaneo de una sola página (síncrono, cama plana)',
        description:
          "Se puede interrumpir en cualquier momento vía /scan/stop (responde entonces con code: 'STOPPED').",
        parameters: [
          {
            name: 'scannerIndex',
            in: 'query',
            required: false,
            schema: { type: 'string', default: '1' },
            description: 'Índice del escáner (obtenido vía /devices). Por defecto: 1.',
          },
        ],
        responses: {
          '200': {
            description: 'Página escaneada correctamente',
            content: {
              'application/json': {
                example: { status: 'ok', images: ['data:image/jpeg;base64,...'] },
              },
            },
          },
          '400': {
            description: 'Error de escaneo (atasco, sin papel, escáner desconectado...)',
            content: {
              'application/json': { schema: { '$ref': '#/components/schemas/ScanError' } },
            },
          },
        },
      },
    },

    '/scan/start': {
      get: {
        tags: ['Escaneo'],
        summary: 'Inicia un escaneo multipágina asíncrono (ADF)',
        description:
          'Lanza el escaneo en segundo plano. El frontend debe entonces consultar /scan/poll regularmente (ej: cada 700ms) para obtener las páginas a medida que se escanean.',
        parameters: [
          {
            name: 'scannerIndex',
            in: 'query',
            required: false,
            schema: { type: 'string', default: '1' },
          },
        ],
        responses: {
          '200': {
            description: 'Escaneo iniciado',
            content: { 'application/json': { example: { status: 'started' } } },
          },
        },
      },
    },

    '/scan/poll': {
      get: {
        tags: ['Escaneo'],
        summary: 'Estado actual del escaneo multipágina en curso',
        description:
          "A llamar en bucle durante un escaneo ADF. 'images' contiene todas las páginas escaneadas hasta ahora (base64). 'running: false' indica el final (éxito, error o parada manual).",
        responses: {
          '200': {
            description: 'Estado del escaneo',
            content: {
              'application/json': { schema: { '$ref': '#/components/schemas/MultiScanState' } },
            },
          },
        },
      },
    },

    '/scan/stop': {
      get: {
        tags: ['Escaneo'],
        summary: 'Detiene el escaneo en curso (simple o multipágina)',
        description:
          'Funciona tanto para un escaneo simple (/scan) en curso como para un escaneo multipágina ADF (/scan/start) — solo puede haber un escaneo activo a la vez.',
        responses: {
          '200': {
            description: 'Escaneo detenido',
            content: { 'application/json': { example: { status: 'stopped' } } },
          },
        },
      },
    },

    '/convert': {
      post: {
        tags: ['Importación'],
        summary: 'Endpoint actualmente en placeholder (aún no conectado a una conversión real)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['dataUrl', 'filename'],
                properties: {
                  dataUrl: { type: 'string', format: 'byte' },
                  filename: { type: 'string', example: 'document.pdf' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Devuelve tal cual lo que se envió (ninguna conversión real por el momento)',
            content: {
              'application/json': {
                example: { status: 'ok', dataUrl: 'data:application/pdf;base64,...', filename: 'document.pdf' },
              },
            },
          },
          '400': {
            description: 'Falta dataUrl o filename',
            content: { 'application/json': { example: { error: 'dataUrl y filename son requeridos' } } },
          },
        },
      },
    },
  },
};