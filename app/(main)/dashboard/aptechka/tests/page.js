import Link from "next/link";
import { testList } from "@/lib/tests";
import styles from "../../dashboard.module.css";

export const metadata = {
  title: "Тесты",
};

export default function TestsPage() {
  return (
    <div>
      <h1>Тесты</h1>
      <p className={styles.intro}>
        Короткие валидированные опросники для самонаблюдения. Это не
        диагноз — при высоких баллах лучше обсудить результат со
        специалистом.
      </p>

      <div className={styles.cardGrid}>
        <Link href="/dashboard/aptechka/tests/path" className={styles.card}>
          <span className={styles.cardTitle}>Путь к балансу</span>
          <span className={styles.cardDescription}>
            Колесо баланса + твои цели + профиль нейромедиаторов — единая
            персональная карта с рекомендациями
          </span>
        </Link>

        {testList.map((test) => (
          <Link
            key={test.slug}
            href={`/dashboard/aptechka/tests/${test.slug}`}
            className={styles.card}
          >
            <span className={styles.cardTitle}>{test.title}</span>
            <span className={styles.cardDescription}>
              {test.questions.length} вопросов
            </span>
          </Link>
        ))}

        <Link href="/dashboard/aptechka/tests/wheel" className={styles.card}>
          <span className={styles.cardTitle}>Колесо баланса жизни</span>
          <span className={styles.cardDescription}>
            8 сфер, оценка от 1 до 10
          </span>
        </Link>

        <Link
          href="/dashboard/aptechka/tests/neurotype"
          className={styles.card}
        >
          <span className={styles.cardTitle}>Профиль нейромедиаторов</span>
          <span className={styles.cardDescription}>
            20 вопросов, авторская версия по мотивам Braverman
          </span>
        </Link>
      </div>
    </div>
  );
}
