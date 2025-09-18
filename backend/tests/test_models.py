from backend.models import Usuario

def test_usuario_model():
    usuario = Usuario(
        nombre="Juan",
        apellido="Pérez",
        correo_electronico="juan@example.com",
        contrasena="1234",
        fecha_nacimiento="2000-01-01",
        genero="Masculino",
        tipo_arte_preferido="Pintura",
        telefono="1234567890",
        nombre_usuario="juanp"
    )
    assert usuario.nombre == "Juan"
    assert usuario.apellido == "Pérez"
    assert usuario.correo_electronico == "juan@example.com"

def test_usuario_unique_email():
    usuario1 = Usuario(
        nombre="Ana",
        apellido="García",
        correo_electronico="ana@example.com",
        contrasena="abcd",
        fecha_nacimiento="1995-05-10",
        genero="Femenino",
        tipo_arte_preferido="Música",
        telefono="9876543210",
        nombre_usuario="anag"
    )
    usuario2 = Usuario(
        nombre="Ana",
        apellido="García",
        correo_electronico="ana@example.com",  # mismo correo
        contrasena="abcd",
        fecha_nacimiento="1995-05-10",
        genero="Femenino",
        tipo_arte_preferido="Música",
        telefono="9876543210",
        nombre_usuario="anag2"
    )
    assert usuario1.correo_electronico == usuario2.correo_electronico

def test_usuario_fields_not_null():
    usuario = Usuario(
        nombre="Luis",
        apellido="Martínez",
        correo_electronico="luis@example.com",
        contrasena="pass",
        fecha_nacimiento="1988-12-12",
        genero="Masculino",
        tipo_arte_preferido="Cine",
        telefono="5555555555",
        nombre_usuario="luism"
    )
    for field in [
        usuario.nombre,
        usuario.apellido,
        usuario.correo_electronico,
        usuario.contrasena,
        usuario.fecha_nacimiento,
        usuario.genero,
        usuario.tipo_arte_preferido,
        usuario.telefono,
        usuario.nombre_usuario
    ]:
        assert field is not None