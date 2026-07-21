import { useState } from "react";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Card from "./components/card";
import Footer from "./components/footer";
import Login from "./pages/Login";

import "./App.css";
import "./styles/navbar.css";
import "./styles/hero.css";
import "./styles/card.css";
import "./styles/footer.css";
import "./styles/responsive.css";

function App() {
  const [view, setView] = useState("home");

  if (view === "login") {
    return <Login onBack={() => setView("home")} />;
  }

  return (
    <>
      <Navbar onLoginClick={() => setView("login")} />

      <Hero />

      <section className="cards">

        <Card
          plataforma="PC"
          titulo="Naturaleza Encantada"
          precio="$79.900 COP"
          image="https://res.cloudinary.com/w1jl4sa5/image/upload/v1784572920/TS4_Pack-Art_Enchanted-by-Nature_ES_iv5fev.avif"
        />

        <Card
          plataforma="PC"
          titulo="Dinastías y Linajes"
          precio="$79.900 COP"
          image="https://res.cloudinary.com/w1jl4sa5/image/upload/v1784574803/TS4_Pack-Art_Royalty-and-Legacy_ES_zggtwv.avif"
        />

        <Card
          plataforma="PC"
          titulo="Rancho de Caballos"
          precio="$89.900 COP"
          image="https://res.cloudinary.com/w1jl4sa5/image/upload/v1784574889/TS4_Pack-Art_HorseRanch_ES_r2ddxj.avif"
        />

        <Card
          plataforma="PC"
          titulo="Vida en el Pueblo"
          precio="$69.900 COP"
          image="https://res.cloudinary.com/w1jl4sa5/image/upload/v1784574983/ES_Sims4-cottage-living-1x1-Loc_rp5yll.avif"
        />
        <Card
          plataforma="PC"
          titulo="Perros y Gatos"
          precio="$69.900 COP"
          image="https://res.cloudinary.com/w1jl4sa5/image/upload/v1784575067/ES_Sims4-cats-and-dogs-1x1-Loc_rw592n.avif"
        />

        <Card
          plataforma="PC"
          titulo="iA Trabajar"
          precio="$74.900 COP"
          image="https://res.cloudinary.com/w1jl4sa5/image/upload/v1784575123/ES_Sims4-get-to-work-1x1-Loc_saiuva.avif"
        />
      </section>

      <Footer />
    </>
  );
}

export default App;
