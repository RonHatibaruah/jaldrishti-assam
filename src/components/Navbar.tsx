import React from 'react';
import { 
  Waves, 
  MapPin, 
  Cpu, 
  ShieldAlert, 
  Radio, 
  Sliders, 
  Layers, 
  HelpCircle, 
  Lock, 
  UserCheck, 
  ShieldCheck,
  Activity
} from 'lucide-react';
import { AdminUser } from './AdminLogin';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  onOpenTutorial: () => void;
  adminUser: AdminUser | null;
  onOpenAdminLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedRole,
  setSelectedRole,
  onOpenTutorial,
  adminUser,
  onOpenAdminLogin
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Top Government Banner */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-400 border-b border-slate-800/80 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            GOVERNMENT OF ASSAM
          </span>
          <span className="text-slate-600">|</span>
          <span>Dept. of Science & Technology (ASSAC) ● ASDMA</span>
          <span className="text-slate-600">|</span>
          <span className="bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded font-mono text-[10px] border border-cyan-800/60">
            NESFIC-D-18 Stream 1
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-slate-400">Assam State Data Centre (ASDC) • Secure Enclave</span>
          <button 
            onClick={onOpenTutorial}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors font-medium cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Interactive Guide</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap justify-between items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('executive')}>
          <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20 text-white flex items-center justify-center">
            <Waves className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                JalDrishti
                <span className="text-cyan-400 font-normal text-sm font-serif">জলদৃষ্টি</span>
              </h1>
              <span className="bg-blue-900/60 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-700/50">
                4D Digital Twin
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Assam Flood Simulation & Space Sentinel Engine
            </p>
          </div>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2 bg-slate-800/90 p-1 rounded-lg border border-slate-700 text-xs">
          <span className="text-slate-400 px-2 font-medium">Persona:</span>
          <button
            onClick={() => setSelectedRole('SEOC')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              selectedRole === 'SEOC'
                ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            SEOC State Command
          </button>
          <button
            onClick={() => setSelectedRole('DEOC')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              selectedRole === 'DEOC'
                ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            DEOC District DDMA
          </button>
          <button
            onClick={() => setSelectedRole('WRD')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              selectedRole === 'WRD'
                ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            WRD Engineer
          </button>
        </div>

        {/* Admin Login / Session Status */}
        <div>
          {adminUser ? (
            <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1.5 rounded-lg text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <span className="text-emerald-300 font-semibold block leading-tight">{adminUser.name}</span>
                <span className="text-[10px] text-emerald-400/80 font-mono">{adminUser.role}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Portal Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="bg-slate-900/90 border-t border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-2 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('executive')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
              activeTab === 'executive'
                ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>State Command (SEOC)</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
              activeTab === 'map'
                ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>4D Digital Twin Map</span>
          </button>

          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
              activeTab === 'simulation'
                ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>What-If Simulation Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab('embankments')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
              activeTab === 'embankments'
                ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Embankment Sentinel (BHI)</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
              activeTab === 'alerts'
                ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>CAP Early Warning Dissemination</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
              activeTab === 'admin'
                ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>ASDC Admin & Governance</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
