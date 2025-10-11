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
        <button
  className="img-btn"
  onClick={() => navigate("/perfil")} // ← redirige al perfil
>
<img
  src={usuario?.foto_perfil || defaultProfile}
  alt="perfil"
  className="perfiles perfiles-topbar"
/>
   
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
            <button className="nav-btn"><Home /> Home</button>
            <button className="nav-btn"><Compass /> Explorar</button>
            <button className="nav-btn"><Grid /> Categorías</button>
            <button className="nav-btn" onClick={() => navigate("/mensajes")}><MessageSquare /> Mensajes</button>
            <button className="nav-btn"><Settings /> Configuración</button>
            <button className="nav-btn"><Image /> Galería de Arte</button>
          </nav>
        </div>

        <button className="post-btn mt-8" onClick={handlePost}>POST</button>
        <button className="post-btn mt-4" onClick={handleLogout}>CERRAR SESIÓN</button>
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

        {/* 🔹 Publicaciones */}
        <div className="posts">
        {publicaciones.map((post) => (
  <div key={post.id_publicacion} className="post-card">
    {/* Header del post con avatar del usuario */}
    <div className="post-header">
  <img
    src={
    post.usuario?.perfil?.foto_perfil
      ? `${post.usuario.perfil.foto_perfil}`
      : `${defaultProfile}`
       }
          alt="foto de perfil"
          className="perfiles perfiles-topbar"
            />

      <div className="user-info">
        <span className="username">{post.usuario?.nombre_usuario || "Usuario"}</span>
        <span className="timestamp">{new Date(post.fecha_creacion).toLocaleString()}</span>
      </div>
    </div>

    {/* Contenido del post */}
    <div className="post-content">
      <p>{post.contenido}</p>
      {/* Imagen del post (cada post puede tener su propia imagen) */}
     {post.imagen && (
  <img
    src={post.imagen}
    alt="post"
    className="post-image"
  />
)}

      <span className="username">{post.usuario?.nombre_usuario || "Usuario"}</span>
    </div>

    {/* Botones de acción */}
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
        <div className="card"><h2>COMUNIDADES A SEGUIR</h2></div>
        <div className="card"><h2>LO QUE SUCEDE CON EL MUNDO DEL ARTE</h2></div>
        <div className="card"><h2>A QUIÉN SEGUIR</h2></div>
      </aside>
    </div>
  );
}
