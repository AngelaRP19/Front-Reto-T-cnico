import { useLingui } from "@lingui/react";
import { usePlatformsByExpansion } from "../../features/catalog/hooks/usePlatforms";

function PlatformSelector({
  expansionId,
  isOpen,
  onClose,
  onSelectPlatform,
}) {
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });
  const { platforms, loading, error } =
    usePlatformsByExpansion(expansionId, isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/60 p-4 min-[2560px]:p-10 min-[3840px]:p-16"
      onClick={onClose}
    >
      <div
        className="bg-card-bg text-text rounded-3xl min-[2560px]:rounded-[2rem] w-[90%] max-w-xl min-[2560px]:max-w-4xl min-[3840px]:max-w-6xl p-8 min-[2560px]:p-12 min-[3840px]:p-16 relative shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 min-[2560px]:top-7 min-[2560px]:right-7 min-[3840px]:top-9 min-[3840px]:right-9 text-3xl min-[2560px]:text-5xl min-[3840px]:text-6xl cursor-pointer text-text hover:text-main"
          aria-label={t("common.close", "Cerrar")}
        >
          ×
        </button>

        {/* Título */}
        <h2 className="text-3xl min-[2560px]:text-5xl min-[3840px]:text-7xl font-bold text-center mb-8 min-[2560px]:mb-12 text-text">
          Selecciona tu plataforma
        </h2>

        {/* Cargando */}
        {loading && (
          <p className="text-center text-text opacity-60">
            Cargando plataformas...
          </p>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center">
            <p className="text-error mb-4">
              {error}
            </p>

            <button
              onClick={onClose}
              className="bg-main hover:bg-hover text-bg font-bold py-2 px-5 min-[2560px]:py-4 min-[2560px]:px-9 min-[2560px]:text-2xl min-[3840px]:py-5 min-[3840px]:px-12 min-[3840px]:text-3xl rounded-xl min-[2560px]:rounded-2xl"
            >
              {t("platformSelector.closeButton", "Cerrar")}
            </button>
          </div>
        )}

        {/* Sin plataformas */}
        {!loading && !error && platforms.length === 0 && (
          <p className="text-center text-text opacity-60">
            No hay plataformas disponibles para esta expansión.
          </p>
        )}

        {/* Plataformas */}
        {!loading && !error && platforms.length > 0 && (
          <div className="flex flex-col gap-5 min-[2560px]:gap-8">

            {platforms.map((platform, index) => (
              <button
                key={`${platform.name}-${index}`}
                onClick={() => onSelectPlatform(platform)}
                className="
                  bg-accent
                  hover:bg-accent/90
                  text-text
                  rounded-full
                  py-4
                  px-6
                  text-xl
                  min-[2560px]:text-3xl
                  min-[3840px]:text-4xl
                  min-[2560px]:py-5
                  min-[2560px]:px-8
                  min-[3840px]:py-7
                  min-[3840px]:px-10
                  font-semibold
                  flex
                  items-center
                  justify-center
                  transition
                  cursor-pointer
                "
              >
                {platform.label || platform.name}
              </button>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default PlatformSelector;