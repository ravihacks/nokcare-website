# NOK Care — customer handover QA

Review date: 6 November 2026 (Australia/Brisbane).

Decision: suitable for customer review after the fixes below. Production acceptance remains conditional on business approvals, secure form scope and hosting verification. This is not a WCAG certification or a completed production launch.

## Scope and evidence

All five pages were tested locally over HTTP. The browser suite covers six viewport widths: 320, 375, 640, 768, 1000 and 1440 pixels. The 320px check also covers the viewport-width reflow condition associated with a 1280px desktop at 400% zoom; actual browser zoom and physical devices were not tested.

Final result: **1,116 checks passed across three engines**, with zero automated accessibility violations across 30 page/viewport audits. Machine-readable results are in `chromium-results.json`, `firefox-results.json` and `webkit-results.json`.

| Engine | Tested version | Checks passed | Failures |
| --- | --- | --- | --- |
| Chromium | 149.0.7827.55 | 372 / 372 | 0 |
| Firefox | 151.0 | 372 / 372 | 0 |
| Webkit | 26.5 | 372 / 372 | 0 |

Axe left the decorative mobile-menu symbol for manual contrast review. Its charcoal colour against warm white measures 13.02:1; the symbol is decorative and the button has visible “Menu” text. The automated incomplete result is retained in the JSON evidence.

Desktop and mobile screenshots were inspected for cropping, alignment, hierarchy and clipping. Representative screenshots are retained in `qa/screenshots/`; the runner writes all captures to its configured output folder.

Checks include:

- Every page loads; local images and selected fonts load; no horizontal page overflow.
- Mobile menu opens and closes, Escape works from the toggle and navigation, focus returns to the toggle, and desktop navigation shows without a mobile Menu button.
- Active navigation is correct on all five pages.
- FAQ entries open with Enter and close with Space.
- The skip link moves keyboard focus to main content. WebKit uses Option+Tab to include links, consistent with macOS/Safari keyboard navigation preferences.
- Navigation remains visible without JavaScript; scroll reveals expose content; changing to reduced motion reveals content and disables transitions.
- Direct service fragments resolve; malformed URL fragments produce no runtime error.
- Increased line height, letter spacing, word spacing and paragraph spacing do not cause horizontal overflow.
- The contact preview accepts no input and has no enabled submission action; referral pages collect no participant information.
- No console errors, JavaScript exceptions or failed HTTP asset requests during the suite.
- Axe-core audits against WCAG A/AA tags through WCAG 2.2 and best-practice rules at 375px and 1440px. Automated audits cover only detectable issues.

## Defects corrected

| Finding | Correction | Verification |
| --- | --- | --- |
| Mobile Menu button was visible alongside desktop navigation. | Hide the toggle by default and show it below the existing mobile breakpoint. | All pages at 1000px and 1440px; mobile menu checks at smaller widths. |
| Top contact strip was outside a semantic landmark. | Move the strip inside the existing header. | Landmark checks and axe audits. |
| Escape did not close the expanded menu while focus remained on its toggle. | Handle Escape whenever the menu is expanded; return focus to the toggle. | Keyboard tests from the toggle and inside navigation. |
| Malformed percent encoding in a URL fragment could throw an exception. | Safely ignore malformed fragments. | Browser test sets the fragment to `%` and checks for errors. |
| About heading overflowed at 375px with increased text spacing. | Allow long heading words to wrap when needed. | Text-spacing checks on all pages in all available engines. |

The menu button now also declares `type="button"` explicitly. Static checks were strengthened to validate unique metadata, heading order, language, landmarks and stylesheet asset paths.

## Content, forms and assets

The phone numbers, email, service areas and address were compared against https://nokcare.com.au/. The website's published information remains the source, not independent verification of service availability or eligibility. The ten service categories were taken from the existing published services page during implementation; renewed automated access to that services page was unavailable in this review.

No registration number, testimonial, statistics or qualification claims have been added. Confirm the spelling of “Huttson Street”, appointment arrangements, availability and funding eligibility with the business. Images are illustrative and must not be presented as actual staff or participants. Business approval of image rights/suitability remains outstanding. Local fonts include their open-source licences.

The enquiry form is an explicitly disabled preview. This is intentional, not an operational enquiry service. Referral information is not collected. No application code uses localStorage, sessionStorage, analytics or form-network requests. A tracked-text scan for common GitHub token, AWS access key and private-key patterns found no matches; this limited scan is not a complete secrets audit of historical commits.

## Remaining handover / launch items

| Priority | Item | Required outcome |
| --- | --- | --- |
| Before production acceptance | Enquiry and referral scope | Customer accepts phone/email-only general enquiries for launch, or approves a secure backend, server validation, spam protection, retention/access rules and referral workflow. Do not enable the preview form by removing disabled attributes. |
| Before production acceptance | Business content and assets | Confirm services, address spelling, eligibility wording and image permissions. |
| Before production acceptance | Privacy | Approve a complete privacy notice appropriate to the selected hosting and data-collection arrangements. Current text explains this build's limited functionality. |
| Before production acceptance | Hosting | Select/enable hosting and repeat checks on the actual HTTPS URL, including nested asset paths, navigation, security headers and error pages. GitHub Pages was not published: the private repository is unsupported on the current plan and public-source approval has not been supplied. No repository visibility was changed by QA. |
| With the final production domain | SEO | Set canonical URLs, sharing URLs/image and sitemap against the agreed domain; avoid pointing a review copy at an invented production origin. Unique titles, descriptions, language and Open Graph text already exist. |
| Customer acceptance | Human/device checks | Review on a real iPhone and Android device, installed Safari/Chrome/Firefox, browser zoom and a screen reader (VoiceOver/NVDA). Confirm image crops, reading order and touch usability with the customer. |

## Reproduce

The website remains dependency-free in production. The browser tools below are optional development tools installed outside the repository:

```sh
python3 scripts/build.py
python3 scripts/check.py
node --check js/main.js
node --check js/components.js
npm install --prefix /tmp/nokcare-qa-tools --no-save playwright@1.61.1 axe-core@4.10.3
PLAYWRIGHT_BROWSERS_PATH=/tmp/nokcare-qa-browsers node /tmp/nokcare-qa-tools/node_modules/playwright/cli.js install chromium firefox webkit
python3 -m http.server 8765 --bind 127.0.0.1
```

In another terminal, run once for each engine (`chromium`, `firefox`, `webkit`):

```sh
PLAYWRIGHT_BROWSERS_PATH=/tmp/nokcare-qa-browsers \
PLAYWRIGHT_MODULE_PATH=/tmp/nokcare-qa-tools/node_modules/playwright \
AXE_PATH=/tmp/nokcare-qa-tools/node_modules/axe-core/axe.min.js \
QA_ENGINE=chromium \
QA_OUTPUT=/tmp/nokcare-qa-chromium \
node scripts/qa-browser.cjs
```

The runner exits nonzero for failed checks or an incomplete run. `QA_BASE_URL` can target the final hosted subdirectory (without a trailing slash). Stop the local HTTP server after testing. Upload only the five pages and their CSS, JS and asset folders to conventional hosting; QA tooling and source guidance are not production assets.
