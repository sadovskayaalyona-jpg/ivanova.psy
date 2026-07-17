"use client";

import { useState } from "react";
import styles from "./grounding.module.css";

const STEPS = [
  { count: 5, sense: "вещей, которые вы видите вокруг" },
  { count: 4, sense: "вещей, которые вы можете потрогать" },
  { count: 3, sense: "звуков, которые вы слышите" },
  { count: 2, sense: "запахов, которые вы чувствуете" },
  { count: 1, sense: "вкус, который вы ощущаете (или который вам нравится)" },
];

export default function GroundingGuide() {
  const [stepIndex, setStepIndex] = useState(-1); // -1 — не начато

  if (stepIndex === -1) {
    return (
      <button
        className="button button--primary"
        type="button"
        onClick={() => setStepIndex(0)}
      >
        Начать
      </button>
    );
  }

  if (stepIndex >= STEPS.length) {
    return (
      <div className={styles.done}>
        <p>Готово. Как вы себя чувствуете сейчас?</p>
        <button
          className="button button--outline"
          type="button"
          onClick={() => setStepIndex(-1)}
        >
          Начать заново
        </button>
      </div>
    );
  }

  const step = STEPS[stepIndex];

  return (
    <div className={styles.step}>
      <div className={styles.stepNumber}>{step.count}</div>
      <p className={styles.stepText}>
        Назовите {step.count} {step.sense}
      </p>
      <button
        className="button button--primary"
        type="button"
        onClick={() => setStepIndex((i) => i + 1)}
      >
        Далее
      </button>
    </div>
  );
}
