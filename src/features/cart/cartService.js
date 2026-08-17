import { apiClient, API_BASE_URL, getToken } from "../../services/apiClient";
import { i18n } from "@lingui/core";

export function addToBackendCart(expansionId, platformId) {
  return apiClient.post(`/nodos/cart/add?expansionId=${expansionId}&platformId=${platformId}`);
}

// El backend espera el método de pago como texto plano (ej. "CARD"), no JSON —
// apiClient siempre serializa el body como JSON, así que este endpoint necesita
// su propio fetch.
export async function purchaseCart(paymentMethod) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/nodos/buys/purchase`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "text/plain",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: paymentMethod,
  });

  const rawText = await response.text().catch(() => "");
  let data = null;
  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = rawText;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "string" && data.trim()
        ? data
        : i18n._({ id: "cart.page.purchaseError", message: "No se pudo procesar la compra." });
    throw new Error(message);
  }

  return data;
}
