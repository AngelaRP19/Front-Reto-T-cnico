import React, { useState, useEffect } from "react";

function getYoutubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    return u.searchParams.get("v") || "";
  } catch {
    return "";
  }
}

function getYoutubeEmbedUrl(url) {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : url;
}

export const Carousel = ({ media = [], videoUrl = "" }) => {
  const videoId = getYoutubeId(videoUrl);
  const embedUrl = getYoutubeEmbedUrl(videoUrl);

  // Mapeamos los items: Si hay video, entra como primer slot
  const items = [
    ...(videoUrl ? [{ type: "video", url: embedUrl }] : []),
    ...media.map((img) => (typeof img === "string" ? { type: "image", url: img } : img)),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % items.length);

  // Autoplay (se pausa en videos)
  useEffect(() => {
    if (!items[currentIndex] || items[currentIndex].type === "video") return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 4500); // 4.5 segundos igual al Hero

    return () => clearInterval(timer);
  }, [currentIndex, items.length]);

  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-[42rem] mx-auto min-[2560px]:max-w-[64rem] min-[3840px]:max-w-[95rem] flex flex-col gap-[1rem] min-[2560px]:gap-[1.5rem] min-[3840px]:gap-[2.5rem]">
      
      {/* Visor principal con transición suave (CROSS-FADE) */}
      <div className="relative w-full aspect-video rounded-2xl min-[2560px]:rounded-3xl min-[3840px]:rounded-[2.5rem] overflow-hidden shadow-lg bg-black border border-snd-bg">
        
        {/* Renderizado en capas de todos los elementos para lograr la atenuación suave */}
        {items.map((item, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={item.url || index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {item.type === "video" ? (
                // Solo cargamos/reproducimos el iframe cuando el video está activo
                isActive && (
                  <iframe
                    src={item.url}
                    title="Tráiler de presentación"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                <img
                  src={item.url}
                  alt={`Captura ${index}`}
                  className={`w-full h-full object-cover transition-transform duration-1000 ease-in-out ${
                    isActive ? "scale-100" : "scale-105"
                  }`}
                />
              )}
            </div>
          );
        })}

        {/* Botones de navegación Anterior / Siguiente */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Anterior"
              className="absolute left-[0.5rem] sm:left-[0.75rem] min-[2560px]:left-[1.5rem] min-[3840px]:left-[2.5rem] top-1/2 -translate-y-1/2 w-[2rem] h-[2rem] sm:w-[2.25rem] sm:h-[2.25rem] min-[2560px]:w-[3.5rem] min-[2560px]:h-[3.5rem] min-[3840px]:w-[5.5rem] min-[3840px]:h-[5.5rem] rounded-full bg-black/50 hover:bg-black/80 text-white text-lg min-[2560px]:text-2xl min-[3840px]:text-4xl flex items-center justify-center transition z-20 cursor-pointer"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Siguiente"
              className="absolute right-[0.5rem] sm:right-[0.75rem] min-[2560px]:right-[1.5rem] min-[3840px]:right-[2.5rem] top-1/2 -translate-y-1/2 w-[2rem] h-[2rem] sm:w-[2.25rem] sm:h-[2.25rem] min-[2560px]:w-[3.5rem] min-[2560px]:h-[3.5rem] min-[3840px]:w-[5.5rem] min-[3840px]:h-[5.5rem] rounded-full bg-black/50 hover:bg-black/80 text-white text-lg min-[2560px]:text-2xl min-[3840px]:text-4xl flex items-center justify-center transition z-20 cursor-pointer"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      <div className="grid grid-cols-5 gap-[0.5rem] sm:gap-[0.75rem] min-[2560px]:gap-[1rem] min-[3840px]:gap-[1.75rem]">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            type="button"
            className={`relative aspect-video rounded-xl min-[2560px]:rounded-2xl min-[3840px]:rounded-3xl overflow-hidden border-[0.125rem] min-[2560px]:border-[0.25rem] min-[3840px]:border-[0.375rem] transition-all duration-300 cursor-pointer ${
              currentIndex === idx
                ? "border-main ring-2 min-[2560px]:ring-4 min-[3840px]:ring-8 ring-main/50 scale-95 opacity-100"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            {item.type === "video" ? (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center relative group">
                {videoId && (
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    alt="Vista previa vídeo"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-[1.5rem] h-[1.5rem] sm:w-[2rem] sm:h-[2rem] min-[2560px]:w-[3rem] min-[2560px]:h-[3rem] min-[3840px]:w-[4.5rem] min-[3840px]:h-[4.5rem] bg-red-600 rounded-lg min-[2560px]:rounded-xl min-[3840px]:rounded-2xl flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-[0.6rem] sm:text-xs min-[2560px]:text-lg min-[3840px]:text-2xl">▶</span>
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={item.url}
                alt={`Miniatura ${idx}`}
                className="w-full h-full object-cover"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};