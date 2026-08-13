import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLingui } from "@lingui/react";
import { acceptChallenge, cancelChallenge, reactivateChallenge } from "../services/challengesService";
import { translateErrorMessage } from "../../../utils/errorMessages";

const STATUS_STYLES = {
  INICIADO: "bg-blue-100 text-blue-700",
  EN_PROGRESO: "bg-amber-100 text-amber-700",
  FINALIZADO: "bg-accent/10 text-accent-text",
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
    ? "bg-red-600 hover:bg-red-700 text-white"
    : "bg-accent hover:bg-accent/90 text-text";

  const buttonLabel = isSubscribed ? t("challenges.cancel", "Cancelar") : t("challenges.accept", "Aceptar");

  const renderButton = (widthClass) => (
    <button
      onClick={handleToggle}
      disabled={submitting}
      className={`${widthClass} px-6 py-2.5 min-[2560px]:px-10 min-[2560px]:py-4 min-[2560px]:text-[2rem] min-[3840px]:px-12 min-[3840px]:py-5 min-[3840px]:text-[2.7rem] rounded-full font-semibold text-[1.35rem] transition-colors duration-200 cursor-pointer disabled:opacity-60 ${buttonColor}`}
    >
      {submitting ? "..." : buttonLabel}
    </button>
  );

  const dateRow = (
    <p className="text-xl sm:text-2xl min-[2560px]:text-[1.9rem] min-[3840px]:text-[2.35rem] text-text opacity-85 mt-1 min-[2560px]:mt-2 flex items-center gap-2 min-[2560px]:gap-3 flex-wrap">
      <span>{t("challenges.start", "Inicio")}: {challenge.startDate} · {t("challenges.end", "Fin")}: {challenge.endDate}</span>
      {statusLabel && (
        <span className={`px-2 py-0.5 min-[2560px]:px-3 min-[2560px]:py-1 min-[3840px]:px-4 min-[3840px]:py-1.5 rounded-full text-xl min-[2560px]:text-[1.45rem] min-[3840px]:text-[1.7rem] font-bold ${statusStyle}`}>{statusLabel}</span>
      )}
    </p>
  );

  return (
    <>
      <div onClick={() => setShowModal(true)} className="w-full cursor-pointer">
        <div className="bg-card-bg border border-snd-bg rounded-2xl min-[2560px]:rounded-3xl p-5 sm:p-6 min-[2560px]:p-8 min-[3840px]:p-10 shadow-sm transition-colors duration-300 hover:border-main">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 min-[2560px]:w-24 min-[2560px]:h-24 min-[3840px]:w-28 min-[3840px]:h-28 rounded-xl min-[2560px]:rounded-2xl bg-snd-bg overflow-hidden shrink-0">
                {challenge.image ? (
                  <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text opacity-40 text-xs min-[2560px]:text-base min-[3840px]:text-xl text-center">
                    {t("challenges.image", "Imagen")}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-[1.9rem] sm:text-[2.25rem] min-[2560px]:text-[3rem] min-[3840px]:text-[4rem] font-bold text-text leading-tight line-clamp-2">{challenge.title}</h3>
                {dateRow}
              </div>
            </div>

            <div className="w-full sm:w-auto flex justify-end shrink-0">
              {renderButton("w-full sm:w-auto")}
            </div>
          </div>

          {error && <p className="text-error text-lg min-[2560px]:text-2xl min-[3840px]:text-[2.4rem] mt-2">{error}</p>}
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 sm:p-6 min-[2560px]:p-10 min-[3840px]:p-16 z-[1500] animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-card-bg text-text rounded-2xl min-[2560px]:rounded-3xl shadow-2xl w-full max-w-[32rem] min-[2560px]:max-w-5xl min-[3840px]:max-w-7xl max-h-[calc(100vh-2rem)] overflow-y-auto p-5 sm:p-8 min-[2560px]:p-12 min-[3840px]:p-16 relative animate-[zoomIn_.35s_ease] transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-2xl font-bold text-text hover:text-hover"
              aria-label={t("common.close", "Cerrar")}
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

            <h2 className="text-[2.2rem] min-[2560px]:text-[3.3rem] min-[3840px]:text-[4.2rem] font-bold mb-2 min-[2560px]:mb-4">{challenge.title}</h2>
            <p className="text-xl min-[2560px]:text-[2.25rem] min-[3840px]:text-[3rem] opacity-85 mb-4 min-[2560px]:mb-6">{challenge.description}</p>
            {dateRow}

            {error && <p className="text-error text-lg min-[2560px]:text-2xl min-[3840px]:text-[2.4rem] mt-3 mb-1">{error}</p>}

            <div className="mt-4">{renderButton("w-full")}</div>
          </div>
        </div>
      )}

      {showCancelConfirm && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 sm:p-6 min-[2560px]:p-10 min-[3840px]:p-16 z-[1500] animate-fadeIn"
          onClick={(e) => { e.stopPropagation(); setShowCancelConfirm(false); }}
        >
          <div
            className="bg-card-bg text-text rounded-2xl min-[2560px]:rounded-3xl shadow-2xl w-full max-w-sm min-[2560px]:max-w-2xl min-[3840px]:max-w-4xl max-h-[calc(100vh-2rem)] overflow-y-auto p-5 sm:p-6 min-[2560px]:p-10 min-[3840px]:p-14 transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[1.8rem] min-[2560px]:text-[2.9rem] min-[3840px]:text-[3.8rem] font-bold mb-2 min-[2560px]:mb-4">{t("challenges.cancelTitle", "¿Cancelar este reto?")}</h3>
            <p className="text-lg min-[2560px]:text-[2rem] min-[3840px]:text-[2.7rem] opacity-85 mb-5 min-[2560px]:mb-8">
              {t("challenges.cancelBody", "Vas a perder el progreso que llevás en este reto y no vas a poder recuperarlo.")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); setShowCancelConfirm(false); }}
                className="flex-1 bg-snd-bg text-text rounded-full py-2.5 min-[2560px]:py-4 min-[3840px]:py-5 text-lg min-[2560px]:text-[1.55rem] min-[3840px]:text-[2.15rem] font-bold cursor-pointer hover:opacity-80 transition"
              >
                {t("challenges.back", "Volver")}
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={submitting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-full py-2.5 min-[2560px]:py-4 min-[3840px]:py-5 text-lg min-[2560px]:text-[1.55rem] min-[3840px]:text-[2.15rem] font-bold cursor-pointer disabled:opacity-60 transition"
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
