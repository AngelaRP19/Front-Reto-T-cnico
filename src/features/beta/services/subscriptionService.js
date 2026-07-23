import { apiClient } from "../../../services/apiClient";

export function createSubscription(payload) {
  return apiClient.post("/nodos/subscriptions/create", payload, { auth: false });
}
