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
        const list = await getChallenges(i18n.locale);
        if (cancelled) return;
        setChallenges(list);

        if (user?.id) {
          const subs = await getUserChallengeSubscriptions(user.id);
          if (!cancelled) setSubscriptions(subs);
        }
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
    <div className="w-full max-w-none ml-0 mr-auto px-5 min-[2560px]:px-10 min-[3840px]:px-14 py-10 min-[2560px]:py-16 min-[3840px]:py-24">
    <h1 className="text-3xl sm:text-4xl min-[2560px]:text-6xl min-[3840px]:text-8xl font-extrabold text-text mb-3 min-[2560px]:mb-5">{t("challenges.title", "Retos")}</h1>
     <p className="text-text opacity-80 mb-8 min-[2560px]:mb-12 text-lg sm:text-xl min-[2560px]:text-3xl min-[3840px]:text-4xl">{t("challenges.description", "Descubrí los desafíos disponibles para tu cuenta.")} </p>

      {loading ? (
        <p className="text-text text-center py-10 min-[2560px]:py-16 min-[3840px]:py-20 min-[2560px]:text-3xl min-[3840px]:text-4xl">{t("challenges.loading", "Cargando retos...")}</p>
      ) : error ? (
        <p className="text-text text-center py-10 min-[2560px]:py-16 min-[3840px]:py-20 min-[2560px]:text-3xl min-[3840px]:text-4xl">{error}</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-4 min-[2560px]:gap-6 min-[3840px]:gap-8">
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
  );
}

export default ChallengesPage;
