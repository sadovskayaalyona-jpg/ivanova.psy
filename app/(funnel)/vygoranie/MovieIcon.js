"use client";

// Оригинальные символические иконки под архетип — не портреты персонажей,
// а абстрактный знак механизма выгорания (см. mechanism в block4-archetypes.js).
// Нужны именно так: кадры из фильмов на коммерческом сайте — риск по авторскому праву.

const STROKE = 1.6;

function IconWrap({ children, label }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="48"
      height="48"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

// Критикующий Родитель — лупа над галочкой: вечная проверка на изъян
function IconMagnifier(props) {
  return (
    <IconWrap label="Проверка на изъян" {...props}>
      <circle cx="20" cy="20" r="11" />
      <line x1="28" y1="28" x2="38" y2="38" />
      <path d="M15 20l3.5 3.5L26 15" />
    </IconWrap>
  );
}

// Заботливый / Спасающий Родитель — ладонь, держащая звезду
function IconCradle(props) {
  return (
    <IconWrap label="Забота обо всех вокруг" {...props}>
      <path d="M8 26c0 9 7 15 16 15s16-6 16-15" />
      <path d="M8 26c2-3 5-4 8-2" />
      <path d="M40 26c-2-3-5-4-8-2" />
      <path d="M24 12l2.2 4.6 5 .7-3.6 3.6.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.6 5-.7z" />
    </IconWrap>
  );
}

// Взрослый-одиночка / эксперт — фигура в одиночестве среди шестерёнок
function IconLoneGear(props) {
  return (
    <IconWrap label="В одиночку среди механизма" {...props}>
      <circle cx="24" cy="16" r="5.5" />
      <path d="M24 21.5c-6 0-10 3.5-10 9v3h20v-3c0-5.5-4-9-10-9z" />
      <circle cx="38" cy="14" r="5" />
      <path d="M38 8v-2M38 20v2M32 14h-2M46 14h-2M34 10l-1.4-1.4M43.4 19.4L42 18M34 18l-1.4 1.4M43.4 8.6L42 10" />
    </IconWrap>
  );
}

// Обиженный Ребёнок — спираль внутри облака мыслей
function IconRuminate(props) {
  return (
    <IconWrap label="Прокручивание одной мысли" {...props}>
      <path d="M10 28a10 10 0 1 1 10 10" />
      <path d="M8 40l3-7 7 3z" />
      <path d="M24 18a6 6 0 1 1 6 6 4 4 0 1 1-4-4" />
    </IconWrap>
  );
}

// Бунтующий Ребёнок — флаг на вершине, поднятый против ветра
function IconFlag(props) {
  return (
    <IconWrap label="Флаг сопротивления" {...props}>
      <line x1="14" y1="8" x2="14" y2="42" />
      <path d="M14 10c6-4 10 2 16-2v14c-6 4-10-2-16 2z" />
      <path d="M6 42h20" />
    </IconWrap>
  );
}

// Угодливый Ребёнок — маска с улыбкой поверх контура настоящего лица
function IconMask(props) {
  return (
    <IconWrap label="Маска согласия" {...props}>
      <circle cx="24" cy="24" r="15" />
      <path d="M17 21c1-1.3 2.4-2 4-2M27 19c1.6 0 3 .7 4 2" />
      <path d="M16 28c2.5 4 5 6 8 6s5.5-2 8-6" />
    </IconWrap>
  );
}

// Пожарный-Герой — пламя, живое только в момент вспышки
function IconFlame(props) {
  return (
    <IconWrap label="Живёт в моменте вспышки" {...props}>
      <path d="M24 6c3 6-2 8-2 13 0-3 4-2 4 2a6 6 0 1 1-12 0c0-8 6-9 10-15z" />
      <path d="M20 30a4 4 0 1 0 8 0c0-3-2-4-2-7" />
    </IconWrap>
  );
}

// Заложник Статуса — корона, балансирующая на острие
function IconCrown(props) {
  return (
    <IconWrap label="Корона на острие" {...props}>
      <path d="M10 24l6 12h16l6-12-8 5-6-10-6 10z" />
      <line x1="24" y1="41" x2="24" y2="45" />
      <line x1="14" y1="45" x2="34" y2="45" />
    </IconWrap>
  );
}

export const movieIconByArchetype = {
  "critical-parent": IconMagnifier,
  "caring-parent": IconCradle,
  "lone-expert": IconLoneGear,
  "hurt-child": IconRuminate,
  "rebel-child": IconFlag,
  "compliant-child": IconMask,
  "hero-firefighter": IconFlame,
  "status-hostage": IconCrown,
};

export default function MovieIcon({ archetypeKey, className }) {
  const Icon = movieIconByArchetype[archetypeKey];
  if (!Icon) return null;
  return <Icon className={className} />;
}
