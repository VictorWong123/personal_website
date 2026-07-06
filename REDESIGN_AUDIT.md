# Redesign Cleanup Audit

Date: 2026-07-06

Scope: read-only fan-out review after the redesign. Three independent passes covered source structure, generated/config/assets, and UI/UX/accessibility. This file synthesizes the results and separates observed facts from inferred cleanup.

## Highest Priority

### 1. Deploy target mismatch

Observed:
- `vite.config.js:8` builds production output to `docs`.
- `package.json:12` deploys `gh-pages -d dist`.
- `deploy.sh:13` also copies `dist/*`.
- `AGENTS.md:13` already warns that deploy target and Vite output disagree.
- `dist/` exists and appears older than `docs/`.

Risk:
- A deploy can publish stale pre-redesign output even when `npm run build` creates the correct site in `docs`.

Recommendation:
- Pick one deployment strategy. Given current GitHub Pages docs-folder setup, change deploy scripts to use `docs`, or delete the deploy script/package deploy path if deployment is handled directly from `main/docs`.
- After deciding, remove or ignore the obsolete generated folder.

### 2. Placeholder and lorem ipsum content still ships

Observed:
- `src/components/HomeIntro.jsx:13` renders lorem ipsum while real `profile.intro` and `profile.note` exist in `src/data/siteData.js:7`.
- `src/components/Header.jsx:6` and `src/components/Header.jsx:7` use remote `placehold.co` avatar images.
- `src/images/JTT_2555-min.jpg` exists but no source file imports or references it.
- `src/components/ProjectDetail.jsx:15` displays a visible `image placeholder` block, styled by `src/index.css:370`.

Risk:
- The redesign looks unfinished and lower-trust despite having real content/assets available.

Recommendation:
- Replace home lorem ipsum with `profile.intro` and optionally `profile.note`.
- Use the local profile image or remove the unused image asset.
- Add real project screenshots/images, or remove the image panel until assets exist.

### 3. Project card interaction is not clean accessible UI

Observed:
- `src/components/ProjectItem.jsx:19` makes an `<article>` clickable with `role="button"` and `tabIndex={0}`.
- `src/components/ProjectItem.jsx:30` nests an external `<a>` inside that clickable article.
- Global focus styles in `src/index.css:60` cover only `a:focus-visible` and `button:focus-visible`, not focusable project cards.

Risk:
- Keyboard users may not see focus on project cards.
- Nested interactive behavior can confuse screen readers and users: card opens the modal, title link opens GitHub.

Recommendation:
- Make the card trigger a real `<button>` or restructure so only one interactive target exists.
- Move external project links into the detail modal.
- Add visible focus styles for whichever card interaction pattern remains.

### 4. Project modal is visually present but incomplete as a dialog

Observed:
- `src/components/ProjectDetail.jsx:7` uses `role="dialog"` and `aria-modal="true"`.
- No Escape close, focus trap, initial focus, or focus return behavior is visible in `ProjectDetail` or `ProjectList`.

Risk:
- Screen reader and keyboard users can lose context or tab behind the modal.

Recommendation:
- Add Escape-to-close.
- Move focus into the dialog when opened and return focus to the launching card when closed.
- Trap focus while the modal is open, or use a small accessible dialog helper if this grows.

## Legacy Or Stale Code Candidates

### Root prompt/spec artifacts

Observed:
- `prompt.md`, `instructions.md`, `landing_page.json`, and `specs.json` are not imported by `src`.
- `instructions.md:5` refers to rebuilding a landing page from `landing_page.json`.
- `prompt.md:1` treats `specs.json` as source of truth.
- Runtime content now lives in `src/data/siteData.js`.

Inference:
- These look like one-off redesign inputs rather than app code.

Recommendation:
- Delete them if they are no longer needed, or move them into a clearly named archive/docs folder so they are not confused with runtime source.

### Unused dependencies

Observed:
- `package.json` lists `gsap`, `motion`, and `ogl`.
- Source search found no imports/usages of those packages under `src`.
- `tailwindcss-cli` is present alongside Tailwind v4/PostCSS setup and does not appear used by scripts.

Inference:
- These are likely leftovers from redesign experiments or previous animation/3D work.

Recommendation:
- Remove unused packages after confirming no near-term plan depends on them.

### Legacy redirects

Observed:
- `src/App.jsx:17` redirects `/about` and `/contact` to `/`.
- `src/App.jsx:19` redirects capitalized `/Experience` to `/work`.
- Current primary nav only exposes `/`, `/work`, and `/projects`.

Inference:
- These may be intentional backward-compatible URLs, but they are legacy from the old information architecture.

Recommendation:
- Keep them only if old inbound links matter. Otherwise remove or document why they exist.

### Generated output churn

Observed:
- `docs/assets` has deleted old hashed files and new untracked hashed files after the redesign build.
- `dist/` still exists with older assets.

Recommendation:
- Commit only the intended generated output folder.
- Delete stale generated files as part of the same cleanup once deploy target is decided.

## Code Quality Improvements

### Broken 404 accessibility label

Observed:
- `src/pages/ThemedNotFound.jsx:6` sets `aria-labelledby="not-found-heading"`.
- `src/components/SectionHeading.jsx:3` does not accept an `id` prop, and `src/components/SectionHeading.jsx:6` renders `<h1>` without an id.

Risk:
- The `aria-labelledby` points to a missing element.

Recommendation:
- Add an optional `id` prop to `SectionHeading` and pass `id="not-found-heading"`, or remove the wrapper `aria-labelledby`.

### Data exists but is not rendered

Observed:
- `src/data/siteData.js:22` and `src/data/siteData.js:29` include work descriptions.
- `src/components/WorkItem.jsx:5` to `src/components/WorkItem.jsx:7` renders date, title/company, and tech only.

Recommendation:
- Render descriptions if the work page should communicate impact.
- If the minimalist redesign intentionally hides descriptions, remove unused fields from data to reduce drift.

### Copy-to-clipboard fallback is silent

Observed:
- `src/components/CopyEmailButton.jsx:12` catches clipboard failure and only resets copied state.

Risk:
- Users on browsers/contexts without clipboard permission get no useful fallback.

Recommendation:
- On failure, reveal the email address or turn the control into a `mailto:` link fallback.

### Component split may be more complex than current needs

Observed:
- `ProjectList` coordinates `FeaturedProjects`, `AllProjectsGrid`, `ProjectItem`, and `ProjectDetail`.
- `FeaturedProjects` and `AllProjectsGrid` mostly pass data into the same item component.

Inference:
- This is not broken, but may be more abstraction than the current small project list needs.

Recommendation:
- Leave it if more project layouts are planned. Otherwise consider consolidating the project grid/list wrappers once behavior stabilizes.

## UI/UX Improvements

### Text contrast is weak

Observed:
- `src/index.css:4` defines `--color-bg: #f7f6f2`.
- `--color-secondary: #8a8178` is about `3.54:1` against the background.
- `--color-muted: #b8aea3` is about `2.02:1`.
- `--color-accent: #1a9b50` is about `3.32:1`.
- These colors are used for normal-size nav/footer/body/meta text in `src/index.css:200`, `src/index.css:257`, `src/index.css:436`, and `src/index.css:458`.

Risk:
- Several normal text uses likely fail WCAG contrast guidance.

Recommendation:
- Darken secondary, muted, and accent text colors. Keep the light palette, but use the palest color only for non-essential decoration.

### Footer label conflicts with nav

Observed:
- `src/components/PrimaryNav.jsx:5` labels `/` as `home`.
- `src/components/Footer.jsx:8` labels `/` as `about`.

Recommendation:
- Use one label consistently, or make the footer link point to a true about section if one returns.

### Mobile layout is guarded but narrow

Observed:
- `src/index.css:534` caps mobile `h1` at `max-width: 310px`.
- `src/index.css:552` to `src/index.css:563` also caps intro/projects/modal width at `310px`.

Inference:
- This avoids overflow but may leave unnecessary unused horizontal space on wider phones.

Recommendation:
- Prefer `max-width: 100%` inside the already constrained `.site-shell`, or use a slightly more fluid value such as `min(100%, 360px)`.

## Suggested Cleanup Order

1. Fix deploy target mismatch before any publish.
2. Replace visible placeholders and lorem ipsum.
3. Fix project card/modal accessibility.
4. Clean stale generated output and unused dependencies.
5. Decide whether root prompt/spec files and legacy redirects should stay.
6. Polish contrast, footer label consistency, and mobile width constraints.

## Notes

- No obviously unused `src/components/*.jsx` files were found. Current component files all appear referenced by routes, pages, or other components.
- No test framework is configured. The minimum verification after cleanup should be `npm run build` plus manual checks of `/`, `/work`, `/projects`, the project modal, and the 404 route.
