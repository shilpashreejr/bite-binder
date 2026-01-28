import test from "node:test";
import assert from "node:assert/strict";
import { filterRecipes, type RecipeItem } from "../app/page";

const recipes: RecipeItem[] = [
  {
    id: "oats",
    title: "Matcha Morning Oats",
    summary: "Creamy oats with citrus zest.",
    tags: ["breakfast", "vegan"],
    favorite: true,
  },
  {
    id: "noodles",
    title: "Ginger Noodle Bowl",
    summary: "Savory noodles with crisp vegetables.",
    tags: ["lunch", "gluten-free"],
    favorite: false,
  },
  {
    id: "salmon",
    title: "Citrus Sheet-Pan Salmon",
    summary: "One-pan dinner with herbs.",
    tags: ["dinner", "protein"],
    favorite: true,
  },
];

test("filterRecipes matches search text", () => {
  const result = filterRecipes(recipes, "ginger", [], false);
  assert.deepEqual(
    result.map((item) => item.id),
    ["noodles"],
  );
});

test("filterRecipes matches tag multi-select", () => {
  const result = filterRecipes(recipes, "", ["breakfast", "vegan"], false);
  assert.deepEqual(
    result.map((item) => item.id),
    ["oats"],
  );
});

test("filterRecipes respects favorites-only filter", () => {
  const result = filterRecipes(recipes, "", [], true);
  assert.deepEqual(
    result.map((item) => item.id),
    ["oats", "salmon"],
  );
});
