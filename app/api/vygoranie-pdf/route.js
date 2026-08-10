import { renderToBuffer } from "@react-pdf/renderer";
import VygoraniePdf from "@/lib/pdf/VygoraniePdf";
import { archetypes } from "@/lib/vygoranie/block4-archetypes";
import { bravermanScale } from "@/lib/vygoranie/block3-braverman";
import { wheelSpheres } from "@/lib/vygoranie/block2-wheel";
import { buildResultNarrative } from "@/lib/vygoranie/result-narrative";
import { getMovieArchetype } from "@/lib/vygoranie/block4-movie-archetypes";

// Анонимная воронка — PDF собирается из тех же данных, что уже лежат у
// клиента после прохождения теста (никакого чтения из базы по id, поэтому
// авторизация не нужна). Текстовые блоки (нарратив, кинообраз) считаем
// заново на сервере по ключам, а не берём как есть от клиента.
export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const { burnoutScore10, burnoutLabel, wheelValues, archetypeKey, bravermanTypeKey } = payload ?? {};

  const archetype = archetypes.find((a) => a.key === archetypeKey);
  const bravermanType = bravermanScale.types.find((t) => t.key === bravermanTypeKey);

  if (
    typeof burnoutScore10 !== "number" ||
    typeof burnoutLabel !== "string" ||
    !wheelValues ||
    !wheelSpheres.spheres.every((s) => typeof wheelValues[s.key] === "number") ||
    !archetype ||
    !bravermanType
  ) {
    return new Response("Bad request", { status: 400 });
  }

  const narrative = buildResultNarrative({ wheelValues, archetypeKey, bravermanTypeKey });
  const movie = getMovieArchetype(archetypeKey);
  const date = new Date().toLocaleDateString("ru-RU");

  const buffer = await renderToBuffer(
    <VygoraniePdf
      date={date}
      burnoutScore10={burnoutScore10}
      burnoutLabel={burnoutLabel}
      wheelValues={wheelValues}
      bravermanType={bravermanType}
      archetype={archetype}
      narrative={narrative}
      movie={movie}
    />
  );

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="test-na-vygoranie.pdf"`,
    },
  });
}
