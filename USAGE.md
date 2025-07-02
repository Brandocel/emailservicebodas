# 📋 Guía de Uso - API de Correos para Boda

## 🚀 Inicio Rápido

### 1. Verificar que el servidor esté funcionando
```bash
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "message": "API de correos para la boda funcionando correctamente",
  "timestamp": "2025-06-30T...",
  "environment": "development"
}
```

### 2. Verificar el servicio de email
```bash
curl http://localhost:3000/api/email/status
```

### 3. Enviar una confirmación RSVP

```bash
curl -X POST http://localhost:3000/api/email/rsvp \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María González",
    "emailRemitente": "maria@ejemplo.com",
    "numeroAcompañantes": "2",
    "menu": "pollo",
    "agregarAcompañantes": true,
    "mismoPlato": false,
    "acompañantes": [
      {
        "nombre": "Juan Carlos",
        "platillo": "pasta"
      },
      {
        "nombre": "Ana María",
        "platillo": "vegetariano"
      }
    ],
    "alergias": "Juan es alérgico a los mariscos"
  }'
```

## 📧 Integración con el Frontend React

### Modificar el componente RsvpForm

```typescript
// src/components/rsvp/RsvpForm.tsx
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SideOrnaments from "../layout/SideOrnaments";

type Guest = { nombre: string; platillo: string };
type Data = {
  nombre: string;
  numeroAcompañantes: string;
  menu: string;
  agregarAcompañantes: boolean;
  mismoPlato: boolean;
  acompañantes: Guest[];
  alergias: string;
  emailRemitente: string; // ⭐ Nuevo campo requerido
};

export default function RsvpForm() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // ⭐ Estado de envío
  const [submitMessage, setSubmitMessage] = useState(""); // ⭐ Mensaje de respuesta
  const [, setAnimDone] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ... resto del código existente ...

  // ⭐ Nueva función para enviar a la API
  const sendToApi = async (data: Data) => {
    try {
      setIsSubmitting(true);
      setSubmitMessage("");

      const response = await fetch('http://localhost:3000/api/email/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage("¡Gracias por confirmar tu asistencia! Revisa tu email para la confirmación 💕");
        reset();
      } else {
        throw new Error(result.message || 'Error enviando confirmación');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage("Hubo un error enviando tu confirmación. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: Data) => {
    console.log(data);
    sendToApi(data); // ⭐ Llamar a la API en lugar de solo mostrar alert
  };

  return (
    <>
      <section ref={ref} className={`rsvp-section${visible ? " visible" : ""}`}>
        <SideOrnaments />

        {/* Header con flecha y texto */}
        <header className="rsvp-header">
          <button
            onClick={() => navigate(-1)}
            className="back-button"
            aria-label="Volver"
            title="Volver"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#F0EAD6" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span>Volver atrás</span>
          </button>
        </header>

        <div className="rsvp-wrapper">
          <div className="rsvp-title-wrap">
            <h2 className="rsvp-title">CONFIRMACIÓN</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="rsvp-form">
            <div className="form-group">
              <label className="form-label">NOMBRE &amp; APELLIDO</label>
              <input {...register("nombre", { required: true })} className="form-input" />
            </div>

            {/* ⭐ Nuevo campo de email */}
            <div className="form-group">
              <label className="form-label">EMAIL</label>
              <input 
                type="email" 
                {...register("emailRemitente", { required: true })} 
                className="form-input" 
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                NÚMERO DE ACOMPAÑANTES {maxGuests < 5 && `(MÁXIMO ${maxGuests})`}
              </label>
              <select {...register("numeroAcompañantes")} className="form-input">
                {Array.from({ length: maxGuests + 1 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">SELECCIÓN DE MENÚ</label>
              <select {...register("menu")} className="form-input">
                <option value="">-- Selecciona tu menú --</option>
                <option value="pollo">Pollo en salsa especial</option>
                <option value="pasta">Pasta italiana</option>
                <option value="vegetariano">Opción vegetariana</option>
                <option value="pescado">Pescado a la plancha</option>
              </select>
            </div>

            <div className="checkbox-group">
              <input type="checkbox" {...register("agregarAcompañantes")} className="form-checkbox" />
              <label className="form-label checkbox-label">
                AGREGAR NOMBRE Y
                <br />
                PLATILLO DE ACOMPAÑANTES
              </label>
            </div>

            {agregarAcompañantes &&
              numeroAcompañantes > 0 &&
              fields.map((field, i) => (
                <div key={field.id} className="acompanante-section">
                  <h4 className="acompanante-title">ACOMPAÑANTE {i + 1}</h4>
                  <div className="acompanante-group">
                    <input
                      {...register(`acompañantes.${i}.nombre` as const)}
                      className="form-input"
                      placeholder="Nombre"
                    />
                    <div>
                      <label className="form-label acompanante-label">PLATILLO</label>
                      <select {...register(`acompañantes.${i}.platillo` as const)} className="form-input">
                        <option value="">-- Selecciona platillo --</option>
                        <option value="pollo">Pollo en salsa especial</option>
                        <option value="pasta">Pasta italiana</option>
                        <option value="vegetariano">Opción vegetariana</option>
                        <option value="pescado">Pescado a la plancha</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

            <div className="form-group">
              <label className="form-label">¿TIENES ALGUNA ALERGIA ALIMENTARIA?</label>
              <textarea
                {...register("alergias")}
                className="form-input textarea-input"
                placeholder="Describe tus alergias o restricciones alimentarias..."
              />
            </div>

            {/* ⭐ Mensaje de estado */}
            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes('Gracias') ? 'success' : 'error'}`}>
                {submitMessage}
              </div>
            )}

            <div className="submit-group">
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? 'ENVIANDO...' : 'ENVIAR CONFIRMACIÓN'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
```

### CSS adicional para los nuevos elementos

```css
/* Agregar al CSS del componente */
.submit-message {
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  font-weight: bold;
  text-align: center;
}

.submit-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.submit-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

## 🛠️ Comandos Útiles

### Desarrollo
```bash
# Iniciar en modo desarrollo
npm run dev

# Ejecutar tests
npm test

# Configuración interactiva
node setup.js
```

### Producción
```bash
# Iniciar en producción
npm start

# Construir para producción
NODE_ENV=production npm start
```

## 🔧 Personalización del Email

Para personalizar el email de confirmación, edita el archivo:
`src/services/emailService.js` en la función `generateRsvpConfirmationHTML()`

### Cambiar información del evento
Busca esta sección en el HTML generado:
```html
<h3 style="color: #2E7D32; text-align: center; margin-bottom: 15px;">📅 Información del Evento</h3>
<div style="text-align: center;">
  <p><strong>Fecha:</strong> [Fecha de la boda]</p>
  <p><strong>Hora:</strong> [Hora del evento]</p>
  <p><strong>Lugar:</strong> [Ubicación del evento]</p>
  <p><strong>Dirección:</strong> [Dirección completa]</p>
</div>
```

Y reemplaza con los datos reales:
```html
<div style="text-align: center;">
  <p><strong>Fecha:</strong> Sábado 15 de Julio, 2025</p>
  <p><strong>Hora:</strong> 6:00 PM</p>
  <p><strong>Lugar:</strong> Jardín de los Sueños</p>
  <p><strong>Dirección:</strong> Av. Romantica 123, Ciudad del Amor</p>
</div>
```

## 🎨 Personalizar Colores y Estilos

En el mismo archivo, puedes cambiar:
- Colores principales: `#8B4513` (marrón), `#D4AF37` (dorado)
- Fuente: `Georgia, serif`
- Gradientes y fondos

## 📱 CORS para Producción

En el archivo `.env`, actualiza:
```env
ALLOWED_ORIGINS=https://tu-dominio-real.com,https://www.tu-dominio-real.com
```

## 🔐 Seguridad en Producción

1. **Rate Limiting**: Ajusta `MAX_REQUESTS_PER_MINUTE` según tus necesidades
2. **HTTPS**: Siempre usar HTTPS en producción
3. **Variables de entorno**: Nunca commitear las claves reales
4. **Logs**: Configurar logging apropiado para producción

## 📞 Soporte

Si necesitas ayuda:
1. Revisa los logs del servidor
2. Verifica la configuración de SendGrid
3. Asegúrate de que el email remitente esté verificado
4. Comprueba que las variables de entorno estén configuradas correctamente

---

## 💕 ¡Felicidades por su boda!

Esta API está diseñada especialmente para hacer que el proceso de confirmación de sus invitados sea fácil y elegante. ¡Que tengan una celebración maravillosa! 🎉

## 📝 Ejemplos Listos para Copiar y Pegar

### 🎯 Ejemplo con 3 Acompañantes (Listo para usar)

#### Ejemplo 1: Familia con diferentes platillos
```json
{
  "nombre": "María González Pérez",
  "emailRemitente": "diegosa1203@gmail.com",
  "numeroAcompañantes": "3",
  "menu": "pollo",
  "agregarAcompañantes": true,
  "mismoPlato": false,
  "acompañantes": [
    {
      "nombre": "Carlos González López",
      "platillo": "pasta"
    },
    {
      "nombre": "Ana María González",
      "platillo": "vegetariano"
    },
    {
      "nombre": "Pedro José González",
      "platillo": "pescado"
    }
  ],
  "alergias": "Ana es vegetariana estricta y Pedro es alérgico a los mariscos"
}
```

#### Ejemplo 2: Grupo de amigos todos con pollo
```json
{
  "nombre": "Diego Sánchez Morales",
  "emailRemitente": "diegosa1203@gmail.com",
  "numeroAcompañantes": "3",
  "menu": "pollo",
  "agregarAcompañantes": true,
  "mismoPlato": false,
  "acompañantes": [
    {
      "nombre": "Laura Patricia Ruiz",
      "platillo": "pollo"
    },
    {
      "nombre": "Andrés Felipe Castro",
      "platillo": "pollo"
    },
    {
      "nombre": "Sofía Isabel Mendoza",
      "platillo": "pollo"
    }
  ],
  "alergias": ""
}
```

#### Ejemplo 3: Con restricciones alimentarias
```json
{
  "nombre": "Roberto Alejandro Díaz",
  "emailRemitente": "diegosa1203@gmail.com",
  "numeroAcompañantes": "3",
  "menu": "pescado",
  "agregarAcompañantes": true,
  "mismoPlato": false,
  "acompañantes": [
    {
      "nombre": "Carmen Elena Vargas",
      "platillo": "vegetariano"
    },
    {
      "nombre": "Luis Fernando Torres",
      "platillo": "pasta"
    },
    {
      "nombre": "Gabriela Cristina Herrera",
      "platillo": "pollo"
    }
  ],
  "alergias": "Carmen es vegetariana por razones de salud, Luis es alérgico al gluten (necesita pasta sin gluten), y Gabriela no tiene restricciones"
}
```

### 🧪 Para Probar en Swagger UI:

1. **Ve a:** `http://localhost:3001/api-docs` (nota el puerto 3001)
2. **Busca:** `POST /api/email/rsvp`
3. **Haz clic en:** "Try it out"
4. **Copia y pega** cualquiera de los ejemplos de arriba
5. **Cambia el email** por uno real tuyo si quieres recibir el correo
6. **Haz clic en:** "Execute"

### 💡 Opciones de Platillos Disponibles:
- `"pollo"` → Pollo en salsa especial
- `"pasta"` → Pasta italiana  
- `"vegetariano"` → Opción vegetariana
- `"pescado"` → Pescado a la plancha
