<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Notes

## Stack
- Next.js `16.2.6` with App Router under `src/app`.
- React `19.2.4` and TypeScript with `strict` enabled.
- React Query is configured in `src/app/providers.tsx`.
- MobX is configured through `src/store` and is used for client UI state.
- Forms use `react-hook-form`, `@hookform/resolvers`, and `zod`.
- Tests use Vitest.

## Commands
- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Build production bundle: `npm run build`
- Lint: `npm run lint`
- Run tests: `npm test`

## Architecture Reference
- Read `docs/architecture.md` before changing project structure, routes, API access, i18n, feature boundaries, static assets, or shared types.
- Keep detailed architecture notes in `docs/architecture.md`; keep this file focused on operating rules for agents.

## Repository Conventions
- Use the `@/*` TypeScript path alias for imports from `src`.
- Keep routes in `src/app`; localized pages live under `src/app/[lang]`.
- Supported locales are defined in `src/i18n/config.ts`; currently `en` and `fr`.
- Keep feature code grouped under `src/features/<feature-name>`.
- Keep MobX stores under `src/store/reducers` and expose them through `src/store/combineReducers.ts`.
- Keep shared API clients under `src/api` and shared types under `src/types`.
- Prefer the existing CSS Modules and SCSS patterns before introducing another styling approach.

## Verification
- For UI or routing changes, run `npm run lint` and `npm run build` when practical.
- For utility or data-shaping changes, add or update focused Vitest coverage and run `npm test`.
- Before changing any Next.js API usage, read the relevant version-matched docs in `node_modules/next/dist/docs/`.
