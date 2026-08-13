import { useLingui } from "@lingui/react";

function Hero({ onExploreClick }) {
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  return (
    <section className="flex flex-col lg:flex-row items-center lg:items-stretch justify-between text-center lg:text-left gap-8 lg:gap-12 px-5 py-10 md:px-20 md:py-[3.75rem] min-[2560px]:px-24 min-[2560px]:py-14 min-[2560px]:gap-16 min-[3840px]:px-32 min-[3840px]:py-20 min-[3840px]:gap-20 bg-snd-bg overflow-hidden transition-colors duration-[400ms]">
      <div className="w-full lg:flex-[1.15] lg:max-w-[38rem] min-[2560px]:max-w-[56rem] min-[3840px]:max-w-[70rem] flex flex-col justify-center">
        <h1 className="text-[2.8rem] md:text-[3.4rem] lg:text-[4.2rem] min-[2560px]:text-[5.8rem] min-[3840px]:text-[8rem] text-text mb-[0.9375rem] lg:mb-6 min-[2560px]:mb-7 min-[3840px]:mb-10 leading-[0.95]">{t("hero.title", "Expande tu mundo")}</h1>
        <p className="text-xl md:text-[1.45rem] lg:text-[1.75rem] min-[2560px]:text-[2.5rem] min-[3840px]:text-[3.5rem] text-text mb-[1.5625rem] lg:mb-8 min-[2560px]:mb-9 min-[3840px]:mb-12 leading-snug max-w-[36ch] lg:max-w-[28ch] min-[2560px]:max-w-[34ch]">{t("hero.description", "Descubre los últimos packs de expansión para PC y Móvil.")}</p>

        <button
          type="button"
          onClick={onExploreClick}
          className="self-center lg:self-start bg-accent text-text border-none px-6 py-3 lg:px-7 lg:py-3.5 lg:text-[1.05rem] min-[2560px]:px-8 min-[2560px]:py-3.5 min-[2560px]:text-[1.3rem] min-[3840px]:px-11 min-[3840px]:py-4 min-[3840px]:text-[1.75rem] rounded-lg min-[2560px]:rounded-2xl font-bold cursor-pointer transition-colors duration-300 hover:bg-hover"
        >
          {t("hero.button", "Explorar")}
        </button>
      </div>

      <div className="w-full lg:flex-[1.3] flex justify-center items-center h-[12rem] md:h-auto min-[2560px]:h-[22rem] min-[3840px]:h-[30rem]">
        <img
          width={960}
          height={540}
          className="w-full max-w-[36rem] lg:max-w-[44rem] min-[2560px]:max-w-[54rem] min-[3840px]:max-w-[62rem] h-auto object-cover rounded-xl min-[2560px]:rounded-3xl shadow-[0_0.375rem_1.25rem_rgba(0,0,0,0.5)]"
          src="https://res.cloudinary.com/w1jl4sa5/image/upload/v1784588991/TS4_Royalty-and-Legacy_Sale-Hero_16x9-ES_mmadik.avif"
          alt={t("hero.imageAlt", "Imagen Hero")}
        />
      </div>
    </section>
  );
}

export default Hero;
