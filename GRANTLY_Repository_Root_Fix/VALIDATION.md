# Validation report — GRANTLY

## Automated checks

- TypeScript strict type check: passed.
- Vite production build: passed.
- Domain tests: 5 passed, 0 failed.
  - The original income-certificate task opens exactly two applications.
  - Eligibility changes with the profile, independently of document readiness.
  - Optional first-generation information can remain unknown.
  - Saved items do not count as funding; selected awards do; the gap is capped at zero.
  - Merit-award incompatibility is deterministic.

## Browser interactions verified

- Welcome page visual review and Explore demo navigation.
- My Journey and rule-based recommendations.
- Income certificate preparation: confirmation of two newly ready applications, followed by My Journey showing four ready opportunities.
- Checklist persistence after reload.
- Scholarship detail and explicit eligibility explanations.
- Application statement minimum-length validation.
- Explicit draft saving and correct resume after reload.
- Three in-session sample PDFs attached to Udaan's application.
- Final demo acknowledgment and completion receipt, reference and timestamp.
- Funding plan live calculations and replacement of Horizon with Ascent after the incompatibility choice.
- Search reduced the list to Udaan; a minimum-amount filter produced the expected empty state; clearing filters restored all twelve results.
- Mobile navigation opens and navigates to Discover.
- Native modal dialog behavior observed during the incompatible-award flow.

## Responsive review

Used a temporary browser iframe harness to provide actual independent viewport widths rather than merely scaling a screenshot. The harness is excluded from delivery.

| Frame width | Content width after browser scrollbar | Observed horizontal overflow                   |
| ----------- | ------------------------------------- | ---------------------------------------------- |
| 360px       | 345px                                 | None in reviewed My Journey and Discover views |
| 768px       | 753px                                 | None in reviewed My Journey and Discover views |
| 1024px      | 1009px                                | None in reviewed My Journey view               |
| 1440px      | 1425px                                | None in reviewed My Journey view               |

Mobile and tablet layouts were visually inspected. The welcome page was visually reviewed at desktop width. Breakpoints cover the entire application; this is not an exhaustive device/browser matrix.

## Coverage limits and intentional demo boundaries

- This is a frontend demonstration using fictional providers and opportunities, not a connected scholarship service.
- There is no real authentication, submission, award verification or server storage.
- No exhaustive screen-reader, contrast-tool, physical touch-device or cross-browser audit was performed.
- Reduced motion, keyboard focus management and responsive layouts are implemented; not every possible interaction combination has been manually exercised.
- Attachments remain in memory for the current session. LocalStorage stores profile, checklist, draft, plan and file metadata only.
- Google Fonts have system fallbacks. Optional font availability can change typography but does not block functionality.
