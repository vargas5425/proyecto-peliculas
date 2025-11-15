import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";

interface Review {
  id: number;
  texto: string;
  puntuacion: number;
  usuario: {
    id: number;
    nombre: string;
  };
}

interface Pelicula {
  id: number;
  titulo: string;
  anio: number;
  imagen: string;
  calificacionPromedio: number;
  reviews: Review[];
}

interface Usuario {
  id: number;
  nombre: string;
}

interface PeliculaDetalleProps {
  usuario: Usuario | null;
}

function PeliculaDetalle({ usuario }: PeliculaDetalleProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [editandoReview, setEditandoReview] = useState<any>(null);

  // ✅ Función para obtener la URL completa de la imagen
  const getImageUrl = (imagenPath: string) => {
    if (imagenPath.startsWith('http')) {
      return imagenPath;
    } else if (imagenPath.startsWith('/images/')) {
      return `http://localhost:3000${imagenPath}`;
    } else {
      return `http://localhost:3000/public/images/${imagenPath}`;
    }
  };

  useEffect(() => {
    const fetchPelicula = async () => {
      try {
        const res = await api.get(`/peliculas/${id}`);
        setPelicula(res.data);
      } catch (error: any) {
        setMensaje("Error al cargar la película: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchPelicula();
  }, [id]);

  const handleEditarReview = async (reviewId: number, nuevosDatos: { texto: string; puntuacion: number }) => {
    try {
      await api.put(`/reviews/${reviewId}`, nuevosDatos);
      const res = await api.get(`/peliculas/${id}`);
      setPelicula(res.data);
      setEditandoReview(null);
    } catch (error: any) {
      alert("Error al editar: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEliminarReview = async (reviewId: number) => {
    if (!window.confirm("¿Estás seguro de eliminar esta reseña?")) return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      const res = await api.get(`/peliculas/${id}`);
      setPelicula(res.data);
    } catch (error: any) {
      alert("Error al eliminar: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <p>Cargando detalles...</p>;
  if (mensaje) return <p>{mensaje}</p>;
  if (!pelicula) return <p>No se encontró la película.</p>;

  return (
    <div className="detalle-container">
      {/* ✅ Imagen actualizada con getImageUrl */}
      <img
        src={getImageUrl(pelicula.imagen)}
        alt={pelicula.titulo}
        className="detalle-imagen"
        onError={(e) => {
          e.currentTarget.src = '/images/placeholder.jpg';
        }}
      />

      <div className="detalle-info">
        <h2>{pelicula.titulo} ({pelicula.anio})</h2>
        <p>⭐ Calificación promedio: {pelicula.calificacionPromedio.toFixed(1)}</p>

        {/* Botón de agregar review solo si hay usuario logueado */}
        {usuario && (
          <button
            onClick={() => navigate(`/agregar-review/${pelicula.id}`)}
            className="submit-button"
          >
            Agregar review
          </button>
        )}

        {/* Formulario de edición */}
        {editandoReview && (
          <div style={{
            border: '2px solid #007bff',
            padding: '1rem',
            margin: '1rem 0',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <h3>Editando tu reseña</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleEditarReview(editandoReview.id, {
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

        <h3>Reseñas</h3>
        {pelicula.reviews.length > 0 ? (
          <ul className="review-list">
            {pelicula.reviews.map((r) => (
              <li key={r.id} className="review-item">
                <p><strong>{r.usuario?.nombre || "Anónimo"}:</strong> {r.texto}</p>
                <p>⭐ {r.puntuacion}</p>

                {usuario && r.usuario.id === usuario.id && (
                  <div style={{ marginTop: '10px' }}>
                    <button
                      onClick={() => setEditandoReview(r)}
                      style={{
                        marginRight: '10px',
                        padding: '5px 10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminarReview(r.id)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay reseñas aún.</p>
        )}
      </div>
    </div>
  );
}

export default PeliculaDetalle;
