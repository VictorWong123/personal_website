---
### Task
Fix the landing page by:
1) scraping the current repo’s landing page route/component implementation, then
2) rebuilding the landing page UI to match `landing_page.json`.

### Exact steps you must follow
1. Find `landing_page.json` in the repo root (or `src/` if that’s where it is). Read it fully.
2. Find where the landing route (`/`) is defined (React Router / Next / Vite router—whatever this repo uses).
3. Open the component currently rendered for `/`. Inspect the current Tailwind classes and layout.
4. Replace the landing page markup with a clean implementation that matches the spec:
   - Left column hero:
     - hello text
     - big name line
     - paragraph
     - “Download Resume” button using accent color from JSON
   - Right column:
     - 2x2 card grid (Projects/About/Experience/Contact)
     - dark panels, border, rounded corners, centered icon + label
     - subtle hover (lift/shadow/border brighten)
5. Preserve existing link behavior:
   - If the repo uses `<Link>`, use it.
   - If not, use `<a>`.
6. Use my existing text if present; else use lorem ipsum.

### Output requirements
- Only change the minimum set of files.
- If components already exist (`NavCard`, `Hero`), reuse and fix them rather than creating duplicates.
- If those components don’t exist or are messy, create:
  - `src/components/Hero.jsx`
  - `src/components/NavCard.jsx`
and use them in the landing page component.
- Make sure `landing_page.json` is the single source for colors + labels.

### Acceptance checklist
- Landing page matches the reference layout (2-column + 2x2 cards).
- Dark theme + warm yellow CTA.
- Responsive behavior correct.
- No console errors.
- No broken imports/routes.

---
