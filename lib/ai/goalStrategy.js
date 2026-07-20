import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `Ты помогаешь психологу писать короткие персональные рекомендации для клиентов по итогам самотестирования (колесо баланса + профиль ведущего нейромедиатора).

Пиши по-русски, тепло и конкретно, 3–4 предложения. Не используй общие фразы вроде «постарайтесь больше отдыхать» — опирайся на то, что клиент сам написал как свою цель, и предложи 1–2 конкретных, выполнимых первых шага, которые можно сделать в течение недели. Учитывай ведущий психологический тип клиента — что его истощает и что помогает восполнять ресурс.

Обращайся на «вы». Не ставь диагнозов и не давай медицинских советов.`;

function buildUserPrompt({
  goalText,
  sphereLabel,
  sphereScore,
  maxScore,
  neurotypeLabel,
  depletedBy,
  recommendations,
}) {
  return `Сфера жизни с низкой удовлетворённостью: ${sphereLabel} (${sphereScore} из ${maxScore})
Цель клиента в этой сфере: «${goalText}»
Ведущий психологический тип клиента: ${neurotypeLabel}
Что истощает этот тип: ${depletedBy}
Что помогает этому типу восполнять ресурс: ${recommendations}

Напиши короткую персональную стратегию достижения этой цели с учётом типа клиента.`;
}

function fallbackStrategy({ goalText, sphereLabel }) {
  return `Ваша цель — «${goalText}» — напрямую связана со сферой «${sphereLabel}». Начните с одного небольшого, конкретного шага на этой неделе, а не с попытки изменить всё сразу: так вы быстрее увидите первый результат и сохраните мотивацию для следующих шагов.`;
}

export async function generateGoalStrategy(params) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return fallbackStrategy(params);
  }

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(params) }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    return textBlock?.text?.trim() || fallbackStrategy(params);
  } catch {
    return fallbackStrategy(params);
  }
}
