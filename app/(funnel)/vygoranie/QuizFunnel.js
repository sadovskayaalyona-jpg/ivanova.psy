"use client";

import { useState } from "react";
import { burnoutScale } from "@/lib/vygoranie/block1-burnout";
import { wheelSpheres } from "@/lib/vygoranie/block2-wheel";
import { bravermanScale } from "@/lib/vygoranie/block3-braverman";
import { archetypes, questions as archetypeQuestions } from "@/lib/vygoranie/block4-archetypes";
import { computePartialResult } from "@/lib/vygoranie/scoring";
import { buildResultNarrative } from "@/lib/vygoranie/result-narrative";
import { submitLead } from "./actions";
import VgWheelChart from "./VgWheelChart";
import styles from "./vygoranie.module.css";

const STEPS = ["intro", "burnout", "wheel", "braverman", "archetype", "teaser", "capture", "result"];

const burnoutFlat = burnoutScale.groups.flatMap((g) => g.questions);
const bravermanFlat = bravermanScale.types.flatMap((t) => t.statements);

function ProgressBar({ stepIndex }) {
  // Не считаем intro/teaser/capture/result как "прогресс по вопросам" —
  // прогресс относится только к 4 блокам теста.
  const questionSteps = ["burnout", "wheel", "braverman", "archetype"];
  const currentIndex = questionSteps.indexOf(STEPS[stepIndex]);
  if (currentIndex === -1) return null;
  return (
    <div className={styles.progress}>
      {questionSteps.map((s, i) => (
        <div key={s} className={`${styles.progressDot} ${i <= currentIndex ? styles.done : ""}`} />
      ))}
    </div>
  );
}

export default function QuizFunnel() {
  const [stepIndex, setStepIndex] = useState(0);
  const [burnoutAnswers, setBurnoutAnswers] = useState({});
  const [wheelValues, setWheelValues] = useState(() =>
    Object.fromEntries(wheelSpheres.spheres.map((s) => [s.key, 5]))
  );
  const [bravermanAnswers, setBravermanAnswers] = useState({});
  const [archetypeAnswers, setArchetypeAnswers] = useState({});
  const [archetypeQIndex, setArchetypeQIndex] = useState(0);
  const [contact, setContact] = useState({ name: "", method: "phone", value: "", consent: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [result, setResult] = useState(null);

  const step = STEPS[stepIndex];
  const goTo = (name) => setStepIndex(STEPS.indexOf(name));

  const burnoutComplete = burnoutFlat.every((_, i) => burnoutAnswers[i] !== undefined);
  const bravermanComplete = bravermanFlat.every((_, i) => bravermanAnswers[i] !== undefined);

  async function handleCapture(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const res = await submitLead({
      contact,
      burnoutAnswers,
      wheelValues,
      bravermanAnswers,
      archetypeAnswers,
    });

    setSubmitting(false);
    if (res.error) {
      setSubmitError(res.error);
      return;
    }
    setResult(res);
    goTo("result");
  }

  // --- INTRO ---
  if (step === "intro") {
    return (
      <div className={styles.screen}>
        <div className={styles.eyebrow}>Тест для руководителей</div>
        <h1 className={styles.title}>Что именно вас выжигает?</h1>
        <p className={styles.subtitle}>
          4 коротких блока, 5 минут. В конце — персональный разбор: уровень
          выгорания, тип нейромедиаторной доминанты, колесо баланса и стиль
          управления, который вас истощает.
        </p>
        <button className="vg-button" type="button" onClick={() => goTo("burnout")}>
          Начать тест
        </button>
      </div>
    );
  }

  // --- BLOCK 1: BURNOUT ---
  if (step === "burnout") {
    return (
      <div className={styles.screen}>
        <ProgressBar stepIndex={stepIndex} />
        <div className={styles.eyebrow}>Блок 1 из 4</div>
        <h2 className={styles.title}>Уровень выгорания</h2>
        <p className={styles.subtitle}>{burnoutScale.description}</p>
        <div className={styles.form}>
          {burnoutFlat.map((text, i) => (
            <fieldset key={i} className={styles.question}>
              <span className={styles.questionText}>{text}</span>
              <div className={styles.optionsRow}>
                {burnoutScale.options.map((opt) => (
                  <label key={opt.value} className={styles.scaleOption}>
                    <input
                      type="radio"
                      name={`burnout-${i}`}
                      checked={burnoutAnswers[i] === opt.value}
                      onChange={() => setBurnoutAnswers((prev) => ({ ...prev, [i]: opt.value }))}
                    />
                    <span>{opt.value}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        <div className={styles.actions}>
          <button
            className="vg-button"
            type="button"
            disabled={!burnoutComplete}
            onClick={() => goTo("wheel")}
          >
            Далее
          </button>
        </div>
      </div>
    );
  }

  // --- BLOCK 2: WHEEL ---
  if (step === "wheel") {
    return (
      <div className={styles.screen}>
        <ProgressBar stepIndex={stepIndex} />
        <div className={styles.eyebrow}>Блок 2 из 4</div>
        <h2 className={styles.title}>Колесо баланса</h2>
        <p className={styles.subtitle}>{wheelSpheres.description}</p>
        <div className={styles.form}>
          {wheelSpheres.spheres.map((sphere) => (
            <label key={sphere.key} className={styles.field}>
              <span className={styles.sliderLabel}>
                {sphere.label} <strong>{wheelValues[sphere.key]}</strong>
              </span>
              <input
                type="range"
                min={wheelSpheres.min}
                max={wheelSpheres.max}
                value={wheelValues[sphere.key]}
                onChange={(e) =>
                  setWheelValues((prev) => ({ ...prev, [sphere.key]: Number(e.target.value) }))
                }
              />
            </label>
          ))}
        </div>
        <div className={styles.actions}>
          <button className="vg-button vg-button--outline" type="button" onClick={() => goTo("burnout")}>
            Назад
          </button>
          <button className="vg-button" type="button" onClick={() => goTo("braverman")}>
            Далее
          </button>
        </div>
      </div>
    );
  }

  // --- BLOCK 3: BRAVERMAN ---
  if (step === "braverman") {
    return (
      <div className={styles.screen}>
        <ProgressBar stepIndex={stepIndex} />
        <div className={styles.eyebrow}>Блок 3 из 4</div>
        <h2 className={styles.title}>Что вас заряжает и истощает</h2>
        <p className={styles.subtitle}>{bravermanScale.description}</p>
        <div className={styles.form}>
          {bravermanFlat.map((text, i) => (
            <fieldset key={i} className={styles.question}>
              <span className={styles.questionText}>{text}</span>
              <div className={styles.optionsRow}>
                {bravermanScale.options.map((opt) => (
                  <label key={opt.value} className={styles.scaleOption}>
                    <input
                      type="radio"
                      name={`braverman-${i}`}
                      checked={bravermanAnswers[i] === opt.value}
                      onChange={() => setBravermanAnswers((prev) => ({ ...prev, [i]: opt.value }))}
                    />
                    <span>{opt.value}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        <div className={styles.actions}>
          <button className="vg-button vg-button--outline" type="button" onClick={() => goTo("wheel")}>
            Назад
          </button>
          <button
            className="vg-button"
            type="button"
            disabled={!bravermanComplete}
            onClick={() => goTo("archetype")}
          >
            Далее
          </button>
        </div>
      </div>
    );
  }

  // --- BLOCK 4: ARCHETYPE (one situational question per screen) ---
  if (step === "archetype") {
    const q = archetypeQuestions[archetypeQIndex];
    const isLast = archetypeQIndex === archetypeQuestions.length - 1;

    return (
      <div className={styles.screen}>
        <ProgressBar stepIndex={stepIndex} />
        <div className={styles.eyebrow}>
          Блок 4 из 4 · Ситуация {archetypeQIndex + 1} из {archetypeQuestions.length}
        </div>
        <h2 className={styles.title}>{q.situation}</h2>
        <div className={styles.optionsStack}>
          {q.options.map((optionText, optIndex) => (
            <label key={optIndex} className={styles.stackOption}>
              <input
                type="radio"
                name={`archetype-${archetypeQIndex}`}
                checked={archetypeAnswers[archetypeQIndex] === optIndex}
                onChange={() => {
                  setArchetypeAnswers((prev) => ({ ...prev, [archetypeQIndex]: optIndex }));
                  if (isLast) {
                    goTo("teaser");
                  } else {
                    setArchetypeQIndex((i) => i + 1);
                  }
                }}
              />
              <span>{optionText}</span>
            </label>
          ))}
        </div>
        <div className={styles.actions}>
          <button
            className="vg-button vg-button--outline"
            type="button"
            onClick={() => {
              if (archetypeQIndex === 0) goTo("braverman");
              else setArchetypeQIndex((i) => i - 1);
            }}
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  // --- TEASER (partial result) ---
  if (step === "teaser") {
    const partial = computePartialResult({ burnoutAnswers });
    return (
      <div className={styles.screen}>
        <div className={`${styles.teaser}`}>
          <div className={styles.eyebrow}>Промежуточный результат</div>
          <h2 className={styles.title}>Ваш уровень выгорания</h2>
          <div className={styles.teaserScore}>
            {partial.burnoutScore10}
            <span>/10</span>
          </div>
          <p className={styles.subtitle} style={{ margin: "0 auto 2rem" }}>
            {partial.burnoutLabel}. Но балл — только часть картины: у вас есть
            конкретный стиль управления и нейромедиаторный тип, из-за которых
            этот балл именно такой. Это — в полном разборе.
          </p>
          <button className="vg-button" type="button" onClick={() => goTo("capture")}>
            Получить полный разбор
          </button>
        </div>
      </div>
    );
  }

  // --- CAPTURE ---
  if (step === "capture") {
    return (
      <div className={styles.screen}>
        <div className={styles.eyebrow}>Последний шаг</div>
        <h2 className={styles.title}>Куда прислать полный разбор?</h2>
        <p className={styles.subtitle}>
          Тип по нейромедиаторам, колесо баланса, ваш архетип управления и
          конкретная рекомендация — сразу после отправки.
        </p>
        <form className={styles.form} onSubmit={handleCapture}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Имя</span>
            <input
              type="text"
              value={contact.name}
              onChange={(e) => setContact((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </label>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Как с вами связаться</span>
            <div className={styles.methodTabs}>
              {[
                { key: "phone", label: "Телефон" },
                { key: "email", label: "Email" },
                { key: "telegram", label: "Telegram" },
              ].map((m) => (
                <div
                  key={m.key}
                  className={`${styles.methodTab} ${contact.method === m.key ? styles.active : ""}`}
                  onClick={() => setContact((prev) => ({ ...prev, method: m.key }))}
                >
                  {m.label}
                </div>
              ))}
            </div>
            <input
              type={contact.method === "email" ? "email" : "text"}
              placeholder={
                contact.method === "phone"
                  ? "+7 900 000-00-00"
                  : contact.method === "email"
                    ? "you@example.com"
                    : "@username"
              }
              value={contact.value}
              onChange={(e) => setContact((prev) => ({ ...prev, value: e.target.value }))}
              required
            />
          </div>

          <label className={styles.consentRow}>
            <input
              type="checkbox"
              checked={contact.consent}
              onChange={(e) => setContact((prev) => ({ ...prev, consent: e.target.checked }))}
              required
            />
            <span>Согласен(на) на обработку персональных данных в соответствии с политикой конфиденциальности</span>
          </label>

          {submitError && <p className={styles.error}>{submitError}</p>}

          <div className={styles.actions}>
            <button
              className="vg-button vg-button--outline"
              type="button"
              onClick={() => goTo("teaser")}
            >
              Назад
            </button>
            <button className="vg-button" type="submit" disabled={submitting}>
              {submitting ? "Считаем…" : "Получить результат"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- RESULT ---
  if (step === "result" && result) {
    const narrative = buildResultNarrative({
      wheelValues: result.wheelValues,
      archetypeKey: result.archetype.key,
      bravermanTypeKey: result.dominantType.key,
    });

    return (
      <div className={styles.screen}>
        <div className={styles.eyebrow}>Ваш полный разбор</div>
        <h2 className={styles.title}>
          {result.burnoutScore10}/10 — {result.burnoutLabel.toLowerCase()}
        </h2>

        <div className={styles.resultSection}>
          <h3>Как вы устроены</h3>
          <p>{narrative.combined}</p>
        </div>

        <div className={styles.resultSection}>
          <h3>Колесо баланса</h3>
          <div className={styles.chartWrap}>
            <VgWheelChart values={result.wheelValues} />
          </div>
        </div>

        <div className={styles.resultSection}>
          <h3>
            Ваш стиль управления: {result.archetype.label}
            {result.isMixed && ` / ${result.secondArchetype.label}`}
          </h3>
          <p>{result.archetype.mechanismShort}</p>
        </div>

        <div className={styles.resultSection}>
          <h3>К чему это ведёт, если оставить как есть</h3>
          <p>{narrative.stakes}</p>
        </div>

        <div className={styles.resultSection}>
          <h3>Что делать дальше</h3>
          <p>
            Диагноз без плана — просто тревожная информация. На бесплатной
            15-минутной диагностике разберём именно вашу ситуацию и дадим
            1-2 конкретных шага, с которых начать — под ваш тип и вашу
            команду, а не общий совет.
          </p>
          <div className={styles.actions}>
            <a className="vg-button" href="#diagnostics">
              Записаться на диагностику
            </a>
          </div>
        </div>

        <p className={styles.disclaimer}>
          Это инструмент самонаблюдения, а не медицинская диагностика. Тест —
          авторская методика; идея нейромедиаторных типов вдохновлена
          концепцией Eric Braverman, но вопросы и типология написаны
          самостоятельно.
        </p>
      </div>
    );
  }

  return null;
}
