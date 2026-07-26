"use server";

import { createClient } from "@/lib/supabase/server";
import { wheelOfBalance } from "@/lib/tests/wheel-of-balance";
import { neurotype, getFlatQuestions } from "@/lib/tests/neurotype";
import { PATH_SLUG } from "@/lib/tests/path-narrative";
import { generateGoalStrategy } from "@/lib/ai/goalStrategy";

export async function submitPath({ wheelValues, neuroAnswers, goals }) {
  for (const sphere of wheelOfBalance.spheres) {
    const v = wheelValues?.[sphere.key];
    if (
      typeof v !== "number" ||
      v < wheelOfBalance.min ||
      v > wheelOfBalance.max
    ) {
      return { error: "Некорректные данные колеса баланса." };
    }
  }

  const flatQuestions = getFlatQuestions();
  const scores = {};
  for (const dim of neurotype.dimensions) scores[dim.key] = 0;
  for (const q of flatQuestions) {
    const v = neuroAnswers?.[q.fieldName];
    if (typeof v !== "number") {
      return { error: "Ответьте на все вопросы профиля нейромедиаторов." };
    }
    scores[q.dimKey] += v;
  }

  const sortedDims = [...neurotype.dimensions].sort(
    (a, b) => scores[b.key] - scores[a.key]
  );
  const dominant = sortedDims[0];
  const second = sortedDims[1];
  const isMixed = scores[dominant.key] - scores[second.key] <= neurotype.mixedProfileThreshold;

  const enrichedGoals = [];
  for (const goal of goals ?? []) {
    const sphere = wheelOfBalance.spheres.find((s) => s.key === goal.sphereKey);
    if (!sphere || !goal.text) continue;
    const strategy = await generateGoalStrategy({
      goalText: goal.text,
      sphereLabel: sphere.label,
      sphereScore: wheelValues[goal.sphereKey],
      maxScore: wheelOfBalance.max,
      neurotypeLabel: dominant.label,
      depletedBy: dominant.depletedBy,
      recommendations: dominant.recommendations,
    });
    enrichedGoals.push({
      sphereKey: goal.sphereKey,
      sphereLabel: sphere.label,
      text: goal.text,
      strategy,
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Сессия истекла, войдите заново." };
  }

  const wheelScores = Object.values(wheelValues);
  const wheelAverage = wheelScores.reduce((a, b) => a + b, 0) / wheelScores.length;

  const { data, error } = await supabase
    .from("test_results")
    .insert({
      user_id: user.id,
      test_slug: PATH_SLUG,
      answers: {
        wheel: wheelValues,
        neurotype: scores,
        goals: enrichedGoals,
      },
      score: Math.round(wheelAverage),
    })
    .select("id")
    .single();

  if (error) {
    return {
      error: "Не получилось сохранить результат. Попробуйте ещё раз.",
    };
  }

  return {
    success: true,
    resultId: data.id,
    wheelValues,
    wheelAverage,
    scores,
    dominantKey: dominant.key,
    secondKey: second.key,
    isMixed,
    goals: enrichedGoals,
  };
}
