import React from 'react';
import { 
  Activity, 
  Shield, 
  AlertTriangle, 
  Database, 
  MapPin, 
  Stethoscope, 
  CheckCircle2, 
  BookOpen, 
  HelpCircle,
  Lock,
  ShieldCheck,
  UserCheck
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
    <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md border-b border-teal-800">
      {/* Top Government Strip */}
      <div className="bg-teal-950 text-teal-200 text-xs px-4 py-1.5 flex flex-wrap justify-between items-center border-b border-teal-800/60">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            GOVERNMENT OF ASSAM
          </span>
          <span className="text-teal-400/50">•</span>
          <span>National Health Mission (NHM) & State TB Cell</span>
          <span className="text-teal-400/50">•</span>
          <span className="bg-teal-900 text-teal-300 px-1.5 py-0.5 rounded text-[11px] font-mono font-medium">
            NESFIC-D-30: Govt Track
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-teal-300/80">
            National TB Elimination Programme (NTEP)
          </span>
          <span className="bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Decision-Support Only (CDSS)
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('executive')}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-900/30">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                NikshayDrishti <span className="text-teal-400 text-sm font-normal">নিশ্চয় দৃষ্টি</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-teal-800/80 text-teal-200 rounded border border-teal-600/40">
                Assam TB Sentinel
              </span>
            </div>
            <p className="text-xs text-slate-300">
              TB Risk Stratification & Programme Decision Support Platform
            </p>
          </div>
        </div>

        {/* Action Controls: Tutorial Button, Admin Button & Role Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Prominent Tutorial Link */}
          <button
            onClick={onOpenTutorial}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md transition-all border border-teal-400/50"
            title="What the application is and how to use it"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tutorial & Guide</span>
          </button>

          {/* Admin Login / Console Access Button */}
          {adminUser ? (
            <button
              onClick={() => setActiveTab('admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-md border border-amber-400/50 transition-all"
              title="Open Admin Management Cockpit"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
              <span>Admin: {adminUser.role}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/40 shadow-sm transition-all"
              title="Sign in with Demo Credentials to manage application"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Login</span>
              <span className="text-[10px] bg-teal-900/80 text-teal-200 px-1 rounded font-mono hidden sm:inline">Demo</span>
            </button>
          )}

          {/* Role Selector */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 px-2 font-medium hidden sm:inline">Role:</span>
            {[
              { id: 'STO', label: 'State TB Officer', icon: Shield },
              { id: 'DTO', label: 'District TB Officer', icon: MapPin },
              { id: 'MO_STS', label: 'MO / Field Staff', icon: Stethoscope }
            ].map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                    isSelected
                      ? 'bg-teal-700 text-white shadow border border-teal-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{role.label}</span>
                  <span className="sm:hidden">{role.id}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800/95 border-t border-slate-700/60 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-2 overflow-x-auto py-1.5 scrollbar-thin">
          {[
            { id: 'executive', label: 'Executive Command' },
            { id: 'worklist', label: 'Risk Stratification & Differentiated Care' },
            { id: 'gis', label: 'Geospatial Vulnerability & ACF' },
            { id: 'referrals', label: 'Closed-Loop Referrals' },
            { id: 'facilities', label: 'Facility Supervision & Logistics' },
            { id: 'audit', label: 'Audit & De-duplication' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-700/80 text-white shadow border border-teal-500/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Dedicated Admin Console Tab */}
          <button
            onClick={() => {
              if (adminUser) {
                setActiveTab('admin');
              } else {
                onOpenAdminLogin();
              }
            }}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'admin'
                ? 'bg-amber-600 text-white shadow border border-amber-400/60'
                : 'text-amber-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Console</span>
            {!adminUser && (
              <span className="text-[10px] bg-slate-900/80 text-amber-300 border border-amber-500/30 px-1 rounded font-mono">
                Auth
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
