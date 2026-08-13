import { useEffect, useState } from "react";
import { useLingui } from "@lingui/react";
import { useAuth } from "../../../context/AuthContext";
import { getMyBetaTestHistory } from "../services/betaTestingService";
import { translateErrorMessage } from "../../../utils/errorMessages";

const STATUS_STYLES = {
  EN_PRUEBA: "bg-blue-100 text-blue-700",
  FINALIZADO: "bg-accent/10 text-accent-text",
  CANCELADO: "bg-red-100 text-red-700",
};

function formatDate(value, locale) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(locale || "es-CO", { day: "numeric", month: "long", year: "numeric" });
}

function ProfileBetaTestingTab() {
  const { user } = useAuth();
  const { i18n } = useLingui();
  const t = (id, message, values) => i18n._({ id, message, values });

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (!user?.id) return undefined;

    getMyBetaTestHistory(user.id)
      .then((data) => {
        if (!cancelled) setHistory(data);
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
  }, [user?.id]);

  return (
    <div className="bg-card-bg rounded-2xl min-[2560px]:rounded-3xl shadow-sm border border-snd-bg p-6 sm:p-8 min-[2560px]:p-12 min-[3840px]:p-16 transition-colors duration-300">
      <h1 className="text-2xl min-[2560px]:text-5xl min-[3840px]:text-7xl font-extrabold text-text mb-2 min-[2560px]:mb-4">{t("profile.betaTesting.title", "Historial de beta testing")}</h1>
      <p className="text-sm min-[2560px]:text-xl min-[3840px]:text-3xl text-text opacity-70 mb-6 min-[2560px]:mb-10">
        {t("profile.betaTesting.description", "Paquetes de expansión en los que participaste como beta tester.")}
      </p>

      {loading ? (
        <p className="text-text text-center py-10">{t("profile.betaTesting.loading", "Cargando historial...")}</p>
      ) : error ? (
        <p className="text-text text-center py-10">{error}</p>
      ) : history.length === 0 ? (
        <p className="text-text opacity-70 text-center py-10">
          {t("profile.betaTesting.empty", "Todavía no participaste en ninguna prueba beta.")}
        </p>
      ) : (
        <div className="grid grid-cols-1 min-[2560px]:grid-cols-2 min-[3840px]:grid-cols-3 gap-4 min-[2560px]:gap-6 min-[3840px]:gap-8">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="w-full bg-snd-bg/50 border border-snd-bg rounded-2xl min-[2560px]:rounded-3xl p-4 sm:p-5 min-[2560px]:p-8 min-[3840px]:p-10 shadow-sm transition-colors duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl bg-snd-bg overflow-hidden shrink-0">
                  {entry.image ? (
                    <img src={entry.image} alt={entry.title} className="w-full h-full object-cover" />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg min-[2560px]:text-3xl min-[3840px]:text-4xl font-bold text-text truncate">{entry.title}</h3>
                  <p className="text-xs sm:text-sm min-[2560px]:text-lg min-[3840px]:text-2xl text-text opacity-60 mt-1 min-[2560px]:mt-2 flex items-center gap-2 min-[2560px]:gap-3 flex-wrap">
                    <span>{t("profile.betaTesting.startDate", "Inicio")}: {formatDate(entry.startDate, i18n.locale)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[entry.status] || ""}`}>
                      {t(`profile.betaTesting.status.${entry.status}`, entry.status)}
                    </span>
                  </p>
                </div>
              </div>

              {entry.feedback && (
                <p className="text-sm min-[2560px]:text-xl min-[3840px]:text-3xl text-text opacity-80 mt-3 min-[2560px]:mt-5 pt-3 min-[2560px]:pt-5 border-t border-snd-bg">
                  <span className="font-bold">{t("profile.betaTesting.feedback", "Comentarios")}:</span> {entry.feedback}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfileBetaTestingTab;
