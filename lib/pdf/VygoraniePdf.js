import { Document, Page, View, Text, Svg, Polygon, Line, StyleSheet } from "@react-pdf/renderer";
import { wheelSpheres } from "../vygoranie/block2-wheel";
import { registerPdfFonts } from "./fonts";

registerPdfFonts();

// Палитра воронки «Тест на выгорание» (см. app/(funnel)/funnel.css) —
// отдельная от навигационной сине-серой палитры остальных PDF сайта,
// намеренно: этот отчёт брендирован под конкретную воронку.
const ACCENT = "#a3ad2c"; // затемнённый --vg-accent для читаемости на белом
const TEXT = "#1a1d10";
const TEXT_MUTED = "#6b6f5c";
const BORDER = "#dde0c4";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "PT Sans", color: TEXT },
  eyebrow: { fontSize: 9, letterSpacing: 1, color: ACCENT, marginBottom: 4 },
  title: { fontSize: 20, marginBottom: 4 },
  subtitle: { fontSize: 10, color: TEXT_MUTED, marginBottom: 20 },
  section: {
    marginBottom: 18,
    paddingBottom: 18,
    borderBottom: `1pt solid ${BORDER}`,
  },
  sectionTitle: { fontSize: 13, marginBottom: 8 },
  body: { fontSize: 10, color: TEXT, lineHeight: 1.5 },
  bodyMuted: { fontSize: 10, color: TEXT_MUTED, lineHeight: 1.5 },
  chartWrap: { alignItems: "center", marginBottom: 12 },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  legendItem: { fontSize: 9, color: TEXT_MUTED, width: "45%", marginBottom: 3 },
  movieName: { fontSize: 15, marginBottom: 2 },
  movieSource: { fontSize: 9, color: TEXT_MUTED, marginBottom: 10 },
  listItem: { fontSize: 10, color: TEXT, lineHeight: 1.5, marginBottom: 4, paddingLeft: 10 },
  subhead: { fontSize: 10, marginTop: 10, marginBottom: 6, color: ACCENT },
  footer: { marginTop: 10, fontSize: 8, color: TEXT_MUTED, lineHeight: 1.4 },
});

const SIZE = 200;
const CENTER = SIZE / 2;
const MAX_RADIUS = CENTER - 30;

function pointFor(index, total, value, max) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const radius = (value / max) * MAX_RADIUS;
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

function WheelChart({ values }) {
  const spheres = wheelSpheres.spheres;
  const total = spheres.length;
  const max = wheelSpheres.max;

  const dataPoints = spheres
    .map((s, i) => {
      const p = pointFor(i, total, values[s.key], max);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      {[0.25, 0.5, 0.75, 1].map((fraction) => {
        const ring = spheres
          .map((_, i) => {
            const p = pointFor(i, total, fraction * max, max);
            return `${p.x},${p.y}`;
          })
          .join(" ");
        return <Polygon key={fraction} points={ring} stroke={BORDER} strokeWidth={1} fill="none" />;
      })}
      {spheres.map((s, i) => {
        const edge = pointFor(i, total, max, max);
        return (
          <Line key={s.key} x1={CENTER} y1={CENTER} x2={edge.x} y2={edge.y} stroke={BORDER} strokeWidth={1} />
        );
      })}
      <Polygon points={dataPoints} fill={ACCENT} fillOpacity={0.35} stroke={ACCENT} strokeWidth={2} />
    </Svg>
  );
}

export default function VygoraniePdf({
  date,
  burnoutScore10,
  burnoutLabel,
  wheelValues,
  bravermanType,
  archetype,
  narrative,
  movie,
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>ТЕСТ ДЛЯ РУКОВОДИТЕЛЕЙ · ПОЛНЫЙ РАЗБОР</Text>
        <Text style={styles.title}>
          {burnoutScore10}/10 — {burnoutLabel}
        </Text>
        <Text style={styles.subtitle}>Результат от {date}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Как вы устроены</Text>
          <Text style={styles.body}>{narrative.combined}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Колесо баланса</Text>
          <View style={styles.chartWrap}>
            <WheelChart values={wheelValues} />
          </View>
          <View style={styles.legend}>
            {wheelSpheres.spheres.map((s) => (
              <Text key={s.key} style={styles.legendItem}>
                {s.label}: {wheelValues[s.key]}/{wheelSpheres.max}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Ваш стиль управления: {archetype.label}
          </Text>
          <Text style={styles.body}>{archetype.mechanism}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Что вас заряжает и истощает</Text>
          <Text style={styles.body}>
            {bravermanType.label} — {bravermanType.burnoutPhrase}.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>К чему это ведёт, если оставить как есть</Text>
          <Text style={styles.body}>{narrative.stakes}</Text>
        </View>

        {movie && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Кто вы в этой роли</Text>
            <Text style={styles.movieName}>Вы — {movie.character}</Text>
            <Text style={styles.movieSource}>{movie.source} · портрет «{movie.portrait}»</Text>

            {movie.introParagraphs.map((p, i) => (
              <Text key={i} style={[styles.body, { marginBottom: 6 }]}>
                {p}
              </Text>
            ))}

            <Text style={styles.subhead}>Сильные стороны</Text>
            {movie.strengths.map((s, i) => (
              <Text key={i} style={styles.listItem}>
                — {s}
              </Text>
            ))}

            <Text style={styles.subhead}>Тень</Text>
            {movie.shadow.map((s, i) => (
              <Text key={i} style={styles.listItem}>
                — {s}
              </Text>
            ))}

            <Text style={styles.subhead}>Зона роста</Text>
            {movie.growthAreas.map((s, i) => (
              <Text key={i} style={styles.listItem}>
                {i + 1}. {s}
              </Text>
            ))}

            <Text style={styles.subhead}>Как гармонизировать и не выгорать</Text>
            <Text style={styles.body}>{movie.harmonize}</Text>
          </View>
        )}

        <Text style={styles.footer}>
          Это инструмент самонаблюдения, а не медицинская диагностика. Тест — авторская методика;
          типология мотивационных типов вдохновлена концепцией нейромедиаторных доминант Eric Braverman,
          но вопросы и формулировки типов написаны самостоятельно и адаптированы под управленческий
          контекст.
        </Text>
      </Page>
    </Document>
  );
}
