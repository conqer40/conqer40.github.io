import json, re, sys
from pathlib import Path
import pdfplumber

def clean(text):
    text = (text or "").replace("\x00", "")
    fixed = []
    for line in text.splitlines():
        arabic = len(re.findall(r"[\u0600-\u06ff]", line))
        latin = len(re.findall(r"[A-Za-z]", line))
        fixed.append(line[::-1] if arabic > latin * 2 and arabic > 3 else line)
    text = "\n".join(fixed)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()

def extract(path, part):
    chunks = []
    with pdfplumber.open(path) as pdf:
        for start in range(0, len(pdf.pages), 8):
            text = clean("\n".join(page.extract_text(x_tolerance=2, y_tolerance=3) or "" for page in pdf.pages[start:start+8]))
            if len(text) > 120:
                chunks.append({
                    "title": f"منهج البرمجة والذكاء الاصطناعي - الجزء {part} - الصفحات {start+1}-{min(start+8, len(pdf.pages))}",
                    "category": f"البرمجة والذكاء الاصطناعي - الجزء {part}",
                    "content": text,
                    "published": True,
                })
        return len(pdf.pages), chunks

all_chunks = []
summary = []
for path, part in [(Path(sys.argv[1]), 1), (Path(sys.argv[2]), 2)]:
    pages, chunks = extract(path, part)
    summary.append({"part": part, "pages": pages, "chunks": len(chunks)})
    all_chunks.extend(chunks)
Path(sys.argv[3]).write_text(json.dumps(all_chunks, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(summary, ensure_ascii=False))
