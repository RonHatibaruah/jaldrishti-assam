// Cloudflare Pages Serverless Function
// Endpoint: /api/health

export async function onRequestGet() {
  const payload = {
    status: "healthy",
    platform: "JalDrishti (Assam Flood & Space Digital Twin Sentinel)",
    assameseTitle: "জলদৃষ্টি",
    problemStatement: "NESFIC-D-18 (Stream 1 — Government Track: Department of Science & Technology)",
    challengeTitle: "Digital Twin for Flood Management, Simulation and Early Warning Using Space Technology",
    challengeOwners: "Department of Science & Technology ● Government of Assam – ASSAC & ASDMA",
    innovator: "Chandan Kumar Sonowal",
    contactEmail: "chandankumar.sonowal@gmail.com",
    organization: "Coretouch Technologies Pvt Ltd",
    edgeRuntime: "Cloudflare Pages Functions",
    statutoryProvenanceMandate: {
      rule: "ASSAC Mandatory Segregation of Observed, Forecast, and Simulated data",
      observedSources: "Sentinel-1 C-SAR (10m GRD dual-pol) + CWC 35 River Gauges + IMD AWS",
      forecastSources: "IMD WRF 3km gridded precipitation + CWC 24h-48h river stage models",
      simulatedSources: "2D Saint-Venant Shallow Water PINN Surrogate (<39s latency)"
    },
    bhiEngine: "Embankment Breach Hazard Index (4,400 km network monitored)",
    capEarlyWarning: "OASIS CAP v1.2 / NDMA Sachet Bilingual (Assamese & English)",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
