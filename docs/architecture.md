# Project Architecture

This document describes the current architecture of the Grouse Mountain Resort application.

## Overview

The app is a Next.js `16.2.6` project using the App Router, React `19.2.4`, TypeScript, React Query, MobX, Axios, Ant Design, CSS, and SCSS.

The current source tree is small. The root app shell is in `src/app`, feature UI is in `src/features`, client state is in `src/store`, local i18n utilities are in `src/i18n`, and static images live in `public`.

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
public/
  favicon.png
  file.svg
  globe.svg
  GROUSE-FAVICON_800-round.png
  next.svg
  vercel.svg
  window.svg
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
  app/
    globals.css
    layout.tsx
    page.tsx
    providers.tsx
  components/
    layout/
      Header/
        Header.module.css
        Header.Styles.scss
        Header.tsx
  features/
    home/
      HomePage.Styles.scss
      HomePage.tsx
    training/
      TrainingPage.Styles.scss
      TrainingPage.tsx
      data/
        trainingData.ts
  i18n/
    config.ts
    getDictionary.ts
    dictionaries/
      en.ts
      fr.ts
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
- `src/app/page.tsx` redirects to `/${defaultLocale}`.

Current limitation: `src/app/[lang]` does not exist at the time of this update, so `/en` and `/fr` are not implemented even though the root page redirects to `/en`.

The `HomePage` and `Header` components are already written to accept a locale and generate localized links, but they are not currently mounted by route files. Add localized route files before relying on these components in production navigation.

Important Next.js 16 convention in this project: before changing route APIs, read the relevant version-matched docs in `node_modules/next/dist/docs/`.

## Application Shell

`src/app/layout.tsx` is the root layout. It:

- imports `antd/dist/reset.css`;
- imports `src/app/globals.css`;
- loads the Lato font with `next/font/google`;
- defines global metadata and favicon;
- wraps all pages with `AntdRegistry`;
- renders the shared `Providers` component.

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

Use root-relative paths in JSX, CSS, and data objects:

```tsx
<img src="/assets/logo/GMR_logo_black.png" alt="Grouse Mountain Resort" />
```

```css
.ingredient-card {
  background-image: url("/assets/ingredients/BeefPatty.png");
}
```

For images rendered through `next/image`, pass the same root-relative path to `src`.

Asset groups:

- Root files contain favicons and default Next.js template SVG files.
- `assets/logo` contains Grouse Mountain Resort logo images.
- `assets/icons` contains reusable icon images.
- `assets/ingredients` contains ingredient PNG images used by the training UI.

## Feature Modules

Feature-specific UI, data helpers, and styles are grouped under `src/features`.

### `features/home`

Owns the home page UI component. It accepts `lang: string` and currently links to `/${lang}/training`.

Key files:

- `HomePage.tsx`
- `HomePage.Styles.scss`

Current limitation: this feature is not mounted by an App Router page.

### `features/training`

Owns the training game UI and static recipe/ingredient data.

Key files:

- `TrainingPage.tsx`
- `TrainingPage.Styles.scss`
- `data/trainingData.ts`

The training UI is client-side, uses Ant Design `Carousel` and `Modal`, renders ingredient images through `next/image`, and checks selected ingredients against a randomly chosen recipe.

Current limitation: this feature is not mounted by an App Router page.

## Components

### `components/layout/Header`

`Header.tsx` is a client component that renders the Grouse Mountain logo and an `EN`/`FR` language switcher. It uses `usePathname` and `useRouter` from `next/navigation` to replace the current locale segment in the path.

Active styling is in `Header.Styles.scss`. `Header.module.css` exists but is not imported by `Header.tsx`.

Current limitation: this component is not mounted by an App Router layout or page.

## API Layer

All shared API setup should live under `src/api`.

`src/api/apiClient.ts` creates the shared Axios instance.

Current base URL:

```txt
placeholderForBaseURL
```

Current shared headers:

- `Accept: application/json`
- `Content-Type: application/json`
- `X-Nesto-Candidat: Artem`

Current timeout:

```txt
25000 ms
```

There are no current feature API modules such as `productsApi.ts` or `applicationsApi.ts`. Add typed API modules under `src/api` when features need remote data.

## Data Fetching

Client-side server state is handled through React Query. The `QueryClientProvider` is installed in `src/app/providers.tsx`.

There are no active React Query hooks or query keys in the current source tree.

When adding queries or mutations, keep API calls in `src/api`, wrap feature-specific query hooks in the relevant `src/features/<feature>/hooks` folder, and invalidate the smallest relevant query key.

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

`useStores.ts` currently returns `useContext(StoreContext)`. `StoreContext` is created with `RootStore` as its default value, so the hook returns the root store object even outside `StoreWrapper`.

When using observable store values inside React components, wrap the component with `observer` from `mobx-react-lite`.

## Internationalization

i18n utilities are handled locally under `src/i18n`.

Supported locales are defined in `src/i18n/config.ts`:

- `en`
- `fr`

The default locale is `en`.

`getDictionary(locale)` returns the matching dictionary from `src/i18n/dictionaries`. Dictionary shape is inferred from the English dictionary through `Dictionary = typeof en`.

Current limitation: dictionaries still contain mortgage/application/product copy from an earlier domain, and no localized App Router pages currently consume them.

When adding user-facing text, update both `en.ts` and `fr.ts` and pass dictionary entries through route or feature props.

## Types

Shared domain types live in `src/types`.

- `types/products.ts` contains product domain types from the earlier mortgage product flow.
- `types/applications.ts` contains application and application-creation types from the earlier mortgage application flow.

Current limitation: these types are not used by active route files or feature modules.

## Styling

Global styles live in:

- `src/app/globals.css`
- `src/styles/tokens.css`

Component and feature styles currently use SCSS files with BEM-style class names, for example:

- `Header.Styles.scss`
- `HomePage.Styles.scss`
- `TrainingPage.Styles.scss`

`Header.module.css` is present but unused.

Prefer existing local styling patterns before introducing a new approach. Keep reusable design tokens in `tokens.css` when values are shared across features.

## Imports

The TypeScript path alias is configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Use `@/*` for imports from `src` when it improves readability.

## Testing

Vitest is configured through the project dependencies and `npm test` script.

There are no current test files in `src`.

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
