"use client";

import { neurotype } from "@/lib/tests/neurotype";

const WIDTH = 320;
const CHART_HEIGHT = 160;
const HEIGHT = 220;
const BAR_WIDTH = 50;
const GAP = 24;
const MAX_SCORE = 15; // 5 вопросов × максимум 3 балла

export default function NeurotypeChart({ scores, dominantKey }) {
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Профиль нейромедиаторов"
    >
      {neurotype.dimensions.map((dim, i) => {
        const value = scores[dim.key] ?? 0;
        const barHeight = (value / MAX_SCORE) * CHART_HEIGHT;
        const x = i * (BAR_WIDTH + GAP) + GAP / 2;
        const y = CHART_HEIGHT - barHeight + 20;
        const isDominant = dim.key === dominantKey;

        return (
          <g key={dim.key}>
            <rect
              x={x}
              y={y}
              width={BAR_WIDTH}
              height={barHeight}
              fill={isDominant ? "#4b7b6f" : "#c7d3ce"}
              rx="3"
            />
            <text
              x={x + BAR_WIDTH / 2}
              y={y - 6}
              fontSize="11"
              textAnchor="middle"
              fill="#1f2430"
            >
              {value}
            </text>
            <text
              x={x + BAR_WIDTH / 2}
              y={CHART_HEIGHT + 36}
              fontSize="10"
              textAnchor="middle"
              fill="#5b6472"
            >
              {dim.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
