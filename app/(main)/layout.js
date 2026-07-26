import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: {
    default: `${siteConfig.psychologistName} — ${siteConfig.siteName}`,
    template: `%s — ${siteConfig.psychologistName}`,
  },
  description: siteConfig.tagline,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
