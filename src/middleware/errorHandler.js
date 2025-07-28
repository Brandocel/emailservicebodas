const config = require('../config/config');
const { createErrorResponse } = require('../utils/responseHelper');

/**
 * Middleware global de manejo de errores
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error capturado:', err);

  // Error de validación de Joi
  if (err.isJoi) {
    const errors = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json(
      createErrorResponse('Error de validación', errors, 'VALIDATION_ERROR')
    );
  }

  // Error de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json(
      createErrorResponse('JSON inválido', 'El formato del JSON enviado no es válido', 'INVALID_JSON')
    );
  }

  // Error de límite de tamaño
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json(
      createErrorResponse('Archivo demasiado grande', 'El tamaño del archivo excede el límite permitido', 'FILE_TOO_LARGE')
    );
  }

  // Error de rate limiting
  if (err.code === 'RATE_LIMIT_EXCEEDED') {
    return res.status(429).json(
      createErrorResponse('Demasiadas solicitudes', 'Has excedido el límite de solicitudes por minuto', 'RATE_LIMIT_EXCEEDED')
    );
  }

  // Errores de SendGrid
  if (err.response && err.response.body && err.response.body.errors) {
    const sendGridError = err.response.body.errors[0];
    return res.status(err.code || 500).json(
      createErrorResponse('Error del servicio de email', sendGridError.message, 'SENDGRID_ERROR')
    );
  }

  // Error genérico del servidor
  res.status(500).json(
    createErrorResponse(
      'Error interno del servidor',
      config.nodeEnv === 'development' ? err.message : 'Ha ocurrido un error inesperado',
      'INTERNAL_ERROR'
    )
  );
};

module.exports = errorHandler;
