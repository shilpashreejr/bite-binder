import test from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import {
  GET as getRecipes,
  POST as postRecipes,
} from "../../app/api/recipes/route";
import { PUT as putRecipe } from "../../app/api/recipes/[id]/route";

test("POST /api/recipes returns 400 for invalid payload", async () => {
  const request = new NextRequest("http://localhost/api/recipes", {
    method: "POST",
    body: JSON.stringify({ title: "" }),
  });

  const response = await postRecipes(request);
  assert.equal(response.status, 400);
});

test("GET /api/recipes returns 400 for invalid query", async () => {
  const request = new NextRequest("http://localhost/api/recipes?tags=,%20");
  const response = await getRecipes(request);
  assert.equal(response.status, 400);
});

test("PUT /api/recipes/:id returns 400 for invalid payload", async () => {
  const request = new NextRequest("http://localhost/api/recipes/abc", {
    method: "PUT",
    body: JSON.stringify({}),
  });
  const response = await putRecipe(request, {
    params: Promise.resolve({ id: "abc" }),
  });
  assert.equal(response.status, 400);
});
