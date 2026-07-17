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
      </div>
    </div>
  );
}
