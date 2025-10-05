// services/api.ts
import axios from "axios";
import { Usuario } from "../context/AuthContext";

const API_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------- USUARIOS ----------

export async function getUsuarios(): Promise<Usuario[]> {
  try {
    const res = await api.get("/usuarios");
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al obtener usuarios:", error.message);
    throw error;
  }
}

export async function addUsuario(usuario: any): Promise<Usuario> {
  try {
    const res = await api.post("/usuarios", usuario);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al agregar usuario:", error.message);
    throw error;
  }
}

export async function deleteUsuario(id: number): Promise<Usuario> {
  try {
    const res = await api.delete(`/usuarios/${id}`);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al eliminar usuario:", error.message);
    throw error;
  }
}

export async function registerUsuario(usuario: any): Promise<Usuario> {
  try {
    const res = await api.post("/usuarios", usuario);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al registrar usuario:", error.message);
    throw error;
  }
}

// ---------- LOGIN ----------

export async function loginUsuario(correo_electronico: string, contrasena: string): Promise<{ token: string; usuario: Usuario }> {
  try {
    const res = await api.post("/login", { correo_electronico, contrasena });
    const { token, usuario } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    return { token, usuario };
  } catch (error: any) {
    console.error("❌ Error al iniciar sesión:", error.message);
    throw error;
  }
}

// ---------- ACTUALIZAR USUARIO ----------

export async function updateUsuario(usuario_id: number, data: FormData): Promise<Usuario> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay sesión activa");

  try {
    const res = await api.put(`/usuarios/${usuario_id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al actualizar usuario:", error);
    throw error;
  }
}

// ---------- CATEGORÍAS ----------

export async function getCategorias(): Promise<any> {
  try {
    const res = await api.get("/categorias");
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al obtener categorías:", error.message);
    throw error;
  }
}

// ---------- LOGOUT ----------

export function logoutUsuario(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

// ---------- OPCIONAL: obtener usuario actual ----------

export async function getUsuarioActual(): Promise<Usuario> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay sesión activa");

  try {
    const res = await api.get("/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al obtener usuario actual:", error.message);
    throw error;
  }
}
// ---------- PUBLICACIONES ----------
export async function crearPublicacion(data: FormData): Promise<any> {
  try {
    const res = await api.post("/publicaciones", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al crear publicación:", error.message);
    throw error;
  }
}

export async function getPublicaciones(): Promise<any[]> {
  try {
    const res = await api.get("/publicaciones");
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al obtener publicaciones:", error.message);
    throw error;
  }
}
