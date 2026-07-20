import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Card from "./components/card";
import Footer from "./components/footer";

import "./app.css";
import "./styles/navbar.css";
import "./styles/hero.css";
import "./styles/card.css";
import "./styles/footer.css";
import "./styles/responsive.css";

function App() {
  return (
    <>
      <Navbar />

      <Hero />

      <section className="cards">

        <Card
          plataforma="PC"
          titulo="Vida Urbana"
          precio="$79.900 COP"
        />

        <Card
          plataforma="PC"
          titulo="Vida Urbana"
          precio="$79.900 COP"
        />

        <Card
          plataforma="PC"
          titulo="Aventura Costera"
          precio="$89.900 COP"
        />

        <Card
          plataforma="PC"
          titulo="Estudio Creativo"
          precio="$69.900 COP"
        />

        <Card
          plataforma="PC"
          titulo="Fiesta Nocturna"
          precio="$74.900 COP"
        />
      </section>

      <Footer />
    </>
  );
}

export default App;
