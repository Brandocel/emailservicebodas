require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    senderEmail: process.env.SENDER_EMAIL,
    senderName: process.env.SENDER_NAME || 'Rebeca y Enrique - Nuestra Boda'
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS === '*' ? 
      '*' : 
      (process.env.ALLOWED_ORIGINS ? 
        process.env.ALLOWED_ORIGINS.split(',') : 
        ['http://localhost:3000', 'http://localhost:5173','https://rebecayenrique.blank.com.mx'])
  },
  rateLimit: {
    maxRequestsPerMinute: parseInt(process.env.MAX_REQUESTS_PER_MINUTE) || 10
  }
};

// Validar configuraciones críticas
if (!config.sendgrid.apiKey) {
  throw new Error('❌ SENDGRID_API_KEY es requerido');
}

if (!config.sendgrid.senderEmail) {
  throw new Error('❌ SENDER_EMAIL es requerido');
}

module.exports = config;
