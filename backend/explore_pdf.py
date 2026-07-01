import fitz  # PyMuPDF
import pdfplumber

PDF_PATH = "../sample_reports/sample_lab_report.pdf"

# ── Part 1: PyMuPDF exploration ──────────────────────────
print("="*50)
print("PYMUPDF EXPLORATION")
print("="*50)

doc = fitz.open(PDF_PATH)
print(f"Total pages: {len(doc)}")

for i, page in enumerate(doc):
    text = page.get_text()
    print(f"\n--- Page {i+1} (first 300 chars) ---")
    print(text[:300])

doc.close()

# ── Part 2: pdfplumber table exploration ─────────────────
print("\n" + "="*50)
print("PDFPLUMBER TABLE EXPLORATION")
print("="*50)

with pdfplumber.open(PDF_PATH) as pdf:
    for i, page in enumerate(pdf.pages):
        tables = page.extract_tables()
        print(f"\nPage {i+1}: found {len(tables)} table(s)")
        for t_idx, table in enumerate(tables):
            print(f"  Table {t_idx+1} — {len(table)} rows:")
            for row in table[:5]:  # show first 5 rows
                print(f"    {row}")