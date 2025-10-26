import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPerfil,
  seguirUsuario,
  enviarSolicitudAmistad,
  dejarDeSeguirUsuario,
  reportarUsuario,
  getAmigos,
  obtenerEstadisticasPerfil,
  obtenerPublicacionesUsuario,
} from "../services/api";
import defaultProfile from "../assets/img/fotoperfildefault.jpg";
import { useAuth } from "../context/AuthContext";
import "../styles/perfilUsuario.css";

export default function PerfilUsuario() {
  const { id } = useParams();
  const { usuario: usuarioActual } = useAuth();
  const [perfil, setPerfil] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [reporteModal, setReporteModal] = useState(false);
  const [motivoReporte, setMotivoReporte] = useState("");
  const [amigos, setAmigos] = useState<any[]>([]);
  const [estadisticas, setEstadisticas] = useState({
    seguidores: 0,
    siguiendo: 0,
    publicaciones: 0,
  });
  const [publicaciones, setPublicaciones] = useState<any[]>([]);

  const esAmigo = perfil ? amigos.some((a) => a.id_usuario === perfil.id_usuario) : false;
  const esMiPerfil = usuarioActual?.id_usuario === perfil?.id_usuario;

  useEffect(() => {
    if (id) {
      const userId = parseInt(id);
      cargarPerfilUsuario(userId);
      cargarAmigos(userId);
      cargarEstadisticas(userId);
      cargarPublicaciones(userId);
    }
  }, [id]);

  // 🔹 Cargar datos del perfil
  const cargarPerfilUsuario = async (idUsuario: number) => {
    try {
      setCargando(true);
      const perfilData = await getPerfil(idUsuario);
      setPerfil(perfilData);
    } catch (error) {
      console.error("Error cargando perfil:", error);
      alert("Error al cargar el perfil del usuario");
    } finally {
      setCargando(false);
    }
  };

  // 🔹 Cargar amigos
  const cargarAmigos = async (idUsuario: number) => {
    try {
      const amigosData = await getAmigos(idUsuario);
      setAmigos(amigosData);
    } catch (error) {
      console.error("Error cargando amigos:", error);
    }
  };

  // 🔹 Cargar estadísticas
  const cargarEstadisticas = async (idUsuario: number) => {
    try {
      const stats = await obtenerEstadisticasPerfil(idUsuario);
      setEstadisticas(stats);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  };

  // 🔹 Cargar publicaciones
  const cargarPublicaciones = async (idUsuario: number) => {
    try {
      const posts = await obtenerPublicacionesUsuario(idUsuario);
      setPublicaciones(posts);
    } catch (error) {
      console.error("Error cargando publicaciones:", error);
    }
  };

  // 🔹 Acciones
  const handleSeguir = async () => {
    if (!id) return;
    try {
      await seguirUsuario(parseInt(id));
      alert("¡Ahora sigues a este usuario!");
      cargarPerfilUsuario(parseInt(id));
      cargarEstadisticas(parseInt(id));
    } catch (error: any) {
      alert(error.response?.data?.detail || "Error al seguir usuario");
    }
  };

  const handleDejarSeguir = async () => {
    if (!id) return;
    try {
      await dejarDeSeguirUsuario(parseInt(id));
      alert("Has dejado de seguir a este usuario");
      cargarPerfilUsuario(parseInt(id));
      cargarEstadisticas(parseInt(id));
    } catch (error: any) {
      alert(error.response?.data?.detail || "Error al dejar de seguir usuario");
    }
  };

  const handleSolicitudAmistad = async () => {
    if (!id) return;
    try {
      await enviarSolicitudAmistad(parseInt(id));
      alert("¡Solicitud de amistad enviada!");
    } catch (error: any) {
      alert(error.response?.data?.detail || "Error al enviar solicitud");
    }
  };

  const handleReportar = async () => {
    if (!id || !motivoReporte.trim()) return;
    try {
      await reportarUsuario(parseInt(id), motivoReporte);
      alert("Usuario reportado correctamente");
      setReporteModal(false);
      setMotivoReporte("");
    } catch (error: any) {
      alert(error.response?.data?.detail || "Error al reportar usuario");
    }
  };

  if (cargando) return <div className="cargando">Cargando perfil...</div>;
  if (!perfil) return <div className="error">Usuario no encontrado</div>;

  return (
    <div className="perfil-usuario-container">
      {/* Header del perfil */}
      <div className="perfil-header">
        <div className="foto-perfil-section">
          <img
            src={perfil.foto_perfil || defaultProfile}
            alt="Foto de perfil"
            className="foto-perfil-grande"
          />
        </div>

        <div className="info-perfil">
          <h1>{perfil.usuario?.nombre_usuario || "Usuario"}</h1>
          <p className="nombre-completo">
            {perfil.usuario?.nombre} {perfil.usuario?.apellido}
          </p>

          {perfil.descripcion && <p className="descripcion">{perfil.descripcion}</p>}

          {/* Estadísticas */}
          <div className="estadisticas">
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

          {/* Botones de acción */}
          {!esMiPerfil && (
            <div className="acciones-perfil">
              {perfil.sigo ? (
                <button onClick={handleDejarSeguir} className="btn-dejar-seguir">
                  🚫 Dejar de seguir
                </button>
              ) : (
                <button onClick={handleSeguir} className="btn-seguir">
                  👣 Seguir
                </button>
              )}

              <button
                onClick={handleSolicitudAmistad}
                className="btn-amistad"
                disabled={esAmigo}
              >
                🤝 {esAmigo ? "Ya son amigos" : "Enviar solicitud"}
              </button>

              <button onClick={() => setReporteModal(true)} className="btn-reportar">
                ⚠️ Reportar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Biografía */}
      {perfil.biografia && (
        <div className="biografia-section">
          <h3>Biografía</h3>
          <p>{perfil.biografia}</p>
        </div>
      )}

      {/* ✅ Publicaciones del usuario (actualizado con diseño mejorado) */}
      <div className="publicaciones-section">
        <h3>Publicaciones ({publicaciones.length})</h3>
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

                {/* Contenido de la publicación */}
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

                {/* Acciones de la publicación */}
                <div className="publicacion-acciones">
                  <button className="accion-btn">💬 Comentar</button>
                  <button className="accion-btn">🔄 Compartir</button>
                  <button className="accion-btn">❤️ Me gusta</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="sin-publicaciones">Este usuario no tiene publicaciones aún.</p>
        )}
      </div>

      {/* Amigos */}
      {amigos.length > 0 && (
        <div className="amigos-section">
          <h3>Amigos ({amigos.length})</h3>
          <div className="lista-amigos">
            {amigos.map((amigo) => (
              <div key={amigo.id_usuario} className="amigo-item">
                <img
                  src={amigo.foto_perfil || defaultProfile}
                  alt={amigo.nombre_usuario}
                  className="foto-amigo"
                />
                <span>{amigo.nombre_usuario}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de reporte */}
      {reporteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reportar Usuario</h3>
            <textarea
              value={motivoReporte}
              onChange={(e) => setMotivoReporte(e.target.value)}
              placeholder="Describe el motivo del reporte..."
              rows={4}
            />
            <div className="modal-actions">
              <button onClick={handleReportar} className="btn-confirmar">
                Enviar Reporte
              </button>
              <button
                onClick={() => setReporteModal(false)}
                className="btn-cancelar"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
