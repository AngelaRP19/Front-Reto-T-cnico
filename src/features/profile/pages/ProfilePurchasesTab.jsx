import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getExpansionPacks } from "../../catalog/services/expansionsService";

export default function ProfilePurchasesTab() {
  const { user } = useAuth();
  const [allPacks, setAllPacks] = useState([]);
  const [ownedPacks, setOwnedPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [redeemStatus, setRedeemStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    async function load() {
      try {
        const packs = await getExpansionPacks();
        setAllPacks(packs);

        // Load owned pack IDs from localStorage
        const storageKey = `owned_packs_${user?.username || "guest"}`;
        const stored = localStorage.getItem(storageKey);
        let ownedIds = [];

        if (stored) {
          ownedIds = JSON.parse(stored);
        } else if (packs.length > 0) {
          // Default to first pack if no state exists
          ownedIds = [packs[0].id];
          if (packs[1]) ownedIds.push(packs[1].id);
          localStorage.setItem(storageKey, JSON.stringify(ownedIds));
        }

        setOwnedPacks(packs.filter((p) => ownedIds.includes(p.id)));
      } catch (err) {
        setError(err.message || "Error al cargar packs");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.username]);

  const handleRedeem = (e) => {
    e.preventDefault();
    setRedeemStatus({ type: "", message: "" });

    if (!code.trim()) {
      setRedeemStatus({ type: "error", message: "Por favor, ingresa un código válido." });
      return;
    }

    const storageKey = `owned_packs_${user?.username || "guest"}`;
    const storedIds = JSON.parse(localStorage.getItem(storageKey) || "[]");

    // Find a pack that is not owned yet
    const unowned = allPacks.filter((p) => !storedIds.includes(p.id));

    if (unowned.length === 0) {
      setRedeemStatus({
        type: "info",
        message: "¡Ya tienes todos los packs de expansión disponibles en tu biblioteca!",
      });
      return;
    }

    // Add a random unowned pack
    const randomPack = unowned[Math.floor(Math.random() * unowned.length)];
    const updatedIds = [...storedIds, randomPack.id];
    localStorage.setItem(storageKey, JSON.stringify(updatedIds));

    setOwnedPacks(allPacks.filter((p) => updatedIds.includes(p.id)));
    setRedeemStatus({
      type: "success",
      message: `¡Código aceptado! Se ha agregado "${randomPack.title}" a tu biblioteca.`,
    });
    setCode("");
  };

  if (loading) {
    return <p className="text-text text-center py-10">Cargando tus compras...</p>;
  }

  if (error) {
    return <p className="text-red-400 text-center py-10">{error}</p>;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-text">Mis Compras</h3>
          <p className="text-sm text-text opacity-70 mt-1">
            Revisa y administra tus packs de expansión y contenido adquirido.
          </p>
        </div>
      </div>

      {/* Redeem code panel */}
      <div className="p-6 rounded-xl border border-snd-bg bg-snd-bg/25">
        <h4 className="font-bold text-sm text-text mb-2 uppercase tracking-wide opacity-75">
          Redimir Código de Contenido
        </h4>
        <p className="text-xs text-text opacity-60 mb-4">
          Ingresa un código promocional o de activación para desbloquear nuevos packs de expansión. (Prueba con cualquier texto).
        </p>
        <form onSubmit={handleRedeem} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Ej: SIMS4-XXXX-XXXX-XXXX"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-snd-bg bg-card-bg text-text focus:outline-none focus:border-main transition-colors text-sm"
          />
          <button
            type="submit"
            className="bg-accent hover:scale-105 active:scale-95 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
          >
            Redimir
          </button>
        </form>

        {redeemStatus.message && (
          <p
            className={`text-xs font-bold mt-3 ${
              redeemStatus.type === "success"
                ? "text-emerald-500"
                : redeemStatus.type === "error"
                ? "text-red-400"
                : "text-main"
            }`}
          >
            {redeemStatus.message}
          </p>
        )}
      </div>

      {/* Owned Packs Grid */}
      <div className="space-y-4">
        <h4 className="font-bold text-sm text-text uppercase tracking-wide opacity-75">
          Biblioteca de Contenido ({ownedPacks.length})
        </h4>

        {ownedPacks.length === 0 ? (
          <p className="text-sm text-text opacity-60 text-center py-6">
            No tienes packs de expansión en tu biblioteca todavía.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ownedPacks.map((pack) => (
              <div
                key={pack.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-snd-bg bg-snd-bg/10 hover:border-main transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-lg bg-snd-bg overflow-hidden shrink-0">
                  {pack.image ? (
                    <img src={pack.image} alt={pack.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs opacity-55 text-center">
                      sin imagen
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-main/10 text-main mb-1">
                    {pack.category || "Expansión"}
                  </span>
                  <h5 className="font-bold text-sm text-text truncate">{pack.title}</h5>
                  <p className="text-xs text-text opacity-50 mt-0.5">Plataforma: {pack.platform}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
