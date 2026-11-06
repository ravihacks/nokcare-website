# NOK Care — customer handover QA

Review date: 6 November 2026 (Australia/Brisbane).

**Full cross-browser baseline: 1,362 checks passed across Chromium, Firefox and WebKit.** No automated accessibility violations were found across 30 page/viewport audits. The five pages are ready for customer review. Production acceptance remains conditional on business approvals, the final hosting check and real-device/user acceptance.

## Browser evidence

| Engine | Tested version | Checks passed | Failures |
| --- | --- | --- | --- |
| Chromium | 149.0.7827.55 | 454 / 454 | 0 |
| Firefox | 151.0 | 454 / 454 | 0 |
| Webkit | 26.5 | 454 / 454 | 0 |

The current machine-readable evidence is `chromium-results.json`, `firefox-results.json` and `webkit-results.json`. Screenshots `screenshots/index-1440.png`, `screenshots/ux-home-375.png`, `screenshots/ux-services-375.png` and `screenshots/contact-375.png` show the current UX revision. Earlier scoped evidence/captures are retained as historical records.

All five pages were tested over local HTTP at 320, 375, 640, 768, 1000 and 1440px. Checks include:

- Page/asset loading, fonts, active navigation, no horizontal overflow and JavaScript/console errors.
- Mobile menu opening/closing, Escape from toggle and navigation, focus return, desktop toggle visibility.
- FAQ operation with Enter and Space, skip link, direct service fragments and malformed fragments.
- Navigation without JavaScript, scroll reveals and reduced-motion behavior.
- Increased line height, letter/word spacing and paragraph margins at 375px.
- Clearly labelled contact/referral form previews: required fields, invalid email handling, honest review status and prevented submission. Referral fields accept only enquirer contact details; no participant fields or uploads. Forms remain disabled without JavaScript.
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
| Contact experience and forms | Matching contact/referral form previews now support local validation at the user’s request. Review buttons explicitly confirm that nothing was sent; direct phone/email links remain available. Secure backend settings are deferred. |

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

Operational contact remains phone/email. The two interactive form previews validate locally without sending requests or saving data. The referrer’s contact form has no participant records, notes field or upload. Live submission requires a separately approved secure backend, server validation, spam protection, access/retention rules and privacy review. `content/forms.json` contains preview settings; the builder rejects live mode, a non-null endpoint or participant collection until the integration is reviewed and implemented. Do not send health records or NDIS documents through ordinary email. A prior scan of tracked text found no common GitHub-token, AWS-access-key or private-key patterns; this was not an exhaustive historical secrets audit.

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

Added two photographic support pathways, a group-discussion image beside the getting-started guidance, and a Melbourne/Yarra River photo beside the service areas. Images stack on mobile; pathway photo clicks reach the existing service destinations at both 375px and 1440px. Image crops were reviewed at those widths. Text and service routing remain intact. The full three-engine suite passed again: 396 checks per engine, 1,362 total, with no automated accessibility violations.

The four optimised JPEGs add approximately 657KB in total and load lazily below the hero. Sources and intended illustrative usage are in `content/image-sources.json`. The photographs do not imply staff/client identities or an office address. Image suitability and rights remain part of customer acceptance.

## Consistent inner pages and staged forms

Inner pages share the homepage’s brand tokens, typography and imagery treatment while using different compositions: an editorial About page, a compact Services directory and task-focused Contact/Referral pages. Services uses three illustrated directory groups and retains all ten service anchors, checked exactly once by the static build checks. Contact and Referral have supporting photographs and one shared form component.

Both form previews use labels, required indicators, native validation, consent controls and live status text. An event guard is registered before controls are enabled, and `requestSubmit()` is explicitly tested without navigation or a POST request. Invalid email addresses are rejected. Form fields remain disabled without JavaScript. The referral preview collects only the enquirer’s name, email, optional phone and relationship—not participant names, NDIS numbers, health data, free-text notes or documents. No actual referral was submitted in testing. QA uses fictitious example details and resets forms before screenshots.

The complete suite was rerun in all three engines: **454 checks per engine, 1,362 total**; no console/asset errors, unexpected non-GET requests or automated accessibility violations. All four inner pages were visually reviewed at mobile and desktop widths. Current captures are `screenshots/inner-<page>-<width>.png`. Form configuration/copy is in `content/forms.json`; settings are documented in README. No approved secure backend was selected or enabled during this revision.

## Inner-page UX audit changes

Applied the approved audit to About, Services, Contact and Referral only. Homepage HTML is byte-identical before/after the build, and the 375px/1440px Chromium homepage screenshots match the preceding version byte-for-byte.

- About: merged the repeated opening messages into one editorial masthead and image; a concise story, mission/vision band and visual values grid replace consecutive identical split sections. The closing action leads to Services.
- Services: category navigation immediately follows a compact introduction; all three jump links are visible on mobile and resolve to the right groups. Removed repeated preambles and the generic process block. All ten service IDs and both audience destinations remain valid.
- Contact: quick phone/email actions precede the form. The form comes before secondary details and photography in source/mobile order. Areas and location are compact supporting content.
- Referral: one task introduction, one enquiry workspace, focused referral FAQs and a closing telephone action replace repeated privacy/call prompts. The final action stays in the referral journey. Preview-form and participant-data protections remain intact.

At 375px, page lengths changed from About 4,896 → 4,524px; Services 8,291 → 6,190px; Contact 5,445 → 4,647px; Referral 7,218 → 4,815px. These are viewport/font-specific observations, not general performance guarantees. Desktop and mobile opening/full-page captures were visually reviewed.

The full Chromium/Firefox/WebKit suite passed again: 454 checks per engine, 1,362 total, with no automated accessibility violations or runtime/asset/request errors. The new sidebar content uses ordinary containers as part of the main task, resolving an accessibility landmark issue found in the first audit run. Additional category navigation, form ordering, referral-action and page-height observations are in `inner-page-flows.json`. Current full-page evidence remains in `screenshots/inner-*.png`.

## Services list and closing-panel cleanup

Combined the aged-care guidance and general closing CTA into one photographic panel. The `#aged-care` destination is preserved on that section, alongside the phone link and contact action. Removed decorative numbering, per-row divider lines and list-top rules from the Services directory; a single subtle rule separates the service groups. The homepage service component retains its previous styling and numbering.

Scoped Chromium checks passed at 320px, 375px, 768px and 1440px: all ten linked services, no decorative numbers/row/list borders, one closing panel, resolving aged-care fragments, no horizontal scrolling, no asset/runtime errors and no automated accessibility violations. Image-backed contrast remains a manual-review item; desktop/mobile panel and directory captures were visually reviewed. Evidence: `services-cleanup.json`; current Services screenshots are refreshed. This was a scoped check after the full cross-browser baseline, not a rerun of all 1,362 checks. Homepage HTML remains byte-identical.

## Group-level service contact links

The Services directory now presents all ten services as non-interactive descriptions. Individual title links and arrow controls are removed; one context-labelled “Discuss these services” link follows each of the three groups. Category navigation, service fragment destinations and the combined closing contact panel remain intact. Homepage featured-service links are unchanged.

Scoped Chromium checks passed at 320px, 375px, 768px and 1440px: ten descriptions, zero per-service links/arrows, three group contact links, no row/list divider rules, one closing panel, resolving aged-care target, no horizontal overflow or runtime/asset errors and no automated accessibility violations. Desktop/mobile directory captures were visually reviewed. Evidence is `service-group-links.json`; current Services screenshots are refreshed. Earlier individual-service click records describe previous versions; current directory enquiries use the group links. The full cross-browser baseline was not rerun for this small scoped change. Homepage HTML remains byte-identical.

## Shared inner-page closing CTA

Removed the group-level “Discuss these services” links from Services. About, Services, Contact and Referral now render one shared `components/call-to-action.html` panel with the forest image, dark overlay, gold eyebrow, supporting paragraph, phone number and gold action. Page-specific descriptions and destinations live in `content/call-to-actions.json`. About/Services lead to Contact; Contact uses email; Referral uses the existing phone number. Services retains `#aged-care`. The homepage is unchanged.

Scoped Chromium checks passed for all four pages at 320px, 375px, 768px and 1440px: 16 layouts, one detailed CTA per page, no service-group or per-service enquiry links, correct phone/action destinations, preserved aged-care target, no horizontal overflow/runtime/asset errors and no automated accessibility violations. Image-backed contrast was manually reviewed using desktop/mobile panel captures. Evidence: `shared-inner-cta.json`. This is the latest targeted verification after the full cross-browser baseline; the 1,362-check suite was not rerun for this component-only change. Full-page inner-page screenshots were refreshed, and homepage HTML was checked byte-identical.

## Homepage shared CTA

At the user’s subsequent request, the homepage now uses the same shared detailed closing panel as the inner pages, with a short support description, phone number and “Discuss your support” contact button. Previous homepage-preservation checks above apply to the earlier revisions, before this explicit homepage change. All five closing panels now use `components/call-to-action.html` and `content/call-to-actions.json`.

Scoped Chromium checks passed at 320px, 375px, 768px and 1440px: one shared panel, correct contact destination and phone number, no overflow or runtime/asset errors and no automated accessibility violations. Mobile/desktop panel captures were reviewed; image-backed contrast remains a manual-review item. Evidence: `home-shared-cta.json` and `screenshots/home-shared-cta-*.png`. This was a targeted check, not a full cross-browser rerun.

## Sticky navigation and footer revision

All five pages now share a sticky, shrinking header, back-to-top control and NDIS badge. Targeted Chromium checks passed 90 assertions across 375px, 768px and 1440px: fixed header position, reduced header height, visible return control, return to page top, focus restoration, loaded footer image and no horizontal overflow. Desktop footer rendering was visually reviewed. The existing website badge retains registered-provider wording; confirmation is tracked in site configuration before launch.

The automated accessibility harness now resets to the top before its audit: earlier form interactions leave controls partly clipped under the sticky header, producing viewport-dependent target-size reports. Scroll controls are checked separately.

The full Chromium suite passed 454/454 checks across six widths (320–1440px), with no automated accessibility violations or runtime/asset errors. Evidence: `sticky-header-results.json`. Other browser engines were not rerun for this revision.
