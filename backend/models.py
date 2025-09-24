from sqlalchemy import Column, Integer, String, Date
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