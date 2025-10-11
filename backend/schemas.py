# backend/schemas.py
from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional, List

# ------------------ PERFIL ------------------
class PerfilBase(BaseModel):
    descripcion: Optional[str] = None
    biografia: Optional[str] = None
    foto_perfil: Optional[str] = None

class PerfilResponse(PerfilBase):
    id_perfil: int
    id_usuario: int

    class Config:
        orm_mode = True

# ------------------ USUARIO ------------------
class UsuarioBase(BaseModel):
    nombre: str
    apellido: str
    correo_electronico: EmailStr
    fecha_nacimiento: date
    genero: str
    tipo_arte_preferido: str
    telefono: str
    nombre_usuario: str

class UsuarioCreate(UsuarioBase):
    contrasena: str

class UsuarioResponse(UsuarioBase):
    id_usuario: int
    perfil: Optional[PerfilResponse] = None  # Perfil incluido

    class Config:
        orm_mode = True

# ------------------ PUBLICACIÓN ------------------
class UsuarioPerfil(BaseModel):
    id_usuario: int
    nombre: str
    nombre_usuario: str
    perfil: Optional[PerfilResponse] = None

    class Config:
        orm_mode = True

class PublicacionBase(BaseModel):
    contenido: str
    imagen: Optional[str] = None

class PublicacionCreate(PublicacionBase):
    id_usuario: int

class PublicacionResponse(PublicacionBase):
    id_publicacion: int
    id_usuario: int
    fecha_creacion: datetime
    usuario: UsuarioPerfil

    class Config:
        orm_mode = True