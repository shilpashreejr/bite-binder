import test from "node:test";
import assert from "node:assert/strict";
import {
  recipeCreateSchema,
  recipeParseSchema,
  recipeUpdateSchema,
} from "../../lib/validation/recipe";

test("recipeCreateSchema accepts required fields", () => {
  const parsed = recipeCreateSchema.safeParse({
    title: "Citrus Salmon",
    content: "Steps here",
    tags: ["dinner"],
  });

  assert.equal(parsed.success, true);
});

test("recipeCreateSchema rejects missing title", () => {
  const parsed = recipeCreateSchema.safeParse({
    content: "Steps here",
  });

  assert.equal(parsed.success, false);
});

test("recipeUpdateSchema requires at least one field", () => {
  const parsed = recipeUpdateSchema.safeParse({});
  assert.equal(parsed.success, false);
});

test("recipeParseSchema validates URL source", () => {
  const parsed = recipeParseSchema.safeParse({
    sourceType: "url",
    url: "https://example.com/recipe",
  });

  assert.equal(parsed.success, true);
});

test("recipeParseSchema rejects missing source for paste", () => {
  const parsed = recipeParseSchema.safeParse({
    sourceType: "paste",
  });

  assert.equal(parsed.success, false);
});
