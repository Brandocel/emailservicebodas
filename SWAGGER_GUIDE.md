# 🚀 Guía Rápida - Usando Swagger UI

## ¿Qué es Swagger UI?

Swagger UI es una interfaz web interactiva que te permite:
- 📖 Ver toda la documentación de la API
- 🧪 Probar los endpoints directamente desde el navegador
- 🔍 Ver ejemplos de requests y responses
- 📋 Entender la estructura de datos esperada

## 🌐 Acceder a la Documentación

1. **Inicia el servidor:**
   ```bash
   npm run dev
   ```

2. **Abre tu navegador y ve a:**
   ```
   http://localhost:3000/api-docs
   ```
   (O el puerto que hayas configurado)

3. **También puedes ir directamente a la raíz:**
   ```
   http://localhost:3000/
   ```
   (Te redirigirá automáticamente a la documentación)

## 🎯 Cómo Usar la Interfaz

### 1. **Explorar Endpoints**
- Los endpoints están organizados por tags (Health, Email, Testing)
- Haz clic en cualquier endpoint para ver más detalles
- Cada endpoint muestra: descripción, parámetros, respuestas esperadas

### 2. **Probar un Endpoint**

#### Para probar el envío de RSVP:

1. **Busca el endpoint:** `POST /api/email/rsvp`
2. **Haz clic en "Try it out"**
3. **Selecciona un ejemplo** del dropdown (hay 3 ejemplos diferentes):
   - Confirmación simple sin acompañantes
   - Confirmación con 2 acompañantes  
   - Confirmación con restricciones alimentarias
4. **Modifica los datos** si quieres (especialmente el email)
5. **Haz clic en "Execute"**
6. **Ve la respuesta** en tiempo real

#### Para probar el email de prueba:

1. **Busca el endpoint:** `POST /api/email/test`
2. **Haz clic en "Try it out"**
3. **Cambia el email** por uno real tuyo
4. **Haz clic en "Execute"**
5. **Revisa tu bandeja de entrada** 📧

### 3. **Ver Respuestas**
- Cada endpoint muestra las posibles respuestas (200, 400, 500, etc.)
- Incluye ejemplos de errores comunes
- Códigos de respuesta con explicaciones claras

## 📱 Ejemplos Prácticos Desde Swagger

### ✅ Verificar que todo funciona:
1. Ve a `GET /health`
2. Haz clic en "Try it out" → "Execute"
3. Deberías ver: `"status": "ok"`

### 🔧 Verificar configuración de SendGrid:
1. Ve a `GET /api/email/status`  
2. Haz clic en "Try it out" → "Execute"
3. Si está bien configurado verás: `"status": "operational"`

### 📧 Enviar tu primer email de prueba:
1. Ve a `POST /api/email/test`
2. Haz clic en "Try it out"
3. Cambia el email en el JSON:
   ```json
   {
     "email": "tu-email@gmail.com"
   }
   ```
4. Haz clic en "Execute"
5. ¡Revisa tu email! 💕

### 🎉 Simular confirmación completa:
1. Ve a `POST /api/email/rsvp`
2. Haz clic en "Try it out"
3. Selecciona "confirmacion_con_acompañantes" del dropdown
4. Cambia el `emailRemitente` por tu email
5. Modifica nombres si quieres
6. Haz clic en "Execute"
7. ¡Recibirás el email completo de confirmación!

## 🎨 Interfaz Personalizada

La documentación tiene un diseño especial para la boda:
- 💕 Colores románticos (dorados y marrones)
- 🎯 Información clara y bien organizada
- 📱 Responsive (funciona en móvil)
- ✨ Ejemplos detallados y realistas

## 🔍 Schemas y Validaciones

En la sección **Schemas** (abajo en la documentación) puedes ver:
- `RsvpData`: Estructura completa del formulario
- `Acompanante`: Datos de cada acompañante  
- `SuccessResponse`: Formato de respuestas exitosas
- `ErrorResponse`: Formato de errores
- `ValidationError`: Errores de validación específicos

## 💡 Tips

1. **Siempre usa emails reales** para las pruebas
2. **Revisa la carpeta de spam** si no recibes emails
3. **Los ejemplos son editables** - personalízalos
4. **Las respuestas muestran el JSON real** que devuelve la API
5. **Si hay errores**, la documentación te dice exactamente qué significa cada código

## 🚨 Troubleshooting

### "Service Unavailable" en /api/email/status
- Verifica tu SENDGRID_API_KEY en el .env
- Asegúrate de que el email remitente esté verificado en SendGrid

### "Validation Error" al enviar RSVP
- Revisa que todos los campos requeridos estén presentes
- Verifica el formato del email
- Asegúrate de que el menú sea una opción válida ('pollo', 'pasta', 'vegetariano', 'pescado')

### No recibo emails
- Verifica tu bandeja de spam
- Confirma que el email esté escrito correctamente
- Usa el endpoint `/api/email/status` para verificar la configuración

---

## 🎊 ¡Listo para usar!

Con Swagger UI tienes todo lo necesario para:
- 🧪 Probar la API sin escribir código
- 📚 Entender cómo funciona cada endpoint  
- 🔍 Debuggear problemas fácilmente
- 📱 Integrar con tu frontend React

¡Que disfruten probando su API de boda! 💕🎉
