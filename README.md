# Next of Kin Care website

Five static HTML pages using CSS and vanilla JavaScript. No framework, package installation, external runtime requests or production build service is required.

## Structure

- `index.html`, `about.html`, `services.html`, `contact.html`, `referral.html`: generated, deployable pages.
- `templates/`: editable page HTML and editorial content.
- `components/`: shared header and footer partials.
- `content/site.json`: contact information, service areas and launch review items.
- `content/pages.json`: page titles, descriptions and introductory content.
- `content/services.json`, `content/values.json`: reusable content collections.
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

Handover QA has now run in Chromium, Firefox and WebKit at six widths from 320px to 1440px: 1,116 checks passed, with no automated accessibility violations. See [the QA report](qa/HANDOVER_QA.md) for evidence, corrected defects, reproduction steps and outstanding acceptance items. Real-device, installed-browser, screen-reader and actual browser-zoom testing remain customer acceptance tasks.

## Contact and referrals

The contact form is an explicitly disabled preview. It neither submits nor stores data, and there is no simulated success message. Phone and general email links are available. `contactFormEndpoint` is null and intentionally not wired into scripts. Online referrals, uploads, analytics and browser storage are absent.

Before enabling enquiries, select an approved secure backend and implement server validation, rate limiting/spam protection, access controls, retention rules, error/success handling and an approved privacy notice. Do not merely remove `disabled` or use a mailto form. Review field names and consent requirements with the chosen integration. Referral collection needs a separately reviewed secure workflow; never use localStorage, public files or general email for participant records.

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

The homepage begins with a split composition: introduction, two actions and a telephone link beside a prominent photo with the real NOK Care logo. A small service summary sits below. The editorial introduction, service directory, photo-led approach section, local service areas, FAQ and contact panel each have a distinct purpose. The charcoal contact panel provides a telephone link and gold contact button across all pages. Inner pages retain practical mastheads and readable service rows.

Edit the homepage composition in `templates/index.html` and the other page templates for editorial copy. Contact details, areas, services, values and metadata remain in JSON. `DESIGN_GUIDELINES.md` reflects the typography update. Motion uses native CSS transitions and IntersectionObserver with reduced-motion and keyboard-focus support. There is no animation library or looping motion.

Photography is illustrative, not presented as NOK Care staff, clients or facilities. The main photo is reused from the existing NOK Care website. The editorial homepage photo is https://images.unsplash.com/photo-1511632765486-a01980e01a18 (`family-connection.jpg`). Previously downloaded but undisplayed assets are `everyday-support.jpg` (https://images.unsplash.com/photo-1544027993-37dbfe43562a) and `nature.jpg` (https://images.unsplash.com/photo-1441974231531-c6227db76b6e). Confirm permissions before launch.

Validation: generated all five pages and passed static page/link checks, JavaScript syntax checks and Git whitespace checks. Handover QA additionally passed 1,116 checks in Chromium, Firefox and WebKit; see `qa/HANDOVER_QA.md`. Approved team and local photography remain the strongest opportunity to make the imagery specific to NOK Care.
