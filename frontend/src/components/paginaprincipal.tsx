// components/PaginaPrincipal.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUsuario } from "../services/api";
import defaultProfile from "../assets/img/fotoperfildefault.jpg";
import { Home, Compass, Grid, MessageSquare, Settings, Image } from "lucide-react";
import "../styles/paginaprincipal.css";

const PaginaPrincipal: React.FC = () => {
  const { usuario, setUsuario, logout } = useAuth();
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [correo, setCorreo] = useState(usuario?.correo_electronico || "");
  const [imagen, setImagen] = useState<File | null>(null);
  const [editar, setEditar] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre);
      setCorreo(usuario.correo_electronico);
    }
  }, [usuario]);

  const handleSubmit = async () => {
    if (!usuario) return;
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("correo_electronico", correo);
    if (imagen) formData.append("file", imagen);

    try {
      const updated = await updateUsuario(usuario.id_usuario, formData);
      setUsuario(updated);
      setEditar(false);
      alert("Perfil actualizado!");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar perfil");
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  if (!usuario) return <div>Cargando...</div>;

  return (
    <div className="main-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="text-center text-2xl font-bold mb-4">🎨 Artenity</div>

        <div className="text-center mb-6">
          {/* Perfil */}
          <div className="perfil-container">
            <img
             
  src={usuario?.avatar || defaultProfile}
  alt="Perfil"
  className="w-16 h-16 rounded-full mx-auto mb-2"
/>
<p className="text-lg font-semibold">{usuario?.nombre || "Usuario"}</p>
            
            <button onClick={() => setEditar(true)} className="editar-btn">
              Editar perfil
            </button>

            {editar && (
              <div className="modal">
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre"
                />
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="Correo"
                />
                <input
                  type="file"
                  onChange={(e) =>
                    e.target.files && setImagen(e.target.files[0])
                  }
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSubmit}
                    className="bg-purple-700 text-white px-4 py-2 rounded"
                  >
                    Guardar cambios
                  </button>
                  <button
                    onClick={() => setEditar(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
          <p className="text-lg font-semibold">
            Hola, {usuario.nombre || usuario.nombre}
          </p>
        </div>

        {/* Navegación */}
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
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60">
            <MessageSquare /> Mensajes
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60">
            <Settings /> Configuración
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60">
            <Image /> Galería de Arte
          </button>
        </nav>

        <button
          className="post-btn mt-8"
          onClick={() => alert("Funcionalidad POST")}
        >
          POST
        </button>
        <button className="post-btn mt-4" onClick={handleLogout}>
          CERRAR SESIÓN
        </button>
      </aside>

      {/* Centro */}
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

      {/* Sidebar derecho */}
      <aside className="right-sidebar">
        <input type="text" placeholder="Buscar" />
      </aside>
    </div>
  );
};

export default PaginaPrincipal;
