import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLingui } from "@lingui/react";
import { useAuth } from "../../../context/AuthContext";
import Hero from "../../../components/layout/hero";
import Card from "../../../components/layout/card";
import PlatformSelector from "../../../components/PlatformSelector/PlatformSelector";
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
  const navigate = useNavigate();
  const { i18n } = useLingui();
  const { user } = useAuth();
  const [selectedExpansionForPlatform, setSelectedExpansionForPlatform] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const t = (id, message) => i18n._({ id, message });
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (location.hash === "#catalogo") {
      scrollToCatalogo("smooth");
    }
  }, [location.hash]);

  const handleOpenPlatformSelector = (expansion) => {
    if (!canAccessCart(user)) {
      navigate("/login");
      return;
    }

    setCartMessage("");
    setSelectedExpansionForPlatform(expansion);
  };

  const handlePlatformSelected = (platform) => {
    const result = addItem({
      id: selectedExpansionForPlatform.id,
      title: selectedExpansionForPlatform.title,
      price: selectedExpansionForPlatform.price,
      platform: platform.name,
      image: selectedExpansionForPlatform.image,
    });

    setSelectedExpansionForPlatform(null);

    if (!result?.success) {
      setCartMessage(result?.message || t("cart.addError", "No se pudo agregar el producto al carrito."));
      return;
    }

    setCartMessage(t("cart.addSuccess", "Producto agregado correctamente al carrito."));
  };

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
                  onClick={() => handleOpenPlatformSelector(pack)}
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

      <PlatformSelector
        expansionId={selectedExpansionForPlatform?.id}
        isOpen={Boolean(selectedExpansionForPlatform)}
        onClose={() => setSelectedExpansionForPlatform(null)}
        onSelectPlatform={handlePlatformSelected}
      />

      {cartMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-card-bg rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-3 text-text">{t("cart.title", "Carrito")}</h2>
            <p className="text-text mb-6">{cartMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setCartMessage("")}
                className="bg-main hover:bg-hover text-white font-bold px-5 py-2 rounded-lg transition duration-200"
              >
                {t("cart.close", "Cerrar")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;

