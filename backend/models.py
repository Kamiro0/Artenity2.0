from sqlalchemy import Column, Integer, String, Date
from .database import Base
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy import DateTime, ForeignKey
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



class Publicacion(Base):
    __tablename__ = "publicaciones"

    id_publicacion = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"))
    contenido = Column(String, nullable=False)
    imagen = Column(String, nullable=True)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

    usuario = relationship("Usuario", backref="publicaciones")
