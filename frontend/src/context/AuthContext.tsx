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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // 🧠 Cargar datos guardados en localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsuario = localStorage.getItem("usuario");

    if (storedToken) setToken(storedToken);
    if (storedUsuario) {
      const parsedUser = JSON.parse(storedUsuario);
      setUsuario(parsedUser);

      // 🔄 Actualizar foto de perfil desde el backend
      if (parsedUser?.id_usuario && storedToken) {
        getPerfil(parsedUser.id_usuario)
          .then((perfilData) => {
            const updatedUser = { ...parsedUser, foto_perfil: perfilData.foto_perfil };
            setUsuario(updatedUser);
            localStorage.setItem("usuario", JSON.stringify(updatedUser));
          })
          .catch((err) => console.error("Error al cargar perfil:", err));
      }
    }
  }, []);

  const login = (newToken: string, newUsuario: Usuario) => {
    setToken(newToken);
    setUsuario(newUsuario);
    localStorage.setItem("token", newToken);
    localStorage.setItem("usuario", JSON.stringify(newUsuario));

    // 🔄 Obtener foto de perfil más reciente después del login
    getPerfil(newUsuario.id_usuario)
      .then((perfilData) => {
        const updatedUser = { ...newUsuario, foto_perfil: perfilData.foto_perfil };
        setUsuario(updatedUser);
        localStorage.setItem("usuario", JSON.stringify(updatedUser));
      })
      .catch((err) => console.error("Error al actualizar perfil tras login:", err));
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
