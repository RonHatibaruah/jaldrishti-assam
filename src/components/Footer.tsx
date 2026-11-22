import React from 'react';
import { Waves, ShieldCheck, Database, Satellite, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a192f] border-t border-blue-950 text-slate-300 text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-700 rounded-lg text-white">
                <Waves className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-sm">JalDrishti (জলদৃষ্টি)</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Space-Enabled 4D Digital Twin Platform for Flood Management, Hydrodynamic Simulation and Early Warning for the Government of Assam.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-cyan-300 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>NESFIC-D-18 Stream 1 • Government Track</span>
            </div>
          </div>

          {/* Sponsoring Bodies */}
          <div>
            <h4 className="font-semibold text-white mb-2 text-xs uppercase tracking-wider">Challenge Owners</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>Assam State Space Applications Centre (ASSAC)</li>
              <li>Dept. of Science & Technology, Govt. of Assam</li>
              <li>Assam State Disaster Management Authority (ASDMA)</li>
              <li>Water Resources Department (WRD Assam)</li>
            </ul>
          </div>

          {/* Data Infrastructure */}
          <div>
            <h4 className="font-semibold text-white mb-2 text-xs uppercase tracking-wider">Data Ingestion Partners</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li className="flex items-center gap-1.5">
                <Satellite className="w-3 h-3 text-cyan-400" />
                <span>ISRO Bhuvan & Copernicus Sentinel-1 C-SAR</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Database className="w-3 h-3 text-blue-400" />
                <span>Central Water Commission (CWC) Telemetry</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Database className="w-3 h-3 text-indigo-400" />
                <span>IMD AWS Precipitation & Radar Grids</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Survey of India & CartoDEM 10m Mesh</span>
              </li>
            </ul>
          </div>

          {/* Statutory Mandate Notice */}
          <div className="bg-blue-950/60 p-3 rounded-lg border border-blue-900/80">
            <h4 className="font-semibold text-cyan-300 text-xs mb-1.5 flex items-center gap-1">
              <span>Statutory Provenance Notice</span>
            </h4>
            <p className="text-[10px] text-slate-300 leading-normal">
              In accordance with ASSAC directives, all spatial layers strictly segregate <span className="text-emerald-400 font-semibold">[OBSERVED]</span> ground-truth, <span className="text-amber-400 font-semibold">[FORECAST]</span> numerical weather outputs, and <span className="text-purple-300 font-semibold">[SIMULATED]</span> 2D hydrodynamic breach footprints.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-950/80 pt-4 flex flex-wrap justify-between items-center gap-3 text-[11px] text-slate-400">
          <div>
            © 2026 Government of Assam • North East Seva First Innovation Challenge (NESFIC 2026)
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-slate-400">Deployed at Assam State Data Centre (ASDC)</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-300 font-medium">DPDPA 2023 Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
