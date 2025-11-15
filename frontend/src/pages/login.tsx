import { useState } from "react";
import { api } from "../services/api";
import SHA256 from "crypto-js/sha256";
import { useNavigate } from "react-router-dom";
import type { Usuario } from "../types";

interface LoginProps {
  setUsuario: React.Dispatch<React.SetStateAction<Usuario | null>>;
}

function Login({ setUsuario }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMensaje("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    try {
      const hashedPassword = SHA256(password).toString();
      const res = await api.post("/usuarios/login", { 
        correo: email, 
        contrasena: hashedPassword 
      });
      
      setUsuario(res.data);

      localStorage.setItem("usuario", JSON.stringify(res.data));

      
      setMensaje("Login exitoso");
      setEmail("");
      setPassword("");
      navigate("/mis-reviews");
    } catch (error: any) {
      setMensaje("Error al iniciar sesión: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const mensajeClase = mensaje.includes("Error") ? "error" : "exito";

  return (
    <div className={`form-container ${loading ? 'loading' : ''}`}>
      <h2 className="form-title">Iniciar Sesión</h2>

      {mensaje && (
        <div className={`form-mensaje ${mensajeClase}`}>
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
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
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}

export default Login;