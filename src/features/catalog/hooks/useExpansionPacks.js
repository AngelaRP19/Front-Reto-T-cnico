import { useEffect, useState } from "react";
import { useLingui } from "@lingui/react";
import { getExpansionPacks } from "../services/expansionsService";

// Cacheado por idioma: cambiar de ES a EN y volver a ES no vuelve a pedirle
// al backend, pero cada idioma se pide (una vez) apenas se selecciona.
const cachedPromises = {};

function fetchExpansionPacksOnce(locale) {
  if (!cachedPromises[locale]) {
    cachedPromises[locale] = getExpansionPacks(locale).catch((err) => {
      // Si falla, se limpia el cache para que el próximo intento reintente en vez de quedar pegado en el error.
      delete cachedPromises[locale];
      throw err;
    });
  }
  return cachedPromises[locale];
}

export function useExpansionPacks() {
  const { i18n } = useLingui();
  const locale = i18n.locale;
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchExpansionPacksOnce(locale)
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
  }, [locale]);

  return { packs, loading, error };
}
