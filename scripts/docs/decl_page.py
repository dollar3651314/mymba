# AI 声明页：样式照 BUSI 1764 模板那一页（校徽右上、行距 1.5、组间空行、YES/NO 对齐 9.1 cm），放在文档最后一页
import os
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml.ns import qn
LOGO=os.path.join(os.path.dirname(os.path.abspath(__file__)),'uog_logo.png')
HBLUE=RGBColor(0x2E,0x53,0x95)
def _p(doc, after=0, before=0, left=0.2, first=None, tab=None, line=1.5, align=WD_ALIGN_PARAGRAPH.LEFT):
    p=doc.add_paragraph(); f=p.paragraph_format; f.space_after=Pt(after); f.space_before=Pt(before); f.line_spacing=line
    p.alignment=align
    if left is not None: f.left_indent=Cm(left)
    if first is not None: f.first_line_indent=Cm(first)
    if tab: f.tab_stops.add_tab_stop(Cm(tab))
    return p
def _r(p, t, size=11, font='Arial', bold=False, italic=False, underline=False, color=None):
    r=p.add_run(t); r.font.name=font; rf=r._element.get_or_add_rPr().get_or_add_rFonts()
    for k in ('w:ascii','w:hAnsi','w:eastAsia','w:cs'): rf.set(qn(k),font)
    r.font.size=Pt(size); r.bold=bold; r.italic=italic; r.underline=underline
    if color: r.font.color.rgb=color
    return r
def add_decl_page(doc, answers, summarised, other, ids, module_code, module_title, assignment_title, heading_style='Heading 1'):
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
    lp=_p(doc,align=WD_ALIGN_PARAGRAPH.RIGHT,left=0,line=1.0); lp.add_run().add_picture(LOGO,width=Cm(5.6))
    _p(doc,line=1.0)
    h=doc.add_paragraph(style=heading_style); hf=h.paragraph_format; hf.left_indent=Cm(0.2); hf.space_before=Pt(2); hf.space_after=Pt(0); hf.line_spacing=1.5
    _r(h,'Declaration of AI Use',size=13,font='Cambria',color=HBLUE)
    _p(doc)
    _r(_p(doc),'Instructions to students:',size=12,font='Calibri',italic=True,underline=True)
    _p(doc)
    _r(_p(doc,left=0,line=1.2),'Misuse of AI is a serious academic offence.  You MUST append this page to the end of your assignment when you have used AI during the process of undertaking the assignment in order to acknowledge the ways in which you have used it.',size=12,font='Calibri',italic=True)
    _r(_p(doc,before=10,after=4),'I have used AI while undertaking my assignment in the following ways:')
    for label,k in [('To develop research questions on the topic','research'),('To create an outline of the topic','outline'),('To explain concepts','concepts'),('To support my use of language','language')]:
        _r(_p(doc,tab=9.1,line=Pt(24)),label+'\t'+answers[k])
    _r(_p(doc,tab=9.1,line=Pt(24)),'To summarise the following articles/resources: '+summarised+'\t'+answers['summarise'])
    _p(doc)
    _r(_p(doc,tab=9.1,line=Pt(24)),'In other ways, as described below:\t'+answers['other'])
    for b in other:
        _r(_p(doc,left=1.27,first=-0.35,before=3,line=Pt(20)),'• '+b)
    _p(doc); _p(doc)
    _r(_p(doc,left=0,tab=7.6,line=Pt(23)),'Student ID Number: '+ids['lsbf']+'\tUOG Banner ID Number: '+ids['uog'])
    p=_p(doc,left=0,tab=5.08,line=Pt(23)); _r(p,'Module Code and Module Title:\t'); _r(p,module_code,bold=True)
    _r(_p(doc,left=5.08,line=Pt(23)),module_title,bold=True)
    p=_p(doc,left=0,tab=5.08,line=Pt(23)); _r(p,'Assignment Title:\t'); _r(p,assignment_title,bold=True)
