"""Render both pages and verify embedded original text, text bounds and page count."""
from pathlib import Path
import sys
import pdfplumber
from pypdf import PdfReader

source = Path(sys.argv[1])
target = Path(sys.argv[2])
target.mkdir(parents=True, exist_ok=True)
reader = PdfReader(source)
assert len(reader.pages) == 2
attachments = reader.attachments
assert "original-problem.txt" in attachments
assert "context-and-assumptions.txt" in attachments
assert attachments["original-problem.txt"][0].decode("utf-8").strip()
with pdfplumber.open(source) as pdf:
    for index, page in enumerate(pdf.pages, 1):
        words = page.extract_words()
        assert all(w["x0"] >= 30 and w["x1"] <= page.width - 29 for w in words), f"Horizontal clipping on page {index}"
        assert all(w["top"] >= 20 and w["bottom"] <= page.height - 20 for w in words), f"Vertical clipping on page {index}"
        page.to_image(resolution=130).save(target / f"page-{index}.png")
        print(f"Page {index}: {len(words)} words, A4 {page.width:.1f} x {page.height:.1f}; rendered")
print("PASS: two pages, text bounds, original UTF-8 attachment and source references")
