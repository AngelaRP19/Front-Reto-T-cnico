import { useState, useRef } from "react";
import { useLingui } from "@lingui/react";
import useClickOutside from "../../hooks/useClickOutside";

const LANGUAGES = [
  { code: "es", label: "ES", flag: "🇪🇸" },
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
];

function LanguageSelector() {
  const { i18n } = useLingui();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside([dropdownRef], () => setIsOpen(false), isOpen);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.locale) || LANGUAGES[0];

  const handleSelect = (code) => {
    i18n.activate(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-snd-bg/80 text-text text-xs sm:text-sm font-semibold border border-text/10 hover:border-main transition-all duration-200 shadow-sm"
      >
        <span>{currentLang.flag}</span>
        <span>{currentLang.label}</span>
        <span className="text-[0.65rem] opacity-60">▼</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-28 bg-card-bg text-text rounded-xl shadow-xl border border-snd-bg py-1 z-[1500] overflow-hidden transition-all duration-200">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs sm:text-sm text-left hover:bg-main/10 transition-colors ${
                i18n.locale === lang.code ? "font-bold text-main bg-main/5" : "font-medium text-text"
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
