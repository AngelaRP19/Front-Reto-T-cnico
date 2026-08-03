function Hero({ onExploreClick }) {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between text-center lg:text-left gap-8 lg:gap-12 px-4 py-10 sm:px-8 md:px-12 lg:px-20 lg:py-16 bg-snd-bg overflow-hidden transition-colors duration-[400ms]">
      <div className="w-full lg:w-2/5 lg:max-w-[440px]">
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-text mb-4">Expande tu mundo</h2>
        <p className="text-lg text-text mb-[25px]">Descubre los últimos packs de expansión para PC y Móvil.</p>
        
        {/* Le agregamos el onClick={onExploreClick} */}
        <button 
          onClick={onExploreClick}
          className="bg-accent text-[#111] border-none px-6 py-3 rounded-lg font-bold cursor-pointer transition-colors duration-300 hover:bg-hover"
        >
          Ver catálogo
        </button>
      </div>

      <div className="flex-1 w-full lg:w-3/5 flex justify-center items-center">
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
