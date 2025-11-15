import { Link } from "react-router-dom";
import type { Usuario } from "../types";

interface Props {
  usuario: Usuario | null;
  onLogout: () => void;
}

function Navbar({ usuario, onLogout }: Props) {
  return (
    <nav style={{ padding: "1rem", background: "#007bff", color: "white", display: "flex", gap: "1rem" }}>
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>Inicio</Link>
      <Link to="/peliculas" style={{ color: "white", textDecoration: "none" }}>Películas</Link>

      {usuario ? (
        <>
          <Link to="/mis-reviews" style={{ color: "white", textDecoration: "none" }}>Mis Reseñas</Link>
          <Link to="/agregar-review" style={{ color: "white", textDecoration: "none" }}>Agregar Review</Link>
          <span style={{ marginLeft: "auto" }}>
            Hola, {usuario.nombre} <button className="logout-btn" onClick={onLogout}>Cerrar Sesión</button>
          </span>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link>
          <Link to="/registro" style={{ color: "white", textDecoration: "none" }}>Registro</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
