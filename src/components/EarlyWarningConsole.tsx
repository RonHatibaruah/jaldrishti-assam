import React, { useState } from 'react';
import { 
  Radio, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Languages, 
  Smartphone, 
  MessageSquare, 
  Volume2, 
  Users, 
  MapPin, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { CAP_ACTIVE_ALERTS } from '../data/assam_flood_data';
import { CAPAlert } from '../types/flood';

export const EarlyWarningConsole: React.FC = () => {
  const [alerts, setAlerts] = useState<CAPAlert[]>(CAP_ACTIVE_ALERTS);

  // New Alert State
  const [headlineEn, setHeadlineEn] = useState<string>('FLASH FLOOD SURGE WARNING: Beki River Rising Above Danger Level');
  const [headlineAs, setHeadlineAs] = useState<string>('জৰুৰী সতৰ্কবাৰ্তা: বেকী নদীৰ জলপৃষ্ঠ বিপদসীমাৰ ওপৰেৰে তীব্ৰগতিত বৃদ্ধি পাইছে');
  const [descEn, setDescEn] = useState<string>('Copernicus Sentinel-1 SAR and 2D Hydrodynamic simulation project +0.8m inundation in low-lying villages over the next 12 hours.');
  const [descAs, setDescAs] = useState<string>('উপগ্ৰহ চাৰ চিত্ৰ আৰু হাইড্ৰ’ডাইনামিক মডেল অনুসৰি আগন্তুক ১২ ঘণ্টাত চৰাঞ্চল আৰু নদীকাষৰীয়া গাঁওসমূহত ০.৮ মিটাৰ বানপানী প্ৰৱেশৰ সম্ভাৱনা।');
  const [targetDistrict, setTargetDistrict] = useState<string>('Barpeta');
  const [targetCircles, setTargetCircles] = useState<string>('Baghbor, Chenga, Barpeta Sadar');
  const [severity, setSeverity] = useState<'Extreme' | 'Severe' | 'Moderate'>('Extreme');
  const [successBroadcast, setSuccessBroadcast] = useState<boolean>(false);

  // Channel selections
  const [channelCellBroadcast, setChannelCellBroadcast] = useState<boolean>(true);
  const [channelSMS, setChannelSMS] = useState<boolean>(true);
  const [channelWhatsApp, setChannelWhatsApp] = useState<boolean>(true);
  const [channelIVRS, setChannelIVRS] = useState<boolean>(true);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();

    const newAlert: CAPAlert = {
      id: `CAP-AS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      identifier: `ASDMA-CAP-202611-${Math.floor(1000 + Math.random() * 9000)}`,
      sender: 'ASDMA-SEOC-Dispur',
      sentAt: new Date().toISOString(),
      status: 'Actual',
      msgType: 'Alert',
      scope: 'Public',
      category: 'Met',
      urgency: 'Immediate',
      severity: severity,
      certainty: 'Observed',
      headlineAssamese: headlineAs,
      headlineEnglish: headlineEn,
      descriptionAssamese: descAs,
      descriptionEnglish: descEn,
      instructionAssamese: 'তৎক্ষণাত ওখ স্থান আৰু নিকটৱৰ্তী আশ্ৰয় শিবিৰলৈ প্ৰস্থান কৰক।',
      instructionEnglish: 'Evacuate immediately to designated relief shelters or elevated flood platforms.',
      targetDistricts: [targetDistrict],
      targetCircles: targetCircles.split(',').map(s => s.trim()),
      dispatchedChannels: ['CELL_BROADCAST', 'SMS', 'WHATSAPP', 'IVRS_SIREN'],
      provenance: 'OBSERVED'
    };

    setAlerts([newAlert, ...alerts]);
    setSuccessBroadcast(true);
    setTimeout(() => setSuccessBroadcast(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-500/20 text-red-400 rounded-lg">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-base font-bold text-white">
              CAP Multi-Channel Early Warning Dissemination Engine
            </h2>
            <span className="bg-red-950 text-red-300 border border-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              OASIS CAP v1.2 / NDMA Sachet Integrated
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Dispatches automated, geotargeted bilingual flood warnings in <b>Assamese (অসমীয়া)</b> and <b>English</b> with 12–36 hours of actionable lead time to field responders and riverine communities.
          </p>
        </div>

        {/* Integration Badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-slate-950 text-cyan-400 border border-slate-800 px-2.5 py-1 rounded-md font-mono text-[11px]">
            NDMA Sachet Gateway: Connected
          </span>
        </div>
      </div>

      {/* Success Notification */}
      {successBroadcast && (
        <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 p-4 rounded-xl text-xs flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <b className="font-bold">CAP XML Payload Broadcast Succeeded!</b>
              <div className="text-[11px] text-emerald-400/80 mt-0.5">
                Geotargeted Cell Broadcast, 42,000 SMS messages, and WhatsApp Gaonburha siren alerts dispatched across {targetDistrict} circle.
              </div>
            </div>
          </div>
          <button onClick={() => setSuccessBroadcast(false)} className="text-emerald-400 font-bold">✕</button>
        </div>
      )}

      {/* Grid: Alert Authoring (Left) vs Active Bulletins (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Authoring Form (7 cols) */}
        <form onSubmit={handleBroadcast} className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Send className="w-4 h-4 text-cyan-400" />
            <span>Compose & Authorize Bilingual Early Warning Alert</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Target District</label>
              <select
                value={targetDistrict}
                onChange={(e) => setTargetDistrict(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Barpeta">Barpeta (Beki Basin)</option>
                <option value="Majuli">Majuli Island</option>
                <option value="Morigaon">Morigaon (Mayong)</option>
                <option value="Dhemaji">Dhemaji (Jiadhala)</option>
                <option value="Dhubri">Dhubri (Brahmaputra Lower)</option>
                <option value="Nagaon">Nagaon (Kopili Valley)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Severity Tier</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-bold text-red-400"
              >
                <option value="Extreme">Extreme (Red Alert - Evacuate)</option>
                <option value="Severe">Severe (Orange Alert - Prepare)</option>
                <option value="Moderate">Moderate (Yellow Alert - Watch)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Target Revenue Circles / Gram Panchayats
            </label>
            <input
              type="text"
              value={targetCircles}
              onChange={(e) => setTargetCircles(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Bilingual English & Assamese Inputs */}
          <div className="space-y-3 pt-1 border-t border-slate-800">
            {/* English */}
            <div>
              <label className="block text-xs font-medium text-cyan-300 mb-1 flex items-center gap-1.5">
                <span>Headline (English Standard)</span>
              </label>
              <input
                type="text"
                value={headlineEn}
                onChange={(e) => setHeadlineEn(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Assamese */}
            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5" />
                <span>Headline (অসমীয়া ভাষা / Assamese)</span>
              </label>
              <input
                type="text"
                value={headlineAs}
                onChange={(e) => setHeadlineAs(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-emerald-200 font-serif focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Description & Evacuation Guidance (English)
              </label>
              <textarea
                rows={2}
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-emerald-300 mb-1 font-serif">
                বিৱৰণ আৰু নিৰাপত্তা নিৰ্দেশনা (অসমীয়া)
              </label>
              <textarea
                rows={2}
                value={descAs}
                onChange={(e) => setDescAs(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-emerald-200 font-serif focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Delivery Channels */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Dissemination Channels</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <label className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channelCellBroadcast}
                  onChange={(e) => setChannelCellBroadcast(e.target.checked)}
                  className="accent-cyan-500"
                />
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] text-slate-200">Cell Broadcast</span>
              </label>

              <label className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channelSMS}
                  onChange={(e) => setChannelSMS(e.target.checked)}
                  className="accent-cyan-500"
                />
                <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px] text-slate-200">Bulk SMS</span>
              </label>

              <label className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channelWhatsApp}
                  onChange={(e) => setChannelWhatsApp(e.target.checked)}
                  className="accent-cyan-500"
                />
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-slate-200">WhatsApp Bot</span>
              </label>

              <label className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channelIVRS}
                  onChange={(e) => setChannelIVRS(e.target.checked)}
                  className="accent-cyan-500"
                />
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] text-slate-200">IVRS Siren Call</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer transition-colors"
          >
            <Radio className="w-4 h-4" />
            <span>Authorize & Broadcast CAP Early Warning Alert</span>
          </button>
        </form>

        {/* Active Dispatched Alerts Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Active Broadcast History</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">{alerts.length} Active Records</span>
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-cyan-400 font-semibold">{alert.identifier}</span>
                    <span className="bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      {alert.severity}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-xs leading-snug">{alert.headlineEnglish}</h4>
                  <p className="text-[11px] text-emerald-300 font-serif leading-snug">{alert.headlineAssamese}</p>

                  <p className="text-[11px] text-slate-400 leading-relaxed">{alert.descriptionEnglish}</p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Target: {alert.targetDistricts.join(', ')}</span>
                    <span className="text-slate-400">12h Lead Time</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
