import { Document, Page, View, Text, Svg, Polygon, Line, StyleSheet } from "@react-pdf/renderer";
import { wheelOfBalance } from "../tests/wheel-of-balance";
import { registerPdfFonts } from "./fonts";

registerPdfFonts();

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "PT Sans" },
  title: { fontSize: 18, marginBottom: 4, color: "#263449" },
  subtitle: { fontSize: 10, color: "#5b6472", marginBottom: 20 },
  chartWrap: { alignItems: "center", marginBottom: 16 },
  legend: { marginBottom: 16 },
  legendItem: { fontSize: 9, marginBottom: 2, color: "#333" },
  sectionTitle: { fontSize: 13, marginTop: 16, marginBottom: 8, color: "#263449" },
  sphereBlock: { marginBottom: 10 },
  sphereTitle: { fontSize: 11, marginBottom: 2, color: "#1f2430" },
  sphereText: { fontSize: 10, color: "#333", lineHeight: 1.4 },
  footer: { marginTop: 30, fontSize: 8, color: "#888" },
});

const SIZE = 240;
const CENTER = SIZE / 2;
const MAX_RADIUS = CENTER - 40;

function pointFor(index, total, value, max) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const radius = (value / max) * MAX_RADIUS;
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

export default function WheelPdf({ values, average, date }) {
  const spheres = wheelOfBalance.spheres;
  const total = spheres.length;
  const max = wheelOfBalance.max;

  const dataPolygonPoints = spheres
    .map((s, i) => {
      const p = pointFor(i, total, values[s.key], max);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  const lowSpheres = spheres.filter(
    (s) => values[s.key] <= wheelOfBalance.lowScoreThreshold
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{wheelOfBalance.title}</Text>
        <Text style={styles.subtitle}>
          Результат от {date} · средний балл {average.toFixed(1)} из {max}
        </Text>

        <View style={styles.chartWrap}>
          <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {[0.25, 0.5, 0.75, 1].map((fraction) => {
              const ring = spheres
                .map((_, i) => {
                  const p = pointFor(i, total, fraction * max, max);
                  return `${p.x},${p.y}`;
                })
                .join(" ");
              return (
                <Polygon
                  key={fraction}
                  points={ring}
                  stroke="#e2e0da"
                  strokeWidth={1}
                  fill="none"
                />
              );
            })}
            {spheres.map((s, i) => {
              const edge = pointFor(i, total, max, max);
              return (
                <Line
                  key={s.key}
                  x1={CENTER}
                  y1={CENTER}
                  x2={edge.x}
                  y2={edge.y}
                  stroke="#e2e0da"
                  strokeWidth={1}
                />
              );
            })}
            <Polygon
              points={dataPolygonPoints}
              fill="#4b7b6f"
              fillOpacity={0.35}
              stroke="#4b7b6f"
              strokeWidth={2}
            />
          </Svg>
        </View>

        <View style={styles.legend}>
          {spheres.map((s) => (
            <Text key={s.key} style={styles.legendItem}>
              {s.label}: {values[s.key]}/{max}
            </Text>
          ))}
        </View>

        {lowSpheres.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Куда утекает ресурс</Text>
            {lowSpheres.map((s) => (
              <View key={s.key} style={styles.sphereBlock}>
                <Text style={styles.sphereTitle}>
                  {s.label} — {values[s.key]}/{max}
                </Text>
                <Text style={styles.sphereText}>{s.lowScoreText}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.footer}>{wheelOfBalance.disclaimer}</Text>
      </Page>
    </Document>
  );
}
