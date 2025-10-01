import { useEffect } from "react";
import { Home, Compass, Grid, MessageSquare, Settings, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/paginaprincipal.css";
import defaultProfile from "../assets/img/fotoperfildefault.jpg";
import { useAuth } from "../context/AuthContext";

export default function PaginaPrincipal() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirige al login
  };

  useEffect(() => {
    document.body.classList.add("pagina-principal");
    return () => {
      document.body.classList.remove("pagina-principal");
    };
  }, []);

  return (
    <div className="main-container">
      {/* Sidebar izquierda */}
      <aside className="sidebar">
        <div>
          <div className="text-center text-2xl font-bold mb-4">🎨 Artenity</div>
          <div className="text-center mb-6">
            <img
              src={defaultProfile}
              alt="Perfil"
              className="w-16 h-16 rounded-full mx-auto mb-2"
            />
            <p className="text-lg font-semibold">
              {usuario ? `Hola, ${usuario}` : "Usuario"}
            </p>
          </div>

          <nav className="space-y-4">
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60"><Home /> Home</button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60"><Compass /> Explorar</button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60"><Grid /> Categorías</button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60"><MessageSquare /> Mensajes</button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60"><Settings /> Configuración</button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60"><Image /> Galería de Arte</button>
          </nav>
        </div>
        <button className="post-btn mt-8">POST</button>
        <button className="post-btn mt-4" onClick={handleLogout}>
          CERRAR SESIÓN
        </button>
      </aside>

      {/* Sección central */}
      <section className="center-section">
        <div className="tabs">
          <button>PARA TI</button>
          <button>SEGUIR</button>
          <button>GUARDADO</button>
        </div>
        <div className="post-input">
          <input type="text" placeholder="¿QUÉ QUIERES ESCRIBIR?" />
          <button>POST</button>
        </div>
        <div className="banner">NUEVOS POSTERS!!</div>
      </section>

      {/* Sidebar derecha */}
      <aside className="right-sidebar">
        <input type="text" placeholder="Buscar" />
        {/* contenido adicional */}
      </aside>
    </div>
  );
}
