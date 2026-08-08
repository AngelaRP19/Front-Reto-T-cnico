import { usePlatformsByExpansion } from "../../features/catalog/hooks/usePlatforms";

function PlatformSelector({
  expansionId,
  isOpen,
  onClose,
  onSelectPlatform,
}) {
  const { platforms, loading, error } =
    usePlatformsByExpansion(expansionId, isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-3xl w-[90%] max-w-xl p-8 relative shadow-2xl">

        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-3xl cursor-pointer text-gray-700 hover:text-black"
          aria-label="Cerrar"
        >
          ×
        </button>

        {/* Título */}
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Selecciona tu plataforma
        </h2>

        {/* Cargando */}
        {loading && (
          <p className="text-center text-gray-500">
            Cargando plataformas...
          </p>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center">
            <p className="text-red-500 mb-4">
              {error}
            </p>

            <button
              onClick={onClose}
              className="bg-main hover:bg-hover text-white font-bold py-2 px-5 rounded-xl"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Sin plataformas */}
        {!loading && !error && platforms.length === 0 && (
          <p className="text-center text-gray-500">
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
                  bg-lime-400
                  hover:bg-lime-500
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