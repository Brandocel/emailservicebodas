// services/emailService.js

require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const config = require('../config/config');

// Configurar SendGrid
sgMail.setApiKey(config.sendgrid.apiKey);

class EmailService {
  constructor() {
    this.senderEmail = config.sendgrid.senderEmail;
    this.senderName = config.sendgrid.senderName;
    // Dos correos de notificación
    this.notificationEmails = [
      process.env.NOTIFICATION_EMAIL,
      process.env.NOTIFICATION_EMAIL2
    ].filter(Boolean);
  }

  /**
   * Genera el HTML para el email de confirmación
   */
  generateRsvpConfirmationHTML(rsvpData) {
    const { 
      nombre, 
      numeroAcompañantes, 
      menu, 
      acompañantes, 
      alergias, 
      emailRemitente 
    } = rsvpData;

    console.log('🍽️ Datos del menú recibidos en servicio:', { menu, acompañantes, alergias });

    const formatearPlatillo = platillo => {
      if (!platillo) return 'No especificado';
      return platillo
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    };

    const acompañantesHTML = acompañantes.length > 0
      ? `<div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
           <h3 style="color: #8B4513; margin-bottom: 15px;">👥 Acompañantes:</h3>
           ${acompañantes.map((ac, idx) => `
             <div style="margin-bottom: 10px; padding: 10px; background-color: white; border-radius: 4px;">
               <strong>${idx + 1}. ${ac.nombre}</strong><br>
               <span style="color: #666;">Platillo: ${formatearPlatillo(ac.platillo)}</span>
               ${ac.alergias ? `<br><span style="color: #d63384; font-size:0.9em;">⚠️ Alergias: ${ac.alergias}</span>` : ''}
             </div>
           `).join('')}
         </div>`
      : '';

    const alergiasInvitadoHTML = alergias
      ? `<div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
           <h3 style="color: #856404; margin-bottom: 10px;">⚠️ Tus Alergias/Restricciones:</h3>
           <p style="color: #856404; margin: 0;">${alergias}</p>
         </div>`
      : '';

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Asistencia - Boda Rebeca y Enrique</title>
      </head>
      <body style="font-family: Georgia, serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8B4513; font-size: 2.5em; margin-bottom: 10px;">💕 Rebeca & Enrique 💕</h1>
          <p style="color: #D4AF37; font-size: 1.2em; font-style: italic;">Nuestra Boda</p>
        </div>

        <div style="background: linear-gradient(135deg, #F0EAD6 0%, #DDD6C1 100%); padding: 30px; border-radius: 15px; margin-bottom: 30px;">
          <h2 style="color: #8B4513; text-align: center; margin-bottom: 20px;">✨ ¡Confirmación Recibida! ✨</h2>
          <p style="text-align: center; font-size: 1.1em; color: #5D4037;">
            Hemos recibido tu confirmación de asistencia. ¡Estamos emocionados de celebrar contigo!
          </p>
        </div>

        <div style="background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <h3 style="color: #8B4513; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">📋 Detalles de tu Confirmación</h3>
          <div style="margin: 20px 0;">
            <p><strong>👤 Invitado principal:</strong> ${nombre}</p>
            <p><strong>📧 Email:</strong> ${emailRemitente}</p>
            <p><strong>👥 Número de acompañantes:</strong> ${numeroAcompañantes}</p>
            <p><strong>🍽️ Menú seleccionado:</strong> ${formatearPlatillo(menu)}</p>
          </div>
          ${acompañantesHTML}
          ${alergiasInvitadoHTML}
        </div>

        <div style="background-color: #E8F5E8; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
          <h3 style="color: #2E7D32; text-align: center; margin-bottom: 15px;">📅 Información del Evento</h3>
          <div style="text-align: center;">
            <p><strong>Fecha:</strong> 25 de Octubre</p>
            <p><strong>Hora:</strong> 4:00 PM</p>
            <p><strong>Lugar:</strong> Iglesia Santa María de las Cumbres</p>
            <p><strong>Dirección:</strong> Martha Chávez Padrón, 77560 Alfredo V.Bonfil, Q.R.</p>
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="font-style: italic; color: #666; font-size: 1.1em;">
            "El amor es la fuerza más poderosa del mundo, y sin embargo, es la más humilde imaginable."
          </p>
        </div>

        <div style="background-color: #FFF8E1; padding: 20px; border-radius: 10px; text-align: center;">
          <h3 style="color: #F57C00; margin-bottom: 15px;">💌 ¿Necesitas hacer cambios?</h3>
          <p style="color: #E65100;">
            Si necesitas modificar tu confirmación o tienes alguna pregunta, 
            por favor responde a este correo o contáctanos directamente.
          </p>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #D4AF37;">
          <p style="color: #8B4513; font-size: 1.2em; font-weight: bold;">
            ¡No podemos esperar a celebrar contigo! 🎉
          </p>
          <p style="color: #666; font-style: italic;">
            Con amor,<br>
            Rebeca y Enrique
          </p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Envía email de confirmación RSVP al invitado y a dos correos de notificación
   */
  async sendRsvpConfirmation(rsvpData) {
    try {
      const htmlContent = this.generateRsvpConfirmationHTML(rsvpData);

      // Todos los destinatarios
      const recipients = [
        rsvpData.emailRemitente,
        ...this.notificationEmails
      ];

      const msg = {
        to: recipients,
        from: { email: this.senderEmail, name: this.senderName },
        subject: `💕 Confirmación de Asistencia - ${rsvpData.nombre}`,
        html: htmlContent
      };

      const [response] = await sgMail.send(msg);

      console.log('🔔 Notificación enviada a:', recipients.join(', '));

      return {
        success: true,
        messageId: response.headers['x-message-id']
      };
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      if (error.response) {
        const { status, body } = error.response;
        return {
          success: false,
          error: `Error ${status}: ${body.errors?.[0]?.message || 'Error desconocido'}`,
          code: status
        };
      }
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Valida configuración de SendGrid
   */
  async validateConfiguration() {
    try {
      const testMsg = {
        to: this.senderEmail,
        from: this.senderEmail,
        subject: 'Test de configuración - API Boda',
        text: 'Este es un mensaje de prueba para verificar la configuración de SendGrid.'
      };
      await sgMail.send(testMsg);
      return { valid: true, message: 'Configuración válida' };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
        details: error.response?.body
      };
    }
  }
}

module.exports = new EmailService();
