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
    async function load() {
      try {
        const list = await getChallenges();
        setChallenges(list);

        if (user?.id) {
          const subs = await getUserChallengeSubscriptions(user.id);
          setSubscriptions(subs);
        }
      } catch (err) {
        setError(translateErrorMessage(err, t("errors.generic", "Ocurrió un error"), i18n));
      } finally {
        setLoading(false);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubscriptionChange = (challengeId, newSubscription) => {
    setSubscriptions((prev) => ({ ...prev, [challengeId]: newSubscription }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-5 py-10">
     <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-2">{t("challenges.title", "Retos")}</h1>
      <p className="text-text opacity-70 mb-8">{t("challenges.description", "Descubrí los desafíos disponibles para tu cuenta.")} </p>

      {loading ? (
        <p className="text-text text-center py-10">{t("challenges.loading", "Cargando retos...")}</p>
      ) : error ? (
        <p className="text-text text-center py-10">{error}</p>
      ) : (
        <div className="flex flex-col gap-4">
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
