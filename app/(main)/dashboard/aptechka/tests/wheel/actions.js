"use server";

import { createClient } from "@/lib/supabase/server";
import { wheelOfBalance } from "@/lib/tests/wheel-of-balance";

export async function submitWheel(prevState, formData) {
  const values = {};

  for (const sphere of wheelOfBalance.spheres) {
    const raw = formData.get(sphere.key);
    const num = Number(raw);
    if (
      raw === null ||
      Number.isNaN(num) ||
      num < wheelOfBalance.min ||
      num > wheelOfBalance.max
    ) {
      return { error: "Заполните все шкалы корректными значениями." };
    }
    values[sphere.key] = num;
  }

  const scores = Object.values(values);
  const average = scores.reduce((sum, v) => sum + v, 0) / scores.length;

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
      test_slug: wheelOfBalance.slug,
      answers: values,
      score: Math.round(average),
    })
    .select("id")
    .single();

  if (error) {
    return {
      error: "Не получилось сохранить результат. Попробуйте ещё раз.",
    };
  }

  return { success: true, resultId: data.id, values, average };
}
