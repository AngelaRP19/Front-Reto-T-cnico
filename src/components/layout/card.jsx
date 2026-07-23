function Card(props) {
  return (
    <div className="group bg-card-bg text-text rounded-[20px] shadow-[0_6px_18px_rgba(0,0,0,0.6)] overflow-hidden w-full max-w-[350px] md:w-[300px] md:max-w-none h-[420px] flex flex-col justify-between [transition:background-color_0.4s_ease,color_0.4s_ease,transform_0.3s_ease] hover:-translate-y-[6px]">
      <div className="w-full h-[240px] overflow-hidden">
        <img
          className="w-full h-full object-cover block rounded-t-[20px] transition-transform duration-400 group-hover:scale-[1.08]"
          src={props.image}
          alt={props.titulo}
        />
      </div>

      <div className="p-[18px] text-text flex flex-col justify-between grow">
        <span className="inline-block text-main px-2.5 py-1 rounded-lg text-[13px] mb-2.5">{props.plataforma}</span>
        <h3 className="text-2xl mb-3 text-text">{props.titulo}</h3>
        <p className="text-accent text-[22px] font-bold">{props.precio}</p>
      </div>
    </div>
  );
}

export default Card;
