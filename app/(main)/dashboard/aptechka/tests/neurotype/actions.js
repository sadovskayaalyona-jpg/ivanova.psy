"use server";

import { createClient } from "@/lib/supabase/server";
import { neurotype, getFlatQuestions } from "@/lib/tests/neurotype";

export async function submitNeurotype(prevState, formData) {
  const flatQuestions = getFlatQuestions();
  const scores = {};
  for (const dim of neurotype.dimensions) scores[dim.key] = 0;

  for (const q of flatQuestions) {
    const raw = formData.get(q.fieldName);
    const num = Number(raw);
    if (raw === null || Number.isNaN(num)) {
      return { error: "Ответьте на все вопросы." };
    }
    scores[q.dimKey] += num;
  }

  const sortedDims = [...neurotype.dimensions].sort(
    (a, b) => scores[b.key] - scores[a.key]
  );
  const topScore = scores[sortedDims[0].key];
  const secondScore = scores[sortedDims[1].key];
  const isMixed = topScore - secondScore <= neurotype.mixedProfileThreshold;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Сессия истекла, войдите заново." };
  }

  const { data, error } = await supabase
    .from("test_results")
    .insert({
      user_id: user.id,
      test_slug: neurotype.slug,
      answers: scores,
      score: topScore,
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
    scores,
    dominantKey: sortedDims[0].key,
    secondKey: sortedDims[1].key,
    isMixed,
  };
}
