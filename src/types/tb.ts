export type PatientRiskTier = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'STANDARD';

export interface TopRiskDriver {
  factor: string;
  impact: 'High Negative' | 'Moderate Negative' | 'Protective';
  value: string;
  shapValue: number;
}

export interface DifferentiatedCarePlan {
  inpatientTriageRequired: boolean;
  nikshayPoshanPriority: boolean;
  foodBasketDelivered: boolean;
  supervisionFrequency: 'Bi-weekly MO' | 'Weekly STS' | 'Fortnightly ASHA' | 'Monthly Routine';
  counselingScheduled: boolean;
  ecgChestXrayFollowupDate: string;
}

export interface Patient {
  id: string; // Nikshay ID
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  district: string;
  tbUnit: string;
  phi: string; // Peripheral Health Institution
  type: 'Pulmonary' | 'Extrapulmonary';
  site: string;
  category: 'New' | 'Recurrent' | 'Treatment After Default' | 'Failure';
  smearGrade: 'Negative' | 'Scanty' | '1+' | '2+' | '3+' | 'NA';
  cbnaatResult: 'MTB Not Detected' | 'MTB Detected, Rif Susceptible' | 'MTB Detected, Rif Indeterminate' | 'MTB Detected, Rif Resistant (MDR)';
  cavitaryDisease: boolean;
  bmi: number;
  weight: number; // kg
  height: number; // cm
  hivStatus: 'Positive' | 'Negative' | 'Unknown';
  diabetesStatus: 'Diabetic (HbA1c > 8.0)' | 'Diabetic (Controlled)' | 'Non-Diabetic';
  substanceUse: string[];
  riskTier: PatientRiskTier;
  riskScore: number; // 0 - 100
  mortalityRiskProb: number; // 0.00 - 1.00
  unfavourableOutcomeProb: number; // 0.00 - 1.00
  topRiskDrivers: TopRiskDriver[];
  differentiatedCarePlan: DifferentiatedCarePlan;
  adherenceRate: number; // 0 - 100%
  treatmentStartDate: string;
  notificationDate: string;
  status: 'On Treatment' | 'Transferred In' | 'Adherence Concern' | 'Cured' | 'Defaulted' | 'Deceased';
  abhaId: string;
  mobile: string;
}

export interface VulnerablePocket {
  id: string;
  name: string;
  type: 'Tea Garden Line Basti' | 'Char / Riverine Area' | 'Urban Slum' | 'Tribal Belt' | 'Brick Kiln' | 'Prison';
  district: string;
  estimatedPopulation: number;
  presumptiveTested: number;
  positiveCasesFound: number;
  positivityRate: number; // percentage
  coordinates: [number, number]; // [lat, lng]
  priorityIndex: number; // 1 to 10
  activeCaseFindingStatus: 'Scheduled' | 'In Progress' | 'Completed' | 'Pending Allocation';
  assignedVan?: string;
  recommendedAction: string;
}

export interface DistrictMetric {
  district: string;
  totalNotified: number;
  annualizedNotificationRate: number; // per 100,000
  highRiskPatientPct: number;
  treatmentSuccessRate: number;
  deathRate: number;
  lossToFollowUpRate: number;
  vulnerablePocketsCount: number;
  diagnosticCentersCount: number;
  coordinates: [number, number];
}

export interface DiagnosticFacility {
  id: string;
  name: string;
  district: string;
  facilityType: 'DMC' | 'Truenat Lab' | 'CBNAAT Center' | 'IRL Guwahati';
  machineType: 'Truenat Quattro' | 'GeneXpert 4-Module' | 'LED-FM Microscopy' | 'AI Handheld X-Ray';
  dailyCapacity: number;
  currentDailyTests: number;
  utilizationRate: number; // percentage
  cartridgeStock: number;
  daysOfStockRemaining: number;
  predictedStockoutDate: string;
  operationalStatus: 'Optimal' | 'Near Capacity' | 'Cartridge Alert' | 'Maintenance Required';
  coordinates: [number, number];
  contactPerson: string;
}

export interface ReferralLoop {
  id: string;
  patientId: string;
  patientName: string;
  originPHI: string;
  destinationFacility: string;
  referralType: 'Presumptive Sputum Transport' | 'Confirmatory NAAT' | 'Chest X-Ray with AI' | 'Drug Susceptibility (DST)' | 'In-Patient Severe Triage';
  referredDate: string;
  transportStatus: 'Dispatched' | 'Sample in Transit' | 'Received at Lab' | 'Tested' | 'Report Released' | 'Treatment Initiated' | 'LOST_IN_TRANSIT_ALERT';
  elapsedDays: number;
  slaDays: number;
  isOverdue: boolean;
  actionPendingWith: string;
  patientPhone: string;
}

export interface DeathAudit {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  district: string;
  tbUnit: string;
  daysFromTreatmentToDeath: number;
  primarySystemicFactor: 'Delayed Presentation (>45 days cough)' | 'Diagnostic Cascade Lag (>14 days to NAAT)' | 'Severe Undernutrition (BMI < 13)' | 'Undetected Drug Resistance' | 'Advanced HIV Co-infection' | 'Hepatic / Drug-Induced Liver Injury';
  verbalAutopsyCompleted: boolean;
  preventabilityTier: 'Highly Preventable with Differentiated Care' | 'Moderately Preventable' | 'Unavoidable Advanced Presentation';
  auditDate: string;
  correctiveActionTaken: string;
  investigatingOfficer: string;
}

export interface DeduplicationCandidate {
  id: string;
  candidateA: {
    nikshayId: string;
    name: string;
    age: number;
    gender: string;
    address: string;
    mobile: string;
    facility: string;
    regDate: string;
  };
  candidateB: {
    nikshayId: string;
    name: string;
    age: number;
    gender: string;
    address: string;
    mobile: string;
    facility: string;
    regDate: string;
  };
  matchConfidence: number; // 0 - 100%
  matchingFields: string[];
  status: 'Pending Verification' | 'Confirmed Duplicate (Merged)' | 'Distinct Patients';
}
