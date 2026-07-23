import { apiClient, setToken, clearToken } from "../../../services/apiClient";

export async function register(payload) {
  const data = await apiClient.post("/auth/register", payload, { auth: false });
  if (data?.token) setToken(data.token);
  return data;
}

export async function login(email, password) {
  const data = await apiClient.post("/auth/login", { email, password }, { auth: false });
  if (data?.token) setToken(data.token);
  return data;
}

export function logout() {
  clearToken();
}
