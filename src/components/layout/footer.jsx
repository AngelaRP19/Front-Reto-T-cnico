import { useLingui } from "@lingui/react";

function Footer() {
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  return (
    <footer className="bg-snd-bg transition-colors duration-[400ms]">
      <p>{t("footer.copyright", "© 2026 The Sims 4 Community")}</p>
    </footer>
  );
}

export default Footer;
