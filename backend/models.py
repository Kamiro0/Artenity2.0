# backend/models.py
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    apellido = Column(String)
    correo_electronico = Column(String, unique=True, index=True)
    contrasena = Column(String)
    fecha_nacimiento = Column(Date)
    genero = Column(String)
    tipo_arte_preferido = Column(String)
    telefono = Column(String)
    nombre_usuario = Column(String)


    perfil = relationship("Perfil", back_populates="usuario", uselist=False)
    publicaciones = relationship("Publicacion", back_populates="usuario")

class Perfil(Base):
    __tablename__ = "perfiles"

    id_perfil = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), unique=True)
    descripcion = Column(String(255), nullable=True)
    foto_perfil = Column(String(255), nullable=True)  # ✅ Solo aquí
    biografia = Column(String(500), nullable=True)

    usuario = relationship("Usuario", back_populates="perfil")

class Publicacion(Base):
    __tablename__ = "publicaciones"

    id_publicacion = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"))
    contenido = Column(String, nullable=False)
    imagen = Column(String, nullable=True)
    fecha_creacion = Column(Date, default=datetime.utcnow)

    usuario = relationship("Usuario", back_populates="publicaciones")