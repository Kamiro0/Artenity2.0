import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Compass, Grid, MessageSquare, Settings, Image } from "lucide-react";
import "../styles/paginaprincipal.css";
import defaultProfile from "../assets/img/fotoperfildefault.jpg";
import { getPublicaciones, crearPublicacion } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function PaginaPrincipal() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [contenido, setContenido] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Añadir clase al body
  useEffect(() => {
    document.body.classList.add("pagina-principal");
    return () => {
      document.body.classList.remove("pagina-principal");
    };
  }, []);

  // Cargar publicaciones
  useEffect(() => {
    cargarPublicaciones();
  }, []);

  const cargarPublicaciones = async () => {
    const posts = await getPublicaciones();
    setPublicaciones(posts);
  };

  // Crear publicación
  const handlePost = async () => {
    if (!contenido.trim() && !file) return;

    const data = new FormData();
    data.append("id_usuario", usuario!.id_usuario.toString());
    data.append("contenido", contenido);
    if (file) data.append("file", file);

    await crearPublicacion(data);
    setContenido("");
    setFile(null);
    await cargarPublicaciones();
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="main-container">
      {/* 🔹 Barra superior */}
      <div className="topbar">
        <input type="text" placeholder="Buscar" className="search-input" />
        <button className="icon-btn">🔔</button>
        <button className="img-btn">
          <img src={defaultProfile} alt="Perfil" />
        </button>
        <button className="icon-btn" onClick={handleLogout}>
          ⏻
        </button>
      </div>

      {/* 🔹 Sidebar izquierda */}
      <aside className="sidebar">
        <div>
          <div className="text-center text-2xl font-bold mb-8">🎨 Artenity</div>
          <nav className="space-y-4">
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60">
              <Home /> Home
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60">
              <Compass /> Explorar
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60">
              <Grid /> Categorías
            </button>
            <button
              className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60"
              onClick={() => navigate("/mensajes")}
            >
              <MessageSquare /> Mensajes
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60">
              <Settings /> Configuración
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60">
              <Image /> Galería de Arte
            </button>
          </nav>
        </div>

        <button className="post-btn mt-8" onClick={handlePost}>
          POST
        </button>
        <button className="post-btn mt-4" onClick={handleLogout}>
          CERRAR SESIÓN
        </button>
      </aside>

      {/* 🔹 Sección central */}
      <section className="center-section">
        <div className="tabs">
          <button>PARA TI</button>
          <button>SEGUIR</button>
          <button>GUARDADO</button>
        </div>

        {/* Crear nuevo post */}
        <div className="post-input">
          <input
            type="text"
            placeholder="¿QUÉ QUIERES ESCRIBIR?"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button onClick={handlePost}>POST</button>
        </div>

        <div className="banner">NUEVOS POSTERS!!</div>

        {/* 🔹 Publicación destacada */}
        <div className="posts">
          <div className="post-card featured-post">
            <div className="post-header">
              <img src={defaultProfile} alt="perfil" className="avatar" />
              <div className="user-info">
                <span className="username">USER NAME</span>
                <span className="user-handle">@USERNAME</span>
                <span className="timestamp">· 7H</span>
              </div>
            </div>
            <div className="post-content">
              <p><strong>LO MÁS VISTO SOBRE EL ARTE DE VAN GOGH</strong></p>
            </div>
            <div className="post-actions">
              <button className="action-btn">💬 284</button>
              <button className="action-btn">🔄 156</button>
              <button className="action-btn">❤️ 1.2K</button>
              <button className="action-btn">📤</button>
            </div>
          </div>

          {/* 🔹 Publicaciones dinámicas */}
          {publicaciones.map((post) => (
            <div key={post.id_publicacion} className="post-card">
              <div className="post-header">
                <img src={defaultProfile} alt="perfil" className="avatar" />
                <div className="user-info">
                  <span className="username">{post.nombre_usuario || `Usuario${post.id_usuario}`}</span>
                  <span className="user-handle">@{post.username || `user${post.id_usuario}`}</span>
                  <span className="timestamp">· {post.fecha_creacion || "Reciente"}</span>
                </div>
              </div>
              <div className="post-content">
                <p>{post.contenido}</p>
                {post.imagen && (
                  <img src={post.imagen} alt="imagen del post" className="post-image" />
                )}
              </div>
              <div className="post-actions">
                <button className="action-btn">💬</button>
                <button className="action-btn">🔄</button>
                <button className="action-btn">❤️</button>
                <button className="action-btn">📤</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 Sidebar derecha */}
      <aside className="right-sidebar">
        <div className="card">
          <h2>COMUNIDADES A SEGUIR</h2>
        </div>
        <div className="card">
          <h2>LO QUE SUCEDE CON EL MUNDO DEL ARTE</h2>
        </div>
        <div className="card">
          <h2>A QUIÉN SEGUIR</h2>
        </div>
      </aside>
    </div>
  );
}
