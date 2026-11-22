import React from 'react';
import { 
  HelpCircle, 
  Layers, 
  Sliders, 
  ShieldAlert, 
  Radio, 
  Cpu, 
  CheckCircle2, 
  ExternalLink,
  Waves
} from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-900 rounded-xl border border-blue-200">
              <Waves className="w-5 h-5 text-blue-800" />
            </div>
            <div>
              <h3 className="text-base font-bold text-blue-950">
                JalDrishti (জলদৃষ্টি) • System Architecture & Evaluator Guide
              </h3>
              <span className="text-xs text-blue-700 font-mono font-medium">
                NESFIC-D-18 • Digital Twin for Flood Management, Simulation and Early Warning
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Overview Statement */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
          <div className="font-bold text-blue-950 text-sm">
            Fulfilling ASSAC & ASDMA Mandates for NESFIC 2026:
          </div>
          <p>
            Traditional flood management in Assam has been hindered by fragmented data streams—satellite rasters, river gauges, weather models, and field reports operating in disjointed silos. <b>JalDrishti</b> builds a unified, cloud-native 4D Digital Twin directly within the <b>Assam State Data Centre (ASDC)</b>, fusing satellite radar with physics-based 2D shallow water simulation.
          </p>
        </div>

        {/* 5 Core Pillars */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
            Key Architectural Pillars & Demonstrated Capabilities
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
              <div className="font-bold text-blue-950 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-800" />
                <span>1. Three-Tier Data Provenance Segregation</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Directly fulfills ASSAC’s statutory rule. Strictly distinguishes <b>[OBSERVED]</b> ground truth (Sentinel-1 SAR, CWC gauges), <b>[FORECAST]</b> weather grids (IMD WRF 3km), and <b>[SIMULATED]</b> hydrodynamic wavefronts with explicit 95% confidence intervals.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
              <div className="font-bold text-purple-950 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-700" />
                <span>2. 2D Hydrodynamic PINN Sandbox</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Couples 2D Saint-Venant shallow water equations with Physics-Informed Neural Networks (PINN). Reduces 48h basin simulation runtimes from 4+ hours to <b>&lt; 39 seconds</b> for sub-minute disaster decision support.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
              <div className="font-bold text-rose-950 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>3. Embankment Breach Hazard Index (BHI)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Monitors 4,400 km of digitized state dykes. Fuses real-time hydraulic head differentials, radar soil moisture decline, and historical breach loci into an actionable score (0–100) to pre-empt catastrophic levee failures.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-600" />
                <span>4. CAP Multi-Channel Bilingual Early Warning</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                OASIS CAP v1.2 / NDMA Sachet compliant engine. Dispatches localized warnings in <b>Assamese (অসমীয়া)</b> and <b>English</b> via Cell Broadcast, bulk SMS, and WhatsApp bots with 12–36 hours of actionable lead time.
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-md"
          >
            Explore JalDrishti Platform
          </button>
        </div>
      </div>
    </div>
  );
};
