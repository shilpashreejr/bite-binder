ALTER TABLE "Recipe" ADD COLUMN "userId" TEXT NOT NULL DEFAULT 'guest';

CREATE INDEX "Recipe_userId_idx" ON "Recipe"("userId");
