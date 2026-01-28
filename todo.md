## Phase 1: Core Infrastructure (Week 1-2)

### Project Setup
- [X] Initialize Next.js app with App Router + TypeScript
- [X] Configure ESLint and Prettier
- [X] Set up Tailwind CSS
- [X] Add shadcn/ui and base components
- [X] Set up environment variables for database/auth

### Data Model
- [X] Install Prisma and PostgreSQL driver
- [X] Create Prisma schema for `Recipe`
- [X] Add migration for initial schema
- [X] Set up local database connection
- [X] Add seed data if needed for tags/examples

## Phase 2: API Layer (Week 2-3)

### Validation
- [X] Define Zod schemas for recipe input/output
- [X] Add validation for create/update payloads
- [X] Return 400 on invalid input

### Recipes API
- [X] Implement `GET /api/recipes` with search + filters
- [X] Implement `POST /api/recipes` for create
- [X] Implement `GET /api/recipes/:id` for detail
- [X] Implement `PUT /api/recipes/:id` for update
- [X] Implement `DELETE /api/recipes/:id` for delete

### Capture Parse API
- [X] Implement `POST /api/recipes/parse` for source parsing
- [X] For URL sources, fetch HTML and extract title/body
- [X] For pasted text, prefill instructions
- [X] For screenshot/social sources, store reference only

## Phase 3: Core UI (Week 3-4)

### Pages
- [X] Build dashboard list at `/`
- [X] Build create page at `/recipes/new`
- [X] Build detail page at `/recipes/[id]`
- [X] Build edit page at `/recipes/[id]/edit`

### Listing + Detail
- [X] Show recipe cards with title, summary, tags, favorite
- [X] Add favorite toggle in list and detail
- [X] Show full recipe content on detail view

### Search + Filter
- [X] Add search input with submit
- [X] Add tag multi-select filters
- [X] Add favorites-only filter
- [X] Persist filters in query params
- [X] Add clear filters button

## Phase 4: Capture Sources (Week 4-5)

### Capture UI
- [ ] Add capture source tabs: Paste, URL, Screenshot, Social
- [ ] Add text paste input and preview
- [ ] Add URL input with parse action
- [ ] Add screenshot upload input
- [ ] Add social link input

### Capture Behavior
- [ ] Store `sourceType` + relevant source fields
- [ ] Show screenshot alongside form for manual entry
- [ ] Require user review before saving

## Phase 5: Quality & Deployment (Week 5-6)

### Testing
- [ ] Add unit tests for Zod validation
- [ ] Add unit tests for recipe API handlers
- [ ] Add focused tests for search/filter behavior

### Performance & Security
- [ ] Sanitize text rendering
- [ ] Add basic rate limiting for API routes
- [ ] Ensure recipe data scoping if auth added

### Deployment
- [ ] Configure Vercel deployment
- [ ] Set production database (Neon or Supabase)
- [ ] Verify environment variables in production
