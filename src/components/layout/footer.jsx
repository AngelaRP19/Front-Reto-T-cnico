import { useLingui } from "@lingui/react";

function Footer() {
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  return (
    <footer className="bg-snd-bg px-4 py-6 min-[2560px]:px-10 min-[2560px]:py-9 min-[2560px]:text-lg min-[3840px]:px-16 min-[3840px]:py-12 min-[3840px]:text-2xl text-center text-sm text-text transition-colors duration-[400ms]">
      <p>{t("footer.copyright", "© 2026 The Sims 4 Community")}</p>
    </footer>
  );
}

export default Footer;
