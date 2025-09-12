import React from "react";
import "../styles/register.css";
import { Link } from "react-router-dom";

// Importa las imágenes (ajusta la ruta a donde tengas tus assets)
import brushImg from "../assets/img/loginmusic.png";
import logoImg from "../assets/img/logo.png";

const Register: React.FC = () => {
  return (
    <div>
      {/* Pinceladas decorativas */}
      <img src={brushImg} alt="" aria-hidden="true" className="brush top-left" />
      <img src={brushImg} alt="" aria-hidden="true" className="brush bottom-right" />

      <div className="registro-container">
        {/* Cabecera con logo y texto */}
        <div className="header">
          <img src={logoImg} alt="Logo" className="logo" />
          <div className="capsula-titulo">REGISTRO</div>
        </div>

        {/* Formulario */}
        <form className="registro-form">
          <div className="campo-doble">
            <input type="text" placeholder="Nombre" />
            <input type="text" placeholder="Apellido" />
          </div>

          <label>Fecha de nacimiento</label>
          <div className="campo-triple">
            <input type="number" placeholder="día" min="1" max="31" required />
            <input type="number" placeholder="mes" min="1" max="12" required />
            <input type="number" placeholder="año" min="1900" max="2025" required />
          </div>

          <label>Género</label>
          <div className="campo-genero">
            <label>
              <input type="radio" name="genero" value="Mujer" /> Mujer
            </label>
            <label>
              <input type="radio" name="genero" value="Hombre" /> Hombre
            </label>
            <label>
              <input type="radio" name="genero" value="Personalizado" /> Personalizado
            </label>
          </div>

          <input type="text" placeholder="En caso de género personalizado, especificar" />
          <input type="email" placeholder="Número de teléfono/Correo electrónico" required />

          <select required>
            <option value="">Seleccione una categoría de arte</option>

            <optgroup label="Artes visuales">
              <option value="pintura">Pintura</option>
              <option value="escultura">Escultura</option>
              <option value="dibujo">Dibujo</option>
              <option value="grabado">Grabado</option>
              <option value="fotografia">Fotografía</option>
              <option value="cine">Cine</option>
              <option value="arquitectura">Arquitectura</option>
              <option value="diseno">Diseño (gráfico, industrial, de moda, etc.)</option>
            </optgroup>

            <optgroup label="Artes escénicas">
              <option value="teatro">Teatro</option>
              <option value="danza">Danza</option>
              <option value="opera">Ópera</option>
              <option value="ballet">Ballet</option>
              <option value="circo">Circo</option>
              <option value="mimica">Mímica</option>
            </optgroup>

            <optgroup label="Artes musicales">
              <option value="musica_clasica">Música clásica</option>
              <option value="jazz">Jazz</option>
              <option value="rock">Rock</option>
              <option value="pop">Pop</option>
              <option value="folclorica">Folclórica</option>
              <option value="electronica">Electrónica</option>
            </optgroup>

            <optgroup label="Artes literarias">
              <option value="poesia">Poesía</option>
              <option value="narrativa">Narrativa (novela, cuento, etc.)</option>
              <option value="drama">Drama</option>
              <option value="ensayo">Ensayo</option>
            </optgroup>

            <optgroup label="Artes digitales y multimedia">
              <option value="arte_digital">Arte digital</option>
              <option value="arte_interactivo">Arte interactivo</option>
              <option value="arte_nuevos_medios">Arte de nuevos medios</option>
              <option value="animacion">Animación</option>
              <option value="videojuegos">Videojuegos</option>
            </optgroup>

            <optgroup label="Artes tradicionales y populares">
              <option value="artesania">Artesanía</option>
              <option value="ceramica">Cerámica</option>
              <option value="textiles">Textiles</option>
              <option value="joyeria">Joyería</option>
              <option value="orfebreria">Orfebrería</option>
              <option value="musica_danza_folclorica">Música y danza folclóricas</option>
            </optgroup>
          </select>

          <input type="text" placeholder="Nombre de usuario" required />
          <input type="password" placeholder="Contraseña" required />

          <button type="submit" className="btn-registro">Regístrate!!</button>
        </form>

        {/* Enlace al login */}
        <p className="cuenta">
          <Link to="/login">¿Ya tienes una cuenta?</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
