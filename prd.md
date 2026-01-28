# Product Requirements Document (PRD)
# Recipe Extraction and Management (MVP)

## 1) Overview
The Recipe Extraction and Management website lets users capture recipes from many sources, then save, organize, and search them. This PRD defines the MVP scope to ship quickly while leaving room for future features like meal prep, meal logs, and nutrition tracking.

## 2) Goals and Success Metrics
### Goals
- Provide a fast, simple way to capture recipes from multiple sources.
- Support organizing recipes with tags and favorites.
- Enable search and filter by ingredient, tag, and title.

### Success Metrics (MVP)
- Time to add a recipe: under 2 minutes for a typical user.
- Search returns results within 300ms for 1,000 recipes.
- User can find any saved recipe within 3 clicks from the dashboard.

## 3) Non-Goals (for MVP)
- Meal planning, meal prep, meal logs.
- Grocery lists.
- Nutrition calculation.
- Sharing/public profiles.
- Collaboration or multi-user editing.

## 4) Target Users
- Home cooks who want to store their favorite recipes.
- Busy professionals who need quick access to recipes.

## 5) User Stories
### Must-Have (MVP)
- As a user, I can create a recipe with title, ingredients, and instructions.
- As a user, I can edit and delete my recipes.
- As a user, I can tag recipes (e.g., "vegan", "quick").
- As a user, I can mark recipes as favorites.
- As a user, I can search recipes by title or ingredient.
- As a user, I can filter by tags and favorites.
- As a user, I can create a recipe by pasting unstructured text.
- As a user, I can create a recipe by providing a source URL.
- As a user, I can attach a screenshot as a recipe source.
- As a user, I can save a recipe with a social link as the source.

### Nice-to-Have (Post-MVP)
- Meal planning calendar.
- Meal logs.
- Nutrition breakdown.
- Automated recipe extraction with AI.

## 6) Functional Requirements
### 6.1 Authentication
- MVP can be single-user without login (local user table optional).
- If auth is included, use NextAuth with email magic link.
- Keep auth optional; do not block MVP on auth.

### 6.2 Recipe CRUD
- Create recipe with:
  - title (required)
  - description (optional)
  - ingredients (required, list of items)
  - instructions (required, multiline)
  - prepTimeMinutes (optional)
  - cookTimeMinutes (optional)
  - servings (optional)
  - tags (optional, list)
  - favorite (boolean)
- Edit recipe: all fields editable.
- Delete recipe: soft delete not required; hard delete ok for MVP.

### 6.3 Search and Filter
- Search by:
  - title (partial match)
  - ingredients (partial match)
- Filters:
  - tags (multi-select)
  - favorites only
- Sorting:
  - most recently updated (default)
  - alphabetical (optional)

### 6.4 Recipe Listing and Detail
- Listing view shows:
  - title
  - short description or first 120 chars of instructions
  - tags
  - favorite icon
- Detail view shows full recipe content.

### 6.5 Tags
- Tags are user-defined strings.
- Tags can be assigned during create/edit.
- Tags list in filter should be derived from existing recipes.

### 6.6 Recipe Capture (MVP)
- Supported capture sources:
  - Paste text (Notes, Evernote, Instagram/TikTok comments, blog text, etc.).
  - URL import (food blogs and recipe pages).
  - Screenshot upload (image stored, no OCR in MVP).
  - Social link (Instagram/TikTok URL stored as reference).
- Capture behavior:
  - One primary source per recipe for MVP.
  - `sourceType` determines which source fields are stored.
  - For URL import, fetch page HTML server-side and extract a best-effort title and body text.
  - For paste text, prefill instructions with the pasted content.
  - For screenshot, store image URL and show it alongside the form for manual transcription.
  - Social URLs are stored for reference only; no automated scraping in MVP.
- All captured recipes require user review before saving.

## 7) UX / UI Requirements
### 7.1 Pages (Next.js App Router)
- `/` Dashboard (recipe list with search + filters)
- `/recipes/new` Create Recipe
- `/recipes/[id]` Recipe Detail
- `/recipes/[id]/edit` Edit Recipe

### 7.2 Components (shadcn/ui)
- Search input (Input)
- Filter chips/multi-select (Badge + Popover or Combobox)
- Recipe cards (Card)
- Buttons (Button)
- Modal confirm for delete (AlertDialog)
- Form fields (Input, Textarea)
- Tabs or segmented control for capture source selection
- File upload input for screenshots

### 7.3 Interaction Requirements
- Search input updates results on submit (not necessarily live).
- Filters persist while navigating back to list (query params).
- Clear filters button resets query params.
- Create Recipe page includes a "Capture Source" panel with tabs: Paste, URL, Screenshot, Social.

## 8) Data Model (Prisma)
### Entities
#### Recipe
- id (string, cuid)
- title (string, required)
- description (string, optional)
- ingredients (string[], required)
- instructions (string, required)
- prepTimeMinutes (int, optional)
- cookTimeMinutes (int, optional)
- servings (int, optional)
- tags (string[], optional)
- favorite (boolean, default false)
- sourceType (string, optional: "text" | "url" | "screenshot" | "social")
- sourceUrl (string, optional)
- sourceText (string, optional)
- sourceImageUrl (string, optional)
- createdAt (DateTime, default now)
- updatedAt (DateTime, auto-updated)

### Prisma Schema (Draft)
```
model Recipe {
  id               String   @id @default(cuid())
  title            String
  description      String?
  ingredients      String[]
  instructions     String
  prepTimeMinutes  Int?
  cookTimeMinutes  Int?
  servings         Int?
  tags             String[]
  favorite         Boolean  @default(false)
  sourceType       String?
  sourceUrl        String?
  sourceText       String?
  sourceImageUrl   String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

## 9) API Requirements (Next.js Route Handlers)
### Endpoints
- `GET /api/recipes`  
  - Query: `q` (search), `tags`, `favorite`
  - Returns list of recipes
- `POST /api/recipes`  
  - Creates recipe
- `GET /api/recipes/:id`  
  - Returns one recipe
- `PUT /api/recipes/:id`  
  - Updates recipe
- `DELETE /api/recipes/:id`  
  - Deletes recipe
- `POST /api/recipes/parse`  
  - Body: `sourceType`, plus one of `sourceUrl` or `sourceText`
  - Returns best-effort `title`, `ingredients`, `instructions`

### Validation
- Use Zod for input validation.
- Return 400 on invalid input.

## 10) Performance & Scalability
- Use server-side pagination once recipe count > 1000 (post-MVP).
- MVP can load all recipes for a single user.

## 11) Security
- If auth exists, ensure recipes are scoped to the user.
- Sanitize any text display to prevent XSS (React handles).
- Rate limit API routes in production (basic middleware).

## 12) Deployment (Vercel)
- Use Vercel for hosting.
- Use PostgreSQL (Neon or Supabase) for production DB.
- Environment variables:
  - `DATABASE_URL`
  - `NEXTAUTH_URL` (if auth)
  - `NEXTAUTH_SECRET` (if auth)

## 13) Testing Requirements
### Unit Tests
- Recipe validation (Zod schema)
- API handlers for create/update/delete

### E2E (Optional)
- Create recipe flow
- Search/filter flow

## 14) Out of Scope for MVP (Future Roadmap)
- Meal prep planner
- Meal logs
- Grocery list
- Nutrition info
- OCR from screenshots
- Automated scraping from social media APIs
- Evernote/Notes API sync

## 15) Acceptance Criteria
- User can create, edit, delete recipes.
- Search by title or ingredient works.
- Tags filter works.
- Favorites filter works.
- User can capture a recipe via paste, URL, screenshot, or social link.
- UI uses shadcn/ui components.
- Prisma schema matches data model.
- Deployed to Vercel and works end-to-end.
