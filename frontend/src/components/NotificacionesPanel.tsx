// ✅ components/NotificacionesPanel.tsx
import { useEffect, useState } from "react";
import {
  getNotificaciones,
  responderSolicitudAmistad,
  obtenerSolicitudesPendientes as getSolicitudesAmistad,
  obtenerSeguidores
} from "../services/api";
import defaultProfile from "../assets/img/fotoperfildefault.jpg";
import "../styles/notificaciones.css";

export default function NotificacionesPanel({ usuario }: { usuario: any }) {
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [solicitudesPendientes, setSolicitudesPendientes] = useState<any[]>([]);
  const [seguidores, setSeguidores] = useState<any[]>([]);

  useEffect(() => {
    if (usuario?.id_usuario) {
      cargarTodo();
    }
  }, [usuario]);

  const cargarTodo = async () => {
    await Promise.all([
      cargarNotificaciones(),
      cargarSolicitudes(),
      cargarSeguidores()
    ]);
  };

  const cargarNotificaciones = async () => {
    try {
      const data = await getNotificaciones();
      setNotificaciones(data);
    } catch (err) {
      console.error("Error cargando notificaciones:", err);
    }
  };

  const cargarSolicitudes = async () => {
    try {
      const solicitudes = await getSolicitudesAmistad();
      setSolicitudesPendientes(solicitudes.filter((s: any) => s.estado === "pendiente"));
    } catch (err) {
      console.error("Error cargando solicitudes:", err);
    }
  };

  const cargarSeguidores = async () => {
    try {
      const data = await obtenerSeguidores();
      setSeguidores(data);
    } catch (err) {
      console.error("Error cargando seguidores:", err);
    }
  };

  const handleResponder = async (id: number, estado: string) => {
    try {
      await responderSolicitudAmistad(id, estado);
      await cargarSolicitudes();
    } catch (err) {
      console.error("Error al responder solicitud:", err);
    }
  };

  return (
    <div className="notificaciones-panel">
      <h3>🔔 Notificaciones</h3>

      {/* 🧡 Solicitudes de Amistad */}
      {solicitudesPendientes.length > 0 && (
        <section className="solicitudes-section">
          <h4>Solicitudes de amistad</h4>
          {solicitudesPendientes.map((s) => (
            <div key={s.id_solicitud} className="solicitud-item">
              <img
                src={s.emisor?.perfil?.foto_perfil || defaultProfile}
                alt="perfil"
                className="foto-perfil-pequena"
              />
              <p>
                <strong>{s.emisor?.nombre_usuario}</strong> te envió una solicitud
              </p>
              <div className="acciones-solicitud">
                <button onClick={() => handleResponder(s.id_solicitud, "aceptada")} className="btn-aceptar">
                  ✓ Aceptar
                </button>
                <button onClick={() => handleResponder(s.id_solicitud, "rechazada")} className="btn-rechazar">
                  ✗ Rechazar
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 🧍‍♂️ Seguidores */}
      {seguidores.length > 0 && (
        <section className="seguidores-section">
          <h4>Personas que te siguen</h4>
          {seguidores.map((seg) => (
            <div key={seg.id_seguimiento} className="seguidor-item">
              <img
                src={seg.seguidor?.foto_perfil || defaultProfile}
                alt="perfil"
                className="foto-perfil-pequena"
              />
              <p>
                <strong>{seg.seguidor?.nombre_usuario}</strong> comenzó a seguirte
              </p>
              <span className="fecha">
                {new Date(seg.fecha_seguimiento).toLocaleDateString()}
              </span>
            </div>
          ))}
        </section>
      )}

      {/* 📨 Notificaciones generales */}
      <section className="notificaciones-list">
        <h4>Otras notificaciones</h4>
        {notificaciones.length > 0 ? (
          notificaciones.map((n) => (
            <div key={n.id_notificacion} className={`notificacion ${n.leido ? "leida" : "no-leida"}`}>
              <p>{n.mensaje}</p>
              <span className="fecha">{new Date(n.fecha_creacion).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <p className="sin-notificaciones">No hay notificaciones recientes</p>
        )}
      </section>
    </div>
  );
}
