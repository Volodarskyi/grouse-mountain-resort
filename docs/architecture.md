# Project Architecture

This document describes the current architecture of the Horecan AI application.

## Overview

The app is a Next.js `16.2.6` project using the App Router, React `19.2.4`, TypeScript, React Query, MobX, Axios, Ant Design, global CSS, and SCSS.

The project uses one routing standard:

```txt
/org
/org/[organizationSlug]
/org/[organizationSlug]/location/[locationSlug]
/org/[organizationSlug]/location/[locationSlug]/training
/org/[organizationSlug]/location/[locationSlug]/orders
/org/[organizationSlug]/location/[locationSlug]/orders/public
/org/[organizationSlug]/location/[locationSlug]/orders/make
/org/[organizationSlug]/location/[locationSlug]/orders/prepare
/org/[organizationSlug]/location/[locationSlug]/orders/prepare/expo
/org/[organizationSlug]/location/[locationSlug]/kitchen
/org/[organizationSlug]/location/[locationSlug]/menu
/org/[organizationSlug]/location/[locationSlug]/recipes
/org/[organizationSlug]/location/[locationSlug]/inventory
/org/[organizationSlug]/location/[locationSlug]/employees
/org/[organizationSlug]/location/[locationSlug]/reports
/org/[organizationSlug]/location/[locationSlug]/settings
```

Do not use query parameters for organization or location. URLs always use slugs, never Mongo ObjectIds.

## Domain Model

```txt
Organization
  -> Location
    -> Modules
  -> Users
  -> Workstations
  -> Shifts
```

Mongo documents should expose:

```txt
_id
slug
name
```

Route modules receive:

```txt
organizationSlug
locationSlug
```

The API shape should follow the same nested route convention:

```txt
/api/org/[organizationSlug]/location/[locationSlug]/training
```

The API resolves slugs to Mongo `_id` values internally before querying module data.

## Database

MongoDB is connected on the server through `src/lib/mongodb.ts`. The active
database is selected by `MONGODB_ENV`:

```txt
MONGODB_ENV=dev | demo | prod
MONGODB_URI_DEV=...
MONGODB_URI_DEMO=...
MONGODB_URI_PROD=...
```

`MONGODB_URI` is still supported as a local fallback for `dev`. Do not expose
database connection strings with `NEXT_PUBLIC_`.

Active Mongo models:

- `features/users/model/User.ts` stores application users.
- `features/organizations/model/Organization.ts` stores tenant organizations.
- `features/locations/model/Location.ts` stores organization locations.
- `features/menu/model/MenuItem.ts` stores menu items and their production routing defaults.
- `features/menu/model/MenuGroup.ts` stores menu item groups.
- `features/orders/model/Order.ts` stores guest orders and order item workflow snapshots.
- `features/recipes/model/Recipe.ts` stores recipe metadata, video URL, steps, ingredient quantities, and creator reference.
- `features/workstations/model/Workstation.ts` stores configurable production stations per location.
- `features/shifts/model/Shift.ts` stores location business-day shifts.
- `features/shifts/model/ShiftStationAssignment.ts` stores users assigned to stations for a shift.

User documents include `firstName`, `secondName`, `phone`, unique lowercase
`email`, hashed `password`, optional `role`, optional organization/location/
department references, ranked `skills`, and `status`.

User creation is exposed through:

```txt
POST /api/users
```

Menu item creation is exposed through:

```txt
POST /api/menu-items
PATCH /api/menu-items/[menuItemId]
DELETE /api/menu-items/[menuItemId]
POST /api/menu-item-images
GET /api/menu-groups?organizationId=...&locationId=...
POST /api/menu-groups
```

Menu module routes:

```txt
/org/[organizationSlug]/location/[locationSlug]/menu
/org/[organizationSlug]/location/[locationSlug]/menu/create
/org/[organizationSlug]/location/[locationSlug]/menu/[menuItemId]/edit
```

The menu module resolves organization and location slugs to Mongo `_id`
references before reading or creating `MenuItem` documents. Menu items belong
to `MenuGroup` documents scoped by organization and location. Menu items should
link to recipes through optional `recipeId`; do not store recipe ingredients
directly on menu items. Menu items also expose optional `description`,
`imageUrl`, and `calories` for order-entry UI.

Menu items can be marked as modifiable with `isModifiable`. Until the recipe
and ingredients sprint is implemented, modification configuration stores
training ingredient codes only:

```txt
includedIngredientCodes[] = ingredients included by default and removable
addOnIngredientCodes[] = ingredients available as add-ons
```

Do not copy ingredient names/images into `MenuItem`; resolve them from the
training ingredient catalog in the UI.

During the test period, menu item photos are uploaded through
`POST /api/menu-item-images` and stored locally under
`public/assets/photo/menu/{organizationSlug}/{locationSlug}`. MongoDB stores only
the returned root-relative `imageUrl`, for example
`/assets/photo/menu/.../photo.png`. This is a temporary local filesystem
adapter; production file storage can replace the upload implementation later
without changing the `MenuItem.imageUrl` contract.

Recipe documents are prepared for a later recipe/ingredients sprint:

```txt
Recipe
  organizationId
  locationIds[]
  code
  name
  videoUrl
  steps[] = stepNumber, description, durationSeconds, imageUrl?
  ingredients[] = ingredientCode, quantity, unit
  createdByUserId
  createdAt
  updatedAt
```

Recipe ingredients reference the existing training ingredient codes. Unknown
ingredient codes should be skipped by future recipe import/management logic.

## Order Workflow

Order automation is modeled as a Front Desk assembler workflow with optional
Kitchen work:

```txt
Front Desk accepts order
  -> Front Desk assembles front_desk items
  -> Kitchen prepares kitchen/bar/expo items
  -> Kitchen hands ready items back to Front Desk
  -> Front Desk packs the order
  -> Guest receives the order
```

MongoDB is the source of truth. Ably should be used later as the realtime
transport after successful MongoDB writes, not as the owner of business state.

Production routing uses two layers:

```txt
productionArea = front_desk | kitchen | bar | expo
workstation = configurable station inside a production area
```

Examples:

```txt
Kitchen Station 1 - Patties
Kitchen Station 2 - Buns / Hot Dogs / Sides / Salads
Kitchen Station 3 - Burger Assembly
```

The number of active workstations and assigned user accounts can change by
shift. `Workstation` stores reusable station definitions, `Shift` stores the
business day, and `ShiftStationAssignment` stores who is working each station
for that shift.

`MenuItem.station` remains for backward compatibility with the current UI.
New workflow code should use `productionArea` and optional
`defaultWorkstationId`. If the UI only sends `station`, the server infers
`productionArea` from it.

`Order.items` stores snapshots of menu item name, price, station,
productionArea, workstation, quantity, and item status at order creation time.
Do not rely on the live `MenuItem` document for historical orders.

Order statuses:

```txt
submitted
accepted
in_progress
assembling
ready
ready_for_pickup
completed
cancelled
```

Order item statuses:

```txt
queued
claimed
preparing
ready
handed_off
packed
cancelled
```

For Ably, start with one channel per location:

```txt
orders:{organizationSlug}:{locationSlug}
```

Do not create one channel per order or per workstation for the MVP. The UI can
filter events by `productionArea` and `workstationId`.

Orders module routes:

```txt
/org/[organizationSlug]/location/[locationSlug]/orders
/org/[organizationSlug]/location/[locationSlug]/orders/public
/org/[organizationSlug]/location/[locationSlug]/orders/make
/org/[organizationSlug]/location/[locationSlug]/orders/prepare
/org/[organizationSlug]/location/[locationSlug]/orders/prepare/expo
```

`/orders` is the staff hub for order tools. `/orders/public` is reserved for a
future guest phone ordering entry point and stays disabled until customer-facing
ordering has its own security/session/payment rules. `/orders/make` is the
Front Desk order entry screen. `/orders/prepare` is the shared production board
for Front Desk assembly, Kitchen, Bar, and Expo.

`/orders/make` is a mobile-first client view. Its menu group bar scrolls
horizontally, while menu items scroll vertically inside the bordered work area.
Menu item detail uses `UiModalRoot`. Order navigation and cart review use the
shared `UiDrawerRoot` / `drawerStore` flow with right and bottom placements.

Development seed data is exposed through:

```txt
POST /api/dev/seed
```

The seed endpoint upserts Grouse Mountain Resort and its initial locations.

Development menu transfer is exposed through:

```txt
GET /api/dev/menu-transfer
GET /api/dev/menu-transfer?action=export&organizationId=...&locationId=...
POST /api/dev/menu-transfer
```

The menu transfer endpoint is dev tooling for moving restaurant menu groups and
menu items between `dev`, `demo`, and `prod` databases. Export returns JSON with
`schemaVersion`, source organization/location metadata, groups, and menuItems.
Import targets the selected organization/location and upserts groups by name and
menu items by `code` within that location. Transfer JSON uses portable
`recipeCode`, not Mongo ObjectIds. During import, `recipeCode` is resolved to the
target database `Recipe`; if the recipe does not exist yet, the menu item is
imported without `recipeId`.

## PWA

The app exposes install metadata through `src/app/manifest.ts` and iPad/iOS
standalone metadata through `src/app/layout.tsx`. PWA icons live under
`public/assets/icons/pwa` and use the Grouse Mountain white logo on the primary
red background. The app is configured for `display: standalone` and landscape
orientation so iPad users can install it from the browser share menu, with
Safari "Add to Home Screen" as the most reliable path.

No service worker cache strategy is enabled yet. Add one only after defining
how dynamic order, menu, MongoDB, and future Ably traffic should be cached or
explicitly excluded from caching.

## Seeded Organization

The first seeded organization is `Grouse Mountain Resort`:

```txt
organization.slug = "grouse-mountain"
```

Locations:

- `rusty-rail`: Rusty Rail
- `altitudes-bistro`: Altitudes Bistro
- `the-observatory`: The Observatory
- `lupins`: Lupin's Cafe

Example URLs:

```txt
/org/grouse-mountain
/org/grouse-mountain/location/rusty-rail
/org/grouse-mountain/location/lupins/training
```

## Source Layout

```txt
src/
  app/
    org/
      page.tsx
      [organizationSlug]/
        page.tsx
        location/
          [locationSlug]/
            layout.tsx
            page.tsx
            training/page.tsx
            orders/page.tsx
            orders/public/page.tsx
            orders/make/page.tsx
            orders/prepare/page.tsx
            kitchen/page.tsx
            menu/page.tsx
            recipes/page.tsx
            inventory/page.tsx
            employees/page.tsx
            reports/page.tsx
            settings/page.tsx
    layout.tsx
    page.tsx
    providers.tsx
    globals.css
  views/
    HomePage/
    TrainingPage/
  features/
    tenancy/
      lib/
      model/
    training/
      lib/
      model/
```

## App Router Rules

Routes live under `src/app`.

Route files stay thin:

- Read `params` with `await params`.
- Validate organization and location slugs.
- Delegate UI and business logic to `src/views` or `src/features`.

`src/app/org/[organizationSlug]/location/[locationSlug]/layout.tsx` loads and validates organization/location once for the location workspace and renders the module navigation.

Important Next.js 16 convention in this project: before changing route APIs, read the version-matched docs in `node_modules/next/dist/docs/`.

## Features

Business logic belongs under `src/features`.

Preferred feature structure:

```txt
features/
  tenancy/
    model/
    api/
    lib/
  training/
    model/
    api/
    lib/
    components/
  orders/
  kitchen/
  menu/
  recipes/
  inventory/
  employees/
  reports/
  settings/
```

Current active features:

- `features/tenancy/model/tenancyData.ts` stores temporary organization and location seed data.
- `features/tenancy/lib/tenancy.ts` stores organization/location lookup helpers.
- `features/training/model/trainingData.ts` stores ingredient and recipe data.
- `features/training/lib/trainingRecipe.ts` stores training business helpers.

## Views

Business page containers live in `src/views`.

Do not put business page containers in `src/pages`; Next.js treats `src/pages` as Pages Router.

## Verification

Common commands:

```bash
npm run dev
npm run build
npm run lint
npm test
```

Project rule:

- Do not run `npm run lint` or `npm run build` unless explicitly requested.
- Run `npm test` after utility, validation, or data logic changes.
