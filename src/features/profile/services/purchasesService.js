import { apiClient } from "../../../services/apiClient";

export function getMyPurchases() {
  return apiClient.get("/nodos/buys");
}
