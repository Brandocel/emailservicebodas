/**
 * @swagger
 * /:
 *   get:
 *     tags: [Health]
 *     summary: Redirección a la documentación
 *     description: Redirige automáticamente a la documentación de la API
 *     responses:
 *       302:
 *         description: Redirección a /api-docs
 */

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Verifica el estado del servidor
 *     description: |
 *       Endpoint básico para verificar que el servidor esté funcionando correctamente.
 *       
 *       **Información que retorna:**
 *       - ✅ Estado del servidor (siempre "ok" si responde)
 *       - 🕐 Timestamp actual
 *       - 🌍 Entorno de ejecución (development/production)
 *       - 📚 Link a la documentación
 *       
 *       **Útil para:**
 *       - Health checks de monitoreo
 *       - Verificar que el servidor esté activo
 *       - Load balancers y orquestadores
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                   description: Estado del servidor
 *                 message:
 *                   type: string
 *                   example: "API de correos para boda funcionando correctamente"
 *                   description: Mensaje descriptivo
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-30T10:30:00.000Z"
 *                   description: Timestamp de la respuesta
 *                 environment:
 *                   type: string
 *                   enum: ["development", "production", "test"]
 *                   example: "development"
 *                   description: Entorno de ejecución
 *                 documentation:
 *                   type: string
 *                   example: "/api-docs"
 *                   description: URL de la documentación
 *             example:
 *               status: "ok"
 *               message: "API de correos para boda funcionando correctamente"
 *               timestamp: "2025-06-30T10:30:00.000Z"
 *               environment: "development"
 *               documentation: "/api-docs"
 */

const app = require('./src/app');
const config = require('./src/config/config');

const PORT = config.port || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📧 API de correos para boda lista`);
  console.log(`🌍 Entorno: ${config.nodeEnv}`);
});

// Manejo de errores del servidor
server.on('error', (error) => {
  console.error('❌ Error del servidor:', error);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

module.exports = server;
