import { useEffect, useState } from "react";
import {
  getPlatforms,
  getPlatformsByExpansion,
} from "../services/platformsService";

let cachedPromise = null;

function fetchPlatformsOnce() {
  if (!cachedPromise) {
    cachedPromise = getPlatforms().catch((err) => {
      cachedPromise = null;
      throw err;
    });
  }

  return cachedPromise;
}

export function usePlatforms() {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetchPlatformsOnce()
      .then((data) => {
        if (!cancelled) {
          setPlatforms(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "No se pudieron cargar las plataformas.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    platforms,
    loading,
    error,
  };
}

/**
 * Obtiene las plataformas disponibles para
 * una expansión específica.
 */
export function usePlatformsByExpansion(expansionId, enabled = true) {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (!enabled || !expansionId) {
      setPlatforms([]);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    getPlatformsByExpansion(expansionId)
      .then((data) => {
        if (!cancelled) {
          setPlatforms(data || []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err.message || "No se pudieron cargar las plataformas."
          );
          setPlatforms([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [expansionId, enabled]);

  return {
    platforms,
    loading,
    error,
  };
}