import React, { useEffect, useState } from "react";
import { getUsuarios } from "../services/api";
import "../styles/perfil.css";

interface Usuario {
  id: number;
  name: string;
  edad: number;
  correo: string;
  amigos?: { id: number; name: string }[];
}

const Perfil: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        // Simula que el usuario actual tiene id=1 (puedes ajustar según tu login)
        const data = await getUsuarios();
        const currentUser = data[0]; // el primer usuario como ejemplo
        setUsuario(currentUser);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };
    fetchUsuario();
  }, []);

  if (!usuario) {
    return <div className="perfil-container">Cargando perfil...</div>;
  }

  return (
    <div className="perfil-container">
      {/* Barra lateral */}
      <aside className="perfil-sidebar">
        <div className="perfil-avatar">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="avatar"
          />
        </div>
        <nav>
          <ul>
            <li>Inicio</li>
            <li>Amigos</li>
            <li>Mensajes</li>
            <li>Configuración</li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="perfil-main">
        <section className="perfil-detalles">
          <h2>Detalles</h2>
          <p><b>Nombre:</b> {usuario.name}</p>
          <p><b>Edad:</b> {usuario.edad}</p>
          <p><b>Correo:</b> {usuario.correo}</p>
        </section>

        <section className="perfil-comentarios">
          <h2>Comentarios</h2>
          <div className="comentario">
            <b>{usuario.name}</b>: ¡Me encanta el arte de Van Gogh!
          </div>
          <div className="comentario">
            <b>Amigo</b>: Qué buena galería la que subiste ayer 👌
          </div>
        </section>

        <section className="perfil-amigos">
          <h2>Amigos</h2>
          {usuario.amigos && usuario.amigos.length > 0 ? (
            <ul>
              {usuario.amigos.map((amigo) => (
                <li key={amigo.id}>{amigo.name}</li>
              ))}
            </ul>
          ) : (
            <p>No tienes amigos añadidos.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Perfil;
