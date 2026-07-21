import { Document, Page, View, Text, Svg, Polygon, Line, Rect, StyleSheet } from "@react-pdf/renderer";
import { wheelOfBalance } from "../tests/wheel-of-balance";
import { neurotype } from "../tests/neurotype";
import { buildPathNarrative } from "../tests/path-narrative";
import { registerPdfFonts } from "./fonts";

registerPdfFonts();

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "PT Sans" },
  title: { fontSize: 20, marginBottom: 4, color: "#263449" },
  subtitle: { fontSize: 10, color: "#5b6472", marginBottom: 20 },
  chartsRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  legend: { marginBottom: 16 },
  legendItem: { fontSize: 9, marginBottom: 2, color: "#333" },
  sectionTitle: { fontSize: 13, marginTop: 18, marginBottom: 6, color: "#263449" },
  bodyText: { fontSize: 10, color: "#333", lineHeight: 1.4, marginBottom: 6 },
  block: { marginBottom: 10 },
  blockTitle: { fontSize: 11, marginBottom: 2, color: "#1f2430" },
  footer: { marginTop: 24, fontSize: 8, color: "#888" },
});

const WHEEL_SIZE = 190;
const WHEEL_CENTER = WHEEL_SIZE / 2;
const WHEEL_MAX_RADIUS = WHEEL_CENTER - 30;

function wheelPoint(index, total, value, max) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const radius = (value / max) * WHEEL_MAX_RADIUS;
  return {
    x: WHEEL_CENTER + radius * Math.cos(angle),
    y: WHEEL_CENTER + radius * Math.sin(angle),
  };
}

const BAR_CHART_WIDTH = 220;
const BAR_CHART_HEIGHT_TOTAL = 170;
const BAR_CHART_HEIGHT = 130;
const BAR_WIDTH = 32;
const BAR_GAP = 16;
const BAR_MAX_SCORE = 15;

export default function PathPdf({
  wheelValues,
  wheelAverage,
  scores,
  dominantKey,
  secondKey,
  isMixed,
  goals,
  date,
}) {
  const spheres = wheelOfBalance.spheres;
  const total = spheres.length;
  const max = wheelOfBalance.max;

  const wheelPolygonPoints = spheres
    .map((s, i) => {
      const p = wheelPoint(i, total, wheelValues[s.key], max);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  const lowSpheres = spheres.filter(
    (s) => wheelValues[s.key] <= wheelOfBalance.lowScoreThreshold
  );

  const narrative = buildPathNarrative({ wheelValues, dominantKey });
  const second = neurotype.dimensions.find((d) => d.key === secondKey);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Персональная карта — Путь к балансу</Text>
        <Text style={styles.subtitle}>
          Результат от {date} · средний балл колеса {wheelAverage.toFixed(1)} из {max}
        </Text>

        <View style={styles.chartsRow}>
          <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
            {[0.25, 0.5, 0.75, 1].map((fraction) => {
              const ring = spheres
                .map((_, i) => {
                  const p = wheelPoint(i, total, fraction * max, max);
                  return `${p.x},${p.y}`;
                })
                .join(" ");
              return (
                <Polygon key={fraction} points={ring} stroke="#e2e0da" strokeWidth={1} fill="none" />
              );
            })}
            {spheres.map((s, i) => {
              const edge = wheelPoint(i, total, max, max);
              return (
                <Line
                  key={s.key}
                  x1={WHEEL_CENTER}
                  y1={WHEEL_CENTER}
                  x2={edge.x}
                  y2={edge.y}
                  stroke="#e2e0da"
                  strokeWidth={1}
                />
              );
            })}
            <Polygon
              points={wheelPolygonPoints}
              fill="#4b7b6f"
              fillOpacity={0.35}
              stroke="#4b7b6f"
              strokeWidth={2}
            />
          </Svg>

          <Svg
            width={BAR_CHART_WIDTH}
            height={BAR_CHART_HEIGHT_TOTAL}
            viewBox={`0 0 ${BAR_CHART_WIDTH} ${BAR_CHART_HEIGHT_TOTAL}`}
          >
            {neurotype.dimensions.map((dim, i) => {
              const value = scores[dim.key] ?? 0;
              const barHeight = (value / BAR_MAX_SCORE) * BAR_CHART_HEIGHT;
              const x = i * (BAR_WIDTH + BAR_GAP) + BAR_GAP / 2;
              const y = BAR_CHART_HEIGHT - barHeight + 10;
              const isDominant = dim.key === dominantKey;
              return (
                <Rect
                  key={dim.key}
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={barHeight}
                  fill={isDominant ? "#4b7b6f" : "#c7d3ce"}
                />
              );
            })}
          </Svg>
        </View>

        <View style={styles.legend}>
          {spheres.map((s) => (
            <Text key={s.key} style={styles.legendItem}>
              {s.label}: {wheelValues[s.key]}/{max}
            </Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Как ты устроен</Text>
        <Text style={styles.bodyText}>{narrative.howYouAreBuilt}</Text>
        {isMixed && (
          <Text style={styles.bodyText}>
            Профиль смешанный — вторым по значимости идёт тип «{second.label}».
          </Text>
        )}

        {lowSpheres.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Куда утекает ресурс</Text>
            {lowSpheres.map((s) => (
              <View key={s.key} style={styles.block}>
                <Text style={styles.blockTitle}>
                  {s.label} — {wheelValues[s.key]}/{max}
                </Text>
                <Text style={styles.bodyText}>{s.lowScoreText}</Text>
              </View>
            ))}
          </View>
        )}

        {goals && goals.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Твои цели и стратегия</Text>
            {goals.map((g) => (
              <View key={g.sphereKey} style={styles.block}>
                <Text style={styles.blockTitle}>
                  {g.sphereLabel}: {g.text}
                </Text>
                <Text style={styles.bodyText}>{g.strategy}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Ежедневные ритуалы</Text>
        <Text style={styles.bodyText}>Утро: «{narrative.dominant.morningRitual}»</Text>
        <Text style={styles.bodyText}>Вечер: «{narrative.dominant.eveningRitual}»</Text>

        <Text style={styles.sectionTitle}>Главный фокус</Text>
        <Text style={styles.bodyText}>
          Начните с одной сферы — «{narrative.focusSphere.label}». Именно она сейчас
          больше всего тянет колесо вниз, и даже небольшое улучшение здесь
          отзовётся на остальном.
        </Text>

        <Text style={styles.footer}>
          {wheelOfBalance.disclaimer} {neurotype.disclaimer}
        </Text>
        <Text style={styles.footer}>{neurotype.inspiredBy}</Text>
      </Page>
    </Document>
  );
}
