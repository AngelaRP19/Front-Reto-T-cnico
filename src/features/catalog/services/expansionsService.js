import { apiClient } from "../../../services/apiClient";

const DEFAULT_VIDEO_URL = "https://www.youtube.com/watch?v=5LaIogTLPYA";

// Requerimientos dinámicos según idioma cuando el backend venga vacío
const DEFAULT_REQUIREMENTS_BY_LANG = {
  es: {
    min: [
      "SO: Windows 10 - 64 bits",
      "Procesador: Intel Core i3",
      "Memoria: 4 GB de RAM",
      "Almacenamiento: 8 GB de espacio disponible"
    ],
    rec: [
      "SO: Windows 10/11 - 64 bits",
      "Procesador: Intel Core i5",
      "Memoria: 8 GB de RAM",
      "Almacenamiento: 8 GB de espacio disponible"
    ]
  },
  en: {
    min: [
      "OS: Windows 10 - 64-bit",
      "Processor: Intel Core i3",
      "Memory: 4 GB RAM",
      "Storage: 8 GB available"
    ],
    rec: [
      "OS: Windows 10/11 - 64-bit",
      "Processor: Intel Core i5",
      "Memory: 8 GB RAM",
      "Storage: 8 GB available"
    ]
  },
  fr: {
    min: [
      "Système: Windows 10 - 64 bits",
      "Processeur: Intel Core i3",
      "Mémoire: 4 Go de RAM",
      "Espace disque: 8 Go disponibles"
    ],
    rec: [
      "Système: Windows 10/11 - 64 bits",
      "Processeur: Intel Core i5",
      "Mémoire: 8 Go de RAM",
      "Espace disque: 8 Go disponibles"
    ]
  }
};

function formatPrice(value) {
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return String(value ?? "");
  return `$${num.toLocaleString("es-CO")} COP`;
}

// Datos de carruseles centralizados por pack base
const CAROUSEL_PACKS = {
  naturaleza: {
    videoUrl: {
      es: "https://youtu.be/v9K4TI3DZfI?si=zIYdlHnSZUxcThmg",
      en: "https://www.youtube.com/watch?v=NRXlyWahM4w",
      fr: "https://www.youtube.com/watch?v=UAfaM_60Q48",
    },
    screenshots: [
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F4jQqRKOQr82DFC0Rf6gFtP%2Fbe4b9300949bf245953cda1b01b35f00%2FTS4_EP19_OFFICIAL_SCREENS_01_002_4K.png&w=750&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2FTNol2LGG2ljWYZzPRQyGQ%2F61a159e952e4edcc1f6201ac4627e9bd%2FTS4_EP19_OFFICIAL_SCREENS_02_002_4K.png&w=750&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F6nlOLGDv8HNKAyPHiuBSfH%2F9b948e450585875a684faf5395e0c443%2FTS4_EP19_OFFICIAL_SCREENS_03_002_4K.png&w=750&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F4rGVPcxhFflqu6x5K57aQc%2F879e5f71db9b7129b9c00cfebe11f21e%2FTS4_EP19_OFFICIAL_SCREENS_04_003_4k.png&w=750&q=75"
    ]
  },
  dinastias: {
    videoUrl: {
      es: "https://youtu.be/4e25uhObPto?si=V_NdvQ1GisfE5fwV",
      en: "https://www.youtube.com/watch?v=t7oyilYgSzs",
      fr: "https://www.youtube.com/watch?v=YwXG7KRBFYI",
    },
    screenshots: [
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F3DpWt883FW9ZOs8fzr2Drp%2Fa4fedf6a9f83bc9b0399d38bb24f410f%2FTS4_EP21_OFFICIAL_SCREENS_01_003_4K.png&w=3840&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F5ZXeWprGDrI2wmtVlRM5UW%2F27fb029800e9754031a8030a8c1ee0fe%2FTS4_EP21_OFFICIAL_SCREENS_02_004_4K.png&w=750&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F6YwfBOhag0SBPUPLrpcJVF%2F641d52835e77a340a67392091a660d22%2FTS4_EP21_OFFICIAL_SCREENS_03_003_4K.png&w=750&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F3Jrh7scA5MNRxIALfX9H7E%2F520f6c93a92e36b669e745362a26deec%2FTS4_EP21_OFFICIAL_SCREENS_04_004_4K.png&w=750&q=75"
    ]
  },
  rancho: {
    videoUrl: {
      es: "https://www.youtube.com/watch?v=zD2nh2UXXmM",
      en: "https://www.youtube.com/watch?v=GaUZ5ph7qD4",
      fr: "https://www.youtube.com/watch?v=wPiw6n-1dyQ",
    },
    screenshots: [
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F6ujmPzHzNhiYB5M6v0TG98%2F6014af15ee566150ca71dd82e806e09a%2FTS4_EP14_OFFICIAL_SCREENS_01_002_16x9.jpg&w=750&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2Fg1DfykosdKXRM3KW3rMlG%2F436021f3f9baf902cac6c0bb88b2158e%2FTS4_EP14_OFFICIAL_SCREENS_02_001_16x9.jpg&w=750&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F5OUcvHPctwt8iwDnSC7dbZ%2Fe6fa51b86f0dce85c8ae268ffe80fd95%2FTS4_EP14_OFFICIAL_SCREENS_03_002_16x9.jpg&w=750&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F3Lcg9jHxbsiXVreinVavfo%2Fa5d510c9f49a402a7f0cf3f9f1aaec35%2FTS4_EP14_OFFICIAL_SCREENS_04_002_16x9.jpg&w=750&q=75"
    ]
  },
  pueblo: {
    videoUrl: {
      es: "https://www.youtube.com/watch?v=BJVWjAxHcjU",
      en: "https://www.youtube.com/watch?v=7rSNOU_T7mg",
      fr: "https://www.youtube.com/watch?v=8Rm8KLwW4P8",
    },
    screenshots: [
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F1zIjjgvyPVyIvDjb25EE8b%2Fa8c2a81bfc6f21679c31f9a59dd8fc2e%2Fthe-sims-4-cottage-living-4.jpg&w=750&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F5bRzEk1GtU976UvtnmoNfh%2Ff60387f8cb969ed325c0ddc9363abc89%2Fthe-sims-4-cottage-living-1.jpg&w=750&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F5qZhrX0kzaA119cLEVeggB%2F3888406564a6c3c3db15d2ddf67cd2ff%2Fthe-sims-4-cottage-living-2.jpg&w=750&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2Fb1RWB7wqSlWvQW0dTIIfT%2Fa8c7318f8ce266d4407951f9159beec6%2Fthe-sims-4-cottage-living-3.jpg&w=750&q=75"
    ]
  },
  perros: {
    videoUrl: {
      es: "https://youtu.be/P9gEv7ePbU8?si=-resI8CHtAl4FpHJ",
      en: "https://www.youtube.com/watch?v=zChf8vmBkHw",
      fr: "https://www.youtube.com/watch?v=fsSuAXxqzvQ",
    },
    screenshots: [
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F4Fqueu9j9Po6iaVCBd9XBa%2F6444952297a8f6ddf2fc6ea719c3acb6%2Fthe-sims-4-cats-and-dogs-1.jpg&w=750&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F2Ix4DH0UQvkes3TdVYzmy7%2F5722876e9d39dc010be917d3db384df9%2Fthe-sims-4-cats-and-dogs-4.jpg&w=750&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F4dS8A3P3dpjikg8zUUWMer%2Fe808584a676885405745c14316d6f1b8%2Fthe-sims-4-cats-and-dogs-3.jpg&w=750&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2FYXMmCqnWItLlDluLlSvMB%2Fe20a8b055809bb524505af31431552af%2Fthe-sims-4-cats-and-dogs-6.png&w=750&q=75"
    ]
  },
  trabajar: {
    videoUrl: {
      es: "https://www.youtube.com/watch?v=X-X2S2KrYFw",
      en: "https://www.youtube.com/watch?v=3HrNTk670z8",
      fr: "https://www.youtube.com/watch?v=Jm-nhNUsyZg",
    },
    screenshots: [
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F3vaCAIuy3haqUzVozVdTtl%2F3401a1c89ec7c6a8947e813937b2b7f1%2Fthe-sims-4-get-to-work-1.jpg&w=750&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F75WzL1CuZzx136IVRgDy3l%2Ff315686170d865661fe65b94cca65650%2Fthe-sims-4-get-to-work-2.jpg&w=750&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F46hUoifFmM2fVjqPXO5BaZ%2F352f9d3a4bf6e75f293e5b87efe0da81%2Fthe-sims-4-get-to-work-3.jpg&w=750&q=75",
      "https://www.ea.com/games/the-sims/_next/image?url=https%3A%2F%2Fapp-images.ea.com%2Fps9x41qn6x3c%2F3sJ6dlqy87nveuSorCCVq7%2F555e5eee0df2e53ba22d75bf85bad82d%2Fthe-sims-4-get-to-work-5.jpg&w=750&q=75"
    ]
  }
};

// Diccionario de nombres en todos los idiomas apuntando a la clave base
const TITLE_MAP = {
  "The Sims™ 4: Naturaleza Encantada": CAROUSEL_PACKS.naturaleza,
  "The Sims™ 4: Enchanted Nature": CAROUSEL_PACKS.naturaleza,
  "The Sims™ 4: Nature Enchantée": CAROUSEL_PACKS.naturaleza,

  "The Sims™ 4: Dinastías y Linajes": CAROUSEL_PACKS.dinastias,
  "The Sims™ 4: Royal Dynasty": CAROUSEL_PACKS.dinastias,
  "The Sims™ 4: Dynasties et Héritage": CAROUSEL_PACKS.dinastias,

  "The Sims™ 4: Rancho de Caballos": CAROUSEL_PACKS.rancho,
  "The Sims™ 4: Horse Ranch": CAROUSEL_PACKS.rancho,
  "The Sims™ 4: Ranch Équestre": CAROUSEL_PACKS.rancho,

  "The Sims™ 4: Vida en el Pueblo": CAROUSEL_PACKS.pueblo,
  "The Sims™ 4: Cottage Living": CAROUSEL_PACKS.pueblo,
  "The Sims™ 4: Vie au Village": CAROUSEL_PACKS.pueblo,

  "The Sims™ 4: Perros y Gatos": CAROUSEL_PACKS.perros,
  "The Sims™ 4: Cats & Dogs": CAROUSEL_PACKS.perros,
  "The Sims™ 4: Chiens et Chats": CAROUSEL_PACKS.perros,

  "The Sims™ 4: ¡A Trabajar!": CAROUSEL_PACKS.trabajar,
  "The Sims™ 4: Get to Work": CAROUSEL_PACKS.trabajar,
  "The Sims™ 4: Au Travail !": CAROUSEL_PACKS.trabajar
};

function mapExpansionPack(pack, lang = "es") {
  const carouselData = TITLE_MAP[pack.name];
  const langKey = (lang || "es").toLowerCase().slice(0, 2);
  const requirementsFallback = DEFAULT_REQUIREMENTS_BY_LANG[langKey] || DEFAULT_REQUIREMENTS_BY_LANG.es;

  // 1. Obtener la URL del vídeo dependiendo del idioma actual ('es', 'en', 'fr')
  const videoByLang = 
    carouselData?.videoUrl?.[langKey] || 
    carouselData?.videoUrl?.es || 
    (typeof carouselData?.videoUrl === "string" ? carouselData.videoUrl : null) ||
    pack.videoUrl || 
    DEFAULT_VIDEO_URL;

  // 2. Asignar screenshots locales si el pack del backend no trae o vienen vacías
  const screenshots =
    carouselData?.screenshots?.length > 0
      ? carouselData.screenshots
      : pack.screenshots?.length > 0
      ? pack.screenshots
      : [];

  return {
    id: pack.id,
    title: pack.name,
    category: pack.category,
    price: formatPrice(pack.price),
    platform: pack.platforms,
    releaseDate: pack.publicationDate,
    description: pack.description,
    features: pack.characteristics || [],
    image: pack.URLImage,
    screenshots: screenshots,
    videoUrl: videoByLang, // <-- Ahora pasa la URL directa en formato string
    minRequirements:
      pack.minimumRequirements && pack.minimumRequirements.length > 0
        ? pack.minimumRequirements
        : requirementsFallback.min,
    recommendedRequirements:
      pack.recommendedRequirements && pack.recommendedRequirements.length > 0
        ? pack.recommendedRequirements
        : requirementsFallback.rec
  };
}

export async function getExpansionPacks(lang = "es") {
  const query = lang ? `?lang=${encodeURIComponent(lang)}` : "";
  const packs = await apiClient.get(`/nodos/expansionpacks${query}`, { auth: false });
  return (packs || []).map((pack) => mapExpansionPack(pack, lang));
}