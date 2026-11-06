# Next of Kin Care website

Five static HTML pages using CSS and vanilla JavaScript. No framework, package installation, external runtime requests or production build service is required.

## Structure

- `index.html`, `about.html`, `services.html`, `contact.html`, `referral.html`: generated, deployable pages.
- `templates/`: editable page HTML and editorial content.
- `components/`: shared header and footer partials.
- `content/site.json`: contact information, service areas and launch review items.
- `content/pages.json`: titles, descriptions, introductory content and inner-page masthead variants (`heroLayout`).
- `content/forms.json`: shared form copy and preview settings.
- `content/service-groups.json`: illustrated service-directory groups; categories remain in `services.json`.
- `content/services.json`, `content/values.json`: reusable content collections. Optional `displayTitle` supplies a plain-English service label while preserving its published category title.
- `css/brand.css`: palette, type, spacing and radius tokens; local font declarations.
- `css/global.css`: reset, typography and accessibility foundations.
- `css/components.css`: navigation, buttons, cards, accordions and forms.
- `css/layout.css`: section composition and reusable split/grid layouts.
- `css/responsive.css`: tablet/desktop rules and reduced-motion support.
- `js/`: generic mobile-navigation behavior; no client contact data.
- `assets/`: locally hosted photography, logo, fonts and favicon.
- `scripts/`: dependency-free Python build and static checks.

## Update content

Edit JSON collections or page templates, then run:

```sh
python3 scripts/build.py
python3 scripts/check.py
```

The builder works from any directory. Do not directly edit generated root HTML; regeneration overwrites it. Text in JSON is escaped by the builder; templates and partials are trusted HTML maintained by developers. Keep sensitive personal information out of every source file.

## Branding and layouts

Change tokens in `css/brand.css` and replace the logo/favicon assets. The existing logo is reused, not redesigned. Plus Jakarta Sans headings and Poppins body text are self-hosted under the SIL Open Font License; see `assets/fonts/Jakarta-OFL.txt` and `assets/fonts/Poppins-OFL.txt`. Previously used Montserrat files and their licence are retained but not loaded. Reusable classes include `editorial-row`, `split`, `split-wide`, `service-grid`, `white`, `button-secondary` and `cta`. Brand-specific information belongs in configuration, not functionality scripts. For another client, review all editorial templates and metadata too.

The design uses the requested gold, warm white, charcoal and white. Dark text sits on gold buttons; the darker gold token is used for readable small accent text. CSS breakpoints are 700px and 1000px, with small-screen adjustments at 480px. Navigation and native FAQ details work without a framework; navigation remains visible if scripts cannot load.

## Preview and verification

```sh
python3 -m http.server 8000
```

Visit `http://localhost:8000`. Stop with Ctrl-C. Static checks validate links, fragments, unique IDs, page landmarks, H1 counts, image dimensions/alt attributes, field labels and placeholder resolution. They do not certify WCAG conformance.

Handover QA has now run in Chromium, Firefox and WebKit at six widths from 320px to 1440px: 1,362 checks passed, with no automated accessibility violations. See [the QA report](qa/HANDOVER_QA.md) for evidence, corrected defects, reproduction steps and outstanding acceptance items. Real-device, installed-browser, screen-reader and actual browser-zoom testing remain customer acceptance tasks.

## Contact and referrals

Contact and Referral now share `components/enquiry-form.html`. Form copy and preview configuration are in `content/forms.json`. Both forms are **preview-only**: fields validate locally, the button reviews their completeness and explicitly says nothing was sent. A submit guard is installed before fields are enabled; controls remain disabled without JavaScript. There is no endpoint, fetch, browser storage, file upload or success simulation.

The Contact form accepts general questions. The Referral contact form accepts only the enquirer’s contact information and relationship; it has no participant name, NDIS number, health field, notes box or upload. Direct phone/email contact remains available. Do not enter real sensitive information into previews.

`mode` is `preview`, `endpoint` is null and `participantDataEnabled` is false. The builder intentionally rejects live-mode or participant-collection settings until the integration is implemented. Changing a URL alone does not activate these forms. Before live submission, choose an approved secure backend; implement server validation, spam protection, access and retention controls, real status handling, an approved privacy notice and relevant consent requirements. Add the secure referral workflow separately. Never send participant records through a mailto form.


## Sources and launch review

Reviewed 6 November 2026:

- https://nokcare.com.au/ — contact numbers and five service areas.
- https://nokcare.com.au/about-us — approach, mission, vision and values.
- https://nokcare.com.au/services — ten published service categories; descriptions condensed for readability.
- https://nokcare.com.au/contact — Deanside location and image source. Published hours were omitted pending confirmation because the contact-page result was older.
- https://www.eihc.com.au/ — layout hierarchy inspiration only; no branding, text or images copied.

The photo is an existing NOK Care website image from Unsplash: https://unsplash.com/photos/1478061653917-455ba7f4a541 (asset: https://images.unsplash.com/photo-1478061653917-455ba7f4a541). It is illustrative, not represented as NOK Care staff or clients. Original logo source: https://assets.zyrosite.com/Yyv36o76aDiagr89/next_of_kin_care_logo_no_background-KKMOWyptksfcjTvy.png. Confirm asset permissions before public launch. No claims about registration, qualifications, client results or testimonials were added.

Review `reviewRequired` in `content/site.json`: current availability and funding eligibility, address spelling, appointment arrangements, asset permissions and secure integrations. A complete privacy policy, approved domain/canonical URLs, social sharing URL/image and sitemap should be added when public deployment details are agreed.

## Deployment

Rebuild and check locally. Upload the five root HTML pages and the `css/`, `js/` and `assets/` folders to the shared host’s public web directory, preserving paths. Use HTTPS. Do not upload configuration, templates, scripts, guidance files or Git metadata. Hosting needs no Python or Node.js. No remote deployment was performed.

Use Git to review and commit source changes, including generated HTML after rebuilding. The GitHub remote is `https://github.com/ravihacks/nokcare-website`. It remains private; GitHub Pages is not enabled pending the hosting/visibility decision.

## Current visual direction

Reviewed the public HTML and CSS of https://enablehub.com.au/ and https://www.careneeds.com.au/ following the requested reference review. Enable Hub specifies Plus Jakarta Sans headings and Poppins body text; Careneeds uses Poppins prominently. This revision uses the same open-source font families as typography inspiration, with NOK Care’s own palette, content, assets and layouts. No competitor photographs, claims or business information are used.

Typography uses bold Plus Jakarta Sans headings with more open letter spacing than the previous version, Poppins body copy at 17px, larger service descriptions and navigation, and fluid heading sizes. Section spacing scales from 60px to 100px. Buttons have 54px minimum height, 8px corners, consistent padding, subtle hover elevation and moving arrows. These settings are maintained in the brand, global and component stylesheets.

The homepage begins with an edge-to-edge image hero: the introduction, two actions and telephone link sit over a dark overlay for contrast. Image positioning and the overlay adapt for narrow screens; the hero grows with its content rather than clipping text. A three-item icon list sits below. The introduction pairs a left-hand image with right-hand content on tablet/desktop and stacks the image above the content on mobile. The homepage includes two image-led aged care and disability/NDIS pathways, linked service rows, a getting-started section with a conversation photograph, and a service-area section with a Melbourne photograph. FAQ and the closing contact panel complete the page. The introduction uses a different illustrative photograph from the hero. Service and FAQ text is at least 16px; mobile section spacing is tighter. The shared charcoal contact panel uses a quiet forest photograph beneath a dark gradient, with a telephone link and gold contact button. A stronger mobile overlay keeps its text readable. The image and gradients are defined in `css/components.css`; overlay colours are tokens in `css/brand.css`. Inner pages retain practical mastheads and readable service rows.

Edit the homepage composition in `templates/index.html` and the other page templates for editorial copy. Contact details, areas, services, values and metadata remain in JSON. `DESIGN_GUIDELINES.md` reflects the typography update. Motion uses native CSS transitions and IntersectionObserver with reduced-motion and keyboard-focus support. There is no animation library or looping motion.

Photography is illustrative, not presented as NOK Care staff, clients or facilities. The main photo is reused from the existing NOK Care website. The editorial homepage photo is https://images.unsplash.com/photo-1511632765486-a01980e01a18 (`family-connection.jpg`). The decorative contact-panel background is `nature.jpg` (https://images.unsplash.com/photo-1441974231531-c6227db76b6e). The previously downloaded `everyday-support.jpg` (https://images.unsplash.com/photo-1544027993-37dbfe43562a) remains unused. Confirm permissions before launch.

Validation: generated all five pages and passed static page/link checks, JavaScript syntax checks and Git whitespace checks. Handover QA additionally passed 1,362 checks in Chromium, Firefox and WebKit; see `qa/HANDOVER_QA.md`. Approved team and local photography remain the strongest opportunity to make the imagery specific to NOK Care.

## Homepage photography

The service pathways, getting-started guidance and service-area section now include photographs to break up long text sections. All new images are optimised JPEGs and lazy-loaded with explicit dimensions. Pathway images share the existing title link through a stretched-link target; keyboard navigation keeps one link per pathway. The FAQ remains a simple text accordion for readability.

Sources and intended usage for the four new photographs are in `content/image-sources.json`. They illustrate companionship, social connection, discussion and Melbourne; they are not presented as NOK Care clients, staff, facilities or a specific office location. The conversation photograph was already used on NOK Care’s existing services page. Confirm rights/suitability with the customer alongside the other image assets.

## Inner-page design consistency

Inner pages share brand tokens, typography, buttons and photographic treatment while using layouts suited to their purpose:

- About uses an editorial masthead, one opening image, a concise story, a mission/vision band and a visual values grid.
- Services uses a compact masthead and category jump links before its three illustrated groups. Plain service descriptions use spacing instead of divider lines or decorative numbers, with one subtle separator between groups. Individual directory descriptions have no links or arrows; group-level enquiry links are also omitted; the closing CTA provides the contact action. Homepage featured-service links remain unchanged. One photographic contact panel combines general support and aged-care guidance, preserving `#aged-care`. All ten service anchors and both homepage audience destinations remain available.
- Contact uses a compact masthead, immediate phone/email actions and the form before supporting information in mobile/source order.
- Referral uses the same task layout with concise guidance, referral-specific FAQs and a closing telephone action that stays in the referral journey.

Use `heroLayout: "editorial"` or `"compact"` in `content/pages.json`. The builder also retains the `"image"` masthead variant for future use with `heroImage`. Section modifiers `section-tight` and `section-standard` provide spacing hierarchy. Category IDs belong in `content/service-groups.json`. The homepage is unchanged by this inner-page revision; its HTML checksum was verified before and after building.

## Shared closing contact panel

The four inner pages use `components/call-to-action.html` for the forest-backed closing panel shown on Services. Text, button labels and destinations are in `content/call-to-actions.json`; the builder resolves configured `phone`/`email` targets from `site.json`. About and Services link to Contact, Contact opens the general email address, and Referral keeps a telephone action. Services retains `#aged-care` on this shared closing section. There are no additional enquiry links beneath the service groups. The homepage keeps its existing closing panel unchanged.
