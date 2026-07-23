import { useState, useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/layout/Hero";
import Card from "./components/layout/Card";
import Footer from "./components/layout/Footer";
import Login from "./pages/Login";
import ExpansionDetail from "./components/ExpansionDetail";

function App() {
  const [view, setView] = useState("home");
  const [selectedPack, setSelectedPack] = useState(null);
  const [returnToCatalog, setReturnToCatalog] = useState(false);

  // 1. Pack Naturaleza Encantada
  const packNaturaleza = {
    title: "The Sims™ 4: Naturaleza Encantada",
    category: "PACK DE EXPANSIÓN",
    price: "$79.900 COP",
    platform: "PC / Mac / Consolas",
    releaseDate: "Lanzamiento Reciente",
    description: "¡Conéctate con la magia del bosque y la vida silvestre! Descubre criaturas místicas, aprende herbalismo, construye refugios sostenibles y domina el arte de la botánica mística en entornos naturales impresionantes.",
    features: [
      "Nuevo mundo explorable: Arboleda de las Hadas.",
      "Habilidad especial: Herbalismo y Magia Natural.",
      "Criaturas mágicas y duendes de bosque interactivos.",
      "Muebles de madera rústica y vestuario de espíritu libre."
    ],
    image: "https://res.cloudinary.com/w1jl4sa5/image/upload/v1784572920/TS4_Pack-Art_Enchanted-by-Nature_ES_iv5fev.avif"
  };

  // 2. Pack Dinastías y Linajes
  const packDinastias = {
    title: "The Sims™ 4: Dinastías y Linajes",
    category: "PACK DE EXPANSIÓN",
    price: "$79.900 COP",
    platform: "PC / Mac / Consolas",
    releaseDate: "Lanzamiento Reciente",
    description: "Crea reinos prósperos, define la herencia de tus familias reales y domina el arte del protocolo o la intriga palaciega. En este pack podrás construir castillos majestuosos, organizar banquetes suntuosos y guiar el destino de tu linaje a través de las generaciones.",
    features: [
      "Mundo exclusivo: La Región de Ciudad Real.",
      "Mecánicas de corte, títulos de nobleza y árboles genealógicos avanzados.",
      "Muebles de construcción medieval y vestuario de gala suntuoso.",
      "Nuevas aspiraciones: Monarca Justo o Maquiavélico."
    ],
    image: "https://res.cloudinary.com/w1jl4sa5/image/upload/v1784574803/TS4_Pack-Art_Royalty-and-Legacy_ES_zggtwv.avif"
  };

  // 3. Pack Rancho de Caballos
  const packCaballos = {
    title: "The Sims™ 4: Rancho de Caballos",
    category: "PACK DE EXPANSIÓN",
    price: "$89.900 COP",
    platform: "PC / Mac / Consolas",
    releaseDate: "Lanzamiento Reciente",
    description: "¡Forma parte de la comunidad de Chestnut Ridge y crea tu propio estilo de vida ecuestre! Cuida, entrena y entabla vínculos con majestuosos caballos, personaliza tu rancho y vive la experiencia del campo.",
    features: [
      "Mundo explorable: Chestnut Ridge.",
      "Cuidado, entrenamiento y crianza de caballos.",
      "Fabricación de néctar y baile en línea.",
      "Nuevos animales: Mini cabras y mini ovejas."
    ],
    image: "https://res.cloudinary.com/w1jl4sa5/image/upload/v1784574889/TS4_Pack-Art_HorseRanch_ES_r2ddxj.avif"
  };

  // 4. Pack Vida en el Pueblo
  const packVida = {
    title: "The Sims™ 4: Vida en el Pueblo",
    category: "PACK DE EXPANSIÓN",
    price: "$69.900 COP",
    platform: "PC / Mac / Consolas",
    releaseDate: "Lanzamiento Reciente",
    description: "Disfruta de la vida rural creando una granja, cuidando animales y explorando un encantador pueblo en Henford-on-Bagley. Cultiva productos frescos, cría animales y participa en las tradicionales ferias del pueblo.",
    features: [
      "Descubre la vida rural en Henford-on-Bagley.",
      "Cultiva, cría animales, participa en ferias y disfruta de una comunidad llena de tradiciones.",
      "Aleja a tus Sims del bullicio de la ciudad y llévalos al campo. ¡Construye una granja!",
      "Completa actividades diarias y disfruta de las tradicionales ferias rurales."
    ],
    image: "https://res.cloudinary.com/w1jl4sa5/image/upload/v1784574983/ES_Sims4-cottage-living-1x1-Loc_rp5yll.avif"
  };

  // 5. Pack Perros y Gatos
  const packAnimales = {
    title: "The Sims™ 4: Perros y Gatos",
    category: "PACK DE EXPANSIÓN",
    price: "$69.900 COP",
    platform: "PC / Mac / Consolas",
    releaseDate: "Lanzamiento Reciente",
    description: "Haz crecer tu familia con adorables mascotas y vive aventuras inolvidables junto a ellas en el hermoso mundo costero de Brindleton Bay.",
    features: [
      "Abre tu propia clínica veterinaria y dedica tu vida al cuidado de las mascotas.",
      "Cuida, entrena y juega con perros y gatos mientras fortaleces el vínculo con tus Sims.",
      "Personaliza mascotas únicas y acompaña a tus Sims en una aventura llena de cariño y compañía.",
      "Adopta perros y gatos, cuídalos con cariño y crea un hogar lleno de amor y diversión."
    ],
    image: "https://res.cloudinary.com/w1jl4sa5/image/upload/v1784575067/ES_Sims4-cats-and-dogs-1x1-Loc_rw592n.avif"
  };

  // 6. Pack ¡A Trabajar!
  const packAtrabajar = {
    title: "The Sims™ 4: ¡A Trabajar!",
    category: "PACK DE EXPANSIÓN",
    price: "$74.900 COP",
    platform: "PC / Mac / Consolas",
    releaseDate: "Lanzamiento Reciente",
    description: "Acompaña a tus Sims al trabajo y descubre profesiones llenas de desafíos, diversión y la oportunidad de crear tu propio negocio.",
    features: [
      "Controla cada jornada laboral y construye una carrera llena de éxito y nuevas oportunidades.",
      "Explora nuevas profesiones y decide el futuro laboral de tus Sims en cada jornada.",
      "Conviértete en médico, detective o científico y vive emocionantes aventuras profesionales.",
      "¡Abre tu propio negocio y haz crecer un imperio con tus habilidades emprendedoras!"
    ],
    image: "https://res.cloudinary.com/w1jl4sa5/image/upload/v1784575123/ES_Sims4-get-to-work-1x1-Loc_saiuva.avif"
  };

  const handleSelectPack = (packData) => {
    setSelectedPack(packData);
    setView("expansion");
  };

  const handleBackToCatalog = () => {
    setReturnToCatalog(true);
    setView("home");
  };

  // Posicionamiento inmediato al volver del detalle
  useEffect(() => {
    if (view === "home" && returnToCatalog) {
      const catalogSection = document.getElementById("catalogo");
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: "auto", block: "start" });
      }
      setReturnToCatalog(false);
    }
  }, [view, returnToCatalog]);

  if (view === "login") {
    return <Login onBack={() => setView("home")} />;
  }

  if (view === "expansion") {
    return (
      <>
        <Navbar onLoginClick={() => setView("login")} />
        <ExpansionDetail data={selectedPack} onBack={handleBackToCatalog} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar onLoginClick={() => setView("login")} />

      {/* Función para el botón 'Ver catálogo' */}
      <Hero onExploreClick={() => {
        const catalogSection = document.getElementById("catalogo");
        if (catalogSection) {
          catalogSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }} />

      <section id="catalogo" className="w-[90%] mx-auto my-[60px] flex justify-center flex-wrap gap-[30px] px-5 py-[30px] md:p-[70px] bg-bg transition-colors duration-400">

        {/* 1. Naturaleza Encantada */}
        <div onClick={() => handleSelectPack(packNaturaleza)} className="cursor-pointer">
          <Card
            plataforma="PC / Mac / Consolas"
            titulo="Naturaleza Encantada"
            precio="$79.900 COP"
            image={packNaturaleza.image}
          />
        </div>

        {/* 2. Dinastías y Linajes */}
        <div onClick={() => handleSelectPack(packDinastias)} className="cursor-pointer">
          <Card
            plataforma="PC / Mac / Consolas"
            titulo="Dinastías y Linajes"
            precio="$79.900 COP"
            image={packDinastias.image}
          />
        </div>

        {/* 3. Rancho de Caballos */}
        <div onClick={() => handleSelectPack(packCaballos)} className="cursor-pointer">
          <Card
            plataforma="PC / Mac / Consolas"
            titulo="Rancho de Caballos"
            precio="$89.900 COP"
            image={packCaballos.image}
          />
        </div>

        {/* 4. Vida en el Pueblo */}
        <div onClick={() => handleSelectPack(packVida)} className="cursor-pointer">
          <Card
            plataforma="PC / Mac / Consolas"
            titulo="Vida en el Pueblo"
            precio="$69.900 COP"
            image={packVida.image}
          />
        </div>

        {/* 5. Perros y Gatos */}
        <div onClick={() => handleSelectPack(packAnimales)} className="cursor-pointer">
          <Card
            plataforma="PC / Mac / Consolas"
            titulo="Perros y Gatos"
            precio="$69.900 COP"
            image={packAnimales.image}
          />
        </div>

        {/* 6. ¡A Trabajar! */}
        <div onClick={() => handleSelectPack(packAtrabajar)} className="cursor-pointer">
          <Card
            plataforma="PC / Mac / Consolas"
            titulo="¡A Trabajar!"
            precio="$74.900 COP"
            image={packAtrabajar.image}
          />
        </div>

      </section>

      <Footer />
    </>
  );
}

export default App;