import Link from "next/link";
import styles from "../dashboard.module.css";

export const metadata = {
  title: "Психологическая аптечка",
};

export default function AptechkaPage() {
  return (
    <div>
      <h1>Психологическая аптечка</h1>
      <p className={styles.intro}>
        Инструменты для самонаблюдения и упражнения, которые помогают
        справиться с тревогой в моменте.
      </p>

      <div className={styles.cardGrid}>
        <Link href="/dashboard/aptechka/tests" className={styles.card}>
          <span className={styles.cardTitle}>Тесты</span>
          <span className={styles.cardDescription}>
            Опросники для самонаблюдения: тревога, настроение
          </span>
        </Link>
        <Link href="/dashboard/aptechka/exercises" className={styles.card}>
          <span className={styles.cardTitle}>Упражнения</span>
          <span className={styles.cardDescription}>
            Дыхательные техники и заземление — помощь в моменте тревоги
          </span>
        </Link>
      </div>
    </div>
  );
}
