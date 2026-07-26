"use client";

import { wheelSpheres } from "@/lib/vygoranie/block2-wheel";

const SIZE = 260;
const CENTER = SIZE / 2;
const MAX_RADIUS = CENTER - 46;

function pointFor(index, total, value, max) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const radius = (value / max) * MAX_RADIUS;
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

export default function VgWheelChart({ values }) {
  const spheres = wheelSpheres.spheres;
  const total = spheres.length;
  const max = wheelSpheres.max;

  const dataPolygon = spheres
    .map((s, i) => {
      const p = pointFor(i, total, values[s.key], max);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Колесо баланса">
      {[0.25, 0.5, 0.75, 1].map((fraction) => {
        const ring = spheres
          .map((_, i) => {
            const p = pointFor(i, total, fraction * max, max);
            return `${p.x},${p.y}`;
          })
          .join(" ");
        return (
          <polygon key={fraction} points={ring} fill="none" stroke="#2b301f" strokeWidth="1" />
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
            stroke="#2b301f"
            strokeWidth="1"
          />
        );
      })}

      <polygon
        points={dataPolygon}
        fill="#cddc37"
        fillOpacity="0.28"
        stroke="#cddc37"
        strokeWidth="2"
      />

      {spheres.map((s, i) => {
        const labelPoint = pointFor(i, total, max * 1.2, max);
        return (
          <text
            key={s.key}
            x={labelPoint.x}
            y={labelPoint.y}
            fontSize="10"
            textAnchor="middle"
            fill="#a9ad9c"
          >
            {s.label}
          </text>
        );
      })}
    </svg>
  );
}
