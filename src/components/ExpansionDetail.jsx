import { useState } from "react";
import { useLingui } from "@lingui/react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import useCartStore from "../store/cartStore";
import { canAccessCart } from "../utils/cartAccess";
import PlatformSelector from "./PlatformSelector/PlatformSelector";

const ExpansionDetail = ({ data: expansion, onBack }) => {
  const { i18n } = useLingui();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showPlatformSelector, setShowPlatformSelector] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const t = (id, message) => i18n._({ id, message });

  // =====================================================
  // AÑADIR AL CARRITO
  // =====================================================
  const handleAddToCart = () => {
    // Si no ha iniciado sesión, enviarlo al Login
    if (!canAccessCart(user)) {
      navigate("/login");
      return;
    }

    // Si ya inició sesión, mostrar selector de plataforma
    setShowPlatformSelector(true);
  };

  // =====================================================
  // PLATAFORMA SELECCIONADA
  // =====================================================
  const handlePlatformSelected = (platform) => {
    console.log("Plataforma seleccionada:", platform);

    // Agregar la expansión al carrito utilizando
    // la plataforma que acaba de seleccionar el usuario
    addItem({
      id: expansion.id,
      title: expansion.title,
      price: expansion.price,
      platform: platform,
      image: expansion.image,
    });

    // Cerrar selector
    setShowPlatformSelector(false);
  };

  return (
    <>
      {/* Botón para regresar */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-bold text-main hover:text-hover transition duration-200 cursor-pointer"
      >
        ← {t("catalog.back", "Volver al catálogo")}
      </button>

      {/* Tarjeta principal */}
      <div className="bg-card-bg rounded-3xl shadow-xl overflow-hidden border border-snd-bg transition-colors duration-400">
        <div className="md:flex">

          {/* Imagen */}
          <div className="md:w-1/2 bg-card-bg p-4 sm:p-6 flex items-center justify-center relative group overflow-hidden transition-colors duration-400">

            <span className="absolute top-4 left-4 bg-accent text-bg text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10 transition-opacity duration-200 ease-in-out group-hover:opacity-0 pointer-events-none">
              {expansion.category}
            </span>

            <img
              src={expansion.image}
              alt={expansion.title}
              className="rounded-3xl shadow-md w-full aspect-[4/3] md:max-h-[20rem] object-cover transform group-hover:scale-105 transition duration-300"
            />
          </div>

          {/* Información */}
          <div className="md:w-1/2 p-5 sm:p-8 flex flex-col justify-between">

            <div>

              <h1 className="text-3xl font-extrabold text-text mb-2 transition-colors duration-400">
                {expansion.title}
              </h1>

              <div className="flex items-center gap-3 mb-4 text-xs font-medium text-text opacity-60">

                <span className="bg-snd-bg text-main px-2.5 py-1 rounded-md">
                  {expansion.platform}
                </span>

                <span>• {expansion.releaseDate}</span>

              </div>

              <p className="text-text mb-6 text-sm leading-relaxed transition-colors duration-400">
                {expansion.description}
              </p>

              <h3 className="text-base font-bold text-text mb-3 border-b border-snd-bg pb-2 transition-colors duration-400">
                {t("catalog.includes", "¿Qué incluye este pack?")}
              </h3>

              <ul className="space-y-2 mb-6 text-sm text-text">
                {expansion.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-accent font-bold">
                      ✓
                    </span>

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

            </div>

            {/* Precio y botón */}
            <div className="pt-4 border-t border-snd-bg flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">

              <div>

                <span className="text-xs text-text opacity-60 block">
                  {t("catalog.totalPrice", "Precio total")}
                </span>

                <span className="text-2xl font-black text-accent">
                  {expansion.price}
                </span>

              </div>

              {/* El botón ahora SIEMPRE aparece */}
              <button
                onClick={handleAddToCart}
                className="bg-main hover:bg-hover text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition duration-300 cursor-pointer"
              >
                {t("cart.add", "Añadir al carrito")} 🛒
              </button>

            </div>

          </div>

        </div>

        {/* Capturas */}
        {expansion.screenshots?.length > 0 && (
          <div className="p-5 sm:p-8 pt-6 sm:pt-8">

            <h3 className="text-base font-bold text-text mb-4 border-b border-snd-bg pb-2 transition-colors duration-400">
              {t("catalog.screenshots", "Capturas de pantalla")}
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

        {/* Requisitos */}
        {(expansion.minRequirements?.length > 0 ||
          expansion.recommendedRequirements?.length > 0) && (

          <div className="p-5 sm:p-8 pt-0 sm:pt-0">

            <h3 className="text-base font-bold text-text mb-4 border-b border-snd-bg pb-2 transition-colors duration-400">
              {t("catalog.requirements", "Requisitos del sistema")}
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

                  {expansion.minRequirements?.map((req, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2"
                    >
                      <span className="text-accent font-bold">
                        ✓
                      </span>

                      <span>{req}</span>
                    </li>
                  ))}

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

                        <span>{req}</span>
                      </li>
                    )
                  )}

                </ul>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* Selector de plataforma */}
      <PlatformSelector
  expansionId={expansion.id}
  isOpen={showPlatformSelector}
  onClose={() => setShowPlatformSelector(false)}
  onSelectPlatform={handlePlatformSelected}
/>
    </>
  );
};

export default ExpansionDetail;