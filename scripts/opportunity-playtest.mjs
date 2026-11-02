import assert from "node:assert/strict";
import {createRequire} from "node:module";
import {mkdir} from "node:fs/promises";
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.TERRAWAVE_PLAYWRIGHT||"playwright");
const browser=await chromium.launch({headless:true,channel:"chrome",args:["--disable-gpu", "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "--disable-backgrounding-occluded-windows"]});
const page=await browser.newPage({viewport:{width:1440,height:1000},acceptDownloads:true});
page.setDefaultTimeout(90000);
const errors=[];page.on("pageerror",e=>errors.push(e.message));
await mkdir("tmp/opportunity-playtest",{recursive:true});await mkdir("output/pdf",{recursive:true});
const base=process.env.TERRAWAVE_URL||"http://localhost:3000";
const original="I need something that can make astrological reports for my clients based on my methods.";
try {
  await page.goto(base+"/opportunities",{waitUntil:"networkidle"});
  assert.equal(await page.locator(".possibility-groups li").count(),27);
  await page.getByRole("link",{name:/Practitioner-approved astrology reports/}).click();
  await page.waitForURL("**/opportunities/astrology_reports");
  assert.equal(await page.locator(".opportunity-flow > li").count(),7);
  await page.getByRole("link",{name:"Scope this opportunity ↗",exact:true}).click();
  await page.waitForURL("**/think?opportunity=astrology_reports");
  assert.ok((await page.locator("#problem").inputValue()).includes("astrology"));
  await page.locator("#problem").fill(original);
  await page.getByRole("button",{name:"Find a starting point ↗",exact:true}).click();
  assert.equal(await page.locator(".opportunity-result").getAttribute("data-opportunity-id"),"opportunity:astrology_reports");
  assert.equal(await page.locator(".opportunity-flow > li").count(),7);
  assert.equal(await page.locator(".known-foundations").count(),0);
  assert.ok(!(await page.locator(".interpretation-card").innerText()).toLowerCase().includes("deployed"));
  await page.getByLabel("Is chart data already available, or are chart calculations required?").selectOption("supplied");
  await page.getByLabel("Are your methods and interpretations documented and approved?").selectOption("undocumented");
  assert.match(await page.locator(".opportunity-flow").innerText(),/no new chart calculations assumed/);
  assert.match(await page.locator(".opportunity-flow").innerText(),/Document and approve the practitioner's method before drafting/);
  await page.getByLabel("Are your methods and interpretations documented and approved?").selectOption("documented");
  await page.getByText("Compare people, rules and AI",{exact:true}).click();
  for(const button of await page.locator(".allocation-options button").all()) {
    await button.click();
    assert.ok((await page.locator(".opportunity-flow").innerText()).includes("Practitioner reviews every interpretation and approves"));
  }
  await page.locator(".allocation-options button").nth(3).click();
  const downloadEvent=page.waitForEvent("download");
  await page.getByRole("button",{name:"Download visual PDF ↗",exact:true}).click();
  await (await downloadEvent).saveAs("output/pdf/terrawave-opportunity-brief.pdf");
  await page.getByText("Compare people, rules and AI",{exact:true}).click();
  if (!process.env.TERRAWAVE_SKIP_SCREENSHOTS) await page.locator(".opportunity-flow").screenshot({path:"tmp/opportunity-playtest/astrology-flow-desktop.png",animations:"disabled",timeout:120000});
  if (!process.env.TERRAWAVE_SKIP_SCREENSHOTS) await page.locator(".opportunity-questions").screenshot({path:"tmp/opportunity-playtest/astrology-questions.png",animations:"disabled",timeout:120000});
  await page.getByText("Risks, scope and reusable foundations",{exact:true}).click();
  assert.match(await page.locator(".opportunity-result").innerText(),/No scientific validation of astrological prediction is claimed/);
  const cases=[
    ["Invoice and GST reconciliation","invoice_reconciliation"],
    ["Supplier-statement reconciliation","supplier_statements"],
    ["Customer support automation","customer_inquiries"],
    ["Research report generation","research_reports"],
    ["Inventory management","inventory_exceptions"],
    ["Build a customer portal for our clients","customer_portal"],
    ["Create a creative campaign with branding and graphic design","creative_campaign"],
  ];
  for(const [input,id] of cases){
    await page.getByRole("button",{name:"Start over",exact:true}).click();
    await page.locator("#problem").fill(input);await page.getByRole("button",{name:"Find a starting point ↗",exact:true}).click();
    assert.equal(await page.locator(".opportunity-result").getAttribute("data-opportunity-id"),`opportunity:${id}`);
  }
  for(const [input,status] of [["We need to assign volunteers to event locations.","inferred"],["I need more intelligence.","clarify"],["Plan a holiday.","out_of_scope"]]){
    await page.getByRole("button",{name:"Start over",exact:true}).click();await page.locator("#problem").fill(input);await page.getByRole("button",{name:"Find a starting point ↗",exact:true}).click();
    assert.equal(await page.locator(".opportunity-result").getAttribute("data-status"),status);
    if(status!=="inferred")assert.equal(await page.locator(".opportunity-flow > li").count(),0);
  }
  for(const path of ["/capabilities","/capabilities/creative_production","/capabilities/website_development","/work/terrawave_platform","/systems"]){
    const response=await page.goto(base+path,{waitUntil:"domcontentloaded"});assert.equal(response.status(),200);
    if(path.endsWith("creative_production"))assert.match(await page.locator(".status-tag").first().innerText(),/candidate/i);
    if(path.endsWith("website_development"))assert.match(await page.locator(".status-tag").first().innerText(),/demonstrated here/i);
  }
  await page.setViewportSize({width:390,height:844});
  for(const path of ["/capabilities","/opportunities","/opportunities/astrology_reports","/work/terrawave_platform"]){
    await page.goto(base+path,{waitUntil:"networkidle"});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`Mobile overflow: ${path}`);
    if (!process.env.TERRAWAVE_SKIP_SCREENSHOTS) await page.screenshot({path:`tmp/opportunity-playtest/mobile-${path.replaceAll("/","-")}.png`,animations:"disabled",timeout:120000});
  }
  await page.goto(base+"/think",{waitUntil:"networkidle"});
  await page.getByRole("button",{name:"Reports using my astrology methods ↗",exact:true}).click();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  if (!process.env.TERRAWAVE_SKIP_SCREENSHOTS) await page.locator(".opportunity-flow").screenshot({path:"tmp/opportunity-playtest/astrology-flow-mobile.png",animations:"disabled",timeout:120000});
  assert.deepEqual(errors,[]);
  console.log("PASS: opportunity library, scope-prefill, required cases, targeted chart/method questions, approval retained under all five allocations, inferred/vague/unrelated requests, evidence layers, actual PDF download and mobile layouts.");
}finally{await browser.close();}
