// Local, isolated browser checks. Use a bundled Playwright via TERRAWAVE_PLAYWRIGHT
// when it is not installed in the repository. No user's browser profile is opened.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.TERRAWAVE_PLAYWRIGHT || "playwright");
const browser = await chromium.launch({ headless: true, channel: "chrome", args: ["--disable-gpu"] });
const base = process.env.TERRAWAVE_URL || "http://localhost:3000";
await mkdir("tmp/playtest", { recursive: true });
await mkdir("output/pdf", { recursive: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
const page = await context.newPage();
page.setDefaultTimeout(90000);
const errors = [];
page.on("pageerror", e => errors.push(e.message));
if (process.env.TERRAWAVE_KEYBOARD_ONLY) {
  try {
    await page.goto(base + "/think", { waitUntil: "networkidle" });
    await page.locator("#problem").focus();
    await page.keyboard.type("Manual reconciliation blocks our team.");
    await page.keyboard.press("Tab");
    assert.match(await page.evaluate(() => document.activeElement.textContent), /Find a starting point/);
    await page.keyboard.press("Enter");
    await page.locator(".interpretation-card").waitFor();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: "tmp/playtest/lens-interpretation.png", animations: "disabled", timeout: 120000 });
    await page.locator(".graph-disclosure > summary").focus();
    await page.keyboard.press("Space");
    assert.equal(await page.locator(".graph-disclosure").getAttribute("open"), "");
    await page.keyboard.press("Space");
    assert.equal(await page.locator(".graph-disclosure").getAttribute("open"), null);
    await page.locator(".allocation-disclosure > summary").focus();
    await page.keyboard.press("Enter");
    for (const button of await page.locator(".allocation-options button").all()) {
      await button.focus(); await page.keyboard.press("Enter");
      assert.equal(await button.getAttribute("aria-pressed"), "true");
    }
    await page.getByRole("button", { name: "Edit problem", exact: true }).focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#problem").evaluate(e => e === document.activeElement), true);
    await page.getByRole("button", { name: "Find a starting point ↗", exact: true }).focus();
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Start over", exact: true }).focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#problem").inputValue(), "");
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(base, { waitUntil: "networkidle" });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "320px homepage overflow");
    await page.goto(base + "/think", { waitUntil: "networkidle" });
    const original = "हमारी टीम invoices की reconciliation करती है 😀. " + "A detailed handoff description. ".repeat(35);
    await page.locator("#problem").fill(original);
    await page.getByRole("button", { name: "Find a starting point ↗", exact: true }).click();
    assert.equal(await page.locator(".visitor-quote").innerText().then(t => t.length < 290), true);
    const downloadEvent = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download visual PDF ↗", exact: true }).click();
    await (await downloadEvent).saveAs("tmp/pdfs/long-unicode.pdf");
    assert.deepEqual(errors, []);
    console.log("PASS: keyboard entry/submission, native disclosures, all allocation buttons, edit focus, restart, 320px layout, long/Unicode PDF download.");
  } finally { await browser.close(); }
  process.exit(0);
}
try {
  await page.goto(base, { waitUntil: "networkidle", timeout: 120000 });
  assert.equal(await page.locator(".hero-paths").getByRole("link", { name: "Explore our work", exact: true }).count(), 1);
  assert.equal(await page.locator(".hero-paths").getByRole("link", { name: "Map your problem", exact: true }).count(), 1);
  assert.equal(await page.locator("#problem").count(), 0);
  await page.screenshot({ path: "tmp/playtest/home-desktop.png", fullPage: false, animations: "disabled", timeout: 120000 });
  await page.locator(".hero-paths").getByRole("link", { name: "Explore our work", exact: true }).click();
  await page.waitForURL("**/systems");
  await page.getByRole("button", { name: "In use", exact: true }).click();
  assert.equal(await page.locator(".work-card").count(), 2);
  assert.match(await page.locator(".work-grid").innerText(), /limited capacity/i);
  await page.locator('.work-card-title[href="/systems/ca_automation"]').click();
  await page.waitForURL("**/systems/ca_automation");
  await page.getByRole("heading", { name: "The problem it addresses", exact: true }).waitFor();
  assert.equal(await page.locator(".system-overview a[href^='/capabilities/']").count() > 0, true);
  await page.locator(".system-overview a[href^='/capabilities/']").first().click();
  await page.waitForURL("**/capabilities/**");
  assert.ok(await page.locator(".work-card").count() > 0);
  for (const path of ["/capabilities", "/services", "/case-studies", "/explore", "/systems/manaswini_operations"]) {
    const response = await page.goto(base + path, { waitUntil: "domcontentloaded" });
    assert.equal(response.status(), 200, path);
  }
  await page.goto(base + "/think", { waitUntil: "networkidle" });
  assert.equal(await page.locator(".lens-result").count(), 0);
  await page.getByRole("button", { name: "Invoices take hours to reconcile ↗", exact: true }).click();
  await page.locator(".interpretation-card h2").waitFor();
  assert.match(await page.locator(".interpretation-card h2").innerText(), /Invoice extraction and reconciliation/);
  assert.equal(await page.locator(".graph-disclosure").getAttribute("open"), null);
  assert.equal(await page.locator(".allocation-disclosure").getAttribute("open"), null);
  await page.getByText("Look inside the system map", { exact: true }).click();
  assert.ok(await page.locator(".entity-card").count() > 0);
  await page.locator(".entity-card summary").first().click();
  await page.getByText("Look inside the system map", { exact: true }).click();
  await page.getByText("Compare people, rules and AI", { exact: true }).click();
  const select = async (label, value) => page.getByLabel(label).selectOption(value);
  await select("Can people trust the information?", "ready");
  await select("Can you write down the rules?", "fixed");
  await select("What happens if it goes wrong?", "low");
  await select("Does someone need to use judgment?", "no");
  assert.match(await page.locator(".quick-finding h3").innerText(), /Rules do the work/);
  await select("Can people trust the information?", "fragmented");
  assert.match(await page.locator(".quick-finding h3").innerText(), /Simplify/);
  await select("Can people trust the information?", "ready");
  await select("Can you write down the rules?", "variable");
  await select("What happens if it goes wrong?", "high");
  await select("Does someone need to use judgment?", "yes");
  assert.match(await page.locator(".quick-finding h3").innerText(), /People decide/);
  await select("Does someone need to use judgment?", "no");
  assert.match(await page.locator(".quick-finding h3").innerText(), /AI helps, people check/);
  await select("What happens if it goes wrong?", "low");
  assert.match(await page.locator(".quick-finding h3").innerText(), /AI handles a bounded task/);
  const comparisons = [];
  for (const button of await page.locator(".allocation-options button").all()) {
    await button.click();
    assert.equal(await button.getAttribute("aria-pressed"), "true");
    comparisons.push(await page.locator(".consequence").innerText());
  }
  assert.equal(new Set(comparisons).size, 5);
  await page.getByRole("button", { name: "Edit problem", exact: true }).click();
  await page.locator("#problem").fill("Invoices and GST reconciliation are slow.");
  await page.getByRole("button", { name: "Find a starting point ↗", exact: true }).click();
  assert.match(await page.locator(".quick-finding h3").innerText(), /AI handles a bounded task/);
  await page.getByText("Compare people, rules and AI", { exact: true }).click();
  assert.equal(await page.getByLabel("Can people trust the information?").inputValue(), "ready");
  await page.getByText("Compare people, rules and AI", { exact: true }).click();
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download visual PDF ↗", exact: true }).click();
  const download = await downloadEvent;
  assert.equal(download.suggestedFilename(), "terrawave-system-brief.pdf");
  await download.saveAs("output/pdf/terrawave-system-brief.pdf");
  await page.screenshot({ path: "tmp/playtest/lens-result-desktop.png", fullPage: false, animations: "disabled", timeout: 120000 });
  await page.getByRole("button", { name: "Start over", exact: true }).click();
  assert.equal(await page.locator("#problem").inputValue(), "");
  await page.locator("#problem").fill("purple moon zeppelins");
  await page.getByRole("button", { name: "Find a starting point ↗", exact: true }).click();
  await page.getByRole("heading", { name: "What work should change?", exact: true }).waitFor();
  assert.equal(await page.locator(".graph-disclosure").count(), 0);
  await page.getByRole("button", { name: "Start over", exact: true }).click();
  await page.getByRole("button", { name: "Leads slip through the cracks ↗", exact: true }).click();
  await page.getByText("Change the related work context", { exact: true }).click();
  await page.locator("#context").selectOption("");
  assert.equal(await page.locator(".graph-disclosure").count(), 0);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", "/systems", "/think", "/capabilities", "/services", "/case-studies"]) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Mobile overflow: ${path}`);
    await page.screenshot({ path: `tmp/playtest/mobile-${path.replaceAll("/", "") || "home"}.png`, fullPage: false, animations: "disabled", timeout: 120000 });
  }
  await page.goto(base + "/think", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Stock records are hard to trust ↗", exact: true }).click();
  await page.getByText("Compare people, rules and AI", { exact: true }).click();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  await page.screenshot({ path: "tmp/playtest/lens-result-mobile.png", fullPage: false, animations: "disabled", timeout: 120000 });
  assert.deepEqual(errors, []);
  console.log("PASS: both visitor paths, work filters, system/capability links, graph interaction, all five allocations, edit/restart, unsupported input, PDF download and mobile overflow checks.");
} finally { await browser.close(); }
