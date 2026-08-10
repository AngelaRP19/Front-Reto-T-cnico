const API_URL = import.meta.env.VITE_API_URL;

export async function getUsers() {
  const response = await fetch(`${API_URL}/nodos/users`);

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  return response.json();
}