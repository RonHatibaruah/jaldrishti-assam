import React from 'react';
import { 
  Waves, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Users, 
  Home, 
  ArrowUpRight, 
  CheckCircle2, 
  Layers, 
  Radio,
  Clock,
  Sparkles
} from 'lucide-react';
import { ASSAM_RIVER_STATIONS, DISTRICT_SUMMARIES, CAP_ACTIVE_ALERTS } from '../data/assam_flood_data';

interface ExecutiveCommandProps {
  onNavigateToMap: () => void;
  onNavigateToSimulation: () => void;
  onNavigateToAlerts: () => void;
}

export const ExecutiveCommand: React.FC<ExecutiveCommandProps> = ({
  onNavigateToMap,
  onNavigateToSimulation,
  onNavigateToAlerts
}) => {
  const totalSubmergedArea = DISTRICT_SUMMARIES.reduce((acc, d) => acc + d.submergedAreaSqKm, 0);
  const totalAffectedPop = DISTRICT_SUMMARIES.reduce((acc, d) => acc + d.affectedPopulation, 0);
  const totalCamps = DISTRICT_SUMMARIES.reduce((acc, d) => acc + d.activeReliefCamps, 0);
  const totalInmates = DISTRICT_SUMMARIES.reduce((acc, d) => acc + d.inmatesCount, 0);
  const criticalStations = ASSAM_RIVER_STATIONS.filter(s => s.status === 'ABOVE_DANGER_LEVEL').length;

  return (
    <div className="space-y-6">
      {/* Three-Tier Provenance Segregation Notice (Mandated by ASSAC) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
              <Layers className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
              ASSAC Mandated Data Provenance Segregation
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Telemetry Synced: Today 16:50 IST (ASDC)
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0 animate-pulse"></span>
            <div>
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <span>[OBSERVED]</span>
                <span className="text-[10px] text-emerald-800 font-normal">Real-Time Radar & Gauges</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Copernicus Sentinel-1 C-SAR (VV+VH) + CWC 35 Telemetry Gauges. Confidence: 96%
              </p>
            </div>
          </div>

          <div className="bg-amber-50/70 p-2.5 rounded-lg border border-amber-200 flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 shrink-0"></span>
            <div>
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <span>[FORECAST]</span>
                <span className="text-[10px] text-amber-800 font-normal">24h–48h Numerical Models</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                IMD WRF 3km rainfall grids + CWC hydrological stage forecast models. CI: 91%
              </p>
            </div>
          </div>

          <div className="bg-purple-50/70 p-2.5 rounded-lg border border-purple-200 flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-1 shrink-0"></span>
            <div>
              <div className="font-bold text-purple-950 flex items-center gap-1.5">
                <span>[SIMULATED]</span>
                <span className="text-[10px] text-purple-800 font-normal">Hydrodynamic & Breach AI</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                2D Saint-Venant PINN surrogate breach wavefront simulation. CI: 89%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* State Crisis Overview KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Critical Rivers</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600">{criticalStations} / {ASSAM_RIVER_STATIONS.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Above Extreme Danger Level</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Submerged Area</span>
            <Waves className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-bold text-blue-950">{totalSubmergedArea.toFixed(1)} <span className="text-sm font-normal text-slate-500">sq km</span></div>
          <div className="text-[11px] text-slate-500 mt-1">Sentinel-1 SAR Verified</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Population at Risk</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{(totalAffectedPop / 100000).toFixed(2)} <span className="text-sm font-normal text-slate-500">Lakh</span></div>
          <div className="text-[11px] text-slate-500 mt-1">Across 8 High-Impact Dists</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Relief Camps Active</span>
            <Home className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{totalCamps}</div>
          <div className="text-[11px] text-slate-500 mt-1">{totalInmates.toLocaleString()} inmates sheltered</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm col-span-2 md:col-span-1 hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Critical Dykes (BHI &gt; 80)</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600">18</div>
          <div className="text-[11px] text-slate-500 mt-1">Immediate Breach Watch</div>
        </div>
      </div>

      {/* Main Grid: River Gauges & Active CAP Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* River Gauges Telemetry (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-blue-950 flex items-center gap-2">
                <Waves className="w-5 h-5 text-blue-800" />
                <span>Major River Hydrological Telemetry & Stage Forecasts</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Central Water Commission (CWC) Real-Time Stations & 24h/48h Forecasts
              </p>
            </div>
            <button 
              onClick={onNavigateToMap}
              className="text-xs text-blue-900 bg-blue-50 hover:bg-blue-100 font-semibold flex items-center gap-1 cursor-pointer border border-blue-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
            >
              <span>View on 4D Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-blue-950 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">Station / River</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3 text-right">Danger (m)</th>
                  <th className="py-2.5 px-3 text-right">Current (m)</th>
                  <th className="py-2.5 px-3 text-center">Trend</th>
                  <th className="py-2.5 px-3 text-right">24h Forecast</th>
                  <th className="py-2.5 px-3 rounded-r-lg text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {ASSAM_RIVER_STATIONS.map((station) => (
                  <tr key={station.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-blue-950">{station.name}</div>
                      <div className="text-[11px] text-slate-500">{station.river}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{station.district}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500">{station.dangerLevelM.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-blue-950">
                      {station.currentLevelM.toFixed(2)}
                      {station.currentLevelM > station.dangerLevelM && (
                        <span className="text-[10px] text-rose-600 block font-normal">
                          +{(station.currentLevelM - station.dangerLevelM).toFixed(2)}m
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {station.trend === 'RISING' ? (
                        <span className="inline-flex items-center gap-1 text-rose-600 text-[11px] font-medium">
                          <TrendingUp className="w-3.5 h-3.5" /> Rising
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-medium">
                          <TrendingDown className="w-3.5 h-3.5" /> Receding
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-amber-700 font-semibold">
                      {station.forecast24hM.toFixed(2)} m
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        station.status === 'ABOVE_DANGER_LEVEL'
                          ? 'bg-rose-50 text-rose-700 border border-rose-300'
                          : 'bg-amber-50 text-amber-800 border border-amber-300'
                      }`}>
                        {station.status === 'ABOVE_DANGER_LEVEL' ? 'ABOVE DANGER' : 'WARNING'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Active CAP Bulletins & Quick Actions */}
        <div className="space-y-6">
          {/* Active CAP Bulletins */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
                <span>Live CAP Alerts Broadcast</span>
              </h3>
              <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200 font-mono font-bold">
                {CAP_ACTIVE_ALERTS.length} Dispatched
              </span>
            </div>

            <div className="space-y-3">
              {CAP_ACTIVE_ALERTS.map((alert) => (
                <div key={alert.id} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="font-mono text-rose-600 font-bold">{alert.severity}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 16:30 IST
                    </span>
                  </div>
                  <h4 className="font-semibold text-blue-950 leading-snug">{alert.headlineEnglish}</h4>
                  <p className="text-[11px] font-serif mt-1 text-slate-600">
                    {alert.headlineAssamese}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Target: {alert.targetDistricts.join(', ')}</span>
                    <span className="text-blue-800 font-mono font-semibold">SMS • CAP • Siren</span>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={onNavigateToAlerts}
              className="w-full mt-4 bg-white hover:bg-slate-50 text-blue-950 border border-slate-300 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Open CAP Dispatch Console
            </button>
          </div>

          {/* Quick Simulation Launcher */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/80 border border-blue-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-blue-950 font-bold text-sm mb-1.5">
              <Sparkles className="w-4 h-4 text-blue-800" />
              <span>Hydrodynamic Scenario Sandbox</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Simulate complex contingencies: upstream cloudbursts (up to 300mm), dam release surges from Kurichhu, or sudden levee breaches.
            </p>
            <button
              onClick={onNavigateToSimulation}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch "What-If" Simulation</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* District Vulnerability Summary Cards */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-blue-950 mb-3">District Exposure & Relief Operations Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {DISTRICT_SUMMARIES.map((d) => (
            <div key={d.district} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-blue-950">{d.district}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  d.status === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border border-rose-300' :
                  d.status === 'HIGH' ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                  'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  {d.status}
                </span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-500">
                <div className="flex justify-between">
                  <span>Submerged Area:</span>
                  <span className="text-blue-950 font-mono font-medium">{d.submergedAreaSqKm} sq km</span>
                </div>
                <div className="flex justify-between">
                  <span>Affected People:</span>
                  <span className="text-blue-950 font-mono font-medium">{d.affectedPopulation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Camps:</span>
                  <span className="text-emerald-700 font-mono font-medium">{d.activeReliefCamps} ({d.inmatesCount} inmates)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
