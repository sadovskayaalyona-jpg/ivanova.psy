import Link from "next/link";
import styles from "../../dashboard.module.css";

export const metadata = {
  title: "Упражнения",
};

export default function ExercisesPage() {
  return (
    <div>
      <h1>Упражнения</h1>
      <p className={styles.intro}>
        Короткие практики, которые можно выполнить прямо сейчас, если
        накрывает тревога.
      </p>

      <div className={styles.cardGrid}>
        <Link
          href="/dashboard/aptechka/exercises/breathing"
          className={styles.card}
        >
          <span className={styles.cardTitle}>Дыхание</span>
          <span className={styles.cardDescription}>
            Квадратное дыхание с таймером — 2–3 минуты
          </span>
        </Link>
        <Link
          href="/dashboard/aptechka/exercises/grounding"
          className={styles.card}
        >
          <span className={styles.cardTitle}>Заземление</span>
          <span className={styles.cardDescription}>
            Техника «5-4-3-2-1» — вернуться в настоящий момент
          </span>
        </Link>
      </div>
    </div>
  );
}
