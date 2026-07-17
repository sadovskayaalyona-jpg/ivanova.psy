import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <span className={styles.name}>{siteConfig.psychologistName}</span>
          <span className={styles.tagline}>{siteConfig.siteName}</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/">Главная</Link>
          <Link href="/services">Услуги</Link>
          <Link href="/about">Обо мне</Link>
          <Link href="/contact">Контакты</Link>
          <Link href="/login">Кабинет</Link>
        </nav>
      </div>
    </header>
  );
}
