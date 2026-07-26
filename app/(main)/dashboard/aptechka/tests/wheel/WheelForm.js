"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { submitWheel } from "./actions";
import { wheelOfBalance } from "@/lib/tests/wheel-of-balance";
import WheelChart from "./WheelChart";
import styles from "./wheel.module.css";

const initialState = { error: null, success: false };

export default function WheelForm() {
  const [state, formAction, pending] = useActionState(
    submitWheel,
    initialState
  );

  if (state.success) {
    const lowSpheres = wheelOfBalance.spheres.filter(
      (s) => state.values[s.key] <= wheelOfBalance.lowScoreThreshold
    );

    return (
      <div className={styles.result}>
        <div className={styles.chartWrap}>
          <WheelChart values={state.values} />
        </div>
        <p className={styles.average}>
          Средний балл: {state.average.toFixed(1)} из {wheelOfBalance.max}
        </p>

        {lowSpheres.length > 0 ? (
          <div className={styles.lowSpheres}>
            <h2>Куда утекает ресурс</h2>
            {lowSpheres.map((s) => (
              <div key={s.key} className={styles.lowSphere}>
                <h3>
                  {s.label} — {state.values[s.key]}/{wheelOfBalance.max}
                </h3>
                <p>{s.lowScoreText}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.balanced}>
            Явно проседающих сфер нет — баланс выглядит устойчивым.
          </p>
        )}

        <div className={styles.resultActions}>
          <a
            className="button button--primary"
            href={`/api/results/${state.resultId}/pdf`}
          >
            Скачать PDF
          </a>
          <Link className="button button--outline" href="/dashboard">
            В кабинет
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className={styles.form}>
      {wheelOfBalance.spheres.map((sphere) => (
        <SphereSlider key={sphere.key} sphere={sphere} />
      ))}
      {state.error && <p className={styles.error}>{state.error}</p>}
      <button
        className="button button--primary"
        type="submit"
        disabled={pending}
      >
        {pending ? "Считаем…" : "Показать результат"}
      </button>
    </form>
  );
}

function SphereSlider({ sphere }) {
  const [value, setValue] = useState(5);

  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>
        {sphere.label} <strong>{value}</strong>
      </span>
      <input
        type="range"
        name={sphere.key}
        min={wheelOfBalance.min}
        max={wheelOfBalance.max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </label>
  );
}
