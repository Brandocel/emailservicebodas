const { createErrorResponse } = require('../utils/responseHelper');

/**
 * Middleware para validar que el contenido sea JSON válido
 */
const validateJsonContent = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.get('Content-Type');
    
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json(
        createErrorResponse(
          'Tipo de contenido inválido',
          'El Content-Type debe ser application/json',
          'INVALID_CONTENT_TYPE'
        )
      );
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json(
        createErrorResponse(
          'Cuerpo de la solicitud vacío',
          'Se requiere un cuerpo de solicitud con datos válidos',
          'EMPTY_BODY'
        )
      );
    }
  }

  next();
};

/**
 * Middleware para validar campos específicos
 */
const validateRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json(
        createErrorResponse(
          'Campos requeridos faltantes',
          `Los siguientes campos son requeridos: ${missingFields.join(', ')}`,
          'MISSING_REQUIRED_FIELDS'
        )
      );
    }

    next();
  };
};

/**
 * Middleware para sanitizar datos de entrada
 */
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    // Función recursiva para limpiar strings
    const sanitizeObject = (obj) => {
      for (let key in obj) {
        if (typeof obj[key] === 'string') {
          // Eliminar caracteres potencialmente peligrosos
          obj[key] = obj[key].trim().replace(/[<>]/g, '');
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        }
      }
    };

    sanitizeObject(req.body);
  }

  next();
};

module.exports = {
  validateJsonContent,
  validateRequiredFields,
  sanitizeInput
};
