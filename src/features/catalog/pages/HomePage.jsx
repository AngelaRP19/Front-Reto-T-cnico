import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLingui } from "@lingui/react";
import { useAuth } from "../../../context/AuthContext";
import Hero from "../../../components/layout/hero";
import Card from "../../../components/layout/card";
import { useExpansionPacks } from "../hooks/useExpansionPacks";
import useCartStore from "../../../store/cartStore";
import { canAccessCart } from "../../../utils/cartAccess";

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
  const { user } = useAuth();
  const t = (id, message) => i18n._({ id, message });
  const addItem = useCartStore((state) => state.addItem);

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
        className="w-[90%] mx-auto my-[3.75rem] flex justify-center flex-wrap gap-[1.875rem] px-5 py-[1.875rem] md:p-[4.375rem] bg-bg transition-colors duration-400"
      >
        {loading ? (
          <p className="text-text w-full text-center py-10">Cargando catálogo...</p>
        ) : error ? (
          <p className="text-text w-full text-center py-10">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 justify-items-center">
          {packs.map((pack) => (
            <div key={pack.id} className="w-full">
              <Link to={`/catalogo/${pack.id}`} className="w-full cursor-pointer block">
                <Card
                  plataforma={pack.platform}
                  titulo={pack.title}
                  precio={pack.price}
                  image={pack.image}
                />
              </Link>
              {canAccessCart(user) ? (
                <button
                  onClick={() => addItem({ id: pack.id, title: pack.title, price: pack.price, platform: pack.platform, image: pack.image })}
                  className="mt-3 w-full bg-main hover:bg-hover text-white font-semibold py-2.5 rounded-2xl transition"
                >
                  {t("cart.add", "Añadir al carrito")}
                </button>
              ) : null}
            </div>
          ))}
          </div>
        )}
      </section>
    </>
  );
}

export default HomePage;

