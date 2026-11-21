// Types for JalDrishti (Assam Flood & Space Digital Twin - NESFIC-D-18)

export type DataProvenanceTier = 'OBSERVED' | 'FORECAST' | 'SIMULATED';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'NORMAL';

export type RiverStationStatus = 'ABOVE_DANGER_LEVEL' | 'WARNING_LEVEL' | 'STEADY' | 'RECEDING';

export interface RiverStation {
  id: string;
  name: string;
  river: string;
  district: string;
  latitude: number;
  longitude: number;
  dangerLevelM: number;
  warningLevelM: number;
  currentLevelM: number;
  trend: 'RISING' | 'STEADY' | 'RECEDING';
  status: RiverStationStatus;
  forecast24hM: number;
  forecast48hM: number;
  lastUpdated: string;
  source: string;
  provenance: DataProvenanceTier;
}

export interface EmbankmentSegment {
  id: string;
  code: string;
  name: string;
  river: string;
  district: string;
  lengthKm: number;
  vintageYears: number;
  designFreeboardM: number;
  currentWaterHeadM: number;
  soilSaturationPct: number;
  historicalBreaches: number;
  bhiScore: number; // Breach Hazard Index (0-100)
  status: AlertSeverity;
  coordinates: [number, number][];
  lastInspected: string;
  responsibleDivision: string;
  provenance: DataProvenanceTier;
}

export interface InundationPolygon {
  id: string;
  name: string;
  district: string;
  revenueCircle: string;
  areaSqKm: number;
  avgDepthM: number;
  maxDepthM: number;
  populationAtRisk: number;
  provenance: DataProvenanceTier;
  confidenceIntervalPct: number; // e.g. 95%
  sarSensor?: string; // e.g. "Sentinel-1 C-SAR"
  modelSource?: string; // e.g. "2D Shallow Water PINN"
  coordinates: [number, number][];
}

export interface WhatIfScenarioInput {
  scenarioName: string;
  upstreamRainfallMm: number; // 0 to 300 mm
  damReleaseCumecs: number; // 0 to 3000 cumecs (e.g. Kurichhu / Kopili)
  breachLocationId?: string;
  leadTimeHours: number; // 12, 24, 48, 72h
}

export interface WhatIfSimulationResult {
  simulatedAt: string;
  runtimeSeconds: number;
  additionalFloodedAreaSqKm: number;
  totalPopulationAtRisk: number;
  wavefrontArrivalTimeHours: number;
  submergedHighwaysKm: number;
  threatenedVillages: string[];
  safeEvacuationCorridors: string[];
  confidenceScore: number;
  provenance: 'SIMULATED';
}

export interface CAPAlert {
  id: string;
  identifier: string;
  sender: string;
  sentAt: string;
  status: 'Actual' | 'Exercise' | 'Draft';
  msgType: 'Alert' | 'Update' | 'Cancel';
  scope: 'Public' | 'Restricted';
  category: 'Met' | 'Geo' | 'Safety';
  urgency: 'Immediate' | 'Expected' | 'Future';
  severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor';
  certainty: 'Observed' | 'Likely' | 'Possible';
  headlineAssamese: string;
  headlineEnglish: string;
  descriptionAssamese: string;
  descriptionEnglish: string;
  instructionAssamese: string;
  instructionEnglish: string;
  targetDistricts: string[];
  targetCircles: string[];
  dispatchedChannels: ('CELL_BROADCAST' | 'SMS' | 'WHATSAPP' | 'IVRS_SIREN')[];
  provenance: DataProvenanceTier;
}

export interface DistrictFloodSummary {
  district: string;
  totalPopulation: number;
  submergedAreaSqKm: number;
  affectedPopulation: number;
  activeReliefCamps: number;
  inmatesCount: number;
  criticalEmbankments: number;
  floodWave: 'Wave 1' | 'Wave 2' | 'Wave 3' | 'Wave 4';
  status: AlertSeverity;
}
