import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTest } from "@/lib/tests";
import { wheelOfBalance } from "@/lib/tests/wheel-of-balance";
import { neurotype } from "@/lib/tests/neurotype";
import styles from "./dashboard.module.css";

function formatHistoryLine(row) {
  if (row.test_slug === wheelOfBalance.slug) {
    const scores = Object.values(row.answers ?? {});
    const average = scores.length
      ? scores.reduce((sum, v) => sum + v, 0) / scores.length
      : row.score;
    return `${wheelOfBalance.shortTitle} — средний балл ${average.toFixed(1)}`;
  }

  if (row.test_slug === neurotype.slug) {
    const scores = row.answers ?? {};
    const sorted = [...neurotype.dimensions].sort(
      (a, b) => (scores[b.key] ?? 0) - (scores[a.key] ?? 0)
    );
    const dominant = sorted[0];
    return `${neurotype.shortTitle} — ведущий тип: ${dominant.label}`;
  }

  const test = getTest(row.test_slug);
  return `${test ? test.shortTitle : row.test_slug} — ${row.score} баллов`;
}

export const metadata = {
  title: "Личный кабинет",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let results = null;
  let loadFailed = false;
  try {
    const { data, error } = await supabase
      .from("test_results")
      .select("id, test_slug, score, answers, created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    if (error) throw error;
    results = data;
  } catch {
    loadFailed = true;
  }

  const fullName = user?.user_metadata?.full_name;

  return (
    <div>
      <h1>Добро пожаловать{fullName ? `, ${fullName}` : ""}</h1>
      <p className={styles.intro}>
        Здесь — ваша психологическая аптечка: тесты для самонаблюдения и
        упражнения от тревоги.
      </p>
      <Link href="/dashboard/aptechka" className="button button--primary">
        Перейти в аптечку
      </Link>

      <h2 className={styles.subtitle}>История тестов</h2>
      {loadFailed ? (
        <p className={styles.empty}>
          Не получилось загрузить историю — попробуйте обновить страницу.
        </p>
      ) : results && results.length > 0 ? (
        <ul className={styles.historyList}>
          {results.map((r) => (
            <li key={r.id}>
              {formatHistoryLine(r)} ·{" "}
              {new Date(r.created_at).toLocaleDateString("ru-RU")}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Вы ещё не проходили тесты.</p>
      )}
    </div>
  );
}
