function getOptimizedImageUrl(url, width = 480) {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url;
  }

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width}/`
  );
}

function Card(props) {
  const optimizedImage = getOptimizedImageUrl(props.image, 480);

  return (
    <div className="group bg-card-bg text-text rounded-2xl min-[2560px]:rounded-[2rem] min-[3840px]:rounded-[2.5rem] shadow-lg overflow-hidden w-full h-full max-w-none flex flex-col [transition:background-color_0.4s_ease,color_0.4s_ease,transform_0.3s_ease] hover:-translate-y-[0.375rem] min-[2560px]:hover:-translate-y-3">

      {/* Imagen en formato cuadrado */}
      <div className="w-full aspect-square overflow-hidden relative">
        <img
          width={480}
          height={480}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-top block transition-transform duration-500 group-hover:scale-105"
          src={optimizedImage}
          alt={props.titulo}
        />
      </div>

      {/* Bloque de texto responsivo para 2 columnas en móvil */}
      <div className="p-3 sm:p-4 pt-2 sm:pt-3 pb-4 sm:pb-5 min-[2560px]:p-6 min-[3840px]:p-8 text-text flex flex-col gap-1 sm:gap-1.5">
        <div>
          <span className="inline-block text-main text-[0.65rem] sm:text-[0.7rem] min-[2560px]:text-[0.95rem] min-[3840px]:text-[1.2rem] font-bold uppercase tracking-wider mb-0.5">
            {props.plataforma}
          </span>
          <h3 className="text-sm sm:text-lg min-[2560px]:text-[1.6rem] min-[3840px]:text-[2.2rem] font-extrabold text-text leading-tight">
            {props.titulo}
          </h3>
        </div>
        
        <p className="text-price text-base sm:text-xl min-[2560px]:text-[1.7rem] min-[3840px]:text-[2.2rem] font-black mt-0.5 sm:mt-1">
          {props.precio}
        </p>
      </div>

    </div>
  );
}

export default Card;