import { apiClient } from "../../../services/apiClient";

function formatPrice(value) {
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return String(value ?? "");
  return `$${num.toLocaleString("es-CO")} COP`;
}

function mapExpansionPack(pack) {
  return {
    id: pack.id,
    title: pack.name,
    category: pack.category,
    price: formatPrice(pack.price),
    platform: pack.platforms,
    releaseDate: pack.publicationDate,
    description: pack.description,
    features: pack.characteristics || [],
    image: pack.URLImage,
    screenshots: pack.screenshots || [],
    minRequirements: pack.minimumRequirements || [],
    recommendedRequirements: pack.recommendedRequirements || [],
  };
}

export async function getExpansionPacks(lang) {
  const query = lang ? `?lang=${encodeURIComponent(lang)}` : "";
  const packs = await apiClient.get(`/nodos/expansionpacks${query}`, { auth: false });
  return (packs || []).map(mapExpansionPack);
}
