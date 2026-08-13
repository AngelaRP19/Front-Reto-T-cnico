import { useLingui } from "@lingui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import LanguageSelector from "../../../components/common/LanguageSelector";

function ProfileSettingsTab() {
  const { theme, toggleTheme } = useTheme();
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  return (
    <div className="bg-card-bg rounded-2xl min-[2560px]:rounded-3xl shadow-sm border border-snd-bg p-6 sm:p-8 min-[2560px]:p-12 min-[3840px]:p-16 transition-colors duration-300">
      <h1 className="text-2xl min-[2560px]:text-5xl min-[3840px]:text-7xl font-extrabold text-text mb-6 min-[2560px]:mb-10">{t("profile.settings.title", "Configuración")}</h1>

      <div className="flex items-center justify-between py-4 min-[2560px]:py-7 min-[3840px]:py-9 border-b border-snd-bg">
        <div>
          <p className="font-bold min-[2560px]:text-2xl min-[3840px]:text-4xl text-text">{t("profile.settings.theme", "Tema")}</p>
          <p className="text-sm min-[2560px]:text-xl min-[3840px]:text-3xl text-text opacity-70">{t("profile.settings.themeDescription", "Elegí cómo se ve la app.")}</p>
        </div>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 min-[2560px]:gap-3 bg-snd-bg text-text px-4 py-2 min-[2560px]:px-7 min-[2560px]:py-4 min-[3840px]:px-10 min-[3840px]:py-5 rounded-full font-bold min-[2560px]:text-xl min-[3840px]:text-3xl hover:opacity-80 transition cursor-pointer"
        >
          {theme === "light" ? (
            <>
              <Moon size={18} /> {t("profile.settings.dark", "Oscuro")}
            </>
          ) : (
            <>
              <Sun size={18} /> {t("profile.settings.light", "Claro")}
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between py-4 min-[2560px]:py-7 min-[3840px]:py-9">
        <div>
          <p className="font-bold min-[2560px]:text-2xl min-[3840px]:text-4xl text-text">{t("profile.settings.language", "Idioma")}</p>
          <p className="text-sm min-[2560px]:text-xl min-[3840px]:text-3xl text-text opacity-70">{t("profile.settings.languageDescription", "Elegí el idioma de la app.")}</p>
        </div>
        <LanguageSelector />
      </div>
    </div>
  );
}

export default ProfileSettingsTab;
