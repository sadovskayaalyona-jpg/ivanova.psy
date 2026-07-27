import Link from "next/link";
import styles from "../../dashboard.module.css";

export const metadata = {
  title: "Тесты",
};

export default function TestsPage() {
  return (
    <div>
      <h1>Тесты</h1>
      <p className={styles.intro}>
        Это не диагноз — при высоких баллах лучше обсудить результат со
        специалистом.
      </p>

      <div className={styles.cardGrid}>
        <Link href="/vygoranie" className={styles.card}>
          <span className={styles.cardTitle}>От выгорания к балансу</span>
          <span className={styles.cardDescription}>
            Уровень выгорания, колесо баланса и твой управленческий стиль —
            развёрнутый разбор
          </span>
        </Link>
      </div>
    </div>
  );
}
