import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTest } from "@/lib/tests";
import styles from "./dashboard.module.css";

export const metadata = {
  title: "Личный кабинет",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: results } = await supabase
    .from("test_results")
    .select("id, test_slug, score, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

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
      {results && results.length > 0 ? (
        <ul className={styles.historyList}>
          {results.map((r) => {
            const test = getTest(r.test_slug);
            return (
              <li key={r.id}>
                {test ? test.shortTitle : r.test_slug} — {r.score} баллов ·{" "}
                {new Date(r.created_at).toLocaleDateString("ru-RU")}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.empty}>Вы ещё не проходили тесты.</p>
      )}
    </div>
  );
}
