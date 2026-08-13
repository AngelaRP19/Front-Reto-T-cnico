function Card(props) {
  return (
    <div className="group bg-card-bg text-text rounded-[1.25rem] min-[2560px]:rounded-[2rem] min-[3840px]:rounded-[2.5rem] shadow-[0_0.375rem_1.125rem_rgba(0,0,0,0.6)] overflow-hidden w-full h-full max-w-none flex flex-col justify-between [transition:background-color_0.4s_ease,color_0.4s_ease,transform_0.3s_ease] hover:-translate-y-[0.375rem] min-[2560px]:hover:-translate-y-3">
      
      {/* Cambiamos h-[13.75rem] por aspect-square para que la imagen se vea COMPLETA */}
      <div className="w-full aspect-square overflow-hidden relative">
        <img
          className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
          src={props.image}
          alt={props.titulo}
        />
      </div>

      {/* Información de la tarjeta */}
      <div className="p-5 min-[2560px]:p-8 min-[3840px]:p-10 text-text flex flex-col justify-between grow">
        <div>
          <span className="inline-block text-main text-[0.75rem] min-[2560px]:text-xl min-[3840px]:text-2xl font-bold uppercase tracking-wider mb-1 min-[2560px]:mb-2">
            {props.plataforma}
          </span>
          <h3 className="text-xl min-[2560px]:text-[2.2rem] min-[3840px]:text-[3.1rem] font-extrabold mb-3 min-[2560px]:mb-5 text-text leading-tight">
            {props.titulo}
          </h3>
        </div>
        <p className="text-price text-[1.25rem] min-[2560px]:text-[2.2rem] min-[3840px]:text-[3rem] font-black">
          {props.precio}
        </p>
      </div>

    </div>
  );
}

export default Card;
