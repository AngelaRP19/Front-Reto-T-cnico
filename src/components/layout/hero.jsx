import { useLingui } from "@lingui/react";

function Hero({ onExploreClick }) {
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });

  return (
    <section className="flex flex-col lg:flex-row items-center justify-between text-center lg:text-left gap-10 lg:gap-0 px-5 py-10 md:px-20 md:py-[3.75rem] min-[2560px]:px-24 min-[2560px]:py-14 min-[2560px]:gap-20 min-[3840px]:px-32 min-[3840px]:py-20 min-[3840px]:gap-28 bg-snd-bg overflow-hidden transition-colors duration-[400ms]">
      <div className="w-full lg:w-auto lg:max-w-[25rem] min-[2560px]:max-w-[44rem] min-[3840px]:max-w-[56rem]">
        <h1 className="text-[2.5rem] md:text-[2.25rem] min-[2560px]:text-[4.25rem] min-[3840px]:text-[5.8rem] text-text mb-[0.9375rem] min-[2560px]:mb-6 min-[3840px]:mb-8 leading-tight">{t("hero.title", "Expande tu mundo")}</h1>
        <p className="text-lg min-[2560px]:text-[1.9rem] min-[3840px]:text-[2.6rem] text-text mb-[1.5625rem] min-[2560px]:mb-8 min-[3840px]:mb-10 leading-snug">{t("hero.description", "Descubre los últimos packs de expansión para PC y Móvil.")}</p>

        <button
          type="button"
          onClick={onExploreClick}
          className="bg-accent text-text border-none px-6 py-3 min-[2560px]:px-12 min-[2560px]:py-5 min-[2560px]:text-[2rem] min-[3840px]:px-16 min-[3840px]:py-7 min-[3840px]:text-[2.8rem] rounded-lg min-[2560px]:rounded-2xl font-bold cursor-pointer transition-colors duration-300 hover:bg-hover"
        >
          {t("hero.button", "Explorar")}
        </button>
      </div>

      <div className="flex-1 w-full lg:w-auto flex justify-center items-center h-[12rem] md:h-auto min-[2560px]:h-[22rem] min-[3840px]:h-[30rem]">
        <img
          width={960}
          height={540}
          className="w-full max-w-[31rem] min-[2560px]:max-w-[44rem] min-[3840px]:max-w-[52rem] h-auto object-cover rounded-xl min-[2560px]:rounded-3xl shadow-[0_0.375rem_1.25rem_rgba(0,0,0,0.5)]"
          src="https://res.cloudinary.com/w1jl4sa5/image/upload/v1784588991/TS4_Royalty-and-Legacy_Sale-Hero_16x9-ES_mmadik.avif"
          alt={t("hero.imageAlt", "Imagen Hero")}
        />
      </div>
    </section>
  );
}

export default Hero;
