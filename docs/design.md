# Portfolio design

## Work plan

- [x] Ground: resume, profile README, project READMEs, original portrait.
- [x] Sketch: compare editorial and recruiter-briefing structures.
- [x] Agree: proceed without a checkpoint, as requested by the workflow.
- [x] Implement: content, visual system, interactions, assets.
- [x] Verify: production build, browser tests from 320 to 1440 pixels, automated accessibility checks, and external-link checks. Run `npm run verify` for the current test results.

## Problem

A personal portfolio for Yash Goel, based on the blue/yellow editorial references. This is a new standalone site; sibling projects are evidence, not dependencies. Credentials come from `../resume/extracted_resume.txt`; account URLs from `../yashgoel-749/README.md`; project capabilities from their READMEs. No secrets or environment files are used.

## Usage

Visitors scan the introduction, open project case studies, download the resume, or contact Yash. Developers run `npm install`, `npm run dev`, and `npm run build`.

## Shape

`index.html` owns semantic page sections. `src/projects.js` owns project records. `src/project-cards.js` renders those records into HTML through `vite.config.js` before delivery. Project content and source links therefore remain available without JavaScript. `src/main.js` adds browser interactions and reads the same records for dialogs.

`src/style.css` owns layouts, colors, and motion. `src/fonts.css` bundles local WOFF2 fonts through Fontsource. `public/theme.js` restores the saved theme before paint. `public/` contains images, font licenses, and the resume. No backend, tracking, or API credentials.

Project record: `{ id, number, name, category, summary, stack, color, challenge, solution, highlights, source, demo?, demoNote? }`.
Interaction contract: selecting a category hides unrelated cards; selecting a case study opens a named native dialog; closing restores focus. Theme selection persists when local storage is available. Copy-email announces success or a usable fallback. Menu state exposes `aria-expanded` and closes after navigation. Motion respects reduced-motion preferences.

## Synthesis decision

Use the editorial candidate as the visual base and the recruiter-briefing candidate's evidence-first project hierarchy. Keep one main browser module rather than shallow wrappers. Reject dashboard/sidebar architecture: it delays the personal story and adds navigation state without useful depth. Screened for split ownership, duplicated records, and pass-through interfaces.

## Tradeoffs accepted

- Static hosting rather than a contact backend; email links are honest and require no private credentials.
- Illustrated interface previews rather than pretending synthetic interfaces are application screenshots.
- Modest photo enhancement rather than claiming new detail can be recovered from a small original.

## Implementation reconciliation

The optimization pass moved card rendering from the browser into Vite's HTML transform. The same project records still supply cards and dialogs, so there is no duplicate content to maintain. Visitors can pause the moving banner, and reduced-motion preferences disable it. Mobile menu state resets after a desktop resize.

Browser checks exposed low-contrast labels and a dark theme badge with dark text on a dark background. The color fixes preserve the visual design. Tests check the actual Vercel content-security policy against the production page.

The Amazon Clone demo returned HTTP 451 with `DEPLOYMENT_DISABLED` on November 6, 2026. Its live-demo link was removed and replaced with an availability note. Its GitHub source remains linked. Restoring that separate deployment is outside this portfolio task.

## Risks

External demos can sleep or become unavailable; source links remain available. The canonical URL and sharing-image URLs now use `https://goel-yash-homeground.vercel.app/`. If the domain changes, those metadata URLs and the live verification script need the new address.
