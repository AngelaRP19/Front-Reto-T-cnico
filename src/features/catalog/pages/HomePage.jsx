import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Hero from "../../../components/layout/hero";
import Card from "../../../components/layout/card";
import { useExpansionPacks } from "../hooks/useExpansionPacks";

function scrollToCatalogo(behavior) {
  const catalogSection = document.getElementById("catalogo");
  if (catalogSection) {
    catalogSection.scrollIntoView({ behavior, block: "start" });
  }
}

function HomePage() {
  const { packs, loading, error } = useExpansionPacks();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#catalogo") {
      scrollToCatalogo("smooth");
    }
  }, [location.hash]);

  return (
    <>
      <Hero onExploreClick={() => scrollToCatalogo("smooth")} />

      <section
        id="catalogo"
        className="w-[90%] mx-auto my-[60px] flex justify-center flex-wrap gap-[30px] px-5 py-[30px] md:p-[70px] bg-bg transition-colors duration-400"
      >
        {loading ? (
          <p className="text-text w-full text-center py-10">Cargando catálogo...</p>
        ) : error ? (
          <p className="text-text w-full text-center py-10">{error}</p>
        ) : (
          packs.map((pack) => (
            <Link key={pack.id} to={`/catalogo/${pack.id}`} className="cursor-pointer">
              <Card
                plataforma={pack.platform}
                titulo={pack.title}
                precio={pack.price}
                image={pack.image}
              />
            </Link>
          ))
        )}
      </section>
    </>
  );
}

export default HomePage;
