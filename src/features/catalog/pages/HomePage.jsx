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
    <main>
      <Hero onExploreClick={() => scrollToCatalogo("smooth")} />

      <section
        id="catalogo"
        className="w-[90%] mx-auto my-[3.75rem] flex justify-center flex-wrap gap-[1.875rem] px-5 py-[1.875rem] md:p-[4.375rem] bg-bg transition-colors duration-400"
      >
        {loading ? (
          <p className="text-text w-full text-center py-10">Cargando catálogo...</p>
        ) : error ? (
          <p className="text-text w-full text-center py-10">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 justify-items-center">
          {packs.map((pack) => (
            <Link key={pack.id} to={`/catalogo/${pack.id}`} className="w-full cursor-pointer block">
              <Card
                plataforma={pack.platform}
                titulo={pack.title}
                precio={pack.price}
                image={pack.image}
              />
            </Link>
          ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default HomePage;

