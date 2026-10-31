import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.TERRAWAVE_PLAYWRIGHT || "playwright");
const browser = await chromium.launch({ headless: true, channel: "chrome", args: ["--disable-gpu"] });
const base = process.env.TERRAWAVE_URL || "http://localhost:3000";
await mkdir("tmp/visual-review", { recursive: true });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(90000);
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator(".brand-mark").count(), 2);
  assert.equal(await page.locator(".work-card .project-identity").count(), 7);
  assert.equal(await page.locator('.work-card a[href="/work/terrawave_platform"]').count(), 0);
  const family = await page.locator("h1").evaluate(el => getComputedStyle(el).fontFamily);
  assert.match(family, /Manrope/i);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "tmp/visual-review/home-desktop.png", animations: "disabled" });
  await page.getByRole("button", { name: /Judgment/ }).click();
  await page.getByRole("heading", { name: "Keep people in the picture." }).waitFor();
  await page.getByRole("button", { name: /Intelligence/ }).focus();
  await page.keyboard.press("Enter");
  await page.getByRole("heading", { name: "Use AI where it earns its place." }).waitFor();
  await page.getByRole("button", { name: /Structure/ }).click();
  const cards = page.locator(".work-card");
  await cards.filter({ has: page.getByRole("heading", { name: "Manaswini Designer Studio Operations System", exact: true }) }).screenshot({ path: "tmp/visual-review/project-manaswini.png", animations: "disabled" });
  await cards.filter({ has: page.getByRole("heading", { name: "ManifestOS", exact: true }) }).screenshot({ path: "tmp/visual-review/project-manifestos.png", animations: "disabled" });
  for (const filter of ["In progress", "Concepts", "All work"]) await page.getByRole("button", { name: filter, exact: true }).click();
  assert.equal(await cards.count(), 7);
  await page.locator(".studio-belief").scrollIntoViewIfNeeded();
  await page.locator(".studio-belief").screenshot({ path: "tmp/visual-review/belief.png", animations: "disabled" });
  await page.locator(".founder-section").scrollIntoViewIfNeeded();
  assert.deepEqual(await page.locator(".founder-image img").evaluateAll(imgs => imgs.map(img => img.getAttribute("alt"))), ["Adarsh Singh Pawar, co-founder of Terrawave", "Rahul Arora, co-founder of Terrawave"]);
  await page.getByRole("link", { name: "Explore ManifestOS", exact: true }).click();
  await page.waitForURL("**/work/manifestos");
  await page.locator(".project-identity-detail").waitFor();
  await page.goto(base + "/systems/ca_automation");
  await page.locator(".identity-ca").waitFor();
  await page.goto(base + "/think");
  await page.locator("#problem").waitFor();
  for (const width of [390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(base);
    await page.getByRole("heading", { name: "ManifestOS", exact: true }).waitFor();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    assert.equal(overflow, false, `No horizontal overflow at ${width}px`);
    if (width === 390) {
      await page.screenshot({ path: "tmp/visual-review/home-mobile.png", animations: "disabled" });
      await page.locator(".system-sculpture").screenshot({ path: "tmp/visual-review/sculpture-mobile.png", animations: "disabled" });
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  assert.equal(await page.locator(".sculpture-orbit").evaluate(el => getComputedStyle(el).animationName), "none");
  assert.equal(await page.locator('[data-reveal="pending"]').count(), 0);
  assert.deepEqual(errors, []);
  console.log("PASS: 7 project identities, platform excluded, logo, fonts, interactive/keyboard hero, filters, detail pages, founders, discovery route, 390/768/1024px layouts, reduced motion and no runtime errors.");
} finally { await browser.close(); }
