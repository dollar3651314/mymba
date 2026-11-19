"""把简单 Markdown（# 标题、## 小节、- 列表、| 表格 |、> 提示、**加粗**）转成中文对照版 Word。
用法：python3 scripts/docs/build_cn.py in.md out.docx"""
import re, sys
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
src, out = sys.argv[1], sys.argv[2]
doc = Document(); s = doc.sections[0]
s.page_width, s.page_height = Cm(21), Cm(29.7)
for m in ('left_margin', 'right_margin'): setattr(s, m, Cm(2.2))
BLUE = RGBColor(0x1F, 0x3F, 0x66)
def fmt(r, size=11, bold=None, color=None):
    r.font.name = 'Microsoft YaHei'; r._element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'), 'Microsoft YaHei')
    r.font.size = Pt(size)
    if bold is not None: r.bold = bold
    if color: r.font.color.rgb = color
def runs(p, t, size=11, color=None):
    for part in re.split(r'(\*\*[^*]+\*\*)', t):
        if part: fmt(p.add_run(part.strip('*') if part.startswith('**') else part), size, part.startswith('**') or None, color)
def para(line=1.5, after=6, left=None, first=None):
    p = doc.add_paragraph(); f = p.paragraph_format; f.line_spacing = line; f.space_after = Pt(after)
    if left is not None: f.left_indent = Cm(left)
    if first is not None: f.first_line_indent = Cm(first)
    return p
def shade(c):
    sh = OxmlElement('w:shd'); sh.set(qn('w:val'), 'clear'); sh.set(qn('w:fill'), 'DCE6F1'); c._tc.get_or_add_tcPr().append(sh)
lines = open(src, encoding='utf-8').read().split('\n'); i = 0
while i < len(lines):
    l = lines[i].rstrip()
    if l.startswith('|'):
        rows = []
        while i < len(lines) and lines[i].startswith('|'):
            cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
            if not all(re.fullmatch(r':?-+:?', c) for c in cells): rows.append(cells)
            i += 1
        t = doc.add_table(rows=len(rows), cols=len(rows[0])); t.style = 'Table Grid'; t.alignment = WD_TABLE_ALIGNMENT.CENTER
        for a, row in enumerate(rows):
            for b, v in enumerate(row):
                c = t.cell(a, b); c.text = ''; p = c.paragraphs[0]; p.paragraph_format.space_after = Pt(0)
                runs(p, v, 9.5); 
                if a == 0:
                    shade(c)
                    for r in p.runs: r.bold = True
        para(after=2); continue
    if l.startswith('# '): p = para(1.2, 10); runs(p, l[2:], 16, BLUE); p.runs[0].bold = True
    elif l.startswith('## '):
        p = para(1.2, 6); p.paragraph_format.space_before = Pt(14); p.paragraph_format.keep_with_next = True
        runs(p, l[3:], 14, BLUE)
        for r in p.runs: r.bold = True
    elif l.startswith('> '): p = para(1.3, 8); runs(p, l[2:], 10, RGBColor(0x66, 0x66, 0x66))
    elif l.startswith('- '): runs(para(1.5, 2, 0.9, -0.45), '•  ' + l[2:])
    elif l.strip(): runs(para(), l)
    i += 1
doc.core_properties.author = ''
doc.save(out); print('saved', out)
