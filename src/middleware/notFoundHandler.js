const { createErrorResponse } = require('../utils/responseHelper');

/**
 * Middleware para manejar rutas no encontradas
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json(
    createErrorResponse(
      'Ruta no encontrada',
      `La ruta ${req.method} ${req.originalUrl} no existe`,
      'ROUTE_NOT_FOUND'
    )
  );
};

module.exports = notFoundHandler;
