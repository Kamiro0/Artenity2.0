import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_user():
    # Elimina el usuario si ya existe antes de crearlo
    usuarios = client.get("/usuarios").json()
    for usuario in usuarios:
        if usuario["correo_electronico"] == "home@correo.com":
            client.delete(f"/usuarios/{usuario['id']}")
    # Ahora sí crea el usuario de prueba
    client.post("/usuarios", json={
        "nombre": "Home",
        "apellido": "Test",
        "correo_electronico": "home@correo.com",
        "contrasena": "home123",
        "fecha_nacimiento": "1990-01-01",
        "genero": "Otro",
        "tipo_arte_preferido": "Pintura",
        "telefono": "987654321",
        "nombre_usuario": "homeuser"
    })

def test_home_carga_exitosa():
    response = client.get("/home")
    assert response.status_code == 200
    assert "Publicaciones" in response.text or "publicaciones" in response.text
    assert "Categorías" in response.text or "categorías" in response.text

def test_home_render_componentes():
    response = client.get("/home")
    # Ajusta los textos según lo que realmente retorna tu endpoint
    assert "barra de navegación" in response.text or "Barra de navegación" in response.text or "navbar" in response.text
    assert "Publicaciones" in response.text or "publicaciones" in response.text
    assert "Categorías" in response.text or "categorías" in response.text
    assert "Sugerencias" in response.text or "sugerencias" in response.text

def test_home_personalizacion_usuario():
    # Simula autenticación si tu backend lo requiere (por ejemplo, con un token)
    # Aquí solo se muestra la estructura básica
    response = client.get("/home?usuario=home@correo.com")
    assert response.status_code == 200
    # Ajusta según la lógica de personalización de tu backend
    assert "Pintura" in response.text or "homeuser" in response.text