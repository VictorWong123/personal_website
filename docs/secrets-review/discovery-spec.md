# Secrets discovery redesign

## Task contract

Replace the conventional Home / Works / About composition at `/secrets` with a point-and-click 3D discovery experience. The scene is the primary interface. Visitors click or tap objects to investigate them and uncover portfolio information. The main portfolio remains the simple, direct presentation.

The optional interaction preference is pending; point-and-click is the stated default. Free movement is outside this implementation unless the user selects it.

## Behavior

- Begin with a composed overview in which the robot, dog, projector and contact beacon are identifiable. No full biography, project article or conventional section navigation is displayed initially.
- Robot: focus the character and reveal a dossier with biography, experience, education and skills, using further disclosures or file tabs.
- Projector: travel to the archive, choose a project, update its holographic preview and inspect its details. Every canonical project remains reachable.
- Dog: react using existing clips and reveal the factual personal note.
- Beacon: travel to the contact station and reveal email, profile links and résumé.
- Use real 3D hit targets plus world-attached native HTML labels/buttons. Hover/focus feedback and generous tap targets make objects discoverable. A compact field guide provides equivalent keyboard access; it must not become another dominant section menu.
- A contextual, accessible information window opens after the corresponding focus/travel completes. Close/Escape restores exploration and sensible focus. Rapid target changes, closing during travel and stale animation callbacks must remain safe.
- Show a brief interaction hint and an unobtrusive discovered-target count. This is orientation, not a gate: all information can be opened in any order.
- Keep an always-accessible Exit link. Reduced motion gives immediate access; WebGL/model failure exposes the same information through HTML controls.

## Scope and constraints

Own changes under `src/secrets`, its focused tests and review documentation. Preserve `src/App.jsx` route isolation, main route components/styles, `src/data/siteData.js`, existing URLs and résumé. Reuse all accepted Blender exports, walking/following logic, camera easing, projector effects and image provenance. A lightweight code-native beacon/interaction rings are permitted; no new model downloads, dependencies or paid API calls.

Maintain static lighting memoization, shader preparation, lazy unused captures, DPR limits and hidden-tab suspension. Use low-poly interaction proxies, no per-frame React state and no costly postprocessing. Desktop and iPad portrait/landscape are primary targets.

## Acceptance evidence

Review the initial overview and every discovery at desktop and both iPad orientations. Demonstrate clicking an actual scene object, touching a labelled target, keyboard selection, closing and returning, project switching and rapid target changes. Verify failure fallback, reduced motion, focus handling, no initial article layout and no model requests on the main homepage. Run scoped unit tests, typecheck, lint, Playwright and production build. Measure actual rendered frames after integration and report hardware/emulation limits honestly.

Keep final screenshots and a concise verification record. Remove temporary builds and diagnostic artifacts and stop task-owned servers when finished. No deployment is authorized by this task.
