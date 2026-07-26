// Блок 2 — колесо баланса. Открытый коучинговый инструмент, авторства
// вопросов не требует. Финальные формулировки сфер для этой воронки.
export const wheelSpheres = {
  key: "wheel",
  title: "Колесо баланса",
  description: "Оцените, насколько вы удовлетворены каждой сферой прямо сейчас.",
  min: 1,
  max: 10,
  spheres: [
    { key: "work", label: "Работа" },
    { key: "health", label: "Здоровье" },
    { key: "relationships", label: "Отношения" },
    { key: "rest", label: "Отдых" },
    { key: "finance", label: "Финансы" },
    { key: "growth", label: "Саморазвитие" },
    { key: "family", label: "Семья" },
    { key: "environment", label: "Окружение" },
  ],
};
