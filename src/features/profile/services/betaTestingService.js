import { apiClient } from "../../../services/apiClient";

function mapBetaTest(entry) {
  return {
    id: entry.id,
    packId: entry.expansionPack?.id,
    title: entry.expansionPack?.name,
    image: entry.expansionPack?.URLImage,
    platform: entry.expansionPack?.platforms,
    status: entry.status,
    startDate: entry.startDate,
    endDate: entry.endDate,
    feedback: entry.feedback,
  };
}

export async function getMyBetaTestHistory(userId) {
  const history = await apiClient.get(`/nodos/expansionpackbetatests/user/${userId}`);
  return (history || []).map(mapBetaTest);
}
