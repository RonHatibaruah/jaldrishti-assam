import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TBRiskWorklist } from './components/TBRiskWorklist';
import { VulnerabilityMap } from './components/VulnerabilityMap';
import { ReferralTracker } from './components/ReferralTracker';
import { FacilitySupervision } from './components/FacilitySupervision';
import { AuditAndDeduplication } from './components/AuditAndDeduplication';
import { ExecutiveCommand } from './components/ExecutiveCommand';
import { TutorialModal } from './components/TutorialModal';
import { 
  Activity, 
  MapPin, 
  GitCommit, 
  Building2, 
  FileSearch, 
  ShieldAlert, 
  HelpCircle,
  FileText,
  BookOpen,
  Copy,
  Download
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('executive');
  const [selectedRole, setSelectedRole] = useState<string>('STO');
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);

  // When role changes, switch to relevant default tab
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    if (role === 'STO') {
      setActiveTab('executive');
    } else if (role === 'DTO') {
      setActiveTab('facilities');
    } else if (role === 'MO_STS') {
      setActiveTab('worklist');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRole={selectedRole}
        setSelectedRole={handleRoleChange}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      {/* Role Indicator & Quick Actions Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Active View:</span>
          <span className="font-bold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
            {selectedRole === 'STO' 
              ? 'State TB Officer (Statewide Elimination Cockpit & Policy)' 
              : selectedRole === 'DTO' 
              ? 'District TB Officer (Supervision SPI Tours & Predictive Logistics)' 
              : 'Medical Officer / STS (Patient Triage & Differentiated Care)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tutorial / Guide Pill */}
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-900 rounded-lg text-xs font-bold shadow-sm transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-teal-700" />
            <span>How to Use & Test</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        {activeTab === 'executive' && <ExecutiveCommand />}
        {activeTab === 'worklist' && <TBRiskWorklist />}
        {activeTab === 'gis' && <VulnerabilityMap />}
        {activeTab === 'referrals' && <ReferralTracker />}
        {activeTab === 'facilities' && <FacilitySupervision />}
        {activeTab === 'audit' && <AuditAndDeduplication />}
      </main>

      {/* Comprehensive Tutorial & Guide Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        setActiveTab={setActiveTab}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};
