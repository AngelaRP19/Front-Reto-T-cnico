import { apiClient } from "../../../services/apiClient";

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function formatChallengeDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  const monthName = MONTHS[Number(month) - 1] || month;
  return `${Number(day)} ${monthName} ${year}`;
}

function mapChallenge(challenge) {
  return {
    id: challenge.id,
    title: challenge.name,
    startDate: formatChallengeDate(challenge.start),
    endDate: formatChallengeDate(challenge.end),
    description: challenge.description,
    image: challenge.imageURL,
  };
}

export async function getChallenges() {
  const challenges = await apiClient.get("/nodos/challenges", { auth: false });
  return (challenges || []).map(mapChallenge);
}

export async function getUserChallengeSubscriptions(userId) {
  const subscriptions = await apiClient.get(`/nodos/subscriptionchallenges/user/${userId}`);
  const byChallenge = {};
  (subscriptions || []).forEach((sub) => {
    if (sub.challenge?.id != null) {
      byChallenge[sub.challenge.id] = { subscriptionId: sub.id, status: sub.status };
    }
  });
  return byChallenge;
}

export function acceptChallenge(userId, challengeId) {
  return apiClient.post("/nodos/subscriptionchallenges/create", {
    user: { id: userId },
    challenge: { id: challengeId },
  });
}

export function cancelChallenge(subscriptionId) {
  return apiClient.put(`/nodos/subscriptionchallenges/${subscriptionId}`, { status: "CANCELADO" });
}

export function reactivateChallenge(subscriptionId) {
  return apiClient.put(`/nodos/subscriptionchallenges/${subscriptionId}`, { status: "INICIADO" });
}
