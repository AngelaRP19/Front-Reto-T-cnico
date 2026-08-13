import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLingui } from "@lingui/react";
import { useAuth } from "../context/AuthContext";
import useCartStore from "../store/cartStore";
import { canAccessCart } from "../utils/cartAccess";
import PlatformSelector from "./PlatformSelector/PlatformSelector";
import { getPlatforms } from "../features/catalog/services/platformsService";

const ExpansionDetail = ({ data: expansion, onBack }) => {
  const { i18n } = useLingui();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showPlatformSelector, setShowPlatformSelector] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const addItem = useCartStore((state) => state.addItem);

  const t = (id, message) => i18n._({ id, message });

  /*
   * Abrir selector de plataforma
   *
   * Si el usuario no está autenticado:
   * → Redirige a la página de inicio de sesión.
   *
   * Si está autenticado:
   * → Abre el selector de plataformas.
   */
  const handleOpenPlatformSelector = () => {
    if (!canAccessCart(user)) {
      navigate("/login");
      return;
    }

    setShowPlatformSelector(true);
  };

  /*
   * Plataforma seleccionada
   *
   * PlatformSelector devuelve el objeto completo de la plataforma.
   *
   * Ejemplo:
   * {
   *   id: 1,
   *   name: "Steam",
   *   label: "Steam"
   * }
   */
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

    const result = addItem({
      id: expansion.id,
      title: expansion.title,
      price: expansion.price,
      platform: platform.name,
      platformId: matched?.id,
      image: expansion.image,
    });

    setShowPlatformSelector(false);

    /*
     * Si el carrito devuelve un error,
     * mostramos el mensaje.
     */
    if (!result?.success) {
      setCartMessage(
        result?.message ||
          "No se pudo agregar el producto al carrito."
      );
      return;
    }

    setCartMessage("Producto agregado correctamente al carrito.");
  };

  return (
    <>
    <div className="min-h-screen bg-bg text-text py-6 sm:py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-400">
      <div className="max-w-5xl mx-auto">

      {/* =========================================
          BOTÓN REGRESAR
          ========================================= */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-bold text-main hover:text-hover transition duration-200 cursor-pointer"
      >
        ← {t("catalog.back", "Volver al catálogo")}
      </button>

      {/* =========================================
          TARJETA PRINCIPAL
          ========================================= */}
      <div className="bg-card-bg rounded-3xl shadow-xl overflow-hidden border border-snd-bg transition-colors duration-400">

        <div className="md:flex">

          {/* =====================================
              IMAGEN
              ===================================== */}
          <div className="md:w-1/2 bg-card-bg p-4 sm:p-6 flex items-center justify-center relative group overflow-hidden transition-colors duration-400">

            <span className="absolute top-4 left-4 bg-accent text-bg text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10 transition-opacity duration-200 ease-in-out group-hover:opacity-0 pointer-events-none">
              {expansion.category}
            </span>

            <img
              src={expansion.image}
              alt={expansion.title}
              className="rounded-3xl shadow-md w-full aspect-[4/3] max-h-[14rem] md:max-h-[20rem] object-cover transform group-hover:scale-105 transition duration-300"
            />
          </div>

          {/* =====================================
              INFORMACIÓN
              ===================================== */}
          <div className="md:w-1/2 p-5 sm:p-8 flex flex-col justify-between">

            <div>

              {/* Título */}
              <h1 className="text-3xl font-extrabold text-text mb-2 transition-colors duration-400">
                {expansion.title}
              </h1>

              {/* Plataforma y fecha */}
              <div className="flex items-center gap-3 mb-4 text-xs font-medium text-text opacity-60">

                <span className="bg-snd-bg text-main px-2.5 py-1 rounded-md">
                  {expansion.platform}
                </span>

                <span>
                  • {expansion.releaseDate}
                </span>

              </div>

              {/* Descripción */}
              <p className="text-text mb-6 text-sm leading-relaxed transition-colors duration-400">
                {expansion.description}
              </p>

              {/* Incluye */}
              <h3 className="text-base font-bold text-text mb-3 border-b border-snd-bg pb-2 transition-colors duration-400">
                {t(
                  "catalog.includes",
                  "¿Qué incluye este pack?"
                )}
              </h3>

              <ul className="space-y-2 mb-6 text-sm text-text">

                {expansion.features?.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2"
                  >
                    <span className="text-accent font-bold">
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
            <div className="pt-4 border-t border-snd-bg flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">

              <div>

                <span className="text-xs text-text opacity-60 block">
                  {t(
                    "catalog.totalPrice",
                    "Precio total"
                  )}
                </span>

                <span className="text-2xl font-black text-[var(--price-color)]">
                  {expansion.price}
                </span>

              </div>

              {/* Añadir al carrito */}
              <button
                onClick={handleOpenPlatformSelector}
                className="bg-main hover:bg-hover text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition duration-300 cursor-pointer"
              >
                {t(
                  "cart.add",
                  "Añadir al carrito"
                )}{" "}
                
              </button>

            </div>

          </div>

        </div>

        {/* =========================================
            CAPTURAS DE PANTALLA
            ========================================= */}
        {expansion.screenshots?.length > 0 && (
          <div className="p-5 sm:p-8 pt-6 sm:pt-8">

            <h3 className="text-base font-bold text-text mb-4 border-b border-snd-bg pb-2 transition-colors duration-400">
              {t(
                "catalog.screenshots",
                "Capturas de pantalla"
              )}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">

              {expansion.screenshots.map((url, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl group"
                >
                  <img
                    src={url}
                    alt={`${expansion.title} - ${idx + 1}`}
                    className="w-full aspect-video object-cover transform group-hover:scale-105 transition duration-300"
                  />
                </div>
              ))}

            </div>

          </div>
        )}

        {/* =========================================
            REQUISITOS DEL SISTEMA
            ========================================= */}
        {(expansion.minRequirements?.length > 0 ||
          expansion.recommendedRequirements?.length > 0) && (

          <div className="p-5 sm:p-8 pt-0 sm:pt-0">

            <h3 className="text-base font-bold text-text mb-4 border-b border-snd-bg pb-2 transition-colors duration-400">
              {t(
                "catalog.requirements",
                "Requisitos del sistema"
              )}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Requisitos mínimos */}
              <div>

                <h4 className="text-sm font-bold text-text opacity-80 mb-3">
                  {t(
                    "catalog.minRequirements",
                    "Requisitos mínimos"
                  )}
                </h4>

                <ul className="space-y-2 text-sm text-text">

                  {expansion.minRequirements?.map(
                    (req, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2"
                      >
                        <span className="text-accent font-bold">
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

                <h4 className="text-sm font-bold text-text opacity-80 mb-3">
                  {t(
                    "catalog.recommendedRequirements",
                    "Requisitos recomendados"
                  )}
                </h4>

                <ul className="space-y-2 text-sm text-text">

                  {expansion.recommendedRequirements?.map(
                    (req, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2"
                      >
                        <span className="text-accent font-bold">
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
          =========================================

          IMPORTANTE:
          Se envía expansion.id porque
          PlatformSelector lo necesita para
          consultar las plataformas disponibles.
          ========================================= */}
      <PlatformSelector
        expansionId={expansion.id}
        isOpen={showPlatformSelector}
        onClose={() => setShowPlatformSelector(false)}
        onSelectPlatform={handlePlatformSelected}
      />

      {/* =========================================
          MENSAJE DEL CARRITO
          ========================================= */}
      {cartMessage && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1500] p-4"
          onClick={() => setCartMessage("")}
        >

          <div
            className="bg-card-bg rounded-2xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            <h2 className="text-xl font-bold mb-3 text-text">
              Carrito
            </h2>

            <p className="text-text mb-6">
              {cartMessage}
            </p>

            <div className="flex justify-end">

              <button
                onClick={() => setCartMessage("")}
                className="bg-main hover:bg-hover text-white font-bold px-5 py-2 rounded-lg transition duration-200"
              >
                Cerrar
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default ExpansionDetail;