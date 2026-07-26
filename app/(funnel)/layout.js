import { Bodoni_Moda } from "next/font/google";
import "./funnel.css";

// Didot — коммерческий шрифт (Linotype/Adobe), нельзя просто встроить бесплатно.
// Bodoni Moda — свободный (Google Fonts) шрифт с тем же контрастным
// «дидо»-характером (высокий контраст штрихов, тонкие засечки) — ближайшая
// легальная замена по внешнему виду.
const bodoniModa = Bodoni_Moda({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  title: "Тест на выгорание руководителя",
  description:
    "Пройдите короткий тест и узнайте, что именно выжигает вас как руководителя прямо сейчас.",
};

export default function FunnelLayout({ children }) {
  return (
    <html lang="ru" className={bodoniModa.variable}>
      <body>{children}</body>
    </html>
  );
}
