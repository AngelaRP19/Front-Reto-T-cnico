function Hero({ onExploreClick }) {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between text-center lg:text-left gap-10 lg:gap-0 px-5 py-10 md:px-20 md:py-[60px] bg-snd-bg overflow-hidden transition-colors duration-[400ms]">
      <div className="w-full lg:w-auto lg:max-w-[400px]">
        <h2 className="text-[40px] md:text-[36px] text-text mb-[15px]">Expande tu mundo</h2>
        <p className="text-lg text-text mb-[25px]">Descubre los últimos packs de expansión para PC y Móvil.</p>
        
        {/* Le agregamos el onClick={onExploreClick} */}
        <button 
          onClick={onExploreClick}
          className="bg-accent text-[#111] border-none px-6 py-3 rounded-lg font-bold cursor-pointer transition-colors duration-300 hover:bg-hover"
        >
          Ver catálogo
        </button>
      </div>

      <div className="flex-1 w-full lg:w-auto flex justify-center items-center h-[220px] md:h-auto">
        <img
          className="w-full max-w-[600px] h-auto object-cover rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
          src="https://res.cloudinary.com/w1jl4sa5/image/upload/v1784588991/TS4_Royalty-and-Legacy_Sale-Hero_16x9-ES_mmadik.avif"
          alt="Imagen Hero"
        />
      </div>
    </section>
  );
}

export default Hero;
