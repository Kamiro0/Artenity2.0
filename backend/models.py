# backend/models.py
from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


# ------------------ USUARIO ------------------
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

    # Relaciones
    perfil = relationship("Perfil", back_populates="usuario", uselist=False)
    publicaciones = relationship("Publicacion", back_populates="usuario")
    siguiendo = relationship("SeguirUsuario", foreign_keys="SeguirUsuario.id_seguidor", back_populates="seguidor")
    seguidores = relationship("SeguirUsuario", foreign_keys="SeguirUsuario.id_seguido", back_populates="seguido")
    reportes_enviados = relationship("ReportarUsuario", foreign_keys="ReportarUsuario.id_reportante", back_populates="reportante")
    reportes_recibidos = relationship("ReportarUsuario", foreign_keys="ReportarUsuario.id_reportado", back_populates="reportado")
    amistades_enviadas = relationship("SolicitudAmistad", foreign_keys="SolicitudAmistad.id_emisor", back_populates="emisor")
    amistades_recibidas = relationship("SolicitudAmistad", foreign_keys="SolicitudAmistad.id_receptor", back_populates="receptor")
    notificaciones = relationship("Notificacion", back_populates="usuario")


# ------------------ PERFIL ------------------
class Perfil(Base):
    __tablename__ = "perfiles"

    id_perfil = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), unique=True)
    descripcion = Column(String(255), nullable=True)
    foto_perfil = Column(String(255), nullable=True)
    biografia = Column(String(500), nullable=True)

    usuario = relationship("Usuario", back_populates="perfil")


# ------------------ PUBLICACIÓN ------------------
class Publicacion(Base):
    __tablename__ = "publicaciones"

    id_publicacion = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"))
    contenido = Column(String, nullable=False)
    imagen = Column(String, nullable=True)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

    usuario = relationship("Usuario", back_populates="publicaciones")


# ------------------ SEGUIR USUARIO ------------------
class SeguirUsuario(Base):
    __tablename__ = "seguir_usuario"

    id_seguimiento = Column(Integer, primary_key=True, index=True)
    id_seguidor = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"))
    id_seguido = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"))
    fecha_seguimiento = Column(DateTime, default=datetime.utcnow)

    seguidor = relationship("Usuario", foreign_keys=[id_seguidor], back_populates="siguiendo")
    seguido = relationship("Usuario", foreign_keys=[id_seguido], back_populates="seguidores")


# ------------------ REPORTAR USUARIO ------------------
class ReportarUsuario(Base):
    __tablename__ = "reportar_usuario"

    id_reporte = Column(Integer, primary_key=True, index=True)
    id_reportante = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"))
    id_reportado = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"))
    motivo = Column(Text, nullable=False)
    fecha_reporte = Column(DateTime, default=datetime.utcnow)
    estado = Column(String(50), default="pendiente")  # pendiente / revisado / resuelto

    reportante = relationship("Usuario", foreign_keys=[id_reportante], back_populates="reportes_enviados")
    reportado = relationship("Usuario", foreign_keys=[id_reportado], back_populates="reportes_recibidos")


# ------------------ SOLICITUD DE AMISTAD ------------------
class SolicitudAmistad(Base):
    __tablename__ = "solicitud_de_amistad"

    id_solicitud = Column(Integer, primary_key=True, index=True)
    id_emisor = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"))
    id_receptor = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"))
    estado = Column(String(50), default="pendiente")  # pendiente / aceptada / rechazada
    fecha_envio = Column(DateTime, default=datetime.utcnow)

    emisor = relationship("Usuario", foreign_keys=[id_emisor], back_populates="amistades_enviadas")
    receptor = relationship("Usuario", foreign_keys=[id_receptor], back_populates="amistades_recibidas")


# ------------------ NOTIFICACIONES ------------------
class Notificacion(Base):
    __tablename__ = "notificaciones"
    id_notificacion = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE")) 
    mensaje = Column(String(255))
    leido = Column(Boolean, default=False)
    fecha = Column(DateTime, default=datetime.utcnow)
    tipo = Column(String(100)) 
    id_referencia = Column(Integer, nullable=True)

    usuario = relationship("Usuario", back_populates="notificaciones")

# ------------------ AMISTADES ------------------
class Amistad(Base):
    __tablename__ = "amistades"
    id_amistad = Column(Integer, primary_key=True, index=True)
    id_usuario1 = Column(Integer, ForeignKey("usuarios.id_usuario"))
    id_usuario2 = Column(Integer, ForeignKey("usuarios.id_usuario"))
    estado = Column(String)  # pendiente / aceptada / rechazada
