import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Artenity from "./components/artenity";
import Login from "./components/login";
import Register from "./components/register";
import PaginaPrincipal from "./components/paginaprincipal";
import Perfil from "./components/perfil";
import Busqueda from "./components/busqueda";
import Messages from "./components/Messages";
import PerfilUsuario from "./components/PerfilUsuario";


function App() {
  const { token } = useAuth();

  return (
    <Routes>
      {/* 🔹 Página inicial */}
      <Route path="/" element={<Artenity />} />

      {/* 🔹 Rutas públicas de autenticación */}
      <Route
        path="/login"
        element={token ? <Navigate to="/principal" /> : <Login />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/principal" /> : <Register />}
      />

      {/* 🔹 Rutas protegidas (solo accesibles con sesión iniciada) */}
      <Route
        path="/principal"
        element={token ? <PaginaPrincipal /> : <Navigate to="/login" />}
      />
      <Route
        path="/perfil"
        element={token ? <Perfil /> : <Navigate to="/login" />}
      />
      <Route
        path="/usuario/:id"
        element={token ? <PerfilUsuario /> : <Navigate to="/login" />}
      />
      <Route
        path="/busqueda"
        element={token ? <Busqueda /> : <Navigate to="/login" />}
      />
      <Route
        path="/mensajes"
        element={token ? <Messages /> : <Navigate to="/login" />}
      />
      {/* 🔹 Cualquier otra ruta redirige al login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
