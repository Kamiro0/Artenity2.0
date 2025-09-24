import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Artenity from './components/artenity';
import Login from './components/login';
import Register from './components/register';
import PaginaPrincipal from './components/paginaprincipal';
import Perfil from "./components/perfil";
import Busqueda from "./components/busqueda";

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null; 
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Artenity />} />
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/principal" /> : <Login />}
        />
        <Route path="/perfil" element={<Perfil />} />
        <Route
          path="/register"
          element={isAuthenticated() ? <Navigate to="/principal" /> : <Register />}
        />
        <Route
          path="/principal"
          element={isAuthenticated() ? <PaginaPrincipal /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/busqueda" element={<Busqueda />} />
      </Routes>
    </Router>
  );
}
export default App;