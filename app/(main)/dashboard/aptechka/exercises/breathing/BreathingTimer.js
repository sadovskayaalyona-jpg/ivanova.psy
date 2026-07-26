"use client";

import { useEffect, useState } from "react";
import styles from "./breathing.module.css";

const PHASES = [
  { key: "inhale", label: "Вдох", duration: 4, scale: 1.4 },
  { key: "hold1", label: "Задержка", duration: 4, scale: 1.4 },
  { key: "exhale", label: "Выдох", duration: 4, scale: 1 },
  { key: "hold2", label: "Задержка", duration: 4, scale: 1 },
];

export default function BreathingTimer() {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState({
    phaseIndex: 0,
    secondsLeft: PHASES[0].duration,
  });

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setTick((prev) => {
        if (prev.secondsLeft > 1) {
          return { ...prev, secondsLeft: prev.secondsLeft - 1 };
        }
        const nextPhase = (prev.phaseIndex + 1) % PHASES.length;
        return {
          phaseIndex: nextPhase,
          secondsLeft: PHASES[nextPhase].duration,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  const phase = PHASES[tick.phaseIndex];

  const start = () => {
    setTick({ phaseIndex: 0, secondsLeft: PHASES[0].duration });
    setRunning(true);
  };

  const stop = () => {
    setRunning(false);
    setTick({ phaseIndex: 0, secondsLeft: PHASES[0].duration });
  };

  return (
    <div className={styles.wrap}>
      <div
        className={styles.circle}
        style={{
          transform: `scale(${running ? phase.scale : 1})`,
          transitionDuration: `${phase.duration}s`,
        }}
      >
        <span className={styles.phaseLabel}>
          {running ? phase.label : "Готовы?"}
        </span>
        {running && <span className={styles.seconds}>{tick.secondsLeft}</span>}
      </div>

      {running ? (
        <button className="button button--outline" type="button" onClick={stop}>
          Остановить
        </button>
      ) : (
        <button className="button button--primary" type="button" onClick={start}>
          Начать
        </button>
      )}
    </div>
  );
}
