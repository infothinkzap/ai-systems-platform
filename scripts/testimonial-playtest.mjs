import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.TERRAWAVE_PLAYWRIGHT||"playwright");
const browser=await chromium.launch({headless:true,channel:"chrome",args:["--disable-gpu", "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "--disable-backgrounding-occluded-windows"]});
try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  page.setDefaultTimeout(90000);
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto(process.env.TERRAWAVE_URL||"http://localhost:3000",{waitUntil:"domcontentloaded"});
  assert.equal(await page.locator(".work-card").count(),8);
  assert.equal(await page.locator(".work-card .status-tag,.work-filters").count(),0);
  assert.equal(await page.locator(".testimonial-role").count(),13);
  assert.equal(await page.locator(".testimonial-grid blockquote").count(),13);
  assert.equal(await page.locator(".testimonial-draft-notice").count(),0);
  assert.ok(!/PROPOSED WORDING|LOCAL REVIEW/.test(await page.locator("#testimonials").innerText()));
  assert.equal(await page.locator(".testimonial-avatar,.testimonial-grid img").count(),0);
  const stories=page.locator(".testimonial-story");
  assert.equal(await stories.count(),11);
  assert.equal(await page.locator(".case-ideas").count(),13);
  for(let i=0;i<await stories.count();i++){
    const story=stories.nth(i);await story.locator("summary").click();
    const controls=story.locator(".case-step-buttons button");
    assert.equal(await controls.count(),3);
    for(let j=0;j<3;j++){
      await controls.nth(j).focus();await page.keyboard.press("Enter");
      assert.equal(await controls.nth(j).getAttribute("aria-pressed"),"true");
      assert.equal(await story.locator('button[aria-pressed="true"]').count(),1);
      const title=await story.locator(".case-step-detail h4").innerText();
      assert.ok((await controls.nth(j).innerText()).includes(title));
    }
    await story.locator(".case-outcome").waitFor();
    await story.locator("summary").click();
  }
  for(const width of [390,768]){
    await page.setViewportSize({width,height:844});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`Overflow at ${width}`);
  }
  await page.emulateMedia({reducedMotion:"reduce"});
  await stories.first().locator("summary").click();
  await stories.first().locator("button").last().click();
  assert.deepEqual(errors,[]);
  console.log("PASS testimonial review: 13 career attributions, 11 expandable stories/33 keyboard step transitions, text-only suggestions, no avatars/status badges, mobile/reduced motion, no runtime errors.");
}finally{await browser.close();}
