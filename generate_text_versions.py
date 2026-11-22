#!/usr/bin/env python3
"""
Generate clean, copy-paste-ready, textarea-compliant plain text files for NESFIC 2026:
1. NESFIC_D18_Proposal_Chandan_Kumar_Sonowal.txt (Field-by-field copy-paste textarea blocks)
2. NESFIC_D18_Proof_of_Work_Chandan_Kumar_Sonowal.txt (Full and modular copy-paste textarea blocks)
Copies to legacy Ron Hatibaruah filenames and public/downloads/ for full backwards compatibility.
"""

import os
import re
import shutil

base_dir = os.path.dirname(os.path.abspath(__file__))

def clean_text_for_textarea(text):
    """
    Strips raw markdown syntax, converts formulas to plain text,
    standardizes bullets and whitespace for HTML <textarea> compatibility.
    """
    t = text
    lines = t.split('\n')
    cleaned_lines = []
    
    for line in lines:
        stripped = line.strip()
        # Detect table separator
        if re.match(r'^\|?[\s\-:|]+\|?$', stripped):
            continue
        if stripped.startswith('|') and stripped.endswith('|'):
            cells = [c.strip() for c in stripped.strip('|').split('|')]
            clean_cells = [re.sub(r'[*`_]', '', c) for c in cells]
            cleaned_lines.append('  • ' + ' | '.join(clean_cells))
            continue
        cleaned_lines.append(line)
        
    t = '\n'.join(cleaned_lines)
    
    # Strip markdown headers (##, ###)
    t = re.sub(r'^#{1,6}\s+(.*?)$', r'\1', t, flags=re.MULTILINE)
    
    # Strip bold and italics
    t = re.sub(r'\*\*\*(.*?)\*\*\*', r'\1', t)
    t = re.sub(r'\*\*(.*?)\*\*', r'\1', t)
    t = re.sub(r'\*(.*?)\*', r'\1', t)
    t = re.sub(r'`(.*?)`', r'\1', t)
    
    # Convert markdown links [Label](url) -> Label: url
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'\1 (\2)', t)
    
    # Clean latex math
    t = re.sub(r'\$([^$]+)\$', r'\1', t)
    
    # Standardize dashes
    t = t.replace('—', ' - ').replace('–', '-')
    
    # Clean up double blank lines
    t = re.sub(r'\n{3,}', '\n\n', t)
    
    return t.strip()

def generate_proposal_text():
    src_file = os.path.join(base_dir, 'proposal_contents.md')
    out_file = os.path.join(base_dir, 'NESFIC_D18_Proposal_Chandan_Kumar_Sonowal.txt')
    legacy_file = os.path.join(base_dir, 'NESFIC_D18_Proposal_Ron_Hatibaruah.txt')
    
    with open(src_file, 'r', encoding='utf-8') as f:
        raw = f.read()
        
    # Split by Field
    sections = re.split(r'##\s+Field\s+(\d+):', raw)
    
    header = "=" * 80 + "\n"
    header += "NESFIC 2026 - STREAM 1 (GOVERNMENT TRACK) - OFFICIAL PROPOSAL TEXT\n"
    header += "Problem Statement ID: NESFIC-D-18: Digital Twin for Flood Management, Simulation and Early Warning\n"
    header += "Sponsoring Department: Department of Science & Technology (ASSAC) & ASDMA, Govt of Assam\n"
    header += "Applicant / Innovator: Chandan Kumar Sonowal\n"
    header += "Copyright: Copyright © 2026 Coretouch Technologies Pvt Ltd. All rights reserved.\n"
    header += "Solution: JalDrishti (Assam Flood & Space Digital Twin Sentinel)\n"
    header += "Live Prototype: https://jaldrishti-assam.pages.dev/\n"
    header += "GitHub Repository: https://github.com/RonHatibaruah/jaldrishti-assam\n"
    header += "=" * 80 + "\n\n"
    
    field_texts = []
    
    # Loop over fields
    for i in range(1, len(sections), 2):
        field_num = sections[i]
        field_body = sections[i+1]
        
        # Word limit info
        limit_match = re.search(r'Limit:\s*(\d+)\s*words', field_body)
        limit_str = f" [Limit: {limit_match.group(1)} words]" if limit_match else ""
        
        cleaned_body = clean_text_for_textarea(field_body)
        word_count = len(re.findall(r'\b\w+\b', cleaned_body))
        
        block = f"{'='*80}\n"
        block += f"COPY-PASTE BLOCK: FIELD {field_num}{limit_str}\n"
        block += f"Actual Word Count: {word_count} words\n"
        block += f"{'='*80}\n\n"
        block += cleaned_body + "\n\n"
        
        field_texts.append(block)
        
    full_output = header + "".join(field_texts)
    
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(full_output)
    with open(legacy_file, 'w', encoding='utf-8') as f:
        f.write(full_output)
        
    print(f"Generated text versions: {out_file} and {legacy_file} ({len(full_output)} bytes)")

def generate_pow_text():
    src_file = os.path.join(base_dir, 'proof_of_work_dossier.md')
    out_file = os.path.join(base_dir, 'NESFIC_D18_Proof_of_Work_Chandan_Kumar_Sonowal.txt')
    legacy_file = os.path.join(base_dir, 'NESFIC_D18_Proof_of_Work_Ron_Hatibaruah.txt')
    
    with open(src_file, 'r', encoding='utf-8') as f:
        raw = f.read()
        
    header = "=" * 80 + "\n"
    header += "NESFIC 2026 - STREAM 1 - PROOF OF WORK & TECHNICAL EVIDENCE DOSSIER\n"
    header += "Problem Statement ID: NESFIC-D-18: Digital Twin for Flood Management, Simulation and Early Warning\n"
    header += "Sponsoring Department: Department of Science & Technology (ASSAC) & ASDMA, Govt of Assam\n"
    header += "Applicant / Innovator: Chandan Kumar Sonowal\n"
    header += "Copyright: Copyright © 2026 Coretouch Technologies Pvt Ltd. All rights reserved.\n"
    header += "Solution: JalDrishti (Assam Flood Sentinel)\n"
    header += "Live Prototype: https://jaldrishti-assam.pages.dev/\n"
    header += "GitHub Repository: https://github.com/RonHatibaruah/jaldrishti-assam\n"
    header += "=" * 80 + "\n\n"
    
    cleaned = clean_text_for_textarea(raw)
    full_output = header + cleaned
    
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(full_output)
    with open(legacy_file, 'w', encoding='utf-8') as f:
        f.write(full_output)
        
    print(f"Generated text versions: {out_file} and {legacy_file} ({len(full_output)} bytes)")

if __name__ == '__main__':
    generate_proposal_text()
    generate_pow_text()
