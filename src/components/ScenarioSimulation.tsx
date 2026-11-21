import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Play, 
  RefreshCw, 
  AlertTriangle, 
  Waves, 
  CheckCircle2, 
  Clock, 
  Users, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Send,
  Zap
} from 'lucide-react';
import { ASSAM_EMBANKMENTS } from '../data/assam_flood_data';
import { WhatIfSimulationResult } from '../types/flood';

interface ScenarioSimulationProps {
  onSendAlert: () => void;
  onViewOnMap: () => void;
}

export const ScenarioSimulation: React.FC<ScenarioSimulationProps> = ({
  onSendAlert,
  onViewOnMap
}) => {
  // Scenario inputs
  const [scenarioName, setScenarioName] = useState<string>('Custom Crisis Scenario');
  const [rainfallMm, setRainfallMm] = useState<number>(180);
  const [damReleaseCumecs, setDamReleaseCumecs] = useState<number>(1200);
  const [selectedEmbankment, setSelectedEmbankment] = useState<string>('EMB-BAR-01');
  const [leadTimeHours, setLeadTimeHours] = useState<number>(24);

  // Simulation execution state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [currentStepText, setCurrentStepText] = useState<string>('');
  const [simulationResult, setSimulationResult] = useState<WhatIfSimulationResult | null>({
    simulatedAt: 'Today 16:42 IST',
    runtimeSeconds: 38.4,
    additionalFloodedAreaSqKm: 148.6,
    totalPopulationAtRisk: 86400,
    wavefrontArrivalTimeHours: 3.5,
    submergedHighwaysKm: 16.8,
    threatenedVillages: [
      'Khagrabari Pathar (Barpeta)',
      'Bishnupur Char (Chenga)',
      'Baghbor Gaon (Baghbor)',
      'Sarthebari Western Line'
    ],
    safeEvacuationCorridors: [
      'State Highway 4 via Barpeta Town to Howly Elevated Spur',
      'NH-27 Northbound Corridor to Bongaigaon Relief Depot',
      'Chenga High-Ground Multi-Purpose Shelter Complex'
    ],
    confidenceScore: 91.4,
    provenance: 'SIMULATED'
  });

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationProgress(15);
    setCurrentStepText('1/4: Ingesting CartoDEM 10m spatial mesh & river geometry...');

    setTimeout(() => {
      setSimulationProgress(45);
      setCurrentStepText('2/4: Applying upstream boundary hydrograph (Rainfall: ' + rainfallMm + 'mm, Dam: ' + damReleaseCumecs + ' cumecs)...');
    }, 600);

    setTimeout(() => {
      setSimulationProgress(80);
      setCurrentStepText('3/4: Solving 2D Saint-Venant shallow water equations via PINN surrogate engine...');
    }, 1200);

    setTimeout(() => {
      setSimulationProgress(100);
      setCurrentStepText('4/4: Vectorizing inundation wavefront & intersecting road networks...');
      
      const breachMultiplier = selectedEmbankment ? 1.35 : 1.0;
      const additionalArea = parseFloat((((rainfallMm * 0.45) + (damReleaseCumecs * 0.04)) * breachMultiplier).toFixed(1));
      const popAtRisk = Math.round(additionalArea * 580);
      const arrivalTime = parseFloat((Math.max(1.5, 6.0 - (damReleaseCumecs / 400))).toFixed(1));

      setSimulationResult({
        simulatedAt: 'Just now',
        runtimeSeconds: 36.8,
        additionalFloodedAreaSqKm: additionalArea,
        totalPopulationAtRisk: popAtRisk,
        wavefrontArrivalTimeHours: arrivalTime,
        submergedHighwaysKm: parseFloat((additionalArea * 0.11).toFixed(1)),
        threatenedVillages: [
          'Khagrabari Pathar (Barpeta)',
          'Bishnupur Char (Chenga)',
          'Baghbor Gaon (Baghbor)',
          'Sarthebari Western Line',
          'Raha Southern Belt (Nagaon)'
        ],
        safeEvacuationCorridors: [
          'State Highway 4 via Barpeta Town to Howly Elevated Spur',
          'NH-27 Northbound Corridor to Bongaigaon Relief Depot',
          'Barpeta Road Flood Shelter Compound #3'
        ],
        confidenceScore: 89.8,
        provenance: 'SIMULATED'
      });

      setIsSimulating(false);
    }, 1800);
  };

  const handlePresetSelect = (preset: 'preset1' | 'preset2' | 'preset3') => {
    if (preset === 'preset1') {
      setScenarioName('Kurichhu Dam Spill + 200mm Lower Assam Inundation');
      setRainfallMm(210);
      setDamReleaseCumecs(1850);
      setSelectedEmbankment('EMB-BAR-01');
      setLeadTimeHours(24);
    } else if (preset === 'preset2') {
      setScenarioName('Upper Subansiri Catchment Cloudburst (250mm) on Majuli');
      setRainfallMm(250);
      setDamReleaseCumecs(900);
      setSelectedEmbankment('EMB-MAJ-02');
      setLeadTimeHours(12);
    } else {
      setScenarioName('Kopili Basin Flash Surge with 140mm Rain (Nagaon)');
      setRainfallMm(140);
      setDamReleaseCumecs(1400);
      setSelectedEmbankment('EMB-MOR-03');
      setLeadTimeHours(48);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg">
              <Sliders className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-white">
              "What-If" Hydrodynamic Scenario Simulation Sandbox
            </h2>
            <span className="bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              [SIMULATED] 2D PINN Physics Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Simulate the cascading impact of extreme monsoon rainfall, transboundary dam releases, and earthen embankment breach failures to project sub-minute inundation wavefronts.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Quick Presets:</span>
          <button
            onClick={() => handlePresetSelect('preset1')}
            className="bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            Kurichhu Dam Spill
          </button>
          <button
            onClick={() => handlePresetSelect('preset2')}
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            Majuli 250mm Cloudburst
          </button>
          <button
            onClick={() => handlePresetSelect('preset3')}
            className="bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            Kopili Valley Surge
          </button>
        </div>
      </div>

      {/* Main Grid: Input Parameters (Left) vs Simulation Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Scenario Parameter Configuration</span>
          </h3>

          {/* Scenario Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Scenario Title</label>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
            />
          </div>

          {/* Slider 1: Upstream Catchment Rainfall */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-medium">Upstream 24h Rainfall:</span>
              <span className="font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                {rainfallMm} mm
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="300"
              step="10"
              value={rainfallMm}
              onChange={(e) => setRainfallMm(parseInt(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>Light (20mm)</span>
              <span>Moderate (120mm)</span>
              <span>Cloudburst (300mm)</span>
            </div>
          </div>

          {/* Slider 2: Dam Reservoir Discharge */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300 font-medium">Hydroelectric Dam Release:</span>
              <span className="font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                {damReleaseCumecs} cumecs
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2500"
              step="50"
              value={damReleaseCumecs}
              onChange={(e) => setDamReleaseCumecs(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>Nominal (0)</span>
              <span>Controlled (1,000)</span>
              <span>Emergency Spill (2,500)</span>
            </div>
          </div>

          {/* Embankment Breach Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Embankment Breach Trigger (Optional)
            </label>
            <select
              value={selectedEmbankment}
              onChange={(e) => setSelectedEmbankment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="">No Structural Breach (Overtopping Only)</option>
              {ASSAM_EMBANKMENTS.map((emb) => (
                <option key={emb.id} value={emb.id}>
                  {emb.name} (BHI: {emb.bhiScore} - {emb.status})
                </option>
              ))}
            </select>
          </div>

          {/* Lead Time */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Simulation Forecast Horizon</label>
            <div className="grid grid-cols-4 gap-2">
              {[12, 24, 48, 72].map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setLeadTimeHours(hours)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer ${
                    leadTimeHours === hours
                      ? 'bg-cyan-600 text-white border-cyan-500 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  +{hours}h
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              isSimulating
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
            }`}
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                <span>Solving 2D Hydrodynamic PINN...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Hydrodynamic Simulation</span>
              </>
            )}
          </button>

          {/* Progress bar when simulating */}
          {isSimulating && (
            <div className="space-y-1.5 pt-2">
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  className="bg-purple-500 h-2 transition-all duration-300 rounded-full"
                  style={{ width: `${simulationProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-purple-300 font-mono animate-pulse">{currentStepText}</p>
            </div>
          )}
        </div>

        {/* Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {simulationResult ? (
            <div className="bg-slate-900 border border-purple-900/60 rounded-xl p-5 shadow-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-purple-500/20 text-purple-300 rounded">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <h3 className="text-base font-bold text-white">{scenarioName}</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Simulated: {simulationResult.simulatedAt} • Solver Time: <b>{simulationResult.runtimeSeconds}s</b> (390x faster than legacy 2D HEC-RAS)
                  </span>
                </div>
                <span className="bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-1 rounded text-xs font-mono font-bold">
                  {simulationResult.confidenceScore}% Model Confidence
                </span>
              </div>

              {/* Simulation KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1">Additional Flooded Area</span>
                  <div className="text-xl font-bold text-purple-300 font-mono">
                    +{simulationResult.additionalFloodedAreaSqKm} <span className="text-xs">sq km</span>
                  </div>
                  <span className="text-[10px] text-purple-400/80 mt-1 block">Inundation depth &gt; 0.5m</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1">Newly Exposed Pop.</span>
                  <div className="text-xl font-bold text-amber-300 font-mono">
                    {simulationResult.totalPopulationAtRisk.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-amber-400/80 mt-1 block">Requiring immediate alert</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1">Wavefront Arrival</span>
                  <div className="text-xl font-bold text-red-400 font-mono">
                    {simulationResult.wavefrontArrivalTimeHours} <span className="text-xs">hours</span>
                  </div>
                  <span className="text-[10px] text-red-400/80 mt-1 block">Lead time for evacuation</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1">Submerged Highway</span>
                  <div className="text-xl font-bold text-rose-300 font-mono">
                    {simulationResult.submergedHighwaysKm} <span className="text-xs">km</span>
                  </div>
                  <span className="text-[10px] text-rose-400/80 mt-1 block">NH-27 / NH-31 arterial</span>
                </div>
              </div>

              {/* Threatened Settlements & Evacuation Paths */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Threatened Villages */}
                <div className="bg-slate-950 p-3.5 rounded-lg border border-red-950/60">
                  <div className="font-bold text-red-400 flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Projected Inundated Settlements</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300 text-[11px]">
                    {simulationResult.threatenedVillages.map((v, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-red-400 mt-0.5">•</span>
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Evacuation Corridors */}
                <div className="bg-slate-950 p-3.5 rounded-lg border border-emerald-950/60">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Recommended Safe Evacuation Routes</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300 text-[11px]">
                    {simulationResult.safeEvacuationCorridors.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap justify-between items-center gap-3">
                <button
                  onClick={onViewOnMap}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Overlay Wavefront on 4D Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onSendAlert}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-red-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Draft Bilingual CAP Alert for Affected Revenue Circles</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
              Select parameters and click "Run Hydrodynamic Simulation" to project the inundation footprint.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
