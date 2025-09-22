import axios from "axios";


const API_URL = "http://localhost:8000"; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getUsuarios(): Promise<any> {
  try {
    const res = await api.get("/usuarios");
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al obtener usuarios:", error.message);
    throw error;
  }
}

export async function addUsuario(usuario: any): Promise<any> {
  try {
    const res = await api.post("/usuarios", usuario);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al agregar usuario:", error.message);
    throw error;
  }
}

export async function deleteUsuario(id: number): Promise<any> {
  try {
    const res = await api.delete(`/usuarios/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al eliminar usuario:", error.message);
    throw error;
  }
}

export async function registerUsuario(usuario: any): Promise<any> {
  try {
    const res = await api.post("/register", usuario);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al registrar usuario:", error.message);
    throw error;
  }
}

export async function loginUsuario(correo_electronico: string, contrasena: string): Promise<any> {
  try {
    const res = await api.post("/login", { correo_electronico, contrasena });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al iniciar sesión:", error.message);
    throw error;
  }
}

export async function getUsuarioActual(): Promise<any> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay sesión activa");

  try {
    const res = await api.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al obtener usuario actual:", error.message);
    throw error;
  }
}

export function logoutUsuario(): void {
  localStorage.removeItem("token");
}