import { useEffect, useState } from "react";
import { useLingui } from "@lingui/react";
import { useAuth } from "../../../context/AuthContext";
import CardChallenge from "../components/CardChallenge";
import { getChallenges, getUserChallengeSubscriptions } from "../services/challengesService";
import { translateErrorMessage } from "../../../utils/errorMessages";

function ChallengesPage() {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  const [challenges, setChallenges] = useState([]);
  const [subscriptions, setSubscriptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const subscriptionsPromise = user?.id
          ? getUserChallengeSubscriptions(user.id)
          : Promise.resolve({});

        const [list, subs] = await Promise.all([
          getChallenges(i18n.locale),
          subscriptionsPromise,
        ]);

        if (cancelled) return;
        setChallenges(list);
        setSubscriptions(subs);
      } catch (err) {
        if (!cancelled) setError(translateErrorMessage(err, t("errors.generic", "Ocurrió un error"), i18n));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.locale]);

  const handleSubscriptionChange = (challengeId, newSubscription) => {
    setSubscriptions((prev) => ({ ...prev, [challengeId]: newSubscription }));
  };

  return (
    <div className="w-full max-w-[80rem] min-[2560px]:max-w-[112.5rem] min-[3840px]:max-w-[168.75rem] mx-auto px-[1rem] sm:px-[1.5rem] min-[2560px]:px-[2.5rem] min-[3840px]:px-[4rem] py-[2rem] sm:py-[3rem] min-[2560px]:py-[4rem] min-[3840px]:py-[6rem]">
      {/* Tarjeta contenedora principal */}
      <div className="bg-card-bg border border-snd-bg rounded-2xl min-[2560px]:rounded-3xl min-[3840px]:rounded-[2.5rem] p-[1.5rem] sm:p-[2.5rem] min-[2560px]:p-[3.5rem] min-[3840px]:p-[5rem] shadow-xl min-[2560px]:shadow-2xl">
        
        {/* Header */}
        <div className="mb-[2rem] min-[2560px]:mb-[3rem] min-[3840px]:mb-[4rem]">
          <span className="inline-block px-[0.75rem] py-[0.25rem] min-[2560px]:px-[1.25rem] min-[2560px]:py-[0.5rem] min-[3840px]:px-[1.75rem] min-[3840px]:py-[0.75rem] rounded-full text-xs sm:text-sm min-[2560px]:text-lg min-[3840px]:text-2xl font-black bg-main/15 text-main tracking-wider uppercase mb-[0.75rem] min-[2560px]:mb-[1.25rem]">
            {t("challenges.badge", "Desafíos de la Comunidad")}
          </span>
          <h1 className="text-3xl sm:text-5xl min-[2560px]:text-6xl min-[3840px]:text-8xl font-black text-text tracking-tight mb-[0.75rem] min-[2560px]:mb-[1.25rem]">
            {t("challenges.title", "Retos")}
          </h1>
          <p className="text-text opacity-75 text-base sm:text-lg min-[2560px]:text-2xl min-[3840px]:text-4xl max-w-[42rem] min-[2560px]:max-w-[56rem] min-[3840px]:max-w-[75rem] font-medium">
            {t("challenges.description", "Descubrí los desafíos disponibles para tu cuenta y demuestra tus habilidades simmers.")}
          </p>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-[4rem] min-[2560px]:py-[6rem] min-[3840px]:py-[9rem]">
            <div className="w-[2.5rem] h-[2.5rem] min-[2560px]:w-[4rem] min-[2560px]:h-[4rem] min-[3840px]:w-[6rem] min-[3840px]:h-[6rem] border-[0.25rem] min-[2560px]:border-[0.5rem] border-main border-t-transparent rounded-full animate-spin mb-[1rem]" />
            <p className="text-text opacity-70 text-lg min-[2560px]:text-2xl min-[3840px]:text-4xl font-semibold">
              {t("challenges.loading", "Cargando retos...")}
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl p-[1.5rem] text-center text-lg min-[2560px]:text-2xl min-[3840px]:text-4xl font-semibold my-[2rem]">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-[2560px]:grid-cols-3 min-[3840px]:grid-cols-3 gap-[1.5rem] sm:gap-[2rem] min-[2560px]:gap-[2.5rem] min-[3840px]:gap-[3.5rem]">
            {challenges.map((challenge) => (
              <CardChallenge
                key={challenge.id}
                challenge={challenge}
                subscription={subscriptions[challenge.id] || null}
                userId={user?.id}
                isAuthenticated={isAuthenticated}
                onSubscriptionChange={handleSubscriptionChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChallengesPage;