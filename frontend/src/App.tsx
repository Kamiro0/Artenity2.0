import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Artenity from './components/artenity';
import Login from './components/login';
import Register from './components/register';
import PaginaPrincipal from './components/paginaprincipal';

// Función para revisar si el usuario está autenticado
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null; 
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta inicial hacia Artenity */}
        <Route path="/" element={<Artenity />} />

        {/* Si ya está autenticado, redirige login y register a principal */}
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/principal" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated() ? <Navigate to="/principal" /> : <Register />}
        />

        {/* Ruta protegida para la página principal */}
        <Route
          path="/principal"
          element={isAuthenticated() ? <PaginaPrincipal /> : <Navigate to="/login" />}
        />

        {/* Cualquier ruta desconocida redirige a login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;