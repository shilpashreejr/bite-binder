import { z } from "zod";

const baseRecipeSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    summary: z.string().optional(),
    content: z.string().min(1, "Content is required"),
    tags: z.array(z.string().min(1)).optional(),
    favorite: z.boolean().optional(),
  })
  .strict();

export const recipeCreateSchema = baseRecipeSchema;

export const recipeUpdateSchema = baseRecipeSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const recipeQuerySchema = z
  .object({
    search: z.string().min(1).optional(),
    tags: z
      .string()
      .transform((value) => value.split(",").map((tag) => tag.trim()))
      .pipe(z.array(z.string().min(1)))
      .optional(),
    favorite: z
      .string()
      .transform((value) => value === "true")
      .optional(),
  })
  .strict();

export const recipeOutputSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    summary: z.string().nullable(),
    content: z.string(),
    tags: z.array(z.string()),
    favorite: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export const recipeParseSchema = z
  .object({
    sourceType: z.enum(["url", "paste", "screenshot", "social"]),
    url: z.string().url().optional(),
    text: z.string().min(1).optional(),
    reference: z.string().min(1).optional(),
  })
  .superRefine((data, context) => {
    if (data.sourceType === "url" && !data.url) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "url is required for sourceType=url",
        path: ["url"],
      });
    }

    if (data.sourceType === "paste" && !data.text) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "text is required for sourceType=paste",
        path: ["text"],
      });
    }

    if (
      (data.sourceType === "screenshot" || data.sourceType === "social") &&
      !data.reference
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "reference is required for sourceType=screenshot/social",
        path: ["reference"],
      });
    }
  })
  .strict();

export type RecipeCreateInput = z.infer<typeof recipeCreateSchema>;
export type RecipeUpdateInput = z.infer<typeof recipeUpdateSchema>;
export type RecipeQueryInput = z.infer<typeof recipeQuerySchema>;
export type RecipeOutput = z.infer<typeof recipeOutputSchema>;
export type RecipeParseInput = z.infer<typeof recipeParseSchema>;
