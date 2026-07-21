import { Font } from "@react-pdf/renderer";

// Стандартный Helvetica в react-pdf не содержит кириллицу — русский текст
// превращается в кашу. Регистрируем шрифт с кириллицей по стабильной ссылке
// Google Fonts (не полагаемся на файловую систему serverless-функции).
let registered = false;

export function registerPdfFonts() {
  if (registered) return;
  registered = true;

  Font.register({
    family: "PT Sans",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/ptsans/v18/jizaRExUiTo99u79D0aEwA.ttf",
        fontWeight: "normal",
        fontStyle: "normal",
      },
      {
        src: "https://fonts.gstatic.com/s/ptsans/v18/jizfRExUiTo99u79B_mh0OqtKA.ttf",
        fontWeight: "bold",
        fontStyle: "normal",
      },
      {
        src: "https://fonts.gstatic.com/s/ptsans/v18/jizYRExUiTo99u79D0e0w8mN.ttf",
        fontWeight: "normal",
        fontStyle: "italic",
      },
      {
        src: "https://fonts.gstatic.com/s/ptsans/v18/jizdRExUiTo99u79D0e8fOydKxUY.ttf",
        fontWeight: "bold",
        fontStyle: "italic",
      },
    ],
  });
}
