// context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getPerfil } from "../services/api";

export interface Usuario {
  id_usuario: number;
  nombre_usuario: string;
  correo_electronico: string;
  foto_perfil?: string | null;
}

interface AuthContextType {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
  token: string | null;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
  actualizarFotoPerfil: (nuevaFoto: string) => void;
  forzarActualizacionPerfil: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [actualizacion, setActualizacion] = useState(0);

  // 🧠 Cargar datos guardados al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsuario = localStorage.getItem("usuario");

    if (storedToken) setToken(storedToken);
    if (storedUsuario) {
      const parsedUser = JSON.parse(storedUsuario);
      setUsuario(parsedUser);

      if (parsedUser?.id_usuario && storedToken) {
        getPerfil(parsedUser.id_usuario)
          .then((perfilData) => {
            let nuevaFoto = perfilData.foto_perfil || parsedUser.foto_perfil;
            if (nuevaFoto) nuevaFoto = `${nuevaFoto}?t=${new Date().getTime()}`;

            const usuarioActualizado = { ...parsedUser, foto_perfil: nuevaFoto };
            setUsuario(usuarioActualizado);
            localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
          })
          .catch((err) => console.error("Error al cargar perfil:", err));
      }
    }
  }, []);

  // 🟢 Login
  const login = (newToken: string, newUsuario: Usuario) => {
    setToken(newToken);
    setUsuario(newUsuario);
    localStorage.setItem("token", newToken);
    localStorage.setItem("usuario", JSON.stringify(newUsuario));

    getPerfil(newUsuario.id_usuario)
      .then((perfilData) => {
        let nuevaFoto = perfilData.foto_perfil || newUsuario.foto_perfil;
        if (nuevaFoto) nuevaFoto = `${nuevaFoto}?t=${new Date().getTime()}`;

        const usuarioActualizado = { ...newUsuario, foto_perfil: nuevaFoto };
        setUsuario(usuarioActualizado);
        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
      })
      .catch((err) => console.error("Error al actualizar perfil tras login:", err));
  };

  // 🔴 Logout
  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };

  // 🖼️ Actualizar foto de perfil localmente
  const actualizarFotoPerfil = (nuevaFoto: string) => {
    if (usuario) {
      const fotoConTimestamp = `${nuevaFoto}?t=${new Date().getTime()}`;
      const usuarioActualizado = { ...usuario, foto_perfil: fotoConTimestamp };
      setUsuario(usuarioActualizado);
      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
      setActualizacion((prev) => prev + 1);
    }
  };

  // 🔄 Forzar actualización del perfil desde el backend
  const forzarActualizacionPerfil = () => {
    if (usuario?.id_usuario && token) {
      getPerfil(usuario.id_usuario)
        .then((perfilData) => {
          let nuevaFoto = perfilData.foto_perfil || usuario.foto_perfil;
          if (nuevaFoto) nuevaFoto = `${nuevaFoto}?t=${new Date().getTime()}`;

          const usuarioActualizado = { ...usuario, foto_perfil: nuevaFoto };
          setUsuario(usuarioActualizado);
          localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
          setActualizacion((prev) => prev + 1);
        })
        .catch((err) => console.error("Error al forzar actualización:", err));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        setUsuario,
        token,
        login,
        logout,
        actualizarFotoPerfil,
        forzarActualizacionPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
