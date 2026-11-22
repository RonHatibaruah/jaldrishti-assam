import os
import re
import shutil
from xml.sax.saxutils import escape
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, Image
)
from reportlab.pdfgen import canvas

base_dir = os.path.dirname(os.path.abspath(__file__))
img_dir = os.path.join(base_dir, 'assets', 'proposal_images')

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header (pages after page 1)
        if self._pageNumber > 1:
            self.drawString(54, letter[1] - 36, "Government of Assam • Dept. of Science & Technology (ASSAC) & ASDMA • NESFIC-D-18")
            self.drawRightString(letter[0] - 54, letter[1] - 36, "JalDrishti (Assam Flood Sentinel) — Chandan Kumar Sonowal")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 48, letter[0] - 54, 48)
        self.drawString(54, 35, "NESFIC 2026 • Problem NESFIC-D-18 • Lead Applicant: Chandan Kumar Sonowal")
        self.drawRightString(letter[0] - 54, 35, f"Page {self._pageNumber} of {page_count}")
        
        # Copyright Sub-Footer (Prominent)
        self.setFont("Helvetica-Bold", 7)
        self.setFillColor(colors.HexColor("#0f172a"))
        self.drawCentredString(letter[0] / 2.0, 22, "Copyright © 2026 Coretouch Technologies Pvt Ltd. All rights reserved.")
        self.restoreState()

def clean_inline_markdown(text):
    if not text:
        return ""
    t = text.strip()
    
    # 1. Strip Assamese/Bengali unicode characters that standard ReportLab Helvetica cannot render
    t = re.sub(r'[\u0980-\u09FF]+', '', t)
    t = re.sub(r'\(\s*—\s*', '(', t)
    t = re.sub(r'\(\s*\)', '', t)
    
    # 2. Currency and non-WinAnsi character normalization
    t = t.replace('₹', 'Rs. ')
    t = t.replace('≥', '>=').replace('≤', '<=').replace('±', '+/-')
    t = t.replace('●', '•')
    t = t.replace('—', ' - ').replace('–', '-')
    t = t.replace('’', "'").replace('‘', "'")
    t = t.replace('”', '"').replace('“', '"')
    
    # 3. Standardize common HTML entities
    t = t.replace('&mdash;', ' - ')
    t = t.replace('&ndash;', '-')
    t = t.replace('&amp;', '&')
    t = t.replace('&lt;', '<')
    t = t.replace('&gt;', '>')
    
    # 4. Clean LaTeX math notations
    t = re.sub(r'\$([^$]+)\$', r'\1', t)
    t = t.replace(r'\le', '<=').replace(r'\ge', '>=').replace(r'\pm', '+/-')
    t = t.replace(r'\text{ s}', ' s').replace(r'\text{ m}', ' m').replace(r'\%', '%')
    t = t.replace(r'\Delta', 'Delta')
    
    # Strip any leading hashes that may have been preserved
    t = re.sub(r'^#+\s*', '', t)
    
    # 4. Save backtick code spans
    code_matches = []
    def save_code(m):
        code_matches.append(m.group(1))
        return f"ZZZCODEX{len(code_matches)-1}END"
    t = re.sub(r'`([^`]+)`', save_code, t)
    
    # 5. Convert markdown formatting to HTML tags
    t = re.sub(r'\*\*\*(.*?)\*\*\*', r'<b><i>\1</i></b>', t)
    t = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'\*([^*]+)\*', r'<i>\1</i>', t)
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<font color="#0284c7"><u>\1</u></font>', t)
    
    # 6. Extract valid allowed HTML tags and XML entities before escaping raw text
    allowed_tags = []
    def save_tag(m):
        allowed_tags.append(m.group(0))
        return f"ZZZTAGX{len(allowed_tags)-1}END"
    t = re.sub(r'</?(?:b|i|u|font|br|sup|sub)(?:\s+[^>]*)?>|&(?:bull|deg|plusmn);', save_tag, t, flags=re.IGNORECASE)
    
    # 7. Safely escape remaining raw characters (&, <, >)
    t = escape(t)
    
    # 8. Restore allowed HTML tags
    for idx, tag in enumerate(allowed_tags):
        t = t.replace(f"ZZZTAGX{idx}END", tag)
        
    # 9. Restore code spans with Courier styling
    for idx, c in enumerate(code_matches):
        c_esc = escape(c)
        t = t.replace(f"ZZZCODEX{idx}END", f'<font name="Courier" color="#0369a1">{c_esc}</font>')
        
    return t

def safe_paragraph(text, style):
    cleaned = clean_inline_markdown(text)
    try:
        return Paragraph(cleaned, style)
    except Exception as e:
        print(f"[safe_paragraph fallback] Error: {e} | Text was: {cleaned}")
        plain = re.sub(r'<[^>]+>', '', cleaned)
        return Paragraph(escape(plain), style)

def parse_markdown_content(lines, available_width=490):
    styles = getSampleStyleSheet()
    
    body_style = ParagraphStyle(
        'CustomBody', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=12,
        textColor=colors.HexColor('#1e293b'), spaceAfter=3.5
    )
    bullet_style = ParagraphStyle(
        'CustomBullet', parent=body_style, leftIndent=12, firstLineIndent=-8, spaceAfter=2.5
    )
    h2_style = ParagraphStyle(
        'CustomH2', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=10.5, leading=14,
        textColor=colors.HexColor('#065f46'), spaceBefore=8, spaceAfter=4, keepWithNext=True
    )
    h3_style = ParagraphStyle(
        'CustomH3', parent=styles['Heading3'], fontName='Helvetica-Bold', fontSize=9.5, leading=13,
        textColor=colors.HexColor('#0f766e'), spaceBefore=5, spaceAfter=2.5, keepWithNext=True
    )
    callout_style = ParagraphStyle(
        'CustomCallout', parent=body_style, fontName='Helvetica-Oblique', fontSize=8, leading=11,
        textColor=colors.HexColor('#065f46')
    )
    code_block_style = ParagraphStyle(
        'CustomCode', parent=body_style, fontName='Courier', fontSize=7, leading=9.5,
        textColor=colors.HexColor('#0f172a')
    )

    flowables = []
    in_code_block = False
    code_lines = []
    in_table = False
    table_lines = []

    def flush_table(tbl_lines):
        if not tbl_lines:
            return
        rows = []
        for l in tbl_lines:
            if re.match(r'^\|?\s*:?---', l):
                continue
            parts = [clean_inline_markdown(c.strip()) for c in l.strip().strip('|').split('|')]
            rows.append(parts)

        if not rows:
            return

        num_cols = max(len(r) for r in rows)
        col_w = available_width / float(num_cols)

        formatted_table = []
        for r_idx, row in enumerate(rows):
            while len(row) < num_cols:
                row.append("")
            row_paras = []
            for c in row:
                if r_idx == 0:
                    p = safe_paragraph(f"<b>{c}</b>", ParagraphStyle('TH', parent=body_style, fontSize=7.5, leading=10, textColor=colors.HexColor('#065f46')))
                else:
                    p = safe_paragraph(c, ParagraphStyle('TD', parent=body_style, fontSize=7.5, leading=10))
                row_paras.append(p)
            formatted_table.append(row_paras)

        t = Table(formatted_table, colWidths=[col_w]*num_cols)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f0fdf4')),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
            ('TOPPADDING', (0,0), (-1,-1), 2.5),
            ('LEFTPADDING', (0,0), (-1,-1), 3),
            ('RIGHTPADDING', (0,0), (-1,-1), 3),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        flowables.append(Spacer(1, 3))
        flowables.append(t)
        flowables.append(Spacer(1, 3))

    for line in lines:
        raw = line.strip()

        if raw.startswith('```'):
            if in_code_block:
                in_code_block = False
                code_text = "<br/>".join(code_lines)
                t_code = Table([[Paragraph(code_text, code_block_style)]], colWidths=[available_width])
                t_code.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
                    ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
                    ('PADDING', (0,0), (-1,-1), 4),
                ]))
                flowables.append(Spacer(1, 3))
                flowables.append(t_code)
                flowables.append(Spacer(1, 3))
                code_lines = []
            else:
                in_code_block = True
                code_lines = []
            continue

        if in_code_block:
            code_lines.append(escape(line))
            continue

        if raw.startswith('|'):
            in_table = True
            table_lines.append(raw)
            continue
        else:
            if in_table:
                flush_table(table_lines)
                in_table = False
                table_lines = []

        if not raw or re.match(r'^#+\s*$', raw):
            continue

        if raw.startswith('# '):
            # Top-level title - skip raw markdown header since formal title is already in page banner
            continue
        elif raw.startswith('## '):
            h_text = raw.lstrip('#').strip()
            flowables.append(safe_paragraph(h_text, h2_style))
        elif raw.startswith('### '):
            h_text = raw.lstrip('#').strip()
            flowables.append(safe_paragraph(h_text, h3_style))
        elif raw.startswith('#### '):
            h_text = raw.lstrip('#').strip()
            flowables.append(safe_paragraph(h_text, h3_style))
        elif raw.startswith('> '):
            quote_text = raw[2:]
            t_quote = Table([[safe_paragraph(quote_text, callout_style)]], colWidths=[available_width])
            t_quote.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0fdf4')),
                ('LEFTPADDING', (0,0), (-1,-1), 8),
                ('RIGHTPADDING', (0,0), (-1,-1), 6),
                ('TOPPADDING', (0,0), (-1,-1), 3),
                ('BOTTOMPADDING', (0,0), (-1,-1), 3),
                ('LINELEFT', (0,0), (0,-1), 2.5, colors.HexColor('#059669')),
            ]))
            flowables.append(Spacer(1, 2))
            flowables.append(t_quote)
            flowables.append(Spacer(1, 2))
        elif raw.startswith(('- ', '* ', '• ')):
            bullet_text = re.sub(r'^[-*•]\s+', '', raw)
            flowables.append(safe_paragraph(f"• {bullet_text}", bullet_style))
        elif re.match(r'^\d+\.\s+', raw):
            m = re.match(r'^(\d+\.)\s+(.*)', raw)
            flowables.append(safe_paragraph(f"<b>{m.group(1)}</b> {m.group(2)}", bullet_style))
        elif raw == '---':
            flowables.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cbd5e1'), spaceBefore=4, spaceAfter=4))
        else:
            flowables.append(safe_paragraph(raw, body_style))

    if in_table:
        flush_table(table_lines)

    return flowables

def build_proposal_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=58
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=15, leading=19,
        textColor=colors.HexColor('#065f46'), alignment=0, spaceAfter=2
    )
    subtitle_style = ParagraphStyle(
        'DocSub', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=12.5,
        textColor=colors.HexColor('#0f766e'), spaceAfter=4
    )
    meta_style = ParagraphStyle(
        'MetaStyle', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11, textColor=colors.HexColor('#334155')
    )
    h2_style = ParagraphStyle(
        'H2Style', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=10.5, leading=14,
        textColor=colors.HexColor('#065f46'), spaceBefore=8, spaceAfter=4, keepWithNext=True
    )
    caption_style = ParagraphStyle(
        'FigCaption', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7.5, leading=10,
        textColor=colors.HexColor('#0f766e'), alignment=1, spaceBefore=3, spaceAfter=6
    )

    story = []
    story.append(safe_paragraph("NORTH EAST SEVA FIRST INNOVATION CHALLENGE (NESFIC 2026)", subtitle_style))
    story.append(safe_paragraph("STREAM 1 — GOVERNMENT TRACK • OFFICIAL SOLUTION PROPOSAL", title_style))
    story.append(safe_paragraph("<b>JalDrishti (Assam Flood Sentinel)</b> — Space-Enabled 4D Digital Twin Platform", subtitle_style))

    meta_data = [
        [safe_paragraph("<b>Challenge ID:</b> NESFIC-D-18 (Govt Track)", meta_style), safe_paragraph("<b>Department:</b> Dept. of Science & Technology (ASSAC) & ASDMA", meta_style)],
        [safe_paragraph("<b>Lead Applicant:</b> Chandan Kumar Sonowal", meta_style), safe_paragraph("<b>Application Format:</b> USPR Standard Proposal (PDF)", meta_style)],
        [safe_paragraph("<b>Live Prototype:</b> https://jaldrishti-assam.pages.dev/", meta_style), safe_paragraph("<b>GitHub:</b> github.com/RonHatibaruah/jaldrishti-assam", meta_style)]
    ]
    t_meta = Table(meta_data, colWidths=[240, 264])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0fdf4')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#86efac')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 8))

    hero_map = os.path.join(img_dir, 'diagram_18_assam_statewide_operational_twin_map.jpg')
    if os.path.exists(hero_map):
        story.append(Image(hero_map, width=490, height=275.6))
        story.append(safe_paragraph("<b>Assam Statewide 4D Operational Twin Map</b> — Brahmaputra & Barak River Corridors, 35 CWC Stations, 4,400 km Dykes & Dual-Basin Pilots", caption_style))
        story.append(Spacer(1, 6))

    prop_md = os.path.join(base_dir, 'proposal_contents.md')
    with open(prop_md, 'r', encoding='utf-8') as f:
        content = f.read()

    sections = re.split(r'\n(?=##\s+Field\s+\d+:)', content)
    if sections[0].strip():
        story.extend(parse_markdown_content(sections[0].strip().split('\n'), available_width=490))

    for sec in sections[1:]:
        lines = sec.strip().split('\n')
        sec_title = lines[0].strip().lstrip('#').strip()
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0f766e'), spaceBefore=8, spaceAfter=5))
        story.append(safe_paragraph(sec_title, h2_style))

        if 'Field 1:' in sec_title:
            img1 = os.path.join(img_dir, 'diagram_1_before_after_workflow.jpg')
            if os.path.exists(img1):
                story.append(Spacer(1, 4))
                story.append(Image(img1, width=490, height=275.6))
                story.append(safe_paragraph("<b>Figure 1: Paradigm Shift Framework</b> — Transforming Reactive Flood Relief into Space-Enabled 4D Digital Twin Early Warning", caption_style))
                story.append(Spacer(1, 4))
            img2 = os.path.join(img_dir, 'diagram_19_operational_persona_hierarchy.jpg')
            if os.path.exists(img2):
                story.append(Spacer(1, 4))
                story.append(Image(img2, width=490, height=275.6))
                story.append(safe_paragraph("<b>Figure 2: 4-Tier Operational Persona Hierarchy</b> — State EOC Commander, District DEOC, WRD Engineers & Village Gaonburhas", caption_style))
                story.append(Spacer(1, 4))
        elif 'Field 2:' in sec_title:
            img0 = os.path.join(img_dir, 'diagram_20_orbit_to_village_pipeline.jpg')
            if os.path.exists(img0):
                story.append(Spacer(1, 4))
                story.append(Image(img0, width=490, height=275.6))
                story.append(safe_paragraph("<b>Figure 3: 'From Orbit to Village Alert' 4-Step Pipeline</b> — Space SAR (45m) to 2D PINN AI (39s) to CAP Siren (<2.4s)", caption_style))
                story.append(Spacer(1, 4))
            img1 = os.path.join(img_dir, 'diagram_10_what_if_simulation_sandbox.jpg')
            if os.path.exists(img1):
                story.append(Spacer(1, 4))
                story.append(Image(img1, width=490, height=275.6))
                story.append(safe_paragraph("<b>Figure 4: 4D Digital Twin 'What-If' Simulation Sandbox</b> — Interactive Dam Release & 2D Hydrodynamic Wavefront Modeling (Barpeta & Majuli)", caption_style))
                story.append(Spacer(1, 4))
            img2 = os.path.join(img_dir, 'diagram_3_cadastral_anomaly_catalog.jpg')
            if os.path.exists(img2):
                story.append(Spacer(1, 4))
                story.append(Image(img2, width=490, height=275.6))
                story.append(safe_paragraph("<b>Figure 5: Three-Tier Data Provenance Architecture</b> — Visual Segregation of Observed (SAR/Gauges), Forecast (IMD/CWC), and Simulated (2D PINN) Layers", caption_style))
                story.append(Spacer(1, 4))
        elif 'Field 3:' in sec_title:
            img1 = os.path.join(img_dir, 'diagram_2_cadastral_reconciliation_flow.jpg')
            if os.path.exists(img1):
                story.append(Spacer(1, 4))
                story.append(Image(img1, width=490, height=275.6))
                story.append(safe_paragraph("<b>Figure 6: JalDrishti Enterprise System Architecture</b> — Containerized ASDC Deployment, Microservices Ingestion & Physics Engine Blueprint", caption_style))
                story.append(Spacer(1, 4))
            img2 = os.path.join(img_dir, 'diagram_11_asdc_infrastructure_security.jpg')
            if os.path.exists(img2):
                story.append(Spacer(1, 4))
                story.append(Image(img2, width=490, height=275.6))
                story.append(safe_paragraph("<b>Figure 7: Assam State Data Centre (ASDC) Zero-Trust Deployment Topology</b> — Sovereign Cloud Infrastructure & DPDPA 2023 Security Enclave", caption_style))
                story.append(Spacer(1, 4))
        elif 'Field 4:' in sec_title:
            img = os.path.join(img_dir, 'diagram_7_enterprise_system_architecture.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=490, height=275.6))
                story.append(safe_paragraph("<b>Figure 8: Phased Implementation Roadmap & Milestone Budget Breakdown (Rs. 40.00 Lakh)</b> — Dual-Basin Pilot to Statewide Operationalization", caption_style))
                story.append(Spacer(1, 4))
        elif 'Field 5:' in sec_title:
            img = os.path.join(img_dir, 'diagram_12_socio_economic_impact_model.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=490, height=275.6))
                story.append(safe_paragraph("<b>Figure 9: Socio-Economic Impact Matrix & Grassroots Resilience</b> — Quantified Loss Reduction Across 3.15M Ha Protected Area", caption_style))
                story.append(Spacer(1, 4))

        body_flowables = parse_markdown_content(lines[1:], available_width=490)
        story.extend(body_flowables)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated {output_path}")

def build_proof_of_work_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=58
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=14, leading=18,
        textColor=colors.HexColor('#065f46'), alignment=0, spaceAfter=2
    )
    subtitle_style = ParagraphStyle(
        'DocSub', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=12,
        textColor=colors.HexColor('#0f766e'), spaceAfter=3
    )
    meta_style = ParagraphStyle(
        'MetaStyle', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11, textColor=colors.HexColor('#334155')
    )
    h2_style = ParagraphStyle(
        'H2Style', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=10.5, leading=14,
        textColor=colors.HexColor('#065f46'), spaceBefore=8, spaceAfter=4, keepWithNext=True
    )
    caption_style = ParagraphStyle(
        'FigCaption', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7.5, leading=10,
        textColor=colors.HexColor('#0f766e'), alignment=1, spaceBefore=3, spaceAfter=6
    )

    story = []
    story.append(safe_paragraph("PROOF OF WORK & SOLUTION EVIDENCE DOSSIER", title_style))
    story.append(safe_paragraph("JalDrishti (Assam Flood Sentinel) — Space 4D Digital Twin Platform", subtitle_style))
    story.append(safe_paragraph("<b>Empirical Hydrodynamic Benchmarks, SAR Validation & Early Warning Protocols</b>", subtitle_style))

    meta_data = [
        [safe_paragraph("<b>Challenge ID:</b> NESFIC-D-18 (Govt Track)", meta_style), safe_paragraph("<b>Department:</b> Dept. of Science & Technology (ASSAC) & ASDMA", meta_style)],
        [safe_paragraph("<b>Lead Applicant:</b> Chandan Kumar Sonowal", meta_style), safe_paragraph("<b>Format:</b> Solution Evidence (PDF < 10 MB)", meta_style)],
        [safe_paragraph("<b>Live Prototype:</b> https://jaldrishti-assam.pages.dev/", meta_style), safe_paragraph("<b>Verification Status:</b> Fully Built & Benchmarked", meta_style)]
    ]
    t_meta = Table(meta_data, colWidths=[240, 264])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0fdf4')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#86efac')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 8))

    pow_md = os.path.join(base_dir, 'proof_of_work_dossier.md')
    with open(pow_md, 'r', encoding='utf-8') as f:
        content = f.read()

    sections = re.split(r'\n(?=##\s+\d+\.\s+)', content)
    if sections[0].strip():
        story.extend(parse_markdown_content(sections[0].strip().split('\n'), available_width=490))

    for sec in sections[1:]:
        lines = sec.strip().split('\n')
        sec_title = lines[0].strip().lstrip('#').strip()
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0f766e'), spaceBefore=8, spaceAfter=5))
        story.append(safe_paragraph(sec_title, h2_style))

        if '1. Executive Summary' in sec_title:
            img1 = os.path.join(img_dir, 'diagram_21_multi_device_cockpit_collage.jpg')
            if os.path.exists(img1):
                story.append(Spacer(1, 4))
                story.append(Image(img1, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 1: Multi-Device Operational Cockpit Collage & Live System Verification</b> — Desktop WebGIS, Tablet Sandbox & Mobile Alert (Deployed Live at https://jaldrishti-assam.pages.dev/)", caption_style))
                story.append(Spacer(1, 4))
            img2 = os.path.join(img_dir, 'diagram_9_live_prototype_ui_cockpit.jpg')
            if os.path.exists(img2):
                story.append(Spacer(1, 4))
                story.append(Image(img2, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 2: Statewide Multi-Perspective WebGIS Command Console</b> — Executive SEOC Common Operational Picture", caption_style))
                story.append(Spacer(1, 4))
        elif '2. Space SAR Remote Sensing' in sec_title:
            img1 = os.path.join(img_dir, 'diagram_13_optical_vs_sar_verification.jpg')
            if os.path.exists(img1):
                story.append(Spacer(1, 4))
                story.append(Image(img1, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 3: Cloud-Penetrating Remote Sensing Verification</b> — Optical Monsoon Cloud Obscuration vs. Sentinel-1 C-Band SAR Penetration", caption_style))
                story.append(Spacer(1, 4))
            img2 = os.path.join(img_dir, 'diagram_8_sar_water_extraction_pipeline.jpg')
            if os.path.exists(img2):
                story.append(Spacer(1, 4))
                story.append(Image(img2, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 4: All-Weather Synthetic Aperture Radar (SAR) Water Extraction Pipeline</b> — Lee Sigma Filtering & Dynamic Otsu Binarization Flow", caption_style))
                story.append(Spacer(1, 4))
        elif '3. 2D Hydrodynamic & Physics-Informed AI' in sec_title:
            img1 = os.path.join(img_dir, 'diagram_5_lat_mandal_mobile_app.jpg')
            if os.path.exists(img1):
                story.append(Spacer(1, 4))
                story.append(Image(img1, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 5: 2D Saint-Venant Hydrodynamics & Physics-Informed Neural Network (PINN)</b> — Numerical Solver vs. Neural Surrogate Performance Benchmarks", caption_style))
                story.append(Spacer(1, 4))
            img2 = os.path.join(img_dir, 'diagram_10_what_if_simulation_sandbox.jpg')
            if os.path.exists(img2):
                story.append(Spacer(1, 4))
                story.append(Image(img2, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 6: Interactive 4D Digital Twin 'What-If' Simulation Sandbox</b> — Dam Discharge & Cloudburst Wavefront Projections (Barpeta & Majuli)", caption_style))
                story.append(Spacer(1, 4))
        elif '4. Embankment Breach Hazard Index' in sec_title:
            img1 = os.path.join(img_dir, 'diagram_14_geotechnical_embankment_mechanics.jpg')
            if os.path.exists(img1):
                story.append(Spacer(1, 4))
                story.append(Image(img1, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 7: Geotechnical Dyke Failure Mechanics & IoT Telemetry Cross-Section</b> — Phreatic Seepage Line, Pore Pressure Cells & Piping Sand Boils", caption_style))
                story.append(Spacer(1, 4))
            img2 = os.path.join(img_dir, 'diagram_4_blockchain_land_registry.jpg')
            if os.path.exists(img2):
                story.append(Spacer(1, 4))
                story.append(Image(img2, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 8: Embankment Structural Health Sentinel</b> — Geotechnical Breach Hazard Index (BHI) Engine Across 4,400 km Dyke Network", caption_style))
                story.append(Spacer(1, 4))
        elif '5. Mandatory Three-Tier Data Provenance' in sec_title:
            img = os.path.join(img_dir, 'diagram_3_cadastral_anomaly_catalog.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 9: Mandatory Three-Tier Data Provenance Architecture</b> — Explicit Segregation of Observed, Forecast, and Simulated Data Layers", caption_style))
                story.append(Spacer(1, 4))
        elif '6. CAP-Compliant Multi-Channel' in sec_title:
            img1 = os.path.join(img_dir, 'diagram_6_spatial_conflict_resolution.jpg')
            if os.path.exists(img1):
                story.append(Spacer(1, 4))
                story.append(Image(img1, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 10: Common Alerting Protocol (CAP / ITU-T X.1303) Bilingual Multi-Channel Early Warning Pipeline</b> — Automated Warning Routing to SEOC/DEOC", caption_style))
                story.append(Spacer(1, 4))
            img2 = os.path.join(img_dir, 'diagram_15_gaonburha_bilingual_alert_cockpit.jpg')
            if os.path.exists(img2):
                story.append(Spacer(1, 4))
                story.append(Image(img2, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 11: Gaonburha Village Headman & Circle Officer Low-Bandwidth Bilingual Mobile Command Interface</b> — Assamese/English Alerting", caption_style))
                story.append(Spacer(1, 4))
        elif '7. System Latency' in sec_title:
            img = os.path.join(img_dir, 'diagram_16_system_latency_edge_benchmarks.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 12: System Latency, Edge Compute & Stress-Test Benchmarks</b> — ASDC High-Concurrency Profile (1,000 Users, Sub-Second Tiles)", caption_style))
                story.append(Spacer(1, 4))
        elif '8. Security, Data Governance' in sec_title:
            img1 = os.path.join(img_dir, 'diagram_22_government_standards_compliance_matrix.jpg')
            if os.path.exists(img1):
                story.append(Spacer(1, 4))
                story.append(Image(img1, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 13: Government Open Standards, Cybersecurity & Regulatory Compliance Matrix</b> — CERT-In STQC VAPT, DPDPA 2023 & OGC Compliance", caption_style))
                story.append(Spacer(1, 4))
            img2 = os.path.join(img_dir, 'diagram_11_asdc_infrastructure_security.jpg')
            if os.path.exists(img2):
                story.append(Spacer(1, 4))
                story.append(Image(img2, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 14: Enterprise System Architecture & ASDC Cloud-Native Security Blueprint</b> — Zero-Trust RBAC, TLS 1.3 Encryption & DPDPA 2023 Enclave", caption_style))
                story.append(Spacer(1, 4))
        elif '9. Dual-Basin Field Pilot' in sec_title:
            img = os.path.join(img_dir, 'diagram_17_field_pilot_acceptance_gate.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 15: 5-Stage Dual-Basin Pilot Acceptance Matrix & Empirical KPI Verification Gate</b> — Barpeta & Majuli Government Sign-Off Gates", caption_style))
                story.append(Spacer(1, 4))

        body_flowables = parse_markdown_content(lines[1:], available_width=490)
        story.extend(body_flowables)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated {output_path}")

if __name__ == '__main__':
    # Write both Chandan_Kumar_Sonowal named PDFs and the legacy ones so both links work
    proposal_pdf_chandan = os.path.join(base_dir, 'NESFIC_D18_Proposal_Chandan_Kumar_Sonowal.pdf')
    pow_pdf_chandan = os.path.join(base_dir, 'NESFIC_D18_Proof_of_Work_Chandan_Kumar_Sonowal.pdf')
    
    proposal_pdf_ron = os.path.join(base_dir, 'NESFIC_D18_Proposal_Ron_Hatibaruah.pdf')
    pow_pdf_ron = os.path.join(base_dir, 'NESFIC_D18_Proof_of_Work_Ron_Hatibaruah.pdf')
    
    build_proposal_pdf(proposal_pdf_chandan)
    build_proof_of_work_pdf(pow_pdf_chandan)
    
    shutil.copyfile(proposal_pdf_chandan, proposal_pdf_ron)
    shutil.copyfile(pow_pdf_chandan, pow_pdf_ron)
    print("Copied to legacy paths for continuous link availability.")
