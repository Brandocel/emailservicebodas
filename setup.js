#!/usr/bin/env node

/**
 * Script de inicio rápido para la API de correos de boda
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎉 ¡Bienvenido al configurador de la API de correos para boda!');
console.log('================================================\n');

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const updateEnvFile = (config) => {
  const envPath = path.join(__dirname, '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');

  // Actualizar configuraciones
  Object.keys(config).forEach(key => {
    const value = config[key];
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (envContent.match(regex)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  });

  fs.writeFileSync(envPath, envContent);
};

const main = async () => {
  try {
    console.log('📧 Configuración de SendGrid');
    console.log('-----------------------------');
    
    const apiKey = await askQuestion('Ingresa tu API Key de SendGrid (actual: SG.LNMj_McO...): ');
    const senderEmail = await askQuestion('Ingresa el email del remitente (actual: rebecayenrique.nuestraboda@gmail.com): ');
    const senderName = await askQuestion('Ingresa el nombre del remitente (actual: Rebeca y Enrique - Nuestra Boda): ');
    
    console.log('\n🌐 Configuración del servidor');
    console.log('-----------------------------');
    
    const port = await askQuestion('Puerto del servidor (actual: 3000): ');
    const allowedOrigins = await askQuestion('Dominios permitidos separados por coma (actual: http://localhost:3000,http://localhost:5173): ');
    
    console.log('\n⚡ Configuración de rate limiting');
    console.log('----------------------------------');
    
    const maxRequests = await askQuestion('Máximo de requests por minuto (actual: 10): ');

    // Preparar configuración
    const config = {};
    
    if (apiKey.trim()) config.SENDGRID_API_KEY = apiKey.trim();
    if (senderEmail.trim()) config.SENDER_EMAIL = senderEmail.trim();
    if (senderName.trim()) config.SENDER_NAME = senderName.trim();
    if (port.trim()) config.PORT = port.trim();
    if (allowedOrigins.trim()) config.ALLOWED_ORIGINS = allowedOrigins.trim();
    if (maxRequests.trim()) config.MAX_REQUESTS_PER_MINUTE = maxRequests.trim();

    if (Object.keys(config).length > 0) {
      updateEnvFile(config);
      console.log('\n✅ Configuración actualizada exitosamente!');
    } else {
      console.log('\n💡 No se realizaron cambios en la configuración.');
    }

    console.log('\n🚀 Para iniciar el servidor ejecuta:');
    console.log('   npm run dev (desarrollo)');
    console.log('   npm start (producción)');
    
    console.log('\n📚 Endpoints disponibles:');
    console.log('   GET  /health - Estado del servidor');
    console.log('   POST /api/email/rsvp - Enviar confirmación RSVP');
    console.log('   GET  /api/email/status - Estado del servicio de email');
    console.log('   POST /api/email/test - Enviar email de prueba');

    console.log('\n💕 ¡Que tengan una boda maravillosa!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
};

main();
