import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { recipeOutputSchema, recipeUpdateSchema } from "@/lib/validation/recipe";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const recipe = await prisma.recipe.findUnique({ where: { id } });

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  return NextResponse.json(recipeOutputSchema.parse(recipe));
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
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

  try {
    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        title: parsed.data.title,
        summary: parsed.data.summary ?? undefined,
        content: parsed.data.content,
        tags: parsed.data.tags,
        favorite: parsed.data.favorite,
      },
    });

    return NextResponse.json(recipeOutputSchema.parse(recipe));
  } catch {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    await prisma.recipe.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }
}
