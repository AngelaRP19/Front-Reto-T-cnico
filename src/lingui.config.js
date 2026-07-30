module.exports = {
  locales: ["en", "es"],        // idiomas soportados
  sourceLocale: "en",           // idioma base
  catalogs: [
    {
      path: "src/locales/{locale}/messages",
      include: ["src"]          // carpeta donde buscar textos
    }
  ],
  format: "po"                  // formato de catálogos
};
