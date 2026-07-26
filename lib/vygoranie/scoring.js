import { burnoutScale, normalizeBurnoutScore, getBurnoutLabel } from "./block1-burnout";

// Чистая клиентская функция (не требует обращения к серверу/базе) —
// используется для мгновенного тизера сразу после Блока 1, до формы захвата.
export function computePartialResult({ burnoutAnswers }) {
  const flatQuestions = burnoutScale.groups.flatMap((g) => g.questions);
  const total = flatQuestions.reduce((sum, _, i) => sum + (burnoutAnswers[i] ?? 0), 0);
  return {
    burnoutScore10: normalizeBurnoutScore(total),
    burnoutLabel: getBurnoutLabel(total),
  };
}
