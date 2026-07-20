function Hero() {
  return (
    <section className="hero">
      <div className="hero-info">
        <h2>Expande tu mundo</h2>
        <p>Descubre los últimos packs de expansión para PC y Móvil.</p>
        <button>Ver catálogo</button>
      </div>

      <div className="hero-image">
        <img 
          src="https://res.cloudinary.com/w1jl4sa5/image/upload/v1784588991/TS4_Royalty-and-Legacy_Sale-Hero_16x9-ES_mmadik.avif" 
          alt="Imagen Hero" 
        />
      </div>
    </section>
  );
}

export default Hero;
