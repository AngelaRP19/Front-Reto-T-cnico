import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { normalizeLocale, activateLocale, getInitialLocale } from "../i18n";

const DEFAULT_LOCALE = getInitialLocale();

const useLocaleStore = create(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: async (newLocale) => {
        const normalizedLocale = normalizeLocale(newLocale);
        await activateLocale(normalizedLocale);
        set({ locale: normalizedLocale });
      },
    }),
    {
      name: "app-locale-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ locale: state.locale }),
    }
  )
);

export default useLocaleStore;
