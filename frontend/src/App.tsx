import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Artenity from "./components/artenity";
import Login from "./components/login";
import Register from "./components/register";
import PaginaPrincipal from "./components/paginaprincipal"; // default export
import Perfil from "./components/perfil"; // default export
import Busqueda from "./components/busqueda";

function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Artenity />} />
      <Route
        path="/login"
        element={token ? <Navigate to="/principal" /> : <Login />}
      />
      <Route path="/perfil" element={<Perfil />} />
      <Route
        path="/register"
        element={token ? <Navigate to="/principal" /> : <Register />}
      />
      <Route
        path="/principal"
        element={token ? <PaginaPrincipal /> : <Navigate to="/login" />}
      />
      <Route path="/busqueda" element={<Busqueda />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
