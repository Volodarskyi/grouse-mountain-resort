<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Notes

## Stack
- Next.js `16.2.6` with App Router under `src/app`.
- React `19.2.4` and React DOM `19.2.4`.
- TypeScript `^5` with `strict` enabled and `moduleResolution: "bundler"`.
- React Query `@tanstack/react-query` `^5.100.9` is configured in `src/app/providers.tsx`.
- MobX `^6.16.1` and `mobx-react-lite` `^4.1.1` are configured through `src/store`.
- Ant Design `^6.4.3` is registered in `src/app/layout.tsx` with `@ant-design/nextjs-registry` `^1.3.0`, and `antd/dist/reset.css` is imported globally.
- Axios `^1.16.0` is available through the shared client in `src/api/apiClient.ts`.
- Forms and validation dependencies are installed: `react-hook-form` `^7.75.0`, `@hookform/resolvers` `^5.2.2`, and `zod` `^4.4.3`. There are no current form feature modules in `src/features`.
- Styling uses global CSS, SCSS (`sass` `^1.100.0`), and an unused legacy CSS Module file in `src/components/layout/Header/Header.module.css`.
- Tests use Vitest `^4.1.5`; Testing Library and jsdom are installed for React test support.
- Formatting/lint dependencies include ESLint `^9`, `eslint-config-next` `16.2.6`, `eslint-config-prettier` `^10.1.8`, and Prettier `^3.8.3`.

## Commands
- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Build production bundle: `npm run build`
- Lint: `npm run lint`
- Run tests: `npm test`

## Architecture Reference
- Read `docs/architecture.md` before changing project structure, routes, API access, i18n, feature boundaries, static assets, or shared types.
- Keep detailed architecture notes in `docs/architecture.md`; keep this file focused on operating rules for agents.
- If the source tree and `docs/architecture.md` disagree, inspect the current source first and update the docs as part of the change.

## Current Source Layout
- `src/app` contains the root App Router shell: `layout.tsx`, `page.tsx`, `providers.tsx`, and `globals.css`.
- `src/app/page.tsx` redirects `/` to `/${defaultLocale}`. At the time of this update, localized route folders such as `src/app/[lang]` are not present, so localized pages must be added before `/en` or `/fr` can render.
- `src/app/layout.tsx` loads the Lato font with `next/font/google`, imports Ant Design reset styles, wraps children in `AntdRegistry`, and then renders `Providers`.
- `src/app/providers.tsx` is a client component that creates a React Query `QueryClient` and wraps the app in `StoreWrapper`.
- `src/components/layout/Header/Header.tsx` is a client component for logo/navigation language switching, but it is not currently mounted by any route in `src/app`.
- `src/features/home` contains `HomePage.tsx` and `HomePage.Styles.scss`. It links to `/${lang}/training`, but no localized training route currently exists.
- `src/features/training` contains `TrainingPage.tsx`, `TrainingPage.Styles.scss`, and `data/trainingData.ts`. It is a client-side recipe/ingredient training UI using Ant Design `Carousel` and `Modal`.
- `src/i18n` contains locale config, dictionary lookup, and `en`/`fr` dictionaries. Some dictionary content still refers to the earlier mortgage/application domain.
- `src/store` contains MobX root-store wiring, `StoreWrapper`, `useStores`, and `modalStore`.
- `src/types` contains shared product/application domain types that are currently not wired to active routes or API modules.
- `src/api/apiClient.ts` exports a shared Axios instance with `baseURL = "placeholderForBaseURL"`, JSON headers, `X-Nesto-Candidat: Artem`, and `timeout: 25000`.
- `public` contains favicons, default Next SVG template assets, Grouse Mountain logo PNGs, icon images, and ingredient PNG assets.

## Repository Conventions
- Use the `@/*` TypeScript path alias for imports from `src`.
- Keep routes in `src/app`; add localized pages under `src/app/[lang]` when locale-aware routing is restored.
- Supported locales are defined in `src/i18n/config.ts`; currently `en` and `fr`, with `en` as `defaultLocale`.
- Keep feature code grouped under `src/features/<feature-name>`.
- Keep MobX stores under `src/store/reducers` and expose them through `src/store/combineReducers.ts`.
- Use `src/store/hooks/useStores.ts` to access stores from client components. It currently returns `useContext(StoreContext)`, and `StoreContext` has `RootStore` as its default value.
- Keep shared API clients under `src/api` and shared types under `src/types`.
- Prefer the existing global CSS/SCSS patterns before introducing another styling approach. The active Header styling is `Header.Styles.scss`; `Header.module.css` is legacy/unused unless a component imports it.
- Static assets in `public` must be referenced with root-relative URLs, for example `/assets/logo/GMR_logo_white.png` or `/assets/ingredients/BeefPatty.png`.
- When adding user-facing localized text, update both `src/i18n/dictionaries/en.ts` and `src/i18n/dictionaries/fr.ts`.

## Verification
- For UI or routing changes, run `npm run lint` and `npm run build` when practical.
- For utility or data-shaping changes, add or update focused Vitest coverage and run `npm test`.
- Before changing any Next.js API usage, read the relevant version-matched docs in `node_modules/next/dist/docs/`.
