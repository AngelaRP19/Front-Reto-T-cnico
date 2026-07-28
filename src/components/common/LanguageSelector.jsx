import { useTranslation } from "react-i18next";

function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.resolvedLanguage?.substring(0, 2) || "es"}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="bg-card-bg text-text border border-gray-300 rounded-full px-3 py-2 text-sm focus:outline-none"
    >
      <option value="es">ES</option>
      <option value="en">EN</option>
      <option value="fr">FR</option>
      </select>
  );
}

export default LanguageSelector;