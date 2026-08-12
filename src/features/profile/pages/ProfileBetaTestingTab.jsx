import { useEffect, useState } from "react";
import { useLingui } from "@lingui/react";
import { useAuth } from "../../../context/AuthContext";
import { getMyBetaTestHistory } from "../services/betaTestingService";
import { translateErrorMessage } from "../../../utils/errorMessages";

const STATUS_STYLES = {
  EN_PRUEBA: "bg-blue-100 text-blue-700",
  FINALIZADO: "bg-green-100 text-green-700",
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
    <div className="bg-card-bg rounded-2xl shadow-sm border border-snd-bg p-6 sm:p-8 transition-colors duration-300">
      <h1 className="text-2xl font-extrabold text-text mb-2">{t("profile.betaTesting.title", "Historial de beta testing")}</h1>
      <p className="text-sm text-text opacity-70 mb-6">
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
        <div className="flex flex-col gap-4">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="w-full bg-snd-bg/50 border border-snd-bg rounded-2xl p-4 sm:p-5 shadow-sm transition-colors duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl bg-snd-bg overflow-hidden shrink-0">
                  {entry.image ? (
                    <img src={entry.image} alt={entry.title} className="w-full h-full object-cover" />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-text truncate">{entry.title}</h3>
                  <p className="text-xs sm:text-sm text-text opacity-60 mt-1 flex items-center gap-2 flex-wrap">
                    <span>{t("profile.betaTesting.startDate", "Inicio")}: {formatDate(entry.startDate, i18n.locale)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[entry.status] || ""}`}>
                      {t(`profile.betaTesting.status.${entry.status}`, entry.status)}
                    </span>
                  </p>
                </div>
              </div>

              {entry.feedback && (
                <p className="text-sm text-text opacity-80 mt-3 pt-3 border-t border-snd-bg">
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
