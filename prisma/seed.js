async function main() {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  try {
    const existingCount = await prisma.recipe.count();

    if (existingCount > 0) {
      return;
    }

    await prisma.recipe.createMany({
      data: [
        {
          userId: "guest",
          title: "Classic Pancakes",
          summary: "Fluffy pancakes with a simple batter.",
          content:
            "Whisk dry ingredients, add wet ingredients, cook on a greased skillet until golden.",
          tags: ["breakfast", "easy", "classic"],
        },
        {
          userId: "guest",
          title: "One-Pot Tomato Pasta",
          summary: "Fast pasta dinner cooked in one pot.",
          content:
            "Simmer pasta, tomatoes, garlic, and broth together until tender; finish with basil.",
          tags: ["dinner", "one-pot", "vegetarian"],
        },
      ],
    });
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => {});
