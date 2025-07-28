const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Correos para Boda - Rebeca y Enrique',
      version: '1.0.0',
      description: `
        API profesional para el envío de confirmaciones de RSVP para bodas usando SendGrid.
        
        ## Características principales:
        - ✅ Envío de emails de confirmación RSVP elegantes y personalizados
        - 🔒 Validación robusta de datos con Joi
        - 🚀 Rate limiting para prevenir spam
        - 🛡️ Middlewares de seguridad integrados
        - 📱 Emails responsive con HTML y texto plano
        - 🎨 Diseño hermoso específicamente para bodas
        - 📊 Logging detallado y manejo profesional de errores
        
        ## Uso típico:
        1. El invitado llena el formulario de confirmación en el frontend
        2. El frontend envía los datos a \`POST /api/email/rsvp\`
        3. La API valida los datos y envía un email de confirmación hermoso
        4. El invitado recibe la confirmación en su email
        
        ## Datos de ejemplo para pruebas:
        Puedes usar el endpoint \`POST /api/email/test\` para enviar un email de prueba.
      `,
      contact: {
        name: 'API Support',
        email: 'rebecayenrique.nuestraboda@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://cj-keyboards-radical-since.trycloudflare.com',
        description: 'Producción HTTPS (Cloudflare Tunnel)'
      },
      {
        url: 'http://187.157.236.135:4000',
        description: 'Servidor HTTP (Solo para pruebas locales)'
      },
      {
        url: `http://localhost:${config.port}`,
        description: 'Desarrollo Local'
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'Endpoints de salud y estado del servidor'
      },
      {
        name: 'Email',
        description: 'Endpoints para envío de correos de confirmación RSVP'
      },
      {
        name: 'Testing',
        description: 'Endpoints para pruebas y desarrollo'
      }
    ],
    components: {
      schemas: {
        RsvpData: {
          type: 'object',
          required: ['nombre', 'emailRemitente', 'numeroAcompañantes', 'menu'],
          properties: {
            nombre: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Nombre completo del invitado principal',
              example: 'María González Pérez'
            },
            emailRemitente: {
              type: 'string',
              format: 'email',
              description: 'Email del invitado donde recibirá la confirmación',
              example: 'maria.gonzalez@gmail.com'
            },
            numeroAcompañantes: {
              type: 'string',
              pattern: '^\\d+$',
              description: 'Número de acompañantes (como string)',
              example: '2'
            },
            menu: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'Opción de menú seleccionada (ej: pollo, pasta, vegetariano, pescado, salmón, caldo, etc.)',
              example: 'filete de salmón'
            },
            alergias: {
              type: 'string',
              maxLength: 500,
              description: 'Alergias o restricciones alimentarias del invitado principal',
              example: 'Alérgica a los mariscos'
            },
            agregarAcompañantes: {
              type: 'boolean',
              description: 'Si se deben incluir detalles de los acompañantes',
              example: true,
              default: false
            },
            mismoPlato: {
              type: 'boolean',
              description: 'Si todos los acompañantes tienen el mismo platillo',
              example: false,
              default: false
            },
            acompañantes: {
              type: 'array',
              description: 'Lista de acompañantes con sus detalles (nombre, platillo y alergias)',
              items: {
                $ref: '#/components/schemas/Acompanante'
              }
            }
          },
          example: {
            nombre: 'María González Pérez',
            emailRemitente: 'maria.gonzalez@gmail.com',
            numeroAcompañantes: '2',
            menu: 'filete de salmón',
            alergias: 'Alérgica a los mariscos',
            agregarAcompañantes: true,
            mismoPlato: false,
            acompañantes: [
              {
                nombre: 'Juan Carlos González',
                platillo: 'pasta primavera',
                alergias: 'Intolerante a la lactosa'
              },
              {
                nombre: 'Ana María López',
                platillo: 'pollo a la plancha',
                alergias: 'Vegetariana estricta'
              }
            ]
          }
        },
        Acompanante: {
          type: 'object',
          required: ['nombre', 'platillo'],
          properties: {
            nombre: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Nombre completo del acompañante',
              example: 'Juan Carlos González'
            },
            platillo: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'Opción de menú para el acompañante (ej: pollo, pasta, vegetariano, pescado, salmón, caldo, etc.)',
              example: 'pasta primavera'
            },
            alergias: {
              type: 'string',
              maxLength: 500,
              description: 'Alergias o restricciones alimentarias del acompañante (opcional)',
              example: 'Intolerante a la lactosa'
            }
          },
          example: {
            nombre: 'Juan Carlos González',
            platillo: 'pasta primavera',
            alergias: 'Intolerante a la lactosa'
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operación exitosa'
            },
            data: {
              type: 'object',
              description: 'Datos de respuesta específicos del endpoint'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-06-30T10:30:00.000Z'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error en la operación'
            },
            error: {
              oneOf: [
                { type: 'string' },
                { type: 'object' },
                { type: 'array' }
              ],
              description: 'Detalles del error'
            },
            code: {
              type: 'string',
              example: 'ERROR_CODE'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-06-30T10:30:00.000Z'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Datos de validación incorrectos'
            },
            error: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'emailRemitente'
                  },
                  message: {
                    type: 'string',
                    example: 'Debes proporcionar un email válido'
                  }
                }
              }
            },
            code: {
              type: 'string',
              example: 'VALIDATION_ERROR'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        TestEmailRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email donde enviar el correo de prueba',
              example: 'test@ejemplo.com'
            }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './server.js'
  ]
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    validatorUrl: null, // Desactivar validador HTTPS
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    supportedSubmitMethods: ['get', 'post'],
    tryItOutEnabled: true,
    url: null, // Forzar que use la URL actual
    urls: null
  },
  customCssUrl: null, // No usar CSS externo
  customJs: null, // No usar JS externo
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #8B4513; }
    .swagger-ui .scheme-container { background: #F0EAD6; }
    .swagger-ui .opblock.opblock-post { border-color: #D4AF37; }
    .swagger-ui .opblock.opblock-post .opblock-summary { border-color: #D4AF37; background: rgba(212, 175, 55, 0.1); }
    .swagger-ui .opblock.opblock-get { border-color: #8B4513; }
    .swagger-ui .opblock.opblock-get .opblock-summary { border-color: #8B4513; background: rgba(139, 69, 19, 0.1); }
  `,
  customSiteTitle: "API Boda Rebeca y Enrique - Documentación",
  customfavIcon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzhCNDUxMyIvPgo8dGV4dCB4PSI1IiB5PSIyMiIgZm9udC1mYW1pbHk9Ikdlb3JnaWEiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNGMEVBRDYiPvCfkpU8L3RleHQ+Cjwvc3ZnPgo="
};

module.exports = {
  specs,
  swaggerUi,
  swaggerOptions
};
