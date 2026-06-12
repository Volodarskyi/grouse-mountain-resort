# Project Architecture

This document describes the current architecture of the Grouse Mountain Resort application.

## Overview

The app is a Next.js `16.2.6` project using the App Router, React `19.2.4`, TypeScript, React Query, MobX, Axios, Zod, React Hook Form, CSS Modules, and SCSS.

The codebase is organized around route entry points in `src/app` and feature modules in `src/features`. API access, shared types, i18n, and global styling live in dedicated top-level `src` folders. Static images and icons live in `public`.

## Runtime Stack

- Framework: Next.js `16.2.6`
- UI runtime: React `19.2.4`
- Language: TypeScript with `strict` enabled
- Data fetching cache: `@tanstack/react-query`
- Client UI state: MobX
- HTTP client: Axios
- Forms: `react-hook-form`
- Validation: Zod
- Styling: global CSS, CSS Modules, and SCSS
- Tests: Vitest

## Source Layout

```txt
public/
  favicon.png
  GROUSE-FAVICON_800-round.png
  assets/
    icons/
      icon-chef.png
    ingredients/
      AllBeefDog.png
      AmericanCheeseSlice.png
      BananaPeppers.png
      BBQSauce.png
      BeefPatty.png
      BeerMustard.png
      BeyondMeatPatty.png
      BlackBeans.png
      BratwurstSausage.png
      CaesarDressing.png
      ChipotleLimeDressing.png
      CrispyBacon.png
      CrispyOnion.png
      Croutons.png
      CrushedPotatoChips.png
      DoubleBeefPatty.png
      FreshLettuce.png
      GrilledBriocheBunBottom.png
      GrilledBriocheBunTop.png
      GrilledChickenBreast.png
      GrilledOnion.png
      HotDogBun.png
      Ketchup.png
      Mayonnaise.png
      ParmesanCheese.png
      PeakSauce.png
      Pickles.png
      RedOnionRings.png
      RomaineLettuce.png
      Sauerkraut.png
      SweetCorn.png
      Tomato.png
    logo/
      GMR_logo_black.png
      GMR_logo_white.png
src/
  api/
    apiClient.ts
    applicationsApi.ts
    productsApi.ts
  app/
    globals.css
    layout.tsx
    page.tsx
    providers.tsx
    [lang]/
      layout.tsx
      page.tsx
      applications/
        page.tsx
        [id]/
          contact/
            page.tsx
      training/
        page.tsx
  components/
    layout/
      Header/
  features/
    application-form/
    applications-list/
    home/
    products/
    training/
  i18n/
    config.ts
    getDictionary.ts
    dictionaries/
  store/
    combineReducers.ts
    provider.tsx
    hooks/
      useStores.ts
    reducers/
      modalStore.ts
  styles/
    tokens.css
  types/
    applications.ts
    products.ts
```

## Routing

Routes are defined with the App Router under `src/app`.

- `/` is handled by `src/app/page.tsx`.
- `/:lang` is handled by `src/app/[lang]/page.tsx`.
- `/:lang/applications` is handled by `src/app/[lang]/applications/page.tsx`.
- `/:lang/applications/:id/contact` is handled by `src/app/[lang]/applications/[id]/contact/page.tsx`.
- `/:lang/training` is handled by `src/app/[lang]/training/page.tsx`.

Localized routes use `src/app/[lang]/layout.tsx`, which validates the locale and renders the shared `Header`.

Important Next.js 16 convention in this project: route `params` are typed and awaited as `Promise<...>` in route components and layouts. Before changing route APIs, read the relevant docs in `node_modules/next/dist/docs/`.

## Application Shell

`src/app/layout.tsx` is the root layout. It:

- loads the Montserrat font with `next/font/google`;
- defines global metadata and favicon;
- imports `src/app/globals.css`;
- wraps all pages with `Providers`.

`src/app/providers.tsx` is a client component that creates a React Query `QueryClient`. Default query behavior:

- `retry: 1`
- `refetchOnWindowFocus: false`
- `staleTime: 5 minutes`

It also wraps the app with `StoreWrapper` from `src/store/provider.tsx`, making MobX stores available to client components.

## Static Assets

Static files live in `public` and are served from the site root. Do not include `public` in the runtime URL.

Examples:

- `public/favicon.png` is available as `/favicon.png`.
- `public/GROUSE-FAVICON_800-round.png` is available as `/GROUSE-FAVICON_800-round.png`.
- `public/assets/icons/icon-chef.png` is available as `/assets/icons/icon-chef.png`.
- `public/assets/logo/GMR_logo_black.png` is available as `/assets/logo/GMR_logo_black.png`.
- `public/assets/logo/GMR_logo_white.png` is available as `/assets/logo/GMR_logo_white.png`.
- `public/assets/ingredients/BeefPatty.png` is available as `/assets/ingredients/BeefPatty.png`.
- `public/assets/ingredients/GrilledBriocheBunTop.png` is available as `/assets/ingredients/GrilledBriocheBunTop.png`.

Use root-relative paths in JSX, CSS, and data objects:

```tsx
<img src="/assets/logo/GMR_logo_black.png" alt="Grouse Mountain Resort" />
```

```css
background-image: url("/assets/ingredients/BeefPatty.png");
```

For images rendered through `next/image`, pass the same root-relative path to `src`.

Asset groups:

- Root files contain favicons and default Next.js template SVG files.
- `assets/logo` contains Grouse Mountain Resort logo images.
- `assets/icons` contains reusable icon images.
- `assets/ingredients` contains ingredient/product PNG images used by food-related UI.

## Feature Modules

Feature-specific UI, hooks, data helpers, and styles are grouped under `src/features`.

### `features/home`

Owns the localized home page experience rendered by `src/app/[lang]/page.tsx`.

### `features/products`

Owns product display logic and product utility functions.

Key files:

- `components/ProductsPage.tsx`
- `components/ProductCard.tsx`
- `hooks/useProducts.ts`
- `utils/getBestProductsByType.ts`
- `utils/getBestProductsByType.test.ts`

### `features/applications-list`

Owns the applications listing page.

Key files:

- `components/ApplicationsListPage.tsx`
- `hooks/useApplications.ts`
- `utils/getValidApplications.ts`

### `features/application-form`

Owns the application contact flow.

Key files:

- `components/ApplicationContactPage.tsx`
- `components/ApplicationContactForm.tsx`
- `components/SelectedProductCard.tsx`
- `hooks/useApplication.ts`
- `schemas/applicantSchema.ts`

Form validation is dictionary-aware: validation messages are passed into `createApplicantSchema`.

### `features/training`

Owns the training page and its static training data.

Key files:

- `TrainingPage.tsx`
- `data/trainingData.ts`

## API Layer

All external API calls go through `src/api`.

`src/api/apiClient.ts` creates the shared Axios instance.

Current base URL:

```txt
https://nesto-fe-exam.vercel.app/api
```

Current shared headers:

- `Accept: application/json`
- `Content-Type: application/json`
- `X-Nesto-Candidat: Artem`

API modules expose typed functions:

- `productsApi.ts`: `getProducts`
- `applicationsApi.ts`: `createApplication`, `getApplications`, `getApplicationById`, `updateApplication`

React Query hooks should call API module functions instead of using Axios directly in components.

## Data Fetching

Client-side server state is handled through React Query.

Current query keys:

- `["products"]`
- `["applications"]`
- `["application", applicationId]`

When adding mutations, invalidate the smallest relevant query key instead of refetching unrelated data.

## Client UI State

Client-only UI state is handled through MobX under `src/store`.

Current store layout:

- `src/store/reducers/modalStore.ts` owns modal state.
- `src/store/combineReducers.ts` combines store instances into `RootStore`.
- `src/store/provider.tsx` exposes `RootStore` through React context.
- `src/store/hooks/useStores.ts` exposes the `useStores` hook.

Current `modalStore` state:

- `isOpen`: whether a modal is open.
- `name`: modal identifier.
- `payload`: optional modal data.

Current `modalStore` actions:

- `openModal(name, payload?)`
- `closeModal()`
- `setPayload(payload)`

When using observable store values inside React components, wrap the component with `observer` from `mobx-react-lite`.

## Internationalization

i18n is handled locally under `src/i18n`.

Supported locales are defined in `src/i18n/config.ts`:

- `en`
- `fr`

The default locale is `en`.

`getDictionary(locale)` returns the matching dictionary from `src/i18n/dictionaries`. Dictionary shape is inferred from the English dictionary through `Dictionary = typeof en`.

When adding user-facing text, update both `en.ts` and `fr.ts` and pass dictionary entries through route or feature props.

## Types

Shared domain types live in `src/types`.

- `types/products.ts` contains product domain types.
- `types/applications.ts` contains application and application-creation types.

Feature-local form types may live near their schema when they are not reused outside that feature.

## Styling

Global styles live in:

- `src/app/globals.css`
- `src/styles/tokens.css`

Component and feature styles currently use a mix of:

- CSS Modules, for example `*.module.css`
- SCSS files, for example `*.Styles.scss`

Prefer existing local styling patterns before introducing a new approach. Keep reusable design tokens in `tokens.css` when values are shared across features.

## Imports

The TypeScript path alias is configured in `tsconfig.json`:

```json
"@/*": ["./src/*"]
```

Use `@/*` for imports from `src` when it improves readability.

## Testing

Vitest is configured through the project dependencies and `npm test` script.

Current test coverage exists for product selection logic in:

```txt
src/features/products/utils/getBestProductsByType.test.ts
```

For new utility functions, data-shaping behavior, or business rules, add focused Vitest tests near the code under test.

## Build And Verification

Common commands:

```bash
npm run dev
npm run build
npm run lint
npm test
```

Recommended verification:

- Run `npm run lint` after TypeScript, React, route, or styling edits.
- Run `npm run build` after route, layout, metadata, or Next.js API changes.
- Run `npm test` after utility, validation, or data logic changes.

## Change Guidelines

- Read the relevant bundled Next.js docs before modifying Next.js APIs or conventions.
- Keep route files thin; delegate UI and behavior to `src/features`.
- Keep API access in `src/api`; keep components focused on rendering and user interaction.
- Keep shared domain contracts in `src/types`.
- Keep localized text in dictionaries, not hard-coded inside reusable components.
- Preserve the existing feature-based structure unless a cross-cutting abstraction is clearly needed.
