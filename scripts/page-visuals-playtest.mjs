import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.TERRAWAVE_PLAYWRIGHT||"playwright");
const browser=await chromium.launch({headless:true,channel:"chrome",args:["--disable-gpu", "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "--disable-backgrounding-occluded-windows"]});
const base=process.env.TERRAWAVE_URL||"http://localhost:3000";
await mkdir("tmp/page-visuals",{recursive:true});
const errors=[];
try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  page.setDefaultTimeout(90000);
  page.on("pageerror",error=>errors.push(error.message));
  await page.goto(base+"/systems");
  assert.equal(await page.locator(".work-card").count(),8);
  assert.equal(await page.locator('.work-card a[href="/work/terrawave_platform"]').count(),0);
  await page.goto(base+"/think");
  await page.locator(".guide-mapping").waitFor();
  if (!process.env.TERRAWAVE_SKIP_SCREENSHOTS) await page.screenshot({path:"tmp/page-visuals/mapping-desktop.png",animations:"disabled"});
  await page.getByRole("button",{name:"Reports using my astrology methods ↗",exact:true}).click();
  assert.equal(await page.locator(".workflow-overview li").count(),7);
  assert.equal(await page.locator(".opportunity-flow > li").count(),7);
  assert.equal(await page.locator('.workflow-overview li[data-mode="Human"]').count()>0,true);
  const before=await page.locator(".workflow-overview").innerText();
  await page.locator(".clarification-fields select").first().selectOption("supplied");
  const after=await page.locator(".workflow-overview").innerText();
  assert.notEqual(before,after,"Overview follows actual clarified steps");
  assert.match(after,/no new chart calculations assumed/);
  if (!process.env.TERRAWAVE_SKIP_SCREENSHOTS) await page.locator(".workflow-overview").screenshot({path:"tmp/page-visuals/workflow-desktop.png",animations:"disabled"});
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,"Mapping result fits phone");
  if (!process.env.TERRAWAVE_SKIP_SCREENSHOTS) await page.locator(".workflow-overview").screenshot({path:"tmp/page-visuals/workflow-mobile.png",animations:"disabled"});
  const routes=[
    ["/think",".guide-mapping"], ["/capabilities",".guide-capabilities"],
    ["/capabilities/web_application_development",".guide-capabilities"], ["/services",".guide-services"],
    ["/opportunities",".guide-possibilities"], ["/opportunities/astrology_reports",".workflow-overview"],
    ["/case-studies",".guide-evidence"], ["/work/manifestos",".identity-manifest"],
    ["/systems/ca_automation",".identity-ca"], ["/path-that-does-not-exist",".guide-missing"],
  ];
  for(const [route,visual]of routes){
    await page.goto(base+route,{waitUntil:"domcontentloaded"});
    await page.locator(visual).waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,route+" fits phone");
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(base+"/capabilities");
  if (!process.env.TERRAWAVE_SKIP_SCREENSHOTS) await page.locator(".visual-guide").screenshot({path:"tmp/page-visuals/capabilities.png",animations:"disabled"});
  await page.goto(base+"/explore");
  await page.locator(".control-room-identity .identity-manaswini").waitFor();
  await page.getByRole("combobox",{name:"Choose a system to explore"}).selectOption("product:ca_automation");
  await page.locator(".control-room-identity .identity-ca").waitFor();
  if (!process.env.TERRAWAVE_SKIP_SCREENSHOTS) await page.locator(".control-room-identity").screenshot({path:"tmp/page-visuals/explore.png",animations:"disabled"});
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,"Explore fits phone");
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto(base+"/think");
  await page.locator(".guide-mapping").waitFor();
  assert.deepEqual(errors,[]);
  console.log("PASS: platform excluded; all page families have visuals; mapping overview follows clarified steps; Explore artwork follows selection; mobile layouts and runtime checks pass.");
}finally{await browser.close();}
