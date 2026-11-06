# 把任意 docx 的封面字段段落换成 UOG x LSBF 模板格式（标签加粗 Calibri 12，内容 Calibri 12 常规，对齐）
import sys, json, copy
from lxml import etree
W='http://schemas.openxmlformats.org/wordprocessingml/2006/main'; w='{%s}'%W
target_xml, tpl_xml, vals = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
def txt(el): return ''.join(x.text or '' for x in el.iter(w+'t')).strip()
tb=etree.parse(tpl_xml).getroot().find(w+'body'); tp=list(tb)
a=[i for i,e in enumerate(tp) if txt(e).startswith('Collaborative University')][0]
b=[i for i,e in enumerate(tp) if txt(e).startswith('Name of Lecturer')][0]
new=[copy.deepcopy(e) for e in tp[a:b+1]]
t=etree.parse(target_xml); body=t.getroot().find(w+'body'); bp=list(body)
ta=[i for i,e in enumerate(bp) if txt(e).startswith('Collaborative University')][0]
tbi=[i for i,e in enumerate(bp) if txt(e).startswith('Name of Lecturer')][0]
anchor=bp[ta]
for e in new: anchor.addprevious(e)
for e in bp[ta:tbi+1]: body.remove(e)
def calibri(rpr):
    f=rpr.find(w+'rFonts')
    if f is None: f=etree.SubElement(rpr,w+'rFonts'); rpr.remove(f); rpr.insert(0,f)
    for k in ('ascii','hAnsi','cs'): f.set(w+k,'Calibri')
for e in new:
    ppr=e.find(w+'pPr')
    if ppr is None: ppr=etree.SubElement(e,w+'pPr'); e.remove(ppr); e.insert(0,ppr)
    sp=ppr.find(w+'spacing')
    if sp is None: sp=etree.SubElement(ppr,w+'spacing')
    sp.set(w+'before','0'); sp.set(w+'after','0')
    for r in e.iter(w+'r'):
        rpr=r.find(w+'rPr')
        if rpr is None: rpr=etree.SubElement(r,w+'rPr'); r.remove(rpr); r.insert(0,rpr)
        calibri(rpr)
    lab=txt(e)
    for k,v in vals.items():
        if lab.startswith(k):
            r=etree.SubElement(e,w+'r'); rpr=etree.SubElement(r,w+'rPr'); calibri(rpr)
            sz=etree.SubElement(rpr,w+'sz'); sz.set(w+'val','24')
            if k.startswith('Collaborative'): etree.SubElement(r,w+'tab')
            tt=etree.SubElement(r,w+'t'); tt.text=v; tt.set('{http://www.w3.org/XML/1998/namespace}space','preserve')
t.write(target_xml,xml_declaration=True,encoding='UTF-8',standalone=True)
print('cover replaced:',len(new),'paragraphs')
