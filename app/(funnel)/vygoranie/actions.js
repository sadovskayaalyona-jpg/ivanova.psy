"use server";

import { createClient } from "@supabase/supabase-js";
import { burnoutScale, normalizeBurnoutScore, getBurnoutLabel } from "@/lib/vygoranie/block1-burnout";
import { bravermanScale } from "@/lib/vygoranie/block3-braverman";
import { archetypes, scoreArchetypes } from "@/lib/vygoranie/block4-archetypes";

// Анонимная воронка — используем anon-ключ напрямую (без cookies/сессии,
// в отличие от защищённого кабинета в lib/supabase/server.js).
function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function submitLead({
  contact,
  burnoutAnswers,
  wheelValues,
  bravermanAnswers,
  archetypeAnswers,
}) {
  if (!contact?.name?.trim()) {
    return { error: "Укажите имя." };
  }
  if (!contact?.value?.trim()) {
    return { error: "Укажите телефон, email или Telegram." };
  }
  if (!contact?.consent) {
    return { error: "Нужно согласие на обработку персональных данных." };
  }

  // Блок 1 — выгорание
  const burnoutFlat = burnoutScale.groups.flatMap((g) => g.questions);
  const burnoutSum = burnoutFlat.reduce((sum, _, i) => sum + (burnoutAnswers[i] ?? 0), 0);
  const burnoutScore10 = normalizeBurnoutScore(burnoutSum);
  const burnoutLabel = getBurnoutLabel(burnoutSum);

  // Блок 3 — тип по Браверману
  const typeScores = {};
  let flatIndex = 0;
  for (const type of bravermanScale.types) {
    let sum = 0;
    for (let i = 0; i < type.statements.length; i++) {
      sum += bravermanAnswers[flatIndex] ?? 0;
      flatIndex += 1;
    }
    typeScores[type.key] = sum;
  }
  const dominantType = bravermanScale.types.reduce((best, t) =>
    typeScores[t.key] > typeScores[best.key] ? t : best
  , bravermanScale.types[0]);

  // Блок 4 — архетип руководителя
  // archetypeAnswers приходит как {0: индекс, 1: индекс, ...} — приводим
  // к массиву в порядке вопросов, scoreArchetypes ожидает именно массив.
  const { dominant, second, isMixed, counts } = scoreArchetypes(Object.values(archetypeAnswers));

  const supabase = anonClient();
  const { data, error } = await supabase
    .from("vygoranie_leads")
    .insert({
      name: contact.name.trim(),
      contact_method: contact.method,
      contact_value: contact.value.trim(),
      consent_given: true,
      burnout_score: burnoutScore10,
      burnout_label: burnoutLabel,
      braverman_type: dominantType.key,
      wheel_answers: wheelValues,
      archetype_key: dominant.key,
      archetype_label: dominant.label,
      is_mixed_profile: isMixed,
    })
    .select("id")
    .single();

  if (error) {
    return { error: "Не получилось сохранить результат. Попробуйте ещё раз." };
  }

  return {
    success: true,
    leadId: data.id,
    burnoutScore10,
    burnoutLabel,
    dominantType,
    wheelValues,
    archetype: { ...dominant, mechanismShort: archetypes.find((a) => a.key === dominant.key)?.mechanism },
    secondArchetype: second,
    isMixed,
    archetypeCounts: counts,
  };
}
