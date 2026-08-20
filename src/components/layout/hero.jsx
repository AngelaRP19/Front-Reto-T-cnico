import { useState, useEffect } from "react";
import { useLingui } from "@lingui/react";
import { FaPlay, FaWindows, FaApple, FaPlaystation, FaXbox, FaSteam, FaTimes } from "react-icons/fa";
import { SiEpicgames } from "react-icons/si";

// Lista de banners de las distintas expansiones para el carrusel de presentación
const CAROUSEL_IMAGES = [
  "https://res.cloudinary.com/w1jl4sa5/image/upload/v1784588991/TS4_Royalty-and-Legacy_Sale-Hero_16x9-ES_mmadik.avif",
  "https://app-images.ea.com/ps9x41qn6x3c/4jQqRKOQr82DFC0Rf6gFtP/be4b9300949bf245953cda1b01b35f00/TS4_EP19_OFFICIAL_SCREENS_01_002_4K.png",
  "https://app-images.ea.com/ps9x41qn6x3c/6ujmPzHzNhiYB5M6v0TG98/6014af15ee566150ca71dd82e806e09a/TS4_EP14_OFFICIAL_SCREENS_01_002_16x9.jpg",
  "https://app-images.ea.com/ps9x41qn6x3c/1zIjjgvyPVyIvDjb25EE8b/a8c2a81bfc6f21679c31f9a59dd8fc2e/the-sims-4-cottage-living-4.jpg"
];

// Contenido general de la plataforma
const HERO_CONTENT = {
  es: {
    badge: "Colección Oficial de Packs",
    title: "Descubre nuevas vidas y mundos infinitos",
    desc: "Explora la colección completa de packs de expansión de Los Sims™ 4. Desde reinos de fantasía y dinastías reales hasta la vida campestre y profesiones únicas. ¡Transforma el universo de tus Sims!",
    btnExplore: "Explorar catálogo",
    btnTrailer: "Ver tráiler",
    platforms: "Disponible para:",
    trailerEmbedUrl: "https://www.youtube.com/embed/5LaIogTLPYA?autoplay=1"
  },
  en: {
    badge: "Official Pack Collection",
    title: "Discover new lives & endless worlds",
    desc: "Explore the full lineup of The Sims™ 4 expansion packs. From fantasy realms and royal dynasties to cozy cottage life and unique careers. Transform your Sims' universe today!",
    btnExplore: "Explore Catalog",
    btnTrailer: "Watch Trailer",
    platforms: "Available on:",
    trailerEmbedUrl: "https://www.youtube.com/embed/5LaIogTLPYA?autoplay=1"
  },
  fr: {
    badge: "Collection Officielle de Packs",
    title: "Découvrez de nouvelles vies & des mondes infinis",
    desc: "Explorez toute la gamme des packs d'extension Les Sims™ 4. Des royaumes de fantaisie aux dynasties royales, en passant par la vie à la campagne. Transformez l'univers de vos Sims !",
    btnExplore: "Explorer le catalogue",
    btnTrailer: "Voir la bande-annonce",
    platforms: "Disponible sur :",
    trailerEmbedUrl: "https://www.youtube.com/embed/5LaIogTLPYA?autoplay=1"
  }
};

function Hero({ onExploreClick }) {
  const { i18n } = useLingui();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const currentLang = (i18n?.locale || "es").toLowerCase().slice(0, 2);
  const content = HERO_CONTENT[currentLang] || HERO_CONTENT.es;

  // Cambia la imagen del carrusel automáticamente cada 4.5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_IMAGES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section key={i18n.locale} className="relative w-full bg-snd-bg px-[1.25rem] py-[3rem] md:px-[5rem] md:py-[5rem] min-[2560px]:px-[8rem] min-[2560px]:py-[8rem] min-[3840px]:px-[12rem] min-[3840px]:py-[12rem] overflow-hidden transition-colors duration-500">
      
      {/* Luz / Glows de ambiente de fondo */}
      <div className="absolute -top-[6rem] -left-[6rem] w-[24rem] h-[24rem] min-[2560px]:w-[40rem] min-[2560px]:h-[40rem] min-[3840px]:w-[60rem] min-[3840px]:h-[60rem] bg-accent/20 rounded-full blur-[8.125rem] pointer-events-none" />
      <div className="absolute -bottom-[6rem] -right-[6rem] w-[24rem] h-[24rem] min-[2560px]:w-[40rem] min-[2560px]:h-[40rem] min-[3840px]:w-[60rem] min-[3840px]:h-[60rem] bg-emerald-500/10 rounded-full blur-[8.125rem] pointer-events-none" />

      <div className="relative max-w-[87.5rem] min-[2560px]:max-w-[120rem] min-[3840px]:max-w-[170rem] mx-auto flex flex-col lg:flex-row items-center justify-between gap-[3rem] min-[2560px]:gap-[5rem] min-[3840px]:gap-[8rem]">
        
        {/* Columna Izquierda: Presentación General */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-20">
          
          {/* Badge Decorativo */}
          <span className="inline-flex items-center gap-[0.5rem] min-[2560px]:gap-[0.75rem] min-[3840px]:gap-[1rem] bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 text-accent font-black text-[0.75rem] md:text-[0.875rem] min-[2560px]:text-[1.25rem] min-[3840px]:text-[2rem] uppercase tracking-widest px-[1rem] py-[0.375rem] min-[2560px]:px-[1.5rem] min-[2560px]:py-[0.625rem] min-[3840px]:px-[2.5rem] min-[3840px]:py-[1rem] rounded-full mb-[1.25rem] min-[2560px]:mb-[2rem] min-[3840px]:mb-[3rem] shadow-sm">
            {content.badge}
          </span>

          {/* Título Principal */}
          <h1 className="text-[2.25rem] sm:text-[3rem] lg:text-[3.75rem] min-[2560px]:text-[5.5rem] min-[3840px]:text-[8rem] font-black text-text mb-[1.25rem] min-[2560px]:mb-[2rem] min-[3840px]:mb-[3rem] leading-[1.15] tracking-tight">
            {content.title}
          </h1> 
          
          {/* Subtítulo de Presentación */}
          <p className="text-[1rem] sm:text-[1.125rem] min-[2560px]:text-[1.75rem] min-[3840px]:text-[2.5rem] text-text/80 mb-[2rem] min-[2560px]:mb-[3rem] min-[3840px]:mb-[4.5rem] max-w-[36rem] min-[2560px]:max-w-[55rem] min-[3840px]:max-w-[80rem] leading-relaxed font-medium">
            {content.desc}
          </p>

          {/* Botones de Acción */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-[1rem] min-[2560px]:gap-[1.75rem] min-[3840px]:gap-[2.5rem] mb-[2.5rem] min-[2560px]:mb-[4rem] min-[3840px]:mb-[6rem] w-full">
            <button
              onClick={onExploreClick}
              className="bg-accent text-text px-[2rem] py-[1rem] min-[2560px]:px-[3rem] min-[2560px]:py-[1.5rem] min-[3840px]:px-[4.5rem] min-[3840px]:py-[2.25rem] rounded-xl min-[2560px]:rounded-2xl min-[3840px]:rounded-3xl font-black cursor-pointer transition-all duration-300 hover:bg-hover hover:scale-105 active:scale-95 shadow-lg shadow-accent/20 text-[1rem] min-[2560px]:text-[1.5rem] min-[3840px]:text-[2.25rem]"
            >
              {content.btnExplore}
            </button>

            <button
              onClick={() => setIsVideoOpen(true)}
              className="group flex items-center gap-[0.75rem] min-[2560px]:gap-[1.25rem] min-[3840px]:gap-[1.75rem] bg-card-bg/80 border-[0.125rem] border-text/15 text-text px-[1.75rem] py-[0.875rem] min-[2560px]:px-[2.75rem] min-[2560px]:py-[1.375rem] min-[3840px]:px-[4rem] min-[3840px]:py-[2rem] rounded-xl min-[2560px]:rounded-2xl min-[3840px]:rounded-3xl font-bold transition-all duration-300 hover:border-accent hover:bg-card-bg hover:scale-105 active:scale-95 text-[1rem] min-[2560px]:text-[1.5rem] min-[3840px]:text-[2.25rem] cursor-pointer"
            >
              <div className="w-[1.75rem] h-[1.75rem] min-[2560px]:w-[2.75rem] min-[2560px]:h-[2.75rem] min-[3840px]:w-[4rem] min-[3840px]:h-[4rem] rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                <FaPlay className="text-[0.75rem] min-[2560px]:text-[1.25rem] min-[3840px]:text-[1.75rem] text-accent group-hover:text-text" />
              </div>
              {content.btnTrailer}
            </button>
          </div>

          {/* Iconos de Plataformas */}
          <div className="pt-[1.5rem] min-[2560px]:pt-[2.5rem] min-[3840px]:pt-[3.5rem] border-t border-text/10 w-full flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-[1rem] min-[2560px]:gap-[1.5rem] min-[3840px]:gap-[2.5rem] text-[0.75rem] sm:text-[0.875rem] min-[2560px]:text-[1.375rem] min-[3840px]:text-[2rem] text-text/70">
            <span className="font-bold text-text/90 tracking-wide">
              {content.platforms}
            </span>
            <div className="flex items-center gap-[1.25rem] min-[2560px]:gap-[2rem] min-[3840px]:gap-[3rem] text-[1.5rem] min-[2560px]:text-[2.5rem] min-[3840px]:text-[3.75rem] text-text/70">
              <FaWindows title="Windows" className="hover:text-accent transition-colors cursor-pointer" />
              <FaApple title="macOS" className="hover:text-accent transition-colors cursor-pointer" />
              <FaPlaystation title="PlayStation" className="hover:text-accent transition-colors cursor-pointer" />
              <FaXbox title="Xbox" className="hover:text-accent transition-colors cursor-pointer" />
              <FaSteam title="Steam" className="hover:text-accent transition-colors cursor-pointer" />
              <SiEpicgames title="Epic Games" className="hover:text-accent transition-colors cursor-pointer" />
            </div>
          </div>

        </div>

        {/* Columna Derecha: Carrusel */}
        <div className="w-full lg:w-1/2 flex justify-center items-center z-10">
          <div className="relative w-full max-w-[42rem] min-[2560px]:max-w-[64rem] min-[3840px]:max-w-[95rem] aspect-[16/10] rounded-3xl min-[2560px]:rounded-[2.5rem] min-[3840px]:rounded-[3.5rem] overflow-hidden shadow-[0_1.25rem_3.125rem_rgba(0,0,0,0.3)] border border-text/10">
            
            {/* Imágenes del Carrusel con Cross-Fade */}
            {CAROUSEL_IMAGES.map((imgUrl, index) => (
              <img
                key={imgUrl}
                src={imgUrl}
                alt={`Pack Preview ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  index === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
              />
            ))}

            <div className="absolute bottom-[1rem] right-[1.5rem] min-[2560px]:bottom-[1.75rem] min-[2560px]:right-[2.5rem] min-[3840px]:bottom-[2.5rem] min-[3840px]:right-[3.5rem] flex items-center gap-[0.5rem] min-[2560px]:gap-[0.75rem] min-[3840px]:gap-[1.25rem] z-20">
              {CAROUSEL_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-[0.5rem] min-[2560px]:h-[0.75rem] min-[3840px]:h-[1.25rem] rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentImageIndex 
                      ? "w-[1.75rem] min-[2560px]:w-[2.75rem] min-[3840px]:w-[4.5rem] bg-accent" 
                      : "w-[0.5rem] min-[2560px]:w-[0.75rem] min-[3840px]:w-[1.25rem] bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Ir a la imagen ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Modal flotante (Reproductor del tráiler general) */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-[1rem] md:p-[2.5rem] min-[3840px]:p-[5rem] animate-fade-in">
          <div className="relative w-full max-w-[56rem] min-[2560px]:max-w-[90rem] min-[3840px]:max-w-[130rem] bg-black rounded-2xl min-[2560px]:rounded-3xl min-[3840px]:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
            
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-[1rem] right-[1rem] min-[2560px]:top-[1.5rem] min-[2560px]:right-[1.5rem] min-[3840px]:top-[2.5rem] min-[3840px]:right-[2.5rem] z-10 w-[2.5rem] h-[2.5rem] min-[2560px]:w-[4rem] min-[2560px]:h-[4rem] min-[3840px]:w-[6rem] min-[3840px]:h-[6rem] rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <FaTimes className="text-[1.125rem] min-[2560px]:text-[2rem] min-[3840px]:text-[3rem]" />
            </button>

            <div className="relative w-full pt-[56.25%]">
              <iframe
                className="absolute inset-0 w-full h-full border-0"
                src={content.trailerEmbedUrl}
                title="Tráiler General Los Sims 4"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

export default Hero;