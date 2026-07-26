"use client";

import { useState } from "react";
import Link from "next/link";
import { wheelOfBalance } from "@/lib/tests/wheel-of-balance";
import { neurotype, getFlatQuestions } from "@/lib/tests/neurotype";
import { buildPathNarrative } from "@/lib/tests/path-narrative";
import { submitPath } from "./actions";
import WheelChart from "../wheel/WheelChart";
import NeurotypeChart from "../neurotype/NeurotypeChart";
import styles from "./path.module.css";

const STEP_WHEEL = "wheel";
const STEP_GOALS = "goals";
const STEP_NEUROTYPE = "neurotype";
const STEP_RESULT = "result";

export default function PathWizard() {
  const [step, setStep] = useState(STEP_WHEEL);
  const [wheelValues, setWheelValues] = useState(() =>
    Object.fromEntries(wheelOfBalance.spheres.map((s) => [s.key, 5]))
  );
  const [goalTexts, setGoalTexts] = useState({});
  const [neuroAnswers, setNeuroAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [result, setResult] = useState(null);

  const flatQuestions = getFlatQuestions();
  const goalSpheres = [...wheelOfBalance.spheres]
    .sort((a, b) => wheelValues[a.key] - wheelValues[b.key])
    .slice(0, 3);
  const allNeuroAnswered = flatQuestions.every(
    (q) => neuroAnswers[q.fieldName] !== undefined
  );

  async function handleFinish() {
    setSubmitting(true);
    setSubmitError(null);

    const goals = goalSpheres
      .map((s) => ({ sphereKey: s.key, text: (goalTexts[s.key] || "").trim() }))
      .filter((g) => g.text.length > 0);

    const res = await submitPath({ wheelValues, neuroAnswers, goals });
    setSubmitting(false);

    if (res.error) {
      setSubmitError(res.error);
      return;
    }
    setResult(res);
    setStep(STEP_RESULT);
  }

  if (step === STEP_RESULT && result) {
    const narrative = buildPathNarrative({
      wheelValues: result.wheelValues,
      dominantKey: result.dominantKey,
    });
    const second = neurotype.dimensions.find((d) => d.key === result.secondKey);
    const lowSpheres = wheelOfBalance.spheres.filter(
      (s) => result.wheelValues[s.key] <= wheelOfBalance.lowScoreThreshold
    );

    return (
      <div className={styles.result}>
        <h2>Твоя персональная карта</h2>

        <div className={styles.chartsRow}>
          <WheelChart values={result.wheelValues} />
          <NeurotypeChart scores={result.scores} dominantKey={result.dominantKey} />
        </div>

        <section className={styles.section}>
          <h3>Как ты устроен</h3>
          <p>{narrative.howYouAreBuilt}</p>
          {result.isMixed && (
            <p className={styles.muted}>
              Ваш профиль смешанный — вторым по значимости идёт тип «{second.label}».
            </p>
          )}
        </section>

        {lowSpheres.length > 0 && (
          <section className={styles.section}>
            <h3>Куда утекает ресурс</h3>
            {lowSpheres.map((s) => (
              <div key={s.key} className={styles.lowSphere}>
                <strong>
                  {s.label} — {result.wheelValues[s.key]}/{wheelOfBalance.max}
                </strong>
                <p>{s.lowScoreText}</p>
              </div>
            ))}
          </section>
        )}

        {result.goals.length > 0 && (
          <section className={styles.section}>
            <h3>Твои цели и стратегия</h3>
            {result.goals.map((g) => (
              <div key={g.sphereKey} className={styles.goalBlock}>
                <strong>
                  {g.sphereLabel}: {g.text}
                </strong>
                <p>{g.strategy}</p>
              </div>
            ))}
          </section>
        )}

        <section className={styles.section}>
          <h3>Ежедневные ритуалы</h3>
          <p>
            <strong>Утро:</strong> «{narrative.dominant.morningRitual}»
          </p>
          <p>
            <strong>Вечер:</strong> «{narrative.dominant.eveningRitual}»
          </p>
        </section>

        <section className={styles.section}>
          <h3>Главный фокус</h3>
          <p>
            Начните с одной сферы — «{narrative.focusSphere.label}». Именно она сейчас
            больше всего тянет колесо вниз, и даже небольшое улучшение здесь
            отзовётся на остальном.
          </p>
        </section>

        <div className={styles.resultActions}>
          <a
            className="button button--primary"
            href={`/api/results/${result.resultId}/pdf`}
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

  if (step === STEP_WHEEL) {
    return (
      <div className={styles.step}>
        <h2>Шаг 1 из 3 — Колесо баланса</h2>
        <p className={styles.stepIntro}>{wheelOfBalance.description}</p>
        <div className={styles.form}>
          {wheelOfBalance.spheres.map((sphere) => (
            <label key={sphere.key} className={styles.field}>
              <span className={styles.fieldLabel}>
                {sphere.label} <strong>{wheelValues[sphere.key]}</strong>
              </span>
              <input
                type="range"
                min={wheelOfBalance.min}
                max={wheelOfBalance.max}
                value={wheelValues[sphere.key]}
                onChange={(e) =>
                  setWheelValues((prev) => ({
                    ...prev,
                    [sphere.key]: Number(e.target.value),
                  }))
                }
              />
            </label>
          ))}
        </div>
        <button
          className="button button--primary"
          type="button"
          onClick={() => setStep(STEP_GOALS)}
        >
          Далее
        </button>
      </div>
    );
  }

  if (step === STEP_GOALS) {
    return (
      <div className={styles.step}>
        <h2>Шаг 2 из 3 — Твои цели</h2>
        <p className={styles.stepIntro}>
          Это твои самые низкие сферы прямо сейчас. Если хочешь — опиши цель
          в любой из них (можно оставить поле пустым и пропустить).
        </p>
        <div className={styles.form}>
          {goalSpheres.map((sphere) => (
            <label key={sphere.key} className={styles.field}>
              <span className={styles.fieldLabel}>
                {sphere.label} ({wheelValues[sphere.key]}/{wheelOfBalance.max})
              </span>
              <input
                type="text"
                placeholder="Например: выйти на доход от 300 000 ₽"
                value={goalTexts[sphere.key] || ""}
                onChange={(e) =>
                  setGoalTexts((prev) => ({
                    ...prev,
                    [sphere.key]: e.target.value,
                  }))
                }
              />
            </label>
          ))}
        </div>
        <div className={styles.stepActions}>
          <button
            className="button button--outline"
            type="button"
            onClick={() => setStep(STEP_WHEEL)}
          >
            Назад
          </button>
          <button
            className="button button--primary"
            type="button"
            onClick={() => setStep(STEP_NEUROTYPE)}
          >
            Далее
          </button>
        </div>
      </div>
    );
  }

  // STEP_NEUROTYPE
  return (
    <div className={styles.step}>
      <h2>Шаг 3 из 3 — Профиль нейромедиаторов</h2>
      <p className={styles.stepIntro}>{neurotype.description}</p>
      <p className={styles.inspiredBy}>{neurotype.inspiredBy}</p>
      <div className={styles.form}>
        {flatQuestions.map((q) => (
          <fieldset key={q.fieldName} className={styles.question}>
            <legend>{q.text}</legend>
            <div className={styles.options}>
              {neurotype.options.map((option) => (
                <label key={option.value} className={styles.option}>
                  <input
                    type="radio"
                    name={q.fieldName}
                    checked={neuroAnswers[q.fieldName] === option.value}
                    onChange={() =>
                      setNeuroAnswers((prev) => ({
                        ...prev,
                        [q.fieldName]: option.value,
                      }))
                    }
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      {submitError && <p className={styles.error}>{submitError}</p>}
      <div className={styles.stepActions}>
        <button
          className="button button--outline"
          type="button"
          onClick={() => setStep(STEP_GOALS)}
        >
          Назад
        </button>
        <button
          className="button button--primary"
          type="button"
          disabled={!allNeuroAnswered || submitting}
          onClick={handleFinish}
        >
          {submitting ? "Считаем и готовим карту…" : "Показать результат"}
        </button>
      </div>
    </div>
  );
}
