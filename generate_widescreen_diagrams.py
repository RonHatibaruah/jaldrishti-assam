import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle, Polygon
import numpy as np

os.environ['MPLCONFIGDIR'] = '/tmp/matplotlib-cache'
base_dir = os.path.dirname(os.path.abspath(__file__))
out_dir = os.path.join(base_dir, 'assets', 'proposal_images')
os.makedirs(out_dir, exist_ok=True)

# Clean White / Light-Gray Blueprint Grid Palette (Data Centers Master Infographic Style)
BG_LIGHT = '#ffffff'
GRID_LIGHT = '#f1f5f9'
NAVY_HEADER = '#0f172a'
NAVY_TEXT = '#0f172a'
MUTED_TEXT = '#475569'
EMERALD_GREEN = '#059669'
TEAL_PRIMARY = '#0f766e'
ROYAL_BLUE = '#1d4ed8'
CYAN_ACCENT = '#0284c7'
AMBER_GOLD = '#d97706'
ROSE_RED = '#dc2626'
PURPLE_ACCENT = '#7c3aed'

def add_blueprint_grid(ax):
    for x in np.linspace(0, 1, 33):
        ax.axvline(x, color=GRID_LIGHT, linewidth=0.6, zorder=0)
    for y in np.linspace(0, 1, 19):
        ax.axhline(y, color=GRID_LIGHT, linewidth=0.6, zorder=0)

def add_header(ax, title, subtitle, tag="NESFIC-D-30 TECH FRAMEWORK"):
    # Top banner bar
    banner = FancyBboxPatch((0.02, 0.895), 0.96, 0.085, boxstyle="round,pad=0.01,rounding_size=0.012",
                            facecolor=NAVY_HEADER, edgecolor='#1e293b', linewidth=1.5, zorder=2)
    ax.add_patch(banner)
    
    # Tag badge
    tag_bg = FancyBboxPatch((0.035, 0.92), 0.175, 0.035, boxstyle="round,pad=0.005,rounding_size=0.008",
                            facecolor='#065f46', edgecolor=EMERALD_GREEN, linewidth=1, zorder=3)
    ax.add_patch(tag_bg)
    ax.text(0.122, 0.937, tag, ha='center', va='center', fontsize=7.5, fontweight='bold', color='#6ee7b7', zorder=4)
    
    ax.text(0.225, 0.942, title, fontsize=10.5, fontweight='bold', color='#ffffff', zorder=4)
    ax.text(0.225, 0.914, subtitle, fontsize=8, color='#38bdf8', zorder=4)
    
    # Right status chip
    gov_badge = FancyBboxPatch((0.79, 0.92), 0.175, 0.035, boxstyle="round,pad=0.005,rounding_size=0.008",
                               facecolor='#1e293b', edgecolor='#334155', linewidth=1, zorder=3)
    ax.add_patch(gov_badge)
    ax.text(0.877, 0.937, "GOVT OF ASSAM • NHM / NTEP", ha='center', va='center', fontsize=7, fontweight='bold', color='#e2e8f0', zorder=4)

def save_dual(fig, basename):
    plt.tight_layout()
    png_path = os.path.join(out_dir, f"{basename}.png")
    jpg_path = os.path.join(out_dir, f"{basename}.jpg")
    plt.savefig(png_path, dpi=200, bbox_inches='tight')
    plt.savefig(jpg_path, dpi=200, bbox_inches='tight')
    plt.close()
    print(f"Rendered {basename}.png & .jpg (16:9 Widescreen)")

# ==============================================================================
# DIAGRAM 1: 16:9 Paradigm Shift Framework
# ==============================================================================
def create_widescreen_diagram_1():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_LIGHT)
    fig.patch.set_facecolor(BG_LIGHT)
    ax.axis('off')
    add_blueprint_grid(ax)

    add_header(ax, "PARADIGM SHIFT: TRANSFORMATION FROM PASSIVE TB REPORTING TO PROACTIVE AI DECISION SUPPORT",
               "National Health Mission & State TB Cell, Govt of Assam • NESFIC-D-30 Government Track",
               "PARADIGM SHIFT FRAMEWORK")

    # Metric summary pills
    metrics = [
        ("STATEWIDE NOTIFICATION", "32,840 / year", '#0284c7'),
        ("EARLY MORTALITY CRITICAL WINDOW", "First 30 Days (74% Deaths)", '#dc2626'),
        ("TARGET REFERRAL SLA", "< 48 Hours Cold-Chain", '#059669'),
        ("PREDICTIVE CARTRIDGE HORIZON", "14 Days Prior Stockout", '#d97706')
    ]
    for idx, (label, val, col) in enumerate(metrics):
        x = 0.02 + idx * 0.245
        pill = FancyBboxPatch((x, 0.835), 0.23, 0.045, boxstyle="round,pad=0.005,rounding_size=0.008",
                              facecolor='#f8fafc', edgecolor=col, linewidth=1.2, zorder=2)
        ax.add_patch(pill)
        ax.text(x + 0.015, 0.862, label, fontsize=6.8, fontweight='bold', color=MUTED_TEXT, zorder=3)
        ax.text(x + 0.015, 0.843, val, fontsize=8, fontweight='bold', color=col, zorder=3)

    # LEFT COLUMN: Traditional Passive Approach
    box_left = FancyBboxPatch((0.02, 0.06), 0.47, 0.75, boxstyle="round,pad=0.015,rounding_size=0.015",
                              facecolor='#fff1f2', edgecolor='#fda4af', linewidth=1.5, zorder=2)
    ax.add_patch(box_left)
    ax.text(0.255, 0.785, "TRADITIONAL TB PROGRAMME WORKFLOW (PASSIVE & LAGGING)", ha='center', fontsize=10.5, fontweight='bold', color='#9f1239', zorder=3)
    ax.text(0.255, 0.760, "Retrospective Monthly Aggregation, Untriaged High-Risk Mortality & Sputum Referral Leakages", ha='center', fontsize=7.5, color='#881337', zorder=3)

    left_cards = [
        ("STAGE 1 • RETROSPECTIVE DATA ENTRY", "Ni-kshay data logged primarily for retrospective administrative reporting.\nHigh-risk patients remain indistinguishable from routine cohorts in flat registries.", '#ffe4e6', '#f43f5e'),
        ("STAGE 2 • UNTRIAGED EARLY MORTALITY", "Patients with severe undernutrition (BMI < 14) and smear 3+ given uniform ambulatory\nregimens; 74% of patient deaths occur in the first 30 days undetected.", '#ffe4e6', '#f43f5e'),
        ("STAGE 3 • UNTRACKED SPUTUM REFERRALS", "Presumptive TB attendees face prolonged transit delays between peripheral HWCs\nand molecular labs; high pre-treatment loss-to-follow-up.", '#fecdd3', '#e11d48'),
        ("STAGE 4 • REACTIVE LOGISTICS & STOCKOUTS", "Truenat/CBNAAT cartridge depletions detected only after facilities run dry,\nhalting universal drug susceptibility testing (UDST) for weeks.", '#fda4af', '#be123c')
    ]

    for idx, (head, desc, bg, border) in enumerate(left_cards):
        y = 0.63 - idx * 0.135
        card = FancyBboxPatch((0.04, y - 0.03), 0.43, 0.105, boxstyle="round,pad=0.01,rounding_size=0.012",
                              facecolor=bg, edgecolor=border, linewidth=1.2, zorder=3)
        ax.add_patch(card)
        ax.text(0.06, y + 0.038, head, fontsize=8, fontweight='bold', color='#881337', zorder=4)
        ax.text(0.06, y - 0.008, desc, fontsize=7.2, color='#4c0519', linespacing=1.2, zorder=4)

    # RIGHT COLUMN: NikshayDrishti Proactive AI Model
    box_right = FancyBboxPatch((0.51, 0.06), 0.47, 0.75, boxstyle="round,pad=0.015,rounding_size=0.015",
                               facecolor='#f0fdf4', edgecolor='#86efac', linewidth=2.0, zorder=2)
    ax.add_patch(box_right)
    ax.text(0.745, 0.785, "NIKSHAYDRISHTI PROACTIVE DECISION SUPPORT (CDSS)", ha='center', fontsize=10.5, fontweight='bold', color='#14532d', zorder=3)
    ax.text(0.745, 0.760, "AI Risk Stratification, Differentiated Inpatient Triage, Zero-Leakage Referrals & Predictive Buffer", ha='center', fontsize=7.5, color='#15803d', zorder=3)

    right_cards = [
        ("STAGE 1 • EXPLAINABLE ML STRATIFICATION", "Real-time multi-variable XGBoost risk scoring (0-100) with SHAP attribution.\nTriages patients into Critical, High Risk, Moderate, and Standard cohorts.", '#dcfce7', '#22c55e'),
        ("STAGE 2 • DIFFERENTIATED INPATIENT TRIAGE", "Critical triage patients (BMI < 14, smear 3+, MDR) routed for upfront district bed\nadmission, high-protein nutritional basket, and bi-weekly MO visits.", '#dcfce7', '#22c55e'),
        ("STAGE 3 • ZERO-LEAKAGE CLOSED-LOOP REFERRALS", "Barcoded specimen cold-chain tracking from Ayushman Arogya Mandirs to NAAT hubs;\nautomated 48h SLA breach alerts eliminate diagnostic dropouts.", '#bbf7d0', '#16a34a'),
        ("STAGE 4 • PREDICTIVE CARTRIDGE BUFFER LOGISTICS", "Telemetry-based burn rate modeling forecasts cartridge stockouts 14 days in advance,\ntriggering automated electronic indents to Central TB Warehouse.", '#86efac', '#15803d')
    ]

    for idx, (head, desc, bg, border) in enumerate(right_cards):
        y = 0.63 - idx * 0.135
        card = FancyBboxPatch((0.53, y - 0.03), 0.43, 0.105, boxstyle="round,pad=0.01,rounding_size=0.012",
                              facecolor=bg, edgecolor=border, linewidth=1.2, zorder=3)
        ax.add_patch(card)
        ax.text(0.55, y + 0.038, head, fontsize=8, fontweight='bold', color='#065f46', zorder=4)
        ax.text(0.55, y - 0.008, desc, fontsize=7.2, color='#064e3b', linespacing=1.2, zorder=4)

    save_dual(fig, "diagram_1_before_after_workflow")

# ==============================================================================
# DIAGRAM 2: 16:9 Enterprise Data Architecture & ASDC Pipeline
# ==============================================================================
def create_widescreen_diagram_2():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_LIGHT)
    fig.patch.set_facecolor(BG_LIGHT)
    ax.axis('off')
    add_blueprint_grid(ax)

    add_header(ax, "NIKSHAYDRISHTI ENTERPRISE DATA ARCHITECTURE & ML PIPELINE (ASDC)",
               "Secure Cloud-Native Architecture at Assam State Data Centre • ABDM & DPDP Act 2023 Compliant",
               "ENTERPRISE GOVTECH BLUEPRINT")

    # 3 Horizontal Architecture Tiers
    # Tier 1: Multi-Source Ingestion
    t1 = FancyBboxPatch((0.02, 0.65), 0.96, 0.22, boxstyle="round,pad=0.01,rounding_size=0.012",
                        facecolor='#eff6ff', edgecolor='#93c5fd', linewidth=1.5, zorder=2)
    ax.add_patch(t1)
    ax.text(0.04, 0.835, "TIER 1: MULTI-SOURCE INGESTION & INTEROPERABILITY LAYER", fontsize=9, fontweight='bold', color='#1d4ed8', zorder=3)
    ax.text(0.04, 0.815, "Standardized FHIR / HL7 REST Integration with Central Government Platforms & Field Telemetry", fontsize=7.2, color='#64748b', zorder=3)

    sources = [
        ("Ni-kshay Portal (MoHFW)", "Demographics, Smear Grades,\nGeneXpert/Truenat, Regimens", '#3b82f6'),
        ("Nikshay Aushadhi", "4FDC / 3FDC Drug Inventories,\nCartridge Stock Balances", '#0284c7'),
        ("99DOTS / MERM Telemetry", "Digital Adherence Timestamps,\nPill-Box Telemetry, Missed Doses", '#6366f1'),
        ("Ayushman Arogya Mandirs", "Presumptive Sputum Registries,\nASHA Community Screenings", '#0d9488')
    ]
    for i, (title, detail, border_c) in enumerate(sources):
        x = 0.035 + i * 0.235
        b = FancyBboxPatch((x, 0.67), 0.22, 0.12, boxstyle="round,pad=0.008,rounding_size=0.01",
                           facecolor='#ffffff', edgecolor=border_c, linewidth=1.2, zorder=3)
        ax.add_patch(b)
        ax.text(x + 0.015, 0.755, title, fontsize=7.8, fontweight='bold', color=border_c, zorder=4)
        ax.text(x + 0.015, 0.705, detail, fontsize=6.8, color='#334155', linespacing=1.2, zorder=4)

    # Tier 2: Secure ASDC Enclave & ML Core
    t2 = FancyBboxPatch((0.02, 0.35), 0.96, 0.27, boxstyle="round,pad=0.01,rounding_size=0.012",
                        facecolor='#f8fafc', edgecolor='#94a3b8', linewidth=1.8, zorder=2)
    ax.add_patch(t2)
    ax.text(0.04, 0.585, "TIER 2: ASSAM STATE DATA CENTRE (ASDC) EXPLAINABLE ML ENGINE & RECONCILIATION CORE", fontsize=9, fontweight='bold', color='#0f172a', zorder=3)
    ax.text(0.04, 0.565, "De-identified Analytics Sandbox, XGBoost Regularized Classifiers, SHAP Explainability & PostGIS Spatial Core", fontsize=7.2, color='#64748b', zorder=3)

    engines = [
        ("ABDM & DPDP Tokenizer", "ABHA M1-M3 pseudonymization\nZero plaintext PII storage\nSHA-256 cryptographic audit", '#475569'),
        ("XGBoost Risk Stratifier", "Multi-variable mortality model\nAUROC = 0.887 / Sensitivity = 84.2%\nSHAP local attribution matrix", '#0f766e'),
        ("PostGIS Spatial Cluster", "Tea garden basti polygon overlay\nChar riverine access modeling\nACF Mobile AI-Xray optimizer", '#059669'),
        ("Fuzzy De-Duplication", "Double Metaphone transliteration\nJaro-Winkler string distance\n60-day verbal autopsy analytics", '#7c3aed')
    ]
    for i, (title, detail, border_c) in enumerate(engines):
        x = 0.035 + i * 0.235
        b = FancyBboxPatch((x, 0.37), 0.22, 0.17, boxstyle="round,pad=0.008,rounding_size=0.01",
                           facecolor='#ffffff', edgecolor=border_c, linewidth=1.2, zorder=3)
        ax.add_patch(b)
        ax.text(x + 0.015, 0.505, title, fontsize=8, fontweight='bold', color=border_c, zorder=4)
        ax.text(x + 0.015, 0.430, detail, fontsize=6.8, color='#334155', linespacing=1.2, zorder=4)

    # Tier 3: Role-Based Decision Support Consoles
    t3 = FancyBboxPatch((0.02, 0.05), 0.96, 0.27, boxstyle="round,pad=0.01,rounding_size=0.012",
                        facecolor='#ecfdf5', edgecolor='#34d399', linewidth=1.5, zorder=2)
    ax.add_patch(t3)
    ax.text(0.04, 0.285, "TIER 3: ROLE-BASED DECISION-SUPPORT & ACTION WORKLIST CONSOLES", fontsize=9, fontweight='bold', color='#065f46', zorder=3)
    ax.text(0.04, 0.265, "Authorized Health Department User Interfaces with Strict Non-Diagnostic CDSS Guardrails", fontsize=7.2, color='#047857', zorder=3)

    consoles = [
        ("State TB Officer (STO)", "Statewide elimination cockpit\nDistrict notification trajectory\nNikshay Poshan DBT oversight", '#059669'),
        ("District TB Officer (DTO)", "Facility Supervision Tours (SPI)\n14-day cartridge stockout alert\nEarly death audit compliance", '#0d9488'),
        ("Medical Officer (MO)", "Differentiated inpatient triage\nHigh-protein food basket release\nBi-weekly clinical monitoring", '#0284c7'),
        ("Field Supervisors (STS/ASHA)", "Zero-leakage courier tracking\nOffline tablet cough registry\nDaily adherence home visits", '#4338ca')
    ]
    for i, (title, detail, border_c) in enumerate(consoles):
        x = 0.035 + i * 0.235
        b = FancyBboxPatch((x, 0.07), 0.22, 0.17, boxstyle="round,pad=0.008,rounding_size=0.01",
                           facecolor='#ffffff', edgecolor=border_c, linewidth=1.2, zorder=3)
        ax.add_patch(b)
        ax.text(x + 0.015, 0.205, title, fontsize=8, fontweight='bold', color=border_c, zorder=4)
        ax.text(x + 0.015, 0.130, detail, fontsize=6.8, color='#14532d', linespacing=1.2, zorder=4)

    save_dual(fig, "diagram_2_dual_system_reconciliation")

# ==============================================================================
# DIAGRAM 3: 16:9 Multi-Tier Risk Stratification Framework
# ==============================================================================
def create_widescreen_diagram_3():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_LIGHT)
    fig.patch.set_facecolor(BG_LIGHT)
    ax.axis('off')
    add_blueprint_grid(ax)

    add_header(ax, "MULTI-TIER CLINICAL RISK STRATIFICATION & DIFFERENTIATED CARE FRAMEWORK",
               "Explainable Clinical Decision Support System (CDSS) • Mandatory Human-in-the-Loop Verification",
               "CLINICAL TRIAGE FRAMEWORK")

    # Statutory Disclaimer Banner
    disc = FancyBboxPatch((0.02, 0.835), 0.96, 0.045, boxstyle="round,pad=0.005,rounding_size=0.008",
                          facecolor='#fffbeb', edgecolor='#f59e0b', linewidth=1.2, zorder=2)
    ax.add_patch(disc)
    ax.text(0.50, 0.857, "MANDATORY STATUTORY CDSS NOTICE (NESFIC-D-30): Risk scores and triage recommendations are decision-support tools only and must NOT replace clinical diagnosis or clinical discretion by the treating Medical Officer.",
            ha='center', va='center', fontsize=7.2, fontweight='bold', color='#78350f', zorder=3)

    tiers = [
        ("CRITICAL TRIAGE", "Risk Score: 90 - 100",
         "CLINICAL INDICATORS (SHAP):\n• Severe Undernutrition (BMI < 14)\n• Smear Grade 3+ with Cavitation\n• Multidrug Resistant (MDR Rif-R)\n• Advanced HIV (CD4 < 200 / uL)",
         "DIFFERENTIATED CARE PROTOCOL:\n1. Immediate District Hospital bed triage\n2. Priority High-Protein Food Basket\n3. Bi-weekly Medical Officer visits\n4. Baseline ECG & liver function panel\n5. Fast-tracked Nikshay Poshan DBT",
         '#fef2f2', '#ef4444', '#7f1d1d'),
        ("HIGH RISK", "Risk Score: 75 - 89",
         "CLINICAL INDICATORS (SHAP):\n• Uncontrolled Diabetes (HbA1c > 8.0)\n• Age > 60 with Heavy Tobacco\n• Prior Treatment Default History\n• Tea Garden Remote Settlement",
         "DIFFERENTIATED CARE PROTOCOL:\n1. Weekly home verification by STS\n2. Priority Nikshay Poshan payment\n3. Dedicated adherence counseling\n4. Day-14 early sputum conversion\n5. MERM smart pillbox enrollment",
         '#fff7ed', '#f97316', '#7c2d12'),
        ("MODERATE RISK", "Risk Score: 50 - 74",
         "CLINICAL INDICATORS (SHAP):\n• Borderline Malnutrition (BMI 16-18)\n• Smear 1+ / Extrapulmonary mild\n• Riverine Char access barrier\n• Occasional missed doses",
         "DIFFERENTIATED CARE PROTOCOL:\n1. Fortnightly review by ASHA\n2. Digital 99DOTS compliance tracking\n3. Standard Nikshay Poshan DBT\n4. Monthly drug refill at SC-HWC\n5. Airborne infection control advice",
         '#fefce8', '#eab308', '#713f12'),
        ("STANDARD CARE", "Risk Score: < 50",
         "CLINICAL INDICATORS (SHAP):\n• Normal BMI (> 18.5 kg/m2)\n• Smear Negative or Scanty\n• Zero serious co-morbidities\n• Good urban health accessibility",
         "DIFFERENTIATED CARE PROTOCOL:\n1. Standard outpatient daily 4FDC\n2. Monthly routine PHI follow-up\n3. Self-administered DOTS regimen\n4. Standard 6-month cure completion\n5. Post-treatment 6-month check",
         '#f0fdf4', '#22c55e', '#14532d')
    ]

    for idx, (title, sub, criteria, action, bg, border, text_c) in enumerate(tiers):
        x = 0.02 + idx * 0.245
        card = FancyBboxPatch((x, 0.06), 0.23, 0.75, boxstyle="round,pad=0.015,rounding_size=0.015",
                              facecolor=bg, edgecolor=border, linewidth=2.0, zorder=2)
        ax.add_patch(card)
        ax.text(x + 0.115, 0.775, title, ha='center', fontsize=9.5, fontweight='bold', color=text_c, zorder=3)
        ax.text(x + 0.115, 0.750, sub, ha='center', fontsize=7.5, color='#475569', zorder=3)

        # Trigger Criteria Box
        c_box = FancyBboxPatch((x + 0.015, 0.45), 0.20, 0.27, boxstyle="round,pad=0.008,rounding_size=0.01",
                               facecolor='#ffffff', edgecolor=border, linewidth=1, zorder=3)
        ax.add_patch(c_box)
        ax.text(x + 0.025, 0.585, criteria, fontsize=6.8, color='#1e293b', linespacing=1.25, zorder=4)

        # Action Protocol Box
        a_box = FancyBboxPatch((x + 0.015, 0.08), 0.20, 0.34, boxstyle="round,pad=0.008,rounding_size=0.01",
                               facecolor='#ffffff', edgecolor=border, linewidth=1, zorder=3)
        ax.add_patch(a_box)
        ax.text(x + 0.025, 0.250, action, fontsize=6.8, color='#334155', linespacing=1.25, zorder=4)

    save_dual(fig, "diagram_3_cadastral_anomaly_catalog")

# ==============================================================================
# DIAGRAM 4: 16:9 Geospatial Vulnerability & ACF Routing Engine
# ==============================================================================
def create_widescreen_diagram_4():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_LIGHT)
    fig.patch.set_facecolor(BG_LIGHT)
    ax.axis('off')
    add_blueprint_grid(ax)

    add_header(ax, "GEOSPATIAL VULNERABILITY MAPPING & ACTIVE CASE FINDING (ACF) ENGINE",
               "Micro-Targeting High-Risk Clusters Across Assam: Tea Estates, Riverine Chars, Urban Slums & Brick Kilns",
               "GEOSPATIAL SURVEILLANCE ENGINE")

    # Left: 4 Vulnerable Cluster Typologies in Assam
    ax.text(0.24, 0.855, "4 PRIORITY HIGH-RISK VULNERABILITY TYPOLOGIES (ASSAM EPIDEMIOLOGY)", ha='center', fontsize=9.5, fontweight='bold', color='#0f172a', zorder=3)

    clusters = [
        ("TEA GARDEN LINE BASTIS (UPPER ASSAM)", "Dibrugarh, Tinsukia, Sonitpur (800+ Estates)\nHigh occupational silica, severe undernutrition (BMI < 14 in >30%)\nPositivity Yield: 8.9% - 11.4% • Priority Score: 9.4 / 10", '#dcfce7', '#15803d'),
        ("RIVERINE CHAR SANDBARS (LOWER ASSAM)", "Barpeta, Dhubri, South Salmara (Brahmaputra Islands)\nSevere seasonal flood isolation, boat-dependent sputum transit\nPositivity Yield: 9.5% - 12.0% • Priority Score: 9.6 / 10", '#ffedd5', '#c2410c'),
        ("DENSE URBAN SLUMS & RAILWAY COLONIES", "Kamrup Metropolitan (Guwahati West, Pandu, Maligaon)\nHigh migrant laborer density, poorly ventilated housing\nPositivity Yield: 7.2% - 8.8% • Priority Score: 8.8 / 10", '#f1f5f9', '#475569'),
        ("REMOTE HILL TRIBAL HAMLETS", "Karbi Anglong, Dima Hasao (Hamren Road)\nLow cell connectivity, reliance on traditional healers\nPositivity Yield: 9.0% - 10.5% • Priority Score: 8.7 / 10", '#fef9c3', '#a16207')
    ]

    for idx, (name, details, bg, border) in enumerate(clusters):
        y = 0.67 - idx * 0.185
        card = FancyBboxPatch((0.02, y - 0.03), 0.45, 0.155, boxstyle="round,pad=0.012,rounding_size=0.012",
                              facecolor=bg, edgecolor=border, linewidth=1.5, zorder=2)
        ax.add_patch(card)
        ax.text(0.04, y + 0.085, name, fontsize=8.2, fontweight='bold', color='#0f172a', zorder=3)
        ax.text(0.04, y + 0.015, details, fontsize=7.2, color='#334155', linespacing=1.25, zorder=3)

    # Right: Mobile AI-Xray Van Route Optimization Engine
    box_right = FancyBboxPatch((0.50, 0.06), 0.48, 0.81, boxstyle="round,pad=0.015,rounding_size=0.015",
                               facecolor='#f0fdfa', edgecolor='#0d9488', linewidth=2.0, zorder=2)
    ax.add_patch(box_right)
    ax.text(0.74, 0.835, "MOBILE AI-XRAY & BATTERY TRUENAT FLEET ROUTING", ha='center', fontsize=10.5, fontweight='bold', color='#0f766e', zorder=3)
    ax.text(0.74, 0.810, "PostGIS Optimization Maximizing Presumptive Yield & Diagnostic Conversion", ha='center', fontsize=7.5, color='#115e59', zorder=3)

    steps = [
        ("STEP 1 • KERNEL DENSITY & DEFICIT MAPPING", "Aggregates historical notification density, presumptive testing gap,\nand vulnerability index to compute automated cluster priority rankings.", '#ffffff', '#14b8a6'),
        ("STEP 2 • ROUTE OPTIMIZATION FOR MOBILE VANS", "Schedules daily routes for Mobile Vans equipped with ultraportable\nhandheld X-Ray units + qXR AI and 4-module battery Truenat units.", '#ffffff', '#14b8a6'),
        ("STEP 3 • ON-SPOT AI-TRIAGE & MOLECULAR RUN", "Patients with AI abnormality score > 0.5 undergo immediate on-spot\nTruenat cartridge test; Rifampicin resistance confirmed in 60 mins.", '#ffffff', '#14b8a6'),
        ("STEP 4 • FIRST-DOSE HANDOVER & DBT ENROLLMENT", "Confirmed cases initiated on daily 4FDC on the spot; bank details\nseeded directly into Nikshay Poshan Yojana for ₹1,000/mo nutrition DBT.", '#ffffff', '#14b8a6')
    ]

    for idx, (title, desc, bg, border) in enumerate(steps):
        y = 0.65 - idx * 0.17
        w_box = FancyBboxPatch((0.52, y - 0.03), 0.44, 0.13, boxstyle="round,pad=0.01,rounding_size=0.01",
                               facecolor=bg, edgecolor=border, linewidth=1.2, zorder=3)
        ax.add_patch(w_box)
        ax.text(0.54, y + 0.065, title, fontsize=8, fontweight='bold', color='#0f766e', zorder=4)
        ax.text(0.54, y + 0.010, desc, fontsize=7.2, color='#134e4a', linespacing=1.2, zorder=4)

    save_dual(fig, "diagram_4_land_health_score_hierarchy")

# ==============================================================================
# DIAGRAM 5: 16:9 Closed-Loop Referral Cascade
# ==============================================================================
def create_widescreen_diagram_5():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_LIGHT)
    fig.patch.set_facecolor(BG_LIGHT)
    ax.axis('off')
    add_blueprint_grid(ax)

    add_header(ax, "5-STAGE CLOSED-LOOP DIAGNOSTIC & TREATMENT REFERRAL PIPELINE (ZERO-LEAKAGE)",
               "End-to-End Tracking from Community Sputum Collection to First-Dose Initiation with SLA Enforcement",
               "CLOSED-LOOP REFERRAL CASCADE")

    stages = [
        ("STAGE 1", "Presumptive Identification", 
         "• Ayushman Arogya Mandir (HWC)\n• Cough screening by ASHA / CHO\n• Barcoded sterile specimen cup\n• Patient mobile number logged", 
         "Target SLA: < 24 Hours", '#eff6ff', '#2563eb'),
        ("STAGE 2", "Cold-Chain Courier Transit", 
         "• Assam Post / Dedicated Courier\n• Temperature-controlled cooler box\n• Real-time courier dispatch scan\n• GPS transit monitoring", 
         "Target SLA: < 48 Hours", '#fef3c7', '#d97706'),
        ("STAGE 3", "Molecular NAAT Testing", 
         "• Truenat Quattro / GeneXpert\n• MTB detection & Rifampicin test\n• Lab supervisor electronic sign-off\n• Cartridge barcode reconciliation", 
         "Target SLA: < 24 Hours", '#dcfce7', '#16a34a'),
        ("STAGE 4", "Ni-kshay Auto-Sync & Alert", 
         "• Instant FHIR / HL7 bi-directional sync\n• SMS alert dispatched to patient\n• Treating Medical Officer notified\n• Clinical ML risk score computed", 
         "Target SLA: Instant", '#f3e8ff', '#9333ea'),
        ("STAGE 5", "First-Dose Initiation", 
         "• Daily 4FDC regimen initiated\n• High-protein food basket handed over\n• Inpatient triage if critical score\n• First Nikshay Poshan payment queued", 
         "Target SLA: < 48 Hours", '#ecfdf5', '#059669')
    ]

    for idx, (tag, title, desc, sla, bg, border) in enumerate(stages):
        x = 0.02 + idx * 0.195
        card = FancyBboxPatch((x, 0.20), 0.185, 0.65, boxstyle="round,pad=0.015,rounding_size=0.015",
                              facecolor=bg, edgecolor=border, linewidth=2.0, zorder=2)
        ax.add_patch(card)
        ax.text(x + 0.092, 0.810, tag, ha='center', fontsize=8, fontweight='bold', color=border, zorder=3)
        ax.text(x + 0.092, 0.775, title, ha='center', fontsize=8.2, fontweight='bold', color='#0f172a', zorder=3)

        d_box = FancyBboxPatch((x + 0.012, 0.33), 0.161, 0.39, boxstyle="round,pad=0.008,rounding_size=0.01",
                               facecolor='#ffffff', edgecolor=border, linewidth=1, zorder=3)
        ax.add_patch(d_box)
        ax.text(x + 0.022, 0.525, desc, fontsize=7.2, color='#334155', linespacing=1.3, zorder=4)

        sla_box = FancyBboxPatch((x + 0.012, 0.22), 0.161, 0.08, boxstyle="round,pad=0.008,rounding_size=0.01",
                                 facecolor='#ffffff', edgecolor=border, linewidth=1.2, zorder=3)
        ax.add_patch(sla_box)
        ax.text(x + 0.092, 0.260, sla, ha='center', fontsize=7.5, fontweight='bold', color=border, zorder=4)

    # Bottom Callout: Automated SLA Escalation Engine
    bot_card = FancyBboxPatch((0.02, 0.05), 0.96, 0.11, boxstyle="round,pad=0.01,rounding_size=0.012",
                              facecolor='#fff1f2', edgecolor='#f43f5e', linewidth=1.8, zorder=2)
    ax.add_patch(bot_card)
    ax.text(0.50, 0.118, "AUTOMATED SLA BREACH ESCALATION ENGINE (ZERO-LEAKAGE ARCHITECTURE)", ha='center', fontsize=8.5, fontweight='bold', color='#9f1239', zorder=3)
    ax.text(0.50, 0.085, "If sample transit exceeds 48h OR positive test to treatment initiation exceeds 48h, an automated urgent escalation SMS/WhatsApp is sent to the Senior TB Lab Supervisor (STLS), STS, and District TB Officer.", ha='center', fontsize=7.2, color='#881337', zorder=3)

    save_dual(fig, "diagram_5_lat_mandal_mobile_app")

# ==============================================================================
# DIAGRAM 6: 16:9 Facility Supervision & Predictive Logistics Engine
# ==============================================================================
def create_widescreen_diagram_6():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_LIGHT)
    fig.patch.set_facecolor(BG_LIGHT)
    ax.axis('off')
    add_blueprint_grid(ax)

    add_header(ax, "FACILITY SUPERVISION TOURS (SPI) & PREDICTIVE CARTRIDGE LOGISTICS",
               "Algorithmic Supervisory Priority Index (SPI) • Predictive Truenat/CBNAAT Cartridge Burn-Rate Forecaster",
               "OPERATIONAL INTELLIGENCE ENGINE")

    # Left: Supervisory Priority Index (SPI)
    left_box = FancyBboxPatch((0.02, 0.06), 0.47, 0.81, boxstyle="round,pad=0.015,rounding_size=0.015",
                              facecolor='#ffffff', edgecolor='#0284c7', linewidth=2.0, zorder=2)
    ax.add_patch(left_box)
    ax.text(0.255, 0.835, "SUPERVISORY PRIORITY INDEX (SPI)", ha='center', fontsize=11, fontweight='bold', color='#0369a1', zorder=3)
    ax.text(0.255, 0.810, "Algorithmic Weekly Tour Itinerary for DTOs & STS Teams", ha='center', fontsize=7.5, color='#64748b', zorder=3)

    spi_factors = [
        ("PRESUMPTIVE DROP-OFF RATE (WEIGHT: 30%)", "High volume of outpatient cough attendees not linked to molecular NAAT testing.\nSignals primary care screening leakage requiring direct STS training.", '#f0f9ff', '#38bdf8'),
        ("SMEAR-TO-NAAT CONVERSION GAP (WEIGHT: 25%)", "Facilities continuing to rely exclusively on legacy smear microscopy without\nconfirming Rifampicin resistance through Truenat/CBNAAT molecular assays.", '#f0f9ff', '#38bdf8'),
        ("EARLY MORTALITY & DEFAULT CLUSTERS (WEIGHT: 25%)", "Health institutions exhibiting > 5% early treatment mortality or loss-to-follow-up\ndue to delayed presentation or inadequate differentiated nutritional care.", '#f0f9ff', '#38bdf8'),
        ("CARTRIDGE STOCK DEPLETION & DOWNTIME (WEIGHT: 20%)", "Facilities facing impending consumable stockouts or recurring machine optical\nsensor errors that threaten diagnostic service continuity.", '#f0f9ff', '#38bdf8')
    ]
    for idx, (title, sub, bg, border) in enumerate(spi_factors):
        y = 0.65 - idx * 0.17
        s_box = FancyBboxPatch((0.04, y - 0.03), 0.43, 0.13, boxstyle="round,pad=0.01,rounding_size=0.01",
                               facecolor=bg, edgecolor=border, linewidth=1.2, zorder=3)
        ax.add_patch(s_box)
        ax.text(0.06, y + 0.065, title, fontsize=8, fontweight='bold', color='#0369a1', zorder=4)
        ax.text(0.06, y + 0.010, sub, fontsize=7.2, color='#334155', linespacing=1.2, zorder=4)

    # Right: Cartridge Stockout Forecaster
    right_box = FancyBboxPatch((0.51, 0.06), 0.47, 0.81, boxstyle="round,pad=0.015,rounding_size=0.015",
                               facecolor='#ffffff', edgecolor='#059669', linewidth=2.0, zorder=2)
    ax.add_patch(right_box)
    ax.text(0.745, 0.835, "PREDICTIVE CARTRIDGE BUFFER INVENTORY (NIKSHAY AUSHADHI)", ha='center', fontsize=11, fontweight='bold', color='#065f46', zorder=3)
    ax.text(0.745, 0.810, "Continuous Machine Telemetry & Automated Re-Supply Pipeline", ha='center', fontsize=7.5, color='#64748b', zorder=3)

    logistics_steps = [
        ("DAILY BURN-RATE TELEMETRY", "Monitors tests run per machine (Truenat Quattro / GeneXpert 4-module)\nagainst facility catchment population and seasonal presumptive spikes.", '#ecfdf5', '#34d399'),
        ("14-DAY STOCKOUT HORIZON ALERTS", "Triggers high-priority visual alerts on the DTO dashboard when remaining\ncartridge inventory drops below 7 days of historical consumption.", '#ecfdf5', '#34d399'),
        ("AUTOMATED NIKSHAY AUSHADHI REQUISITIONS", "Pre-fills electronic replenishment indents to the State TB Drug Depot (Guwahati)\nwith priority dispatch vouchers, eliminating manual requisition delays.", '#ecfdf5', '#34d399'),
        ("PREVENTIVE MACHINE MAINTENANCE TICKETING", "Automated service tickets generated for optical sensor drift, thermal module\nvariance, or battery cycle degradation before machine breakdown occurs.", '#ecfdf5', '#34d399')
    ]
    for idx, (title, sub, bg, border) in enumerate(logistics_steps):
        y = 0.65 - idx * 0.17
        l_box = FancyBboxPatch((0.53, y - 0.03), 0.43, 0.13, boxstyle="round,pad=0.01,rounding_size=0.01",
                               facecolor=bg, edgecolor=border, linewidth=1.2, zorder=3)
        ax.add_patch(l_box)
        ax.text(0.55, y + 0.065, title, fontsize=8, fontweight='bold', color='#065f46', zorder=4)
        ax.text(0.55, y + 0.010, sub, fontsize=7.2, color='#14532d', linespacing=1.2, zorder=4)

    save_dual(fig, "diagram_6_citizen_land_health_certificate")

# ==============================================================================
# DIAGRAM 7: 16:9 De-Duplication & Early Mortality Verbal Autopsy Analytics
# ==============================================================================
def create_widescreen_diagram_7():
    fig, ax = plt.subplots(figsize=(16, 9), dpi=200)
    ax.set_facecolor(BG_LIGHT)
    fig.patch.set_facecolor(BG_LIGHT)
    ax.axis('off')
    add_blueprint_grid(ax)

    add_header(ax, "ALGORITHMIC DE-DUPLICATION & 60-DAY EARLY MORTALITY VERBAL AUTOPSIES",
               "Double Metaphone Assamese Transliteration • Verbal Autopsy Root-Cause Elimination Framework",
               "QUALITY & INTEGRITY ENCLAVE")

    # Left: Fuzzy De-Duplication Engine
    left_box = FancyBboxPatch((0.02, 0.06), 0.47, 0.81, boxstyle="round,pad=0.015,rounding_size=0.015",
                              facecolor='#f8fafc', edgecolor='#6366f1', linewidth=2.0, zorder=2)
    ax.add_patch(left_box)
    ax.text(0.255, 0.835, "HYBRID FUZZY DE-DUPLICATION PIPELINE", ha='center', fontsize=11, fontweight='bold', color='#4338ca', zorder=3)
    ax.text(0.255, 0.810, "Reconciles Fragmented Cross-District & Public-Private Registrations", ha='center', fontsize=7.5, color='#64748b', zorder=3)

    dedup_features = [
        ("DOUBLE METAPHONE ASSAMESE TRANSLITERATION", "Matches phonetic variants in Assamese names across Roman script\n(e.g., 'Tanti' / 'Tantee', 'Deka' / 'Deyka', 'Biren' / 'Birendra').", '#eef2ff', '#818cf8'),
        ("MOBILE & HOUSEHOLD CONTACT HASHING", "SHA-256 phone hashes identify duplicate registrations originating from\nprivate lab notifications, NGO active case finding, or public PHIs.", '#eef2ff', '#818cf8'),
        ("GEO-SPATIAL RESIDENCE PROXIMITY", "Flags patient records residing within 1.5 km of an active treatment case\nwith identical age (+/- 2 years) and matching gender profile.", '#eef2ff', '#818cf8'),
        ("MASTER RECORD MERGING & DBT INTEGRITY", "Consolidates fragmented treatment adherence logs into a single master ID,\npreventing duplicate Nikshay Poshan DBT payouts and false default rates.", '#eef2ff', '#818cf8')
    ]
    for idx, (title, sub, bg, border) in enumerate(dedup_features):
        y = 0.65 - idx * 0.17
        d_box = FancyBboxPatch((0.04, y - 0.03), 0.43, 0.13, boxstyle="round,pad=0.01,rounding_size=0.01",
                               facecolor=bg, edgecolor=border, linewidth=1.2, zorder=3)
        ax.add_patch(d_box)
        ax.text(0.06, y + 0.065, title, fontsize=8, fontweight='bold', color='#3730a3', zorder=4)
        ax.text(0.06, y + 0.010, sub, fontsize=7.2, color='#1e1b4b', linespacing=1.2, zorder=4)

    # Right: Early Mortality Verbal Autopsy Analytics
    right_box = FancyBboxPatch((0.51, 0.06), 0.47, 0.81, boxstyle="round,pad=0.015,rounding_size=0.015",
                               facecolor='#f8fafc', edgecolor='#dc2626', linewidth=2.0, zorder=2)
    ax.add_patch(right_box)
    ax.text(0.745, 0.835, "60-DAY MORTALITY VERBAL AUTOPSIES", ha='center', fontsize=11, fontweight='bold', color='#991b1b', zorder=3)
    ax.text(0.745, 0.810, "Systemic Root-Cause Identification & Clinical Corrective Action", ha='center', fontsize=7.5, color='#64748b', zorder=3)

    audit_causes = [
        ("SEVERE MALNUTRITION COLLAPSE (62% OF DEATHS)", "Primary Factor: Acute undernutrition (BMI < 14) leading to multi-organ failure.\nCorrective Action: Mandatory in-hospital nutritional stabilization protocol.", '#fef2f2', '#fca5a5'),
        ("DELAYED SYMPTOM PRESENTATION (48% OF DEATHS)", "Primary Factor: > 45 days of chronic cough prior to initial clinical visit.\nCorrective Action: Intensifies ASHA weekly community screening in tea bastis.", '#fef2f2', '#fca5a5'),
        ("DIAGNOSTIC CASCADE LAG (35% OF DEATHS)", "Primary Factor: > 14 days between initial visit and molecular NAAT confirmation.\nCorrective Action: Enforces strict 48-hour cold-chain courier transport SLA.", '#fef2f2', '#fca5a5'),
        ("UNDETECTED DRUG RESISTANCE (18% OF DEATHS)", "Primary Factor: Empiric first-line failure due to undetected initial Rif-R.\nCorrective Action: Universal upfront drug susceptibility testing (UDST) enforced.", '#fef2f2', '#fca5a5')
    ]
    for idx, (title, sub, bg, border) in enumerate(audit_causes):
        y = 0.65 - idx * 0.17
        a_box = FancyBboxPatch((0.53, y - 0.03), 0.43, 0.13, boxstyle="round,pad=0.01,rounding_size=0.01",
                               facecolor=bg, edgecolor=border, linewidth=1.2, zorder=3)
        ax.add_patch(a_box)
        ax.text(0.55, y + 0.065, title, fontsize=8, fontweight='bold', color='#991b1b', zorder=4)
        ax.text(0.55, y + 0.010, sub, fontsize=7.2, color='#450a0a', linespacing=1.2, zorder=4)

    save_dual(fig, "diagram_7_enterprise_system_architecture")

if __name__ == '__main__':
    print("Generating High-Impact 16:9 Widescreen Technological Framework Infographics for NESFIC-D-30...")
    create_widescreen_diagram_1()
    create_widescreen_diagram_2()
    create_widescreen_diagram_3()
    create_widescreen_diagram_4()
    create_widescreen_diagram_5()
    create_widescreen_diagram_6()
    create_widescreen_diagram_7()
    print("Completed generation of all 7 widescreen technological framework infographics!")
