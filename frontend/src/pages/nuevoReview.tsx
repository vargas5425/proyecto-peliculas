import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import type { Usuario, Pelicula } from "../types";

interface Props {
  usuario: Usuario;
}

function NuevoReview({ usuario }: Props) {
  const { id } = useParams<{ id: string }>();
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [peliculaId, setPeliculaId] = useState<number | null>(null);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevoAno, setNuevoAno] = useState("");
  const [nuevoImagen, setNuevoImagen] = useState<File | null>(null);
  const [previewImagen, setPreviewImagen] = useState("");
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/peliculas").then(res => setPeliculas(res.data));
  }, []);

  useEffect(() => {
    if (id) {
      setPeliculaId(parseInt(id));
    } else if (peliculas.length > 0 && !peliculaId) {
      setPeliculaId(peliculas[0].id);
    }
  }, [id, peliculas, peliculaId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNuevoImagen(file);
      
      // URL para previsualización
      const previewUrl = URL.createObjectURL(file);
      setPreviewImagen(previewUrl);
    }
  };

  const handleAgregarPelicula = async () => {
  setMensaje("");
  
  // Validaciones
  if (!nuevoTitulo.trim()) {
    setMensaje("El título no puede estar vacío");
    return;
  }
  if (!nuevoAno.trim()) {
    setMensaje("El año no puede estar vacío");
    return;
  }
  if (!nuevoImagen) {
    setMensaje("Por favor selecciona una imagen");
    return;
  }

  const anioNumerico = Number(nuevoAno);
  
  if (isNaN(anioNumerico)) {
    setMensaje("El año debe ser un número válido");
    return;
  }

  try {
    const formData = new FormData();
    formData.append('titulo', nuevoTitulo);
    formData.append('anio', anioNumerico.toString());
    formData.append('imagen', nuevoImagen);

    const res = await api.post("/peliculas", formData);
    
    setPeliculas(prev => [...prev, res.data]);
    setPeliculaId(res.data.id);
    setMostrarPopup(false);
    setNuevoTitulo(""); 
    setNuevoAno(""); 
    setNuevoImagen(null);
    setPreviewImagen("");
    setMensaje("¡Película agregada exitosamente!");
  } catch (error: any) {
    if (error.response?.status === 409) {
        setMensaje((error.response?.data?.message));
    } else {
        setMensaje("Error: " + (error.message || "Desconocido"));
    }
  }
};

const handleAgregarReview = async () => {
  if (!peliculaId) {
    setMensaje("Por favor selecciona una película");
    return;
  }

  // Validaciones
  if (!comentario.trim()) {
    setMensaje("El Comentario no puede estar vacío");
    return;
  }

  setLoading(true);
  try {
    const reviewData = {
      pelicula: { id: peliculaId },
      usuario: { id: usuario.id },
      texto: comentario,
      puntuacion: calificacion
    };
    
    await api.post("/reviews", reviewData);

    setMensaje("¡Reseña agregada exitosamente!");
    setComentario("");
    setCalificacion(5);

    setTimeout(() => {
      navigate(`/peliculas/${peliculaId}`);
    }, 1000);

  } catch (error: unknown) {
    
    let errorMessage = "Error solo puedes agregar una reseña por pelicula";
    setMensaje(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const peliculaSeleccionada = peliculas.find(p => p.id === peliculaId);

  return (
    <div className={`form-container ${loading ? 'loading' : ''}`} style={{ maxWidth: '500px' }}>
      <h2 className="form-title">Agregar Reseña</h2>

      {mensaje && (
        <div className={`form-mensaje ${mensaje.includes("Error") || mensaje.includes("error") ? "error" : "exito"}`}>
          {mensaje}
          <button 
            onClick={() => setMensaje("")}
            style={{
              marginLeft: '10px',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              color: 'inherit'
            }}
          >
            ×
          </button>
        </div>
      )}

      <div className="form">
        {/* Selección de Película */}
        <div className="form-group">
          <label className="form-label">Película:</label>
          <select 
            value={peliculaId || ""} 
            onChange={e => setPeliculaId(Number(e.target.value))}
            className="form-input"
          >
            <option value="">-- Seleccionar Película --</option>
            {peliculas.map(p => (
              <option key={p.id} value={p.id}>{p.titulo}</option>
            ))}
          </select>
        </div>

        {/* Botón para agregar nueva película */}
        <button 
          type="button"
          onClick={() => {
            setMostrarPopup(true);
            setNuevoImagen(null);
            setPreviewImagen("");
          }}
          className="submit-button"
          style={{ backgroundColor: '#28a745', background: 'linear-gradient(135deg, #28a745, #1e7e34)' }}
        >
          Agregar Nueva Película
        </button>

        {/* Popup para nueva película */}
        {mostrarPopup && (
          <div style={{ 
            border: '2px solid #007bff', 
            padding: '1.5rem', 
            marginTop: '1rem', 
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Nueva Película</h3>
            <div className="form-group">
              <input 
                placeholder="Título" 
                value={nuevoTitulo} 
                onChange={e => setNuevoTitulo(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input 
                type="number"
                placeholder="Año" 
                value={nuevoAno} 
                onChange={e => setNuevoAno(e.target.value)}
                className="form-input"
                min="1888"
                max="2030"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Imagen:</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="form-input"
              />
              {previewImagen && (
                <div style={{ marginTop: '0.5rem' }}>
                  <img 
                    src={previewImagen} 
                    alt="Vista previa" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '200px', 
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  />
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                    Vista previa
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button 
                onClick={handleAgregarPelicula}
                className="submit-button"
              >
                Guardar
              </button>
              <button 
                onClick={() => {
                  setMostrarPopup(false);
                  setNuevoImagen(null);
                  setPreviewImagen("");
                }}
                className="submit-button"
                style={{ backgroundColor: '#6c757d', background: 'linear-gradient(135deg, #6c757d, #545b62)' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Información de la película seleccionada */}
        {peliculaSeleccionada && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#e9f7fe', 
            borderRadius: '6px', 
            borderLeft: '4px solid #007bff',
            marginTop: '1rem'
          }}>
            <strong>Película seleccionada:</strong> {peliculaSeleccionada.titulo}
          </div>
        )}

        {/* Comentario */}
        <div className="form-group">
          <label className="form-label">Comentario:</label>
          <textarea 
            value={comentario} 
            onChange={e => setComentario(e.target.value)}
            className="form-input"
            rows={4}
            placeholder="Escribe tu reseña aquí..."
          />
        </div>

        {/* Calificación */}
        <div className="form-group">
          <label className="form-label">Calificación (1-10):</label>
          <input 
            type="number" 
            value={calificacion} 
            min={1}
            max={10}
            onChange={e => setCalificacion(Number(e.target.value))}
            className="form-input"
          />
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            Puntuacion Actual: {calificacion}/10
          </div>
        </div>

        {/* Botón para agregar review */}
        <button 
          onClick={handleAgregarReview}
          className="submit-button"
          disabled={loading || !peliculaId}
        >
          {loading ? "Agregando Reseña..." : "Agregar Reseña"}
        </button>
      </div>
    </div>
  );
}

export default NuevoReview;