import json, sys
from pathlib import Path

source = Path(sys.argv[1])
target = Path(sys.argv[2])
rows = json.loads(source.read_text(encoding="utf-8"))

def q(value):
    return "'" + str(value).replace("'", "''") + "'"

sql = [
    "-- Generated from the two official Egyptian Baccalaureate curriculum PDFs.",
    "delete from public.ai_knowledge where category like 'البرمجة والذكاء الاصطناعي - الجزء %';",
]
for row in rows:
    sql.append(
        "insert into public.ai_knowledge (title, category, content, published) values "
        f"({q(row['title'])}, {q(row['category'])}, {q(row['content'])}, true);"
    )
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text("\n\n".join(sql) + "\n", encoding="utf-8")
print(f"wrote {len(rows)} curriculum chunks to {target}")
