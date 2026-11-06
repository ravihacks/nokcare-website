/* Development-only motion regression checks; no runtime dependencies. */
const { chromium, firefox, webkit } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
(async () => {
  let checks = 0;
  const assert = (condition, label) => { if (!condition) throw Error(label); checks++; };
  for (const [engine, launcher] of Object.entries(process.env.QA_ENGINE ? { [process.env.QA_ENGINE]: { chromium, firefox, webkit }[process.env.QA_ENGINE] } : { chromium, firefox, webkit })) {
    const browser = await launcher.launch();
    for (const width of [375, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      for (const file of ['index', 'about', 'services', 'contact', 'referral']) {
        console.log(engine, width, file);
        await page.goto(`http://127.0.0.1:8765/${file}.html`);
        await page.evaluate(() => document.fonts.ready);
        if (width < 1000) {
          await page.locator('.menu-toggle').click();
          await page.waitForTimeout(350);
          assert(await page.locator('#main-nav').isVisible(), `${engine}: menu open`);
          await page.keyboard.press('Escape');
          await page.waitForTimeout(350);
          assert(!await page.locator('#main-nav').isVisible(), `${engine}: menu closed`);
          await page.locator('.menu-toggle').evaluate(el => { el.click(); el.click(); el.click(); });
          await page.waitForTimeout(350);
          assert(await page.locator('.menu-toggle').getAttribute('aria-expanded') === 'true', 'Rapid menu clicks');
          await page.keyboard.press('Escape');
          await page.waitForTimeout(350);
        }
        const summaries = page.locator('.faq summary');
        for (const summary of await summaries.all()) {
          await summary.click();
          await page.waitForTimeout(350);
          assert(await summary.evaluate(el => el.parentElement.open), 'FAQ opened');
          await summary.focus();
          await page.keyboard.press('Enter');
          await page.waitForTimeout(350);
          assert(!await summary.evaluate(el => el.parentElement.open), 'FAQ keyboard close');
          await summary.evaluate(el => { el.click(); el.click(); el.click(); });
          await page.waitForTimeout(350);
          assert(await summary.evaluate(el => el.parentElement.open && el.parentElement.getAnimations().length === 0), 'Rapid FAQ clicks settle');
        }
        await page.evaluate(() => scrollTo({ top: 1100, behavior: 'instant' }));
        await page.waitForTimeout(400);
        assert(await page.locator('.back-to-top').isVisible(), `Return control visible ${engine} ${width} ${file}: ${await page.evaluate(()=>scrollY)}`);
        await page.locator('.back-to-top').click();
        await page.waitForFunction(() => scrollY < 2);
        await page.waitForTimeout(400);
        assert(await page.evaluate(() => scrollY === 0 && document.activeElement.matches('.brand')), 'Smooth top and focus');
        assert(!await page.locator('.back-to-top').isVisible(), 'Return control hidden');
        if (width >= 1000) {
          const next = file === 'about' ? 'services' : 'about';
          await page.locator(`#main-nav a[href="${next}.html"]`).click();
          await page.waitForURL(`**/${next}.html`);
          await page.waitForTimeout(350);
          assert(page.url().endsWith(`/${next}.html`), 'Page navigation');
          await page.goBack();
          await page.waitForTimeout(350);
          assert(page.url().endsWith(`/${file}.html`), 'Browser back');
        }
      }
      await page.goto('http://127.0.0.1:8765/services.html');
      await page.locator('.category-nav a').last().click();
      await page.waitForTimeout(1400);
      assert(await page.evaluate(() => {
        const target = document.querySelector(location.hash);
        return target.getBoundingClientRect().top >= document.querySelector('.site-header').getBoundingClientRect().bottom;
      }), 'Section target clears sticky header');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior === 'auto'), 'Reduced motion scroll');
      assert(errors.length === 0, errors.join('\n'));
      await page.close();
    }
    await browser.close();
    console.log(`${engine}: motion checks passed`);
  }
  console.log(`PASS: ${checks} motion assertions`);
})().catch(e => { console.error(e); process.exit(1); });
