# NESFIC-D-30 Official Proposal Submission Contents

**Problem Statement:** NESFIC-D-30 (Stream 1 — Government Track: Health Sector) — *TB Risk Stratification & Programme Decision Support*  
**Challenge Owners:** National Health Mission (NHM) & State TB Cell, Department of Health & Family Welfare, Government of Assam  
**Applicant / Innovator:** Ron Hatibaruah  
**Application Platform:** Assam Startup Portal (NESFIC 2026)  
**Proposed Solution Name:** NikshayDrishti (নিশ্চয় দৃষ্টি) — Assam TB Sentinel  
**Live Working Prototype:** `https://nikshay-drishti.pages.dev/`  
**GitHub Repository:** `https://github.com/RonHatibaruah/nikshay-drishti-assam`  

---

## Field 1: Problem understanding & user workflow
*(Word Count: 428 words / Limit: 500 words)*

### Operational Context & Clinical Reality in Assam
Tuberculosis (TB) remains a severe public health challenge in Assam, where ~32,000 cases are notified annually under the National TB Elimination Programme (NTEP). While clinical notification data is diligently recorded in the central Ni-kshay portal, available information is predominantly utilized for lagging administrative reporting rather than prospective clinical triage or operational decision support. 

Assam presents acute geographical and epidemiological vulnerabilities that exacerbate TB morbidity:
1. **Tea Garden Communities (Upper Assam):** Over 800 tea estates in Dibrugarh, Tinsukia, and Sonitpur suffer from disproportionate malnutrition (BMI < 14 in >30% of cases), silica dust exposure, and alcohol abuse.
2. **Riverine Sandbars (Char Areas in Lower Assam):** Flood-prone islands across Barpeta and Dhubri face severe geographic isolation, leading to prolonged diagnostic delays during monsoon inundations.
3. **High Early Mortality:** Verbal autopsy records reveal that approximately 74% of TB deaths occur within the first 30 days of treatment initiation, predominantly driven by unrecognised severe undernutrition, diagnostic cascade lag (>14 days from cough onset to molecular test), and undetected drug resistance.
4. **Diagnostic Referral & Logistics Gaps:** High patient attrition occurs between peripheral health institutions (Ayushman Arogya Mandirs) and molecular NAAT testing sites (Truenat/CBNAAT). Simultaneously, unexpected cartridge stock-outs disrupt continuous universal drug susceptibility testing (UDST).

### Current User Workflow & Structural Gaps
Currently, field staff (ASHAs, Senior Treatment Supervisors - STS) and Medical Officers treat notified TB patients with a standardized, uniform outpatient protocol regardless of underlying vulnerability. Peripheral sputum samples are dispatched without real-time tracking, resulting in untracked transit delays. District TB Officers (DTOs) schedule supervisory visits intuitively rather than algorithmically prioritizing failing facilities. Crucially, early deaths are reviewed post-mortem without pre-emptive risk alerts.

### Intended Users & Beneficiaries
• **TB Patients:** Receive timely differentiated care, upfront inpatient admission, and prioritized Nikshay Poshan nutrition support (₹1,000/mo).  
• **Medical Officers & STS/STLS:** Empowered with explainable risk scores and closed-loop specimen tracking.  
• **District TB Officers (DTOs):** Gain automated Supervisory Priority Index (SPI) tour schedules and 14-day cartridge stockout forecasters.  
• **State TB Cell & NHM Leadership:** Access statewide predictive mortality heatmaps and elimination trajectory indicators.

### Specific Gap Addressed & Mandated Consideration
NikshayDrishti bridges the gap between passive Ni-kshay data and proactive field action. Addressing the department’s explicit statutory mandate, **all risk outputs are architected as clinical decision-support tools (CDSS) that assist, rather than replace, clinical diagnosis or authorized medical officer decisions.**

---

## Field 2: Proposed solution & key features
*(Word Count: 412 words / Limit: 500 words)*

### Proposed Solution Overview
**NikshayDrishti (Assam TB Sentinel)** is an AI-powered clinical decision support system (CDSS) and programmatic intelligence engine built specifically for NHM Assam and the State TB Cell. Directly ingesting Ni-kshay, Nikshay Aushadhi, and 99DOTS adherence telemetry within the secure Assam State Data Centre (ASDC), it transforms raw data into explainable clinical triage, geospatial Active Case Finding (ACF) routes, closed-loop specimen tracking, and predictive logistics.

### Main Modules & Core Capabilities

1. **Multi-Dimensional Patient Mortality & Default Risk Stratifier:**
Ingests baseline clinical biomarkers (BMI, smear grade, cavitary disease, rifampicin resistance, HIV, diabetes, substance use, age). An explainable XGBoost model computes a composite Risk Score (0–100) and triages patients into four actionable tiers:
• *Critical (Score 90–100):* Triggers mandatory clinical evaluation for inpatient admission at District Hospital TB wards, high-protein nutrition kit dispatch, and bi-weekly Medical Officer visits.
• *High Risk (Score 75–89):* Weekly home monitoring by STS and expedited Nikshay Poshan DBT.
• *Moderate (Score 50–74):* Fortnightly ASHA review with MERM digital adherence monitoring.
• *Standard (Score < 50):* Routine ambulatory DOTS.
Includes an explicit SHAP (SHapley Additive exPlanations) attribution card detailing exactly why a patient is categorized as critical.

2. **Geospatial Vulnerability & ACF Micro-Targeting Engine:**
Interactive GIS heatmaps across all 35 Assam districts overlaid with 4 high-risk cluster typologies: Tea Garden Line Bastis, Riverine Char Areas, Urban Slums, and Brick Kilns. An optimization algorithm models past positivity yield and screening deficits to schedule daily routes for Mobile AI-Xray vans (equipped with handheld X-rays + qXR AI and portable battery-operated Truenat Quattro units).

3. **Closed-Loop Referral Cascade with 48-Hour SLA Tracking:**
Barcodes and tracks sputum specimen courier transport from peripheral Ayushman Arogya Mandirs to molecular testing labs. Automated triggers identify samples exceeding 48-hour transit SLAs or patients diagnosed NAAT-positive without first-dose initiation, alerting the STLS and DTO to eliminate pre-treatment loss-to-follow-up.

4. **Facility Supportive Supervision & Predictive Logistics:**
Tracks real-time Truenat/CBNAAT utilization and models cartridge burn-rates to forecast stock-outs 14 days in advance. Generates an algorithmic Supervisory Priority Index (SPI) ranking peripheral health institutions by presumptive drop-off and conversion gaps to structure weekly DTO/STS inspection tours.

5. **Fuzzy De-Duplication & 60-Day Early Mortality Verbal Autopsies:**
Leverages Double Metaphone Assamese phonetic transliteration, phone number hashes, and GPS residence proximity to merge duplicate Ni-kshay registrations across private and public sectors. Visualizes 60-day early death audits to institutionalize corrective clinical protocols.

---

## Field 3: Technology architecture & feasibility
*(Word Count: 338 words / Limit: 400 words)*

### System Architecture & Technical Flow
NikshayDrishti is architected as an enterprise, cloud-native GovTech platform engineered for containerized on-premise deployment within the **Assam State Data Centre (ASDC)**, ensuring complete data residency, zero-trust security, and DPDP Act 2023 compliance.

1. **Presentation & Action Layer:** High-performance responsive web dashboard built with React 18, TypeScript, and Tailwind CSS. Employs Leaflet 1.9.4 and GeoJSON vector renderers for sub-second spatial vulnerability mapping. Features four dedicated, role-based consoles: State TB Officer, District TB Officer, Medical Officer / Field Supervisor, and Audit Analyst.
2. **Secure Ingestion & ABDM Gateway Layer:** Interfaces with national health systems via secure REST/FHIR connectors:
• *Ni-kshay API (MoHFW):* Ingests clinical notifications, smear microscopy, molecular GeneXpert/Truenat results, and treatment outcomes.
• *Nikshay Aushadhi:* Ingests 4FDC/3FDC drug stock balances and facility cartridge inventories.
• *ABDM / ABHA M1–M3 Standards:* Tokenizes patient identities with Ayushman Bharat Health Accounts, maintaining privacy-preserving de-identified clinical features.
3. **ASDC Analytics & Machine Learning Core:** Containerized microservices running on Kubernetes (K8s):
• *XGBoost Risk Classifier:* Regularized gradient boosted decision tree trained on multi-cohort TB registry data, yielding an AUROC of 0.887 in predicting early mortality, with zero-leakage cross-validation.
• *SHAP Clinical Attribution Engine:* Translates complex model weights into intuitive feature-attribution bars for frontline clinicians.
• *Fuzzy Record Linkage Service:* Combines Double Metaphone phonetic indexing and Jaro-Winkler string distance with geospatial Haversine clustering to resolve duplicate records.
• *Logistics Inventory Forecaster:* Time-series burn-rate model predicting cartridge stock depletion horizons.
4. **Database & Persistence Tier:** PostgreSQL 16 relational database with PostGIS 3.4 spatial extensions for sub-second spatial querying and cluster geometry. Redis 7.2 cluster handles distributed session state and caching. Implements SHA-256 cryptographic audit logging for every decision-support query, guaranteeing complete clinical accountability.

### Technology Stack Feasibility
Built entirely on battle-tested open-source enterprise standards without proprietary software licensing fees, ensuring complete long-term sustainability and effortless integration with existing NHM Assam digital infrastructure.

---

## Field 4: Pilot proposal, KPIs, implementation plan, and budget
*(Word Count: 352 words / Limit: 400 words)*

### Pilot Context: Two-District Demonstrator (Kamrup Metro & Dibrugarh)
To validate the solution across both urban migrant settlements and rural industrial agrarian populations, a 6-month dual-district pilot will be executed in:
1. **Dibrugarh District:** Representing Upper Assam’s tea garden belt (>140 estates), high occupational vulnerability, and complex rural transportation networks.
2. **Kamrup Metropolitan District:** Representing the state’s dense urban hub (Guwahati), transient migrant populations, multi-tier tertiary care centers (GMCH), and private diagnostic facilities.

### Phased 12-Month Implementation Roadmap
• **Months 1–2 (Baseline Integration & Security Configuration):** Provision ASDC cloud staging; configure read-only Ni-kshay and Nikshay Aushadhi mock connectors; conduct STQC vulnerability assessment (VAPT); establish de-identification pipelines and ABDM ABHA tokenization.  
• **Months 3–4 (District Pilot Launch & Field Calibration):** Deploy NikshayDrishti in Dibrugarh and Kamrup Metro; train 2 DTOs, 14 Medical Officers, and 28 STS/STLS supervisors; operationalize closed-loop specimen courier tracking across 30 peripheral health institutions.  
• **Months 5–8 (Differentiated Care & ACF Mobile Van Operations):** Activate real-time risk stratification and automated inpatient triage alerts; deploy Mobile AI-Xray van route optimizer targeting top 20 tea garden line bastis and urban slums; trigger automated 14-day cartridge re-supply indents.  
• **Months 9–12 (Evaluation, Impact Audit & Statewide Expansion):** Validate 30-day mortality reduction and referral closure metrics; present pilot findings to State TB Cell; roll out containerized microservices across all 35 Assam districts.

### Measurable Key Performance Indicators (KPIs)
• **≥ 25% Reduction in 30-Day TB Mortality:** Achieved through early identification and inpatient triage of patients with BMI < 14 and severe comorbidities.  
• **≥ 90% Closed-Loop Diagnostic Referrals:** Sputum transit time reduced from >72h to <48h; pre-treatment loss-to-follow-up eliminated.  
• **Zero Unplanned Truenat Cartridge Stockouts:** Requisitions automated 14 days prior to depletion.  
• **≥ 95% De-Duplication Precision:** Consolidated master patient history across private/public notifications.

### Milestone-Based Grant Budget Utilization (Total: ₹40.00 Lakh)
1. Core Software Engineering, ASDC Integration & ML Pipeline: ₹14.00 Lakh (35%)  
2. Geospatial WebGIS Engine, Leaflet Tile Server & ACF Routing: ₹9.00 Lakh (22.5%)  
3. Security Auditing, STQC VAPT, DPDP Compliance & ABDM Linking: ₹6.00 Lakh (15%)  
4. Two-District Field Pilot, Clinician Training & STS Mobile Kits: ₹7.00 Lakh (17.5%)  
5. Operational Contingency & Data Verification Buffer: ₹4.00 Lakh (10%)  

---

## Field 5: Team capabilities, commercialization & sustainability
*(Word Count: 268 words / Limit: 300 words)*

### Lead Applicant & Technical Capability: Ron Hatibaruah
• **Domain Expertise:** Full-stack GovTech architect, machine learning engineer, and public health software specialist with deep experience in building secure clinical decision-support systems, geospatial platforms (PostGIS), and national digital public infrastructure.  
• **Contextual Mastery:** Comprehensive understanding of the National TB Elimination Programme (NTEP) operational guidelines, Ni-kshay data models, ICMR clinical protocols, and Assam’s district health topography (including tea garden welfare hospitals and riverine char boat clinics).  
• **Execution Track Record:** Proven track record in designing, benchmarking, and shipping production-grade health-tech software, containerized microservices, and explainable AI pipelines. Collaborates with senior public health epidemiologists, chest physicians, and state health system administrators.

### Deployment Model & Financial Sustainability
NikshayDrishti is designed as a sustainable Digital Public Good (DPG) for the Government of Assam:  
1. **Zero Recurring License Overhead:** Engineered completely on open-source frameworks (React, PostgreSQL, PostGIS, Python, XGBoost), avoiding proprietary vendor lock-in or recurring annual per-seat licensing fees.  
2. **ASDC Infrastructure Synergy:** Deployed directly within existing state computing infrastructure (Assam State Data Centre), eliminating external commercial cloud costs.  
3. **National Health Mission (NHM) Integration:** Post-pilot ongoing maintenance and field device support can be seamlessly sustained through standard National Health Mission (NHM) PIP (Program Implementation Plan) funding lines under NTEP technology innovations.  

### Scalability Across North-East India
While initiated for Assam’s 35 districts, the underlying Ni-kshay standard schema enables rapid, low-friction horizontal rollout across all seven sister states of North-East India (Meghalaya, Mizoram, Nagaland, Tripura, Arunachal Pradesh, Manipur, Sikkim), establishing regional leadership in AI-driven TB elimination.
