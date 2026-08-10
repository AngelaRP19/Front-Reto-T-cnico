import { useEffect, useState } from "react";
import { useLingui } from "@lingui/react";
import Modal from "../../../components/common/Modal";
import { getMyPurchases } from "../services/purchasesService";
import { translateErrorMessage } from "../../../utils/errorMessages";

function formatPurchaseDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

function purchaseSummary(purchase, t) {
  const names = purchase.items?.map((item) => item.expansionPack?.name).filter(Boolean) || [];
  if (names.length === 0) return t("profile.purchases.noDetail", "Compra sin detalle");
  if (names.length === 1) return names[0];
  return t("profile.purchases.summaryMore", "{first} y {count} más", {
    first: names[0],
    count: names.length - 1,
  });
}

function ProfilePurchasesTab() {
  const { i18n } = useLingui();
  const t = (id, message, values) => i18n._({ id, message, values });

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getMyPurchases()
      .then((data) => {
        if (!cancelled) setPurchases(data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(translateErrorMessage(err, t("errors.generic", "Ocurrió un error"), i18n));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-card-bg rounded-2xl shadow-sm border border-snd-bg p-6 sm:p-8 transition-colors duration-300">
      <h1 className="text-2xl font-extrabold text-text mb-6">{t("profile.purchases.title", "Historial de compras")}</h1>

      {loading ? (
        <p className="text-text text-center py-10">{t("profile.purchases.loading", "Cargando compras...")}</p>
      ) : error ? (
        <p className="text-text text-center py-10">{error}</p>
      ) : purchases.length === 0 ? (
        <p className="text-text opacity-70 text-center py-10">
          {t("profile.purchases.empty", "Todavía no realizaste ninguna compra.")}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {purchases.map((purchase) => (
            <button
              key={purchase.id}
              onClick={() => setSelectedPurchase(purchase)}
              className="w-full text-left bg-snd-bg/50 border border-snd-bg rounded-2xl p-4 sm:p-5 shadow-sm transition-colors duration-300 hover:border-main cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-main uppercase tracking-wider mb-1">
                    {t("profile.purchases.orderNumber", "Compra #{id}", { id: purchase.id })}
                  </p>
                  <h3 className="text-base sm:text-lg font-bold text-text truncate">
                    {purchaseSummary(purchase, t)}
                  </h3>
                  <p className="text-xs sm:text-sm text-text opacity-60 mt-1">
                    {formatPurchaseDate(purchase.purchaseDate)}
                  </p>
                </div>
                <span className="text-lg font-black text-accent shrink-0">
                  {purchase.totalPrice?.toLocaleString("es-CO", { style: "currency", currency: "COP" })}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedPurchase && (
        <Modal onClose={() => setSelectedPurchase(null)} maxWidthClass="max-w-lg">
          <h2 className="text-xl font-bold text-text mb-1">
            {t("profile.purchases.orderNumber", "Compra #{id}", { id: selectedPurchase.id })}
          </h2>
          <p className="text-sm text-text opacity-60 mb-5">{formatPurchaseDate(selectedPurchase.purchaseDate)}</p>

          <div className="divide-y divide-snd-bg mb-5">
            {selectedPurchase.items?.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-text truncate">{item.expansionPack?.name}</p>
                  <p className="text-xs text-text opacity-70">
                    {t("profile.purchases.platform", "Plataforma")}: {item.platform?.name} · {t("profile.purchases.quantity", "Cantidad")}: {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-text shrink-0">
                  {item.expansionPack?.price?.toLocaleString("es-CO", { style: "currency", currency: "COP" })}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-snd-bg pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text opacity-70">{t("profile.purchases.paymentMethod", "Método de pago")}</span>
              <span className="font-semibold text-text">{selectedPurchase.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text opacity-70">{t("profile.purchases.status", "Estado")}</span>
              <span className="font-semibold text-text">{selectedPurchase.status}</span>
            </div>
            <div className="flex justify-between text-base pt-2">
              <span className="font-bold text-text">{t("profile.purchases.total", "Total")}</span>
              <span className="font-black text-accent">
                {selectedPurchase.totalPrice?.toLocaleString("es-CO", { style: "currency", currency: "COP" })}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ProfilePurchasesTab;
