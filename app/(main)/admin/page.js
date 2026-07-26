import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTest } from "@/lib/tests";
import { wheelOfBalance } from "@/lib/tests/wheel-of-balance";
import { neurotype } from "@/lib/tests/neurotype";
import { PATH_SLUG } from "@/lib/tests/path-narrative";
import styles from "./admin.module.css";

export const metadata = {
  title: "Результаты",
};

function formatDate(value) {
  return new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function testLabel(slug) {
  if (slug === wheelOfBalance.slug) return wheelOfBalance.shortTitle;
  if (slug === neurotype.slug) return neurotype.shortTitle;
  if (slug === PATH_SLUG) return "Путь к балансу";
  const test = getTest(slug);
  return test ? test.shortTitle : slug;
}

export default async function AdminResultsPage() {
  const admin = createAdminClient();

  const [{ data: leads, error: leadsError }, { data: results, error: resultsError }] =
    await Promise.all([
      admin.from("vygoranie_leads").select("*").order("created_at", { ascending: false }).limit(200),
      admin.from("test_results").select("*").order("created_at", { ascending: false }).limit(200),
    ]);

  let emailByUserId = {};
  if (results && results.length > 0) {
    const { data: usersPage } = await admin.auth.admin.listUsers({ perPage: 1000 });
    emailByUserId = Object.fromEntries((usersPage?.users ?? []).map((u) => [u.id, u.email]));
  }

  return (
    <div>
      <h1>Результаты клиентов</h1>

      <h2 className={styles.sectionTitle}>
        Лиды с воронки «Тест на выгорание» {leads ? `(${leads.length})` : ""}
      </h2>
      {leadsError && <p className={styles.empty}>Ошибка загрузки: {leadsError.message}</p>}
      {leads && leads.length === 0 && <p className={styles.empty}>Пока никто не оставил контакт.</p>}
      {leads && leads.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Имя</th>
                <th>Контакт</th>
                <th>Выгорание</th>
                <th>Тип</th>
                <th>Архетип</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{formatDate(lead.created_at)}</td>
                  <td>{lead.name}</td>
                  <td>
                    <span className={styles.badge}>{lead.contact_method}</span> {lead.contact_value}
                  </td>
                  <td>
                    {lead.burnout_score}/10 · {lead.burnout_label}
                  </td>
                  <td>{lead.braverman_type}</td>
                  <td>
                    {lead.archetype_label}
                    {lead.is_mixed_profile ? " (смешанный)" : ""}
                  </td>
                  <td>
                    <Link href={`/admin/leads/${lead.id}`}>Смотреть →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className={styles.sectionTitle}>
        Тесты в личном кабинете {results ? `(${results.length})` : ""}
      </h2>
      {resultsError && <p className={styles.empty}>Ошибка загрузки: {resultsError.message}</p>}
      {results && results.length === 0 && <p className={styles.empty}>Пока никто не проходил тесты.</p>}
      {results && results.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Клиент</th>
                <th>Тест</th>
                <th>Балл</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{formatDate(r.created_at)}</td>
                  <td>{emailByUserId[r.user_id] ?? r.user_id}</td>
                  <td>{testLabel(r.test_slug)}</td>
                  <td>{r.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
