# GRANTLY — Your future, unfolding

A complete frontend scholarship action studio for Indian college students. Built for a UI/UX competition around one promise: **Find your fit. Know your next step. Fund your future.**

## Run locally

Install Node.js 22 or newer. Open this folder in VS Code and run:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. No API keys, accounts, environment variables or backend are required.

```sh
npm run build  # TypeScript checks and production build in dist/
npm test       # Five deterministic domain tests
```

Deploy `dist/` to a static web host. Hash-based routing supports refresh and direct links without server rewrite configuration. Serve the build using a static HTTP server rather than opening index.html as a file.

## Design concept

“Your future, unfolding” uses an editorial ivory and forest identity, lime action accents, lavender preparation insights, a custom doorway mark and a layered student Funding Passport. CSS/SVG graphics are editable source assets. Motion includes a sequenced hero, scroll-linked depth, a sticky story stage, document stamps, animated funding segments and component transitions. Native scrolling is preserved. Mobile and reduced-motion modes simplify the choreography.

## What works

- Three-step editable onboarding with course, year, residence, institution, academic scale, household income range, optional first-generation information and annual funding figures.
- Action-based My Journey dashboard with deadlines, activity and resume links.
- Twelve fictional scholarships, search, multi-field filtering, sorting, saving and up-to-three comparison.
- Rule-by-rule eligibility explanation. Document preparation is calculated separately from eligibility.
- Signature **One document away** grouping: one prepared income certificate makes two demo opportunities application-ready.
- Reusable Funding Passport with checklist preparation, PDF/JPG/PNG session attachments, file metadata, previews, replacement and removal.
- Four-step application workspace with profile reuse, story validation, explicit draft saving, session document checks, review, acknowledgment and demo receipt.
- Safe sample PDFs generated in-browser for a complete evaluator flow without personal documents.
- Board/list tracker, saved opportunities, application notes, activity history and user-entered simulated outcomes.
- Interactive funding plan with available versus potential support, zero-capped gap, excess-funding explanation, incompatible merit-award selection and unknown-combination notices.
- Versioned local persistence, reset confirmation, native accessible dialogs, keyboard focus states, mobile navigation and reduced-motion support.

## Suggested 3-minute evaluator journey

1. Open the welcome page. Click **Explore demo**.
2. Read “One document. Two open doors.” Open **Show my next step**.
3. Mark **Income certificate** prepared. Notice the confirmation and affected scholarship links.
4. Return to My Journey: ready opportunities increase from two to four.
5. Open Udaan Scholars Grant and inspect the explicit eligibility reasons.
6. Start its application. Continue to Your story, enter at least 40 characters, save the draft and reload to confirm it resumes.
7. Continue to documents. For each item, choose **Use a safe sample PDF** (or attach a sample file).
8. Review, acknowledge the demo notice and choose **Complete demo submission**. Inspect its reference and timestamp.
9. Open Applications to view the completed status. The notes control can record a simulated outcome.
10. Open Funding Plan. Add Udaan and Next Chapter: ₹1,50,000 cost − ₹40,000 available − ₹85,000 potential = ₹25,000 potential gap.
11. Add Horizon then Ascent to demonstrate the explicit choice between incompatible merit awards.
12. Reset the demo from Funding Passport when you want a fresh walkthrough.

## Important boundaries

All scholarships, providers, awards, deadlines, references and outcomes are fictional. There is no real verification, submission, provider integration or award decision. Meeting stated criteria never guarantees selection.

Profile, checklist, document metadata, saved items, drafts, selected awards and recorded outcomes are saved in the current browser's localStorage. Document bytes and object URLs remain in memory only; reload requires reattachment. Use sample files only. Browser data is not synchronized across devices. If browser storage is disabled, progress remains in the current tab and a notice is shown.

The academic year is a one-year planning window. Annual and one-time awards are each counted once; no renewal assumptions are made. Unknown award-combination rules remain explicitly provisional. Recorded outcomes do not automatically change confirmed funds. Demo CGPA conversion is ×10; real institutional conversion rules may differ. Household-income matching uses the selected range's upper boundary.

Deadlines are seeded relative to the first demo setup date and remain stable across reloads. Reset the demo to refresh the calendar. Google Fonts are an optional visual enhancement with system/Georgia fallbacks; the application does not require them to function.

## Code map

- `src/domain.ts`: scholarship dataset, profile/state types, eligibility rules, document readiness, priority, deadlines and funding calculations.
- `src/App.tsx`: reusable components, shared state, navigation, route screens and application interactions.
- `src/demoFile.ts`: valid sample PDF creation without a server.
- `src/styles.css`: art direction, custom graphics, layouts, responsive breakpoints and accessibility refinements.
- `src/domain.test.ts`: meaningful calculation and readiness tests.

## Validation

Production build and TypeScript checks pass. Five domain tests pass (one-document readiness, profile-dependent eligibility, unknown optional information, funding totals, incompatible awards).

Browser QA verified the welcome and workspace, live two-application readiness update, reload persistence, statement validation, saved-draft resume, sample attachments, demo receipt and incompatible-award replacement. Responsive checks used real iframe viewport widths at 360, 768, 1024 and 1440px. See VALIDATION.md for details and remaining coverage limits.
