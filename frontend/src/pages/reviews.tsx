import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

interface Review {
  id: number;
  texto: string;
  puntuacion: number;
  usuario: { id: number;
    nombre: string;
    correo?: string;};
}

function Reviews() {
  const { id } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/reviews/pelicula/${id}`);
        setReviews(res.data);
      } catch (error: any) {
        setMensaje("Error al cargar reviews: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  return (
    <div className="form-container">
      <h2 className="form-title">Reseñas de la Película</h2>
      {mensaje && <div className={`form-mensaje ${mensaje.includes("Error") ? "error" : "exito"}`}>{mensaje}</div>}
      {loading ? <p>Cargando reviews...</p> :
        reviews.length === 0 ? <p>No hay reviews aún.</p> :
        <ul>
          {reviews.map(r => (
            <li key={r.id}>
              <strong>{r.usuario.nombre || r.usuario?.id || "Usuario"}:</strong> {r.texto} 
              ⭐ {r.puntuacion.toFixed(1)}
            </li>
          ))}
        </ul>
      }
    </div>
  );
}

export default Reviews;
