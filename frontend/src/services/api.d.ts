import axios from "axios";

const API_URL = "http://localhost:8000"; // Ajusta según tu backend

// ===================
// Usuarios
// ===================
export function getUsuarios(): Promise<any> {
  return axios.get(`${API_URL}/usuarios`);
}

export function addUsuario(usuario: any): Promise<any> {
  return axios.post(`${API_URL}/usuarios`, usuario);
}

export function deleteUsuario(id: number): Promise<any> {
  return axios.delete(`${API_URL}/usuarios/${id}`);
}

export function registerUsuario(usuario: any): Promise<any> {
  return axios.post(`${API_URL}/register`, usuario);
}

// ===================
// Autenticación
// ===================
export async function loginUsuario(email: string, password: string): Promise<any> {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
}

export async function getUsuarioActual(): Promise<any> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay sesión activa");

  const res = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export function logoutUsuario(): void {
  localStorage.removeItem("token");
}
