/* Development-only browser checks. No browser library is shipped to hosting. */
const playwright = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const engine = process.env.QA_ENGINE || 'chromium';
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:8765';
const output = process.env.QA_OUTPUT || '/tmp/nokcare-qa';
const axePath = process.env.AXE_PATH;
const pages = ['index.html', 'about.html', 'services.html', 'contact.html', 'referral.html'];
const results = { completed: false, checks: [], errors: [], accessibility: [] };
const check = (name, pass, evidence = '') => results.checks.push({ name, pass: Boolean(pass), evidence });
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await playwright[engine].launch({ headless: true });
  results.engine = engine;
  results.browserVersion = browser.version();
  try {
    for (const width of [320, 375, 640, 768, 1000, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', e => results.errors.push(`${width}: ${e.message}`));
      page.on('console', msg => { if (msg.type() === 'error') results.errors.push(`${width}: ${msg.text()}`); });
      page.on('request', request => { if (request.method() !== 'GET') results.errors.push(`Unexpected ${request.method()} request: ${request.url()}`); });
      page.on('response', response => { if (response.status() >= 400) results.errors.push(`${response.status()} ${response.url()}`); });
      for (const file of pages) {
        const label = `${file} at ${width}px`;
        console.log('Checking', label);
        const response = await page.goto(`${base}/${file}`);
        await page.evaluate(() => document.fonts.ready);
        check(`${label}: HTTP`, response.status() === 200);
        const layout = await page.evaluate(() => ({
          viewport: innerWidth,
          scroll: document.documentElement.scrollWidth,
          overflowing: [...document.querySelectorAll('body *')].filter(el => {
            const r = el.getBoundingClientRect();
            return r.width && (r.right > innerWidth + 1 || r.left < -1) && !el.matches('.skip-link');
          }).slice(0, 8).map(el => `${el.tagName}.${el.className}`),
          brokenImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src),
          fonts: [document.fonts.check('700 32px "Plus Jakarta Sans"'), document.fonts.check('400 17px Poppins')]
        }));
        check(`${label}: no horizontal overflow`, layout.scroll <= width + 1, JSON.stringify(layout));
        // Force lazy images to load before assessing broken assets.
        for (const img of await page.locator('img').all()) await img.scrollIntoViewIfNeeded();
        await page.waitForFunction(() => [...document.images].every(img => img.complete));
        check(`${label}: images load`, await page.evaluate(() => [...document.images].every(img => img.naturalWidth > 0)));
        check(`${label}: fonts load`, layout.fonts.every(Boolean));
        check(`${label}: one active navigation item`, await page.locator('#main-nav [aria-current="page"]').count() === 1);
        if (file === 'index.html') {
          check(`${label}: two support pathways`, await page.locator('.support-pathway a').count() === 2);
          check(`${label}: every featured service has a linked title`, await page.locator('.service-card-link h3').count() === 3);
          check(`${label}: no repeated hero/introduction image`, await page.locator('.opening-image img').getAttribute('src') !== await page.locator('.introduction-image').getAttribute('src'));
        }
        const button = page.getByRole('button', { name: 'Menu' });
        check(`${label}: menu visibility`, await button.isVisible() === (width < 1000));
        if (width < 1000) {
          await button.click();
          check(`${label}: menu opens`, await button.getAttribute('aria-expanded') === 'true' && await page.locator('#main-nav').isVisible());
          await page.keyboard.press('Escape');
          check(`${label}: Escape works on toggle`, await button.getAttribute('aria-expanded') === 'false');
          await button.click();
          await page.locator('#main-nav a').first().focus();
          await page.keyboard.press('Escape');
          check(`${label}: Escape closes and returns focus`, await button.getAttribute('aria-expanded') === 'false' && await button.evaluate(el => el === document.activeElement));
        }
        for (const detail of await page.locator('.faq details').all()) {
          const summary = detail.locator('summary');
          await summary.focus();
          await page.keyboard.press('Enter');
          check(`${label}: FAQ keyboard opens`, await detail.getAttribute('open') !== null);
          await page.keyboard.press('Space');
          check(`${label}: FAQ keyboard closes`, await detail.getAttribute('open') === null);
        }
        if (['contact.html', 'referral.html'].includes(file)) {
          const form = page.locator('[data-enquiry-preview]');
          check(`${label}: one clearly labelled preview form`, await form.count() === 1 && await form.getAttribute('data-form-mode') === 'preview');
          check(`${label}: required fields validate`, !(await form.evaluate(el => el.checkValidity())));
          await form.locator('[name="full_name"]').fill('QA Example');
          await form.locator('[name="email"]').fill('invalid-email');
          await form.locator('[data-review-enquiry]').click();
          check(`${label}: invalid email rejected`, !(await form.locator('[name="email"]').evaluate(el => el.checkValidity())));
          await form.locator('[name="email"]').fill('qa@example.test');
          await form.locator('[name="phone"]').fill('0400 000 000');
          if (file === 'contact.html') await form.locator('textarea').fill('General service availability question for a QA check.');
          await form.locator('[name="contact_permission"]').check();
          await form.locator('[data-review-enquiry]').click();
          check(`${label}: review is honest about no sending`, (await form.locator('[data-preview-message]').textContent()).includes('not sent'));
          const urlBeforeSubmit = page.url();
          await form.evaluate(el => el.requestSubmit());
          await page.waitForTimeout(100);
          check(`${label}: submission is prevented`, page.url() === urlBeforeSubmit);
          await form.evaluate(el => { el.reset(); el.querySelector('[data-preview-message]').textContent = ''; });
          if (file === 'contact.html') check(`${label}: direct contact channels exist`, await page.locator('.contact-detail a[href^="tel:"]').count() === 2 && await page.locator('.contact-detail a[href^="mailto:"]').count() === 1);
          if (file === 'referral.html') check(`${label}: no participant records requested`, await form.locator('textarea, input[type="file"], input[name*="participant"], input[name*="ndis"]').count() === 0);
        }
        if (axePath && [375, 1440].includes(width)) {
          await page.addScriptTag({ path: axePath });
          const audit = await page.evaluate(async () => {
            const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
            return { violations: r.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })), incomplete: r.incomplete.map(v => ({id:v.id, nodes:v.nodes.map(n => ({target:n.target, summary:n.failureSummary}))})) };
          });
          results.accessibility.push({ file, width, ...audit });
          check(`${label}: automated accessibility`, audit.violations.length === 0, audit.violations.map(v => v.id).join(', '));
        }
        if ([375, 1440].includes(width)) {
          await page.evaluate(() => scrollTo(0, 0));
          await page.screenshot({ path: path.join(output, `${file.replace('.html', '')}-${width}.png`), fullPage: true });
        }
      }
      await context.close();
    }
    // Navigation must remain usable if JavaScript is unavailable.
    const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 900 } });
    const nojsPage = await nojs.newPage();
    await nojsPage.goto(`${base}/index.html`);
    check('No JavaScript: navigation remains visible', await nojsPage.locator('#main-nav').isVisible());
    check('No JavaScript: no page overflow', await nojsPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    for (const file of ['contact.html', 'referral.html']) {
      await nojsPage.goto(`${base}/${file}`);
      check(`${file} without JavaScript: fields stay disabled`, await nojsPage.locator('form input:enabled, form select:enabled, form textarea:enabled').count() === 0);
      check(`${file} without JavaScript: review stays disabled`, await nojsPage.locator('[data-review-enquiry]').isDisabled());
    }
    await nojs.close();
    const spacingPage = await browser.newPage({ viewport: { width: 375, height: 900 }, reducedMotion: 'reduce' });
    for (const file of pages) {
      await spacingPage.goto(`${base}/${file}`);
      await spacingPage.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }' });
      check(`${file}: increased text-spacing reflow`, await spacingPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    }
    await spacingPage.close();


    const context = await browser.newContext({ viewport: { width: 375, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', e => results.errors.push(`motion/hash: ${e.message}`));
    await page.goto(`${base}/index.html`);
    await page.keyboard.press(engine === 'webkit' ? 'Alt+Tab' : 'Tab');
    check('Skip link receives first keyboard focus', await page.locator('.skip-link').evaluate(el => el === document.activeElement));
    await page.keyboard.press('Enter');
    check('Skip link focuses main content', await page.locator('#main').evaluate(el => el === document.activeElement));
    for (const element of await page.locator('.reveal').all()) {
      await element.scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
    }
    check('Scroll reveals all sections', await page.locator('.is-pending').count() === 0);
    await page.goto(`${base}/index.html`);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => document.querySelectorAll('.is-pending').length === 0);
    check('Reduced motion exposes all content', await page.locator('.is-pending').count() === 0);
    check('Reduced motion removes transitions', await page.locator('.button').first().evaluate(el => getComputedStyle(el).transitionDuration === '0s'));
    await page.goto(`${base}/services.html#community`);
    check('Direct service link resolves', await page.locator('#community').evaluate(el => el.matches(':target') && el.getBoundingClientRect().top >= -1));
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`${base}/index.html`);
    await page.evaluate(() => { location.hash = '%'; });
    await page.waitForTimeout(100);
    check('No console, asset or runtime errors', results.errors.length === 0, JSON.stringify(results.errors));
    await context.close();
    results.completed = true;
  } catch (error) {
    results.fatal = error.message;
    throw error;
  } finally {
    await browser.close();
    results.summary = { total: results.checks.length, passed: results.checks.filter(x => x.pass).length, failed: results.checks.filter(x => !x.pass).length };
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
    console.log(JSON.stringify({ summary: results.summary, failures: results.checks.filter(x => !x.pass), accessibility: results.accessibility.filter(x => x.violations.length), errors: results.errors, output }, null, 2));
    if (results.summary.failed) process.exitCode = 1;
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
