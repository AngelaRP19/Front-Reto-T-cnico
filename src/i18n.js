import { i18n } from "@lingui/core";

export async function activateLocale(locale) {
  switch (locale) {
    case "es":
      const { messages: esMessages } = await import("./locales/es/messages.js");
      i18n.load("es", esMessages);
      i18n.activate("es");
      break;
    case "en":
    default:
      const { messages: enMessages } = await import("./locales/en/messages.js");
      i18n.load("en", enMessages);
      i18n.activate("en");
      break;
  }
}
