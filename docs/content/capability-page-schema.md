# Capability Page Schema

Defines the structure for technical capability pages (e.g., `/capabilities/document-intelligence`).

## 1. Frontmatter (MDX)
```yaml
id: "cap:doc_intelligence"
title: "Document Intelligence"
short_desc: "Extracting structured JSON from unstructured visual data."
```

## 2. Dynamic Graph Injection
- **Data Processed**: `EXTRACTS_FROM`, `TRANSFORMS` → (e.g., `data:invoices`, `data:syllabus`)
- **Systems Powered**: Backlinks from `USES` → (e.g., `product:ca_automation`)

## 3. Editorial Body (Human Written)

### The Core Primitive
What exactly is this capability? (Avoid marketing fluff, focus on technical reality).

### How It Works
The pipeline. E.g., OCR → Layout Analysis → LLM Information Extraction → Schema Validation.

### Constraints & Edge Cases
Honesty builds trust. What does this capability struggle with? (e.g., "Handwritten invoices with smudged ink require human routing").

### Real-World Application
Link to the Systems that use it, showing how an abstract capability creates a concrete outcome.
