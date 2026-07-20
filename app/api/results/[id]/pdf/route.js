import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import WheelPdf from "@/lib/pdf/WheelPdf";
import NeurotypePdf from "@/lib/pdf/NeurotypePdf";
import { wheelOfBalance } from "@/lib/tests/wheel-of-balance";
import { neurotype } from "@/lib/tests/neurotype";

export async function GET(request, { params }) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: result, error } = await supabase
    .from("test_results")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !result) {
    return new Response("Not found", { status: 404 });
  }

  const date = new Date(result.created_at).toLocaleDateString("ru-RU");
  let doc;
  let filename;

  if (result.test_slug === wheelOfBalance.slug) {
    const values = result.answers;
    const scores = Object.values(values);
    const average = scores.reduce((sum, v) => sum + v, 0) / scores.length;
    doc = <WheelPdf values={values} average={average} date={date} />;
    filename = "koleso-balansa.pdf";
  } else if (result.test_slug === neurotype.slug) {
    const scores = result.answers;
    const sortedDims = [...neurotype.dimensions].sort(
      (a, b) => scores[b.key] - scores[a.key]
    );
    const isMixed =
      scores[sortedDims[0].key] - scores[sortedDims[1].key] <=
      neurotype.mixedProfileThreshold;
    doc = (
      <NeurotypePdf
        scores={scores}
        dominantKey={sortedDims[0].key}
        secondKey={sortedDims[1].key}
        isMixed={isMixed}
        date={date}
      />
    );
    filename = "profil-neiromediatorov.pdf";
  } else {
    return new Response("PDF для этого теста не поддерживается", {
      status: 400,
    });
  }

  const buffer = await renderToBuffer(doc);

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
