# Repository Guidelines

## Project Overview

This repository is a Vite + React personal portfolio site. It uses React Router for page routing, Tailwind utility classes for styling, and static content/data in JavaScript modules. Keep changes small, visual, and consistent with the current portfolio tone.

## Project Structure

- `src/main.jsx` mounts the React app.
- `src/App.jsx` defines the route tree.
- `src/pages/` contains page-level route views.
- `src/components/` contains reusable UI components.
- `src/data/siteData.js` stores portfolio content used by the UI.
- `src/images/` stores imported image assets.
- `src/index.css` contains global Tailwind and site styles.
- `public/` contains static files copied directly by Vite, including the resume PDF.
- `dist/` is generated production output from `npm run build`.
- `docs/` contains older/static deployment artifacts. Do not hand-edit generated files unless the task explicitly targets deployed output.

## Commands

- `npm install` installs dependencies from `package-lock.json`.
- `npm run dev` starts the Vite dev server. The configured port is `3000`.
- `npm run build` creates the production build in `dist/`.
- `npm run preview` serves the built app locally for production-style verification.
- `npm run deploy` runs the build and publishes `dist/` through `gh-pages`.

## Coding Style

- Use ES modules and React functional components.
- Name component files in PascalCase, for example `ProjectItem.jsx`.
- Use camelCase for local variables, hooks, and handlers.
- Match the existing style: 4-space indentation, single-quoted imports/strings, and concise JSX.
- Prefer Tailwind utility classes for layout and visual styling.
- Keep page composition in `src/pages/`; move reusable behavior and markup into `src/components/`.
- Keep portfolio content updates in `src/data/siteData.js` unless a structural UI change is needed.

## UI Guidelines

- Preserve the current clean portfolio design language.
- Use real project, work, education, and contact content from `siteData.js`; avoid duplicating hard-coded content in components.
- Check responsive behavior for home, projects, work, and not-found routes when changing layout or navigation.
- Avoid adding heavy animation or new visual systems unless the task specifically calls for it.

## Testing And Verification

No automated test framework is configured. For code changes:

- Run `npm run build` before finishing.
- Use `npm run dev` or `npm run preview` for manual checks when changing UI, routes, assets, or content.
- For responsive UI changes, check at least one desktop width and one mobile width.
- If tests are added later, prefer Vitest + React Testing Library and name files `*.test.jsx`.

## Deployment Notes

The current Vite build output is `dist/`, and `npm run deploy` publishes `dist/` with `gh-pages`. `vite.config.js` currently sets `base: '/'`; confirm the target host before changing `base`, `homepage`, `vercel.json`, or deploy scripts.

## Git And Pull Requests

- Keep commits focused with short imperative summaries.
- Include screenshots or a clear visual summary for UI changes.
- Mention build verification in pull requests.
- Call out deployment-impacting changes, especially changes to `vite.config.js`, `package.json`, `vercel.json`, `public/`, `dist/`, or `docs/`.

## Agent Instructions

- Before editing, check `git status --short` and preserve unrelated user changes.
- Prefer direct, scoped edits that follow existing React/Tailwind patterns.
- Do not manually edit generated build output unless explicitly requested.
- Do not introduce new dependencies for simple UI or content changes.
- If a dependency is necessary, explain why and update `package-lock.json` through `npm install`.
- Use `rg` or `rg --files` for repository search.
- Run `npm run build` after implementation unless the change is documentation-only.
- For documentation-only changes, no build is required.
