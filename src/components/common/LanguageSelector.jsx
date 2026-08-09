import { useEffect, useState } from "react";
import { useLingui } from "@lingui/react";
import { activateLocale, getInitialLocale, normalizeLocale } from "../../i18n";
import useLocaleStore from "../../store/localeStore";

function LanguageSelector() {
  const { i18n } = useLingui();
  const { locale: storedLocale, setLocale: setStoredLocale } = useLocaleStore();
  const [locale, setLocale] = useState(() => normalizeLocale(storedLocale || i18n?.locale || getInitialLocale()));

  useEffect(() => {
    setLocale(normalizeLocale(storedLocale || i18n?.locale || getInitialLocale()));
  }, [storedLocale, i18n?.locale]);

  const handleChange = async (newLocale) => {
    const normalizedLocale = normalizeLocale(newLocale);
    setLocale(normalizedLocale);
    await activateLocale(normalizedLocale);
    setStoredLocale(normalizedLocale);
  };

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      className="bg-card-bg text-text border border-gray-300 rounded-full px-3 py-2 text-sm focus:outline-none"
      aria-label="Select language"
    >
      <option value="es">🇪🇸 ES</option>
      <option value="en">🇺🇸 EN</option>
      <option value="fr">🇫🇷 FR</option>
    </select>
  );
}

export default LanguageSelector;