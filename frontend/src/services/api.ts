// services/api.ts
import axios from "axios";
import { Usuario } from "../context/AuthContext";

const API_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ======== UTIL ========
function getToken() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de sesión");
  return token;
}

function getUsuarioId() {
  const usuario = localStorage.getItem("usuario");
  if (!usuario) throw new Error("No hay usuario autenticado");
  const parsed = JSON.parse(usuario);
  return parsed.id_usuario;
}

// ======== USUARIOS ========
export async function getUsuarios(): Promise<Usuario[]> {
  const res = await api.get("/usuarios", { headers: { token: getToken() } });
  return res.data;
}

export async function addUsuario(usuario: any): Promise<Usuario> {
  const res = await api.post("/usuarios", usuario);
  return res.data;
}

export async function deleteUsuario(id: number): Promise<Usuario> {
  const res = await api.delete(`/usuarios/${id}`);
  return res.data;
}

export async function registerUsuario(usuario: any): Promise<Usuario> {
  return addUsuario(usuario);
}

// ======== LOGIN / SESIÓN ========
export async function loginUsuario(correo_electronico: string, contrasena: string) {
  const res = await api.post("/login", { correo_electronico, contrasena });
  const { token, usuario } = res.data;
  localStorage.setItem("token", token);
  localStorage.setItem("usuario", JSON.stringify(usuario));
  return { token, usuario };
}

export function logoutUsuario() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

// ======== PERFILES ========
export async function getPerfil(id_usuario: number) {
  const res = await api.get(`/perfiles/${id_usuario}`, {
    headers: { token: getToken() },
  });
  return res.data;
}

export async function actualizarPerfil(id_usuario: number, data: FormData) {
  const res = await api.put(`/perfiles/${id_usuario}`, data, {
    headers: { token: getToken(), "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ======== PUBLICACIONES ========
export async function crearPublicacion(data: FormData) {
  const res = await api.post("/publicaciones", data, {
    headers: { token: getToken(), "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function getPublicaciones() {
  const res = await api.get("/publicaciones");
  return res.data;
}

// ======== RELACIONES SOCIALES ========
export async function seguirUsuario(id_seguido: number) {
  const res = await api.post(`/seguir/${id_seguido}`, null, {
    headers: {
      token: getToken(),
      id_usuario: getUsuarioId(),
    },
  });
  return res.data;
}

export async function dejarDeSeguirUsuario(id_seguido: number) {
  const res = await api.delete(`/dejar-seguir/${id_seguido}`, {
    headers: {
      token: getToken(),
      id_usuario: getUsuarioId(),
    },
  });
  return res.data;
}

export async function obtenerSeguidores() {
  const res = await api.get("/seguidores", {
    headers: { token: getToken(), id_usuario: getUsuarioId() },
  });
  return res.data;
}

// ======== AMISTADES ========
export async function enviarSolicitudAmistad(id_receptor: number) {
  const res = await api.post(`/amistad/${id_receptor}`, null, {
    headers: { token: getToken(), id_usuario: getUsuarioId() },
  });
  return res.data;
}

export async function responderSolicitudAmistad(id_solicitud: number, estado: string) {
  const formData = new FormData();
  formData.append("estado", estado);
  const res = await api.put(`/amistad/${id_solicitud}`, formData, {
    headers: { token: getToken(), id_usuario: getUsuarioId() },
  });
  return res.data;
}

export async function obtenerSolicitudesPendientes() {
  const res = await api.get("/solicitudes-amistad", {
    headers: { token: getToken(), id_usuario: getUsuarioId() },
  });
  return res.data;
}

export async function obtenerAmigos() {
  const res = await api.get("/amigos", {
    headers: { token: getToken(), id_usuario: getUsuarioId() },
  });
  return res.data;
}

// ======== NOTIFICACIONES ========
export async function getNotificaciones() {
  const res = await api.get("/notificaciones", {
    headers: { token: getToken(), id_usuario: getUsuarioId() },
  });
  return res.data;
}

// ======== REPORTAR USUARIO ========
export async function reportarUsuario(id_reportado: number, motivo: string) {
  const formData = new FormData();
  formData.append("motivo", motivo);
  const res = await api.post(`/reportar/${id_reportado}`, formData, {
    headers: { token: getToken(), id_usuario: getUsuarioId() },
  });
  return res.data;
}

// ======== CATEGORÍAS ========
export async function obtenerCategorias() {
  const res = await api.get("/categorias");
  return res.data;
}

// ======== ALIAS PARA COMPATIBILIDAD ========
export const getSolicitudesAmistad = obtenerSolicitudesPendientes;
export const getAmigos = obtenerAmigos;
export const getCategorias = obtenerCategorias;
