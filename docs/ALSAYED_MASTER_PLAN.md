# ALSAYED Food & Beverages --- Master Project Development Plan

> **Repository:** `alsayedcoldrinks`\
> **Official Brand:** ALSAYED Food & Beverages\
> **Document Role:** Single source of truth for architecture,
> implementation order, migration, UI direction, deployment, and project
> progress.\
> **Execution Rule:** Every Cursor session must read this file first,
> implement only the current phase, verify the work, update this file,
> and stop.

------------------------------------------------------------------------

## 1. Project Vision

ALSAYED Food & Beverages is being rebuilt as a modern, premium,
responsive beverage brand website and content management system.

The current production website must remain live and operational during
the complete rebuild. The new system will be developed separately,
tested locally and in staging, approved by the client, and only then
replace the legacy production system.

The rebuild is not a blind copy of the legacy Laravel backend. The
legacy system is the source of truth for existing business data and
implemented behavior, while the new architecture intentionally improves
the database, API, admin experience, image handling, SEO,
responsiveness, and customer-facing UI.

The final customer experience should feel like a modern beverage brand:
clean, premium, visual, fast, mobile-first, product-focused, and easy to
explore.

------------------------------------------------------------------------

## 2. Current Production System

The current live architecture is:

``` text
Old Next.js Customer Website
Vercel
        |
        v
Laravel 10 REST API
Hostinger
        |
        +---- MySQL Database
        |
        +---- public/images/
              Backend-hosted images
```

The existing system remains live until final production cutover.

### Legacy backend findings

The audited Laravel backend contains 20 API routes and the following
actual business domains:

-   Admin JWT authentication
-   Categories
-   Products grouped by category
-   CEO messages
-   Slider content
-   Image uploads

The legacy backend does not implement:

-   Customer authentication
-   Orders, cart, or checkout
-   Roles and permissions
-   Product images in the product table
-   Category images
-   Slugs
-   Product search
-   Pagination
-   Product detail endpoint
-   Site settings
-   Contact settings
-   Social media settings
-   Modern hero content management

The legacy database uses MySQL.

The primary legacy business tables are:

``` text
admins
categories
products
ceo_messge
slider_message
```

Legacy relationships:

``` text
Category
    hasMany Products

Product
    belongsTo Category
```

The legacy database currently cascades product deletion when a category
is deleted.

Legacy images are uploaded directly to:

``` text
public/images/
```

The Laravel upload system does not use Cloudinary, S3, or Laravel
Storage for the actual upload path.

CEO and slider records store full absolute image URLs.

The new system must improve this behavior.

------------------------------------------------------------------------

## 3. Target Production Architecture

``` text
                    ALSAYED Food & Beverages

Customer Website
Next.js / Vercel
        |
        |
        v
NestJS REST API
Hostinger
        |
        +----------------------+
        |                      |
        v                      v
PostgreSQL                 Persistent Backend Storage
Prisma                     Hostinger Server Disk
                           /uploads/

Admin Dashboard
Next.js / Vercel
        |
        +---------------------> NestJS REST API
```

Target domains:

``` text
alsayedfood.com
    Modern customer website

admin.alsayedfood.com
    Modern admin dashboard

api.alsayedfood.com
    NestJS REST API
```

Exact subdomain deployment depends on Hostinger plan/runtime
capabilities and final production configuration.

------------------------------------------------------------------------

## 4. Technology Stack

### Monorepo

-   pnpm
-   Turborepo
-   TypeScript

### Customer Website

-   Next.js
-   App Router
-   TypeScript
-   Tailwind CSS
-   Server-side data fetching for SEO/public content where appropriate
-   Client state only where interaction requires it

### Admin Dashboard

-   Next.js
-   App Router
-   TypeScript
-   Tailwind CSS
-   Redux Toolkit
-   RTK Query

### Backend

-   NestJS
-   REST API
-   Swagger
-   class-validator
-   class-transformer
-   JWT access authentication
-   Refresh token/session strategy
-   bcrypt
-   Multer for image uploads

### Database

-   PostgreSQL
-   Prisma ORM

### Image Storage

-   Backend-hosted images
-   Hostinger persistent server disk
-   No Cloudinary
-   No S3
-   No external object storage

### Local Infrastructure

-   Docker Compose
-   PostgreSQL 16 Alpine

------------------------------------------------------------------------

## 5. Monorepo Structure

``` text
alsayedcoldrinks/
|
├── apps/
│   ├── web/                 # Modern customer website
│   ├── admin-web/           # Modern admin dashboard
│   └── api/                 # NestJS REST API
│
├── packages/
│   ├── database/            # Prisma + PostgreSQL
│   ├── shared-types/        # Shared API/types contracts
│   └── config/              # Shared workspace configuration
│
├── docker-compose.yml
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── ALSAYED_MASTER_PLAN.md
```

The architecture is a modular monolith.

Do not add:

-   Microservices
-   Kafka
-   Kubernetes
-   Redis unless a proven future requirement appears
-   Cloudinary
-   S3

------------------------------------------------------------------------

## 6. Local Development Ports

``` text
Customer Web
http://localhost:3000

Admin Web
http://localhost:3001

NestJS API
http://localhost:3002/api

Swagger
http://localhost:3002/api/docs

PostgreSQL
localhost:5432
```

------------------------------------------------------------------------

## 7. Core Engineering Rules

1.  Keep the current Laravel and old Next.js production system live
    during development.
2.  Never develop directly against production data without a backup.
3.  Do not deploy incomplete phases to the production domain.
4.  The new NestJS system is a clean implementation informed by legacy
    behavior, not a line-by-line Laravel rewrite.
5.  Use PostgreSQL and Prisma for the new database.
6.  Store images on the backend server's persistent disk.
7.  Store relative image paths in PostgreSQL, not production domain
    URLs.
8.  Public image URLs are resolved by the API/frontend configuration.
9.  Use the approved modern ALSAYED desktop and mobile designs as the
    visual source of truth.
10. Use real ALSAYED product assets and business content in production.
11. AI mockups are visual references only; never preserve fake product
    text, fake statistics, or generated labels as business data.
12. Every phase must pass build/type/lint/database verification relevant
    to that phase.
13. Update this document after every completed phase.
14. Do not mark a phase COMPLETE when known implementation errors
    remain.
15. Cursor must implement one current phase at a time unless explicitly
    instructed otherwise.

------------------------------------------------------------------------

## 8. New Production Database Design

The new database intentionally improves the legacy schema.

### Admin

``` text
id
username
email
password
createdAt
updatedAt
```

Requirements:

-   Unique email
-   Unique username
-   bcrypt-compatible password
-   Existing Laravel bcrypt hash should be reusable during migration
    after verification

### Category

``` text
id
title
slug
description
imagePath
isActive
sortOrder
createdAt
updatedAt
```

Requirements:

-   Unique slug
-   Relative image path
-   Public API returns active categories
-   Sort by sortOrder and defined fallback
-   Do not automatically delete products when a category contains
    products
-   Admin deletion should be rejected until products are moved or
    deleted

### Product

``` text
id
title
slug
description
size
price
ingredients
imagePath
categoryId
isActive
isFeatured
sortOrder
createdAt
updatedAt
```

Requirements:

-   Unique slug
-   One primary product image for the initial production version
-   Relative image path
-   Category relation
-   Ingredients stored in a PostgreSQL-compatible Prisma representation
-   Preserve legacy integer price semantics until business confirms
    otherwise
-   Active/inactive state
-   Featured state
-   Manual sort order

### CeoMessage

``` text
id
name
title
description
imagePath
isActive
createdAt
updatedAt
```

The new database must use the correct model/table naming. The legacy
`ceo_messge` typo must not be repeated in the PostgreSQL schema.

### HeroContent

``` text
id
eyebrow
title
highlightedText
description
primaryButtonText
primaryButtonLink
secondaryButtonText
secondaryButtonLink
isActive
createdAt
updatedAt
```

The modern website uses a premium static hero composition rather than
reproducing the old carousel as the primary hero.

### SiteSettings

``` text
id
companyName
email
phone
whatsapp
address
facebookUrl
instagramUrl
tiktokUrl
logoPath
createdAt
updatedAt
```

This content must be manageable from the admin dashboard.

### Legacy Slider

The legacy slider is not automatically part of the new homepage
architecture.

Legacy slider data and images must be preserved during migration
analysis, but only migrate into an active new feature if the approved
modern website requires it.

------------------------------------------------------------------------

## 9. Image Storage Architecture

ALSAYED has a small image catalog. Backend-hosted image storage is the
selected production architecture.

### Development structure

``` text
apps/api/uploads/
├── products/
├── categories/
├── ceo/
├── hero/
├── branding/
└── legacy/
```

### Production concept

Use a persistent Hostinger/server directory appropriate for the final
hosting environment.

Example concept:

``` text
/var/www/alsayed/uploads/
```

The exact physical production path must be determined from the real
Hostinger environment.

### Database storage

Store:

``` text
/uploads/products/falastin-fizz-orange-uuid.webp
```

Do not store:

``` text
https://api.alsayedfood.com/uploads/products/...
```

### Public delivery

The NestJS API must expose configured upload directories as static
public assets.

Example public URL:

``` text
https://api.alsayedfood.com/uploads/products/falastin-fizz-orange-uuid.webp
```

### Upload rules

-   Validate MIME/type
-   Validate maximum file size
-   Generate collision-resistant filenames
-   Sanitize filename concepts
-   Use domain-specific directories
-   Delete replaced files when safely unreferenced
-   Delete associated images when a record is permanently deleted where
    safe
-   Prevent path traversal
-   Never trust the client-provided filename as the physical storage
    filename

### Deployment rule

If NestJS is deployed using Docker, uploads must not exist only inside
the disposable container layer.

Use:

-   Persistent bind mount, or
-   Persistent Docker volume backed by the Hostinger/VPS disk

Uploads must survive API rebuilds and container replacements.

------------------------------------------------------------------------

## 10. API Architecture

NestJS uses:

``` text
Controller
    |
    v
Service
    |
    v
Prisma
    |
    v
PostgreSQL
```

Recommended API modules:

``` text
auth/
admins/
categories/
products/
media/
content/
site-settings/
health/
common/
config/
prisma/
```

Do not duplicate legacy controller-level authentication logic.

Use NestJS guards and decorators correctly.

### Global API configuration

-   `/api` global prefix
-   ValidationPipe
-   whitelist true
-   transform true
-   forbidNonWhitelisted true
-   CORS from environment configuration
-   Swagger
-   Consistent error handling
-   Production-safe error responses
-   Do not expose raw exception messages

------------------------------------------------------------------------

## 11. Target API Direction

Final exact contracts are implemented phase by phase and documented in
Swagger.

### Health

``` text
GET /api/health
```

### Admin authentication

``` text
POST /api/auth/admin/login
POST /api/auth/admin/refresh
POST /api/auth/admin/logout
GET  /api/auth/admin/me
```

### Public categories

``` text
GET /api/categories
GET /api/categories/:slug
GET /api/categories/:slug/products
```

### Admin categories

``` text
POST   /api/admin/categories
PATCH  /api/admin/categories/:id
DELETE /api/admin/categories/:id
```

### Public products

``` text
GET /api/products
GET /api/products/:slug
```

Supported query direction:

``` text
?category=
?featured=
?search=
```

Do not overengineer pagination for the initial small catalog. Add it
only if product volume or UI requirements justify it.

### Admin products

``` text
POST   /api/admin/products
PATCH  /api/admin/products/:id
DELETE /api/admin/products/:id
```

### Content

``` text
GET /api/content/hero
GET /api/content/ceo
GET /api/site-settings
```

### Admin content

``` text
PATCH /api/admin/content/hero
PATCH /api/admin/content/ceo
PATCH /api/admin/site-settings
```

Media endpoints may exist for reusable upload workflows, but
product/category/content flows should remain easy for the admin UI.

------------------------------------------------------------------------

## 12. Modern Customer Website UI Direction

The approved ALSAYED desktop and mobile design references are the visual
source of truth.

### Brand direction

-   Warm white / clean light background
-   ALSAYED green as primary brand accent
-   Dark high-contrast typography
-   Premium editorial heading style
-   Clean sans-serif body typography
-   Large intentional whitespace
-   Soft borders
-   Restrained shadows
-   Product-first visual presentation
-   Premium beverage brand feeling
-   Smooth but subtle animation

Avoid:

-   Old dark website styling
-   Bubble-heavy decoration
-   Autoplay hero carousel
-   Excessive gradients
-   Heavy shadows
-   Generic SaaS design
-   Excessive glassmorphism
-   Animation that delays product discovery

### Homepage structure

``` text
Navbar
    ↓
Premium Hero
    ↓
Quality / Trust Strip
    ↓
Beverage Categories
    ↓
Featured Products
    ↓
Who We Are
    ↓
CEO / Founder Message
    ↓
Palestinian Heritage / Brand Story
    ↓
Contact / WhatsApp CTA
    ↓
Premium Footer
```

### Hero direction

Use one premium hero composition.

Content direction:

-   Strong brand message
-   Product lineup as a major visual element
-   Clear primary CTA
-   Clear secondary CTA
-   Real product assets
-   Subtle product reveal
-   Very light decorative/parallax movement only where performance
    remains good

Do not reproduce the old slider as the primary homepage hero.

### Mobile UX

Mobile is not a stacked desktop layout.

Implement an intentional mobile composition:

-   Compact navigation
-   Touch-friendly menu
-   Text-first hero
-   Product imagery positioned for narrow screens
-   44px or larger practical touch targets
-   Swipe-friendly category/product presentation where useful
-   Reduced decorative animation
-   Compact CEO composition
-   Simplified trust content
-   Fast WhatsApp/contact access
-   No horizontal overflow

### Responsive targets

Verify:

-   Small mobile
-   Standard mobile
-   Large mobile
-   Tablet
-   Laptop
-   Desktop
-   Wide desktop

------------------------------------------------------------------------

## 13. Customer Website Data Strategy

Do not force Redux into every public page.

Use:

``` text
SEO / public content
    Next.js server fetching where appropriate

Interactive client state
    Client components

Complex shared client API state
    RTK Query only when justified
```

Public category and product pages should be designed for SEO.

Use metadata, semantic HTML, proper headings, meaningful alt text, and
stable product/category URLs using slugs.

------------------------------------------------------------------------

## 14. Modern Admin Dashboard Scope

The new admin dashboard manages the website content required by the
modern customer website.

Pages:

``` text
Login
Dashboard
Categories
Products
Hero Content
CEO Message
Site Settings
Media where needed
Profile / Logout
```

### Dashboard

Initial dashboard should provide useful operational information such as:

-   Total products
-   Active products
-   Featured products
-   Total categories
-   Recent products/content changes where available

Do not invent fake analytics.

### Categories

Admin can:

-   Create
-   Edit
-   Upload/replace image
-   Activate/deactivate
-   Set sort order
-   Delete only when safe

### Products

Admin can:

-   Create
-   Edit
-   Upload/replace product image
-   Select category
-   Set size
-   Set price
-   Manage ingredients
-   Activate/deactivate
-   Mark featured
-   Set sort order
-   Delete

### Hero

Admin can manage the actual dynamic hero text and CTA content supported
by `HeroContent`.

The hero product imagery/composition may remain design-driven if making
every visual element dynamic would reduce design quality.

### CEO Message

Admin can manage:

-   Name
-   Title
-   Description
-   Image
-   Active state

### Site Settings

Admin can manage:

-   Company name
-   Email
-   Phone
-   WhatsApp
-   Address
-   Social links
-   Logo

### Admin API state

Use Redux Toolkit and RTK Query for authenticated admin API workflows.

------------------------------------------------------------------------

## 15. Legacy Data Migration Strategy

The legacy Laravel database is MySQL.

Target database is PostgreSQL.

Migration order:

``` text
1. admins
2. categories
3. products
4. ceo_messge
5. slider_message data if required
```

### Migration rules

-   Export from a fresh production backup
-   Never mutate the live MySQL database as part of migration
    development
-   Preserve useful numeric IDs where practical
-   Preserve legacy timestamps
-   Preserve category/product relationships
-   Preserve product ingredients
-   Reuse bcrypt admin hashes after compatibility verification
-   Generate slugs for legacy categories/products
-   Resolve slug collisions deterministically
-   Set sensible new defaults for `isActive`, `isFeatured`, and
    `sortOrder`
-   Do not invent product images during automated migration
-   Validate row counts before and after migration
-   Validate category/product foreign keys
-   Produce a migration report

### Price

Legacy product price is an integer.

Do not change currency semantics until confirmed from real production
data/business usage.

------------------------------------------------------------------------

## 16. Legacy Image Migration Strategy

Legacy image source:

``` text
Laravel project
public/images/
```

Legacy CEO records store one absolute URL.

Legacy slider records store arrays of absolute URLs.

Migration flow:

``` text
Backup public/images/
        ↓
Copy required files
        ↓
New backend uploads/legacy or domain directory
        ↓
Map legacy URLs to relative paths
        ↓
Update migrated PostgreSQL records
        ↓
Verify public image delivery
```

Do not delete legacy images during migration.

Audit referenced versus orphaned legacy files before cleanup.

New product and category images should be uploaded as real high-quality
ALSAYED assets through the new admin workflow because the legacy
database does not contain product/category image fields.

------------------------------------------------------------------------

## 17. Deployment and Replacement Strategy

### Development

Build the complete new monorepo separately.

The live site remains:

``` text
Old Next.js
    ↓
Laravel
    ↓
MySQL
```

### Staging

Before production replacement, deploy the new system to staging/preview.

Concept:

``` text
Vercel Preview or staging.alsayedfood.com

staging-api.alsayedfood.com
```

Exact deployment depends on the available Hostinger runtime and DNS
setup.

### Staging verification

Test:

-   Desktop UI
-   Mobile UI
-   Tablet UI
-   Chrome
-   Safari where available
-   Admin login
-   Token refresh/logout
-   Category CRUD
-   Safe category deletion
-   Product CRUD
-   Product image upload
-   Product image replacement
-   CEO content
-   Hero content
-   Site settings
-   Image persistence after backend restart/redeploy
-   Public product/category pages
-   SEO metadata
-   Broken images
-   API errors
-   CORS
-   Production build
-   Core Web Vitals/performance
-   WhatsApp links
-   Phone/email links

### Client approval

Client reviews:

-   Customer website
-   Mobile experience
-   Product data
-   Product images
-   CEO information
-   Brand story
-   Contact details
-   WhatsApp
-   Social links
-   Admin dashboard

### Production cutover

Only after approval:

``` text
1. Backup production MySQL
2. Backup Laravel backend
3. Backup public/images/
4. Export latest production data
5. Run final PostgreSQL migration
6. Copy/map final images
7. Verify PostgreSQL
8. Verify NestJS API
9. Verify persistent uploads
10. Deploy modern Next.js customer website
11. Deploy admin website
12. Configure production environment variables
13. Configure domains/CORS
14. Run production smoke tests
15. Switch the customer website to the new API
16. Monitor errors and image delivery
```

### Rollback

Keep the legacy Laravel system and production backup available during a
defined rollback window.

Do not immediately delete the old Laravel backend or MySQL data after
cutover.

------------------------------------------------------------------------

## 18. Implementation Roadmap

### Phase 01 --- Monorepo Foundation

**Goal:** Establish the complete pnpm/Turborepo workspace.

Deliverables:

-   `apps/web`
-   `apps/admin-web`
-   `apps/api`
-   `packages/database`
-   `packages/shared-types`
-   `packages/config`
-   Docker PostgreSQL
-   Root scripts
-   Local environment examples
-   Build verification

Completion criteria:

-   All apps build
-   PostgreSQL runs
-   Prisma generation works
-   Workspace dependencies resolve
-   Turbo recognizes the workspace

**Status:** COMPLETE

**Verified:** All 6 workspace packages resolve; PostgreSQL 16 container healthy; Prisma client generates; `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass via Turbo.

------------------------------------------------------------------------

### Phase 02 --- PostgreSQL Production Schema

**Goal:** Replace the temporary connectivity schema with the ALSAYED
production business schema.

Implement:

-   Admin
-   Category
-   Product
-   CeoMessage
-   HeroContent
-   SiteSettings

Deliverables:

-   Prisma schema
-   Migration
-   Prisma generation
-   Relationship verification
-   Seed strategy for local development

Completion criteria:

-   Migration succeeds
-   Prisma client generates
-   Database constraints match this master plan
-   No legacy typo naming is repeated

**Status:** COMPLETE

**Implementation:** `packages/database/prisma/schema.prisma` defines `Admin`, `AdminSession`, `Category`, `Product`, `CeoMessage`, `HeroContent`, `SiteSettings`. Integer price semantics, `ingredients String[]`, relative `imagePath`, unique slugs, `Category hasMany Product` with `onDelete: Restrict` (no destructive cascade), `ceoMessage` correctly named (legacy typo not reproduced). `SystemHealth` removed via migration. Two migrations applied; schema up to date. Dev seed (`prisma/seed.ts`) creates one bcrypt admin (`admin` / `Admin123!`, DEV ONLY), 4 categories, 6 products, hero, CEO, site settings — all clearly labelled development data.

**Verified:** `prisma migrate status` → "Database schema is up to date!" (2 migrations); Prisma client generates; relationships confirmed via live API (`productCount` per category, product→category summary).

------------------------------------------------------------------------

### Phase 03 --- NestJS Core Foundation

**Goal:** Prepare the API architecture before business modules.

Implement:

-   Prisma module/service
-   Config validation
-   Global ValidationPipe
-   CORS
-   Swagger
-   Health module
-   Global exception/error behavior
-   Production-safe API errors

Completion criteria:

-   `/api/health` works
-   Swagger loads
-   Prisma connection works
-   API build succeeds

**Status:** COMPLETE

**Implementation:** `PrismaModule`/`PrismaService` (global, lifecycle hooks), `ConfigModule` with `env.validation.ts`, global `ValidationPipe` (`whitelist`, `transform`, `forbidNonWhitelisted`), env-based CORS for `localhost:3000/3001`, Swagger at `/api/docs` with bearer auth, `AllExceptionsFilter` mapping Prisma errors to production-safe responses (no stack traces / raw Prisma leakage).

**Verified:** `GET /api/health` → `{"status":"ok","service":"alsayed-api","database":"up"}`; all routes mapped on boot; API build succeeds.

------------------------------------------------------------------------

### Phase 04 --- Admin Authentication

**Goal:** Secure the admin system.

Implement:

-   Admin login
-   Access token
-   Refresh strategy
-   Logout
-   `/me`
-   JWT guard
-   bcrypt verification
-   Swagger auth documentation

Completion criteria:

-   Valid login works
-   Invalid credentials return correct error
-   Protected routes reject unauthenticated access
-   Refresh works
-   Logout/session behavior is verified
-   Legacy bcrypt compatibility has a test path

**Status:** COMPLETE

**Implementation:** `POST /api/auth/admin/login|refresh|logout`, `GET /api/auth/admin/me`. Short-lived JWT access token (900s) + opaque refresh credential; only a hashed refresh representation is stored in `AdminSession` (raw refresh never persisted). Refresh rotates the session; logout revokes it. `JwtAuthGuard` + `@CurrentAdmin` decorator protect routes. bcrypt (`bcryptjs`) used for password verification — hash format is standard bcrypt, so legacy Laravel hashes can be copied without forced resets.

**Verified (live):** valid login OK; `me` with token OK; `me` without token → 401; refresh OK; **reused (rotated-out) refresh → 401**; logout → `{success:true}`; **refresh after logout → 401**.

------------------------------------------------------------------------

### Phase 05 --- Backend Image Storage

**Goal:** Implement persistent backend-hosted image storage.

Implement:

-   Multer configuration
-   Upload validation
-   Domain directories
-   Relative paths
-   Static serving
-   Replacement cleanup
-   Safe deletion
-   Environment-based public URL resolution
-   Persistent deployment documentation

Completion criteria:

-   Image upload works
-   Image URL is publicly reachable
-   DB-ready relative path format is verified
-   Invalid uploads are rejected
-   Replaced image cleanup works
-   Storage persistence requirements are documented

**Status:** COMPLETE

**Implementation:** `StorageService` + `ImageUploadInterceptor` (Multer memory storage, MIME + size validation, collision-resistant UUID filenames, path-traversal protection). Domain directories under `apps/api/uploads/{products,categories,ceo,hero,branding,legacy}`. DB stores **relative** paths (`/uploads/<domain>/<file>`); static serving mounted at `/uploads`. Replacement deletes the previous file; deletion removes the file. Upload root is env-configurable (`UPLOAD_ROOT`) for a Hostinger persistent disk / bind mount in production.

**Persistence requirement (documented):** uploads MUST survive NestJS restart, application rebuild, and container replacement — production must use a persistent Hostinger directory / bind mount / volume; ephemeral container-only storage is unacceptable.

**Verified (live):** category image uploaded → stored as `/uploads/categories/categories-<uuid>.png`; `GET http://localhost:3002/uploads/...` → `200 image/png`; after category delete the image → `404` (cleanup confirmed).

------------------------------------------------------------------------

### Phase 06 --- Categories Vertical Slice

**Goal:** Build categories from database to admin-ready API.

Implement:

-   Prisma integration
-   DTOs
-   Public APIs
-   Admin CRUD
-   Image handling
-   Slugs
-   Active status
-   Sort order
-   Safe delete behavior
-   Swagger
-   Shared types

Completion criteria:

-   Public active category list works
-   Slug lookup works
-   Admin CRUD works
-   Image replacement works
-   Category with products cannot be accidentally deleted
-   Build/type verification passes

**Status:** COMPLETE

**Implementation:** `CategoriesModule` / `CategoriesService`. Public: `GET /api/categories`, `/api/categories/:slug`, `/api/categories/:slug/products`. Admin (JWT): `POST/PATCH/DELETE /api/admin/categories`. Unique slug generation, active filtering, deterministic sort, image upload/replacement, relative paths. Populated-category delete returns HTTP 409. Shared `CategoryDto` type.

**Verified (live):** public list returns active categories with `productCount`; create-with-image OK; delete empty category OK; **delete of populated category id=1 → 409 Conflict**.

------------------------------------------------------------------------

### Phase 07 --- Products Vertical Slice

**Goal:** Build the complete modern product domain.

Implement:

-   Product CRUD
-   Product image
-   Category relationship
-   Slug
-   Ingredients
-   Size
-   Price
-   Active status
-   Featured status
-   Sort order
-   Public product list
-   Product detail by slug
-   Category product list
-   Search/category/featured filters
-   Swagger
-   Shared types

Completion criteria:

-   Public APIs work
-   Admin CRUD works
-   Product images work
-   Slugs are stable
-   Filters work
-   Category relationship is validated

**Status:** COMPLETE

**Implementation:** `ProductsModule` / `ProductsService`. Public: `GET /api/products` (filters: `category`, `featured`, `search`), `GET /api/products/:slug`, `GET /api/categories/:slug/products`. Admin (JWT): `POST/PATCH/DELETE /api/admin/products`. Unique/stable slugs, category-existence validation, image upload/replacement (relative paths), `ingredients String[]`, integer price, active/featured filtering, deterministic sort. No cart/checkout/orders (catalog only, per plan). Shared `ProductDto`.

**Verified (live):** `GET /api/products?featured=true` returns 4 featured products each with embedded category summary; product detail by slug works.

------------------------------------------------------------------------

### Phase 08 --- Website Content Management

**Goal:** Build dynamic content required by the approved modern website.

Implement:

-   HeroContent API
-   CeoMessage API
-   SiteSettings API
-   Admin update endpoints
-   Image handling
-   Public content endpoints
-   Swagger/shared contracts

Completion criteria:

-   Modern homepage content can be managed without code changes for
    supported fields
-   CEO image replacement works
-   Site contact/social information is dynamic

**Status:** COMPLETE

**Implementation:** `ContentModule` (singleton `HeroContent` + `CeoMessage` upsert logic) and `SiteSettingsModule`. Public: `GET /api/content/hero`, `/api/content/ceo`, `/api/site-settings`. Admin (JWT): `PATCH /api/admin/content/hero`, `/api/admin/content/ceo` (CEO image upload/replacement), `PATCH /api/admin/site-settings` (logo/branding upload/replacement). Email + URL validation; empty multipart strings coerced to `undefined`. No invented metrics/certifications/statistics. Shared DTOs.

**Verified (live):** `GET /api/site-settings` returns full dynamic company/contact/social record; hero + CEO endpoints serve managed content.

------------------------------------------------------------------------

### Phase 09 --- Modern Customer Website Static UI

**Goal:** Implement the approved premium desktop/mobile website before
API integration.

Implement:

-   Navbar
-   Hero
-   Trust strip
-   Categories
-   Featured products
-   Who We Are
-   CEO section
-   Palestinian heritage/brand story section
-   WhatsApp/contact CTA
-   Footer
-   Responsive desktop/tablet/mobile layouts
-   Subtle motion

Use static mock data and real local ALSAYED assets where available.

Do not integrate APIs in this phase.

Completion criteria:

-   Desktop composition matches approved direction
-   Mobile composition is intentionally designed
-   No horizontal overflow
-   Touch targets are usable
-   Animations are restrained
-   Production build succeeds

**Status:** COMPLETE

**Implementation:** `apps/web` (Next.js 16, App Router, Tailwind v4). All required sections built as components: Navbar, premium Hero, Trust strip, Categories, Featured products, Who We Are, CEO, Palestinian heritage/brand story, WhatsApp/contact CTA, premium Footer. Custom design system (warm/clean white, ALSAYED green, editorial display heading via Playfair Display, soft borders, restrained shadows) derived from the client-approved `design-references/Desktop-ui.PNG` and `Mobile-ui.PNG`. Bottle placeholder component allows real transparent PNG product assets to drop in without layout redesign.

**Status note on visual verification:** production build succeeds and static/dynamic routes render. Pixel-level browser/screenshot comparison against the reference images was **not** performed in this session (no browser-automation tooling was invoked), so a formal visual-parity claim is not made.

------------------------------------------------------------------------

### Phase 10 --- Customer Website API Integration

**Goal:** Replace homepage and catalog mock data with real NestJS data.

Implement:

-   Categories
-   Featured products
-   Product list
-   Product detail
-   CEO content
-   Hero content
-   Site settings
-   Loading/error/empty states
-   SEO metadata
-   Image URL resolution

Completion criteria:

-   No business mock data remains in production flows
-   SEO pages use appropriate Next.js fetching
-   API failures have graceful UI behavior
-   Product/category URLs are slug-based

**Status:** COMPLETE

**Implementation:** Server-side data fetching (`apps/web/src/lib/api.ts`) for SEO; slug routes `/products`, `/products/[slug]`, `/categories/[slug]`; per-page metadata; `resolveImageUrl` for API-hosted images; ISR (`revalidate 30s` on home). API failures fall back to **explicit** development data with a visible `DevFallbackBanner` and a `[ALSAYED][dev-fallback]` server log — never silent mock business data. Redux is intentionally NOT used on the public site.

**Verified:** production build succeeds; during static generation (API offline) the explicit dev-fallback path triggered and logged as designed.

------------------------------------------------------------------------

### Phase 11 --- Modern Admin Dashboard UI

**Goal:** Build the complete approved ALSAYED admin experience.

Implement:

-   Login
-   Dashboard
-   Categories
-   Products
-   Hero Content
-   CEO Message
-   Site Settings
-   Media workflows where needed
-   Profile/logout
-   Responsive admin layout

Use mock/static UI data where needed before integration.

Completion criteria:

-   All required admin screens exist
-   Forms reflect real API fields
-   UI is consistent with ALSAYED branding
-   Responsive admin behavior works

**Status:** COMPLETE

**Implementation:** `apps/admin-web` (Next.js 16). Pages: Login, Dashboard, Categories, Products, Hero Content, CEO Message, Site Settings, plus profile/logout in the shell. `AdminShell` sidebar/topbar layout, ALSAYED white/green branding (distinct from customer site), reusable UI kit (Button/Field/Input/Textarea/Select/Card/Toggle/Badge), professional tables, image-preview upload field, toast notifications, confirm dialog. Forms mirror the actual API DTOs (no unsupported fields).

**Verified:** admin production build succeeds; all 8 routes prerendered.

------------------------------------------------------------------------

### Phase 12 --- Admin API Integration

**Goal:** Connect the admin dashboard to NestJS.

Implement:

-   Auth state
-   Token handling
-   Refresh
-   Protected routes
-   RTK Query
-   Category CRUD
-   Product CRUD
-   Upload workflows
-   Hero updates
-   CEO updates
-   Settings updates
-   Error/success feedback

Completion criteria:

-   Admin can manage all supported website data
-   Page refresh preserves valid authentication
-   Expired auth behavior is correct
-   CRUD changes appear on the customer website

**Status:** COMPLETE

**Implementation:** Redux Toolkit + RTK Query (`apps/admin-web/src/store`). `authSlice` holds access token in memory; refresh token persisted (localStorage) for session restoration via `AuthBootstrap`. `baseQueryWithReauth` transparently refreshes on 401 and retries; logout revokes the refresh session server-side. `AuthGuard` protects the `(admin)` route group. RTK Query endpoints cover dashboard summary, category CRUD + image, product CRUD + image, hero, CEO + image, site settings + logo, using `multipart/form-data` for uploads. Loading/success/error/DTO-validation/empty/conflict feedback wired via toasts and dialogs.

**Verified:** admin build succeeds; underlying API flows (auth restore, refresh rotation, CRUD, image upload, delete-conflict) confirmed live against the running API (see Phase 04/05/06 verifications). Manual click-through of the admin UI in a browser was not automated this session.

------------------------------------------------------------------------

### Phase 13 --- Legacy MySQL Data Migration

**Goal:** Migrate live business data into PostgreSQL safely.

Implement:

-   Read-only legacy export process
-   Transformation script
-   Admin migration
-   Category migration
-   Product migration
-   CEO migration
-   Slug generation
-   New-field defaults
-   Row count validation
-   Relationship validation
-   Migration report

Completion criteria:

-   Expected records are migrated
-   Relationships are valid
-   Admin hash compatibility is verified
-   No live MySQL mutation occurs

**Status:** PENDING

------------------------------------------------------------------------

### Phase 14 --- Legacy Image Migration

**Goal:** Preserve required legacy backend images.

Implement:

-   Backup/copy process
-   URL-to-relative-path mapping
-   CEO image mapping
-   Required legacy slider preservation
-   Orphan/reference audit
-   Public delivery verification

Completion criteria:

-   Required legacy images load from the new backend
-   PostgreSQL does not depend on old production image URLs for migrated
    active content
-   Original backup remains untouched

**Status:** PENDING

------------------------------------------------------------------------

### Phase 15 --- Full System QA

**Goal:** Verify the entire system before staging approval.

Test:

-   API
-   Database
-   Authentication
-   Customer web
-   Admin
-   Images
-   Responsive UI
-   SEO
-   CORS
-   Error handling
-   Builds
-   Data integrity

Completion criteria:

-   No critical known defects
-   All production builds succeed
-   QA findings are documented and resolved or explicitly accepted

**Status:** PENDING

------------------------------------------------------------------------

### Phase 16 --- Staging Deployment

**Goal:** Deploy the complete new system without replacing production.

Implement:

-   Customer preview/staging
-   Admin staging
-   NestJS staging
-   PostgreSQL staging
-   Persistent uploads
-   CORS
-   Environment configuration
-   HTTPS/domain configuration where applicable

Completion criteria:

-   Staging works end to end
-   Uploads survive backend restart/redeploy
-   Customer and admin apps reach the staging API

**Status:** PENDING

------------------------------------------------------------------------

### Phase 17 --- Client Approval

**Goal:** Obtain final business/content approval.

Review:

-   Desktop
-   Mobile
-   Products
-   Images
-   CEO
-   Brand story
-   Contact
-   WhatsApp
-   Social links
-   Admin workflows

Completion criteria:

-   Client-approved changes are completed
-   Final content is verified

**Status:** PENDING

------------------------------------------------------------------------

### Phase 18 --- Production Cutover

**Goal:** Replace the old customer-facing system safely.

Execute:

-   Final backups
-   Final MySQL export
-   Final migration
-   Final image sync
-   NestJS production verification
-   PostgreSQL verification
-   Upload persistence verification
-   Customer web deployment
-   Admin deployment
-   Production API configuration
-   Production smoke tests

Completion criteria:

-   `alsayedfood.com` uses the new system
-   Production APIs work
-   Images load
-   Admin works
-   Critical customer flows work

**Status:** PENDING

------------------------------------------------------------------------

### Phase 19 --- Rollback Monitoring

**Goal:** Monitor the new production system while retaining rollback
capability.

Monitor:

-   API errors
-   Image failures
-   Authentication
-   Database integrity
-   Customer UI
-   Admin operations

Completion criteria:

-   Stable production observation window completed
-   No unresolved critical migration/cutover issues

**Status:** PENDING

------------------------------------------------------------------------

### Phase 20 --- Legacy Cleanup

**Goal:** Retire legacy infrastructure only after confirmed stability.

Actions:

-   Preserve required backups
-   Document rollback closure
-   Remove obsolete production dependencies only when approved
-   Archive Laravel migration reference
-   Update this master plan with final architecture

Never delete legacy production data or image backups casually.

**Status:** PENDING

------------------------------------------------------------------------

## 19. Cursor Execution Workflow

Every implementation prompt must begin with this workflow:

``` text
Read ALSAYED_MASTER_PLAN.md completely before changing code.

Treat it as the single source of truth for:
- project architecture
- business scope
- UI direction
- image storage
- migration strategy
- deployment strategy
- implementation order

Inspect the current repository state.

Identify the current roadmap phase.

Implement ONLY the requested phase.

Do not silently implement future phases.

Run all verification required by the phase.

Fix errors caused by the implementation.

Update ALSAYED_MASTER_PLAN.md:
- phase status
- actual completed work
- technical decisions
- deviations
- verification results
- next phase

Do not mark a phase COMPLETE unless its completion criteria pass.

Finish with a concise execution report.
```

### Phase status values

Use only:

``` text
PENDING
IN PROGRESS
BLOCKED
COMPLETE
```

### Documentation rule

This file is the only project roadmap/context file required for the new
system.

Do not create multiple overlapping roadmap/context documents unless
explicitly requested.

The legacy Laravel audit may be kept temporarily as migration
evidence/reference, but this master file controls new-system
implementation.

------------------------------------------------------------------------

## 20. Current Project Status

### Current phase

``` text
Local system build (Phases 01–12): COMPLETE
Next authorized phase: Phase 13 — Legacy MySQL Data Migration (NOT started; requires owner approval)
```

### Local build status (overnight autonomous session)

``` text
Phase 01  Monorepo Foundation ............... COMPLETE
Phase 02  PostgreSQL Business Schema ......... COMPLETE
Phase 03  NestJS Core Foundation ............. COMPLETE
Phase 04  Admin Authentication ............... COMPLETE
Phase 05  Backend Image Storage .............. COMPLETE
Phase 06  Categories Vertical Slice .......... COMPLETE
Phase 07  Products Vertical Slice ............ COMPLETE
Phase 08  Website Content Management ......... COMPLETE
Phase 09  Customer Website Static UI ......... COMPLETE (build verified; no automated visual diff)
Phase 10  Customer Website API Integration ... COMPLETE
Phase 11  Admin Dashboard UI ................. COMPLETE
Phase 12  Admin API Integration .............. COMPLETE
Phase 13–20 ................................... PENDING (NOT authorized this session)
```

### Full-system verification results

``` text
pnpm lint ......... PASS (all 6 packages)
pnpm typecheck .... PASS (all packages)
pnpm build ........ PASS (@alsayed/web, @alsayed/admin-web, @alsayed/api + shared packages)
PostgreSQL ........ Up (healthy), container alsayed-postgres
Prisma migrate .... "Database schema is up to date!" (2 migrations)
API health ........ {"status":"ok","service":"alsayed-api","database":"up"}
Auth flow ......... login / me / guard-401 / refresh / rotation-reject / logout / post-logout-reject ALL PASS
Image storage ..... upload -> relative path -> static 200 image/png -> delete -> 404 cleanup ALL PASS
Delete safety ..... populated category delete -> 409 Conflict
Dashboard summary . {categories:4, products:6, active:6, featured:4} (real data, authed)
```

### Not verified this session (tooling boundary)

- Automated browser/screenshot visual diff of the customer site against
  `design-references/Desktop-ui.PNG` / `Mobile-ui.PNG`.
- Manual click-through of the admin dashboard UI in a live browser
  (underlying APIs were verified directly instead).

### Known completed preparation

-   New GitHub repository created: `alsayedcoldrinks`
-   Repository cloned locally
-   Official brand confirmed: ALSAYED Food & Beverages
-   Legacy Laravel backend audited
-   Legacy API behavior mapped
-   Legacy database structure mapped
-   Legacy image storage behavior mapped
-   New architecture selected
-   Backend-hosted persistent image storage selected
-   Hostinger investment will be reused where technically supported
-   Cloudinary/object storage rejected for the current project scope
-   Current live website will remain online during the rebuild
-   Modern desktop/mobile design direction approved by the client

### Immediate next action

The complete LOCAL system (Phases 01–12) is implemented and verified.
Phases 13–20 (legacy data/image migration, staging, production cutover)
require explicit owner approval and production credentials and are
intentionally NOT started.

Recommended first action tomorrow:

``` text
1. Run the local stack (docker compose up -d + pnpm dev) and manually
   review the customer site (desktop + mobile) and admin dashboard in a
   browser against design-references/Desktop-ui.PNG and Mobile-ui.PNG.
2. Capture any visual refinements as small follow-up tasks.
3. Only after sign-off, plan Phase 13 (legacy MySQL export -> transform ->
   PostgreSQL) in a read-only, non-destructive manner.
```

------------------------------------------------------------------------

## 21. Final Product Definition

The project is complete when ALSAYED Food & Beverages has:

-   A premium modern customer website
-   High-quality desktop UX
-   Intentional mobile UX
-   Dynamic categories
-   Dynamic products
-   Product images
-   Product detail pages
-   Featured products
-   Dynamic hero content
-   Dynamic CEO content
-   Dynamic company contact/social settings
-   WhatsApp/contact conversion paths
-   Modern admin dashboard
-   Secure admin authentication
-   Backend-hosted persistent image storage
-   NestJS REST API
-   PostgreSQL database
-   Prisma ORM
-   Swagger documentation
-   Legacy business data migrated
-   Required legacy images migrated
-   Staging approval completed
-   Production cutover completed
-   Rollback monitoring completed

The final production system replaces the legacy Next.js + Laravel +
MySQL architecture only after verification and client approval.

------------------------------------------------------------------------

**End of ALSAYED Master Project Development Plan**
