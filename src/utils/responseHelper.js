/**
 * Crea una respuesta de éxito estandarizada
 */
const createSuccessResponse = (message, data = null) => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

/**
 * Crea una respuesta de error estandarizada
 */
const createErrorResponse = (message, error = null, code = null) => {
  return {
    success: false,
    message,
    error,
    code,
    timestamp: new Date().toISOString()
  };
};

/**
 * Formatea errores de validación
 */
const formatValidationErrors = (errors) => {
  if (Array.isArray(errors)) {
    return errors.map(err => ({
      field: err.field || 'unknown',
      message: err.message || 'Error de validación'
    }));
  }
  return [{ field: 'general', message: errors || 'Error de validación' }];
};

/**
 * Genera un ID único para tracking
 */
const generateTrackingId = () => {
  return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Formatea la respuesta para logs
 */
const formatLogResponse = (req, res, responseData) => {
  return {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    status: res.statusCode,
    response: responseData,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  createSuccessResponse,
  createErrorResponse,
  formatValidationErrors,
  generateTrackingId,
  formatLogResponse
};
