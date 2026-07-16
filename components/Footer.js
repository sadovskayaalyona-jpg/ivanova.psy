import { siteConfig } from "@/lib/site-config";
import styles from "./Footer.module.css";

export default function Footer() {
  const phoneHref = siteConfig.phone.replace(/[^+\d]/g, "");

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.line}>
          {siteConfig.psychologistName} · {siteConfig.city}
        </p>
        <p className={styles.line}>
          <a href={`tel:${phoneHref}`}>{siteConfig.phone}</a>
          {" · "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          {" · "}
          <a href={siteConfig.telegram} target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
        </p>
        <p className={styles.copy}>
          © {new Date().getFullYear()} {siteConfig.psychologistName}
        </p>
      </div>
    </footer>
  );
}
