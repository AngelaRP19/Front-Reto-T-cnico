import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import CardChallenge from "../../challenges/components/CardChallenge";
import { getChallenges, getUserChallengeSubscriptions } from "../../challenges/services/challengesService";

export default function ProfileChallengesTab() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [subscriptions, setSubscriptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      const allChallenges = await getChallenges();
      const subs = await getUserChallengeSubscriptions(user.id);
      setChallenges(allChallenges);
      setSubscriptions(subs);
    } catch (err) {
      setError(err.message || "Error al cargar los retos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleSubscriptionChange = (challengeId, newSubscription) => {
    setSubscriptions((prev) => ({ ...prev, [challengeId]: newSubscription }));
  };

  // Filter challenges to only show those the user is subscribed to (not cancelled)
  const activeChallenges = challenges.filter(
    (c) => subscriptions[c.id] && subscriptions[c.id].status !== "CANCELADO"
  );

  const cancelledChallenges = challenges.filter(
    (c) => subscriptions[c.id] && subscriptions[c.id].status === "CANCELADO"
  );

  if (loading) {
    return <p className="text-text text-center py-10">Cargando tus retos...</p>;
  }

  if (error) {
    return <p className="text-red-400 text-center py-10">{error}</p>;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h3 className="text-xl font-extrabold text-text">Mis Retos</h3>
        <p className="text-sm text-text opacity-70 mt-1">
          Administra los retos a los que te has unido en la comunidad.
        </p>
      </div>

      {activeChallenges.length === 0 ? (
        <div className="text-center p-8 rounded-2xl border border-dashed border-snd-bg bg-snd-bg/5 space-y-4">
          <span className="text-4xl block">🏆</span>
          <h4 className="font-bold text-text">No tienes retos activos</h4>
          <p className="text-sm text-text opacity-70 max-w-sm mx-auto">
            ¡Explora la pestaña de comunidad para aceptar nuevos desafíos de la comunidad Simmer y ganar insignias!
          </p>
          <Link
            to="/comunidad"
            className="inline-block bg-main text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-hover transition cursor-pointer"
          >
            Explorar Comunidad
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <h4 className="font-bold text-sm text-text uppercase tracking-wide opacity-75">
            Retos Activos ({activeChallenges.length})
          </h4>
          <div className="flex flex-col gap-4">
            {activeChallenges.map((challenge) => (
              <CardChallenge
                key={challenge.id}
                challenge={challenge}
                subscription={subscriptions[challenge.id]}
                userId={user.id}
                isAuthenticated={true}
                onSubscriptionChange={handleSubscriptionChange}
              />
            ))}
          </div>
        </div>
      )}

      {cancelledChallenges.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-snd-bg">
          <h4 className="font-bold text-sm text-text uppercase tracking-wide opacity-50">
            Historial / Cancelados ({cancelledChallenges.length})
          </h4>
          <div className="flex flex-col gap-4 opacity-75">
            {cancelledChallenges.map((challenge) => (
              <CardChallenge
                key={challenge.id}
                challenge={challenge}
                subscription={subscriptions[challenge.id]}
                userId={user.id}
                isAuthenticated={true}
                onSubscriptionChange={handleSubscriptionChange}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
