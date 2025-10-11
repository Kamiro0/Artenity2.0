from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session, joinedload
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
os.makedirs("static/perfiles", exist_ok=True)
os.makedirs("static/posts", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# ------------------ Crear tablas ------------------
models.Base.metadata.create_all(bind=database.engine)

# ------------------ Dependencia para usuario actual ------------------
def get_current_user_id(
    token: str = Header(...),
    db: Session = Depends(get_db)
) -> int:
    if token != "fake-token":
        raise HTTPException(status_code=401, detail="Token inválido")

    usuario = db.query(models.Usuario).first()  # Simulación de usuario
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return usuario.id_usuario


# ------------------ Función para crear perfiles faltantes ------------------
def crear_perfiles_automaticos(db: Session):
    """
    Recorre todos los usuarios y crea perfiles vacíos
    si alguno no tiene perfil asociado.
    """
    usuarios = db.query(models.Usuario).all()
    for usuario in usuarios:
        perfil_existente = db.query(models.Perfil).filter(models.Perfil.id_usuario == usuario.id_usuario).first()
        if not perfil_existente:
            nuevo_perfil = models.Perfil(
                id_usuario=usuario.id_usuario,
                descripcion=None,
                biografia=None,
                foto_perfil=None
            )
            db.add(nuevo_perfil)
            print(f"✅ Perfil creado para usuario {usuario.id_usuario}")
        else:
            print(f"➡️ Perfil ya existe para usuario {usuario.id_usuario}")
    db.commit()


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

    # Crear perfil vacío automáticamente
    nuevo_perfil = models.Perfil(
        id_usuario=nuevo_usuario.id_usuario,
        descripcion=None,
        biografia=None,
        foto_perfil=None
    )
    db.add(nuevo_perfil)
    db.commit()
    db.refresh(nuevo_perfil)

    return nuevo_usuario


@app.get("/usuarios", response_model=List[schemas.UsuarioResponse])
def get_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(models.Usuario).all()
    return [u for u in usuarios if "@" in u.correo_electronico]


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


# ------------------ Login ------------------
class LoginRequest(BaseModel):
    correo_electronico: EmailStr
    contrasena: str


@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.correo_electronico == data.correo_electronico).first()
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
            "foto_perfil": perfil.foto_perfil if perfil else None
        }
    }


@app.put("/usuarios/{usuario_id}", response_model=schemas.UsuarioResponse)
def update_usuario(
    usuario_id: int,
    nombre: str = Form(None),
    correo_electronico: str = Form(None),
    db: Session = Depends(get_db)
):
    usuario = db.query(models.Usuario).filter(models.Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if nombre:
        usuario.nombre = nombre
    if correo_electronico:
        usuario.correo_electronico = correo_electronico

    db.commit()
    db.refresh(usuario)
    return usuario


# ------------------ PERFILES ------------------
# En main.py, actualiza el endpoint de obtener perfil:
@app.get("/perfiles/{id_usuario}", response_model=schemas.PerfilResponse)
def obtener_perfil(id_usuario: int, db: Session = Depends(get_db)):
    perfil = (
        db.query(models.Perfil)
        .filter(models.Perfil.id_usuario == id_usuario)
        .first()
    )
    if not perfil:
        # Crear perfil automáticamente si no existe
        nuevo_perfil = models.Perfil(
            id_usuario=id_usuario,
            descripcion=None,
            biografia=None,
            foto_perfil=None
        )
        db.add(nuevo_perfil)
        db.commit()
        db.refresh(nuevo_perfil)
        return nuevo_perfil
    return perfil

# Mejora el endpoint de actualizar perfil:
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
        # Crear perfil si no existe
        perfil = models.Perfil(id_usuario=id_usuario)
        db.add(perfil)
        db.commit()
        db.refresh(perfil)

    if descripcion is not None:
        perfil.descripcion = descripcion
    if biografia is not None:
        perfil.biografia = biografia
        
    if file and file.filename:
        # Asegurar que la carpeta existe
        os.makedirs("static/perfiles", exist_ok=True)
        
        # Generar nombre único para el archivo
        file_extension = file.filename.split('.')[-1]
        filename = f"perfil_{id_usuario}.{file_extension}"
        file_path = os.path.join("static/perfiles", filename)
        
        # Guardar archivo
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Actualizar URL en la base de datos
        perfil.foto_perfil = f"http://localhost:8000/static/perfiles/{filename}"

    db.commit()
    db.refresh(perfil)
    return perfil

# ------------------ PUBLICACIONES ------------------
@app.get("/publicaciones", response_model=List[schemas.PublicacionResponse])
def obtener_publicaciones(db: Session = Depends(get_db)):
    publicaciones = (
        db.query(models.Publicacion)
        .options(joinedload(models.Publicacion.usuario).joinedload(models.Usuario.perfil))
        .order_by(models.Publicacion.fecha_creacion.desc())
        .all()
    )
    return publicaciones


@app.post("/publicaciones", response_model=schemas.PublicacionResponse)
async def crear_publicacion(
    id_usuario: int = Form(...),
    contenido: str = Form(...),
    file: UploadFile | None = File(None),
    db: Session = Depends(get_db)
):
    imagen_url = None
    if file:
        filename = f"{id_usuario}_{file.filename}"
        ruta = os.path.join("static/posts", filename)
        with open(ruta, "wb") as f:
            f.write(file.file.read())
        imagen_url = f"http://localhost:8000/static/posts/{filename}"

    nueva_pub = models.Publicacion(
        id_usuario=id_usuario,
        contenido=contenido,
        imagen=imagen_url
    )
    db.add(nueva_pub)
    db.commit()
    db.refresh(nueva_pub)
    return nueva_pub


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
