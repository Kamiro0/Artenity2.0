import React, { useState } from "react";
import { getUsuarios } from "../services/api";
import "../styles/busqueda.css";

const Busqueda: React.FC = () => {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await getUsuarios();
      // Filtro simple: busca por nombre o correo
      const filtrados = data.filter(
        (u: any) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.correo.toLowerCase().includes(query.toLowerCase())
      );
      setResultados(filtrados);
    } catch (error) {
      console.error("Error en búsqueda:", error);
    }
  };

  return (
    <div className="busqueda-container">
      {/* Barra de búsqueda */}
      <header className="busqueda-header">
        <form onSubmit={handleBuscar} className="busqueda-form">
          <input
            type="text"
            placeholder="Buscar usuarios o arte..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
      </header>

      {/* Resultados */}
      <main className="busqueda-resultados">
        {resultados.length > 0 ? (
          resultados.map((r) => (
            <div key={r.id} className="resultado-card">
              <div className="resultado-header">
                <strong>{r.name}</strong> <span>@{r.correo}</span>
              </div>
              <div className="resultado-content">
                {/* Simula publicaciones con imágenes */}
                <p>Últimas publicaciones de {r.name}:</p>
                <div className="resultado-imagenes">
                  <img
                    src="https://uploads6.wikiart.org/images/vincent-van-gogh/starry-night.jpg"
                    alt="ejemplo"
                  />
                  <img
                    src="https://uploads7.wikiart.org/images/leonardo-da-vinci/self-portrait-1512.jpg"
                    alt="ejemplo"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-resultados">No hay resultados para mostrar.</p>
        )}
      </main>
    </div>
  );
};

export default Busqueda;
