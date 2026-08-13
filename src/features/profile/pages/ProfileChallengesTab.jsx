import { useEffect, useState } from "react";
import { useLingui } from "@lingui/react";
import { useAuth } from "../../../context/AuthContext";
import CardChallenge from "../../challenges/components/CardChallenge";
import { getChallenges, getUserChallengeSubscriptions } from "../../challenges/services/challengesService";
import { translateErrorMessage } from "../../../utils/errorMessages";

function ProfileChallengesTab() {
  const { user } = useAuth();
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
        const [list, subs] = await Promise.all([
          getChallenges(i18n.locale),
          user?.id ? getUserChallengeSubscriptions(user.id) : Promise.resolve({}),
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

  const acceptedChallenges = challenges.filter((challenge) => {
    const sub = subscriptions[challenge.id];
    return Boolean(sub) && sub.status !== "CANCELADO";
  });

  return (
    <div className="w-full min-[2560px]:w-[96%] min-[3840px]:w-[98%]">
      <h1 className="text-2xl min-[2560px]:text-5xl min-[3840px]:text-8xl font-extrabold text-text mb-2 min-[2560px]:mb-4 min-[3840px]:mb-6">{t("profile.challenges.title", "Mis retos")}</h1>
      <p className="text-text opacity-70 mb-6 min-[2560px]:mb-10 min-[2560px]:text-xl min-[3840px]:text-[3.8rem]">
        {t("profile.challenges.completed", "Retos finalizados")}: <span className="font-bold text-accent-text">{user?.completedChallenges ?? 0}</span>
      </p>

      {loading ? (
        <p className="text-text text-center py-10 min-[2560px]:py-16 min-[3840px]:py-20 min-[2560px]:text-3xl min-[3840px]:text-[4.4rem]">{t("profile.challenges.loading", "Cargando retos...")}</p>
      ) : error ? (
        <p className="text-text text-center py-10 min-[2560px]:py-16 min-[3840px]:py-20 min-[2560px]:text-3xl min-[3840px]:text-[4.4rem]">{error}</p>
      ) : acceptedChallenges.length === 0 ? (
        <p className="text-text opacity-70 text-center py-10 min-[2560px]:py-16 min-[3840px]:py-20 min-[2560px]:text-2xl min-[3840px]:text-[4.4rem]">{t("profile.challenges.empty", "Todavía no aceptaste ningún reto.")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(26rem,26rem))] min-[2560px]:grid-cols-[repeat(auto-fit,minmax(34rem,34rem))] min-[3840px]:grid-cols-[repeat(auto-fit,minmax(42rem,42rem))] justify-start gap-4 min-[2560px]:gap-6 min-[3840px]:gap-10">
          {acceptedChallenges.map((challenge) => (
            <CardChallenge
              key={challenge.id}
              challenge={challenge}
              subscription={subscriptions[challenge.id] || null}
              userId={user?.id}
              isAuthenticated
              onSubscriptionChange={handleSubscriptionChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfileChallengesTab;
