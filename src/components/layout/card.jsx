function Card(props) {
  return (
    <div className="group bg-card-bg text-text rounded-[1.25rem] shadow-[0_0.375rem_1.125rem_rgba(0,0,0,0.6)] overflow-hidden w-full max-w-[21.875rem] flex flex-col justify-between [transition:background-color_0.4s_ease,color_0.4s_ease,transform_0.3s_ease] hover:-translate-y-[0.375rem]">
      
      {/* Cambiamos h-[13.75rem] por aspect-square para que la imagen se vea COMPLETA */}
      <div className="w-full aspect-square overflow-hidden relative">
        <img
          className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
          src={props.image}
          alt={props.titulo}
        />
      </div>

      {/* Información de la tarjeta */}
      <div className="p-5 text-text flex flex-col justify-between grow">
        <div>
          <span className="inline-block text-main text-[0.75rem] font-bold uppercase tracking-wider mb-1">
            {props.plataforma}
          </span>
          <h3 className="text-xl font-extrabold mb-3 text-text leading-tight">
            {props.titulo}
          </h3>
        </div>
        <p className="text-accent text-[1.25rem] font-black">
          {props.precio}
        </p>
      </div>

    </div>
  );
}

export default Card;
