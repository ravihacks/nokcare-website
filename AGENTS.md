
# NOK Care Website — Development Rules

## 1. Core Principles

- Keep the website simple and maintainable.
- Use HTML5, CSS3 and vanilla JavaScript.
- Do not introduce frameworks without approval.
- Avoid duplicated code where practical.
- Keep client-specific settings separate.
- Use readable names and consistent formatting.

## 2. Project Organisation

Separate code into:

- HTML page templates
- CSS design tokens
- CSS components and layouts
- JavaScript functionality
- Content and configuration
- Images and other assets

Use descriptive filenames.

## 3. Design System

- Never hardcode brand colours throughout CSS.
- Use CSS custom properties.
- Keep fonts, spacing, colours and radii centralised.
- Use reusable components for buttons, cards and sections.
- Support different layouts through modifier classes.

## 4. Content Management

- Separate frequently updated content from layouts.
- Never embed client-specific information in shared JS.
- Use configuration files for contact details and branding.
- Do not invent business information.
- Preserve existing content unless asked to change it.

## 5. Responsive Design

- Mobile-first CSS.
- Support mobile, tablet and desktop screens.
- Avoid horizontal scrolling.
- Use flexible grids and fluid typography.
- Ensure navigation works on touchscreens.

## 6. Accessibility

- Use semantic HTML.
- Provide alt text for meaningful images.
- Maintain readable contrast.
- Support keyboard navigation.
- Use accessible labels and focus states.
- Respect reduced-motion preferences.
- Target WCAG 2.2 AA where practical.

## 7. JavaScript

- Use vanilla JavaScript.
- Avoid unnecessary dependencies.
- Keep scripts modular.
- Prevent browser console errors.
- Avoid exposing sensitive data.

## 8. SEO and Performance

- Give every page a unique title and description.
- Use proper heading hierarchy.
- Optimise images.
- Lazy-load suitable images.
- Minimise JavaScript.
- Avoid layout shifts.

## 9. Forms and Security

- Validate form inputs on the server.
- Do not expose private credentials.
- Never store sensitive referral data in localStorage.
- Never commit personal data or secrets.
- Use approved secure backend services for forms.
- Add spam protection when appropriate.

## 10. Code Changes

Before making changes:
- Inspect relevant files.
- Preserve existing functionality.
- Avoid unrelated modifications.

After making changes:
- Check affected pages.
- Test responsive behaviour.
- Check navigation and JavaScript errors.
- Summarise modified files.

## 11. Reusability

- Build components suitable for multiple clients.
- Keep brand configuration independent.
- Support alternate layout variants.
- Do not overengineer the system.
- Prioritise maintainability over complexity.

## 12. Deployment

- Output a standard static website.
- Use relative asset paths where suitable.
- Do not require Node.js on production hosting.
- Document any build commands clearly.
