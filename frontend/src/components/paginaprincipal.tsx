import { Home, Compass, Grid, MessageSquare, Settings, Image } from "lucide-react";

export default function PaginaPrincipal() {
  return (
    <div className="flex h-screen bg-[url('https://i.ibb.co/NyRbd8m/bg-art.jpg')] bg-cover bg-center text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black/50 flex flex-col justify-between py-6 px-4">
        <div className="space-y-6">
          <div className="text-center text-2xl font-bold">🎨 Artenity</div>
          <nav className="space-y-4">
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60"><Home /> Home</button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60"><Compass /> Explorar</button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60"><Grid /> Categorías</button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60"><MessageSquare /> Mensajes</button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60"><Settings /> Configuración</button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-purple-700/60"><Image /> Galería de Arte</button>
          </nav>
        </div>
        <button className="bg-gradient-to-r from-purple-700 to-pink-500 px-4 py-2 rounded-xl font-semibold">POST</button>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-y-auto">
        {/* Zona izquierda */}
        <section className="flex-1 bg-black/40 rounded-2xl p-6">
          <div className="flex justify-between gap-4">
            <button className="bg-black px-4 py-2 rounded-xl">Para ti</button>
            <button className="bg-black px-4 py-2 rounded-xl">Seguir</button>
            <button className="bg-black px-4 py-2 rounded-xl">Guardado</button>
          </div>

          <div className="mt-6 flex gap-3">
            <input type="text" placeholder="¿Qué quieres escribir?" className="flex-1 px-4 py-2 rounded-xl bg-black/80 focus:outline-none"/>
            <button className="bg-gradient-to-r from-purple-700 to-pink-500 px-4 py-2 rounded-xl">Post</button>
          </div>

          <div className="mt-6 bg-gradient-to-r from-purple-700 to-pink-500 text-center py-3 rounded-xl font-bold">
            ¡Nuevos Posters!!
          </div>
        </section>

        {/* Sidebar derecha */}
        <aside className="w-full lg:w-80 flex flex-col gap-6">
          {/* Buscar y perfil */}
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Buscar" className="flex-1 px-4 py-2 rounded-xl bg-black/80 focus:outline-none"/>
            <button className="bg-gradient-to-r from-purple-700 to-pink-500 px-3 py-2 rounded-xl">🔔</button>
            <div className="w-10 h-10 rounded-full bg-purple-500"></div>
          </div>

          {/* Comunidades */}
          <div className="bg-black/40 rounded-2xl p-4">
            <h2 className="font-bold mb-3">Comunidades a seguir</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-400"></div>
                <span>Comunidad.Name</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-400"></div>
                <span>Comunidad.Name</span>
              </div>
            </div>
          </div>

          {/* Noticias */}
          <div className="bg-black/40 rounded-2xl p-4">
            <h2 className="font-bold mb-3">Lo que sucede con el mundo del arte</h2>
            <div className="bg-black/70 rounded-xl p-3">
              <span className="font-semibold">@User.Name</span>
              <p className="text-sm">Sistemas nuevos para dibujo</p>
            </div>
          </div>

          {/* A quién seguir */}
          <div className="bg-black/40 rounded-2xl p-4">
            <h2 className="font-bold mb-3">A quién seguir</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-400"></div>
                  <span>User.Name</span>
                </div>
                <button className="bg-purple-600 px-2 py-1 rounded-full">+</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-400"></div>
                  <span>User.Name</span>
                </div>
                <button className="bg-purple-600 px-2 py-1 rounded-full">+</button>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
