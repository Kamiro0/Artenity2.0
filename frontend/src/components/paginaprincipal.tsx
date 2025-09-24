import { useEffect } from "react";
import { Home, Compass, Grid, MessageSquare, Settings, Image } from "lucide-react";
import "../styles/paginaprincipal.css";
import defaultProfile from "../assets/img/fotoperfildefault.jpg";

export default function PaginaPrincipal() {
  useEffect(() => {
    document.body.classList.add("pagina-principal");
    return () => {
      document.body.classList.remove("pagina-principal");
    };
  }, []);
  return (
    <div className="main-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="text-center text-2xl font-bold mb-8">🎨 Artenity</div>
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
        <button
          className="post-btn mt-4"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
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
        {/* Aquí puedes renderizar los posts reales */}
      </section>

      {/* Sidebar derecha */}
      <aside className="right-sidebar">
        <input type="text" placeholder="Buscar" />
        <div className="card">
          <h2>COMUNIDADES A SEGUIR</h2>
          <div className="user"><span>COMUNIDAD.NAME</span></div>
          <div className="user"><span>COMUNIDAD.NAME</span></div>
        </div>
        <div className="card">
          <h2>LO QUE SUCEDE CON EL MUNDO DEL ARTE</h2>
          <div className="user"><span>@USER.NAME</span></div>
          <div>Sistemas nuevos para dibujo</div>
        </div>
        <div className="card">
          <h2>A QUIÉN SEGUIR</h2>
          <div className="user"><span>USER.NAME</span><button className="follow-btn">+</button></div>
          <div className="user"><span>USER.NAME</span><button className="follow-btn">+</button></div>
        </div>
      </aside>
    </div>
  );
}