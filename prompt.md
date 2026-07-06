Refactor and restyle my existing personal website using `specs.json` as the source of truth.

Important implementation rules:
1. Ignore the current visual styling completely, including existing colors, typography, spacing, borders, shadows, and layout decisions.
2. Do not throw away working functionality. Reuse existing components, routes, data models, content, links, forms, and integrations whenever they already exist.
3. Before creating a new component, search the codebase for an existing component that serves the same purpose. Reuse and restyle it instead of duplicating it.
4. Use the personal information, experience, project names, links, and descriptions already present in the website. Do not invent facts about me.
5. Where content is genuinely missing, use short lorem ipsum placeholder copy.
6. Replace the inspiration site's “writing” navigation item and section with “projects.”
7. The final navigation should be: `home`, `work`, `projects`.
8. Match the reference direction: warm off-white background, black monospace text, muted taupe secondary text, green active underline, restrained spacing, and a narrow editorial layout.
9. Do not add cards, gradients, shadows, glass effects, large illustrations, or unnecessary animations.
10. Preserve responsive behavior and improve it where needed. The site must work well on mobile, tablet, and desktop.
11. Preserve accessibility: semantic HTML, keyboard navigation, visible focus states, correct heading order, `aria-current` for active navigation, and sufficient contrast.
12. Use the project's existing styling system if practical, but replace its design tokens with those in `specs.json`. If the current styling architecture makes the redesign harder, simplify it without changing the framework.
13. Remove dead styles and unused visual components after the new design is working.
14. Run the project's available lint, type-check, test, and build commands. Fix errors caused by the refactor.

Suggested process:
- Inspect the repository structure and identify the current layout, navigation, home/about content, work/experience section, projects section, and footer.
- Map existing components to the component roles described in `specs.json`.
- Introduce shared design tokens for color, typography, spacing, borders, and breakpoints.
- Restyle the global page shell and typography first.
- Restyle the header/navigation, then the home intro, work list, projects list, and footer.
- Verify every existing internal and external link still works.
- Delete obsolete CSS only after confirming it is no longer referenced.

The result should feel like a personal technical notebook: minimal, thoughtful, precise, and content-first. Do not copy the friend's name or wording from the reference image.