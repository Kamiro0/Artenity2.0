import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  usuario: string | null;
  token: string | null;
  login: (token: string, usuario: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsuario = localStorage.getItem("usuario");
    if (storedToken) setToken(storedToken);
    if (storedUsuario) setUsuario(storedUsuario);
  }, []);

  const login = (newToken: string, newUsuario: string) => {
    setToken(newToken);
    setUsuario(newUsuario);
    localStorage.setItem("token", newToken);
    localStorage.setItem("usuario", newUsuario);
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };

  return <AuthContext.Provider value={{ usuario, token, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
