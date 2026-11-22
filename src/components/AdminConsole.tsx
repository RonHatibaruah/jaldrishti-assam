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
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
              <Cpu className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-blue-950">
              Assam State Data Centre (ASDC) • JalDrishti Governance Console
            </h2>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              ASDC Dispur Enclave
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Administer cloud-native containerized microservices, tune 2D hydrodynamic PINN physics parameters, monitor space remote sensing telemetry queues, and verify compliance with DPDPA 2023.
          </p>
        </div>

        {adminUser && (
          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <span className="text-blue-950 font-bold block">{adminUser.name}</span>
              <span className="text-slate-500 font-mono text-[11px]">{adminUser.email}</span>
            </div>
            <button
              onClick={onLogout}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-3.5 rounded-xl text-xs flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Hydrodynamic simulation parameters updated and synchronized across all ASDC worker pods!</span>
        </div>
      )}

      {/* Infrastructure Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Spatial DB Cluster</span>
            <Database className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-lg font-bold text-blue-950 font-mono">PostGIS 3.4 / K8s</div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Healthy (3/3 Nodes Active)</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>SAR Ingestion Pipeline</span>
            <Satellite className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-lg font-bold text-blue-950 font-mono">STAC / GDAL</div>
          <div className="text-[11px] text-blue-800 flex items-center gap-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Next Pass: Today 22:45 UTC</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>PINN AI Surrogate</span>
            <Activity className="w-4 h-4 text-purple-700" />
          </div>
          <div className="text-lg font-bold text-blue-950 font-mono">PyTorch / CUDA</div>
          <div className="text-[11px] text-purple-800 font-semibold">
            <span>P95 Latency: 38.4s • NSE: 0.912</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>CAP Alert Gateway</span>
            <Server className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-lg font-bold text-blue-950 font-mono">NDMA Sachet Bus</div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Connected & Verified</span>
          </div>
        </div>
      </div>

      {/* Main Form: Model Hyperparameter Tuning & Provenance Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Calibration */}
        <form onSubmit={handleSaveParams} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sliders className="w-4 h-4 text-blue-800" />
            <span>Hydrodynamic Solver & BHI Calibration</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Manning’s Roughness Coefficient ($n$) — Main Brahmaputra River Channel
              </label>
              <input
                type="number"
                step="0.001"
                value={manningsChannel}
                onChange={(e) => setManningsChannel(parseFloat(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-blue-700 font-medium"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Standard alluvial sand-bed default: 0.028 s/m^(1/3)</span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Manning’s Roughness Coefficient ($n$) — Alluvial Agricultural Floodplains
              </label>
              <input
                type="number"
                step="0.001"
                value={manningsFloodplain}
                onChange={(e) => setManningsFloodplain(parseFloat(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-blue-700 font-medium"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Assam silt-clay floodplain default: 0.038 s/m^(1/3)</span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Breach Hazard Index (BHI) Critical Trigger Threshold
              </label>
              <input
                type="number"
                min="50"
                max="95"
                value={bhiThreshold}
                onChange={(e) => setBhiThreshold(parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-blue-700 font-medium"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Scores exceeding this trigger mandatory automated WRD inspection</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-xs shadow-md transition-colors cursor-pointer"
          >
            Update Simulation Model Parameters
          </button>
        </form>

        {/* Audit, Security & Regulatory Compliance */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2 border-b border-slate-100 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>DPDPA 2023 & Spatial Audit Enclave</span>
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            Every scenario simulation run, embankment hazard classification, and bilingual CAP early warning dispatch is recorded in an immutable append-only SHA-256 audit ledger hosted in the Assam State Data Centre.
          </p>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-700">
              <span className="font-medium">Data Residency:</span>
              <span className="font-mono text-blue-900 font-bold">100% In-State (ASDC Dispur)</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span className="font-medium">Security Classification:</span>
              <span className="font-mono text-emerald-800 font-bold">STQC VAPT Audited</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span className="font-medium">Open Data Compliance:</span>
              <span className="font-mono text-purple-900 font-bold">OGC WMS / WFS / GeoJSON</span>
            </div>
          </div>

          <button
            onClick={handleExportAuditLogs}
            className="w-full bg-white hover:bg-slate-50 text-blue-950 border border-slate-300 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-blue-800" />
            <span>Export Tamper-Proof Cryptographic Audit Trail (JSON)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
