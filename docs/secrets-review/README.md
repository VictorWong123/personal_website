# Secrets discovery world

`/secrets` is a point-and-click 3D easter egg, separate from the main portfolio. The overview contains four discoverable objects instead of page sections. Click a model or its world label; the robot and dog travel between destinations and the camera frames the selected subject. A compact field guide provides equivalent native HTML controls for keyboard use and model/WebGL failure.

| Object | Discovery |
| --- | --- |
| Hooded robot | Biography, experience, education, and skills records |
| Projector | All 13 canonical projects; selection updates the hologram and project details |
| Dog | Companion reaction and Victor's personal note |
| Contact beacon | Email, LinkedIn, GitHub, and résumé |

Discoveries open in a native dialog with Escape/close behavior and restored focus. Desktop windows sit beside the scene. iPad windows use bottom sheets while the camera keeps the subject above them. The scene stays full height, including during project selection. Discovery progress lasts for the current visit and never gates content. The name in the top-left returns to the overview; Exit returns to the main portfolio.

Content comes from `src/data/siteData.js`; existing project/work routes and the résumé URL are preserved. Main portfolio page components and styles are unchanged. The experience and its models load only on `/secrets`.

## Implementation and assets

`src/secrets/runtime/discoveryTargets.js` maps objects to destinations. `experienceState.js` owns loading, introduction, travel, arrival, and the active discovery. Journey identifiers prevent stale arrivals from replacing a newer selection. Reduced motion reveals discoveries immediately. The field guide continues to expose the same content if the scene fails.

The manifest is `src/secrets/runtime/assetManifest.js`. Models use meters, Y up, +Z forward, and ground-level soles. Locomotion is in place: world movement is separate from skeletal playback. Hero full-cycle strides are 0.88m (walk) and 1.10m (run); dog strides are 0.27m and 0.38m.

Editable Blender sources, generators, maps, clean-export evidence, and saved Emanuel Lorenzo reference captures are in the sibling `3d-portfolio` production repository (`assets/hero`, `assets/dog`, `assets/environment`, `docs/reference`). All three packages passed review before being copied to `public/secrets/models`. They total **3,968,684 bytes**, including embedded maps. Authentic project captures have provenance in `3d-portfolio/assets/project-captures/README.md`. The interaction redesign reuses these assets and adds only a small procedural beacon and hover rings; no new dependency, paid API, or downloaded asset pack was needed.

Shader programs prepare through `compileAsync` before scene readiness. Synchronous setup failures and promise rejections reach the HTML fallback. Static studio lighting is memoized, unused project captures are deferred, DPR is capped at 1.5 for desktop/iPad, reduced-motion idle rendering stops, and document visibility suspends the render loop. Hover feedback uses simple geometry, not an outline postprocessing pass.

## Verification

```sh
npm run test:secrets
npm run typecheck:secrets
npm run lint:secrets
npm run test:e2e
npm run build -- --outDir /tmp/secrets-discovery-build --emptyOutDir
```

The discovery redesign was inspected at desktop 1470×918, iPad portrait 768×1024, and iPad landscape 1024×768. Checks covered direct mesh clicks, world labels, keyboard focus, intro completion, project selection, all four discoveries, disclosures, Escape, and readable windows with visible scene subjects. Framing, distance fog, and dialog focus issues found in these checks were corrected before the saved captures.

Current visual evidence:

- [Desktop overview](discovery-overview-desktop.png)
- [Desktop archive](discovery-archive-desktop.png)
- [Portrait archive](discovery-archive-ipad-portrait.png)
- [Landscape archive](discovery-archive-ipad-landscape.png)
- [Portrait dossier](discovery-dossier-ipad-portrait.png)
- [Landscape companion](discovery-companion-ipad-landscape.png)

The earlier section-based layout's measurements remain in `performance.json` for historical context; they do not describe this redesigned interaction layout. Current measurements are recorded separately in `discovery-performance.json`.

Final checks passed: 20 runtime unit tests, scoped TypeScript and ESLint checks, the production build, and 10 Playwright tests (two duplicate tablet motion cases skipped). Browser tests exercise loading, keyboard/world-label discovery, restored focus, project changes, model failure, reduced motion, and rapid target selection. A separate production Chrome GPU run confirmed that interrupted travel reaches the latest contact destination with animation enabled. No tracked `dist` files were changed.

The Apple M3/Chrome production measurements held 30 FPS through travel and project changes on desktop and both iPad viewport sizes. A blank-page baseline was approximately 29.2 FPS in the same session; application frame callbacks and actual WebGL frames matched at 30 FPS. The follow-up desktop travel maximum frame interval was 33.5 ms. The first desktop sample had a 183.3 ms arrival gap and a 100.1 ms first project-switch gap; these did not recur in the follow-up or tablet samples. Their cause was not established, so the raw observations remain in the report.

Fresh network-context readiness ranged from 0.94 to 3.14 seconds locally and was 4.60 seconds at 10 Mbps with 80 ms latency. Initial transfer was approximately 4.41 MB; the lazy 3D JavaScript was 294 KB gzip. GPU caches were not forcibly cleared. The main homepage requested zero Secrets resources. Reduced-motion idle and a simulated visibility-state change both stopped WebGL draws after settling. The visibility probe tests the render-loop hook, not a physical iPad background tab.

Temporary browser tabs, servers, profiler scripts, build output, failed-test artifacts, and superseded layout captures were removed after verification. Editable assets and current evidence were retained.

## Limits

These are original models, not extracted reference assets. The robot's face and garment folds are simpler and its shoulders broader than the reference. The saved reference informs framing, restrained lighting, walking transitions, and hologram behavior; successful model export is not proof of an exact visual match.

Desktop and iPad are the acceptance targets. Physical iPad/Safari performance has not been measured; Mac browser emulation cannot certify a physical iPad frame rate. The work is local and has not been deployed.
