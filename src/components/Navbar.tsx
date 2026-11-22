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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      {/* Top Government Masthead Banner (Deep Navy) */}
      <div className="bg-[#0a192f] px-4 py-1.5 text-xs text-slate-300 border-b border-blue-950 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            GOVERNMENT OF ASSAM
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-200">Dept. of Science & Technology (ASSAC) ● ASDMA</span>
          <span className="text-slate-500">|</span>
          <span className="bg-blue-900 text-cyan-200 px-2 py-0.5 rounded font-mono text-[10px] border border-blue-700">
            NESFIC-D-18 Stream 1
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-slate-300">Assam State Data Centre (ASDC) • Secure Enclave</span>
          <button 
            onClick={onOpenTutorial}
            className="flex items-center gap-1 text-cyan-300 hover:text-white transition-colors font-medium cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Guide</span>
          </button>
        </div>
      </div>

      {/* Main Navbar (Pure White) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap justify-between items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('executive')}>
          <div className="p-2.5 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 rounded-xl shadow-md text-white flex items-center justify-center">
            <Waves className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-blue-950 tracking-tight flex items-center gap-1.5">
                JalDrishti
                <span className="text-blue-700 font-normal text-sm font-serif">জলদৃষ্টি</span>
              </h1>
              <span className="bg-blue-50 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                4D Digital Twin
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Assam Flood Simulation & Space Sentinel Engine
            </p>
          </div>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs shadow-inner">
          <span className="text-slate-500 px-2 font-medium">Persona:</span>
          <button
            onClick={() => setSelectedRole('SEOC')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              selectedRole === 'SEOC'
                ? 'bg-blue-900 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:text-blue-950 hover:bg-white'
            }`}
          >
            SEOC State Command
          </button>
          <button
            onClick={() => setSelectedRole('DEOC')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              selectedRole === 'DEOC'
                ? 'bg-blue-900 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:text-blue-950 hover:bg-white'
            }`}
          >
            DEOC District DDMA
          </button>
          <button
            onClick={() => setSelectedRole('WRD')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              selectedRole === 'WRD'
                ? 'bg-blue-900 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:text-blue-950 hover:bg-white'
            }`}
          >
            WRD Engineer
          </button>
        </div>

        {/* Admin Login / Session Status */}
        <div>
          {adminUser ? (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div className="text-left">
                <span className="text-emerald-950 font-semibold block leading-tight">{adminUser.name}</span>
                <span className="text-[10px] text-emerald-700 font-mono">{adminUser.role}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-blue-950 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-blue-800" />
              <span>Portal Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs (White with Navy Active Bar) */}
      <nav className="bg-white border-t border-slate-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-2 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('executive')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
              activeTab === 'executive'
                ? 'bg-blue-50/80 text-blue-950 border-b-2 border-blue-900 font-bold'
                : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
            }`}
          >
            <Activity className="w-4 h-4 text-blue-800" />
            <span>State Command (SEOC)</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
              activeTab === 'map'
                ? 'bg-blue-50/80 text-blue-950 border-b-2 border-blue-900 font-bold'
                : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4 text-blue-800" />
            <span>4D Digital Twin Map</span>
          </button>

          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
              activeTab === 'simulation'
                ? 'bg-blue-50/80 text-blue-950 border-b-2 border-blue-900 font-bold'
                : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4 text-blue-800" />
            <span>What-If Simulation Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab('embankments')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
              activeTab === 'embankments'
                ? 'bg-blue-50/80 text-blue-950 border-b-2 border-blue-900 font-bold'
                : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-blue-800" />
            <span>Embankment Sentinel (BHI)</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
              activeTab === 'alerts'
                ? 'bg-blue-50/80 text-blue-950 border-b-2 border-blue-900 font-bold'
                : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
            }`}
          >
            <Radio className="w-4 h-4 text-blue-800" />
            <span>CAP Early Warning Dissemination</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
              activeTab === 'admin'
                ? 'bg-blue-50/80 text-blue-950 border-b-2 border-blue-900 font-bold'
                : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
            }`}
          >
            <Cpu className="w-4 h-4 text-blue-800" />
            <span>ASDC Admin & Governance</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
