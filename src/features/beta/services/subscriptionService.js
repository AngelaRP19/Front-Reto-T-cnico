
import api from "../../../api/axios"; // o tu cliente Axios configurado

export async function createSubscription(data) {
  try {
    const response = await api.post("/subscriptions", data);
    return response.data;
  } catch (error) {
    console.error("Error creando suscripción:", error);
    throw error;
  }
}
