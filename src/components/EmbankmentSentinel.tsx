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
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-rose-50 text-rose-700 rounded-lg border border-rose-200">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-blue-950">
              Embankment Health Sentinel & Breach Hazard Worklist
            </h2>
            <span className="bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              4,400 km State Dyke Network Monitored
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Calculates an automated composite <b>Breach Hazard Index (BHI, 0–100)</b> by fusing hydraulic head differentials, Sentinel-1 radar soil moisture decline, structural vintage, and historical piping loci.
          </p>
        </div>

        {/* BHI Formula Tooltip Pill */}
        <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-200 text-right">
          <span className="text-[10px] text-blue-800 uppercase tracking-wider block font-bold">BHI Formulation</span>
          <span className="font-mono text-xs text-blue-950 font-bold">
            0.35ΔH + 0.25Sat + 0.15Age + 0.15Shear + 0.10Hist
          </span>
        </div>
      </div>

      {/* Success Notification Alert */}
      {inspectionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-3.5 rounded-xl text-xs flex items-center justify-between animate-fadeIn shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{inspectionSuccessMsg}</span>
          </div>
          <button onClick={() => setInspectionSuccessMsg(null)} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by embankment name, river, district, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 font-medium"
          />
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 text-xs bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner">
          <span className="text-slate-500 px-2 font-medium">BHI Risk Tier:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterSeverity === sev
                  ? sev === 'CRITICAL' ? 'bg-rose-700 text-white font-bold shadow-sm' :
                    sev === 'HIGH' ? 'bg-amber-700 text-white font-bold shadow-sm' :
                    sev === 'MODERATE' ? 'bg-blue-800 text-white font-bold shadow-sm' :
                    'bg-blue-900 text-white font-bold shadow-sm'
                  : 'text-slate-600 hover:text-blue-950 hover:bg-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-blue-950 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">
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
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((emb) => (
              <tr key={emb.id} className="hover:bg-blue-50/40 transition-colors">
                <td className="py-3.5 px-3">
                  <div className="font-semibold text-blue-950">{emb.name}</div>
                  <div className="text-[10px] font-mono text-blue-700 mt-0.5">{emb.code}</div>
                </td>
                <td className="py-3.5 px-3">
                  <div className="text-slate-800 font-medium">{emb.district}</div>
                  <div className="text-[11px] text-slate-500">{emb.river} Basin</div>
                </td>
                <td className="py-3.5 px-3 text-center font-mono text-slate-600">
                  {emb.lengthKm} km
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-blue-950">
                  <b>{emb.currentWaterHeadM}m</b>
                  <span className="text-[10px] text-slate-400 block">freeboard: {emb.designFreeboardM}m</span>
                </td>
                <td className="py-3.5 px-3 text-right font-mono">
                  <span className={`font-bold ${emb.soilSaturationPct >= 90 ? 'text-rose-700' : 'text-amber-700'}`}>
                    {emb.soilSaturationPct}%
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className={`inline-block font-mono font-bold text-sm px-2 py-0.5 rounded ${
                    emb.bhiScore >= 80 ? 'bg-rose-50 text-rose-700 border border-rose-300' :
                    emb.bhiScore >= 60 ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                    'bg-blue-50 text-blue-800 border border-blue-300'
                  }`}>
                    {emb.bhiScore}/100
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    emb.status === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border border-rose-300' :
                    emb.status === 'HIGH' ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                    'bg-blue-50 text-blue-800 border border-blue-300'
                  }`}>
                    {emb.status}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedEmbankment(emb)}
                      className="bg-white hover:bg-slate-50 text-blue-950 border border-slate-300 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer shadow-sm"
                    >
                      Cross-Section
                    </button>
                    <button
                      onClick={() => handleDispatchPatrol(emb)}
                      className="bg-rose-700 hover:bg-rose-800 text-white px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer shadow-sm"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-blue-950">{selectedEmbankment.name}</h3>
                <span className="font-mono text-xs text-blue-700">{selectedEmbankment.code}</span>
              </div>
              <button
                onClick={() => setSelectedEmbankment(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Geotechnical Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 block mb-1">Hydraulic Head Differential:</span>
                <span className="text-lg font-bold text-blue-950 font-mono">{selectedEmbankment.currentWaterHeadM} m</span>
                <span className="text-[10px] text-slate-400 block mt-1">Design Freeboard: {selectedEmbankment.designFreeboardM} m</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 block mb-1">Radar Soil Saturation:</span>
                <span className="text-lg font-bold text-rose-700 font-mono">{selectedEmbankment.soilSaturationPct}%</span>
                <span className="text-[10px] text-slate-400 block mt-1">Sentinel-1 C-band backscatter loss</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 block mb-1">Structural Vintage:</span>
                <span className="text-lg font-bold text-blue-950 font-mono">{selectedEmbankment.vintageYears} years</span>
                <span className="text-[10px] text-slate-400 block mt-1">Constructed: {2026 - selectedEmbankment.vintageYears}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 block mb-1">Past Breach Loci:</span>
                <span className="text-lg font-bold text-amber-700 font-mono">{selectedEmbankment.historicalBreaches} recorded</span>
                <span className="text-[10px] text-slate-400 block mt-1">Recurrent piping point</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-500 block mb-1">Responsible Division & Jurisdiction:</span>
              <span className="text-slate-900 font-semibold">{selectedEmbankment.responsibleDivision}</span>
              <span className="text-[11px] text-slate-500 block mt-1">Last Inspection: {selectedEmbankment.lastInspected}</span>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setSelectedEmbankment(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer border border-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDispatchPatrol(selectedEmbankment);
                  setSelectedEmbankment(null);
                }}
                className="bg-rose-700 hover:bg-rose-800 text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer shadow-md"
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
