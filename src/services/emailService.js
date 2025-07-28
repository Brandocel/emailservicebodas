const sgMail = require('@sendgrid/mail');
const config = require('../config/config');

// Configurar SendGrid
sgMail.setApiKey(config.sendgrid.apiKey);

class EmailService {
  constructor() {
    this.senderEmail = config.sendgrid.senderEmail;
    this.senderName = config.sendgrid.senderName;
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

    // Debug: Log de los datos recibidos en el servicio
    console.log('🍽️ Datos del menú recibidos en servicio:', { menu, acompañantes, alergias });

    // Función para formatear nombres de platillos
    const formatearPlatillo = (platillo) => {
      if (!platillo) return 'No especificado';
      // Capitalizar primera letra de cada palabra
      return platillo.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    };

    const acompañantesHTML = acompañantes.length > 0 ? `
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #8B4513; margin-bottom: 15px;">👥 Acompañantes:</h3>
        ${acompañantes.map((acomp, index) => `
          <div style="margin-bottom: 10px; padding: 10px; background-color: white; border-radius: 4px;">
            <strong>${index + 1}. ${acomp.nombre}</strong><br>
            <span style="color: #666;">Platillo: ${formatearPlatillo(acomp.platillo)}</span>
            ${acomp.alergias ? `<br><span style="color: #d63384; font-size: 0.9em;">⚠️ Alergias: ${acomp.alergias}</span>` : ''}
          </div>
        `).join('')}
      </div>
    ` : '';

    // Mostrar alergias del invitado principal si las tiene
    const alergiasInvitadoHTML = alergias ? `
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <h3 style="color: #856404; margin-bottom: 10px;">⚠️ Tus Alergias/Restricciones:</h3>
        <p style="color: #856404; margin: 0;">${alergias}</p>
      </div>
    ` : '';

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
   * Envía email de confirmación RSVP
   */
  async sendRsvpConfirmation(rsvpData) {
    try {
      const htmlContent = this.generateRsvpConfirmationHTML(rsvpData);
      
      // Email de confirmación al invitado
      const msgToGuest = {
        to: rsvpData.emailRemitente,
        from: {
          email: this.senderEmail,
          name: this.senderName
        },
        subject: '💕 Confirmación de Asistencia - Boda Rebeca y Enrique',
        html: htmlContent,
        text: this.generatePlainTextConfirmation(rsvpData)
      };

      // Email de notificación a los novios
      const msgToCouple = {
        to: this.senderEmail, // A los novios
        from: {
          email: this.senderEmail,
          name: this.senderName
        },
        subject: `🎉 Nueva Confirmación RSVP: ${rsvpData.nombre}`,
        html: this.generateCoupleNotificationHTML(rsvpData),
        text: this.generateCoupleNotificationText(rsvpData)
      };

      // Enviar ambos emails en paralelo
      const [guestResponse, coupleResponse] = await Promise.all([
        sgMail.send(msgToGuest),
        sgMail.send(msgToCouple)
      ]);
      
      return {
        success: true,
        messageId: guestResponse[0].headers['x-message-id'],
        coupleMessageId: coupleResponse[0].headers['x-message-id'],
        message: 'Emails enviados exitosamente'
      };

    } catch (error) {
      console.error('Error enviando email:', error);
      
      // Manejo específico de errores de SendGrid
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
        error: 'Error interno del servidor de emails',
        details: error.message
      };
    }
  }

  /**
   * Genera versión de texto plano del email
   */
  generatePlainTextConfirmation(rsvpData) {
    const { nombre, numeroAcompañantes, menu, acompañantes, alergias, emailRemitente } = rsvpData;
    
    // Función para formatear nombres de platillos
    const formatearPlatillo = (platillo) => {
      if (!platillo) return 'No especificado';
      return platillo.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    };

    let text = `
CONFIRMACIÓN DE ASISTENCIA - BODA REBECA Y ENRIQUE

¡Hola ${nombre}!

Hemos recibido tu confirmación de asistencia. ¡Estamos emocionados de celebrar contigo!

DETALLES DE TU CONFIRMACIÓN:
- Invitado principal: ${nombre}
- Email: ${emailRemitente}
- Número de acompañantes: ${numeroAcompañantes}
- Menú seleccionado: ${formatearPlatillo(menu)}
${alergias ? `- Tus alergias: ${alergias}` : ''}
`;

    if (acompañantes.length > 0) {
      text += '\nACOMPAÑANTES:\n';
      acompañantes.forEach((acomp, index) => {
        text += `${index + 1}. ${acomp.nombre} - ${formatearPlatillo(acomp.platillo)}`;
        if (acomp.alergias) {
          text += ` (Alergias: ${acomp.alergias})`;
        }
        text += '\n';
      });
    }

    text += `
INFORMACIÓN DEL EVENTO:
- Fecha: [Fecha de la boda]
- Hora: [Hora del evento]
- Lugar: [Ubicación del evento]
- Dirección: [Dirección completa]

Si necesitas modificar tu confirmación o tienes alguna pregunta, por favor responde a este correo.

¡No podemos esperar a celebrar contigo!

Con amor,
Rebeca y Enrique
    `;

    return text.trim();
  }

  /**
   * Genera el HTML para el email de notificación a los novios
   */
  generateCoupleNotificationHTML(rsvpData) {
    const { 
      nombre, 
      numeroAcompañantes, 
      menu, 
      acompañantes, 
      alergias, 
      emailRemitente 
    } = rsvpData;

    // Función para formatear nombres de platillos
    const formatearPlatillo = (platillo) => {
      if (!platillo) return 'No especificado';
      return platillo.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    };

    const acompañantesHTML = acompañantes.length > 0 ? `
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h4 style="color: #8B4513; margin-bottom: 10px;">👥 Acompañantes (${acompañantes.length}):</h4>
        ${acompañantes.map((acomp, index) => `
          <div style="margin-bottom: 8px; padding: 8px; background-color: white; border-radius: 4px; border-left: 3px solid #D4AF37;">
            <strong>${index + 1}. ${acomp.nombre}</strong><br>
            <span style="color: #666; font-size: 0.9em;">🍽️ ${formatearPlatillo(acomp.platillo)}</span>
            ${acomp.alergias ? `<br><span style="color: #d63384; font-size: 0.85em;">⚠️ ${acomp.alergias}</span>` : ''}
          </div>
        `).join('')}
      </div>
    ` : '<p style="color: #666; font-style: italic;">🚶‍♀️ Sin acompañantes</p>';

    // Recopilar todas las alergias (invitado principal + acompañantes)
    const todasLasAlergias = [];
    if (alergias) {
      todasLasAlergias.push(`<strong>${nombre}:</strong> ${alergias}`);
    }
    acompañantes.forEach(acomp => {
      if (acomp.alergias) {
        todasLasAlergias.push(`<strong>${acomp.nombre}:</strong> ${acomp.alergias}`);
      }
    });

    const alergiasHTML = todasLasAlergias.length > 0 ? `
      <div style="background-color: #fff3cd; padding: 12px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #ffc107;">
        <h4 style="color: #856404; margin-bottom: 8px;">⚠️ Alergias/Restricciones Reportadas:</h4>
        ${todasLasAlergias.map(alergia => `<p style="color: #856404; margin: 5px 0; font-size: 0.95em;">${alergia}</p>`).join('')}
      </div>
    ` : '<p style="color: #666; font-style: italic;">✅ Sin alergias reportadas</p>';

    const totalPersonas = parseInt(numeroAcompañantes) + 1;

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nueva Confirmación RSVP - ${nombre}</title>
      </head>
      <body style="font-family: Georgia, serif; line-height: 1.6; color: #333; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #8B4513 0%, #D4AF37 100%); padding: 25px; border-radius: 15px; text-align: center; margin-bottom: 25px;">
          <h1 style="color: white; font-size: 2.2em; margin: 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">🎉 ¡Nueva Confirmación!</h1>
          <p style="color: #F0EAD6; font-size: 1.1em; margin: 10px 0 0 0; opacity: 0.9;">Rebeca y Enrique - Dashboard de Confirmaciones</p>
        </div>

        <!-- Resumen rápido -->
        <div style="background-color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 5px solid #D4AF37;">
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <h2 style="color: #8B4513; margin: 0; flex: 1;">📋 ${nombre}</h2>
            <div style="background-color: #D4AF37; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold;">
              ${totalPersonas} persona${totalPersonas > 1 ? 's' : ''}
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
            <div>
              <p style="margin: 5px 0;"><strong>📧 Email:</strong><br><span style="color: #666;">${emailRemitente}</span></p>
              <p style="margin: 5px 0;"><strong>🍽️ Menú principal:</strong><br><span style="color: #666;">${formatearPlatillo(menu)}</span></p>
            </div>
            <div>
              <p style="margin: 5px 0;"><strong>👥 Acompañantes:</strong><br><span style="color: #666;">${numeroAcompañantes}</span></p>
              <p style="margin: 5px 0;"><strong>🕐 Recibido:</strong><br><span style="color: #666;">${new Date().toLocaleString('es-ES')}</span></p>
            </div>
          </div>
        </div>

        <!-- Detalles completos -->
        <div style="background-color: white; padding: 25px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h3 style="color: #8B4513; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; margin-top: 0;">📊 Detalles Completos</h3>
          
          ${acompañantesHTML}
          
          <div style="margin: 20px 0;">
            <h4 style="color: #8B4513; margin-bottom: 10px;">🍽️ Resumen de Menús:</h4>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px;">
              <p style="margin: 5px 0;"><strong>${nombre}:</strong> ${formatearPlatillo(menu)}</p>
              ${acompañantes.map(acomp => `
                <p style="margin: 5px 0;"><strong>${acomp.nombre}:</strong> ${formatearPlatillo(acomp.platillo)}</p>
              `).join('')}
            </div>
          </div>

          <div style="margin: 20px 0;">
            <h4 style="color: #8B4513; margin-bottom: 10px;">⚠️ Alergias y Restricciones:</h4>
            ${alergiasHTML}
          </div>
        </div>

        <!-- Acciones rápidas -->
        <div style="background: linear-gradient(135deg, #E8F5E8 0%, #D4EDDA 100%); padding: 20px; border-radius: 10px; text-align: center;">
          <h3 style="color: #2E7D32; margin-top: 0;">✅ Confirmación Procesada</h3>
          <p style="color: #1B5E20; margin-bottom: 15px;">
            El invitado ha recibido su email de confirmación automáticamente.
          </p>
          <div style="font-size: 0.9em; color: #2E7D32; background-color: rgba(255,255,255,0.7); padding: 10px; border-radius: 5px;">
            💡 <strong>Tip:</strong> Pueden revisar todas las confirmaciones en su sistema de gestión de invitados.
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 0.9em; margin: 0;">
            🤖 Email automático generado por su sistema de confirmaciones RSVP<br>
            💕 <em>¡Que tengan una boda maravillosa!</em>
          </p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Genera versión de texto plano para los novios
   */
  generateCoupleNotificationText(rsvpData) {
    const { nombre, numeroAcompañantes, menu, acompañantes, alergias, emailRemitente } = rsvpData;
    
    // Función para formatear nombres de platillos
    const formatearPlatillo = (platillo) => {
      if (!platillo) return 'No especificado';
      return platillo.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    };

    const totalPersonas = parseInt(numeroAcompañantes) + 1;

    let text = `
🎉 NUEVA CONFIRMACIÓN RSVP - BODA REBECA Y ENRIQUE

===============================================

INVITADO PRINCIPAL: ${nombre}
EMAIL: ${emailRemitente}
TOTAL PERSONAS: ${totalPersonas}
FECHA/HORA: ${new Date().toLocaleString('es-ES')}

===============================================

DETALLES DE MENÚS:
- ${nombre}: ${formatearPlatillo(menu)}
${alergias ? `  Alergias: ${alergias}` : ''}
`;

    if (acompañantes.length > 0) {
      text += '\nACOMPAÑANTES:\n';
      acompañantes.forEach((acomp, index) => {
        text += `${index + 1}. ${acomp.nombre}: ${formatearPlatillo(acomp.platillo)}`;
        if (acomp.alergias) {
          text += ` (Alergias: ${acomp.alergias})`;
        }
        text += '\n';
      });
    } else {
      text += '\nACOMPAÑANTES: Ninguno\n';
    }

    // Resumen de alergias
    const todasLasAlergias = [];
    if (alergias) todasLasAlergias.push(`${nombre}: ${alergias}`);
    acompañantes.forEach(acomp => {
      if (acomp.alergias) todasLasAlergias.push(`${acomp.nombre}: ${acomp.alergias}`);
    });

    if (todasLasAlergias.length > 0) {
      text += '\nRESUMEN DE ALERGIAS/RESTRICCIONES:\n';
      todasLasAlergias.forEach(alergia => {
        text += `- ${alergia}\n`;
      });
    } else {
      text += '\nALERGIAS/RESTRICCIONES: Ninguna reportada\n';
    }

    text += `
===============================================

✅ El invitado ha recibido su email de confirmación automáticamente.

💕 Sistema automático de confirmaciones RSVP
¡Que tengan una boda maravillosa!
    `;

    return text.trim();
  }

  /**
   * Valida configuración de SendGrid
   */
  async validateConfiguration() {
    try {
      // Intenta enviar un email de prueba a nosotros mismos
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
