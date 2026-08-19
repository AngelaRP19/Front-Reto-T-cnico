import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLingui } from "@lingui/react";
import { Calendar } from "lucide-react";
import { acceptChallenge, cancelChallenge, reactivateChallenge } from "../services/challengesService";
import { translateErrorMessage } from "../../../utils/errorMessages";

const STATUS_STYLES = {
  INICIADO: "bg-blue-500/15 text-blue-600 border border-blue-500/30",
  EN_PROGRESO: "bg-amber-500/15 text-amber-600 border border-amber-500/30",
  FINALIZADO: "bg-main/20 text-main border border-main/40",
  FALLIDO: "bg-red-500/15 text-red-600 border border-red-500/30",
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
    ? "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
    : "bg-main hover:bg-main/90 text-white shadow-md hover:shadow-lg";

  const buttonLabel = isSubscribed ? t("challenges.cancel", "Cancelar") : t("challenges.accept", "Aceptar");

  const renderButton = (customClasses = "") => (
    <button
      type="button"
      onClick={handleToggle}
      disabled={submitting}
      className={`px-[1.25rem] py-[0.625rem] min-[2560px]:px-[2rem] min-[2560px]:py-[1rem] min-[3840px]:px-[3rem] min-[3840px]:py-[1.5rem] rounded-full font-bold text-sm min-[2560px]:text-xl min-[3840px]:text-3xl transition-all duration-300 transform active:scale-95 cursor-pointer disabled:opacity-60 ${buttonColor} ${customClasses}`}
    >
      {submitting ? "..." : buttonLabel}
    </button>
  );

  return (
    <>
      <div 
        onClick={() => setShowModal(true)} 
        className="group relative bg-snd-bg border border-snd-bg hover:border-main/50 rounded-xl min-[2560px]:rounded-2xl min-[3840px]:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer hover:-translate-y-[0.25rem]"
      >
        {/* Banner de Imagen */}
        <div className="relative w-full h-[9rem] sm:h-[11rem] min-[2560px]:h-[16rem] min-[3840px]:h-[24rem] bg-slate-800 overflow-hidden shrink-0">
          {challenge.image ? (
            <img 
              src={challenge.image} 
              alt={challenge.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text opacity-40 text-sm min-[2560px]:text-xl min-[3840px]:text-3xl font-medium">
              {t("challenges.image", "Vista Previa")}
            </div>
          )}
          
          {/* Badge de estado flotante */}
          {statusLabel && (
            <span className={`absolute top-[0.75rem] right-[0.75rem] min-[2560px]:top-[1.25rem] min-[2560px]:right-[1.25rem] min-[3840px]:top-[1.75rem] min-[3840px]:right-[1.75rem] px-[0.75rem] py-[0.25rem] min-[2560px]:px-[1rem] min-[2560px]:py-[0.5rem] min-[3840px]:px-[1.5rem] min-[3840px]:py-[0.75rem] rounded-full text-xs min-[2560px]:text-base min-[3840px]:text-2xl font-black backdrop-blur-md shadow-md ${statusStyle}`}>
              {statusLabel}
            </span>
          )}
        </div>

        {/* Cuerpo de la tarjeta */}
        <div className="p-[1rem] sm:p-[1.25rem] min-[2560px]:p-[2rem] min-[3840px]:p-[3rem] flex flex-col flex-1 justify-between gap-[1rem]">
          <div>
            <h3 className="text-lg sm:text-xl min-[2560px]:text-2xl min-[3840px]:text-4xl font-black text-text leading-snug mb-[0.5rem] group-hover:text-main transition-colors">
              {challenge.title}
            </h3>
            
            {/* Icono */}
            <p className="text-xs sm:text-sm min-[2560px]:text-lg min-[3840px]:text-2xl text-text opacity-75 font-medium flex items-center gap-[0.5rem]">
              <Calendar className="w-[1rem] h-[1rem] min-[2560px]:w-[1.5rem] min-[2560px]:h-[1.5rem] min-[3840px]:w-[2.25rem] min-[3840px]:h-[2.25rem] text-main shrink-0" />
              <span>{challenge.startDate} - {challenge.endDate}</span>
            </p>
          </div>

          <div className="pt-[0.5rem] flex items-center justify-between gap-[0.5rem]">
            <span className="text-xs sm:text-sm min-[2560px]:text-base min-[3840px]:text-2xl text-main font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              {t("challenges.viewMore", "Ver detalles →")}
            </span>
            {renderButton()}
          </div>

          {error && <p className="text-red-500 text-xs min-[2560px]:text-base min-[3840px]:text-xl mt-[0.25rem]">{error}</p>}
        </div>
      </div>

      {/* Modal dtalles del rto */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-[1rem] sm:p-[1.5rem] min-[2560px]:p-[3rem] min-[3840px]:p-[5rem] z-[1500] animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-card-bg border border-snd-bg text-text rounded-2xl min-[2560px]:rounded-3xl min-[3840px]:rounded-[2.5rem] shadow-2xl w-full max-w-[42rem] min-[2560px]:max-w-[64rem] min-[3840px]:max-w-[80rem] max-h-[90vh] overflow-y-auto p-[1.5rem] sm:p-[2rem] min-[2560px]:p-[3.5rem] min-[3840px]:p-[5rem] relative transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-[1rem] right-[1rem] sm:top-[1.5rem] sm:right-[1.5rem] text-2xl min-[2560px]:text-4xl min-[3840px]:text-6xl font-black text-text/60 hover:text-text cursor-pointer transition-colors"
              aria-label={t("common.close", "Cerrar")}
            >
              ✕
            </button>

            <div className="w-full h-[12rem] sm:h-[16rem] min-[2560px]:h-[24rem] min-[3840px]:h-[32rem] rounded-xl min-[2560px]:rounded-2xl min-[3840px]:rounded-3xl bg-snd-bg overflow-hidden mb-[1.5rem]">
              {challenge.image ? (
                <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text opacity-40 text-base min-[2560px]:text-2xl min-[3840px]:text-4xl font-bold">
                  {t("challenges.image", "Vista Previa")}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-[0.75rem] mb-[1rem]">
              <h2 className="text-2xl sm:text-3xl min-[2560px]:text-5xl min-[3840px]:text-7xl font-black text-text">{challenge.title}</h2>
              {statusLabel && (
                <span className={`px-[0.75rem] py-[0.25rem] min-[2560px]:px-[1.25rem] min-[2560px]:py-[0.5rem] min-[3840px]:px-[2rem] min-[3840px]:py-[0.75rem] rounded-full text-xs min-[2560px]:text-lg min-[3840px]:text-2xl font-black ${statusStyle}`}>
                  {statusLabel}
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base min-[2560px]:text-2xl min-[3840px]:text-3xl text-text opacity-70 font-semibold mb-[1.5rem]">
              📅 {t("challenges.start", "Inicio")}: {challenge.startDate} · {t("challenges.end", "Fin")}: {challenge.endDate}
            </p>

            <p className="text-base sm:text-lg min-[2560px]:text-2xl min-[3840px]:text-4xl text-text opacity-90 leading-relaxed mb-[2rem]">
              {challenge.description}
            </p>

            {error && <p className="text-red-500 text-sm min-[2560px]:text-xl min-[3840px]:text-2xl mb-[1rem]">{error}</p>}

            <div className="flex justify-end pt-[1rem] border-t border-snd-bg">
              {renderButton("w-full sm:w-auto")}
            </div>
          </div>
        </div>
      )}

      {/* Modal cnfirmación Cancelar */}
      {showCancelConfirm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-[1rem] sm:p-[1.5rem] min-[2560px]:p-[3rem] min-[3840px]:p-[5rem] z-[1600] animate-fadeIn"
          onClick={(e) => { e.stopPropagation(); setShowCancelConfirm(false); }}
        >
          <div
            className="bg-card-bg border border-snd-bg text-text rounded-2xl min-[2560px]:rounded-3xl shadow-2xl w-full max-w-[28rem] min-[2560px]:max-w-[42rem] min-[3840px]:max-w-[56rem] p-[1.5rem] sm:p-[2rem] min-[2560px]:p-[3rem] min-[3840px]:p-[4rem] transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl sm:text-2xl min-[2560px]:text-4xl min-[3840px]:text-6xl font-black text-text mb-[0.75rem]">{t("challenges.cancelTitle", "¿Cancelar este reto?")}</h3>
            <p className="text-sm sm:text-base min-[2560px]:text-xl min-[3840px]:text-3xl text-text opacity-80 mb-[1.5rem]">
              {t("challenges.cancelBody", "Vas a perder el progreso que llevás en este reto y no vas a poder recuperarlo.")}
            </p>
            <div className="flex gap-[1rem]">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowCancelConfirm(false); }}
                className="flex-1 bg-snd-bg hover:bg-snd-bg/80 text-text rounded-full py-[0.625rem] min-[2560px]:py-[1rem] min-[3840px]:py-[1.5rem] text-sm min-[2560px]:text-xl min-[3840px]:text-3xl font-bold cursor-pointer transition-colors"
              >
                {t("challenges.back", "Volver")}
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={submitting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-full py-[0.625rem] min-[2560px]:py-[1rem] min-[3840px]:py-[1.5rem] text-sm min-[2560px]:text-xl min-[3840px]:text-3xl font-bold cursor-pointer disabled:opacity-60 transition-colors shadow-md"
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