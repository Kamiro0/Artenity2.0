import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


valid_user = {"correo_electronico": "usuario@correo.com", "contrasena": "contrasena_valida"}
invalid_user = {"correo_electronico": "noexiste@correo.com", "contrasena": "cualquier"}
wrong_password = {"correo_electronico": "usuario@correo.com", "contrasena": "malacontrasena"}

@pytest.fixture(scope="module", autouse=True)
def setup_user():
    usuarios = client.get("/usuarios").json()
    for usuario in usuarios:
        correo = usuario.get("correo_electronico", "")
        if "@" in correo and correo == "usuario@correo.com":
            user_id = usuario.get("id_usuario") or usuario.get("id")
            if user_id:
                client.delete(f"/usuarios/{user_id}")
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

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# 🚀 Configuración del navegador
driver = webdriver.Chrome()

try:

    driver.get("http://localhost:3000/login") 
    print("✅ Página de login abierta.")


    usuario = WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.NAME, "correo_electronico"))
    )
    contrasena = WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.NAME, "contrasena"))
    )


    usuario.send_keys("usuario@correo.com")       
    contrasena.send_keys("contrasena_valida")    
    print("✅ Se llenaron los campos.")


    contrasena.send_keys(Keys.RETURN)
    print("✅ Se envió el formulario.")


    WebDriverWait(driver, 20).until(
        lambda d: "/principal" in d.current_url
    )

    print(f"🎉 Login exitoso, redirigido a: {driver.current_url}")

   
    time.sleep(5)

except Exception as e:
    print("❌ Error en la automatización:", e)

finally:

    driver.quit()
    print("🚪 Navegador cerrado.")
