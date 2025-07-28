const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const validationMiddleware = require('../middleware/validationMiddleware');

/**
 * @swagger
 * /api/email/rsvp:
 *   post:
 *     tags: [Email]
 *     summary: Envía confirmación de RSVP por email
 *     description: |
 *       Envía un email de confirmación elegante y personalizado al invitado con todos los detalles de su RSVP.
 *       
 *       **Características del email:**
 *       - ✨ Diseño hermoso y romántico específico para bodas
 *       - 📱 Responsive design que se ve bien en móviles y desktop
 *       - 🎯 Información clara y organizada de la confirmación
 *       - 👥 Lista detallada de acompañantes y sus menús
 *       - ⚠️ Sección especial para alergias alimentarias
 *       - 💕 Mensaje personalizado de los novios
 *       
 *       **Proceso:**
 *       1. Valida todos los datos del formulario
 *       2. Genera un email HTML hermoso con los detalles
 *       3. Envía el email usando SendGrid
 *       4. Retorna confirmación del envío exitoso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RsvpData'
 *           examples:
 *             confirmacion_simple:
 *               summary: Confirmación simple sin acompañantes
 *               value:
 *                 nombre: "María González"
 *                 emailRemitente: "maria@ejemplo.com"
 *                 numeroAcompañantes: "0"
 *                 menu: "pollo"
 *                 agregarAcompañantes: false
 *                 mismoPlato: false
 *                 acompañantes: []
 *                 alergias: "Alérgica a los frutos secos"
 *             confirmacion_con_acompañantes:
 *               summary: Confirmación con 2 acompañantes
 *               value:
 *                 nombre: "Juan Carlos Pérez"
 *                 emailRemitente: "juan.perez@gmail.com"
 *                 numeroAcompañantes: "2"
 *                 menu: "pescado"
 *                 alergias: "Alérgico a los mariscos"
 *                 agregarAcompañantes: true
 *                 mismoPlato: false
 *                 acompañantes:
 *                   - nombre: "Ana María López"
 *                     platillo: "vegetariano"
 *                     alergias: "Alérgica a los frutos secos"
 *                   - nombre: "Carlos Roberto Díaz"
 *                     platillo: "pasta"
 *                     alergias: "Intolerante a la lactosa"

 *             confirmacion_con_alergias:
 *               summary: Confirmación con restricciones alimentarias
 *               value:
 *                 nombre: "Sofía Martínez"
 *                 emailRemitente: "sofia.martinez@hotmail.com"
 *                 numeroAcompañantes: "1"
 *                 menu: "vegetariano"
 *                 alergias: "Vegetariana estricta"
 *                 agregarAcompañantes: true
 *                 mismoPlato: false
 *                 acompañantes:
 *                   - nombre: "Miguel Ángel Torres"
 *                     platillo: "pollo"
 *                     alergias: "Alérgico al gluten"

 *     responses:
 *       200:
 *         description: Email enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         messageId:
 *                           type: string
 *                           description: ID único del mensaje enviado por SendGrid
 *                           example: "14c5d75ce93.dfd.64b469cdff.20190424-155228.4492.0@ismtpd0021p1las1.sendgrid.net"
 *                         recipient:
 *                           type: string
 *                           format: email
 *                           description: Email del destinatario
 *                           example: "maria@ejemplo.com"
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-06-30T10:30:00.000Z"
 *             example:
 *               success: true
 *               message: "Confirmación enviada exitosamente"
 *               data:
 *                 messageId: "14c5d75ce93.dfd.64b469cdff.20190424-155228.4492.0@ismtpd0021p1las1.sendgrid.net"
 *                 recipient: "maria@ejemplo.com"
 *                 timestamp: "2025-06-30T10:30:00.000Z"
 *               timestamp: "2025-06-30T10:30:00.000Z"
 *       400:
 *         description: Error de validación en los datos enviados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               email_invalido:
 *                 summary: Email con formato inválido
 *                 value:
 *                   success: false
 *                   message: "Datos de validación incorrectos"
 *                   error:
 *                     - field: "emailRemitente"
 *                       message: "Debes proporcionar un email válido"
 *                   code: "VALIDATION_ERROR"
 *                   timestamp: "2025-06-30T10:30:00.000Z"
 *               menu_invalido:
 *                 summary: Opción de menú no válida
 *                 value:
 *                   success: false
 *                   message: "Datos de validación incorrectos"
 *                   error:
 *                     - field: "menu"
 *                       message: "Debes seleccionar un menú válido"
 *                   code: "VALIDATION_ERROR"
 *                   timestamp: "2025-06-30T10:30:00.000Z"
 *               acompañantes_inconsistentes:
 *                 summary: Número de acompañantes no coincide con la lista
 *                 value:
 *                   success: false
 *                   message: "Datos de validación incorrectos"
 *                   error:
 *                     - field: "acompañantes"
 *                       message: "Debes agregar exactamente 2 acompañante(s)"
 *                   code: "VALIDATION_ERROR"
 *                   timestamp: "2025-06-30T10:30:00.000Z"
 *       429:
 *         description: Demasiadas solicitudes (rate limit excedido)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Demasiadas solicitudes, intenta nuevamente en un minuto"
 *               code: "RATE_LIMIT_EXCEEDED"
 *               timestamp: "2025-06-30T10:30:00.000Z"
 *       500:
 *         description: Error interno del servidor o problema con SendGrid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               error_sendgrid:
 *                 summary: Error de SendGrid
 *                 value:
 *                   success: false
 *                   message: "Error enviando confirmación"
 *                   error: "Error 400: The provided authorization grant is invalid, expired, or revoked"
 *                   code: "EMAIL_SEND_ERROR"
 *                   timestamp: "2025-06-30T10:30:00.000Z"
 *               error_interno:
 *                 summary: Error interno del servidor
 *                 value:
 *                   success: false
 *                   message: "Error interno del servidor"
 *                   error: "Ocurrió un error inesperado"
 *                   code: "INTERNAL_ERROR"
 *                   timestamp: "2025-06-30T10:30:00.000Z"
 */
router.post('/rsvp', 
  validationMiddleware.validateJsonContent,
  emailController.sendRsvpConfirmation
);

/**
 * @swagger
 * /api/email/status:
 *   get:
 *     tags: [Email]
 *     summary: Verifica el estado del servicio de email
 *     description: |
 *       Verifica que el servicio de SendGrid esté funcionando correctamente y que la configuración sea válida.
 *       
 *       **Lo que verifica:**
 *       - ✅ Conectividad con SendGrid
 *       - 🔑 Validez de la API Key
 *       - 📧 Email remitente configurado correctamente
 *       - 🚀 Estado general del servicio
 *       
 *       **Útil para:**
 *       - Monitoreo del servicio
 *       - Diagnóstico de problemas
 *       - Health checks automáticos
 *     responses:
 *       200:
 *         description: Servicio de email funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: "operational"
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *             example:
 *               success: true
 *               message: "Servicio de email funcionando correctamente"
 *               data:
 *                 status: "operational"
 *                 timestamp: "2025-06-30T10:30:00.000Z"
 *               timestamp: "2025-06-30T10:30:00.000Z"
 *       503:
 *         description: Servicio de email no disponible
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               api_key_invalida:
 *                 summary: API Key de SendGrid inválida
 *                 value:
 *                   success: false
 *                   message: "Servicio de email no disponible"
 *                   error: "The provided authorization grant is invalid, expired, or revoked"
 *                   code: "SERVICE_UNAVAILABLE"
 *                   timestamp: "2025-06-30T10:30:00.000Z"
 *               conectividad:
 *                 summary: Problema de conectividad
 *                 value:
 *                   success: false
 *                   message: "Servicio de email no disponible"
 *                   error: "Network timeout"
 *                   code: "SERVICE_UNAVAILABLE"
 *                   timestamp: "2025-06-30T10:30:00.000Z"
 *       500:
 *         description: Error verificando el servicio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/status', emailController.checkEmailServiceStatus);

/**
 * @swagger
 * /api/email/test:
 *   post:
 *     tags: [Testing]
 *     summary: Envía un email de prueba
 *     description: |
 *       Envía un email de prueba con datos de ejemplo para verificar que todo funcione correctamente.
 *       
 *       **⚠️ Solo para desarrollo y testing**
 *       
 *       **Qué hace:**
 *       - 📧 Envía un email con datos de prueba predefinidos
 *       - 🎨 Usa el mismo template que los emails reales
 *       - ✅ Verifica toda la cadena de envío
 *       - 🔍 Útil para debuggear problemas de configuración
 *       
 *       **Datos de prueba incluidos:**
 *       - Invitado: "Usuario de Prueba"
 *       - 1 acompañante: "Acompañante de Prueba"
 *       - Diferentes opciones de menú
 *       - Alergias de ejemplo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestEmailRequest'
 *           example:
 *             email: "test@ejemplo.com"
 *     responses:
 *       200:
 *         description: Email de prueba enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         messageId:
 *                           type: string
 *                           description: ID del mensaje de SendGrid
 *                         recipient:
 *                           type: string
 *                           format: email
 *                           description: Email donde se envió la prueba
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *             example:
 *               success: true
 *               message: "Email de prueba enviado exitosamente"
 *               data:
 *                 messageId: "14c5d75ce93.dfd.64b469cdff.20190424-155228.4492.0@ismtpd0021p1las1.sendgrid.net"
 *                 recipient: "test@ejemplo.com"
 *                 timestamp: "2025-06-30T10:30:00.000Z"
 *               timestamp: "2025-06-30T10:30:00.000Z"
 *       400:
 *         description: Email no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               email_faltante:
 *                 summary: Email no enviado en la petición
 *                 value:
 *                   success: false
 *                   message: "Email requerido"
 *                   error: "Debes proporcionar un email para la prueba"
 *                   code: "MISSING_EMAIL"
 *                   timestamp: "2025-06-30T10:30:00.000Z"
 *               email_invalido:
 *                 summary: Formato de email inválido
 *                 value:
 *                   success: false
 *                   message: "Tipo de contenido inválido"
 *                   error: "El Content-Type debe ser application/json"
 *                   code: "INVALID_CONTENT_TYPE"
 *                   timestamp: "2025-06-30T10:30:00.000Z"
 *       500:
 *         description: Error enviando email de prueba
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/test', 
  validationMiddleware.validateJsonContent,
  emailController.sendTestEmail
);

module.exports = router;
