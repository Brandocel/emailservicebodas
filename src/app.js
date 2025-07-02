const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const config = require('./config/config');
const { specs, swaggerUi, swaggerOptions } = require('./config/swagger');
const emailRoutes = require('./routes/emailRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

const app = express();

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      fontSrc: ["'self'", "https:", "http:", "data:"],
      connectSrc: ["'self'", "https:", "http:"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      childSrc: ["'self'"]
    }
  }
}));

// Configuración de CORS
app.use(cors({
  origin: config.cors.allowedOrigins === '*' ? true : config.cors.allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: config.rateLimit.maxRequestsPerMinute,
  message: {
    error: 'Demasiadas solicitudes, intenta nuevamente en un minuto',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Parseo de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuración específica para Swagger UI en servidores HTTP
app.use('/api-docs', (req, res, next) => {
  // Remover CSP restrictivo para Swagger UI
  res.removeHeader('Content-Security-Policy');
  res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: http: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https: http:;");
  next();
});

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(specs, swaggerOptions));

// Redirección desde la raíz a la documentación
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API de correos para boda funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    documentation: '/api-docs'
  });
});

// Rutas principales
app.use('/api/email', emailRoutes);

// Middleware de manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
