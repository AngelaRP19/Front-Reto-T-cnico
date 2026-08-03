import { i18n } from "@lingui/core";

const SUPPORTED_LOCALES = ["es", "en", "fr"];

export function normalizeLocale(locale) {
  const normalizedLocale = (locale || "").toLowerCase();
  return SUPPORTED_LOCALES.includes(normalizedLocale)
    ? normalizedLocale
    : "es";
}

export async function activateLocale(locale) {
  const normalizedLocale = normalizeLocale(locale);
  const { messages } = await import(`./locales/${normalizedLocale}/messages.js`);

  i18n.load(normalizedLocale, messages);
  i18n.activate(normalizedLocale);

  if (typeof window !== "undefined") {
    window.localStorage.setItem("app-locale", normalizedLocale);
  }

  return normalizedLocale;
}

export function getInitialLocale() {
  if (typeof window === "undefined") {
    return "es";
  }

  const storedLocale = window.localStorage.getItem("app-locale");
  return normalizeLocale(storedLocale || navigator.language?.split("-")[0] || "es");
}
