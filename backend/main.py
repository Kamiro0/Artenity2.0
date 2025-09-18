from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import models, database, schemas   # 👈 importa desde el paquete backend
from backend.database import get_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Crear tablas
models.Base.metadata.create_all(bind=database.engine)

# ------------------ ENDPOINTS ------------------

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

@app.get("/usuarios", response_model=list[schemas.UsuarioResponse])
def get_usuarios(db: Session = Depends(get_db)):
    return db.query(models.Usuario).all()   # 👈 corregido

@app.delete("/usuarios/{usuario_id}", response_model=schemas.UsuarioResponse)
def delete_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(usuario)
    db.commit()
    return usuario

# ------------------ CORS ------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # o ["*"] para permitir todos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)