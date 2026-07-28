import { apiClient } from "../../../services/apiClient";

export function updateProfile(payload) {
  return apiClient.put("/auth/me", payload);
}

export function changePassword(payload) {
  return apiClient.put("/auth/me/password", payload);
}
