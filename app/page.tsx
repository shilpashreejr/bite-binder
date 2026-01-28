"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type RecipeItem = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  favorite: boolean;
};

export function filterRecipes(
  recipes: RecipeItem[],
  searchValue: string,
  activeTags: string[],
  favoritesOnly: boolean,
) {
  const normalizedSearch = searchValue.trim().toLowerCase();

  return recipes.filter((recipe) => {
    const matchesSearch = normalizedSearch
      ? [recipe.title, recipe.summary, recipe.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch)
      : true;
    const matchesTags = activeTags.length
      ? activeTags.every((tag) => recipe.tags.includes(tag))
      : true;
    const matchesFavorite = favoritesOnly ? recipe.favorite : true;
    return matchesSearch && matchesTags && matchesFavorite;
  });
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const heroImage =
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=2400&q=80";
  const tagOptions = [
    "breakfast",
    "quick",
    "vegan",
    "lunch",
    "gluten-free",
    "dinner",
    "protein",
  ];
  const recipes = useMemo(
    () => [
      {
        id: "matcha-morning",
        title: "Matcha Morning Oats",
        summary: "Creamy oats with citrus zest and toasted seeds.",
        tags: ["breakfast", "quick", "vegan"],
        favorite: true,
      },
      {
        id: "ginger-noodle-bowl",
        title: "Ginger Noodle Bowl",
        summary: "Bright, savory noodles with crisp vegetables.",
        tags: ["lunch", "gluten-free"],
        favorite: false,
      },
      {
        id: "citrus-salmon",
        title: "Citrus Sheet-Pan Salmon",
        summary: "One-pan dinner with herbs and mellow citrus.",
        tags: ["dinner", "protein"],
        favorite: true,
      },
    ],
    [],
  );
  const searchValue = searchParams.get("search") ?? "";
  const activeTags = (searchParams.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const favoritesOnly = searchParams.get("favorite") === "true";
  const [searchTerm, setSearchTerm] = useState(searchValue);

  useEffect(() => {
    setSearchTerm(searchValue);
  }, [searchValue]);

  const filteredRecipes = useMemo(
    () => filterRecipes(recipes, searchValue, activeTags, favoritesOnly),
    [activeTags, favoritesOnly, recipes, searchValue],
  );

  const updateQuery = (next: {
    search?: string;
    tags?: string[];
    favorite?: boolean;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next.search !== undefined) {
      if (next.search.trim()) {
        params.set("search", next.search.trim());
      } else {
        params.delete("search");
      }
    }

    if (next.tags !== undefined) {
      if (next.tags.length) {
        params.set("tags", next.tags.join(","));
      } else {
        params.delete("tags");
      }
    }

    if (next.favorite !== undefined) {
      if (next.favorite) {
        params.set("favorite", "true");
      } else {
        params.delete("favorite");
      }
    }

    const query = params.toString();
    router.replace(query ? `/?${query}` : "/");
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateQuery({ search: searchTerm });
  };

  const toggleTag = (tag: string) => {
    const nextTags = activeTags.includes(tag)
      ? activeTags.filter((item) => item !== tag)
      : [...activeTags, tag];
    updateQuery({ tags: nextTags });
  };

  const toggleFavorites = () => {
    updateQuery({ favorite: !favoritesOnly });
  };

  const clearFilters = () => {
    updateQuery({ search: "", tags: [], favorite: false });
  };

  const hasFilters =
    searchValue.trim().length > 0 || activeTags.length > 0 || favoritesOnly;

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-stone-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-12 pt-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="h-10 w-10 rounded-full border border-stone-300 bg-white/80" />
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.45em] text-stone-400">
                Bite Binder
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">
                Curate your kitchen.
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-stone-500">
            <span>Recipes</span>
            <span>Collections</span>
            <span>About</span>
          </div>
          <Button asChild className="rounded-full px-6">
            <Link href="/recipes/new">New recipe</Link>
          </Button>
        </header>

        <main className="mt-10 flex flex-1 flex-col gap-8">
          <section className="relative overflow-hidden rounded-[2.5rem] border border-stone-200 bg-white shadow-sm">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />
            <div className="relative flex flex-col gap-8 p-10 text-stone-100">
              <div className="flex flex-col gap-4">
                <p className="text-[0.7rem] uppercase tracking-[0.5em] text-stone-200/80">
                  Recipe archive
                </p>
                <h2 className="max-w-2xl text-4xl font-semibold tracking-tight">
                  A refined, minimal home for every recipe you love.
                </h2>
                <p className="max-w-2xl text-base text-stone-200/80">
                  Capture recipes from anywhere, polish them once, and keep a
                  clean archive that always feels composed.
                </p>
              </div>
              <form
                className="flex flex-col gap-3 sm:flex-row"
                onSubmit={handleSearchSubmit}
              >
                <div className="flex-1">
                  <Input
                    placeholder="Search recipes, ingredients, or tags"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="h-12 rounded-full border-white/20 bg-white/90 px-5 text-stone-900"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 rounded-full bg-stone-900 px-6 text-stone-50 hover:bg-stone-800"
                >
                  Search
                </Button>
              </form>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className={`rounded-full border-white/40 px-4 text-xs uppercase tracking-[0.2em] text-stone-100 ${
                    favoritesOnly ? "bg-white/20" : "bg-transparent"
                  }`}
                  onClick={toggleFavorites}
                >
                  Favorites
                </Button>
                {tagOptions.map((tag) => {
                  const isActive = activeTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                        isActive
                          ? "border-white/60 bg-white/25 text-stone-100"
                          : "border-white/20 bg-white/10 text-stone-200"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
                {hasFilters ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full text-xs text-stone-200"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                ) : null}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Recent recipes</h3>
                <p className="text-sm text-stone-500">
                  Hand-picked for a clean start.
                </p>
              </div>
              <Button variant="ghost" className="rounded-full text-sm">
                View all
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredRecipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  className="rounded-2xl border border-stone-200 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                        {recipe.favorite ? "Favorite" : "Recipe"}
                      </p>
                      <h4 className="text-lg font-semibold text-stone-900">
                        {recipe.title}
                      </h4>
                    </div>
                    <Button
                      variant="ghost"
                      className="h-8 rounded-full px-3 text-xs text-stone-500"
                    >
                      {recipe.favorite ? "Fav" : "Add"}
                    </Button>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <p className="text-sm text-stone-500">{recipe.summary}</p>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full border-stone-200"
                    >
                      <Link href={`/recipes/${recipe.id}`}>View details</Link>
                    </Button>
                    <div className="flex flex-wrap gap-2">
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
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredRecipes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white/70 p-8 text-center text-sm text-stone-500">
                No recipes match your filters. Try clearing a tag or searching
                again.
              </div>
            ) : null}
          </section>
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-[#f4f1ea] text-stone-900" />}
    >
      <HomeContent />
    </Suspense>
  );
}
