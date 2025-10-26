import React, { useState, useEffect, useCallback } from "react";
import defaultProfile from "../assets/img/fotoperfildefault.jpg";
import { useAuth } from "../context/AuthContext";
import {
  actualizarPerfil,
  getPerfil,
  getAmigos,
  obtenerSeguidores,
  eliminarAmigo,
  obtenerSiguiendo,
  obtenerEstadisticasPerfil,
  obtenerPublicacionesUsuario,
} from "../services/api";
import "../styles/perfil.css";

const Perfil: React.FC = () => {
  const { usuario, actualizarFotoPerfil, forzarActualizacionPerfil } = useAuth();

  const [descripcion, setDescripcion] = useState("");
  const [biografia, setBiografia] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");
  const [editar, setEditar] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [amigos, setAmigos] = useState<any[]>([]);
  const [seguidores, setSeguidores] = useState<any[]>([]);
  const [siguiendo, setSiguiendo] = useState<any[]>([]);
  const [estadisticas, setEstadisticas] = useState({
    seguidores: 0,
    siguiendo: 0,
    publicaciones: 0,
  });
  const [publicaciones, setPublicaciones] = useState<any[]>([]);

  // ✅ Cargar perfil
  const cargarPerfil = useCallback(async () => {
    if (!usuario?.id_usuario) return;
    try {
      const perfilData = await getPerfil(usuario.id_usuario);
      setDescripcion(perfilData.descripcion || "");
      setBiografia(perfilData.biografia || "");
      const fotoConTimestamp = perfilData.foto_perfil
        ? `${perfilData.foto_perfil}?t=${new Date().getTime()}`
        : defaultProfile;
      setFotoPreview(fotoConTimestamp);
    } catch (error) {
      console.error("Error cargando perfil:", error);
      setFotoPreview(defaultProfile);
    }
  }, [usuario?.id_usuario]);

  // ✅ Cargar estadísticas
  const cargarEstadisticas = useCallback(async () => {
    if (!usuario?.id_usuario) return;
    try {
      const stats = await obtenerEstadisticasPerfil(usuario.id_usuario);
      setEstadisticas(stats);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  }, [usuario?.id_usuario]);

  // ✅ Cargar publicaciones
  const cargarPublicaciones = useCallback(async () => {
    if (!usuario?.id_usuario) return;
    try {
      const posts = await obtenerPublicacionesUsuario(usuario.id_usuario);
      setPublicaciones(posts);
    } catch (error) {
      console.error("Error cargando publicaciones:", error);
    }
  }, [usuario?.id_usuario]);

  // ✅ Cargar amigos
  const cargarAmigos = useCallback(async () => {
    try {
      const amigosData = await getAmigos();
      const amigosConFoto = amigosData.map((a: any) => ({
        ...a,
        foto_perfil: a.foto_perfil
          ? `${a.foto_perfil}?t=${new Date().getTime()}`
          : defaultProfile,
      }));
      setAmigos(amigosConFoto);
    } catch (error) {
      console.error("Error cargando amigos:", error);
    }
  }, []);

  // ✅ Cargar seguidores
  const cargarSeguidores = useCallback(async () => {
    try {
      const data = await obtenerSeguidores();
      const seguidoresConFoto = data.map((s: any) => ({
        ...s,
        seguidor: {
          ...s.seguidor,
          foto_perfil: s.seguidor?.foto_perfil
            ? `${s.seguidor.foto_perfil}?t=${new Date().getTime()}`
            : defaultProfile,
        },
      }));
      setSeguidores(seguidoresConFoto);
    } catch (error) {
      console.error("Error cargando seguidores:", error);
    }
  }, []);

  // ✅ Cargar siguiendo
  const cargarSiguiendo = useCallback(async () => {
    try {
      const data = await obtenerSiguiendo();
      const siguiendoConFoto = data.map((s: any) => ({
        ...s,
        seguido: {
          ...s.seguido,
          foto_perfil: s.seguido?.foto_perfil
            ? `${s.seguido.foto_perfil}?t=${new Date().getTime()}`
            : defaultProfile,
        },
      }));
      setSiguiendo(siguiendoConFoto);
    } catch (error) {
      console.error("Error cargando siguiendo:", error);
    }
  }, []);

  // ✅ Cargar todo al montar
  useEffect(() => {
    cargarPerfil();
    cargarAmigos();
    cargarSeguidores();
    cargarSiguiendo();
    cargarEstadisticas();
    cargarPublicaciones();
  }, [
    cargarPerfil,
    cargarAmigos,
    cargarSeguidores,
    cargarSiguiendo,
    cargarEstadisticas,
    cargarPublicaciones,
  ]);

  // 📸 Seleccionar imagen
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagen(file);
      const reader = new FileReader();
      reader.onload = (ev) => setFotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 💾 Guardar perfil
  const handleSubmit = async () => {
    if (!usuario?.id_usuario) return;
    setCargando(true);
    try {
      const formData = new FormData();
      if (descripcion) formData.append("descripcion", descripcion);
      if (biografia) formData.append("biografia", biografia);
      if (imagen) formData.append("file", imagen);

      const perfilActualizado = await actualizarPerfil(usuario.id_usuario, formData);

      if (perfilActualizado.foto_perfil) {
        actualizarFotoPerfil(perfilActualizado.foto_perfil);
        forzarActualizacionPerfil();
      }

      await Promise.all([
        cargarPerfil(),
        cargarAmigos(),
        cargarSeguidores(),
        cargarSiguiendo(),
        cargarEstadisticas(),
        cargarPublicaciones(),
      ]);

      setEditar(false);
      alert("¡Perfil actualizado correctamente!");
      window.dispatchEvent(new Event("fotoPerfilActualizada"));
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      alert("Error al actualizar el perfil");
    } finally {
      setCargando(false);
    }
  };

  if (!usuario) return <div className="cargando">Cargando perfil...</div>;

  return (
    <div className="perfil-container">
      {/* 🧩 COLUMNA IZQUIERDA */}
      <div className="perfil-info">
        <div className="perfil-header">
          <img src={fotoPreview || defaultProfile} alt="Foto de perfil" className="perfil-foto" />
          <h2 className="perfil-nombre">{usuario.nombre_usuario}</h2>
          <p className="perfil-correo">{usuario.correo_electronico}</p>

          {/* 📊 Estadísticas */}
          <div className="estadisticas-perfil">
            <div className="estadistica-item">
              <span className="estadistica-numero">{estadisticas.publicaciones}</span>
              <span className="estadistica-label">Publicaciones</span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-numero">{estadisticas.seguidores}</span>
              <span className="estadistica-label">Seguidores</span>
            </div>
            <div className="estadistica-item">
              <span className="estadistica-numero">{estadisticas.siguiendo}</span>
              <span className="estadistica-label">Siguiendo</span>
            </div>
          </div>

          {!editar && (
            <button onClick={() => setEditar(true)} className="perfil-editar">
              Editar perfil
            </button>
          )}
        </div>

        {editar ? (
          <div className="perfil-edicion">
            <h3>Editar Perfil</h3>
            <label>Descripción:</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Tu descripción..."
            />
            <label>Biografía:</label>
            <textarea
              value={biografia}
              onChange={(e) => setBiografia(e.target.value)}
              placeholder="Cuéntanos sobre ti..."
            />
            <label>Foto de perfil:</label>
            <input type="file" accept="image/*" onChange={handleImageSelect} />

            {fotoPreview && (
              <div className="preview-imagen">
                <img src={fotoPreview} alt="Preview" />
              </div>
            )}

            <div className="botones-accion">
              <button onClick={handleSubmit} disabled={cargando} className="btn-guardar">
                {cargando ? "Guardando..." : "Guardar cambios"}
              </button>
              <button onClick={() => setEditar(false)} className="btn-cancelar">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="perfil-section">
              <h3>Descripción:</h3>
              <p className="perfil-texto">{descripcion || "Sin descripción"}</p>
            </div>
            <div className="perfil-section">
              <h3>Biografía:</h3>
              <p className="perfil-texto">{biografia || "Sin biografía"}</p>
            </div>

            {/* 🔹 PUBLICACIONES DEL USUARIO */}
            <div className="perfil-section">
              <h3>Mis Publicaciones ({publicaciones.length})</h3>
              {publicaciones.length > 0 ? (
                <div className="publicaciones-lista">
                  {publicaciones.map((post) => (
                    <div key={post.id_publicacion} className="publicacion-card">
                      {/* Header de la publicación */}
                      <div className="publicacion-header">
                        <img
                          src={post.usuario?.perfil?.foto_perfil || defaultProfile}
                          alt="Foto perfil"
                          className="publicacion-foto-perfil"
                        />
                        <div className="publicacion-info-usuario">
                          <span className="publicacion-usuario">
                            {post.usuario?.nombre_usuario || "Usuario"}
                          </span>
                          <span className="publicacion-fecha">
                            {new Date(post.fecha_creacion).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="publicacion-contenido">
                        <p className="publicacion-texto">{post.contenido}</p>
                        {post.imagen && (
                          <img
                            src={post.imagen}
                            alt="Publicación"
                            className="publicacion-imagen"
                          />
                        )}
                      </div>

                      {/* Acciones */}
                      <div className="publicacion-acciones">
                        <button className="accion-btn">💬 Comentar</button>
                        <button className="accion-btn">🔄 Compartir</button>
                        <button className="accion-btn">❤️ Me gusta</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="sin-publicaciones">No hay publicaciones aún.</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* 🧩 COLUMNA DERECHA */}
      <div className="perfil-lateral">
        {/* Siguiendo */}
        <div className="perfil-lista">
          <h3>Siguiendo ({siguiendo.length})</h3>
          {siguiendo.length > 0 ? (
            siguiendo.map((item) => (
              <div key={item.id_seguimiento} className="usuario-item">
                <img
                  src={item.seguido.foto_perfil || defaultProfile}
                  alt={`Foto de ${item.seguido.nombre_usuario}`}
                  className="usuario-foto"
                />
                <span className="usuario-nombre">{item.seguido.nombre_usuario}</span>
              </div>
            ))
          ) : (
            <p>No sigues a nadie aún.</p>
          )}
        </div>

        {/* Amigos */}
        <div className="perfil-lista">
          <h3>Amigos ({amigos.length})</h3>
          {amigos.length > 0 ? (
            amigos.map((amigo) => (
              <div key={amigo.id_usuario} className="usuario-item">
                <img
                  src={amigo.foto_perfil || defaultProfile}
                  alt={`Foto de ${amigo.nombre_usuario}`}
                  className="usuario-foto"
                />
                <span className="usuario-nombre">
                  {amigo.nombre_usuario}
                  <button
                    className="btn-eliminar-amigo"
                    onClick={async () => {
                      if (window.confirm(`¿Eliminar a ${amigo.nombre_usuario}?`)) {
                        try {
                          await eliminarAmigo(amigo.id_usuario);
                          setAmigos(amigos.filter((a) => a.id_usuario !== amigo.id_usuario));
                          alert("Amigo eliminado correctamente.");
                        } catch (error) {
                          alert("Error al eliminar amigo.");
                          console.error(error);
                        }
                      }
                    }}
                  >
                    ❌
                  </button>
                </span>
              </div>
            ))
          ) : (
            <p>No tienes amigos aún.</p>
          )}
        </div>

        {/* Seguidores */}
        <div className="perfil-lista">
          <h3>Seguidores ({seguidores.length})</h3>
          {seguidores.length > 0 ? (
            seguidores.map((seguidor) => (
              <div key={seguidor.id_seguimiento} className="usuario-item">
                <img
                  src={seguidor.seguidor?.foto_perfil || defaultProfile}
                  alt={`Foto de ${seguidor.seguidor?.nombre_usuario}`}
                  className="usuario-foto"
                />
                <span className="usuario-nombre">
                  {seguidor.seguidor?.nombre_usuario || "Usuario"}
                </span>
              </div>
            ))
          ) : (
            <p>No tienes seguidores aún.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
