"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitNeurotype } from "./actions";
import { neurotype, getFlatQuestions } from "@/lib/tests/neurotype";
import NeurotypeChart from "./NeurotypeChart";
import styles from "./neurotype.module.css";

const initialState = { error: null, success: false };

export default function NeurotypeForm() {
  const [state, formAction, pending] = useActionState(
    submitNeurotype,
    initialState
  );
  const flatQuestions = getFlatQuestions();

  if (state.success) {
    const dominant = neurotype.dimensions.find(
      (d) => d.key === state.dominantKey
    );
    const second = neurotype.dimensions.find((d) => d.key === state.secondKey);

    return (
      <div className={styles.result}>
        <div className={styles.chartWrap}>
          <NeurotypeChart scores={state.scores} dominantKey={state.dominantKey} />
        </div>

        {state.isMixed ? (
          <h2>
            Смешанный профиль: {dominant.label} и {second.label}
          </h2>
        ) : (
          <h2>Ведущий тип: {dominant.label}</h2>
        )}

        <div className={styles.recommendations}>
          <h3>Что истощает</h3>
          <p>{dominant.depletedBy}</p>
          <h3>Что помогает восполнить ресурс</h3>
          <p>{dominant.recommendations}</p>

          {state.isMixed && (
            <>
              <h3>Также учитывайте — {second.label}</h3>
              <p>{second.recommendations}</p>
            </>
          )}
        </div>

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
      {flatQuestions.map((q) => (
        <fieldset key={q.fieldName} className={styles.question}>
          <legend>{q.text}</legend>
          <div className={styles.options}>
            {neurotype.options.map((option) => (
              <label key={option.value} className={styles.option}>
                <input
                  type="radio"
                  name={q.fieldName}
                  value={option.value}
                  required
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
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
