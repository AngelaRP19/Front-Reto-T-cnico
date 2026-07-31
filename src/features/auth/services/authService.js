import { apiClient, setToken, clearToken, markLoggedOut } from "../../../services/apiClient";
import { encryptPayload } from "../../../services/cryptoUtils";

export async function register(payload) {
  const encryptedPayload = await encryptPayload(payload);
  const data = await apiClient.post("/auth/register", encryptedPayload, { auth: false });
  if (data?.token) setToken(data.token);
  return data;
}

export async function login(username, password) {
  const encryptedPayload = await encryptPayload({ username, password });
  const data = await apiClient.post("/auth/login", encryptedPayload, { auth: false });
  if (data?.token) setToken(data.token);
  return data;
}

export async function logout() {
  try {
    await apiClient.post("/auth/logout", undefined, { auth: true });
  } catch {
    // Si falla la llamada al backend, igual se limpia la sesión localmente.
  } finally {
    clearToken();
    markLoggedOut();
  }
}

export async function checkOAuthSession() {
  const data = await apiClient.get("/auth/oauth2/success", { auth: false });
  if (data?.token) setToken(data.token);
  return data;
}

export async function fetchCurrentUser() {
  try {
    return await apiClient.get("/auth/me");
  } catch {
    return null;
  }
}

export function setBetaTester(value) {
  return apiClient.put("/auth/me/betatester", value);
}
