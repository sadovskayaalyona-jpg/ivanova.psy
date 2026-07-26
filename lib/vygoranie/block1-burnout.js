// Блок 1 — уровень выгорания. Авторские вопросы (НЕ копия Бойко/Маслач),
// конструкт (эмоциональное истощение / цинизм / неэффективность) общеизвестен.
export const burnoutScale = {
  key: "burnout",
  title: "Уровень выгорания",
  description: "Оцените, как часто это происходит с вами в последнее время.",
  options: [
    { value: 1, label: "Никогда" },
    { value: 2, label: "Редко" },
    { value: 3, label: "Иногда" },
    { value: 4, label: "Часто" },
    { value: 5, label: "Почти всегда" },
  ],
  groups: [
    {
      key: "exhaustion",
      label: "Эмоциональное истощение",
      questions: [
        "Я просыпаюсь уставшим(ей), даже если накануне выспался(ась) достаточно часов",
        "К вечеру не остаётся сил ни на что, кроме как лечь и ничего не делать",
        "Мысль о новом рабочем дне вызывает внутреннее сопротивление ещё до его начала",
        "Мне физически тяжело заставить себя включиться в задачи, которые раньше давались легко",
      ],
    },
    {
      key: "cynicism",
      label: "Отстранённость / цинизм",
      questions: [
        "Я ловлю себя на раздражении к сотрудникам чаще, чем раньше",
        "Мне всё труднее искренне интересоваться проблемами команды — хочется, чтобы просто отстали",
        "Я стал(а) более формальным(ой) и отстранённым(ой) с людьми, с которыми раньше было легко",
        "Иногда ловлю себя на мысли «какая разница» там, где раньше точно было не всё равно",
      ],
    },
    {
      key: "inefficacy",
      label: "Ощущение неэффективности",
      questions: [
        "Несмотря на объём сделанного, всё чаще ощущение, что толку от этого мало",
        "Мне стало сложнее увидеть свой вклад и результат — как будто топчусь на месте",
      ],
    },
  ],
  minScore: 10,
  maxScore: 50,
  thresholds: [
    { max: 20, label: "Низкий уровень" },
    { max: 30, label: "Умеренный уровень" },
    { max: 40, label: "Высокий уровень" },
    { max: 50, label: "Критический уровень" },
  ],
};

// Нормализует сумму 10–50 в шкалу 1–10 для тизера частичного результата.
export function normalizeBurnoutScore(sum) {
  const clamped = Math.min(Math.max(sum, burnoutScale.minScore), burnoutScale.maxScore);
  const ratio = (clamped - burnoutScale.minScore) / (burnoutScale.maxScore - burnoutScale.minScore);
  return Math.round(1 + ratio * 9);
}

export function getBurnoutLabel(sum) {
  const found = burnoutScale.thresholds.find((t) => sum <= t.max);
  return found ? found.label : burnoutScale.thresholds[burnoutScale.thresholds.length - 1].label;
}
