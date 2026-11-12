"""Builds assets/docs/technext-2027-bir-audit-guide.pdf, the "Download 2027 BIR Audit Guide" on the home page
(12 Nov 2026 overhaul brief). The text is the published article blog/bir-audit-readiness-odoo.html, word for word
(its .prose block: key takeaways, every section, sources and FAQ); only the cover and layout are new. Pictures and
the interactive demo are left out. Re-run after the article changes:

    python _src/build.py && python _src/make_audit_guide.py
"""
import pathlib, re, subprocess, tempfile, os

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "blog" / "bir-audit-readiness-odoo.html"
OUT = ROOT / "assets" / "docs" / "technext-2027-bir-audit-guide.pdf"
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

html = SRC.read_text(encoding="utf-8-sig")
start = html.index('<div class="prose">') + len('<div class="prose">')
# the prose block ends where the article footer starts; take up to the closing tag that balances it
depth, i = 1, start
for m in re.finditer(r"<(/?)div\b[^>]*>", html[start:]):
    depth += -1 if m.group(1) else 1
    if depth == 0:
        i = start + m.start()
        break
body = html[start:i]
cut = re.search(r'<nav\b|<div class="post-about"|<p class="actions post-act"', body)   # related posts, about box, buttons
if cut:
    body = body[:cut.start()]
body = re.sub(r"<figure\b.*?</figure>", "", body, flags=re.S)          # pictures
body = re.sub(r"<img\b[^>]*>", "", body)
body = re.sub(r"<svg\b.*?</svg>", "", body, flags=re.S)
body = re.sub(r'<div class="(?:demo|dk-|art-demo|post-demo)[^"]*".*?</div>\s*</div>', "", body, flags=re.S)
body = re.sub(r"<(script|button)\b.*?</\1>", "", body, flags=re.S)
body = re.sub(r"<details\b[^>]*>", "<div class=\"qa\">", body).replace("</details>", "</div>")
body = re.sub(r"<summary\b[^>]*>(.*?)</summary>", r"<h3>\1</h3>", body, flags=re.S)
body = re.sub(r' href="(?!https?:)[^"]*"', "", body)                     # site-relative links mean nothing on paper

logo = (ROOT / "assets" / "img" / "logo-horizontal.png").as_uri()
page = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>2027 BIR Audit Guide | TechNext</title>
<style>
@page{{size:A4;margin:18mm 17mm 18mm}}
*{{box-sizing:border-box}}
body{{margin:0;font:10.5pt/1.55 "Segoe UI",Inter,Arial,sans-serif;color:#1F1F3D}}
.cover{{height:255mm;display:flex;flex-direction:column;justify-content:space-between;padding:6mm 0;page-break-after:always}}
.cover img{{width:46mm}}
.cover .k{{color:#3167CA;font:700 10pt/1 "Segoe UI",Arial;letter-spacing:.12em;text-transform:uppercase;margin:0 0 6mm}}
.cover h1{{font:800 36pt/1.08 "Segoe UI",Arial;color:#0F2552;margin:0 0 6mm;letter-spacing:-.01em}}
.cover .sub{{font-size:13pt;color:#475569;max-width:140mm;margin:0}}
.cover .band{{border-top:3px solid #0F2552;padding-top:5mm;color:#475569;font-size:9.5pt}}
.cover .band b{{color:#0F2552}}
h2{{font:800 16pt/1.25 "Segoe UI",Arial;color:#0F2552;margin:9mm 0 3mm;page-break-after:avoid}}
h3{{font:700 11.5pt/1.3 "Segoe UI",Arial;color:#0F2552;margin:5mm 0 2mm;page-break-after:avoid}}
p,li{{orphans:3;widows:3}}
ul,ol{{padding-left:6mm}}
li{{margin:1.2mm 0}}
strong{{color:#0F2552}}
table{{width:100%;border-collapse:collapse;margin:3mm 0 4mm;font-size:9.5pt;page-break-inside:avoid}}
th,td{{text-align:left;vertical-align:top;padding:2mm 2.4mm;border-bottom:1px solid #E2E8F0}}
th{{background:#F5F7FA;color:#0F2552}}
.post-key{{background:#EEF3FB;border-left:3px solid #3167CA;padding:3mm 5mm;margin:0 0 5mm}}
.post-key-h{{font-weight:800;color:#0F2552;margin:0 0 1mm}}
.qa{{page-break-inside:avoid}}
a{{color:#1E4691;text-decoration:none}}
.foot{{margin-top:10mm;padding-top:4mm;border-top:1px solid #E2E8F0;color:#64748B;font-size:8.5pt}}
</style></head><body>
<section class="cover">
  <img src="{logo}" alt="TechNext">
  <div>
    <p class="k">BIR compliance guide</p>
    <h1>2027 BIR Audit Guide</h1>
    <p class="sub">The 2026 audit rules that apply when examiners review your 2026 books: the eLA, the 10-day document rule, how long to keep records, what examiners ask for, and a routine for audit requests.</p>
  </div>
  <div class="band"><b>TechNext Pte. Ltd.</b> · Singapore HQ · Taguig City, Metro Manila · technext.asia<br>
  General information only, not tax or legal advice. TechNext is not affiliated with the Bureau of Internal Revenue.</div>
</section>
{body}
<p class="foot">From the TechNext article "BIR audit in 2026: the eLA rules, and how your Odoo records help" (technext.asia/blog/bir-audit-readiness-odoo). Book a technical readiness call at technext.asia.</p>
</body></html>"""

OUT.parent.mkdir(parents=True, exist_ok=True)
with tempfile.TemporaryDirectory() as td:
    src = pathlib.Path(td) / "guide.html"
    src.write_text(page, encoding="utf-8")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", f"--user-data-dir={td}/p", "--no-pdf-header-footer",
                    f"--print-to-pdf={OUT}", src.as_uri()], check=True, capture_output=True, timeout=120)
print(OUT, OUT.stat().st_size)
