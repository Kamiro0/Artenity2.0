// components/Perfil.tsx
import React, { useState, useEffect } from "react";
import defaultProfile from "../assets/img/fotoperfildefault.jpg";
import { useAuth } from "../context/AuthContext";
import { actualizarPerfil, getPerfil } from "../services/api";
import "../styles/perfil.css";

const Perfil: React.FC = () => {
  const { usuario, setUsuario } = useAuth();
  const [descripcion, setDescripcion] = useState("");
  const [biografia, setBiografia] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");
  const [editar, setEditar] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Cargar datos del perfil
  useEffect(() => {
    if (usuario?.id_usuario) {
      cargarPerfil();
    }
  }, [usuario]);

  const cargarPerfil = async () => {
    try {
      const perfilData = await getPerfil(usuario!.id_usuario);
      setDescripcion(perfilData.descripcion || "");
      setBiografia(perfilData.biografia || "");
      setFotoPreview(perfilData.foto_perfil || defaultProfile);
    } catch (error) {
      console.error("Error cargando perfil:", error);
      setFotoPreview(defaultProfile);
    }
  };

  // Manejar selección de imagen
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagen(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Guardar cambios del perfil
  const handleSubmit = async () => {
    if (!usuario?.id_usuario) return;

    setCargando(true);
    try {
      const formData = new FormData();
      if (descripcion) formData.append("descripcion", descripcion);
      if (biografia) formData.append("biografia", biografia);
      if (imagen) formData.append("file", imagen);

      const perfilActualizado = await actualizarPerfil(usuario.id_usuario, formData);
      
      // Actualizar contexto con nueva foto si existe
      if (perfilActualizado.foto_perfil) {
        setUsuario({
          ...usuario,
          foto_perfil: perfilActualizado.foto_perfil,
        });
      }
if (perfilActualizado.foto_perfil) {
  const usuarioActualizado = {
    ...usuario,
    foto_perfil: perfilActualizado.foto_perfil,
  };

  setUsuario(usuarioActualizado);
  localStorage.setItem("usuario", JSON.stringify(usuarioActualizado)); // ✅ guardar persistente
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
      <div className="perfil-header">
        <div className="foto-perfil-container">
          <img
            src={fotoPreview}
            alt="Perfil"
            className="foto-perfil"
          />
        </div>
        
        <h2 className="nombre-usuario">{usuario.nombre_usuario}</h2>
        <p className="correo-usuario">{usuario.correo_electronico}</p>
        
        {!editar && (
          <button
            onClick={() => setEditar(true)}
            className="btn-editar"
          >
            Editar perfil
          </button>
        )}
      </div>

      {editar && (
        <div className="modal-edicion">
          <h3>Editar Perfil</h3>
          
          <div className="campo-formulario">
            <label>Descripción breve:</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Tu descripción..."
              maxLength={255}
            />
          </div>

          <div className="campo-formulario">
            <label>Biografía:</label>
            <textarea
              value={biografia}
              onChange={(e) => setBiografia(e.target.value)}
              placeholder="Cuéntanos sobre ti..."
              maxLength={500}
              rows={4}
            />
          </div>

          <div className="campo-formulario">
            <label>Foto de perfil:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
            />
            {fotoPreview && (
              <div className="preview-imagen">
                <img src={fotoPreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="botones-accion">
            <button
              onClick={handleSubmit}
              disabled={cargando}
              className="btn-guardar"
            >
              {cargando ? "Guardando..." : "Guardar cambios"}
            </button>
            <button
              onClick={() => {
                setEditar(false);
                cargarPerfil(); // Recargar datos originales
              }}
              className="btn-cancelar"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Mostrar información del perfil cuando no se está editando */}
      {!editar && (
        <div className="perfil-info">
          {descripcion && (
            <div className="info-item">
              <strong>Descripción:</strong>
              <p>{descripcion}</p>
            </div>
          )}
          {biografia && (
            <div className="info-item">
              <strong>Biografía:</strong>
              <p>{biografia}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Perfil;