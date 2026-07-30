import { useState } from "react";
import { useLingui } from "@lingui/react";
import { activateLocale, getInitialLocale, normalizeLocale } from "../../i18n";

function LanguageSelector() {
  const { i18n } = useLingui();
  const [locale, setLocale] = useState(() => normalizeLocale(i18n.locale || getInitialLocale()));

  const handleChange = async (newLocale) => {
    const normalizedLocale = normalizeLocale(newLocale);
    setLocale(normalizedLocale);
    await activateLocale(normalizedLocale);
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