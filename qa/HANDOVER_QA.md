# NOK Care — customer handover QA

Review date: 6 November 2026 (Australia/Brisbane).

**Current result: 1,188 checks passed across Chromium, Firefox and WebKit.** No automated accessibility violations were found across 30 page/viewport audits. The five pages are ready for customer review. Production acceptance remains conditional on business approvals, the final hosting check and real-device/user acceptance.

## Browser evidence

| Engine | Tested version | Checks passed | Failures |
| --- | --- | --- | --- |
| Chromium | 149.0.7827.55 | 396 / 396 | 0 |
| Firefox | 151.0 | 396 / 396 | 0 |
| Webkit | 26.5 | 396 / 396 | 0 |

The current machine-readable evidence is `chromium-results.json`, `firefox-results.json` and `webkit-results.json`. Screenshots `screenshots/index-1440.png`, `screenshots/ux-home-375.png`, `screenshots/ux-services-375.png` and `screenshots/contact-375.png` show the current UX revision. Earlier scoped evidence/captures are retained as historical records.

All five pages were tested over local HTTP at 320, 375, 640, 768, 1000 and 1440px. Checks include:

- Page/asset loading, fonts, active navigation, no horizontal overflow and JavaScript/console errors.
- Mobile menu opening/closing, Escape from toggle and navigation, focus return, desktop toggle visibility.
- FAQ operation with Enter and Space, skip link, direct service fragments and malformed fragments.
- Navigation without JavaScript, scroll reveals and reduced-motion behavior.
- Increased line height, letter/word spacing and paragraph margins at 375px.
- A finished contact page with phone/email links and no form preview or data collection; no referral inputs.
- Separate support pathways, linked service titles and different hero/introduction images.
- Axe-core WCAG A/AA tags through WCAG 2.2 and best-practice audits at 375px and 1440px.

WebKit keyboard traversal uses Option+Tab to include links, consistent with macOS/Safari preferences. The 320px test covers a narrow reflow width; actual browser zoom and physical devices were not tested. These tests do not certify WCAG conformance. Axe leaves image-backed text/decorative symbols for manual contrast review; the current desktop/mobile screenshots and dark overlays were reviewed visually. The menu symbol's charcoal-on-warm-white contrast is 13.02:1.

## UX review fixes

| Review finding | Current change |
| --- | --- |
| Hero and introduction repeat the same photo. | Introduction uses an alternative illustrative photo; separate photographs accompany service pathways, getting-started guidance and local support. Actual NOK Care team photography still requires approved assets. |
| Aged care and disability visitors have one generic route. | Separate aged care and disability/NDIS links lead to relevant service-page sections. Availability/funding are explicitly confirmed with the team. |
| Mobile service preamble precedes its heading. | Main heading appears first, followed by pathways and featured services; “View all services” follows the list. |
| Only service arrows are linked; wording is technical. | Each row has a single link encompassing its title, description and arrow. “Personal care” is a display label; its published category is retained in the content file. |
| Repeated messaging adds length. | Shorter introduction and practical getting-started guidance replace repeated choice-focused copy. Service areas use a compact grid and mobile spacing is tighter. |
| Service/FAQ text is small. | Featured descriptions, FAQ questions/answers and process copy are at least 16px; footer copyright increases to 12px. |
| Closing button wraps on mobile. | Shared label is “Talk to our team”; actual mobile layout confirms a single line. |
| Contact leads to a disabled preview form. | Preview is removed. Direct phone/email links and a short enquiry-preparation guide form the contact experience. Sensitive information must be arranged through a suitable secure channel. |

Current image-led homepage height is **7,447px at 375px width** and **5,691px at 1440px width**. Added photographs increase scroll length intentionally. Image dimensions and responsive crop heights are reserved in the layout; no horizontal overflow occurred. Measurements are viewport/font specific.

Actual click checks in `ux-journeys.json` verify both pathways, a Personal care title through to its service, and the service enquiry link through to phone/email contact. The contact button's mobile line length was also verified.

## Technical defects already corrected

- Hide the mobile Menu toggle on desktop; declare its button type.
- Keep the top contact strip inside the header landmark.
- Close an expanded menu with Escape from the toggle or navigation and return focus.
- Ignore malformed percent-encoded URL fragments safely.
- Allow long heading words to wrap with increased text spacing.
- Check generated pages against a fresh build and validate metadata, heading order, language, landmarks, links, image metadata and stylesheet asset paths.

## Content, privacy and launch dependencies

Contact numbers, email, address and areas are based on https://nokcare.com.au/. Published service categories were reviewed from https://nokcare.com.au/services during implementation. These sources do not independently confirm current availability or funding eligibility. Confirm the address spelling “Huttson Street”, appointment arrangements and business details before public launch.

No registration number, testimonial, statistics or qualification claims have been added. Images are illustrative and not represented as staff or clients. Image suitability/permissions and an approved complete privacy notice remain business acceptance items. No new claims about funding programs, response times or care outcomes were introduced.

Contact is intentionally phone/email-only. No online enquiry form, document upload, referral collection, analytics or browser storage is implemented. Any future online collection needs an approved secure backend, server validation, spam protection, access/retention rules and privacy review. Do not send health records or NDIS documents through ordinary email. A prior scan of tracked text found no common GitHub-token, AWS-access-key or private-key patterns; this was not an exhaustive historical secrets audit.

GitHub Pages is not published. The repository remains private; the plan does not support Pages for this private repository, and permission to expose the source publicly has not been supplied. After hosting is selected, repeat checks on the actual HTTPS URL, verify subdirectory asset paths and host security/error behavior, and configure canonical/share URLs and a sitemap for the agreed domain.

Before production acceptance, complete real iPhone/Android and installed-browser checks, actual zoom checks, a screen-reader review (VoiceOver/NVDA), business content/image approval and customer sign-off. Current browser engines provide useful coverage but do not replace physical-device or assistive-technology testing.

## Reproduce

The website remains dependency-free in production. Optional development tools can live outside the repository:

```sh
python3 scripts/build.py
python3 scripts/check.py
node --check js/main.js
node --check js/components.js
npm install --prefix /tmp/nokcare-qa-tools --no-save playwright@1.61.1 axe-core@4.10.3
PLAYWRIGHT_BROWSERS_PATH=/tmp/nokcare-qa-browsers node /tmp/nokcare-qa-tools/node_modules/playwright/cli.js install chromium firefox webkit
python3 -m http.server 8765 --bind 127.0.0.1
```

In another terminal, run once per engine (`chromium`, `firefox`, `webkit`):

```sh
PLAYWRIGHT_BROWSERS_PATH=/tmp/nokcare-qa-browsers \
PLAYWRIGHT_MODULE_PATH=/tmp/nokcare-qa-tools/node_modules/playwright \
AXE_PATH=/tmp/nokcare-qa-tools/node_modules/axe-core/axe.min.js \
QA_ENGINE=chromium \
QA_OUTPUT=/tmp/nokcare-qa-chromium \
node scripts/qa-browser.cjs
```

The runner exits nonzero for failures or an incomplete run. `QA_BASE_URL` can target a hosted subdirectory without a trailing slash. Stop the local server after testing. Deploy only the five HTML pages and the CSS, JS and asset folders; source guidance, QA tooling and Git metadata are not production assets.

## Image-led visual revision

Added two photographic support pathways, a group-discussion image beside the getting-started guidance, and a Melbourne/Yarra River photo beside the service areas. Images stack on mobile; pathway photo clicks reach the existing service destinations at both 375px and 1440px. Image crops were reviewed at those widths. Text and service routing remain intact. The full three-engine suite passed again: 396 checks per engine, 1,188 total, with no automated accessibility violations.

The four optimised JPEGs add approximately 657KB in total and load lazily below the hero. Sources and intended illustrative usage are in `content/image-sources.json`. The photographs do not imply staff/client identities or an office address. Image suitability and rights remain part of customer acceptance.
