import { useLingui } from "@lingui/react";

function Hero({ onExploreClick }) {
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  return (
    <section className="flex flex-col lg:flex-row items-center justify-between text-center lg:text-left gap-10 lg:gap-0 px-5 py-10 md:px-20 md:py-[3.75rem] bg-snd-bg overflow-hidden transition-colors duration-[400ms]">
      <div className="w-full lg:w-auto lg:max-w-[25rem]">
        <h1 className="text-[2.5rem] md:text-[2.25rem] text-text mb-[0.9375rem]">{t("hero.title", "Expande tu mundo")}</h1>
        <p className="text-lg text-text mb-[1.5625rem]">{t("hero.description", "Descubre los últimos packs de expansión para PC y Móvil.")}</p>

        <button
          onClick={onExploreClick}
          className="bg-accent text-text border-none px-6 py-3 rounded-lg font-bold cursor-pointer transition-colors duration-300 hover:bg-hover"
        >
          {t("hero.button", "Explorar")}
        </button>
      </div>

      <div className="flex-1 w-full lg:w-auto flex justify-center items-center h-[13.75rem] md:h-auto">
        <img
          width={400}
          height={225}
          src="https://res.cloudinary.com/w1jl4sa5/image/upload/f_auto,q_auto,w_480/v1784588991/TS4_Royalty-and-Legacy_Sale-Hero_16x9-ES_mmadik.avif"
          srcSet="
          https://res.cloudinary.com/w1jl4sa5/image/upload/f_auto,q_auto,w_400/v1784588991/TS4_Royalty-and-Legacy_Sale-Hero_16x9-ES_mmadik.avif 400w,
          https://res.cloudinary.com/w1jl4sa5/image/upload/f_auto,q_auto,w_640/v1784588991/TS4_Royalty-and-Legacy_Sale-Hero_16x9-ES_mmadik.avif 640w"
          sizes="(max-width: 1023px) 372px, 600px"
          fetchPriority="high"
          className="w-full max-w-[37.5rem] h-auto object-cover rounded-xl shadow-[0_0.375rem_1.25rem_rgba(0,0,0,0.5)]"
          alt={t("hero.imageAlt", "Imagen Hero")}
        />
      </div>
    </section>
  );
}

export default Hero;
