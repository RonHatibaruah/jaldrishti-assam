import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ExecutiveCommand } from './components/ExecutiveCommand';
import { DigitalTwinMap } from './components/DigitalTwinMap';
import { ScenarioSimulation } from './components/ScenarioSimulation';
import { EmbankmentSentinel } from './components/EmbankmentSentinel';
import { EarlyWarningConsole } from './components/EarlyWarningConsole';
import { AdminConsole } from './components/AdminConsole';
import { AdminLogin, AdminUser } from './components/AdminLogin';
import { TutorialModal } from './components/TutorialModal';
import { ShieldCheck, Info } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('executive');
  const [selectedRole, setSelectedRole] = useState<string>('SEOC');
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Restore previous admin session if exists
  useEffect(() => {
    const saved = localStorage.getItem('jaldrishti_admin_session');
    if (saved) {
      try {
        setAdminUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('jaldrishti_admin_session');
      }
    }
  }, []);

  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    localStorage.setItem('jaldrishti_admin_session', JSON.stringify(user));
    setActiveTab('admin');
  };

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('jaldrishti_admin_session');
    setActiveTab('executive');
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    if (role === 'SEOC') {
      setActiveTab('executive');
    } else if (role === 'DEOC') {
      setActiveTab('map');
    } else if (role === 'WRD') {
      setActiveTab('embankments');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRole={selectedRole}
        setSelectedRole={handleRoleChange}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        adminUser={adminUser}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Role Indicator & Context Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Active Command Horizon:</span>
          <span className="font-bold text-slate-200 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 shadow-sm flex items-center gap-1.5">
            {activeTab === 'admin' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-cyan-300">
                  ASDC State Data Centre Governance & Spatial Analytics Enclave
                </span>
              </>
            ) : selectedRole === 'SEOC' ? (
              'ASDMA State Emergency Operations Centre (SEOC) • Statewide Command'
            ) : selectedRole === 'DEOC' ? (
              'District Disaster Management Authority (DDMA / DEOC) • Relief & Evacuation'
            ) : (
              'Water Resources Department (WRD) • Embankment Inspection & Structural Sentinel'
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ISRO / CWC Live Link Active
          </span>
        </div>
      </div>

      {/* Main Dynamic View Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6 flex-1">
        {activeTab === 'executive' && (
          <ExecutiveCommand
            onNavigateToMap={() => setActiveTab('map')}
            onNavigateToSimulation={() => setActiveTab('simulation')}
            onNavigateToAlerts={() => setActiveTab('alerts')}
          />
        )}

        {activeTab === 'map' && <DigitalTwinMap />}

        {activeTab === 'simulation' && (
          <ScenarioSimulation
            onSendAlert={() => setActiveTab('alerts')}
            onViewOnMap={() => setActiveTab('map')}
          />
        )}

        {activeTab === 'embankments' && <EmbankmentSentinel />}

        {activeTab === 'alerts' && <EarlyWarningConsole />}

        {activeTab === 'admin' && (
          <AdminConsole adminUser={adminUser} onLogout={handleLogout} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      <AdminLogin
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};
