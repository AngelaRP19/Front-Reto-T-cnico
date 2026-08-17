import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLingui } from "@lingui/react";
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
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

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
        className="w-full max-w-none ml-0 mr-auto my-[3.75rem] min-[2560px]:my-20 min-[3840px]:my-28 px-5 min-[2560px]:px-12 min-[3840px]:px-20 py-[1.875rem] min-[2560px]:py-14 min-[3840px]:py-20 md:p-[4.375rem] min-[2560px]:md:p-20 min-[3840px]:md:p-28 bg-bg transition-colors duration-400"
      >
        <h2 className="text-2xl sm:text-3xl min-[2560px]:text-4xl min-[3840px]:text-6xl font-extrabold text-text mb-6 min-[2560px]:mb-10">
          {t("navbar.catalog", "Catálogo")}
        </h2>

        {loading ? (
          <p className="text-text w-full text-center py-10 min-[2560px]:py-16 min-[3840px]:py-20 min-[2560px]:text-[1.7rem] min-[3840px]:text-[2.7rem]">{t("catalog.loading", "Cargando catálogo...")}</p>
        ) : error ? (
          <p className="text-text w-full text-center py-10 min-[2560px]:py-16 min-[3840px]:py-20 min-[2560px]:text-[1.7rem] min-[3840px]:text-[2.7rem]">{error}</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(14.5rem,1fr))] gap-4 sm:gap-5 lg:gap-6 min-[2560px]:gap-7 min-[3840px]:gap-8 justify-items-stretch">
            {packs.map((pack) => (
              <Link
                key={pack.id}
                to={`/catalogo/${pack.id}`}
                className="w-full h-full cursor-pointer block justify-self-stretch"
              >
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
    </>
  );
}

export default HomePage;

