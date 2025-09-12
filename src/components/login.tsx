import React from "react";
import "../styles/login.css";
import { Link } from "react-router-dom";
// Importa las imágenes desde /assets o la ruta que uses
import brushImg from "../assets/img/loginmusic.png";
import logoImg from "../assets/img/logo.png";
import googleImg from "../assets/img/google.png";
import facebookImg from "../assets/img/facebook.png";
import appleImg from "../assets/img/apple.png";
import discordImg from "../assets/img/discord.png";
import instagramImg from "../assets/img/instagram.png";

const Login: React.FC = () => {
  return (
    <div>
      {/* Pinceladas */}
      <img src={brushImg} alt="Decoración" className="brush top-left" />
      <img src={brushImg} alt="Decoración" className="brush bottom-right" />

      {/* Contenedor Login */}
      <div className="login-container">
        <form>
          <div className="input-group">
            <label htmlFor="name">NAME</label>
            <input
              type="text"
              id="name"
              placeholder="CORREO ELECTRONICO O NUMERO DE TELEFONO"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">PASSWORD</label>
            <input type="password" id="password" placeholder="CONTRASEÑA" />
          </div>
          <button type="submit" className="login-btn">
            Iniciar Sesión!!
          </button>
        </form>

        <div className="header-box">
          <h1>ARTENITY</h1>
          <img src={logoImg} alt="Logo" className="logo" />
        </div>

        <div className="social-icons">
          <img src={googleImg} alt="Google" />
          <img src={facebookImg} alt="Facebook" />
          <img src={appleImg} alt="Apple" />
          <img src={discordImg} alt="Discord" />
          <img src={instagramImg} alt="Instagram" />
        </div>

        <p className="register">
          ¿No tienes una cuenta? <Link to="/Register">Regístrate</Link>
          <br />
          <a href="/#">Olvidé mi contraseña</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
