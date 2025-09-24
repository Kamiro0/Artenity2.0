import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# Datos de ejemplo (ajusta el correo a uno válido)
valid_user = {"correo_electronico": "usuario@correo.com", "contrasena": "contrasena_valida"}
invalid_user = {"correo_electronico": "noexiste@correo.com", "contrasena": "cualquier"}
wrong_password = {"correo_electronico": "usuario@correo.com", "contrasena": "malacontrasena"}

@pytest.fixture(scope="module", autouse=True)
def setup_user():
    # Elimina el usuario si ya existe antes de crearlo (verifica que tenga 'id')
    usuarios = client.get("/usuarios").json()
    for usuario in usuarios:
        if usuario.get("correo_electronico") == "usuario@correo.com" and "id" in usuario:
            client.delete(f"/usuarios/{usuario['id']}")
    # Ahora sí crea el usuario de prueba
    client.post("/usuarios", json={
        "nombre": "Usuario",
        "apellido": "Prueba",
        "correo_electronico": "usuario@correo.com",
        "contrasena": "contrasena_valida",
        "fecha_nacimiento": "2000-01-01",
        "genero": "Otro",
        "tipo_arte_preferido": "Música",
        "telefono": "123456789",
        "nombre_usuario": "usuarioprueba"
    })

def test_login_exitoso():
    response = client.post("/login", json=valid_user)
    assert response.status_code == 200
    assert "token" in response.json()

def test_usuario_no_registrado():
    response = client.post("/login", json=invalid_user)
    assert response.status_code == 400
    assert "Credenciales incorrectas" in response.text

def test_contrasena_incorrecta():
    response = client.post("/login", json=wrong_password)
    assert response.status_code == 400
    assert "Credenciales incorrectas" in response.text

def test_campos_vacios():
    response = client.post("/login", json={"correo_electronico": "", "contrasena": ""})
    assert response.status_code == 422