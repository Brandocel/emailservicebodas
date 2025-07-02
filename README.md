# 📧 API de Correos para Boda - Rebeca y Enrique

Una API profesional en Node.js para el envío de confirmaciones de RSVP para bodas usando SendGrid.

## 🌟 Características

- ✅ Envío de emails de confirmación de RSVP
- 🔒 Validación robusta de datos con Joi
- 🚀 Rate limiting para prevenir spam
- 🛡️ Middlewares de seguridad
- 📱 Emails responsive con HTML y texto plano  
- 🎨 Diseño hermoso y personalizado para bodas
- 📊 Logging detallado
- ⚡ Manejo profesional de errores
- 📚 **Documentación interactiva con Swagger UI**
- 🎯 API REST bien estructurada siguiendo mejores prácticas

## 🏗️ Estructura del Proyecto

```
emailAPI/
├── src/
│   ├── config/           # Configuración de la aplicación
│   ├── controllers/      # Controladores de rutas
│   ├── middleware/       # Middlewares personalizados
│   ├── models/          # Modelos y validaciones
│   ├── routes/          # Definición de rutas
│   ├── services/        # Servicios (SendGrid)
│   ├── utils/           # Utilidades y helpers
│   └── app.js           # Configuración de Express
├── .env                 # Variables de entorno
├── .gitignore          # Archivos ignorados por Git
├── package.json        # Dependencias y scripts
└── server.js           # Punto de entrada
```

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
El archivo `.env` ya está configurado con:
- SENDGRID_API_KEY: Tu clave API de SendGrid
- SENDER_EMAIL: Email del remitente
- PORT: Puerto del servidor (3000)

### 3. Ejecutar la aplicación

#### Desarrollo
```bash
npm run dev
```

#### Producción
```bash
npm start
```

## 📡 Endpoints de la API

### 📚 Documentación Interactiva
La API incluye documentación completa con Swagger UI:
```
GET http://localhost:3000/api-docs
```
**🎉 La documentación incluye:**
- 📝 Descripción detallada de cada endpoint
- 🔍 Ejemplos de request y response
- 🧪 Interfaz para probar la API directamente
- 📋 Esquemas de validación completos
- 🎨 Interfaz elegante personalizada para la boda

### Endpoints principales

#### Salud del servicio
```
GET /health
```

#### Redirección a documentación
```
GET / (redirige a /api-docs)
```

#### Enviar confirmación RSVP
```
POST /api/email/rsvp
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "emailRemitente": "juan@ejemplo.com",
  "numeroAcompañantes": "2",
  "menu": "pollo",
  "agregarAcompañantes": true,
  "mismoPlato": false,
  "acompañantes": [
    {
      "nombre": "María García",
      "platillo": "pasta"
    },
    {
      "nombre": "Pedro López",
      "platillo": "vegetariano"
    }
  ],
  "alergias": "Sin alergias conocidas"
}
```

#### Verificar estado del servicio de email
```
GET /api/email/status
```

#### Enviar email de prueba (desarrollo)
```
POST /api/email/test
Content-Type: application/json

{
  "email": "test@ejemplo.com"
}
```

## 🔧 Configuración de SendGrid

1. Crea una cuenta en [SendGrid](https://sendgrid.com/)
2. Genera una API Key en tu dashboard
3. Verifica tu dominio de email o usa Single Sender Verification
4. Actualiza las variables en `.env`

## 📝 Estructura de Datos

### Formulario RSVP
- **nombre**: Nombre completo del invitado principal
- **emailRemitente**: Email del invitado (requerido)
- **numeroAcompañantes**: Número de acompañantes (string)
- **menu**: Opción de menú ('pollo', 'pasta', 'vegetariano', 'pescado')
- **agregarAcompañantes**: Boolean para incluir detalles de acompañantes
- **acompañantes**: Array con nombre y platillo de cada acompañante
- **alergias**: Descripción de alergias (opcional)

## 🛡️ Seguridad

- **Helmet**: Headers de seguridad
- **CORS**: Configurado para dominios específicos
- **Rate Limiting**: Máximo 10 requests por minuto
- **Validación**: Sanitización y validación de todos los inputs
- **Error Handling**: Manejo seguro de errores sin exponer información sensible

## 🎨 Diseño del Email

El email de confirmación incluye:
- ✨ Diseño elegante y romántico
- 💕 Colores temáticos de boda
- 📱 Responsive design
- 🎯 Información clara y organizada
- ⚠️ Sección especial para alergias
- 👥 Lista detallada de acompañantes

## 🔍 Logging

- Logs detallados en desarrollo
- Logs de producción optimizados
- Tracking de emails enviados
- Manejo de errores con contexto

## 🚀 Despliegue

### Variables de entorno para producción:
```env
NODE_ENV=production
PORT=3000
SENDGRID_API_KEY=tu_api_key_real
SENDER_EMAIL=tu_email_verificado
ALLOWED_ORIGINS=https://tu-dominio.com
MAX_REQUESTS_PER_MINUTE=5
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Test específico
npm test -- --testNamePattern="Email Service"
```

## 📚 Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web minimalista y rápido ⚡
- **SendGrid**: Servicio profesional de emails
- **Joi**: Validación robusta de esquemas
- **Swagger/OpenAPI**: Documentación interactiva de la API
- **Helmet**: Middlewares de seguridad
- **CORS**: Cross-Origin Resource Sharing
- **Morgan**: HTTP request logger
- **Express Rate Limit**: Control de rate limiting

## 🤝 Contribución

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 💕 Para los Novios

¡Felicidades por su boda! Esta API está diseñada especialmente para hacer que el proceso de confirmación de sus invitados sea fácil y elegante. 

---

**¡Que tengan una boda maravillosa! 🎉💕**
