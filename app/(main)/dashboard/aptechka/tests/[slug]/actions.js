"use server";

import { createClient } from "@/lib/supabase/server";
import { getTest } from "@/lib/tests";

export async function submitTest(prevState, formData) {
  const slug = formData.get("slug");
  const test = getTest(slug);
  if (!test) {
    return { error: "Тест не найден." };
  }

  const answers = test.questions.map((_, i) => {
    const raw = formData.get(`q${i}`);
    return raw === null ? null : Number(raw);
  });

  if (answers.some((a) => a === null || Number.isNaN(a))) {
    return { error: "Ответьте на все вопросы." };
  }

  const score = answers.reduce((sum, a) => sum + a, 0);
  const interpretation = test.interpret(score);
  const showCrisis =
    typeof test.crisisItemIndex === "number" &&
    answers[test.crisisItemIndex] > 0;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Сессия истекла, войдите заново." };
  }

  const { error } = await supabase.from("test_results").insert({
    user_id: user.id,
    test_slug: slug,
    answers,
    score,
  });

  if (error) {
    return {
      error: "Не получилось сохранить результат. Попробуйте ещё раз.",
    };
  }

  return {
    success: true,
    score,
    maxScore: test.maxScore,
    interpretation,
    showCrisis,
  };
}
