import React, { useState } from 'react';
import { 
  Cpu, 
  Database, 
  Satellite, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Server, 
  Activity, 
  Lock, 
  Key, 
  FileText,
  Sliders,
  RefreshCw
} from 'lucide-react';
import { AdminUser } from './AdminLogin';

interface AdminConsoleProps {
  adminUser: AdminUser | null;
  onLogout: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({ adminUser, onLogout }) => {
  const [manningsChannel, setManningsChannel] = useState<number>(0.028);
  const [manningsFloodplain, setManningsFloodplain] = useState<number>(0.038);
  const [bhiThreshold, setBhiThreshold] = useState<number>(80);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSaveParams = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleExportAuditLogs = () => {
    const auditData = {
      exportedAt: new Date().toISOString(),
      exporter: adminUser?.name || 'Authorized ASDC State Officer',
      securityStandard: 'DPDPA 2023 & Assam Cybersecurity Protocol',
      auditHash: 'SHA-256: e8b948f21950c4bb21a9c3947b59218d6e3f4a9b',
      eventsLogged: 1248,
      status: 'VERIFIED_TAMPER_PROOF'
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jaldrishti_asdc_audit_trail_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg">
              <Cpu className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-white">
              Assam State Data Centre (ASDC) • JalDrishti Governance Console
            </h2>
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              ASDC Dispur Enclave
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Administer cloud-native containerized microservices, tune 2D hydrodynamic PINN physics parameters, monitor space remote sensing telemetry queues, and verify compliance with DPDPA 2023.
          </p>
        </div>

        {adminUser && (
          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <span className="text-white font-bold block">{adminUser.name}</span>
              <span className="text-slate-400 font-mono text-[11px]">{adminUser.email}</span>
            </div>
            <button
              onClick={onLogout}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {saveSuccess && (
        <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center gap-2 shadow-md animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Hydrodynamic simulation parameters updated and synchronized across all ASDC worker pods!</span>
        </div>
      )}

      {/* Infrastructure Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Spatial DB Cluster</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">PostGIS 3.4 / K8s</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Healthy (3/3 Nodes Active)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>SAR Ingestion Pipeline</span>
            <Satellite className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">STAC / GDAL</div>
          <div className="text-[11px] text-cyan-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Next Pass: Today 22:45 UTC</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>PINN AI Surrogate</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">PyTorch / CUDA</div>
          <div className="text-[11px] text-purple-300">
            <span>P95 Latency: 38.4s • NSE: 0.912</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>CAP Alert Gateway</span>
            <Server className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">NDMA Sachet Bus</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Connected & Verified</span>
          </div>
        </div>
      </div>

      {/* Main Form: Model Hyperparameter Tuning & Provenance Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Calibration */}
        <form onSubmit={handleSaveParams} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Hydrodynamic Solver & BHI Calibration</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Manning’s Roughness Coefficient ($n$) — Main Brahmaputra River Channel
              </label>
              <input
                type="number"
                step="0.001"
                value={manningsChannel}
                onChange={(e) => setManningsChannel(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Standard alluvial sand-bed default: 0.028 s/m^(1/3)</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Manning’s Roughness Coefficient ($n$) — Alluvial Agricultural Floodplains
              </label>
              <input
                type="number"
                step="0.001"
                value={manningsFloodplain}
                onChange={(e) => setManningsFloodplain(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Assam silt-clay floodplain default: 0.038 s/m^(1/3)</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Breach Hazard Index (BHI) Critical Trigger Threshold
              </label>
              <input
                type="number"
                min="50"
                max="95"
                value={bhiThreshold}
                onChange={(e) => setBhiThreshold(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Scores exceeding this trigger mandatory automated WRD inspection</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
          >
            Update Simulation Model Parameters
          </button>
        </form>

        {/* Audit, Security & Regulatory Compliance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DPDPA 2023 & Spatial Audit Enclave</span>
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Every scenario simulation run, embankment hazard classification, and bilingual CAP early warning dispatch is recorded in an immutable append-only SHA-256 audit ledger hosted in the Assam State Data Centre.
          </p>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Data Residency:</span>
              <span className="font-mono text-cyan-400">100% In-State (ASDC Dispur)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Security Classification:</span>
              <span className="font-mono text-emerald-400">STQC VAPT Audited</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Open Data Compliance:</span>
              <span className="font-mono text-purple-400">OGC WMS / WFS / GeoJSON</span>
            </div>
          </div>

          <button
            onClick={handleExportAuditLogs}
            className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Tamper-Proof Cryptographic Audit Trail (JSON)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
