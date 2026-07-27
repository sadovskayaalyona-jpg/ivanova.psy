import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { wheelSpheres } from "@/lib/vygoranie/block2-wheel";
import { archetypes } from "@/lib/vygoranie/block4-archetypes";
import { buildResultNarrative } from "@/lib/vygoranie/result-narrative";
import VgWheelChart from "@/app/(funnel)/vygoranie/VgWheelChart";
import styles from "../../admin.module.css";

export const metadata = {
  title: "Результат лида",
};

export default async function LeadPreviewPage({ params }) {
  const { id } = await params;
  const admin = createAdminClient();

  const { data: lead, error } = await admin
    .from("vygoranie_leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !lead) {
    notFound();
  }

  const archetype = archetypes.find((a) => a.key === lead.archetype_key);
  const narrative = buildResultNarrative({
    wheelValues: lead.wheel_answers,
    archetypeKey: lead.archetype_key,
    bravermanTypeKey: lead.braverman_type,
  });

  return (
    <div>
      <Link href="/admin" className={styles.previewBack}>
        ← Все результаты
      </Link>
      <h1>{lead.name}</h1>
      <div className={styles.metaRow}>
        <span>
          Контакт: <strong>{lead.contact_value}</strong> ({lead.contact_method})
        </span>
        <span>
          Отправлено: <strong>{new Date(lead.created_at).toLocaleString("ru-RU")}</strong>
        </span>
      </div>

      <p style={{ marginBottom: "1.5rem", color: "var(--color-text-muted)" }}>
        Ниже — ровно то, что этот человек увидел на экране после отправки формы.
      </p>

      <div className={styles.previewCard}>
        <h3>
          {lead.burnout_score}/10 — {lead.burnout_label}
        </h3>
      </div>

      <div className={styles.previewCard}>
        <h3>Как вы устроены</h3>
        <p>{narrative.combined}</p>
      </div>

      <div className={styles.previewCard}>
        <h3>Колесо баланса</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <VgWheelChart values={lead.wheel_answers} />
        </div>
        <div style={{ marginTop: "1rem", fontSize: "0.88rem" }}>
          {wheelSpheres.spheres.map((s) => (
            <span key={s.key} className={styles.badge} style={{ marginRight: "0.4rem", marginBottom: "0.4rem", display: "inline-block" }}>
              {s.label}: {lead.wheel_answers[s.key]}/10
            </span>
          ))}
        </div>
      </div>

      <div className={styles.previewCard}>
        <h3>
          Стиль управления: {lead.archetype_label}
          {lead.is_mixed_profile ? " (смешанный профиль)" : ""}
        </h3>
        <p>{archetype?.mechanism}</p>
      </div>

      <div className={styles.previewCard}>
        <h3>К чему это ведёт, если оставить как есть</h3>
        <p>{narrative.stakes}</p>
      </div>
    </div>
  );
}
