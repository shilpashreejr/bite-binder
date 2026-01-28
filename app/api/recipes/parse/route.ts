import { NextResponse } from "next/server";
import { recipeParseSchema } from "@/lib/validation/recipe";
import { checkRateLimit } from "@/lib/rate-limit";

function extractTitle(html: string) {
  const ogTitleMatch = html.match(
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i,
  );
  if (ogTitleMatch?.[1]) {
    return ogTitleMatch[1].trim();
  }

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return titleMatch?.[1]?.trim() || null;
}

function extractBodyText(html: string) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyHtml = bodyMatch?.[1] ?? html;

  return bodyHtml
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(request: Request) {
  const rate = checkRateLimit(request);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = recipeParseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { sourceType } = parsed.data;

  if (sourceType === "url") {
    const response = await fetch(parsed.data.url!, {
      headers: { "user-agent": "bite-binder/1.0" },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to fetch URL" },
        { status: 400 },
      );
    }

    const html = await response.text();
    const title = extractTitle(html);
    const content = extractBodyText(html);

    return NextResponse.json({
      sourceType,
      sourceUrl: parsed.data.url!,
      title,
      content,
    });
  }

  if (sourceType === "paste") {
    return NextResponse.json({
      sourceType,
      content: parsed.data.text,
      instructions: "Review and edit the content before saving.",
    });
  }

  return NextResponse.json({
    sourceType,
    sourceRef: parsed.data.reference,
  });
}
