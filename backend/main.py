from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session, joinedload
from backend import models, database, schemas
from backend.database import get_db
from pydantic import BaseModel, EmailStr
from typing import List
from datetime import datetime
import os

app = FastAPI()

# ------------------ CORS ------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Static Files ------------------
os.makedirs("static/perfiles", exist_ok=True)
os.makedirs("static/posts", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# ------------------ Crear tablas ------------------
models.Base.metadata.create_all(bind=database.engine)


def get_current_user_id(
    token: str = Header(..., alias="token"),
    user_id: int = Header(None, alias="id_usuario"),
    db: Session = Depends(get_db)
) -> int:
    """
    Autenticación simulada: usa token + id_usuario.
    En producción, reemplazar por validación JWT.
    """
    if not token:
        raise HTTPException(status_code=401, detail="Token requerido")

    if token != "fake-token":
        raise HTTPException(status_code=401, detail="Token inválido")

    if not user_id:
        raise HTTPException(status_code=400, detail="ID de usuario no proporcionado")

    usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return usuario.id_usuario


# ------------------ USUARIOS ------------------
@app.post("/usuarios", response_model=schemas.UsuarioResponse)
def create_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    nuevo_usuario = models.Usuario(**usuario.dict())
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    nuevo_perfil = models.Perfil(id_usuario=nuevo_usuario.id_usuario)
    db.add(nuevo_perfil)
    db.commit()

    return nuevo_usuario

@app.get("/usuarios", response_model=List[schemas.UsuarioResponse])
def get_usuarios(db: Session = Depends(get_db)):
    return db.query(models.Usuario).all()

@app.delete("/usuarios/{usuario_id}", response_model=schemas.UsuarioResponse)
def delete_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    perfil = db.query(models.Perfil).filter(models.Perfil.id_usuario == usuario_id).first()
    if perfil:
        db.delete(perfil)
    db.delete(usuario)
    db.commit()
    return usuario

# ------------------ LOGIN ------------------
class LoginRequest(BaseModel):
    correo_electronico: EmailStr
    contrasena: str

@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(
        models.Usuario.correo_electronico == data.correo_electronico
    ).first()
    if not usuario or usuario.contrasena != data.contrasena:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

    perfil = db.query(models.Perfil).filter(models.Perfil.id_usuario == usuario.id_usuario).first()
    return {
        "token": "fake-token",
        "usuario": {
            "id_usuario": usuario.id_usuario,
            "nombre": usuario.nombre,
            "apellido": usuario.apellido,
            "correo_electronico": usuario.correo_electronico,
            "fecha_nacimiento": usuario.fecha_nacimiento,
            "genero": usuario.genero,
            "tipo_arte_preferido": usuario.tipo_arte_preferido,
            "telefono": usuario.telefono,
            "nombre_usuario": usuario.nombre_usuario,
            "perfil": {
                "descripcion": perfil.descripcion if perfil else None,
                "biografia": perfil.biografia if perfil else None,
                "foto_perfil": perfil.foto_perfil if perfil else None
            }
        }
    }

# ------------------ PERFILES ------------------
@app.get("/perfiles/{id_usuario}", response_model=schemas.PerfilResponse)
def obtener_perfil(id_usuario: int, db: Session = Depends(get_db)):
    perfil = db.query(models.Perfil).filter(models.Perfil.id_usuario == id_usuario).first()
    if not perfil:
        perfil = models.Perfil(id_usuario=id_usuario)
        db.add(perfil)
        db.commit()
        db.refresh(perfil)
    return perfil

@app.put("/perfiles/{id_usuario}", response_model=schemas.PerfilResponse)
async def actualizar_perfil(
    id_usuario: int,
    descripcion: str = Form(None),
    biografia: str = Form(None),
    file: UploadFile | None = File(None),
    db: Session = Depends(get_db)
):
    perfil = db.query(models.Perfil).filter(models.Perfil.id_usuario == id_usuario).first()
    if not perfil:
        perfil = models.Perfil(id_usuario=id_usuario)
        db.add(perfil)
        db.commit()
        db.refresh(perfil)

    if descripcion:
        perfil.descripcion = descripcion
    if biografia:
        perfil.biografia = biografia

    if file and file.filename:
        os.makedirs("static/perfiles", exist_ok=True)
        ext = file.filename.split(".")[-1]
        filename = f"perfil_{id_usuario}.{ext}"
        ruta = os.path.join("static/perfiles", filename)
        with open(ruta, "wb") as f:
            f.write(await file.read())
        perfil.foto_perfil = f"http://localhost:8000/static/perfiles/{filename}"

    db.commit()
    db.refresh(perfil)
    return perfil

# ------------------ PUBLICACIONES ------------------
@app.get("/publicaciones", response_model=List[schemas.PublicacionResponse])
def obtener_publicaciones(db: Session = Depends(get_db)):
    return db.query(models.Publicacion)\
        .options(joinedload(models.Publicacion.usuario).joinedload(models.Usuario.perfil))\
        .order_by(models.Publicacion.fecha_creacion.desc()).all()

@app.post("/publicaciones", response_model=schemas.PublicacionResponse)
async def crear_publicacion(
    id_usuario: int = Form(...),
    contenido: str = Form(...),
    file: UploadFile | None = File(None),
    db: Session = Depends(get_db)
):
    imagen_url = None
    if file:
        os.makedirs("static/posts", exist_ok=True)
        filename = f"{id_usuario}_{file.filename}"
        ruta = os.path.join("static/posts", filename)
        with open(ruta, "wb") as f:
            f.write(await file.read())
        imagen_url = f"http://localhost:8000/static/posts/{filename}"

    nueva_pub = models.Publicacion(id_usuario=id_usuario, contenido=contenido, imagen=imagen_url)
    db.add(nueva_pub)
    db.commit()
    db.refresh(nueva_pub)
    return nueva_pub

# ------------------ SEGUIR USUARIO ------------------
@app.post("/seguir/{id_seguido}")
def seguir_usuario(
    id_seguido: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    if id_seguido == user_id:
        raise HTTPException(status_code=400, detail="No puedes seguirte a ti mismo")

    existente = db.query(models.SeguirUsuario).filter(
        models.SeguirUsuario.id_seguidor == user_id,
        models.SeguirUsuario.id_seguido == id_seguido
    ).first()

    if existente:
        raise HTTPException(status_code=400, detail="Ya sigues a este usuario")

    nuevo = models.SeguirUsuario(id_seguidor=user_id, id_seguido=id_seguido)
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    seguidor = db.query(models.Usuario).filter(models.Usuario.id_usuario == user_id).first()
    noti = models.Notificacion(
        id_usuario=id_seguido,
        tipo="nuevo_seguidor",
        mensaje=f"{seguidor.nombre_usuario} comenzó a seguirte",
        id_referencia=nuevo.id_seguimiento
    )
    db.add(noti)
    db.commit()
    return {"mensaje": "Ahora sigues a este usuario"}
# ------------------ DEJAR DE SEGUIR ------------------
@app.delete("/dejar-seguir/{id_seguido}")
def dejar_de_seguir(
    id_seguido: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    if id_seguido == user_id:
        raise HTTPException(status_code=400, detail="No puedes dejar de seguirte a ti mismo")

    seguir = db.query(models.SeguirUsuario).filter(
        models.SeguirUsuario.id_seguidor == user_id,
        models.SeguirUsuario.id_seguido == id_seguido
    ).first()

    if not seguir:
        raise HTTPException(status_code=404, detail="No sigues a este usuario")

    db.delete(seguir)
    db.commit()
    return {"mensaje": "Has dejado de seguir a este usuario"}

# ------------------ SEGUIDORES ------------------
@app.get("/seguidores")
def obtener_seguidores(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    seguidores = db.query(models.SeguirUsuario).filter(models.SeguirUsuario.id_seguido == user_id).all()

    resultado = []
    for seg in seguidores:
        seguidor = db.query(models.Usuario).filter(models.Usuario.id_usuario == seg.id_seguidor).first()
        perfil = db.query(models.Perfil).filter(models.Perfil.id_usuario == seg.id_seguidor).first()
        resultado.append({
            "id_seguimiento": seg.id_seguimiento,
            "fecha_seguimiento": seg.fecha_seguimiento,
            "seguidor": {
                "id_usuario": seguidor.id_usuario,
                "nombre_usuario": seguidor.nombre_usuario,
                "foto_perfil": perfil.foto_perfil if perfil else None
            }
        })
    return resultado

# ------------------ NOTIFICACIONES ------------------
@app.get("/notificaciones", response_model=List[schemas.NotificacionResponse])
def obtener_notificaciones(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    notificaciones = (
        db.query(models.Notificacion)
        .filter(models.Notificacion.id_usuario == user_id)
        .order_by(models.Notificacion.fecha.desc())
        .all()
    )

    return [
        {
            "id_notificacion": n.id_notificacion,
            "tipo": n.tipo,
            "mensaje": n.mensaje,
            "fecha_creacion": n.fecha,
            "leida": n.leido,
            "id_referencia": getattr(n, "id_referencia", None)
        }
        for n in notificaciones
    ]

@app.put("/notificaciones/{id_notificacion}/leer")
def marcar_notificacion_leida(id_notificacion: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    noti = db.query(models.Notificacion).filter(
        models.Notificacion.id_notificacion == id_notificacion,
        models.Notificacion.id_usuario == user_id
    ).first()

    if not noti:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")

    noti.leido = True
    db.commit()
    return {"mensaje": "Notificación marcada como leída"}

# ------------------ HOME ------------------
@app.get("/home")
def home():
    return {"contenido": "<div>Barra de navegación</div><div>Publicaciones</div><div>Categorías</div><div>Sugerencias</div>"}
