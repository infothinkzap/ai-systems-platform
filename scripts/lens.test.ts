import assert from "node:assert/strict";
import { test } from "node:test";
import { getGraph } from "../lib/graph/queries";
import { contextSlice, discoveryBrief, initialAssumptions, matchContext, recommend, type Assumptions } from "../lib/lens";
import { briefModel } from "../lib/brief-model";
import { workItems, maturityLabel } from "../lib/work";
import { createDiscoveryPdf } from "../lib/brief-pdf";
import { PDFDocument } from "pdf-lib";
import { interpretOpportunity } from "../lib/opportunity-interpreter";
import { opportunityEntities, opportunityDetails } from "../lib/graph/opportunities";
import { validateGraph } from "../lib/graph/loader";

const graph = getGraph();
test("lexical matches use real graph contexts and unknown text stays unresolved", () => {
  assert.deepEqual(matchContext("purple moon zeppelins", graph), []);
  assert.deepEqual(matchContext("", graph), []);
  const candidates = matchContext("manual reconciliation of invoices and GST records", graph);
  assert.ok(candidates.some(e => e.id === "problem:manual_reconciliation"));
  assert.ok(matchContext("leads lost fragmented conversations", graph).some(e => e.id === "problem:lost_leads"));
  assert.ok(matchContext("manual inventory tracking store operations", graph).some(e => e.id === "problem:manual_inventory_tracking"));
  assert.deepEqual(matchContext("lead lead lead", graph), matchContext("lead", graph));
});

test("work browsing retains deployment scope and uses only graph relationships", () => {
  const items = workItems(graph);
  assert.equal(items.length, 8);
  assert.ok(!items.some(item => item.system.id === "project:terrawave_platform"));
  const manifest = items.find(item => item.system.id === "project:manifestos")!;
  assert.equal(manifest.href, "/work/manifestos");
  assert.equal(manifest.system.maturity_status, "prototype");
  assert.ok(manifest.evidence.includes("prototype_evidence"));
  assert.equal(manifest.workflows.length, 3);
  assert.ok(items.slice(0, 2).every(item => item.system.maturity_status === "deployed"));
  const ca = items.find(item => item.system.id === "product:ca_automation")!;
  assert.equal(maturityLabel(ca.system), "Deployed in limited capacity");
  for (const item of items) for (const entity of [...item.problems, ...item.workflows, ...item.capabilities]) {
    assert.ok(graph.relationships.some(r => [r.source, r.target].includes(item.system.id) && [r.source, r.target].includes(entity.id)));
  }
});

test("visual model preserves unknown workflow order and separates selected approach from recommendation", () => {
  const data = { input: "Invoice and GST reconciliation", context: "problem:manual_reconciliation", assumptions: initialAssumptions, selected: "AI" as const, graph };
  const model = briefModel(data);
  assert.equal(model.recommendation.mode, null);
  assert.ok(model.processes.length > 0);
  assert.equal(model.flow[1].owner, "Hybrid");
  assert.ok(model.decisions.length>0); // Proposed human responsibilities, not verified decisions.
  assert.equal(briefModel({ ...data,input:"purple moon zeppelins", context: null }).context, "No supported graph connection");
});

test("required workflow cases retrieve opportunities without claiming new deployments", () => {
  const cases = [
    ["I need something that can make astrological reports for my clients based on my methods.","astrology_reports"],
    ["Invoice and GST reconciliation","invoice_reconciliation"],
    ["Manual reconciliation blocks our team.","invoice_reconciliation"],
    ["Supplier-statement reconciliation","supplier_statements"],
    ["Customer support automation","customer_inquiries"],
    ["Research report generation","research_reports"],
    ["Inventory management","inventory_exceptions"],
    ["Build a customer portal for our clients","customer_portal"],
    ["Build a website for my business","business_website"],
    ["Create a branding and graphic design campaign for my business","creative_campaign"],
    ["Repurpose our authorized footage into social media video clips","video_social"],
  ];
  for(const [input,id] of cases){
    const result=interpretOpportunity(input,graph);
    assert.equal(result.opportunityId,`opportunity:${id}`,input);
    assert.equal(result.status,"matched");
    assert.ok(result.steps.length>=4&&result.unknowns.length>0&&result.risks.length>0);
    assert.ok(result.steps.every(step=>step.provenance==="proposed"));
  }
  const astrology=interpretOpportunity(cases[0][0],graph);
  assert.deepEqual(astrology.relatedWorkIds,[]);
  assert.equal(astrology.steps.length,7);
  assert.equal(astrology.steps[1].mode,"Deterministic");
  assert.equal(astrology.steps[3].mode,"AI");
  assert.equal(astrology.steps[5].mode,"Human");
  assert.ok(astrology.risks.some(r=>r.includes("No scientific validation")));
  const answered=interpretOpportunity(cases[0][0],graph,{chart_data:"supplied",approved_methods:"undocumented"});
  assert.match(answered.steps[1].name,/no new chart calculations/);
  assert.match(answered.steps[2].name,/Document and approve/);
  assert.equal(answered.answered.length,2);
  assert.ok(answered.steps[5].name.includes("approves"));
});

test("unmatched business work is an inferred hypothesis; vague and personal requests are not forced",()=>{
  const inferred=interpretOpportunity("We need to assign volunteers to event locations.",graph);
  assert.equal(inferred.status,"inferred");
  assert.ok(inferred.steps.length>0&&inferred.steps.every(s=>s.provenance==="inferred"));
  assert.deepEqual(inferred.relatedWorkIds,[]);
  assert.ok(inferred.steps.every(s=>s.mode!=="AI"));
  assert.equal(interpretOpportunity("I need more intelligence.",graph).status,"clarify");
  assert.equal(interpretOpportunity("invoices",graph).status,"clarify");
  const travel=interpretOpportunity("Plan a holiday.",graph);
  assert.equal(travel.status,"out_of_scope");
  assert.deepEqual(travel.steps,[]); assert.deepEqual(travel.capabilityIds,[]);
  assert.deepEqual(interpretOpportunity("purple moon zeppelins",graph).relatedWorkIds,[]);
});

test("opportunity graph content is complete, connected and bounded for visual briefs",()=>{
  const patterns=opportunityEntities(graph);assert.equal(patterns.length,27);
  for(const pattern of patterns){
    assert.equal(pattern.maturity_status,"concept");assert.equal(pattern.epistemic_status,"hypothesis");
    assert.equal(pattern.validation_status,"needs_validation");
    const data=opportunityDetails(graph,pattern);
    assert.ok(data.steps.length>=4&&data.steps.length<=7);
    assert.ok(data.inputs.length&&data.outputs.length&&data.risks.length&&data.validation.length&&data.capabilities.length);
    assert.ok(data.steps.every(s=>s.mode&&s.responsibility));
  }
  assert.equal(graph.entities.filter(e=>e.type==="Product").length,6);
  assert.equal(graph.entities.find(e=>e.id==="product:examos"&&e.type==="Product")?.type,"Product");
  for(const name of ["VedaSI","StoryOS","Indian Pioneers Award"]) assert.ok(!graph.entities.some(e=>e.name===name),`Unverified work must not be invented: ${name}`);
});

test("validator rejects unearned opportunity maturity and demonstrated capability claims",()=>{
  const copy=structuredClone(graph);
  const pattern=copy.entities.find(e=>e.type==="Opportunity")!;
  Object.assign(pattern,{maturity_status:"deployed"});
  assert.throws(()=>validateGraph(copy),/unvalidated concept/);
  const promoted=structuredClone(graph);
  Object.assign(promoted.entities.find(e=>e.id==="cap:creative_production")!,{support_status:"demonstrated"});
  assert.throws(()=>validateGraph(promoted),/lacks project evidence/);
});

test("opportunity brief keeps practitioner review even when AI comparison is selected",async()=>{
  const data={input:"I need astrological reports for my clients based on my methods.",context:null,assumptions:initialAssumptions,selected:"AI" as const,answers:{chart_data:"calculate",approved_methods:"documented"},graph};
  const model=briefModel(data);
  assert.equal(model.flow.length,7);assert.equal(model.flow[5].owner,"Human");
  assert.ok(model.flow[1].task.includes("Agree chart engine"));
  const doc=await PDFDocument.load(await createDiscoveryPdf(data));assert.equal(doc.getPageCount(),2);
});

test("PDF remains two readable A4 pages for long and unsupported input", async () => {
  for (const input of ["Manual reconciliation", "Long description ".repeat(120), "हिसाब और invoices 😀"]) {
    const bytes = await createDiscoveryPdf({ input, context: null, assumptions: initialAssumptions, selected: null, graph });
    const pdf = await PDFDocument.load(bytes);
    assert.equal(pdf.getPageCount(), 2);
    assert.ok(Math.abs(pdf.getPages()[0].getWidth() - 595.28) < .01);
    assert.equal(pdf.getTitle(), "Terrawave - System discovery brief");
  }
});
test("context reveals only graph-recorded edges with available endpoints", () => {
  const slice = contextSlice("problem:manual_reconciliation", graph);
  assert.ok(slice.relationships.length > 0);
  for (const r of slice.relationships) {
    assert.ok(graph.relationships.includes(r));
    assert.ok(slice.entities.some(e => e.id === r.source));
    assert.ok(slice.entities.some(e => e.id === r.target));
  }
  assert.ok(slice.entities.some(e => e.id === "product:ca_automation"));
});
test("allocation retains uncertainty and every mode is reachable for stated reasons", () => {
  assert.equal(recommend(initialAssumptions).mode, null);
  const base: Assumptions = { data: "ready", rules: "fixed", stakes: "low", judgment: "no" };
  assert.equal(recommend(base).mode, "Deterministic");
  assert.equal(recommend({ ...base, data: "fragmented" }).mode, "No AI");
  assert.equal(recommend({ ...base, judgment: "yes", stakes: "high" }).mode, "Human");
  assert.equal(recommend({ ...base, rules: "variable", stakes: "high" }).mode, "Hybrid");
  assert.equal(recommend({ ...base, rules: "variable" }).mode, "AI");
  for (const key of Object.keys(base)) assert.equal(recommend({ ...base, [key]: "unknown" }).mode, null);
});
test("brief preserves input, unresolved context, evidence and selected comparison", () => {
  const brief = discoveryBrief("My workflow", "problem:manual_reconciliation", initialAssumptions, "No AI", graph);
  assert.match(brief, /My workflow/);
  assert.match(brief, /product:ca_automation/);
  assert.match(brief, /maturity: deployed/);
  assert.match(brief, /PROVISIONAL RECOMMENDATION: Unresolved/);
  assert.match(brief, /COMPARISON SELECTED: No AI/);
  assert.match(discoveryBrief("unknown", null, initialAssumptions, null, graph), /No supported context found/);
});
