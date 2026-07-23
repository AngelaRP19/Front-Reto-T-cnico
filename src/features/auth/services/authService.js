import { apiClient, setToken, clearToken } from "../../../services/apiClient";

export async function register(payload) {
  const data = await apiClient.post("/auth/register", payload, { auth: false });
  if (data?.token) setToken(data.token);
  return data;
}

export async function login(username, password) {
  const data = await apiClient.post("/auth/login", { username, password }, { auth: false });
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
  }
}

export async function checkOAuthSession() {
  const data = await apiClient.get("/auth/oauth2/success", { auth: false });
  if (data?.token) setToken(data.token);
  return data;
}
