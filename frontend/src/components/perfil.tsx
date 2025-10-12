// ✅ components/Perfil.tsx
import React, { useState, useEffect, useCallback } from "react";
import defaultProfile from "../assets/img/fotoperfildefault.jpg";
import { useAuth } from "../context/AuthContext";
import {
  actualizarPerfil,
  getPerfil,
  getAmigos,
  obtenerSeguidores,
} from "../services/api";
import "../styles/perfil.css";

const Perfil: React.FC = () => {
  const { usuario, setUsuario } = useAuth();
  const [descripcion, setDescripcion] = useState("");
  const [biografia, setBiografia] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");
  const [editar, setEditar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [amigos, setAmigos] = useState<any[]>([]);
  const [seguidores, setSeguidores] = useState<any[]>([]);

  // ✅ Cargar perfil
  const cargarPerfil = useCallback(async () => {
    if (!usuario?.id_usuario) return;
    try {
      const perfilData = await getPerfil(usuario.id_usuario);
      setDescripcion(perfilData.descripcion || "");
      setBiografia(perfilData.biografia || "");
      setFotoPreview(perfilData.foto_perfil || defaultProfile);
    } catch (error) {
      console.error("Error cargando perfil:", error);
      setFotoPreview(defaultProfile);
    }
  }, [usuario?.id_usuario]);

  // ✅ Cargar amigos
  const cargarAmigos = useCallback(async () => {
    try {
      const amigosData = await getAmigos();
      setAmigos(amigosData);
    } catch (error) {
      console.error("Error cargando amigos:", error);
    }
  }, []);

  // ✅ Cargar seguidores
  const cargarSeguidores = useCallback(async () => {
    try {
      const data = await obtenerSeguidores();
      setSeguidores(data);
    } catch (error) {
      console.error("Error cargando seguidores:", error);
    }
  }, []);

  // ✅ useEffect combinado
  useEffect(() => {
    cargarPerfil();
    cargarAmigos();
    cargarSeguidores();
  }, [cargarPerfil, cargarAmigos, cargarSeguidores]);

  // 📸 Manejar selección de imagen
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagen(file);
      const reader = new FileReader();
      reader.onload = (e) => setFotoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 💾 Guardar cambios del perfil
  const handleSubmit = async () => {
    if (!usuario?.id_usuario) return;
    setCargando(true);

    try {
      const formData = new FormData();
      if (descripcion) formData.append("descripcion", descripcion);
      if (biografia) formData.append("biografia", biografia);
      if (imagen) formData.append("file", imagen);

      const perfilActualizado = await actualizarPerfil(
        usuario.id_usuario,
        formData
      );

      if (perfilActualizado.foto_perfil) {
        const usuarioActualizado = {
          ...usuario,
          foto_perfil: perfilActualizado.foto_perfil,
        };
        setUsuario(usuarioActualizado);
        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
      }

      setEditar(false);
      alert("¡Perfil actualizado correctamente!");
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
      {/* COLUMNA IZQUIERDA */}
      <div className="perfil-info">
        <div className="perfil-header">
          <img
            src={fotoPreview || defaultProfile}
            alt="Foto de perfil"
            className="perfil-foto"
          />
          <h2 className="perfil-nombre">{usuario.nombre_usuario}</h2>
          <p className="perfil-correo">{usuario.correo_electronico}</p>

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
              <button
                onClick={handleSubmit}
                disabled={cargando}
                className="btn-guardar"
              >
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
              <p className="perfil-texto">
                {descripcion || "Sin descripción"}
              </p>
            </div>

            <div className="perfil-section">
              <h3>Biografía:</h3>
              <p className="perfil-texto">{biografia || "Sin biografía"}</p>
            </div>
          </>
        )}
      </div>

      {/* COLUMNA DERECHA */}
      <div className="perfil-lateral">
        <div className="perfil-lista">
          <h3>Amigos</h3>
          {amigos.length > 0 ? (
            amigos.map((amigo) => (
              <div key={amigo.id_usuario} className="usuario-item">
                <img
                  src={amigo.perfil?.foto_perfil || defaultProfile}
                  alt=""
                  className="usuario-foto"
                />
                <span className="usuario-nombre">
                  {amigo.nombre_usuario}
                </span>
              </div>
            ))
          ) : (
            <p>No tienes amigos aún.</p>
          )}
        </div>

        <div className="perfil-lista">
          <h3>Seguidores</h3>
          {seguidores.length > 0 ? (
  seguidores.map((seguidor) => (
    <div key={seguidor.id_seguimiento} className="usuario-item">
     <img
      src={seguidor.seguidor?.foto_perfil || defaultProfile}
      alt="foto de perfil"
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
