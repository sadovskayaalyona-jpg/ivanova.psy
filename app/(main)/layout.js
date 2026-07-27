import { Bodoni_Moda } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

// Тот же шрифт, что и в воронке «Тест на выгорание» — единый визуальный
// почерк заголовков по всему сайту.
const bodoniModa = Bodoni_Moda({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  title: {
    default: `${siteConfig.psychologistName} — ${siteConfig.siteName}`,
    template: `%s — ${siteConfig.psychologistName}`,
  },
  description: siteConfig.tagline,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={bodoniModa.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
