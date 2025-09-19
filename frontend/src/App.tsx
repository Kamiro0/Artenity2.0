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
        {/* Mantengo tu ruta inicial hacia Artenity */}
        <Route path="/" element={<Artenity />} />

        {/* Login y registro como ya lo tenías */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Nueva ruta protegida para la página principal */}
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
