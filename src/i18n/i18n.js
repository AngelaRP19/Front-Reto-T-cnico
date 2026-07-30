import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Español
import commonEs from "./locales/es/common.json";
import navbarEs from "./locales/es/navbar.json";
import heroEs from "./locales/es/hero.json";
import authEs from "./locales/es/auth.json";
import catalogEs from "./locales/es/catalog.json";
import betaEs from "./locales/es/beta.json";
import footerEs from "./locales/es/footer.json";
import challengesEs from "./locales/es/challenges.json";

// Inglés
import commonEn from "./locales/en/common.json";
import navbarEn from "./locales/en/navbar.json";
import heroEn from "./locales/en/hero.json";
import authEn from "./locales/en/auth.json";
import catalogEn from "./locales/en/catalog.json";
import betaEn from "./locales/en/beta.json";
import footerEn from "./locales/en/footer.json";
import challengesEn from "./locales/en/challenges.json";

// Francés
import commonFr from "./locales/fr/common.json";
import navbarFr from "./locales/fr/navbar.json";
import heroFr from "./locales/fr/hero.json";
import authFr from "./locales/fr/auth.json";
import catalogFr from "./locales/fr/catalog.json";
import betaFr from "./locales/fr/beta.json";
import footerFr from "./locales/fr/footer.json";
import challengesFr from "./locales/fr/challenges.json";

import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        common: commonEs,
        navbar: navbarEs,
        hero: heroEs,
        auth: authEs,
        catalog: catalogEs,
        beta: betaEs,
        footer: footerEs,
        challenges: challengesEs,
      },
      en: {
        common: commonEn,
        navbar: navbarEn,
        hero: heroEn,
        auth: authEn,
        catalog: catalogEn,
        beta: betaEn,
        footer: footerEn,
        challenges: challengesEn,
      },
      fr: {
        common: commonFr,
        navbar: navbarFr,
        hero: heroFr,
        auth: authFr,
        catalog: catalogFr,
        beta: betaFr,
        footer: footerFr,
        challenges: challengesFr,
      },
    },

    lng: localStorage.getItem("i18nextLng") || "es",
    fallbackLng: "es",

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },

    // Namespaces disponibles
    ns: [
      "common",
      "navbar",
      "hero",
      "auth",
      "catalog",
      "beta",
      "footer",
      "challenges",
    ],

    // Namespace por defecto
    defaultNS: "common",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;