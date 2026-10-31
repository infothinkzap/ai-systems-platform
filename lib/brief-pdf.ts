import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont } from "pdf-lib";
import { briefModel, assumptionLabels, assumptionValues, type BriefInput } from "./brief-model";
import { discoveryBrief, modes } from "./lens";
import { modeLabels } from "./work";

const W = 595.28, H = 841.89, M = 36, CW = W - M * 2;
const colors = { ink: rgb(.09, .125, .11), green: rgb(.03, .498, .357), paper: rgb(.957, .949, .925), mint: rgb(.867, .937, .91), stone: rgb(.847, .835, .80), muted: rgb(.35, .39, .36), white: rgb(1, 1, 1) };
const clean = (text: string) => text.replace(/[–—]/g, "-").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/→|↗/g, ">").replace(/\s+/g, " ");

/** Fixed two-page layout. Long original input and all graph references are attached,
 * rather than shrunk into unreadable text or silently discarded. */
export async function createDiscoveryPdf(data: BriefInput, problemPng?: Uint8Array): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const model = briefModel(data);
  if(model.flow.length>7) throw new Error("This workflow needs a longer brief layout; reduce it to seven scoped steps before exporting.");
  doc.setTitle("Terrawave - System discovery brief");
  doc.setSubject("Unverified visitor description, graph context and provisional system choices");
  doc.setLanguage("en");
  await doc.attach(new TextEncoder().encode(data.input), "original-problem.txt", { mimeType: "text/plain", description: "Full original visitor statement (UTF-8, unverified)" });
  await doc.attach(new TextEncoder().encode(discoveryBrief(data.input, data.context, data.assumptions, data.selected, data.graph)), "context-and-assumptions.txt", { mimeType: "text/plain", description: "Full graph references, relationships, assumptions and uncertainty" });
  await doc.attach(new TextEncoder().encode(JSON.stringify({interpretation:model.opportunity,source_opportunity:data.graph.entities.find(e=>e.id===model.opportunity.opportunityId)??null,visitor_assumptions:data.assumptions,selected_comparison:data.selected},null,2)),"opportunity-and-validation.json",{mimeType:"application/json",description:"Full proposed/inferred steps, canonical source status, risks, clarification answers and graph IDs. Not implementation evidence."});

  function rect(page: PDFPage, x: number, top: number, width: number, height: number, fill = colors.white) {
    page.drawRectangle({ x, y: H - top - height, width, height, color: fill, borderColor: colors.stone, borderWidth: .6 });
  }
  function text(page: PDFPage, value: string, x: number, top: number, width: number, size = 10, maxLines = 3, face: PDFFont = font, color = colors.ink) {
    const words = clean(value).split(" ");
    const lines: string[] = []; let line = "";
    for (const word of words) {
      // Split long tokens too, so a URL or pasted identifier cannot clip a column.
      for (const part of word.match(/.{1,30}/gu) ?? [word]) {
        const candidate = line ? `${line} ${part}` : part;
        if (face.widthOfTextAtSize(candidate, size) > width && line) { lines.push(line); line = part; } else line = candidate;
      }
    }
    if (line) lines.push(line);
    const shown = lines.slice(0, maxLines);
    if (lines.length > maxLines) {
      let last = shown[maxLines - 1];
      while (last && face.widthOfTextAtSize(last + "...", size) > width) last = last.slice(0, -1);
      shown[maxLines - 1] = last + "...";
    }
    shown.forEach((value, index) => page.drawText(value, { x, y: H - top - size - index * size * 1.35, size, font: face, color }));
  }
  function label(page: PDFPage, value: string, top: number, x = M) { text(page, value.toUpperCase(), x, top, CW, 8, 1, bold, colors.green); }
  function page(title: string, number: number) {
    const p = doc.addPage([W, H]);
    p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: colors.paper });
    text(p, "TERRAWAVE", M, 29, 180, 10, 1, bold);
    text(p, "SYSTEM FIRST, AI SECOND", 350, 30, 210, 8, 1, font, colors.muted);
    text(p, title, M, 64, CW, 28, 1, bold);
    p.drawLine({ start: { x: M, y: 47 }, end: { x: W - M, y: 47 }, color: colors.stone, thickness: .7 });
    text(p, "DISCOVERY AID / NOT A VERIFIED SYSTEM DESIGN", M, H - 34, 440, 7, 1, font, colors.muted);
    text(p, `${number} / 2`, W - 64, H - 34, 34, 8, 1, bold);
    return p;
  }
  const p1 = page("The system at a glance", 1);
  label(p1, "Visitor statement / unverified", 117);
  rect(p1, M, 136, CW, 96);
  if (problemPng) {
    const image = await doc.embedPng(problemPng);
    p1.drawImage(image, { x: M + 14, y: H - 150 - 58, width: CW - 28, height: 58 });
  } else {
    let original = clean(data.input);
    try { font.encodeText(original); } catch { original = "The original statement uses characters not supported by this preview. Read the attached UTF-8 original."; }
    text(p1, original, M + 14, 149, CW - 28, 12, 3);
  }
  text(p1, "Excerpt shown when long. Full original description is attached to this PDF.", M + 14, 215, CW - 28, 7.5, 1, font, colors.muted);
  label(p1, "A possible system / concept, needs validation", 250);
  text(p1, model.opportunity.title, M, 268, CW, 18, 2, bold);
  text(p1, model.opportunity.understood, M, 319, CW, 10, 2);
  label(p1, "Current state / unverified", 360);
  text(p1, "Actual workflow order, tools and failure points are not yet verified. The proposed sequence on page 2 is a design hypothesis, not evidence of an existing system.", M, 378, CW, 10, 3);
  label(p1, "Risks and limitations", 423);
  text(p1, model.opportunity.risks.join(" ") || "A concrete business workflow is needed before a useful system can be scoped.", M, 441, CW, 9.5, 3);
  label(p1, "Candidate inputs and responsibilities / unvalidated", 490);
  const mapColumns = [
    { title: "INFORMATION", items: model.information },
    { title: "PROCESSES", items: model.processes },
    { title: "PEOPLE / APPROVALS", items: model.decisions },
  ];
  mapColumns.forEach((col, i) => {
    const width = (CW - 20) / 3, x = M + i * (width + 10);
    rect(p1, x, 500, width, 105);
    text(p1, col.title, x + 12, 512, width - 24, 8, 1, bold, colors.green);
    const items = col.items.length ? col.items.slice(0, 3) : ["Not recorded. Confirm in discovery."];
    text(p1, items.join(" / "), x + 12, 534, width - 24, 10, 4);
  });
  text(p1, `Graph context: ${model.context}. Full source IDs and relationships are attached.`, M, 615, CW, 8, 1, font, colors.muted);
  const evidence = model.systems.map(system => `${system.name}: ${system.maturity_status ?? "stage unrecorded"}${system.deployment_scope ? ` (${system.deployment_scope.replaceAll("_", " ")})` : ""}; evidence: ${system.evidence?.join(", ").replaceAll("_", " ") ?? "not recorded"}`).join(" / ");
  text(p1, evidence || "No supporting system evidence is recorded for this connection.", M, 630, CW, 7.5, 2, font, colors.muted);
  rect(p1, M, 658, CW, 56, colors.mint);
  text(p1, "MAIN UNCERTAINTY", M + 14, 669, CW - 28, 8, 1, bold, colors.green);
  text(p1, model.opportunity.unknowns.slice(0,2).join(" ") || "Visitor answers still need validation against source records and the workflow owner.", M + 14, 688, CW - 28, 9.5, 2);
  label(p1, "A bounded first version to validate", 735);
  text(p1, model.opportunity.mvp, M, 751, CW, 9.5, 3);

  const p2 = page("A candidate to discuss", 2);
  label(p2, "Proposed workflow / candidate allocation by task", 117);
  if (!model.flow.length) text(p2,"No business workflow has been inferred. Clarify the work, its inputs and the useful result before choosing tools.",M,145,CW,12,3);
  model.flow.forEach((node,i)=>{
    const top=140+i*45;
    rect(p2,M,top,CW,40,i%2===0?colors.white:colors.mint);
    text(p2,String(i+1).padStart(2,"0"),M+10,top+13,24,9,1,bold,colors.green);
    text(p2,node.task,M+40,top+7,CW-150,10,2,bold);
    text(p2,node.owner,M+CW-92,top+13,82,8.5,1,font,colors.green);
    if(i<model.flow.length-1) p2.drawLine({start:{x:M+CW/2,y:H-top-40},end:{x:M+CW/2,y:H-top-45},color:colors.green,thickness:.9});
  });
  text(p2,"Proposed/inferred steps, not a deployment. Comparing alternatives below never removes required human approval.",M,461,CW,7.5,1,font,colors.muted);
  label(p2, "Compare alternatives / qualitative, no performance scores", 482);
  const widths = [100, 205, CW - 305], heads = ["APPROACH", "USEFUL WHEN", "TRADE-OFF TO VALIDATE"];
  let x = M;
  heads.forEach((head, i) => { rect(p2, x, 501, widths[i], 24, colors.ink); text(p2, head, x + 9, 509, widths[i] - 18, 7.5, 1, bold, colors.white); x += widths[i]; });
  const rows = [
    ["Human", "Context and accountable judgment matter.", "People need time and consistent criteria."],
    ["Deterministic", "Inputs and rules can be written explicitly.", "Exceptions and bad inputs still need owners."],
    ["Hybrid", "Variable interpretation needs review.", "Evaluation and review queues add work."],
    ["AI", "A bounded, low-stakes task can be evaluated.", "Wrong outputs need monitoring and recovery."],
    ["No AI", "Ownership or information flow is the problem.", "Process repair may retain manual effort."],
  ];
  rows.forEach((row, index) => {
    let left = M; const top = 525 + index * 34;
    row.forEach((cell, column) => {
      rect(p2, left, top, widths[column], 34, data.selected === row[0] ? colors.mint : colors.white);
      const value = column === 0 ? modeLabels[modes[index]].short : cell;
      text(p2, value, left + 9, top + 6, widths[column] - 18, 9, 2, column === 0 ? bold : font);
      left += widths[column];
    });
  });
  label(p2, "Visitor assumptions / not verified", 712);
  const assumptions=Object.entries(data.assumptions).map(([key,value])=>`${assumptionLabels[key as keyof typeof assumptionLabels]}: ${assumptionValues[value]}`).join("; ");
  const answered=model.opportunity.answered.map(a=>`${a.question} ${a.answer}`).join(" ");
  text(p2,assumptions+". "+answered,M,730,CW,8,4);
  text(p2, "Next: validate one real example with the owner. Nothing has been submitted or booked.", M, 779, CW, 8.5, 1, bold);
  return doc.save();
}
