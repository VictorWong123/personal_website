---
## 0) Purpose
These rules ensure the UI stays visually consistent, components stay modular/reusable, and frontend code follows security + best practices.



## 1) Theme consistency (non-negotiable)
### 1.1 Single source of truth
- All colors, radii, shadows, spacing tokens, and typography decisions must come from a single theme source.
- Prefer: `src/ui/theme.json` (or `landing_page.json` / `theme.json` if already used).
- Do NOT hardcode new hex colors in JSX. If a new color is required, add it to the theme source first.

### 1.2 CSS variables + Tailwind usage
- Theme colors must be exposed as CSS variables (scoped to page/layout when possible):
  - Example: `--bg`, `--panel`, `--border`, `--text`, `--muted`, `--accent`
- Tailwind must reference variables using arbitrary values:
  - `bg-[var(--bg)]`, `text-[var(--text)]`, `border-[var(--border)]`, `bg-[var(--accent)]`
- If the repo already uses a different token system, follow it, but keep “one source of truth.”

### 1.3 No style drift
Before introducing a new component style:
- Search the codebase for an existing component that already matches (Card, Button, SectionHeader).
- Reuse or extend it; do not create a near-duplicate.



## 2) Modularity and component architecture
### 2.1 Composition over duplication
- Prefer small, composable components: `Section`, `Card`, `Button`, `IconBadge`, `TagPill`.
- Avoid page-specific one-off components unless necessary. If page-specific, keep them in:
  - `src/pages/<PageName>/components/*`

### 2.2 Clear boundaries
- Presentational components must not fetch data.
- Page components orchestrate data + layout.
- Reusable UI components accept props and never import page-specific data.

### 2.3 API design for components
- Components must have a clean, minimal prop API.
- Prefer:
  - `variant` props for style variants (e.g., Button: `primary`, `ghost`)
  - `asChild` / `as` patterns only if already in the repo
- Avoid prop explosion; if more than ~8 props, consider grouping config objects.

### 2.4 File organization (preferred)
- `src/components/ui/*` for generic UI primitives
- `src/components/*` for app-shared composed components
- `src/pages/*` for route-level components and page-only pieces

### 2.5 Remove dead code
- Do not leave unused components, unused imports, or unused theme keys.
- If a refactor makes something obsolete, delete it.



## 3) Security & safety best practices (frontend)
### 3.1 No secrets in the client
- Never commit API keys, tokens, service credentials, or private endpoints.
- All secrets must come from environment variables and only be used server-side.
- If a feature requires a secret, implement a server proxy endpoint (or mark as TODO if backend not in scope).

### 3.2 XSS prevention
- Do not use `dangerouslySetInnerHTML` unless explicitly required.
- If rendering user-provided content:
  - sanitize it (only if a sanitizer is already in the repo)
  - otherwise render as plain text
- Never inject raw HTML from query params, localStorage, or external APIs.

### 3.3 URL / navigation safety
- Validate and normalize external links.
- For external `<a>` links: use `rel="noreferrer noopener"` and `target="_blank"` where appropriate.
- Never construct URLs from untrusted input without validation.

### 3.4 Storage safety
- Do not store sensitive information in localStorage/sessionStorage.
- If storing any user state, store only non-sensitive, minimal data.

### 3.5 Dependency discipline
- Do not add new dependencies unless strictly necessary.
- If adding a dependency:
  - justify it in a short comment
  - prefer small, well-maintained packages
  - avoid large UI kits that conflict with Tailwind

## 4) Performance & UX standards
### 4.1 Avoid unnecessary re-renders
- Use memoization only when needed; do not prematurely optimize.
- Keep derived values computed locally (or memoize when expensive).

### 4.2 Images & assets
- Use responsive images where applicable.
- Avoid huge images on the landing/projects grid.
- Prefer lazy loading if the repo supports it.

### 4.3 Motion
- Respect `prefers-reduced-motion`.
- Keep hover animations subtle and consistent.
- Don’t introduce heavy animation libraries unless already present.


## 5) Accessibility (required)
- One `h1` per page, logical heading order.
- All interactive elements keyboard accessible.
- Visible `focus-visible` states.
- Buttons must be `<button>` when performing actions; links for navigation.
- Do not rely on color alone to convey meaning.



## 6) Testing & correctness
- If the repo has tests, update/add minimal tests for critical helpers.
- Run type-safe patterns even in JS: validate inputs, handle null/undefined.



## 7) Code quality (required)
- Keep code readable and consistent with repo conventions.
- Prefer early returns and small helpers.
- Use clear naming; no “magic numbers” without context.
- Include short comments only where they clarify non-obvious logic.



## 8) Change discipline (how to work)
### 8.1 Read-first
Before editing:
- Locate the exact files used by the route/component.
- Identify existing primitives to reuse (Card/Button/etc).

### 8.2 Minimal surface area
- Only modify files necessary to achieve the change.
- Don’t refactor unrelated code “for cleanliness.”

### 8.3 Final checklist
After changes:
- No console errors
- Theme tokens used consistently (no new stray hex colors)
- Components are reusable and not duplicated
- External links safe
- Reduced-motion respected where motion exists

---