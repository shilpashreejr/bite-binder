import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { recipeOutputSchema, recipeUpdateSchema } from "@/lib/validation/recipe";
import { checkRateLimit } from "@/lib/rate-limit";
import { getUserId } from "@/lib/utils";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const rate = checkRateLimit(_request);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { id } = await context.params;
  const userId = getUserId(_request);

  const recipe = await prisma.recipe.findFirst({ where: { id, userId } });

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  return NextResponse.json(recipeOutputSchema.parse(recipe));
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const rate = checkRateLimit(request);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { id } = await context.params;
  const userId = getUserId(request);
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = recipeUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const updateResult = await prisma.recipe.updateMany({
    where: { id, userId },
    data: {
      title: parsed.data.title,
      summary: parsed.data.summary ?? undefined,
      content: parsed.data.content,
      tags: parsed.data.tags,
      favorite: parsed.data.favorite,
    },
  });

  if (updateResult.count === 0) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  const recipe = await prisma.recipe.findFirst({ where: { id, userId } });

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  return NextResponse.json(recipeOutputSchema.parse(recipe));
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const rate = checkRateLimit(_request);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { id } = await context.params;
  const userId = getUserId(_request);

  const deleteResult = await prisma.recipe.deleteMany({ where: { id, userId } });

  if (deleteResult.count === 0) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
