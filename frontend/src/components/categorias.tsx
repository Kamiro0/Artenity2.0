import React, { useEffect, useState } from "react";
import { getCategorias } from "../services/api";
import "./categorias.css";

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch (error) {
        console.error("Error al cargar categorías", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="categorias-container">
      {/* Barra de búsqueda */}
      <div className="busqueda">
        <input
          type="text"
          placeholder="BUSCAR UNA CATEGORÍA ESPECÍFICA"
          className="input-busqueda"
        />
      </div>

      {/* Listado de categorías */}
      <div className="categorias-grid">
        {categorias.length > 0 ? (
          categorias.map((cat) => (
            <div key={cat.id} className={`categoria-card ${cat.nombre.toLowerCase()}`}>
              <h3>{cat.nombre.toUpperCase()}</h3>
              <img src={cat.imagen_url} alt={cat.nombre} />
            </div>
          ))
        ) : (
          <>
            {/* Valores por defecto si BD no trae nada */}
            <div className="categoria-card pintura">
              <h3>PINTURAS</h3>
              <img src="/assets/img/pintura.jpg" alt="Pinturas" />
            </div>
            <div className="categoria-card danza">
              <h3>DANZA</h3>
              <img src="/assets/img/danza.jpg" alt="Danza" />
            </div>
            <div className="categoria-card musica">
              <h3>MÚSICA</h3>
              <img src="/assets/img/musica.jpg" alt="Música" />
            </div>
            <div className="categoria-card cine">
              <h3>CINE</h3>
              <img src="/assets/img/cine.jpg" alt="Cine" />
            </div>
            <div className="categoria-card literatura">
              <h3>LITERATURA</h3>
              <img src="/assets/img/literatura.jpg" alt="Literatura" />
            </div>
          </>
        )}
      </div>

      {/* Barra lateral */}
      <div className="barra-lateral">
        <button>🏠</button>
        <button>👥</button>
        <button>💬</button>
        <button>🔍</button>
        <button>⚙️</button>
      </div>
    </div>
  );
};

export default Categorias;
