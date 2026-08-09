import { apiClient, setToken, clearToken, markLoggedOut } from "../../../services/apiClient";
import { encryptPayload } from "../../../services/cryptoUtils";

/**
 * Registro de usuario
 */
export async function register(payload) {
  const encryptedPayload = await encryptPayload(payload);
  const data = await apiClient.post("/auth/register", encryptedPayload, { auth: false });
  if (data?.token) setToken(data.token);
  return data;
}

/**
 * Login de usuario
 */
export async function login(username, password) {
  const encryptedPayload = await encryptPayload({ username, password });
  const data = await apiClient.post("/auth/login", encryptedPayload, { auth: false });
  if (data?.token) setToken(data.token);
  return data;
}

/**
 * Logout de usuario
 */
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

/**
 * Sesión OAuth (Google, Meta, etc.)
 */
export async function checkOAuthSession() {
  const data = await apiClient.get("/auth/oauth2/success", { auth: false });
  if (data?.token) setToken(data.token);
  return data;
}

/**
 * Obtener usuario actual
 */
export async function fetchCurrentUser() {
  try {
    return await apiClient.get("/auth/me");
  } catch {
    return null;
  }
}

/**
 * Activar Beta Tester
 */
export function setBetaTester(value) {
  return apiClient.put("/auth/me/betatester", value);
}

/**
 * Solicitar recuperación de contraseña
 * @param {string} email - Correo del usuario
 */
export async function requestPasswordReset(email) {
  try {
    const data = await apiClient.post(
      "/auth/forgot-password",
      { email },
      { auth: false }
    );
    return data;
  } catch (err) {
    if (err.data?.message) {
      throw new Error(err.data.message);
    }
    throw new Error("No se pudo enviar la solicitud de recuperación.");
  }
}

/**
 * Restablecer contraseña con token
 * @param {string} token - Token recibido por correo
 * @param {string} newPassword - Nueva contraseña
 */
export async function resetPassword(token, newPassword) {
  try {
    const data = await apiClient.post(
      "/auth/reset-password",
      { token, newPassword },
      { auth: false }
    );
    return data;
  } catch (err) {
    if (err.data?.message) {
      throw new Error(err.data.message);
    }
    throw new Error("No se pudo restablecer la contraseña.");
  }
}

