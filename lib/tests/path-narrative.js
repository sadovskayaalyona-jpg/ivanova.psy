import { wheelOfBalance } from "./wheel-of-balance";
import { neurotype } from "./neurotype";

export const PATH_SLUG = "put-k-balansu";

// Общая логика для страницы результата и PDF — чтобы не дублировать её в двух местах.
export function buildPathNarrative({ wheelValues, dominantKey }) {
  const sortedByScore = [...wheelOfBalance.spheres].sort(
    (a, b) => wheelValues[b.key] - wheelValues[a.key]
  );
  const topSpheres = sortedByScore.slice(0, 2);
  const bottomSpheres = sortedByScore.slice(-2).reverse();
  const dominant = neurotype.dimensions.find((d) => d.key === dominantKey);

  const howYouAreBuilt = `${dominant.traitSummary} Сейчас у вас особенно сильны сферы «${topSpheres
    .map((s) => s.label)
    .join("» и «")}», а больше всего внимания стоит уделить сферам «${bottomSpheres
    .map((s) => s.label)
    .join("» и «")}».`;

  return {
    topSpheres,
    bottomSpheres,
    dominant,
    howYouAreBuilt,
    focusSphere: bottomSpheres[0],
  };
}
