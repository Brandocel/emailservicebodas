# 🔗 Integración Completa con React

## 📋 Checklist de Integración

### ✅ Backend (Ya completado)
- [x] API REST con Express.js
- [x] Validación robusta con Joi
- [x] Envío de emails con SendGrid
- [x] Documentación con Swagger
- [x] Rate limiting y seguridad
- [x] Manejo profesional de errores

### 🔧 Frontend (Pasos a seguir)

#### 1. **Instalar dependencias adicionales**
```bash
# Si no las tienen ya
npm install react-hook-form
```

#### 2. **Crear servicio de API** 
Crea el archivo `src/services/apiService.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  async sendRsvpConfirmation(rsvpData) {
    try {
      const response = await fetch(`${API_BASE_URL}/email/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rsvpData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error enviando confirmación');
      }

      return result;
    } catch (error) {
      console.error('Error API:', error);
      throw error;
    }
  }

  async checkApiHealth() {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      return await response.json();
    } catch (error) {
      console.error('Error verificando API:', error);
      throw error;
    }
  }
}

export default new ApiService();
```

#### 3. **Crear hook personalizado**
Crea el archivo `src/hooks/useRsvpSubmission.js`:

```javascript
import { useState } from 'react';
import apiService from '../services/apiService';

export const useRsvpSubmission = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitRsvp = async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await apiService.sendRsvpConfirmation(formData);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return { submitRsvp, isLoading, error, success, resetState };
};
```

#### 4. **Actualizar el componente RsvpForm**

```typescript
// src/components/rsvp/RsvpForm.tsx
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SideOrnaments from "../layout/SideOrnaments";
import { useRsvpSubmission } from "../../hooks/useRsvpSubmission";

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
  const [, setAnimDone] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // ⭐ Usar nuestro hook personalizado
  const { submitRsvp, isLoading, error, success, resetState } = useRsvpSubmission();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Resetear estado cuando el componente se monta
  useEffect(() => {
    resetState();
  }, [resetState]);

  // Número máximo de acompañantes desde URL
  const getMaxGuests = (): number => {
    const maxFromQuery = searchParams.get("acompanantes");
    const n = maxFromQuery ? parseInt(maxFromQuery) : NaN;
    return !isNaN(n) && n >= 0 ? n : 5;
  };
  const maxGuests = getMaxGuests();

  // Fade-in / slide up al entrar en viewport
  useEffect(() => {
    if (!ref.current) return;
    let hasFired = false;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!hasFired && entry.intersectionRatio > 0.2) {
          hasFired = true;
          setVisible(true);
          setTimeout(() => setAnimDone(true), 600);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const { register, control, handleSubmit, reset, watch } = useForm<Data>({
    defaultValues: {
      acompañantes: [],
      agregarAcompañantes: false,
      mismoPlato: false,
      numeroAcompañantes: "0",
      emailRemitente: "", // ⭐ Campo por defecto
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "acompañantes",
  });

  const agregarAcompañantes = watch("agregarAcompañantes");
  const numeroAcompañantes = parseInt(watch("numeroAcompañantes") || "0", 10);

  // Administrar array de acompañantes
  useEffect(() => {
    fields.forEach(() => remove(0));
    if (agregarAcompañantes && numeroAcompañantes > 0) {
      const effective = Math.min(numeroAcompañantes, maxGuests);
      for (let i = 0; i < effective; i++) {
        append({ nombre: "", platillo: "" });
      }
    }
  }, [agregarAcompañantes, numeroAcompañantes, maxGuests]);

  // ⭐ Función de envío actualizada
  const onSubmit = async (data: Data) => {
    console.log('Enviando datos:', data);
    
    try {
      await submitRsvp(data);
      // Si llegamos aquí, el envío fue exitoso
      reset();
    } catch (error) {
      // El error ya está manejado por el hook
      console.error('Error en envío:', error);
    }
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
              <input 
                {...register("nombre", { required: "El nombre es requerido" })} 
                className="form-input" 
                disabled={isLoading}
              />
            </div>

            {/* ⭐ Nuevo campo de email */}
            <div className="form-group">
              <label className="form-label">EMAIL *</label>
              <input 
                type="email" 
                {...register("emailRemitente", { 
                  required: "El email es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido"
                  }
                })} 
                className="form-input" 
                placeholder="tu@email.com"
                disabled={isLoading}
              />
              <small className="form-help">
                📧 Enviaremos la confirmación a este email
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">
                NÚMERO DE ACOMPAÑANTES {maxGuests < 5 && `(MÁXIMO ${maxGuests})`}
              </label>
              <select 
                {...register("numeroAcompañantes")} 
                className="form-input"
                disabled={isLoading}
              >
                {Array.from({ length: maxGuests + 1 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">SELECCIÓN DE MENÚ</label>
              <select 
                {...register("menu", { required: "Selecciona un menú" })} 
                className="form-input"
                disabled={isLoading}
              >
                <option value="">-- Selecciona tu menú --</option>
                <option value="pollo">Pollo en salsa especial</option>
                <option value="pasta">Pasta italiana</option>
                <option value="vegetariano">Opción vegetariana</option>
                <option value="pescado">Pescado a la plancha</option>
              </select>
            </div>

            <div className="checkbox-group">
              <input 
                type="checkbox" 
                {...register("agregarAcompañantes")} 
                className="form-checkbox" 
                disabled={isLoading}
              />
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
                      {...register(`acompañantes.${i}.nombre` as const, {
                        required: "El nombre del acompañante es requerido"
                      })}
                      className="form-input"
                      placeholder="Nombre"
                      disabled={isLoading}
                    />
                    <div>
                      <label className="form-label acompanante-label">PLATILLO</label>
                      <select 
                        {...register(`acompañantes.${i}.platillo` as const, {
                          required: "Selecciona un platillo"
                        })} 
                        className="form-input"
                        disabled={isLoading}
                      >
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
                disabled={isLoading}
              />
            </div>

            {/* ⭐ Mensajes de estado */}
            {success && (
              <div className="alert alert-success">
                <h4>¡Confirmación enviada! 💕</h4>
                <p>
                  Gracias por confirmar tu asistencia. Hemos enviado los detalles 
                  de tu confirmación a tu email. ¡Nos vemos en la boda!
                </p>
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <h4>Error al enviar 😞</h4>
                <p>{error}</p>
                <small>Por favor intenta nuevamente o contáctanos directamente.</small>
              </div>
            )}

            <div className="submit-group">
              <button 
                type="submit" 
                className="submit-button" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    ENVIANDO CONFIRMACIÓN...
                  </>
                ) : (
                  'ENVIAR CONFIRMACIÓN'
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
```

#### 5. **CSS adicional**

```css
/* Agregar a tu archivo CSS */

/* Mensajes de alerta */
.alert {
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  border: 1px solid;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}

.alert-success h4 {
  color: #155724;
  margin-bottom: 10px;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border-color: #f5c6cb;
}

.alert-error h4 {
  color: #721c24;
  margin-bottom: 10px;
}

/* Botón de envío con loading */
.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Texto de ayuda */
.form-help {
  display: block;
  margin-top: 5px;
  font-size: 0.9em;
  color: #666;
  font-style: italic;
}

/* Estados deshabilitados */
.form-input:disabled,
.form-checkbox:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

#### 6. **Variables de entorno**

Crea o actualiza tu archivo `.env` en el frontend:

```env
# .env (en el proyecto React)
REACT_APP_API_URL=http://localhost:3001/api

# Para producción
# REACT_APP_API_URL=https://api.rebecayenrique.com/api
```

## 🚀 Flujo Completo

1. **Usuario llena el formulario** → Datos validados en el frontend
2. **Click en "Enviar"** → Hook personalizado envía datos a la API
3. **API valida datos** → Joi verifica que todo esté correcto
4. **API envía email** → SendGrid envía email hermoso
5. **Respuesta exitosa** → Usuario ve mensaje de confirmación
6. **Email recibido** → Usuario recibe confirmación en su bandeja

## 🔧 Para Desarrollo

### Probar localmente:
1. Backend: `npm run dev` (puerto 3001)
2. Frontend: `npm start` (puerto 3000)
3. Swagger: `http://localhost:3001/api-docs`

### Debuggear problemas:
1. Revisa la consola del navegador
2. Usa Swagger UI para probar la API directamente
3. Verifica logs del servidor Node.js

## 🌟 Funcionalidades Adicionales Opcionales

### Integrar con React Query (opcional):
```bash
npm install @tanstack/react-query
```

### Agregar notificaciones Toast:
```bash
npm install react-hot-toast
```

### Persistir estado en localStorage:
```javascript
// Para recordar datos en caso de error
const savedData = localStorage.getItem('rsvp-draft');
```

---

¡Con esta integración tendrás un sistema completo y profesional para las confirmaciones de boda! 💕🎉
