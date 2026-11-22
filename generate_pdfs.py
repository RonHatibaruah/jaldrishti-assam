import os
import re
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
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (pages after page 1)
        if self._pageNumber > 1:
            self.drawString(54, letter[1] - 36, "Government of Assam • Dept. of Science & Technology (ASSAC) & ASDMA • NESFIC-D-18")
            self.drawRightString(letter[0] - 54, letter[1] - 36, "JalDrishti (Assam Flood Sentinel) — Ron Hatibaruah")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 45, letter[0] - 54, 45)
        self.drawString(54, 32, "NESFIC 2026 Proposal • Problem NESFIC-D-18 • Applicant: Ron Hatibaruah")
        self.drawRightString(letter[0] - 54, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def clean_inline_markdown(text):
    if not text:
        return ""
    t = text.strip()
    
    code_matches = []
    def save_code(m):
        code_matches.append(m.group(1))
        return f"___CODE_MATCH_{len(code_matches)-1}___"
    
    t = re.sub(r'`([^`]+)`', save_code, t)
    
    # Escape XML
    t = escape(t)
    
    # Bold italic
    t = re.sub(r'\*\*\*(.*?)\*\*\*', r'<b><i>\1</i></b>', t)
    t = re.sub(r'___([^_]+)___', r'<b><i>\1</i></b>', t)
    
    # Bold
    t = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'__([^_]+)__', r'<b>\1</b>', t)
    
    # Italic
    t = re.sub(r'\*([^*]+)\*', r'<i>\1</i>', t)
    t = re.sub(r'_([^_]+)_', r'<i>\1</i>', t)
    
    # Links
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<font color="#0284c7"><u>\1</u></font>', t)
    
    # Restore code
    for idx, c in enumerate(code_matches):
        c_esc = escape(c)
        t = t.replace(f"___CODE_MATCH_{idx}___", f'<font name="Courier" color="#0369a1">{c_esc}</font>')
        
    return t

def safe_paragraph(text, style):
    cleaned = clean_inline_markdown(text)
    try:
        return Paragraph(cleaned, style)
    except Exception:
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
        is_header = True
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

        if not raw:
            continue

        if raw.startswith('### '):
            flowables.append(safe_paragraph(raw[4:], h3_style))
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
            flowables.append(safe_paragraph(f"&bull; {bullet_text}", bullet_style))
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
        bottomMargin=54
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
    story.append(safe_paragraph("<b>JalDrishti (জলদৃষ্টি — Assam Flood Sentinel)</b> — Space-Enabled 4D Digital Twin Platform", subtitle_style))

    meta_data = [
        [safe_paragraph("<b>Challenge ID:</b> NESFIC-D-18 (Govt Track)", meta_style), safe_paragraph("<b>Department:</b> Dept. of Science & Technology (ASSAC) & ASDMA", meta_style)],
        [safe_paragraph("<b>Lead Applicant:</b> Ron Hatibaruah", meta_style), safe_paragraph("<b>Application Format:</b> USPR Standard Proposal (PDF)", meta_style)],
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

    prop_md = os.path.join(base_dir, 'proposal_contents.md')
    with open(prop_md) as f:
        content = f.read()

    sections = content.split('## ')
    if sections[0].strip():
        story.extend(parse_markdown_content(sections[0].strip().split('\n'), available_width=490))

    for sec in sections[1:]:
        lines = sec.strip().split('\n')
        sec_title = lines[0].strip()
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0f766e'), spaceBefore=8, spaceAfter=5))
        story.append(safe_paragraph(sec_title, h2_style))

        if 'Field 1:' in sec_title:
            img = os.path.join(img_dir, 'diagram_1_before_after_workflow.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=490, height=275.6))
                story.append(safe_paragraph("<b>Figure 1: Paradigm Shift Framework</b> &mdash; Transforming Reactive Flood Relief into Space-Enabled 4D Digital Twin Early Warning", caption_style))
                story.append(Spacer(1, 4))
        elif 'Field 2:' in sec_title:
            img = os.path.join(img_dir, 'diagram_3_cadastral_anomaly_catalog.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=490, height=275.6))
                story.append(safe_paragraph("<b>Figure 2: Three-Tier Data Provenance Architecture</b> &mdash; Visual Segregation of Observed (SAR/Gauges), Forecast (IMD/CWC), and Simulated (2D PINN) Layers", caption_style))
                story.append(Spacer(1, 4))
        elif 'Field 3:' in sec_title:
            img = os.path.join(img_dir, 'diagram_2_cadastral_reconciliation_flow.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=490, height=275.6))
                story.append(safe_paragraph("<b>Figure 3: JalDrishti Enterprise System Architecture</b> &mdash; Containerized ASDC Deployment, Microservices Ingestion & Physics Engine Blueprint", caption_style))
                story.append(Spacer(1, 4))
        elif 'Field 4:' in sec_title:
            img = os.path.join(img_dir, 'diagram_7_enterprise_system_architecture.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=490, height=275.6))
                story.append(safe_paragraph("<b>Figure 4: Phased 12-Month Implementation Roadmap & Pilot Budget Breakdown</b> &mdash; Barpeta & Majuli Dual-Basin Deployment Plan", caption_style))
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
        bottomMargin=54
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
    story.append(safe_paragraph("PROOF OF WORK & SOLUTION EVIDENCE DOSSIER", title_style))
    story.append(safe_paragraph("JalDrishti (Assam Flood Sentinel) — Space 4D Digital Twin Platform", subtitle_style))
    story.append(safe_paragraph("<b>Empirical Hydrodynamic Benchmarks, SAR Validation & Early Warning Protocols</b>", subtitle_style))

    meta_data = [
        [safe_paragraph("<b>Challenge ID:</b> NESFIC-D-18 (Govt Track)", meta_style), safe_paragraph("<b>Department:</b> Dept. of Science & Technology (ASSAC) & ASDMA", meta_style)],
        [safe_paragraph("<b>Lead Applicant:</b> Ron Hatibaruah", meta_style), safe_paragraph("<b>Format:</b> Solution Evidence (PDF < 10 MB)", meta_style)],
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
    with open(pow_md) as f:
        content = f.read()

    sections = content.split('## ')
    if sections[0].strip():
        story.extend(parse_markdown_content(sections[0].strip().split('\n'), available_width=490))

    for sec in sections[1:]:
        lines = sec.strip().split('\n')
        sec_title = lines[0].strip()
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0f766e'), spaceBefore=8, spaceAfter=5))
        story.append(safe_paragraph(sec_title, h2_style))

        if '1. Executive Summary' in sec_title:
            img = os.path.join(img_dir, 'diagram_9_live_prototype_ui_cockpit.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 1: JalDrishti 4D Digital Twin Operational Cockpit</b> &mdash; Real-Time Multi-Perspective WebGIS (Deployed Live at https://jaldrishti-assam.pages.dev/)", caption_style))
                story.append(Spacer(1, 4))
        elif '2. Space SAR Remote Sensing' in sec_title:
            img = os.path.join(img_dir, 'diagram_8_sar_water_extraction_pipeline.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 2: All-Weather Synthetic Aperture Radar (SAR) Water Extraction Pipeline</b> &mdash; Lee Sigma Filtering & Dynamic Otsu Binarization Flow", caption_style))
                story.append(Spacer(1, 4))
        elif '3. 2D Hydrodynamic & Physics-Informed AI' in sec_title:
            img = os.path.join(img_dir, 'diagram_5_lat_mandal_mobile_app.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 3: 2D Saint-Venant Hydrodynamics & Physics-Informed Neural Network (PINN)</b> &mdash; Numerical Solver vs. Neural Surrogate Performance Benchmarks", caption_style))
                story.append(Spacer(1, 4))
        elif '4. Embankment Breach Hazard Index' in sec_title:
            img = os.path.join(img_dir, 'diagram_4_blockchain_land_registry.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 4: Embankment Structural Health Sentinel</b> &mdash; Geotechnical Breach Hazard Index (BHI) Engine Across 4,400 km Dyke Network", caption_style))
                story.append(Spacer(1, 4))
        elif '5. Mandatory Three-Tier Data Provenance' in sec_title:
            img = os.path.join(img_dir, 'diagram_3_cadastral_anomaly_catalog.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 5: Mandatory Three-Tier Data Provenance Architecture</b> &mdash; Explicit Segregation of Observed, Forecast, and Simulated Data Layers", caption_style))
                story.append(Spacer(1, 4))
        elif '6. CAP-Compliant Multi-Channel' in sec_title:
            img = os.path.join(img_dir, 'diagram_6_spatial_conflict_resolution.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 6: Common Alerting Protocol (CAP / ITU-T X.1303) Bilingual Multi-Channel Early Warning Pipeline</b> &mdash; Automated Warning Routing to SEOC/DEOC & Gaonburhas", caption_style))
                story.append(Spacer(1, 4))
        elif '8. Security, Data Governance' in sec_title:
            img = os.path.join(img_dir, 'diagram_2_cadastral_reconciliation_flow.jpg')
            if os.path.exists(img):
                story.append(Spacer(1, 4))
                story.append(Image(img, width=490, height=275.6))
                story.append(safe_paragraph("<b>Evidence Figure 7: Enterprise System Architecture & ASDC Cloud-Native Security Blueprint</b> &mdash; Zero-Trust RBAC, TLS 1.3 Encryption & DPDPA 2023 Compliance", caption_style))
                story.append(Spacer(1, 4))

        body_flowables = parse_markdown_content(lines[1:], available_width=490)
        story.extend(body_flowables)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated {output_path}")

if __name__ == '__main__':
    proposal_pdf = os.path.join(base_dir, 'NESFIC_D18_Proposal_Ron_Hatibaruah.pdf')
    pow_pdf = os.path.join(base_dir, 'NESFIC_D18_Proof_of_Work_Ron_Hatibaruah.pdf')
    
    build_proposal_pdf(proposal_pdf)
    build_proof_of_work_pdf(pow_pdf)
