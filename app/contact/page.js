import { siteConfig } from "@/lib/site-config";
import styles from "./contact.module.css";

export const metadata = {
  title: "Контакты",
};

export default function ContactPage() {
  const phoneHref = siteConfig.phone.replace(/[^+\d]/g, "");

  return (
    <section className="section">
      <div className="container">
        <h1 className={styles.title}>Контакты</h1>
        <p className={styles.intro}>
          Свяжитесь любым удобным способом — отвечаю в течение дня.
        </p>

        <div className={styles.grid}>
          <a className={styles.card} href={`tel:${phoneHref}`}>
            <span className={styles.label}>Телефон</span>
            <span className={styles.value}>{siteConfig.phone}</span>
          </a>

          <a
            className={styles.card}
            href={siteConfig.telegram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.label}>Telegram</span>
            <span className={styles.value}>Написать в Telegram</span>
          </a>

          <a className={styles.card} href={`mailto:${siteConfig.email}`}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{siteConfig.email}</span>
          </a>

          <div className={styles.card}>
            <span className={styles.label}>Формат</span>
            <span className={styles.value}>{siteConfig.city}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
