import { apiClient } from "../../../services/apiClient";

function mapPlatform(platform) {
  return {
    id: platform.id,
    name: platform.name,
  };
}

export async function getPlatforms() {
  const platforms = await apiClient.get("/nodos/platform", {
    auth: false,
  });

  return (platforms || []).map(mapPlatform);
}

/**
 * Obtiene únicamente las plataformas disponibles
 * para una expansión específica.
 */
export async function getPlatformsByExpansion(expansionId) {
  const platforms = await apiClient.get(
    `/nodos/expansionpacks/${expansionId}/platforms`,
    {
      auth: false,
    }
  );

  return platforms || [];
}