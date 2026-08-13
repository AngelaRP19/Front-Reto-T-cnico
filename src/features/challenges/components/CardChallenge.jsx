import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLingui } from "@lingui/react";
import { acceptChallenge, cancelChallenge, reactivateChallenge } from "../services/challengesService";
import { translateErrorMessage } from "../../../utils/errorMessages";

const STATUS_STYLES = {
  INICIADO: "bg-blue-100 text-blue-700",
  EN_PROGRESO: "bg-amber-100 text-amber-700",
  FINALIZADO: "bg-accent/10 text-accent",
  FALLIDO: "bg-red-100 text-red-700",
};

const STATUS_LABELS = {
  INICIADO: "Iniciado",
  EN_PROGRESO: "En progreso",
  FINALIZADO: "Finalizado",
  FALLIDO: "Fallido",
};

function CardChallenge({ challenge, subscription, userId, isAuthenticated, onSubscriptionChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  const isSubscribed = Boolean(subscription) && subscription.status !== "CANCELADO";
  const statusStyle = isSubscribed ? STATUS_STYLES[subscription.status] : null;
  const statusLabel = isSubscribed
    ? t(`challenges.status.${subscription.status}`, STATUS_LABELS[subscription.status] || subscription.status)
    : null;

  const handleToggle = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (isSubscribed) {
      setShowCancelConfirm(true);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      if (subscription) {
        await reactivateChallenge(subscription.subscriptionId);
        onSubscriptionChange(challenge.id, { subscriptionId: subscription.subscriptionId, status: "INICIADO" });
      } else {
        const newId = await acceptChallenge(userId, challenge.id);
        onSubscriptionChange(challenge.id, { subscriptionId: newId, status: "INICIADO" });
      }
    } catch (err) {
      setError(translateErrorMessage(err, t("errors.generic", "Ocurrió un error"), i18n));
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmCancel = async (e) => {
    e.stopPropagation();
    setShowCancelConfirm(false);
    setSubmitting(true);
    setError("");
    try {
      await cancelChallenge(subscription.subscriptionId);
      onSubscriptionChange(challenge.id, { subscriptionId: subscription.subscriptionId, status: "CANCELADO" });
    } catch (err) {
      setError(translateErrorMessage(err, t("errors.generic", "Ocurrió un error"), i18n));
    } finally {
      setSubmitting(false);
    }
  };

  const buttonColor = isSubscribed
    ? "bg-red-500 hover:bg-red-600 text-white"
    : "bg-accent hover:bg-accent/90 text-white";

  const buttonLabel = isSubscribed ? t("challenges.cancel", "Cancelar") : t("challenges.accept", "Aceptar");

  const renderButton = (widthClass) => (
    <button
      onClick={handleToggle}
      disabled={submitting}
      className={`${widthClass} px-6 py-2.5 rounded-full font-medium text-sm transition-colors duration-200 cursor-pointer disabled:opacity-60 ${buttonColor}`}
    >
      {submitting ? "..." : buttonLabel}
    </button>
  );

  const dateRow = (
    <p className="text-xs sm:text-sm text-text opacity-60 mt-1 flex items-center gap-2 flex-wrap">
      <span>{t("challenges.start", "Inicio")}: {challenge.startDate} · {t("challenges.end", "Fin")}: {challenge.endDate}</span>
      {statusLabel && (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusStyle}`}>{statusLabel}</span>
      )}
    </p>
  );

  return (
    <>
      <div onClick={() => setShowModal(true)} className="w-full max-w-5xl mx-auto cursor-pointer">
        <div className="bg-card-bg border border-snd-bg rounded-2xl p-4 sm:p-5 shadow-sm transition-colors duration-300 hover:border-main">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-snd-bg overflow-hidden shrink-0">
                {challenge.image ? (
                  <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text opacity-40 text-xs text-center">
                    {t("challenges.image", "Imagen")}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-text truncate">{challenge.title}</h3>
                {dateRow}
              </div>
            </div>

            <div className="w-full sm:w-auto flex justify-end shrink-0">
              {renderButton("w-full sm:w-auto")}
            </div>
          </div>

          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 sm:p-6 z-[1500] animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-card-bg text-text rounded-2xl shadow-2xl w-full max-w-[32rem] max-h-[calc(100vh-2rem)] overflow-y-auto p-5 sm:p-8 relative animate-[zoomIn_.35s_ease] transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-2xl font-bold text-text hover:text-hover"
            >
              ×
            </button>

            <div className="w-full h-40 rounded-xl bg-snd-bg overflow-hidden mb-4">
              {challenge.image ? (
                <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text opacity-40 text-sm">
                  {t("challenges.image", "Imagen")}
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold mb-2">{challenge.title}</h2>
            <p className="text-sm opacity-80 mb-4">{challenge.description}</p>
            {dateRow}

            {error && <p className="text-red-400 text-sm mt-3 mb-1">{error}</p>}

            <div className="mt-4">{renderButton("w-full")}</div>
          </div>
        </div>
      )}

      {showCancelConfirm && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 sm:p-6 z-[1500] animate-fadeIn"
          onClick={(e) => { e.stopPropagation(); setShowCancelConfirm(false); }}
        >
          <div
            className="bg-card-bg text-text rounded-2xl shadow-2xl w-full max-w-sm max-h-[calc(100vh-2rem)] overflow-y-auto p-5 sm:p-6 transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-2">{t("challenges.cancelTitle", "¿Cancelar este reto?")}</h3>
            <p className="text-sm opacity-80 mb-5">
              {t("challenges.cancelBody", "Vas a perder el progreso que llevás en este reto y no vas a poder recuperarlo.")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); setShowCancelConfirm(false); }}
                className="flex-1 bg-snd-bg text-text rounded-full py-2.5 text-sm font-bold cursor-pointer hover:opacity-80 transition"
              >
                {t("challenges.back", "Volver")}
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={submitting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-full py-2.5 text-sm font-bold cursor-pointer disabled:opacity-60 transition"
              >
                {submitting ? "..." : t("challenges.cancelAction", "Cancelar reto")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CardChallenge;
