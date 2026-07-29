import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import CardChallenge from "../../challenges/components/CardChallenge";
import { getChallenges, getUserChallengeSubscriptions } from "../../challenges/services/challengesService";

function ProfileChallengesTab() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [subscriptions, setSubscriptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [list, subs] = await Promise.all([
          getChallenges(),
          user?.id ? getUserChallengeSubscriptions(user.id) : Promise.resolve({}),
        ]);
        setChallenges(list);
        setSubscriptions(subs);
      } catch (err) {
        setError(err.message);
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

  const acceptedChallenges = challenges.filter((challenge) => {
    const sub = subscriptions[challenge.id];
    return Boolean(sub) && sub.status !== "CANCELADO";
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-text mb-2">Mis retos</h1>
      <p className="text-text opacity-70 mb-6">
        Retos finalizados: <span className="font-bold text-accent">{user?.completedChallenges ?? 0}</span>
      </p>

      {loading ? (
        <p className="text-text text-center py-10">Cargando retos...</p>
      ) : error ? (
        <p className="text-text text-center py-10">{error}</p>
      ) : acceptedChallenges.length === 0 ? (
        <p className="text-text opacity-70 text-center py-10">Todavía no aceptaste ningún reto.</p>
      ) : (
        <div className="flex flex-col gap-4">
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
