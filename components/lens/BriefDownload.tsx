"use client";

import { useState } from "react";
import { briefModel, type BriefInput } from "@/lib/brief-model";

// Browser font rendering preserves the visitor's script in the visual excerpt.
// The complete original is also embedded as a UTF-8 attachment in the PDF.
function statementImage(input: string) {
  const canvas = document.createElement("canvas"); canvas.width = 1480; canvas.height = 174;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare the statement preview.");
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#17201C"; ctx.font = "36px Arial, sans-serif"; ctx.textBaseline = "top";
  const lines: string[] = []; let current = "";
  const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  for (const word of input.replace(/\s+/g, " ").split(" ")) {
    if (ctx.measureText(word).width > canvas.width - 4) {
      if (current) { lines.push(current); current = ""; }
      for (const { segment } of graphemes.segment(word)) {
        if (ctx.measureText(current + segment).width > canvas.width - 4) { lines.push(current); current = segment; }
        else current += segment;
      }
    } else {
      const candidate = current ? `${current} ${word}` : word;
      if (ctx.measureText(candidate).width > canvas.width - 4) { lines.push(current); current = word; }
      else current = candidate;
    }
  }
  if (current) lines.push(current);
  const visible = lines.slice(0, 3);
  if (lines.length > 3) visible[2] = [...graphemes.segment(visible[2])].slice(0, -3).map(s => s.segment).join("") + "…";
  visible.forEach((line, i) => ctx.fillText(line, 0, i * 53));
  return Uint8Array.from(atob(canvas.toDataURL("image/png").split(",")[1]), c => c.charCodeAt(0));
}

export function BriefDownload(data: BriefInput) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const model = briefModel(data);
  async function download() {
    setBusy(true); setMessage("");
    try {
      const { createDiscoveryPdf } = await import("@/lib/brief-pdf");
      const bytes = await createDiscoveryPdf(data, statementImage(data.input));
      const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
      const link = document.createElement("a"); link.href = url; link.download = "terrawave-system-brief.pdf"; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("PDF prepared. Nothing has been submitted to Terrawave.");
    } catch { setMessage("The PDF could not be prepared. Please try again; your problem and assumptions are still here."); }
    finally { setBusy(false); }
  }
  return <section className="visual-brief-handoff" id="discovery"><p className="eyebrow">CONTINUE TO DISCOVERY</p><h2>A brief you can understand<br />at a glance.</h2><p>Two visual pages: the proposed workflow, responsibilities, risks and questions to validate. A selected comparison never removes required approval from the proposed steps.</p><details className="brief-preview"><summary>Preview the proposed workflow</summary><p className="lens-note">Illustrative candidate only. Your current workflow is still unverified.</p>{model.flow.length?<ol className="preview-flow">{model.flow.map(node => <li key={node.task}><small>{node.owner}</small><strong>{node.task}</strong></li>)}</ol>:<p className="lens-note">No workflow is proposed until the business need is clearer.</p>}<p className="lens-note">The full statement, opportunity interpretation, validation requirements and source references are attached to the PDF.</p></details><button className="tw-button" onClick={download} disabled={busy}>{busy ? "Preparing your PDF…" : "Download visual PDF ↗"}</button><p className="small-note">Saved on your device. Nothing is submitted. Online discovery enquiries are coming later.</p><p role="status" className="download-status">{message}</p></section>;
}
