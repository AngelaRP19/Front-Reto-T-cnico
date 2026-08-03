import { useLingui } from "@lingui/react";
import { useTheme } from "../../../context/ThemeContext";

function ProfileSettingsTab() {
  const { theme, toggleTheme } = useTheme();
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  return (
    <div className="bg-card-bg rounded-2xl shadow-sm border border-snd-bg p-6 sm:p-8 transition-colors duration-300">
      <h1 className="text-2xl font-extrabold text-text mb-6">{t("profile.settings.title", "Configuración")}</h1>

      <div className="flex items-center justify-between py-4 border-b border-snd-bg">
        <div>
          <p className="font-bold text-text">{t("profile.settings.theme", "Tema")}</p>
          <p className="text-sm text-text opacity-70">{t("profile.settings.themeDescription", "Elegí cómo se ve la app.")}</p>
        </div>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 bg-snd-bg text-text px-4 py-2 rounded-full font-bold hover:opacity-80 transition cursor-pointer"
        >
          {theme === "light" ? t("profile.settings.dark", "🌙 Oscuro") : t("profile.settings.light", "☀️ Claro")}
        </button>
      </div>

      <div className="flex items-center justify-between py-4">
        <div>
          <p className="font-bold text-text">{t("profile.settings.language", "Idioma")}</p>
          <p className="text-sm text-text opacity-70">{t("profile.settings.languageDescription", "Próximamente vas a poder cambiar el idioma acá.")}</p>
        </div>
        <select
          disabled
          value="es"
          onChange={() => {}}
          className="px-4 py-2 rounded-full bg-snd-bg text-text opacity-60 font-bold cursor-not-allowed"
        >
          <option value="es">{t("profile.settings.spanish", "Español")}</option>
        </select>
      </div>
    </div>
  );
}

export default ProfileSettingsTab;
