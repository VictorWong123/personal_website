# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + React personal portfolio site. Application code lives in `src/`, with route setup in `src/App.jsx`, page-level views in `src/pages/`, reusable UI in `src/components/`, global styles in `src/index.css`, and image assets in `src/images/`. Static public files belong in `public/`. The `docs/` directory is the GitHub Pages build output configured by `vite.config.js`; avoid hand-editing generated files there unless intentionally patching deployed output. Root JSON files such as `landing_page.json` and `project_UI.json` hold content/design data.

## Build, Test, and Development Commands

- `npm install` installs project dependencies from `package-lock.json`.
- `npm run dev` starts the Vite development server on port `3000`.
- `npm run build` creates the production build in `docs/` and copies resume PDFs as configured in `package.json`.
- `npm run preview` serves the built app locally for a production-style check.
- `npm run deploy` publishes the `dist/` directory through `gh-pages`; confirm this matches the intended deploy target before using it, because Vite currently builds to `docs/`.

## Coding Style & Naming Conventions

Use ES modules and React functional components. Keep component files in PascalCase, such as `Hero.jsx` or `AllProjects.jsx`, and use camelCase for local variables, hooks, and handlers. Follow the existing JSX style: 4-space indentation, single quotes in imports/strings, Tailwind utility classes for layout and styling, and concise inline SVG only for icons. Prefer placing shared UI behavior in `src/components/` and page composition in `src/pages/`.

## Testing Guidelines

No automated test framework is currently configured. For changes, at minimum run `npm run build` and manually check the impacted routes with `npm run dev` or `npm run preview`. If tests are added, use a React-friendly stack such as Vitest + React Testing Library, name files `*.test.jsx`, and colocate them next to the component or page they cover.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `added WriteLight project to website` and `reordered sections`. Keep commits focused and describe the visible change. Pull requests should include a brief summary, screenshots for UI changes, build verification, and any deployment notes, especially when touching `vite.config.js`, `package.json`, `docs/`, or resume assets.

## Agent-Specific Instructions

Before editing, check whether generated output or user changes already exist and preserve unrelated work. Prefer small, scoped changes that match the current React/Tailwind structure.
