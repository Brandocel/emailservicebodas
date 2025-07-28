// Ejemplo de cómo usar la API desde el frontend (React)

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Función para enviar confirmación RSVP
 */
export const sendRsvpConfirmation = async (rsvpData) => {
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
    console.error('Error:', error);
    throw error;
  }
};

/**
 * Ejemplo de uso en el componente RsvpForm
 */
const onSubmit = async (data) => {
  try {
    // Agregar el email del remitente al formulario
    const rsvpData = {
      ...data,
      emailRemitente: 'usuario@ejemplo.com' // Este debe venir del formulario
    };

    const result = await sendRsvpConfirmation(rsvpData);
    
    if (result.success) {
      alert('¡Gracias por confirmar tu asistencia! Revisa tu email para la confirmación 💕');
      reset();
    }
  } catch (error) {
    alert('Hubo un error enviando tu confirmación. Por favor intenta nuevamente.');
    console.error('Error:', error);
  }
};

/**
 * Ejemplo completo con manejo de errores
 */
export const useRsvpSubmission = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitRsvp = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendRsvpConfirmation(formData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { submitRsvp, isLoading, error };
};
