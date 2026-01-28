import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RecipeDetailPage() {
  const heroImage =
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2000&q=80";
  const recipe = {
    id: "citrus-salmon",
    title: "Citrus Sheet-Pan Salmon",
    summary: "One-pan dinner with herbs and mellow citrus.",
    tags: ["dinner", "protein", "quick"],
    favorite: true,
    content:
      "Ingredients:\n- 2 salmon fillets\n- 1 orange, sliced\n- 1 tbsp olive oil\n- 1 tsp flaky salt\n- Fresh dill\n\nSteps:\n1. Heat oven to 400F.\n2. Arrange salmon and citrus on a sheet pan.\n3. Drizzle with olive oil, season, and roast 12-15 minutes.\n4. Finish with dill and serve.",
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col px-6 py-10 lg:px-10">
        <header className="flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-stone-200 bg-white shadow-sm">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />
            <div className="relative flex flex-col gap-4 px-8 py-10 text-stone-100">
              <Link
                href="/"
                className="text-xs uppercase tracking-[0.25em] text-stone-200/80"
              >
                Back to recipes
              </Link>
              <h1 className="text-3xl font-semibold tracking-tight">
                {recipe.title}
              </h1>
              <p className="max-w-xl text-base text-stone-200/80">
                {recipe.summary}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button className="rounded-full bg-white/90 px-5 text-stone-900 hover:bg-white">
                  {recipe.favorite ? "Favorited" : "Favorite"}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-white/40 px-5 text-stone-100 hover:bg-white/10"
                >
                  <Link href={`/recipes/${recipe.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-3xl border border-stone-200 bg-white/90 shadow-sm">
            <CardContent className="prose prose-stone max-w-none px-8 py-6">
              <pre className="whitespace-pre-wrap text-sm text-stone-600">
                {recipe.content}
              </pre>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border border-stone-200 bg-white/90 shadow-sm">
            <CardContent className="flex flex-col gap-4 px-6 py-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                  Tags
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="rounded-full border-stone-200 text-xs text-stone-500"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
                Capture notes and links here in the next step.
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
