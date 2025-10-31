# Artenity — Plataforma social para artistas

Artenity es una aplicación web para crear, compartir y descubrir obras de arte, gestionar perfiles de artista, seguir a otros usuarios y reportar contenido. Este README reúne todo lo necesario para entender, instalar, configurar, ejecutar y contribuir al proyecto.

---

## Contenido rápido
- Título y propósito
- Tecnologías y stack
- Requisitos
- Estructura del repositorio
- Configuración (env, DB, dependencias)
- Comandos (instalación, ejecución, tests, migraciones)
- Endpoints / archivos clave
- Contribución, licencias y contacto

---

## 1. Título y propósito
Artenity — Plataforma social para artistas  
Propósito: ofrecer una red social especializada en arte para publicar obras, gestionar perfiles, seguir artistas, recibir notificaciones y reportar contenido inapropiado.

---

## 2. Tecnologías (stack)
- Lenguaje backend: Python 3.10+
- Framework backend: FastAPI (ASGI: Uvicorn)
- ORM / modelos: SQLAlchemy / SQLModel
- Base de datos: MariaDB / MySQL (compatible con PyMySQL)
- Frontend: React (TypeScript)
- Tests: pytest (backend)
- Otras: Alembic (migraciones opcional), npm/yarn (frontend)

Archivos relevantes:
- Backend: `backend/main.py`, `backend/models.py`, `backend/schemas.py`, `backend/database.py`
- Frontend: `frontend/src/...` (`PerfilUsuario.tsx`, `services/api.ts`, etc.)

---

## 3. Requisitos previos (software)
- Python 3.10+
- pip
- Node.js 18+ y npm
- MariaDB / MySQL (cliente `mysql` y servidor)
- Git (recomendado)
- Windows: PowerShell o CMD (ejemplos incluidos)

---

## 4. Estructura del repositorio (resumen)
- /backend
  - main.py, models.py, schemas.py, database.py, requirements.txt, artenity.sql, tests/
- /frontend
  - package.json, src/, public/
- /README.md (este archivo)
- /LICENSE (sugerido)
- /static (si aplica: imágenes, uploads)

(Estructura completa disponible en el repo)

---

## 5. Configuración paso a paso (Windows)

1) Clonar:
```bash
git clone <repo-url> Artenity2.0
cd Artenity2.0
```


2) Backend: crear entorno virtual e instalar dependencias
```bash
python -m venv backend\venv
# PowerShell
backend\venv\Scripts\Activate.ps1
# CMD
backend\venv\Scripts\activate
pip install -r backend/requirements.txt
```

3) Variables de entorno (usar `backend/.env`, no subir `.env`):
Crear `backend/.env` o `backend/.env.example` con:
```env
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/artenity
SECRET_KEY=change_this_to_a_strong_secret
ALLOWED_HOSTS=localhost,127.0.0.1
MEDIA_ROOT=./static
DEBUG=True
```
Temporal en PowerShell:
```powershell
$env:DATABASE_URL="mysql+pymysql://user:password@localhost:3306/artenity"
$env:SECRET_KEY="mi_secreto"
```

4) Base de datos: crear DB e importar dump (opcional)
```bash
# crear base (usando cliente mysql)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS artenity CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p artenity < backend/artenity.sql
```

5) Frontend: instalar dependencias
```bash
cd frontend
npm install
cd ..
```

---

## 6. Ejecutar en modo desarrollo

1) Backend (con venv activado, raíz del repo):
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```
API en: http://localhost:8000  
Documentación automática (si FastAPI expone): http://localhost:8000/docs y /redoc

2) Frontend (otra terminal):
```bash
cd frontend
npm start
```
Frontend en: http://localhost:3000

---

## 7. Migraciones / Crear esquema (opcional)
- Si usa Alembic:
```bash
# generar y aplicar migración
alembic revision --autogenerate -m "mensaje"
alembic upgrade head
```
- Si no hay Alembic y usa SQLModel/SQLAlchemy:
- Crear un script como `backend/scripts/create_db.py` que importe modelos y haga `SQLModel.metadata.create_all(engine)`.

---

## 8. Tests
Ejecutar tests backend:
```bash
# desde la raíz o backend/
pytest -q
# con coverage
coverage run -m pytest && coverage html
```
Tests detectados en `backend/tests/`.

---

## 9. Endpoints y archivos clave
- Rutas FastAPI definidas en `backend/main.py`. Revisar ese archivo para endpoints exactos.
- Funciones/acciones comunes:
  - publicar / crear publicación — revisar controlador correspondiente (`crear_publicacion` u otro nombre) en `backend/main.py`
  - reportar usuario — revisar `reportar_usuario` en `backend/main.py`
  - autenticación / sesiones — revisar `frontend/context/AuthContext.tsx` y `frontend/services/api.ts`
- Frontend:
  - `frontend/src/components/PerfilUsuario.tsx` (perfil y reporte)
  - `frontend/src/services/api.ts` (cliente HTTP y manejo de tokens)

(Revisar archivos para nombres exactos de endpoints y payloads)

---

## 10. Buenas prácticas y seguridad
- No subir `.env` ni credenciales reales al repositorio.
- Usar SECRET_KEY fuerte y credenciales DB seguras.
- Hacer backups de la base de datos antes de cambios destructivos.
- Añadir validaciones y límites en uploads (tamaño, tipo MIME).
- Usar HTTPS en producción y configurar CORS/ALLOWED_HOSTS correctamente.

---

## 11. Contribuir
- Flujo: Fork → branch feature/issue-### → commit → PR.
- Incluir tests para cambios funcionales.
- Usar linters/formatters: Black, isort, flake8 (Python); ESLint/Prettier (frontend).
- Añadir `.github/ISSUE_TEMPLATE/` y `.github/PULL_REQUEST_TEMPLATE/` (se sugiere).

Plantilla mínima de PR:
- Resumen breve
- Issue relacionado
- Cambios realizados
- Cómo probar localmente

---

## 12. Licencia y contacto
- Licencia: MIT (añadir `LICENSE` con texto).
- Contacto: autor@example.com (reemplazar por email real).

---

## 13. Comandos útiles de referencia
```bash
# activar virtualenv (Windows)
backend\venv\Scripts\activate

# instalar dependencias backend
pip install -r backend/requirements.txt

# iniciar backend
uvicorn backend.main:app --reload --port 8000

# instalar frontend y arrancar
cd frontend
npm install
npm start

# ejecutar tests
pytest -q
```
# 14. Editar commit

git commit --amend -m "Nuevo mensaje del último commit"
git push --force
