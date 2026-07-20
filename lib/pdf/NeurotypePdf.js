import { Document, Page, View, Text, Svg, Rect, StyleSheet } from "@react-pdf/renderer";
import { neurotype } from "../tests/neurotype";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  title: { fontSize: 18, marginBottom: 4, color: "#263449" },
  subtitle: { fontSize: 10, color: "#5b6472", marginBottom: 20 },
  chartWrap: { alignItems: "center", marginBottom: 12 },
  legend: { marginBottom: 16 },
  legendItem: { fontSize: 9, marginBottom: 2, color: "#333" },
  resultTitle: { fontSize: 14, marginBottom: 10, color: "#263449" },
  sectionTitle: { fontSize: 12, marginTop: 10, marginBottom: 4, color: "#263449" },
  bodyText: { fontSize: 10, color: "#333", lineHeight: 1.4, marginBottom: 8 },
  footer: { marginTop: 30, fontSize: 8, color: "#888" },
  inspiredBy: { fontSize: 8, color: "#888", marginTop: 4, fontStyle: "italic" },
});

const CHART_WIDTH = 300;
const CHART_HEIGHT_TOTAL = 170;
const CHART_HEIGHT = 130;
const BAR_WIDTH = 45;
const GAP = 22;
const MAX_SCORE = 15;

export default function NeurotypePdf({
  scores,
  dominantKey,
  secondKey,
  isMixed,
  date,
}) {
  const dominant = neurotype.dimensions.find((d) => d.key === dominantKey);
  const second = neurotype.dimensions.find((d) => d.key === secondKey);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{neurotype.title}</Text>
        <Text style={styles.subtitle}>Результат от {date}</Text>

        <View style={styles.chartWrap}>
          <Svg
            width={CHART_WIDTH}
            height={CHART_HEIGHT_TOTAL}
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT_TOTAL}`}
          >
            {neurotype.dimensions.map((dim, i) => {
              const value = scores[dim.key] ?? 0;
              const barHeight = (value / MAX_SCORE) * CHART_HEIGHT;
              const x = i * (BAR_WIDTH + GAP) + GAP / 2;
              const y = CHART_HEIGHT - barHeight + 10;
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
          {neurotype.dimensions.map((dim) => (
            <Text key={dim.key} style={styles.legendItem}>
              {dim.label}: {scores[dim.key] ?? 0} из {MAX_SCORE}
            </Text>
          ))}
        </View>

        <Text style={styles.resultTitle}>
          {isMixed
            ? `Смешанный профиль: ${dominant.label} и ${second.label}`
            : `Ведущий тип: ${dominant.label}`}
        </Text>

        <Text style={styles.sectionTitle}>Что истощает</Text>
        <Text style={styles.bodyText}>{dominant.depletedBy}</Text>

        <Text style={styles.sectionTitle}>Что помогает восполнить ресурс</Text>
        <Text style={styles.bodyText}>{dominant.recommendations}</Text>

        {isMixed && (
          <>
            <Text style={styles.sectionTitle}>
              Также учитывайте — {second.label}
            </Text>
            <Text style={styles.bodyText}>{second.recommendations}</Text>
          </>
        )}

        <Text style={styles.footer}>{neurotype.disclaimer}</Text>
        <Text style={styles.inspiredBy}>{neurotype.inspiredBy}</Text>
      </Page>
    </Document>
  );
}
