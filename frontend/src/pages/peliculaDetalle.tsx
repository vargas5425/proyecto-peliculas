import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { Review, Pelicula, Usuario } from "../types";
import EditarReview from "./editarReview";

interface PeliculaDetalleProps {
  usuario: Usuario | null;
}

function PeliculaDetalle({ usuario }: PeliculaDetalleProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [editandoReview, setEditandoReview] = useState<Review | null>(null);

  // Función para obtener la URL completa de la imagen
  const getImageUrl = (imagenPath: string) => {
    if (imagenPath.startsWith('http')) return imagenPath;
    if (imagenPath.startsWith('/images/')) return `http://localhost:3000${imagenPath}`;
    return `http://localhost:3000/public/images/${imagenPath}`;
  };

  // Función para cargar la película y sus reviews
  const cargarPelicula = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/peliculas/${id}`);
      setPelicula(res.data);
    } catch (error: any) {
      setMensaje("Error al cargar la película: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPelicula();
  }, [id]);

  const handleEliminarReview = async (reviewId: number) => {
    if (!window.confirm("¿Estás seguro de eliminar esta reseña?")) return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      await cargarPelicula();
    } catch (error: any) {
      alert("Error al eliminar: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <p>Cargando detalles...</p>;
  if (mensaje) return <p>{mensaje}</p>;
  if (!pelicula) return <p>No se encontró la película.</p>;

  return (
    <div className="detalle-container">
      <img
        src={getImageUrl(pelicula.imagen)}
        alt={pelicula.titulo}
        className="detalle-imagen"
        onError={(e) => { e.currentTarget.src = '/images/placeholder.jpg'; }}
      />

      <div className="detalle-info">
        <h2>{pelicula.titulo} ({pelicula.anio})</h2>
        <p>Calificación promedio: {pelicula.calificacionPromedio.toFixed(1)}</p>

        {usuario && (
          <button
            onClick={() => navigate(`/agregar-review/${pelicula.id}`)}
            className="submit-button"
          >
            Agregar review
          </button>
        )}

        {/* Usamos el componente EditarReview */}
        {editandoReview && (
          <EditarReview
            review={editandoReview}
            onCancel={() => setEditandoReview(null)}
            onUpdate={() => cargarPelicula()}
          />
        )}

        <h3>Reseñas</h3>
        {pelicula.reviews.length > 0 ? (
          <ul className="review-list">
            {pelicula.reviews.map((r) => (
              <li key={r.id} className="review-item">
                <p><strong>{r.usuario?.nombre || "Anónimo"}:</strong> {r.texto}</p>
                <p><strong>Puntuación Actual:</strong> {r.puntuacion.toFixed(1)}</p>
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
