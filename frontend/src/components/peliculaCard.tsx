import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface PeliculaCardProps {
  id: number;
  titulo: string;
  anio: number;
  imagen: string;
  calificacion: number; // Esto viene de 0-10
  onClick?: (id: number) => void;
}

const PeliculaCard: React.FC<PeliculaCardProps> = ({
  id,
  titulo,
  anio,
  imagen,
  calificacion,
  onClick,
}) => {
  // Función para obtener la URL completa de la imagen
  const getImageUrl = (imagenPath: string) => {
    if (imagenPath.startsWith('http')) {
      return imagenPath;
    } else if (imagenPath.startsWith('/images/')) {
      return `http://localhost:3000${imagenPath}`;
    } else {
      return `http://localhost:3000/public/images/${imagenPath}`;
    }
  };

  const renderEstrellas = () => {
    const estrellas = [];
    
    // ✅ ESCALAR de 0-10 a 0-5 para las estrellas
    const ratingEnEstrellas = (calificacion / 2); // Convierte 0-10 a 0-5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= ratingEnEstrellas) {
        // Estrella llena
        estrellas.push(<FaStar key={i} color="#ffc107" size={16} />);
      } else if (i - 0.5 <= ratingEnEstrellas) {
        // Media estrella
        estrellas.push(<FaStarHalfAlt key={i} color="#ffc107" size={16} />);
      } else {
        // Estrella vacía
        estrellas.push(<FaRegStar key={i} color="#ffc107" size={16} />);
      }
    }
    
    return estrellas;
  };

  return (
    <div
      className="pelicula-card"
      onClick={() => onClick && onClick(id)}
    >
      {/* IMAGEN ACTUALIZADA CON getImageUrl */}
      <img 
        src={getImageUrl(imagen)} 
        alt={titulo} 
        className="pelicula-imagen" 
        onError={(e) => {
          e.currentTarget.src = '/images/placeholder.jpg'; // Imagen por defecto si falla
        }}
      />
      <div className="pelicula-info">
        <h3 className="pelicula-titulo">{titulo} ({anio})</h3>
           {/* Estrellas */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
              {renderEstrellas()} 
            </div>
            
            {/* Calificación debajo */}
            <div style={{ textAlign: 'center', fontSize: '15px', color: '#666' }}>
              {calificacion.toFixed(1)}/10
            </div>
        </div>
      </div>
  );
};

export default PeliculaCard;