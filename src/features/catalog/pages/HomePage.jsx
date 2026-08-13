import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLingui } from "@lingui/react";
import Hero from "../../../components/layout/hero";
import Card from "../../../components/layout/card";
import PlatformSelector from "../../../components/PlatformSelector/PlatformSelector";
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
  const navigate = useNavigate();
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  // ✅ Estados necesarios
  const [selectedExpansionForPlatform, setSelectedExpansionForPlatform] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [user, setUser] = useState(null); // ajusta según tu lógica de autenticación

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
      setCartMessage(
        result?.message ||
          t("cart.addError", "No se pudo agregar el producto al carrito.")
      );
      return;
    }

    setCartMessage(
      t("cart.addSuccess", "Producto agregado correctamente al carrito.")
    );
  };

  return (
    <>
      <Hero onExploreClick={() => scrollToCatalogo("smooth")} />

      <section
        id="catalogo"
        className="w-full max-w-none ml-0 mr-auto my-[3.75rem] min-[2560px]:my-20 min-[3840px]:my-28 px-5 min-[2560px]:px-12 min-[3840px]:px-20 py-[1.875rem] min-[2560px]:py-14 min-[3840px]:py-20 md:p-[4.375rem] min-[2560px]:md:p-20 min-[3840px]:md:p-28 bg-bg transition-colors duration-400"
      >
        <h2 className="text-2xl sm:text-3xl min-[2560px]:text-5xl min-[3840px]:text-7xl font-extrabold text-text mb-6 min-[2560px]:mb-10">
          {t("navbar.catalog", "Catálogo")}
        </h2>

        {loading ? (
          <p className="text-text w-full text-center py-10 min-[2560px]:py-16 min-[3840px]:py-20 min-[2560px]:text-2xl min-[3840px]:text-4xl">Cargando catálogo...</p>
        ) : error ? (
          <p className="text-text w-full text-center py-10 min-[2560px]:py-16 min-[3840px]:py-20 min-[2560px]:text-2xl min-[3840px]:text-4xl">{error}</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(15.5rem,1fr))] gap-4 sm:gap-5 lg:gap-6 min-[2560px]:gap-8 min-[3840px]:gap-10 justify-items-stretch">
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

      <PlatformSelector
        expansionId={selectedExpansionForPlatform?.id}
        isOpen={Boolean(selectedExpansionForPlatform)}
        onClose={() => setSelectedExpansionForPlatform(null)}
        onSelectPlatform={handlePlatformSelected}
      />

      {cartMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 min-[2560px]:p-10 min-[3840px]:p-16">
          <div className="bg-card-bg rounded-2xl min-[2560px]:rounded-3xl p-6 min-[2560px]:p-10 min-[3840px]:p-14 w-full max-w-md min-[2560px]:max-w-3xl min-[3840px]:max-w-5xl shadow-xl">
            <h2 className="text-xl min-[2560px]:text-4xl min-[3840px]:text-5xl font-bold mb-3 min-[2560px]:mb-5 text-text">
              {t("cart.title", "Carrito")}
            </h2>
            <p className="text-text mb-6 min-[2560px]:mb-8 min-[2560px]:text-2xl min-[3840px]:text-4xl">{cartMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setCartMessage("")}
                className="bg-main hover:bg-hover text-white font-bold px-5 py-2 min-[2560px]:px-9 min-[2560px]:py-4 min-[2560px]:text-2xl min-[3840px]:px-12 min-[3840px]:py-5 min-[3840px]:text-3xl rounded-lg min-[2560px]:rounded-2xl transition duration-200"
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

