import { useEffect, useState } from "react";
import useLocaleStore from "../../../store/localeStore";
import {
  getPlatforms,
  getPlatformsByExpansion,
} from "../services/platformsService";

export function usePlatforms() {
  const locale = useLocaleStore((state) => state.locale);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    getPlatforms()
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
  }, [expansionId, enabled, locale]);

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