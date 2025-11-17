import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import PeliculaCard from "../components/peliculaCard";
import type { Pelicula } from "../types";

function Peliculas() {
  const navigate = useNavigate();

  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPeliculas = async () => {
      setLoading(true);
      try {
        const res = await api.get("/peliculas/top");
        setPeliculas(res.data);
      } catch (error: any) {
        setMensaje("Error al cargar películas: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };
    fetchPeliculas();
  }, []);

  const handleClick = (id: number) => {
    console.log("Película clickeada:", id);
    navigate(`/peliculas/${id}`);
  };

  return (
    <div className={loading ? "loading" : ""}>
      <h2 className="form-title" style={{ textAlign: "center", marginTop: "1rem" }}>
        Películas
      </h2>

      {mensaje && (
        <div className={`form-mensaje ${mensaje.includes("Error") ? "error" : "exito"}`}>
          {mensaje}
        </div>
      )}

      {loading && <p style={{ textAlign: "center" }}>Cargando películas...</p>}

      <div className="peliculas-grid">
        {peliculas.length === 0 && !loading ? (
          <p>No hay películas disponibles.</p>
        ) : (
          peliculas.map((pelicula) => (
            <PeliculaCard
              key={pelicula.id}
              id={pelicula.id}
              titulo={pelicula.titulo}
              anio={pelicula.anio}
              imagen={pelicula.imagen}
              calificacion={pelicula.calificacionPromedio}
              onClick={handleClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Peliculas;