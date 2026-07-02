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

User documents include `firstName`, `secondName`, `phone`, unique lowercase
`email`, hashed `password`, optional `role`, optional organization/location/
department references, ranked `skills`, and `status`.

User creation is exposed through:

```txt
POST /api/users
```

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
