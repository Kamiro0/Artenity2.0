// PerfilUsuario.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  getPerfil, 
  seguirUsuario, 
  enviarSolicitudAmistad, 
  dejarDeSeguirUsuario,
  reportarUsuario,
  getAmigos 

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
  const esAmigo = perfil ? amigos.some(a => a.id_usuario === perfil.id_usuario) : false;

  useEffect(() => {
    if (id) {
      cargarPerfilUsuario(parseInt(id));
      cargarAmigos(parseInt(id));
    }
  }, [id]);

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

 const cargarAmigos = async (idUsuario: number) => {
  try {
    const amigosData = await getAmigos(idUsuario);
    setAmigos(amigosData);
  } catch (error) {
    console.error("Error cargando amigos:", error);
  }
};


  const handleSeguir = async () => {
    if (!id) return;
    try {
      await seguirUsuario(parseInt(id));
      alert("¡Ahora sigues a este usuario!");
      cargarPerfilUsuario(parseInt(id));
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

  const esMiPerfil = usuarioActual?.id_usuario === perfil.id_usuario;

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
            <span>{amigos.length} amigos</span>
            <span>0 siguiendo</span>
            <span>0 publicaciones</span>
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

              <button 
                onClick={() => setReporteModal(true)} 
                className="btn-reportar"
              >
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

      {/* Amigos */}
      {amigos.length > 0 && (
        <div className="amigos-section">
          <h3>Amigos</h3>
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
