import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navBar";
import Peliculas from "./pages/peliculas";
import PeliculaDetalle from "./pages/peliculaDetalle";
import Login from "./pages/login";
import Registro from "./pages/registro";
import NuevoReview from "./pages/nuevoReview";
import MisReviews from "./pages/misReviews";
import type { Usuario } from "./types";

function App() {

  const [usuario, setUsuario] = useState<Usuario | null>(() => {
  const stored = localStorage.getItem("usuario");
  return stored ? JSON.parse(stored) : null;
});


  const handleLogout = () => {
  setUsuario(null);
  localStorage.removeItem("usuario");
};

  return (
    <Router>
      <Navbar usuario={usuario} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Navigate to="/peliculas" />} />
        <Route path="/peliculas" element={<Peliculas />} />
        <Route path="/peliculas/:id" element={<PeliculaDetalle usuario={usuario} />} />
        <Route path="/login" element={<Login setUsuario={setUsuario} />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/agregar-review/:id" element={usuario ? <NuevoReview usuario={usuario} /> : <Navigate to="/login" />}/>
        <Route path="/agregar-review" element={usuario ? <NuevoReview usuario={usuario} /> : <Navigate to="/login" />}/>
        <Route path="/mis-reviews" element={usuario ? <MisReviews usuario={usuario} /> : <Navigate to="/login" />}/>
      </Routes>
    </Router>
  );
}

export default App;
