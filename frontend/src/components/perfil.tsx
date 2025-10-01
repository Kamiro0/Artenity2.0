// components/Perfil.tsx
import React, { useState, useEffect } from "react";
import defaultProfile from "../assets/img/fotoperfildefault.jpg";
import { useAuth, Usuario } from "../context/AuthContext";
import { updateUsuario } from "../services/api";

const Perfil: React.FC = () => {
  const { usuario, setUsuario } = useAuth();
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [correo, setCorreo] = useState(usuario?.correo_electronico || "");
  const [imagen, setImagen] = useState<File | null>(null);
  const [editar, setEditar] = useState(false);

  // Actualizar estados cuando cambia el usuario
  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre);
      setCorreo(usuario.correo_electronico);
    }
  }, [usuario]);

  // Guardar cambios de perfil
  const handleSubmit = async () => {
    if (!usuario || !usuario.id_usuario) {
      alert("Usuario no cargado");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("correo_electronico", correo);
    if (imagen) formData.append("file", imagen);

    try {
      const updated: Usuario = await updateUsuario(usuario.id_usuario, formData);
      setUsuario(updated); // actualizar contexto con datos nuevos
      setEditar(false);
      alert("Perfil actualizado!");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar perfil");
    }
  };

  if (!usuario) return <div>Cargando perfil...</div>;

  return (
    <div className="perfil-container max-w-sm mx-auto p-4">
      <img
        src={usuario.avatar || defaultProfile}
        alt="Perfil"
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <h2 className="text-center text-xl font-bold mb-2">{usuario.nombre}</h2>
      <p className="text-center text-gray-600 mb-4">{usuario.correo_electronico}</p>
      <button
        onClick={() => setEditar(true)}
        className="bg-purple-700 text-white px-4 py-2 rounded mx-auto block mb-4"
      >
        Editar perfil
      </button>

      {editar && (
        <div className="modal p-4 bg-white rounded shadow-lg">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            className="mb-2 p-2 border rounded w-full"
          />
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Correo"
            className="mb-2 p-2 border rounded w-full"
          />
          <input
            type="file"
            onChange={(e) => e.target.files && setImagen(e.target.files[0])}
            className="mb-2"
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
  );
};

export default Perfil;
