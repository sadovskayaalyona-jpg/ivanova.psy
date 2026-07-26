"use client";

import { wheelOfBalance } from "@/lib/tests/wheel-of-balance";

const SIZE = 280;
const CENTER = SIZE / 2;
const MAX_RADIUS = CENTER - 50;

function pointFor(index, total, value, max) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const radius = (value / max) * MAX_RADIUS;
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

export default function WheelChart({ values }) {
  const spheres = wheelOfBalance.spheres;
  const total = spheres.length;
  const max = wheelOfBalance.max;

  const dataPolygon = spheres
    .map((s, i) => {
      const p = pointFor(i, total, values[s.key], max);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Колесо баланса">
      {[0.25, 0.5, 0.75, 1].map((fraction) => {
        const ringPoints = spheres
          .map((_, i) => {
            const p = pointFor(i, total, fraction * max, max);
            return `${p.x},${p.y}`;
          })
          .join(" ");
        return (
          <polygon
            key={fraction}
            points={ringPoints}
            fill="none"
            stroke="#e2e0da"
            strokeWidth="1"
          />
        );
      })}

      {spheres.map((s, i) => {
        const edge = pointFor(i, total, max, max);
        return (
          <line
            key={s.key}
            x1={CENTER}
            y1={CENTER}
            x2={edge.x}
            y2={edge.y}
            stroke="#e2e0da"
            strokeWidth="1"
          />
        );
      })}

      <polygon
        points={dataPolygon}
        fill="#4b7b6f"
        fillOpacity="0.35"
        stroke="#4b7b6f"
        strokeWidth="2"
      />

      {spheres.map((s, i) => {
        const labelPoint = pointFor(i, total, max * 1.22, max);
        return (
          <text
            key={s.key}
            x={labelPoint.x}
            y={labelPoint.y}
            fontSize="9"
            textAnchor="middle"
            fill="#5b6472"
          >
            {s.label}
          </text>
        );
      })}
    </svg>
  );
}
