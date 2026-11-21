import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Send, 
  ClipboardCheck, 
  ChevronRight,
  Droplets,
  HardHat,
  Clock,
  Layers
} from 'lucide-react';
import { ASSAM_EMBANKMENTS } from '../data/assam_flood_data';
import { EmbankmentSegment } from '../types/flood';

export const EmbankmentSentinel: React.FC = () => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEmbankment, setSelectedEmbankment] = useState<EmbankmentSegment | null>(null);
  const [inspectionSuccessMsg, setInspectionSuccessMsg] = useState<string | null>(null);

  const filtered = ASSAM_EMBANKMENTS.filter((emb) => {
    const matchesSeverity = filterSeverity === 'ALL' || emb.status === filterSeverity;
    const matchesSearch = emb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emb.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emb.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emb.river.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleDispatchPatrol = (emb: EmbankmentSegment) => {
    setInspectionSuccessMsg(`Emergency inspection patrol order dispatched to ${emb.responsibleDivision} for segment ${emb.code}. SMS alert sent to Sectional Officer.`);
    setTimeout(() => {
      setInspectionSuccessMsg(null);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-white">
              Embankment Health Sentinel & Breach Hazard Worklist
            </h2>
            <span className="bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              4,400 km State Dyke Network Monitored
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Calculates an automated composite <b>Breach Hazard Index (BHI, 0–100)</b> by fusing hydraulic head differentials, Sentinel-1 radar soil moisture decline, structural vintage, and historical piping loci.
          </p>
        </div>

        {/* BHI Formula Tooltip Pill */}
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-right">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">BHI Formulation</span>
          <span className="font-mono text-xs text-cyan-300 font-bold">
            0.35ΔH + 0.25Sat + 0.15Age + 0.15Shear + 0.10Hist
          </span>
        </div>
      </div>

      {/* Success Notification Alert */}
      {inspectionSuccessMsg && (
        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{inspectionSuccessMsg}</span>
          </div>
          <button onClick={() => setInspectionSuccessMsg(null)} className="text-emerald-400 font-bold">✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by embankment name, river, district, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 text-xs bg-slate-950 p-1 rounded-lg border border-slate-800">
          <span className="text-slate-400 px-2 font-medium">BHI Risk Tier:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterSeverity === sev
                  ? sev === 'CRITICAL' ? 'bg-red-700 text-white font-bold' :
                    sev === 'HIGH' ? 'bg-amber-700 text-white font-bold' :
                    sev === 'MODERATE' ? 'bg-blue-700 text-white font-bold' :
                    'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3 rounded-l-lg">Embankment Code / Name</th>
              <th className="py-2.5 px-3">District & River</th>
              <th className="py-2.5 px-3 text-center">Length (km)</th>
              <th className="py-2.5 px-3 text-right">Water Head</th>
              <th className="py-2.5 px-3 text-right">SAR Saturation</th>
              <th className="py-2.5 px-3 text-center">BHI Score</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 rounded-r-lg text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filtered.map((emb) => (
              <tr key={emb.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-3">
                  <div className="font-semibold text-white">{emb.name}</div>
                  <div className="text-[10px] font-mono text-cyan-400 mt-0.5">{emb.code}</div>
                </td>
                <td className="py-3.5 px-3">
                  <div className="text-slate-200 font-medium">{emb.district}</div>
                  <div className="text-[11px] text-slate-400">{emb.river} Basin</div>
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-slate-300">
                  {emb.lengthKm} km
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-white">
                  <b>{emb.currentWaterHeadM}m</b>
                  <span className="text-[10px] text-slate-500 block">freeboard: {emb.designFreeboardM}m</span>
                </td>
                <td className="py-3.5 px-3 text-right font-mono">
                  <span className={`font-bold ${emb.soilSaturationPct >= 90 ? 'text-red-400' : 'text-amber-400'}`}>
                    {emb.soilSaturationPct}%
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className={`inline-block font-mono font-bold text-sm px-2 py-0.5 rounded ${
                    emb.bhiScore >= 80 ? 'bg-red-950 text-red-300 border border-red-800' :
                    emb.bhiScore >= 60 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-blue-950 text-blue-300 border border-blue-800'
                  }`}>
                    {emb.bhiScore}/100
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    emb.status === 'CRITICAL' ? 'bg-red-900/60 text-red-300 border border-red-700' :
                    emb.status === 'HIGH' ? 'bg-amber-900/60 text-amber-300 border border-amber-700' :
                    'bg-blue-900/60 text-blue-300 border border-blue-700'
                  }`}>
                    {emb.status}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedEmbankment(emb)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Cross-Section
                    </button>
                    <button
                      onClick={() => handleDispatchPatrol(emb)}
                      className="bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer shadow-sm"
                    >
                      Dispatch Patrol
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cross Section Telemetry Modal */}
      {selectedEmbankment && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{selectedEmbankment.name}</h3>
                <span className="font-mono text-xs text-cyan-400">{selectedEmbankment.code}</span>
              </div>
              <button
                onClick={() => setSelectedEmbankment(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Geotechnical Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1">Hydraulic Head Differential:</span>
                <span className="text-lg font-bold text-white font-mono">{selectedEmbankment.currentWaterHeadM} m</span>
                <span className="text-[10px] text-slate-500 block mt-1">Design Freeboard: {selectedEmbankment.designFreeboardM} m</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1">Radar Soil Saturation:</span>
                <span className="text-lg font-bold text-red-400 font-mono">{selectedEmbankment.soilSaturationPct}%</span>
                <span className="text-[10px] text-slate-500 block mt-1">Sentinel-1 C-band backscatter loss</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1">Structural Vintage:</span>
                <span className="text-lg font-bold text-white font-mono">{selectedEmbankment.vintageYears} years</span>
                <span className="text-[10px] text-slate-500 block mt-1">Constructed: {2026 - selectedEmbankment.vintageYears}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1">Past Breach Loci:</span>
                <span className="text-lg font-bold text-amber-400 font-mono">{selectedEmbankment.historicalBreaches} recorded</span>
                <span className="text-[10px] text-slate-500 block mt-1">Recurrent piping point</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 block mb-1">Responsible Division & Jurisdiction:</span>
              <span className="text-slate-200 font-semibold">{selectedEmbankment.responsibleDivision}</span>
              <span className="text-[11px] text-slate-400 block mt-1">Last Inspection: {selectedEmbankment.lastInspected}</span>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setSelectedEmbankment(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-xs font-medium cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDispatchPatrol(selectedEmbankment);
                  setSelectedEmbankment(null);
                }}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
              >
                Dispatch Emergency WRD Patrol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
