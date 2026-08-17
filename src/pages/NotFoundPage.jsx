import { Link } from "react-router-dom";
import { useLingui } from "@lingui/react";

function NotFoundPage() {
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4 min-[2560px]:gap-8 bg-bg text-text px-5 min-[2560px]:px-10 min-[3840px]:px-16 text-center transition-colors duration-400">
      <h1 className="text-6xl min-[2560px]:text-9xl min-[3840px]:text-[10rem] font-extrabold text-main">404</h1>
      <p className="text-lg min-[2560px]:text-3xl min-[3840px]:text-5xl opacity-80">{t("notFound.body", "Esta página no existe.")}</p>
      <Link
        to="/"
        className="mt-4 min-[2560px]:mt-8 bg-main text-bg px-6 py-3 min-[2560px]:px-10 min-[2560px]:py-5 min-[2560px]:text-2xl min-[3840px]:px-14 min-[3840px]:py-7 min-[3840px]:text-4xl rounded-full font-bold hover:bg-hover transition"
      >
        {t("auth.backToHome", "Volver al inicio")}
      </Link>
    </div>
  );
}

export default NotFoundPage;
