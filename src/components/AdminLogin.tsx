import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, X, Key } from 'lucide-react';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'STATE_SUPER_ADMIN' | 'ASDMA_COMMANDER' | 'ASSAC_SCIENTIST';
}

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('admin@assac.assam.gov.in');
  const [password, setPassword] = useState<string>('dispur2026');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@assac.assam.gov.in' && password === 'dispur2026') {
      onLoginSuccess({
        id: 'ADM-ASSAC-001',
        name: 'Dr. H. K. Sarma',
        email: 'admin@assac.assam.gov.in',
        role: 'ASSAC_SCIENTIST'
      });
      onClose();
    } else {
      setError('Invalid official credentials. Use demo credentials provided below.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 text-lg font-bold"
        >
          ✕
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 bg-blue-50 text-blue-900 rounded-lg border border-blue-200">
            <Lock className="w-5 h-5 text-blue-800" />
          </div>
          <div>
            <h3 className="text-base font-bold text-blue-950">ASDC Official Authentication</h3>
            <span className="text-[11px] text-slate-500">Assam State Space Applications Centre (ASSAC)</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-300 text-rose-800 p-3 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Official Government Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-700 font-mono font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Secure Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-700 font-mono font-medium"
            />
          </div>

          <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-200 text-[11px] space-y-1">
            <div className="text-blue-900 font-bold flex items-center gap-1">
              <Key className="w-3.5 h-3.5" />
              <span>NESFIC 2026 Evaluation Demo Credentials:</span>
            </div>
            <div className="text-slate-700 font-mono">Email: <b className="text-blue-950">admin@assac.assam.gov.in</b></div>
            <div className="text-slate-700 font-mono">Password: <b className="text-blue-950">dispur2026</b></div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg shadow-md transition-colors cursor-pointer"
          >
            Authenticate Session
          </button>
        </form>
      </div>
    </div>
  );
};
