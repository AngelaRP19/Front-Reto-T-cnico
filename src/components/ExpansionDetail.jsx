import React from 'react';

const ExpansionDetail = ({ data, onBack }) => {
  // Datos por default //
  const expansion = data || {
    title: "The Sims™ 4: Pack de Expansión",
    category: "PACK DE EXPANSIÓN",
    price: "$79.900 COP",
    platform: "PC / Mac / Consolas",
    releaseDate: "Disponible ahora",
    description: "Explora nuevas historias, mundos e interacciones con tus Sims.",
    features: ["Nuevos objetos", "Nuevas mecánicas", "Mundo exclusivo"],
    image: "https://res.cloudinary.com/w1jl4sa5/image/upload/v1784572920/TS4_Pack-Art_Enchanted-by-Nature_ES_iv5fev.avif"
  };

  return (
    <div className="min-h-screen bg-bg text-text py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-400">
      <div className="max-w-5xl mx-auto">

        {/* Botón para regresar al catálogo */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm font-bold text-main hover:text-hover transition duration-200 cursor-pointer"
        >
          ← Volver al catálogo
        </button>

        {/* Tarjeta de detalle */}
        <div className="bg-card-bg rounded-3xl shadow-xl overflow-hidden border border-snd-bg transition-colors duration-400">
          <div className="md:flex">

            {/* Contenedor de la Imagen con la clase 'group' para detectar el hover */}
            <div className="md:w-1/2 bg-slate-900 p-6 flex items-center justify-center relative group overflow-hidden">

              {/* Etiqueta / Recuadro con transición rápida de 200ms */}
              <span className="absolute top-4 left-4 bg-accent text-bg text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10 transition-opacity duration-200 ease-in-out group-hover:opacity-0 pointer-events-none">
                {expansion.category || "PACK DE EXPANSIÓN"}
              </span>

              <img
                src={expansion.image}
                alt={expansion.title}
                className="rounded-2xl shadow-md w-full h-80 md:h-full object-cover transform group-hover:scale-105 transition duration-300"
              />
            </div>

            {/* Información */}
            <div className="md:w-1/2 p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-text mb-2 transition-colors duration-400">
                  {expansion.title}
                </h1>

                <div className="flex items-center gap-3 mb-4 text-xs font-medium text-text opacity-60">
                  <span className="bg-snd-bg text-main px-2.5 py-1 rounded-md">{expansion.platform}</span>
                  <span>• {expansion.releaseDate}</span>
                </div>

                <p className="text-text mb-6 text-sm leading-relaxed transition-colors duration-400">
                  {expansion.description}
                </p>

                <h3 className="text-base font-bold text-text mb-3 border-b border-snd-bg pb-2 transition-colors duration-400">
                  ¿Qué incluye este pack?
                </h3>
                <ul className="space-y-2 mb-6 text-sm text-text">
                  {expansion.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-accent font-bold">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botón de compra */}
              <div className="pt-4 border-t border-snd-bg flex items-center justify-between">
                <div>
                  <span className="text-xs text-text opacity-60 block">Precio total</span>
                  <span className="text-2xl font-black text-accent">{expansion.price}</span>
                </div>

                <button className="bg-main hover:bg-hover text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition duration-300 cursor-pointer">
                  Añadir al carrito 🛒
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExpansionDetail;