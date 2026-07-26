"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitTest } from "./actions";
import { crisisResources } from "@/lib/crisis-resources";
import styles from "./test.module.css";

const initialState = { error: null, success: false };

export default function TestForm({ test }) {
  const [state, formAction, pending] = useActionState(
    submitTest,
    initialState
  );

  if (state.success) {
    return (
      <div className={styles.result}>
        <h2>Результат: {state.score} из {state.maxScore}</h2>
        <p className={styles.interpretation}>{state.interpretation}</p>
        <p className={styles.disclaimer}>{test.disclaimer}</p>

        {state.showCrisis && (
          <div className={styles.crisisBox}>
            <p>{test.crisisMessage}</p>
            <p className={styles.crisisContact}>{crisisResources.text}</p>
          </div>
        )}

        <div className={styles.resultActions}>
          <Link className="button button--primary" href="/dashboard">
            В кабинет
          </Link>
          <Link className="button button--outline" href="/dashboard/aptechka/tests">
            К другим тестам
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="slug" value={test.slug} />

      {test.questions.map((question, i) => (
        <fieldset key={i} className={styles.question}>
          <legend>
            {i + 1}. {question}
          </legend>
          <div className={styles.options}>
            {test.options.map((option) => (
              <label key={option.value} className={styles.option}>
                <input
                  type="radio"
                  name={`q${i}`}
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

      <button className="button button--primary" type="submit" disabled={pending}>
        {pending ? "Отправляем…" : "Показать результат"}
      </button>
    </form>
  );
}
