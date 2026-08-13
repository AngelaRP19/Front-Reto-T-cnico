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
      className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card-bg text-text rounded-3xl w-[90%] max-w-xl p-8 relative shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-3xl cursor-pointer text-text hover:text-main"
          aria-label={t("common.close", "Cerrar")}
        >
          ×
        </button>

        {/* Título */}
        <h2 className="text-3xl font-bold text-center mb-8 text-text">
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
              className="bg-main hover:bg-hover text-bg font-bold py-2 px-5 rounded-xl"
            >
              Cerrar
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
          <div className="flex flex-col gap-5">

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