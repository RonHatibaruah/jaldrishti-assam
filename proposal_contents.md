# NESFIC-D-18 Official Proposal Submission Contents

**Problem Statement:** NESFIC-D-18 (Stream 1 — Government Track: Department of Science & Technology) — *Digital Twin for Flood Management, Simulation and Early Warning Using Space Technology*  
**Challenge Owners:** Department of Science & Technology ● Government of Assam – ASSAC (Assam State Space Applications Centre), in collaboration with Assam State Disaster Management Authority (ASDMA)  
**Applicant / Innovator:** Chandan Kumar Sonowal  
**Application Platform:** Assam Startup Portal (NESFIC 2026)  
**Proposed Solution Name:** JalDrishti — Assam Flood & Space Digital Twin Sentinel  
**Live Working Prototype:** `https://jaldrishti-assam.pages.dev/` (Demo State Command: `admin@assac.assam.gov.in` / `dispur2026`)  
**GitHub Repository:** `https://github.com/RonHatibaruah/jaldrishti-assam`  
**Geographic Coverage (SEO & GEO):** Assam State (`IN-AS`, 26.1445° N, 91.7362° E, Dispur/Guwahati)  

---

## Field 1: Problem understanding & user workflow
*(Word Count: 442 words / Limit: 500 words)*

### Operational Context & Hydrological Vulnerability in Assam
Assam endures one of the most severe recurring flood and river erosion crises in South Asia. Over 40% of the state’s geographical landmass (~3.15 million hectares) is classified as flood-prone. Every monsoon season, 3–4 waves of catastrophic flooding across the Brahmaputra and Barak river basins impact over 30 districts, displacing 3 to 5 million citizens, submerging millions of hectares of cropland, and causing severe loss to human life, livestock, and critical infrastructure. 

Assam’s unique hydro-geomorphic environment presents acute operational complexities:
1. **Dynamic Braided River Morphometry:** The Brahmaputra carries astronomical sediment loads (~735 million tonnes annually), causing hyper-dynamic channel braiding, rapid sandbar (char) migration, and unpredictable riverbank scouring.
2. **Cascading Transboundary & Upper Basin Inundation:** Massive precipitation in upstream catchment areas (Arunachal Pradesh, Bhutan, Meghalaya) and sudden hydroelectric reservoir releases (e.g., Kurichhu, Kopili, Ranganadi) cause rapid, localized flash surges across downstream foothill districts.
3. **Pervasive Embankment Breaches:** Over 4,400 km of aging earthen embankments protect Assam’s riverbanks. Under prolonged hydrodynamic pressure, piping and overtopping trigger catastrophic sudden breaches, inundating interior villages within minutes without warning.

### Current Workflow & Systemic Bottlenecks
Currently, disaster management agencies (ASDMA, WRD, CWC, IMD, and NESAC FLEWS) collect critical hydrological and meteorological data across fragmented, siloed platforms. River gauge bulletins, rain gauge telemetry, satellite inundation shapefiles, and field wireless reports arrive as disjointed inputs. 
Crucially, **the state lacks an integrated, continuously updated spatial digital twin that couples space remote sensing with physics-based hydrodynamic simulations in real time.** Consequently:
• District Emergency Operation Centres (DEOCs) and Circle Officers rely on static flood hazard atlases that cannot predict where floodwaters will propagate over the next 12–72 hours following an embankment breach or upstream cloudburst.  
• Field responders (NDRF, SDRF, Quick Response Teams) are mobilized reactively post-inundation rather than pre-emptively deployed to vulnerable corridors.  
• Evacuation alerts to riverine and char communities are frequently delayed, generalized at the district level, and lack localized inundation depth and arrival-time specificity.

### Intended Users & Beneficiaries
• **State Emergency Operations Centre (ASDMA / SEOC) & ASSAC:** Gain a statewide Common Operational Picture (COP) with real-time fusion of satellite SAR and hydrodynamic simulation.  
• **District Administrations (DDMA / DEOCs) & Circle Officers:** Access micro-level inundation wavefront projections and pre-computed evacuation routing.  
• **Water Resources Department (WRD) Engineers:** Receive predictive embankment breach vulnerability alerts based on hydraulic head differential and soil saturation.  
• **Riverine, Tea Garden & Char Communities:** Receive geo-targeted, multilingual early warning alerts (CAP/SMS/WhatsApp/IVRS) with actionable lead times of 12 to 36 hours.

---

## Field 2: Proposed solution & key features
*(Word Count: 448 words / Limit: 500 words)*

### Proposed Solution Overview
**JalDrishti (জলদৃষ্টি — Assam Flood Sentinel)** is an enterprise, space-enabled 4D Digital Twin and hydro-informatics decision-support platform engineered specifically for ASSAC, ASDMA, and the Government of Assam. Operating within the secure Assam State Data Centre (ASDC), JalDrishti continuously fuses satellite remote sensing, IoT river and rain gauge telemetry, and numerical weather models with high-resolution 2D hydrodynamic simulation to deliver a unified Common Operational Picture (COP), predictive scenario simulation, and multi-channel early warning.

### Main Modules & Core Capabilities

1. **Space-Enabled Multi-Sensor Ingestion & All-Weather SAR Fusion:**
Directly interfaces with ISRO and open space data hubs (Copernicus Sentinel-1/2, NISAR, RISAT-1A, CartoDEM, GPM precipitation). Incorporates automated cloud-penetrating Synthetic Aperture Radar (SAR) backscatter thresholding (VV/VH polarization) and Otsu binarization to extract live, all-weather water extents across Assam’s cloud-covered monsoon landscape within 45 minutes of satellite pass.

2. **Hydrodynamic Simulation & AI Surrogate Physics Engine:**
Integrates 2D Saint-Venant shallow water equations accelerated by physics-informed AI surrogate neural networks. Models river flood routing, floodplain inundation depths, and velocity vectors. Operates interactive "What-If" simulation sandboxes enabling disaster managers to test complex contingencies—such as a 250 mm 24-hour rainfall event coinciding with an upstream dam release and a levee breach at Barpeta or Majuli—delivering sub-minute inundation wavefront projections.

3. **Predictive Embankment Health & Breach Vulnerability Sentinel:**
Monitors over 4,400 km of digitized embankment geometries. Computes an automated Breach Hazard Index (BHI) combining real-time hydraulic head differential, soil moisture saturation (SMAP/Sentinel-1), embankment vintage, and historical breach loci, alerting WRD patrol teams before structural failure occurs.

4. **Mandated Three-Tier Data Provenance & Uncertainty Cockpit:**
Addressing ASSAC's explicit statutory mandate, JalDrishti rigorously differentiates every spatial layer with prominent visual markers and metadata tags:
• **Observed:** Real-time satellite SAR detections, CWC gauge water levels, and IMD AWS telemetry.
• **Forecast:** Numerical weather prediction precipitation (IMD/ECMWF) and CWC 24–72 hour river stage forecasts.
• **Simulated:** Hydrodynamic model propagation outputs and what-if breach scenario inundation depths.
Every layer incorporates explicit 95% confidence intervals and data-source attribution, ensuring uncompromised operational transparency for executive disaster decisions.

5. **Common Operational Picture (COP) & Infrastructure Exposure Analyzer:**
Overlays dynamic inundation footprints against digitized state critical infrastructure (highways, railway corridors, power substations, hospitals, drinking water stations, schools). Automatically computes population-at-risk counts and identifies submerged arterial roads to recommend optimal rescue logistics corridors.

6. **CAP-Compliant Hyper-Local Early Warning Engine:**
Integrated with the National Disaster Management Authority (NDMA) Sachet Common Alerting Protocol (CAP) gateway. Dispatches targeted multi-channel sirens, automated IVRS, SMS, and WhatsApp alerts in Assamese, Bengali, Bodo, and English to vulnerable revenue circles and Gaonburhas (village heads) with 12–36 hours of actionable lead time.

---

## Field 3: Technology architecture & feasibility
*(Word Count: 285 words / Limit: 400 words)*

### System Architecture & Technical Flow
JalDrishti is architected as an enterprise, cloud-native, open-standard platform engineered for containerized on-premise deployment within the **Assam State Data Centre (ASDC)**, ensuring zero-trust governance, high data residency compliance, and seamless ASDMA/ASSAC integration.

*(Refer to Technical Framework Infographic: Diagram 2 — JalDrishti 4D Digital Twin End-to-End System Architecture & ASDC Blueprint)*

1. **Presentation & Action Layer:** High-performance responsive GIS cockpit built with React 18, TypeScript, and Tailwind CSS. Employs MapLibre GL and Leaflet 1.9.4 with custom vector/raster tiles for sub-second rendering of statewide multi-layer spatial datasets. Features dedicated views for SEOC State Commanders, DEOC District Collectors, and WRD Embankment Engineers.
2. **Ingestion & Processing Gateway:** Microservices utilizing GDAL, Rasterio, and STAC (SpatioTemporal Asset Catalog) API to ingest, clip, orthorectify, and reproject SAR radar imagery, CartoDEM digital elevation models, and IMD/CWC telemetry.
3. **Hydrodynamic Simulation Core:** Hybrid computational engine combining numerical 2D finite-volume shallow water models with lightweight physics-informed neural network (PINN) surrogates, reducing 48-hour basin inundation calculation times from hours to under 60 seconds on ASDC GPUs.
4. **Data Persistence Tier:** PostgreSQL 16 with PostGIS 3.4 spatial database for sub-second spatial queries, embankment topological indexing, and historical flood extents. Redis 7.2 cluster manages real-time IoT sensor telemetry and active session state.
5. **Security & Interoperability:** Zero-trust role-based access control (RBAC), end-to-end TLS 1.3 encryption, immutable SHA-256 decision audit logging, and open OGC web service compliance (WMS/WFS/GeoJSON) for effortless integration with existing ASDMA portals.

---

## Field 4: Pilot proposal, KPIs, implementation plan, and budget
*(Word Count: 358 words / Limit: 400 words)*

### Pilot Context: Dual-Basin Demonstrator (Barpeta & Majuli Districts)
To demonstrate effectiveness across both complex riverine delta floodplains and vulnerable braided island ecosystems, a 6-month dual-district pilot will be deployed in:
1. **Barpeta District (Lower Assam):** High population density, chronic embankment breach history (Manas and Beki rivers), riverine char settlements, and frequent severe flash surge inundations.
2. **Majuli District (Upper Assam):** The world’s largest inhabited river island, suffering extreme riverbank scouring, dynamic channel shifting, and complete isolation during monsoon peaks.

### Phased 12-Month Implementation Roadmap
• **Months 1–2 (Data Pipelines & Spatial Calibration):** Ingest ASSAC GIS layers, 10m CartoDEM, digitized WRD embankment lines, and historical FLEWS flood extents. Configure automated Sentinel-1 SAR ingestion in ASDC.  
• **Months 3–4 (Hydrodynamic Calibration & Pilot Launch):** Calibrate 2D shallow water models against historical 2022–2024 flood events in Barpeta and Majuli. Deploy JalDrishti cockpit in ASDMA SEOC and Barpeta/Majuli DEOCs; train 20 DDMA and WRD officers.  
• **Months 5–8 (Monsoon Operational Validation & CAP Sirens):** Operate JalDrishti during the active monsoon season. Validate real-time SAR flood extents, run live "what-if" breach simulations, and operationalize automated CAP bilingual SMS alerts to 50 vulnerable revenue villages.  
• **Months 9–12 (Evaluation, Model Tuning & Statewide Expansion):** Audit prediction accuracy, lead-time improvements, and emergency response speed. Present validation report to ASSAC and ASDMA; deploy containerized platform across all 35 districts of Assam.

### Measurable Key Performance Indicators (KPIs)
• **≥ 88% Spatial Accuracy in Flood Inundation Prediction:** Validated against ground truth CWC water levels and post-event Sentinel-1 SAR imagery.  
• **12 to 36 Hours Actionable Early Warning Lead Time:** Extending lead time for evacuation and asset protection compared to traditional 3-hour reactive bulletins.  
• **Sub-60 Second Simulation Runtime:** Near-instantaneous computation of 48-hour inundation wavefronts for emergency scenario planning.  
• **100% Provenance Compliance:** Complete visual and algorithmic segregation of Observed, Forecast, and Simulated data across all interfaces.

### Milestone-Based Grant Budget Utilization (Total: Rs. 40.00 Lakh)
1. Software Stack Development Team Cost (Core Platform, Hydrodynamic PINN & AI Modelers): Rs. 20.00 Lakh (50.0%)  
2. 4D GIS Web Platform, Vector Tile Engine & ASDMA COP Dashboard: Rs. 7.00 Lakh (17.5%)  
3. Dual-Basin Field Deployment, Ground-Truthing & Officer Capacity Building (Barpeta & Majuli): Rs. 6.00 Lakh (15.0%)  
4. Space SAR Ingestion (STAC API), IoT Telemetry & CAP Alert Gateway: Rs. 4.00 Lakh (10.0%)  
5. Security Audit (STQC VAPT), ASDC Data Compliance & Technical Contingency: Rs. 3.00 Lakh (7.5%)  

---

## Field 5: Team capabilities, commercialization & sustainability
*(Word Count: 282 words / Limit: 300 words)*

*(Refer to Technical Framework Infographic: Diagram 12 — Socio-Economic Impact Matrix & Grassroots Disaster Resilience Framework)*

### Lead Applicant & Technical Capability: Chandan Kumar Sonowal
• **Domain Expertise:** GovTech software architect, geospatial systems engineer, and machine learning practitioner with specialized expertise in designing mission-critical decision support systems, GIS applications (PostGIS, GDAL, MapLibre), and public emergency infrastructure.  
• **Contextual Mastery:** Deep operational familiarity with Assam’s river morphology, ASDMA’s disaster management workflows, NESAC FLEWS historical methodologies, Central Water Commission (CWC) telemetry networks, and the socio-geographic realities of riverine char and tea garden communities.  
• **Execution Track Record:** Proven competence in architecting production-grade containerized web platforms, high-throughput geospatial data pipelines, and explainable AI systems. Collaborates closely with remote sensing hydrologists, GIS analysts, and disaster management domain specialists.

### Deployment Model & Financial Sustainability
JalDrishti is designed as a sustainable Digital Public Good (DPG) for the Government of Assam:  
1. **Zero Proprietary Licensing Lock-in:** Built entirely on open-source frameworks (React, Python, PostGIS, MapLibre, GDAL, PyTorch), eliminating costly per-seat commercial licenses and vendor dependency.  
2. **ASDC Infrastructure Synergy:** Deployed directly on state computing infrastructure in the Assam State Data Centre, eliminating commercial cloud subscription overheads.  
3. **State Disaster Management Integration:** Post-pilot operational maintenance and sensor expansion can be institutionalized under ongoing ASDMA State Disaster Mitigation Funds (SDMF) and annual Assam State Budget disaster management allocations.

### Scalability Across the North-Eastern Region
While anchored in Assam’s Brahmaputra and Barak basins, the underlying hydro-spatial data schema seamlessly scales across neighboring North-Eastern states (Meghalaya, Arunachal Pradesh, Tripura, Manipur, Nagaland, and Mizoram), positioning Assam as the regional pioneer in space-enabled disaster resilience under the Ashtalakshmi framework.
