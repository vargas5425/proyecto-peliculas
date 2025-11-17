import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";
import type { Usuario } from "../types";

interface Props {
  usuario: Usuario;
}

function MisReviews({ usuario }: Props) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [editandoReview, setEditandoReview] = useState<any>(null);

  useEffect(() => {
    if (!usuario) return;
    cargarReviews();
  }, [usuario]);

  const cargarReviews = async () => {
    try {
      const res = await api.get(`/usuarios/${usuario.id}/reviews`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error("Error al obtener reseñas del usuario", err);
    } finally {

    }
  };

  const handleEditar = async (reviewId: number, nuevosDatos: { texto: string; puntuacion: number }) => {
    try {
      await api.put(`/reviews/${reviewId}`, nuevosDatos);
      cargarReviews();
      setEditandoReview(null);
    } catch (error: any) {
      alert("Error al editar: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEliminar = async (reviewId: number) => {
    if (!window.confirm("¿Estás seguro de eliminar esta reseña?")) return;
    
    try {
      await api.delete(`/reviews/${reviewId}`);
      cargarReviews();
    } catch (error: any) {
      alert("Error al eliminar: " + (error.response?.data?.message || error.message));
    }
  };

  if (reviews.length === 0)
    return <p>No has hecho ninguna reseña todavía.</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Mis Reseñas</h2>
      
      {/* Formulario de edición */}
      {editandoReview && (
        <div style={{
          border: '2px solid #007bff',
          padding: '1rem',
          margin: '1rem 0',
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Editando reseña de {editandoReview.pelicula?.titulo}</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            handleEditar(editandoReview.id, {
              texto: formData.get('texto') as string,
              puntuacion: Number(formData.get('puntuacion'))
            });
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Comentario:</label>
              <textarea 
                name="texto"
                defaultValue={editandoReview.texto}
                style={{ width: '100%', padding: '0.5rem' }}
                rows={3}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Puntuación (1-10):</label>
              <input 
                type="number" 
                name="puntuacion"
                defaultValue={editandoReview.puntuacion}
                min="1"
                max="10"
                step="0.1"
                style={{ padding: '0.5rem' }}
              />
            </div>
            <div>
              <button type="submit" style={{ 
                backgroundColor: '#28a745', 
                color: 'white', 
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                marginRight: '0.5rem'
              }}>
                Guardar
              </button>
              <button 
                type="button" 
                onClick={() => setEditandoReview(null)}
                style={{ 
                  backgroundColor: '#6c757d', 
                  color: 'white', 
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {reviews.map((r) => (
          <li key={r.id} style={{ 
            marginBottom: "1rem", 
            borderBottom: "1px solid #ccc",
            padding: "1rem",
            backgroundColor: "#fff"
          }}>
            <h3>{r.pelicula?.titulo}</h3>
            <p><strong>Puntuación:</strong> {r.puntuacion}/10</p>
            <p><strong>Comentario:</strong> {r.texto}</p>
            
            {/* Botones de editar y eliminar */}
            <div style={{ marginTop: '1rem' }}>
              <button 
                onClick={() => setEditandoReview(r)}
                style={{ 
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  marginRight: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                Editar
              </button>
              <button 
                onClick={() => handleEliminar(r.id)}
                style={{ 
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Eliminar
              </button>
            </div>
            
            <Link to={`/peliculas/${r.pelicula?.id}`} style={{ display: 'block', marginTop: '0.5rem' }}>
              Ver película
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MisReviews;