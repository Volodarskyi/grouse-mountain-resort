# Project Architecture

This document describes the current architecture of the Grouse Mountain Resort application.

## Overview

The app is a Next.js `16.2.6` project using the App Router, React `19.2.4`, TypeScript, React Query, MobX, Axios, Ant Design, global CSS, and SCSS.

Routing lives only in `src/app`. Business page containers live in `src/pages`. Page-specific UI sections live under their owning page. Business data and logic live in `src/features`.

## Runtime Stack

- Framework: Next.js `16.2.6`
- UI runtime: React `19.2.4` and React DOM `19.2.4`
- Language: TypeScript with `strict` enabled
- Data fetching cache: `@tanstack/react-query`
- Client UI state: MobX with `mobx-react-lite`
- UI library: Ant Design `6.4.3`
- HTTP client: Axios
- Forms: `react-hook-form`
- Validation: Zod
- Styling: global CSS and SCSS
- Tests: Vitest, Testing Library, and jsdom

## Source Layout

```txt
src/
  api/
    apiClient.ts
  app/
    globals.css
    layout.tsx
    page.tsx
    providers.tsx
    [lang]/
      layout.tsx
      page.tsx
      training/
        page.tsx
  pages/
    HomePage/
      HomePage.tsx
      HomePage.Styles.scss
      sections/
        HeroSection/
          HeroSection.tsx
          HeroSection.Styles.scss
        MenuSection/
          MenuSection.tsx
          MenuSection.Styles.scss
    TrainingPage/
      TrainingPage.tsx
      TrainingPage.Styles.scss
      sections/
        HeaderSection/
          HeaderSection.tsx
          HeaderSection.Styles.scss
        SelectedIngredientsSection/
          SelectedIngredientsSection.tsx
          SelectedIngredientsSection.Styles.scss
        IngredientsSliderSection/
          IngredientsSliderSection.tsx
          IngredientsSliderSection.Styles.scss
        BottomActionsSection/
          BottomActionsSection.tsx
          BottomActionsSection.Styles.scss
  features/
    training/
      model/
        trainingData.ts
      lib/
        trainingRecipe.ts
        trainingRecipe.test.ts
  components/
  i18n/
  store/
  styles/
  types/
```

## Routing

Routes are defined with the App Router under `src/app`.

- `/` is handled by `src/app/page.tsx` and redirects to `/${defaultLocale}`.
- `/${lang}` is handled by `src/app/[lang]/page.tsx` and renders `src/pages/HomePage/HomePage.tsx`.
- `/${lang}/training` is handled by `src/app/[lang]/training/page.tsx` and renders `src/pages/TrainingPage/TrainingPage.tsx`.
- `src/app/[lang]/layout.tsx` validates the locale, loads the dictionary, and mounts the shared `Header`.

Keep route files thin. They should validate route params, load route-level data when needed, and delegate UI to `src/pages`.

Important Next.js 16 convention in this project: before changing route APIs, read the relevant version-matched docs in `node_modules/next/dist/docs/`.

## Pages And Sections

Business page containers live in `src/pages`.

Sections belong to pages. Do not create `src/sections`.

Use this structure:

```txt
src/pages/
  HomePage/
    HomePage.tsx
    HomePage.Styles.scss
    sections/
      HeroSection/
      MenuSection/
  TrainingPage/
    TrainingPage.tsx
    TrainingPage.Styles.scss
    sections/
      HeaderSection/
      SelectedIngredientsSection/
      IngredientsSliderSection/
      BottomActionsSection/
```

Each section must own its own SCSS file. Page-level SCSS should contain only page shell styles and layout concerns that do not belong to a specific section.

Page-specific UI stays in page sections. Business logic stays in features. Generic reusable UI stays in `src/components` or a future shared component folder.

## Features

Business logic belongs to `src/features`.

Preferred feature structure:

```txt
features/
  training/
    model/
    api/
    lib/
    components/
  menu/
    model/
    api/
    lib/
    components/
  orders/
    model/
    api/
    lib/
    components/
  auth/
    model/
    api/
    lib/
```

Current active feature:

- `features/training/model/trainingData.ts` stores ingredient and recipe data.
- `features/training/lib/trainingRecipe.ts` stores training business helpers such as recipe selection and ingredient chunking.

The training UI is one page section group under `src/pages/TrainingPage/sections`; it should not be placed back under `features/training`.

## Application Shell

`src/app/layout.tsx` is the root layout. It imports Ant Design reset styles and global styles, loads the Lato font with `next/font/google`, defines metadata, wraps pages with `AntdRegistry`, and renders `Providers`.

`src/app/providers.tsx` is a client component that creates the React Query `QueryClient` and wraps the app with `StoreWrapper`.

## Static Assets

Static files live in `public` and are served from the site root. Do not include `public` in runtime URLs.

Examples:

- `public/favicon.png` is available as `/favicon.png`.
- `public/assets/icons/icon-chef.png` is available as `/assets/icons/icon-chef.png`.
- `public/assets/logo/GMR_logo_black.png` is available as `/assets/logo/GMR_logo_black.png`.
- `public/assets/ingredients/BeefPatty.png` is available as `/assets/ingredients/BeefPatty.png`.

Use root-relative paths in JSX, CSS, data objects, and `next/image`.

## Components

Reusable components live under `src/components`.

`components/layout/Header` renders the Grouse Mountain logo and `EN`/`FR` language switcher. It is mounted from `src/app/[lang]/layout.tsx`.

`components/Ui/UiModals` contains the app-wide modal registry and modal shell. It is mounted once from `src/app/providers.tsx`.

## API Layer

Shared API setup lives under `src/api`.

`src/api/apiClient.ts` creates the shared Axios instance with:

- `baseURL = "placeholderForBaseURL"`
- JSON headers
- `X-Nesto-Candidat: Artem`
- `timeout: 25000`

Feature-specific API modules should live under `src/features/<feature>/api` when they are business-specific. Cross-feature API client configuration stays in `src/api`.

## State And Data

Client-side server state is handled through React Query in `src/app/providers.tsx`.

Client-only UI state is handled through MobX under `src/store`.

Current store layout:

- `src/store/reducers/modalStore.ts`
- `src/store/combineReducers.ts`
- `src/store/provider.tsx`
- `src/store/hooks/useStores.ts`

When using observable store values inside React components, wrap the component with `observer` from `mobx-react-lite`.

## Internationalization

i18n utilities are handled locally under `src/i18n`.

Supported locales:

- `en`
- `fr`

The default locale is `en`. When adding user-facing localized text, update both `src/i18n/dictionaries/en.ts` and `src/i18n/dictionaries/fr.ts`.

## Imports

Use the `@/*` TypeScript path alias for imports from `src` when it improves readability.

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Testing

Vitest is configured through the `npm test` script.

For utility functions, data-shaping behavior, or business rules, add focused tests near the code under test. The training recipe helpers are covered in `src/features/training/lib/trainingRecipe.test.ts`.

## Verification

Common commands:

```bash
npm run dev
npm run build
npm run lint
npm test
```

Recommended verification:

- Do not run `npm run lint` or `npm run build` unless explicitly requested.
- Run `npm test` after utility, validation, or data logic changes.
