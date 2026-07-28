import { useEffect, useState } from "react";
import { getExpansionPacks } from "../services/expansionsService";

let cachedPromise = null;

function fetchExpansionPacksOnce() {
  if (!cachedPromise) {
    cachedPromise = getExpansionPacks().catch((err) => {
      // Si falla, se limpia el cache para que el próximo montaje reintente en vez de quedar pegado en el error.
      cachedPromise = null;
      throw err;
    });
  }
  return cachedPromise;
}

export function useExpansionPacks() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetchExpansionPacksOnce()
      .then((data) => {
        if (!cancelled) setPacks(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { packs, loading, error };
}
