# AI 声明页（样式照 BUSI 1764 模板），放在文档最后一页
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml.ns import qn
BLUE=RGBColor(0x1F,0x3F,0x66)
def _p(doc, after=4, before=0, left=None, first=None, tab=None, line=1.15):
    p=doc.add_paragraph(); f=p.paragraph_format; f.space_after=Pt(after); f.space_before=Pt(before); f.line_spacing=line
    p.alignment=WD_ALIGN_PARAGRAPH.LEFT
    if left is not None: f.left_indent=Cm(left)
    if first is not None: f.first_line_indent=Cm(first)
    if tab: f.tab_stops.add_tab_stop(Cm(tab))
    return p
def _r(p, t, size=11, bold=False, italic=False, underline=False, color=None):
    r=p.add_run(t); r.font.name='Arial'; r._element.get_or_add_rPr().get_or_add_rFonts().set(qn('w:eastAsia'),'Arial')
    r.font.size=Pt(size); r.bold=bold; r.italic=italic; r.underline=underline
    if color: r.font.color.rgb=color
    return r
def add_decl_page(doc, answers, summarised, other, ids, module_code, module_title, assignment_title, heading_style='Heading 1'):
    """answers: dict research/outline/concepts/language/summarise/other -> 'YES'/'NO'"""
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
    h=doc.add_paragraph(style=heading_style); h.paragraph_format.space_after=Pt(10)
    _r(h,'Declaration of AI Use',size=14,bold=True,color=BLUE)
    _r(_p(doc,after=6),'Instructions to students:',italic=True,underline=True)
    _r(_p(doc,after=10),'Misuse of AI is a serious academic offence.  You MUST append this page to the end of your assignment when you have used AI during the process of undertaking the assignment in order to acknowledge the ways in which you have used it.',italic=True)
    _r(_p(doc,after=8),'I have used AI while undertaking my assignment in the following ways:')
    rows=[('To develop research questions on the topic','research'),('To create an outline of the topic','outline'),('To explain concepts','concepts'),('To support my use of language','language')]
    for label,k in rows:
        _r(_p(doc,after=3,tab=11),label+'\t'+answers[k])
    p=_p(doc,after=3,tab=11); _r(p,'To summarise the following articles/resources: '+summarised+'\t'+answers['summarise'])
    _p(doc,after=2)
    _r(_p(doc,after=3,tab=11),'In other ways, as described below:\t'+answers['other'])
    for b in other:
        _r(_p(doc,after=2,left=1.2,first=-0.4),'• '+b)
    _p(doc,after=2); _p(doc,after=2)
    p=_p(doc,after=4,tab=9); _r(p,'Student ID Number: '+ids['lsbf']+'\tUOG Banner ID Number: '+ids['uog'])
    p=_p(doc,after=0,tab=5.5); _r(p,'Module Code and Module Title:\t'); _r(p,module_code,bold=True)
    p=_p(doc,after=4,left=5.5); _r(p,module_title,bold=True)
    p=_p(doc,after=4,tab=5.5); _r(p,'Assignment Title:\t'); _r(p,assignment_title,bold=True)
