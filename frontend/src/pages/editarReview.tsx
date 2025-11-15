import { useState } from "react";
import { api } from "../services/api";


interface Props {
  review: any;
  onCancel: () => void;
  onUpdate: () => void;
}

function EditarReview({ review, onCancel, onUpdate }: Props) {
  const [texto, setTexto] = useState(review.texto);
  const [puntuacion, setPuntuacion] = useState(review.puntuacion);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.put(`/reviews/${review.id}`, {
        texto,
        puntuacion
      });
      
      onUpdate(); // Notificar al componente padre
      setMensaje("¡Reseña actualizada exitosamente!");
      
      setTimeout(() => {
        onCancel();
      }, 1000);
      
    } catch (error: any) {
      setMensaje("Error al actualizar: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px'
      }}>
        <h3>Editar Reseña</h3>
        
        {mensaje && (
          <div className={`form-mensaje ${mensaje.includes("Error") ? "error" : "exito"}`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Comentario:</label>
            <textarea 
              value={texto} 
              onChange={e => setTexto(e.target.value)}
              className="form-input"
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label>Calificación (1-10):</label>
            <input 
              type="number" 
              value={puntuacion} 
              min={1}
              max={10}
              onChange={e => setPuntuacion(Number(e.target.value))}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
            <button 
              type="button" 
              onClick={onCancel}
              className="submit-button"
              style={{ backgroundColor: '#6c757d' }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarReview;