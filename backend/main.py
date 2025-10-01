from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from backend import models, database, schemas
from backend.database import get_db
from pydantic import BaseModel, EmailStr
from typing import List
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
if not os.path.exists("static/avatars"):
    os.makedirs("static/avatars")
app.mount("/static", StaticFiles(directory="static"), name="static")

# ------------------ Crear tablas ------------------
models.Base.metadata.create_all(bind=database.engine)

# ------------------ Endpoints Usuarios ------------------

@app.post("/usuarios", response_model=schemas.UsuarioResponse)
def create_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    nuevo_usuario = models.Usuario(
        nombre=usuario.nombre,
        apellido=usuario.apellido,
        correo_electronico=usuario.correo_electronico,
        contrasena=usuario.contrasena,
        fecha_nacimiento=usuario.fecha_nacimiento,
        genero=usuario.genero,
        tipo_arte_preferido=usuario.tipo_arte_preferido,
        telefono=usuario.telefono,
        nombre_usuario=usuario.nombre_usuario
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

@app.get("/usuarios", response_model=List[schemas.UsuarioResponse])
def get_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(models.Usuario).all()
    usuarios_validos = [u for u in usuarios if "@" in u.correo_electronico]
    return usuarios_validos

@app.delete("/usuarios/{usuario_id}", response_model=schemas.UsuarioResponse)
def delete_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(usuario)
    db.commit()
    return usuario

# ------------------ Login ------------------
class LoginRequest(BaseModel):
    correo_electronico: EmailStr
    contrasena: str

@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.correo_electronico == data.correo_electronico).first()
    if not usuario or usuario.contrasena != data.contrasena:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    return {"token": "fake-token", "usuario": usuario.nombre_usuario}

@app.put("/usuarios/{usuario_id}", response_model=schemas.UsuarioResponse)
def update_usuario(
    usuario_id: int,
    nombre: str = Form(None),
    correo_electronico: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if nombre:
        usuario.nombre = nombre
    if correo_electronico:
        usuario.correo_electronico = correo_electronico
    if file:
        filename = f"{usuario_id}_{file.filename}"
        file_location = os.path.join("static/avatars", filename)
        with open(file_location, "wb+") as f:
            f.write(file.file.read())
        usuario.avatar = f"http://localhost:8000/static/avatars/{filename}"

    db.commit()
    db.refresh(usuario)
    return usuario

# ------------------ Home ------------------
@app.get("/home")
def home():
    return {
        "contenido": """
            <div>Barra de navegación</div>
            <div>Publicaciones</div>
            <div>Categorías</div>
            <div>Sugerencias</div>
            <div>Pintura</div>
            <div>homeuser</div>
        """
    }
