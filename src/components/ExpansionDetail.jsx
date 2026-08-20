import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLingui } from "@lingui/react";
import { useAuth } from "../context/AuthContext";
import useCartStore from "../store/cartStore";
import { canAccessCart } from "../utils/cartAccess";
import PlatformSelector from "./PlatformSelector/PlatformSelector";
import { getPlatforms } from "../features/catalog/services/platformsService";
import { getMyPurchases } from "../features/profile/services/purchasesService";
import { Carousel } from "./Carousel";

const ExpansionDetail = ({ data: expansion, onBack }) => {
  const { i18n } = useLingui();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showPlatformSelector, setShowPlatformSelector] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const addItem = useCartStore((state) => state.addItem);

  const t = (id, message, values) => i18n._({ id, message, values });

  const handleOpenPlatformSelector = () => {
    if (!canAccessCart(user)) {
      navigate("/login");
      return;
    }

    setShowPlatformSelector(true);
  };

  const handlePlatformSelected = async (platform) => {
    let matched;
    try {
      const allPlatforms = await getPlatforms();
      matched = allPlatforms.find(
        (p) => p.name.toLowerCase() === platform.name.toLowerCase()
      );
    } catch {
      matched = undefined;
    }

    try {
      const purchases = await getMyPurchases();
      const alreadyPurchased = (purchases || []).some((purchase) =>
        purchase.items?.some(
          (purchasedItem) =>
            purchasedItem.expansionPack?.id === expansion.id &&
            purchasedItem.platform?.name?.toLowerCase() === platform.name.toLowerCase()
        )
      );

      if (alreadyPurchased) {
        setShowPlatformSelector(false);
        setCartMessage(
          t("cart.duplicateItem", 'Ya tienes "{title}" para la plataforma {platform}.', {
            title: expansion.title,
            platform: platform.name,
          })
        );
        return;
      }
    } catch {
      // Si falla la consulta de compras, se continúa con la validación del carrito.
    }

    const result = addItem({
      id: expansion.id,
      title: expansion.title,
      price: expansion.price,
      platform: platform.name,
      platformId: matched?.id,
      image: expansion.image,
    });

    setShowPlatformSelector(false);
    setCartMessage(result.message);
  };

  return (
    <>
      <div className="min-h-screen bg-bg text-text py-6 sm:py-10 min-[2560px]:py-16 min-[3840px]:py-24 px-4 sm:px-6 lg:px-8 min-[2560px]:px-14 min-[3840px]:px-20 transition-colors duration-400">
        <div className="max-w-5xl min-[2560px]:max-w-[96rem] min-[3840px]:max-w-[130rem] mx-auto">

          {/* =========================================
              BOTÓN REGRESAR
              ========================================= */}
          <button
            onClick={onBack}
            className="mb-6 min-[2560px]:mb-10 min-[3840px]:mb-14 flex items-center gap-2 min-[2560px]:gap-4 min-[3840px]:gap-6 text-sm min-[2560px]:text-2xl min-[3840px]:text-4xl font-bold text-main hover:text-hover transition duration-200 cursor-pointer"
          >
            ← {t("catalog.back", "Volver al catálogo")}
          </button>

          {/* =========================================
              TARJETA PRINCIPAL
              ========================================= */}
          <div className="bg-card-bg rounded-3xl min-[2560px]:rounded-[2.5rem] min-[3840px]:rounded-[3.5rem] shadow-xl overflow-hidden border border-snd-bg transition-colors duration-400">

            <div className="md:flex">

              {/* =====================================
                  IMAGEN PORTADA
                  ===================================== */}
              <div className="md:w-1/2 bg-card-bg p-4 sm:p-6 min-[2560px]:p-10 min-[3840px]:p-14 flex items-center justify-center relative group transition-colors duration-400">

                <span className="absolute top-6 left-6 min-[2560px]:top-10 min-[2560px]:left-10 min-[3840px]:top-14 min-[3840px]:left-14 bg-accent text-text text-xs min-[2560px]:text-xl min-[3840px]:text-3xl font-bold px-3 py-1 min-[2560px]:px-5 min-[2560px]:py-2 min-[3840px]:px-8 min-[3840px]:py-3 rounded-full uppercase tracking-wider z-10 transition-opacity duration-200 ease-in-out group-hover:opacity-0 pointer-events-none">
                  {expansion.category}
                </span>

                {/* Envoltorio con overflow-hidden y rounded */}
                <div className="w-full h-auto max-h-[26rem] min-[2560px]:max-h-[42rem] min-[3840px]:max-h-[58rem] rounded-2xl min-[2560px]:rounded-3xl min-[3840px]:rounded-[2.5rem] overflow-hidden shadow-md">
                  <img
                    src={expansion.image}
                    alt={expansion.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                  />
                </div>
              </div>

              {/* =====================================
                  INFORMACIÓN DEL PACK
                  ===================================== */}
              <div className="md:w-1/2 p-5 sm:p-8 min-[2560px]:p-12 min-[3840px]:p-16 flex flex-col justify-between">

                <div>

                  {/* Título */}
                  <h1 className="text-3xl min-[2560px]:text-5xl min-[3840px]:text-7xl font-extrabold text-text mb-2 min-[2560px]:mb-4 min-[3840px]:mb-6 transition-colors duration-400">
                    {expansion.title}
                  </h1>

                  {/* Plataforma y fecha */}
                  <div className="flex items-center gap-3 min-[2560px]:gap-5 min-[3840px]:gap-7 mb-4 min-[2560px]:mb-6 min-[3840px]:mb-8 text-xs min-[2560px]:text-xl min-[3840px]:text-3xl font-medium text-text opacity-60">

                    <span className="bg-snd-bg text-main px-2.5 py-1 min-[2560px]:px-4 min-[2560px]:py-2 min-[3840px]:px-6 min-[3840px]:py-3 rounded-md min-[2560px]:rounded-xl">
                      {expansion.platform}
                    </span>

                    <span>
                      • {expansion.releaseDate}
                    </span>

                  </div>

                  {/* Descripción */}
                  <p className="text-text mb-6 min-[2560px]:mb-10 min-[3840px]:mb-14 text-sm min-[2560px]:text-2xl min-[3840px]:text-4xl leading-relaxed transition-colors duration-400">
                    {expansion.description}
                  </p>

                  {/* Incluye */}
                  <h3 className="text-base min-[2560px]:text-2xl min-[3840px]:text-4xl font-bold text-text mb-3 min-[2560px]:mb-6 min-[3840px]:mb-8 border-b border-snd-bg pb-2 min-[2560px]:pb-4 transition-colors duration-400">
                    {t(
                      "catalog.includes",
                      "¿Qué incluye este pack?"
                    )}
                  </h3>

                  <ul className="space-y-2 min-[2560px]:space-y-4 min-[3840px]:space-y-6 mb-6 min-[2560px]:mb-10 min-[3840px]:mb-12 text-sm min-[2560px]:text-2xl min-[3840px]:text-3xl text-text">

                    {expansion.features?.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 min-[2560px]:gap-4 min-[3840px]:gap-5"
                      >
                        <span className="text-accent-text font-bold">
                          ✓
                        </span>

                        <span>
                          {feature}
                        </span>
                      </li>
                    ))}

                  </ul>

                </div>

                {/* =====================================
                    PRECIO Y BOTÓN
                    ===================================== */}
                <div className="pt-4 min-[2560px]:pt-8 min-[3840px]:pt-10 border-t border-snd-bg flex flex-col sm:flex-row items-start sm:items-center gap-4 min-[2560px]:gap-8 sm:justify-between">

                  <div>

                    <span className="text-xs min-[2560px]:text-xl min-[3840px]:text-3xl text-text opacity-60 block mb-1">
                      {t(
                        "catalog.totalPrice",
                        "Precio total"
                      )}
                    </span>

                    <span className="text-2xl min-[2560px]:text-5xl min-[3840px]:text-7xl font-black text-price">
                      {expansion.price}
                    </span>

                  </div>

                  {/* Añadir al carrito */}
                  <button
                    onClick={handleOpenPlatformSelector}
                    className="bg-main hover:bg-hover text-bg font-bold py-3 px-6 min-[2560px]:py-5 min-[2560px]:px-10 min-[2560px]:text-2xl min-[3840px]:py-7 min-[3840px]:px-14 min-[3840px]:text-4xl rounded-2xl min-[2560px]:rounded-3xl shadow-lg transition duration-300 cursor-pointer"
                  >
                    {t(
                      "cart.add",
                      "Añadir al carrito"
                    )}
                  </button>

                </div>

              </div>

            </div>

            {/* =========================================
                CAPTURAS DE PANTALLA Y TRÁILER
                ========================================= */}
            <div className="p-5 sm:p-8 pt-6 sm:pt-8 min-[2560px]:p-14 min-[2560px]:pt-10 min-[3840px]:p-20 min-[3840px]:pt-14">
              <h3 className="text-base min-[2560px]:text-3xl min-[3840px]:text-5xl font-bold text-text mb-4 min-[2560px]:mb-7 min-[3840px]:mb-10 border-b border-snd-bg pb-2 min-[2560px]:pb-4 transition-colors duration-400">
                {t("catalog.screenshots", "Capturas de pantalla y tráiler")}
              </h3>

              <Carousel 
                media={expansion.screenshots} 
                videoUrl={expansion.videoUrl || "https://www.youtube.com/watch?v=4e25uhObPto"} 
              />
            </div>

            {/* =========================================
                REQUISITOS DEL SISTEMA
                ========================================= */}
            {(expansion.minRequirements?.length > 0 ||
              expansion.recommendedRequirements?.length > 0) && (

              <div className="p-5 sm:p-8 pt-0 sm:pt-0 min-[2560px]:p-14 min-[2560px]:pt-0 min-[3840px]:p-20 min-[3840px]:pt-0">

                <h3 className="text-base min-[2560px]:text-3xl min-[3840px]:text-5xl font-bold text-text mb-4 min-[2560px]:mb-8 min-[3840px]:mb-10 border-b border-snd-bg pb-2 min-[2560px]:pb-4 transition-colors duration-400">
                  {t(
                    "catalog.requirements",
                    "Requisitos del sistema"
                  )}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-[2560px]:gap-12 min-[3840px]:gap-16">

                  {/* Requisitos mínimos */}
                  <div>

                    <h4 className="text-sm min-[2560px]:text-2xl min-[3840px]:text-4xl font-bold text-text opacity-80 mb-3 min-[2560px]:mb-6">
                      {t(
                        "catalog.minRequirements",
                        "Requisitos mínimos"
                      )}
                    </h4>

                    <ul className="space-y-2 min-[2560px]:space-y-4 min-[3840px]:space-y-6 text-sm min-[2560px]:text-2xl min-[3840px]:text-3xl text-text">

                      {expansion.minRequirements?.map(
                        (req, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 min-[2560px]:gap-4"
                          >
                            <span className="text-accent-text font-bold">
                              ✓
                            </span>

                            <span>
                              {req}
                            </span>
                          </li>
                        )
                      )}

                    </ul>

                  </div>

                  {/* Requisitos recomendados */}
                  <div>

                    <h4 className="text-sm min-[2560px]:text-2xl min-[3840px]:text-4xl font-bold text-text opacity-80 mb-3 min-[2560px]:mb-6">
                      {t(
                        "catalog.recommendedRequirements",
                        "Requisitos recomendados"
                      )}
                    </h4>

                    <ul className="space-y-2 min-[2560px]:space-y-4 min-[3840px]:space-y-6 text-sm min-[2560px]:text-2xl min-[3840px]:text-3xl text-text">

                      {expansion.recommendedRequirements?.map(
                        (req, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 min-[2560px]:gap-4"
                          >
                            <span className="text-accent-text font-bold">
                              ✓
                            </span>

                            <span>
                              {req}
                            </span>
                          </li>
                        )
                      )}

                    </ul>

                  </div>

                </div>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* =========================================
          SELECTOR DE PLATAFORMA
          ========================================= */}
      <PlatformSelector
        expansionId={expansion.id}
        isOpen={showPlatformSelector}
        onClose={() => setShowPlatformSelector(false)}
        onSelectPlatform={handlePlatformSelected}
      />

      {/* =========================================
          MENSAJE DEL CARRITO (MODAL)
          ========================================= */}
      {cartMessage && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1500] p-4 min-[2560px]:p-10 min-[3840px]:p-16"
          onClick={() => setCartMessage("")}
        >

          <div
            className="bg-card-bg rounded-2xl min-[2560px]:rounded-3xl min-[3840px]:rounded-[2.5rem] p-6 min-[2560px]:p-12 min-[3840px]:p-16 w-full max-w-md min-[2560px]:max-w-3xl min-[3840px]:max-w-5xl shadow-xl border border-snd-bg"
            onClick={(e) => e.stopPropagation()}
          >

            <h2 className="text-xl min-[2560px]:text-4xl min-[3840px]:text-6xl font-bold mb-3 min-[2560px]:mb-6 text-text">
              {t("cart.title", "Carrito")}
            </h2>

            <p className="text-text mb-6 min-[2560px]:mb-10 min-[3840px]:mb-12 text-base min-[2560px]:text-2xl min-[3840px]:text-4xl leading-relaxed">
              {cartMessage}
            </p>

            <div className="flex justify-end">

              <button
                onClick={() => setCartMessage("")}
                className="bg-main hover:bg-hover text-bg font-bold px-5 py-2 min-[2560px]:px-9 min-[2560px]:py-4 min-[3840px]:px-14 min-[3840px]:py-6 text-sm min-[2560px]:text-2xl min-[3840px]:text-4xl rounded-lg min-[2560px]:rounded-2xl transition duration-200 cursor-pointer"
              >
                {t("common.close", "Cerrar")}
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default ExpansionDetail;