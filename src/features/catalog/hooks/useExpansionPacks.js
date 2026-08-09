import { useEffect, useState } from "react";
import useLocaleStore from "../../../store/localeStore";
import { getExpansionPacks } from "../services/expansionsService";

export function useExpansionPacks() {
  const locale = useLocaleStore((state) => state.locale);
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getExpansionPacks()
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
