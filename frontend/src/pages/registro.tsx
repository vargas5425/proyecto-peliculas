import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../services/api";
import SHA256 from "crypto-js/sha256";

function Registro() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !email || !password) {
      setMensaje("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    try {
      const hashedPassword = SHA256(password).toString();

      await api.post("/usuarios/registro", {
        nombre,
        correo: email,
        password: hashedPassword,
      });

      setMensaje("Registro exitoso 🎉");
      setNombre("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (error: any) {
      setMensaje("Error al registrar: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const mensajeClase = mensaje.includes("Error") ? "error" : "exito";

  return (
    <div className={`form-container ${loading ? 'loading' : ''}`}>
      <h2 className="form-title">Registro de Usuario</h2>
      
      {mensaje && (
        <div className={`form-mensaje ${mensajeClase}`}>
          {mensaje}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="form-input"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
}

export default Registro;