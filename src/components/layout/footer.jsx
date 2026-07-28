import { useTranslation } from "react-i18next";

function Footer() {

  const { t } = useTranslation();

  return (
    <footer className="bg-snd-bg transition-colors duration-[400ms]">
      <p>{t("footer.copyright")}</p>
    </footer>
  );
}

export default Footer;
