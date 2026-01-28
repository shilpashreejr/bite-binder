import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  recipeCreateSchema,
  recipeOutputSchema,
  recipeQuerySchema,
} from "@/lib/validation/recipe";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());
  const parsed = recipeQuerySchema.safeParse(searchParams);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { search, tags, favorite } = parsed.data;

  const recipes = await prisma.recipe.findMany({
    where: {
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { summary: { contains: search, mode: "insensitive" } },
              { content: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(tags?.length ? { tags: { hasEvery: tags } } : {}),
      ...(favorite !== undefined ? { favorite } : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(
    recipes.map((recipe) => recipeOutputSchema.parse(recipe)),
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = recipeCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const recipe = await prisma.recipe.create({
    data: {
      title: parsed.data.title,
      summary: parsed.data.summary ?? null,
      content: parsed.data.content,
      tags: parsed.data.tags ?? [],
      favorite: parsed.data.favorite ?? false,
    },
  });

  return NextResponse.json(recipeOutputSchema.parse(recipe), { status: 201 });
}
