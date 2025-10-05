from pydantic import BaseModel, EmailStr
from datetime import date , datetime

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

    class Config:
        from_attributes = True
        
       

class PublicacionBase(BaseModel):
    contenido: str
    imagen: str | None = None

class PublicacionCreate(PublicacionBase):
    id_usuario: int

class PublicacionResponse(PublicacionBase):
    id_publicacion: int
    id_usuario: int
    fecha_creacion: datetime
    class Config:
        from_attributes = True
