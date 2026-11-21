import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, 
  MapPin, 
  Eye, 
  EyeOff, 
  Info, 
  AlertTriangle, 
  ShieldAlert, 
  Waves, 
  Filter,
  CheckSquare,
  Square,
  Compass
} from 'lucide-react';
import L from 'leaflet';
import { 
  ASSAM_RIVER_STATIONS, 
  ASSAM_EMBANKMENTS, 
  ASSAM_INUNDATION_LAYERS 
} from '../data/assam_flood_data';
import { DataProvenanceTier } from '../types/flood';

export const DigitalTwinMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer Visibility State
  const [showObservedSAR, setShowObservedSAR] = useState<boolean>(true);
  const [showForecastWavefront, setShowForecastWavefront] = useState<boolean>(true);
  const [showSimulatedBreach, setShowSimulatedBreach] = useState<boolean>(true);
  const [showRiverStations, setShowRiverStations] = useState<boolean>(true);
  const [showEmbankments, setShowEmbankments] = useState<boolean>(true);

  // Provenance Filter
  const [activeProvenanceFilter, setActiveProvenanceFilter] = useState<DataProvenanceTier | 'ALL'>('ALL');
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map centered on Assam
      const map = L.map(mapContainerRef.current, {
        center: [26.35, 92.50],
        zoom: 7,
        zoomControl: true,
        attributionControl: true
      });

      // CartoDB Dark Matter Basemap for contrast
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing dynamic layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polygon || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // 1. Draw Inundation Polygons
    ASSAM_INUNDATION_LAYERS.forEach((poly) => {
      // Check visibility filter
      if (poly.provenance === 'OBSERVED' && !showObservedSAR) return;
      if (poly.provenance === 'FORECAST' && !showForecastWavefront) return;
      if (poly.provenance === 'SIMULATED' && !showSimulatedBreach) return;
      if (activeProvenanceFilter !== 'ALL' && poly.provenance !== activeProvenanceFilter) return;

      const fillColor = poly.provenance === 'OBSERVED' ? '#06b6d4' : // Cyan
                        poly.provenance === 'FORECAST' ? '#f59e0b' : // Amber
                        '#a855f7'; // Purple

      const polygon = L.polygon(poly.coordinates, {
        color: fillColor,
        fillColor: fillColor,
        fillOpacity: 0.45,
        weight: 2,
        dashArray: poly.provenance === 'SIMULATED' ? '5, 5' : undefined
      }).addTo(map);

      polygon.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; padding: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="color: #0284c7;">${poly.name}</strong>
            <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${fillColor}20; color: ${fillColor}; border: 1px solid ${fillColor};">
              [${poly.provenance}]
            </span>
          </div>
          <div>District: <b>${poly.district}</b> (${poly.revenueCircle})</div>
          <div>Inundated Area: <b>${poly.areaSqKm} sq km</b></div>
          <div>Average Water Depth: <b>${poly.avgDepthM} m</b> (Max: ${poly.maxDepthM} m)</div>
          <div>Estimated Population at Risk: <b>${poly.populationAtRisk.toLocaleString()}</b></div>
          <div style="margin-top: 6px; font-size: 10px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 4px;">
            Confidence: ${poly.confidenceIntervalPct}% CI • ${poly.sarSensor || poly.modelSource}
          </div>
        </div>
      `);
    });

    // 2. Draw Embankments (Polylines)
    if (showEmbankments && (activeProvenanceFilter === 'ALL' || activeProvenanceFilter === 'SIMULATED')) {
      ASSAM_EMBANKMENTS.forEach((emb) => {
        const strokeColor = emb.bhiScore >= 80 ? '#ef4444' : // Red (Critical)
                            emb.bhiScore >= 60 ? '#f59e0b' : // Amber (High)
                            '#10b981'; // Emerald

        const polyline = L.polyline(emb.coordinates, {
          color: strokeColor,
          weight: 4,
          opacity: 0.9
        }).addTo(map);

        polyline.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="color: #b91c1c;">${emb.name}</strong>
              <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${strokeColor}20; color: ${strokeColor}; border: 1px solid ${strokeColor};">
                BHI: ${emb.bhiScore}/100 [${emb.status}]
              </span>
            </div>
            <div>Code: <code>${emb.code}</code></div>
            <div>River: <b>${emb.river}</b> • Length: <b>${emb.lengthKm} km</b></div>
            <div>Current Water Head: <b>${emb.currentWaterHeadM}m</b> (Design Freeboard: ${emb.designFreeboardM}m)</div>
            <div>Soil Saturation (SAR): <b>${emb.soilSaturationPct}%</b></div>
            <div>Historical Breaches: <b>${emb.historicalBreaches} times</b></div>
            <div style="margin-top: 6px; font-size: 10px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 4px;">
              Division: ${emb.responsibleDivision} • Inspected: ${emb.lastInspected}
            </div>
          </div>
        `);
      });
    }

    // 3. Draw River Stations (Markers)
    if (showRiverStations && (activeProvenanceFilter === 'ALL' || activeProvenanceFilter === 'OBSERVED')) {
      ASSAM_RIVER_STATIONS.forEach((station) => {
        const isCritical = station.status === 'ABOVE_DANGER_LEVEL';
        const markerColor = isCritical ? '#ef4444' : '#f59e0b';

        // Custom HTML Marker Icon
        const customIcon = L.divIcon({
          className: 'custom-river-marker',
          html: `
            <div style="
              width: 16px; 
              height: 16px; 
              background: ${markerColor}; 
              border: 2px solid #ffffff; 
              border-radius: 50%; 
              box-shadow: 0 0 10px ${markerColor};
              animation: ${isCritical ? 'pulse 1.5s infinite' : 'none'};
            "></div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        const marker = L.marker([station.latitude, station.longitude], { icon: customIcon }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="color: #0369a1;">${station.name}</strong>
              <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: #e0f2fe; color: #0369a1; border: 1px solid #7dd3fc;">
                [OBSERVED]
              </span>
            </div>
            <div>River: <b>${station.river}</b> (${station.district})</div>
            <div style="margin-top: 4px;">
              Current Stage: <b style="color: ${isCritical ? '#dc2626' : '#d97706'}; font-size: 14px;">${station.currentLevelM.toFixed(2)} m</b>
              <span style="font-size: 11px; color: #64748b;">(Danger: ${station.dangerLevelM.toFixed(2)} m)</span>
            </div>
            <div>Trend: <b>${station.trend}</b></div>
            <div>24h Forecast: <b>${station.forecast24hM.toFixed(2)} m</b> • 48h: <b>${station.forecast48hM.toFixed(2)} m</b></div>
            <div style="margin-top: 6px; font-size: 10px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 4px;">
              Source: ${station.source} • Synced: ${station.lastUpdated}
            </div>
          </div>
        `);

        marker.on('click', () => setSelectedStation(station.id));
      });
    }

  }, [
    showObservedSAR, 
    showForecastWavefront, 
    showSimulatedBreach, 
    showRiverStations, 
    showEmbankments, 
    activeProvenanceFilter
  ]);

  return (
    <div className="space-y-4">
      {/* Control & Filter Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Layers className="w-4 h-4 text-cyan-400" /> Layers:
          </span>

          <button
            onClick={() => setShowObservedSAR(!showObservedSAR)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              showObservedSAR 
                ? 'bg-cyan-950/80 border-cyan-700 text-cyan-300 font-medium' 
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Observed SAR Extent</span>
          </button>

          <button
            onClick={() => setShowForecastWavefront(!showForecastWavefront)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              showForecastWavefront 
                ? 'bg-amber-950/80 border-amber-700 text-amber-300 font-medium' 
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>24h/48h Forecast Wave</span>
          </button>

          <button
            onClick={() => setShowSimulatedBreach(!showSimulatedBreach)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              showSimulatedBreach 
                ? 'bg-purple-950/80 border-purple-700 text-purple-300 font-medium' 
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            <span>Simulated Breach Inundation</span>
          </button>

          <button
            onClick={() => setShowRiverStations(!showRiverStations)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              showRiverStations 
                ? 'bg-blue-950/80 border-blue-700 text-blue-300 font-medium' 
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-blue-400" />
            <span>River Gauges</span>
          </button>

          <button
            onClick={() => setShowEmbankments(!showEmbankments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              showEmbankments 
                ? 'bg-rose-950/80 border-rose-700 text-rose-300 font-medium' 
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Embankments (BHI)</span>
          </button>
        </div>

        {/* Provenance Tier Filter (ASSAC Statutory Rule) */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400 px-2 font-medium">Provenance:</span>
          <button
            onClick={() => setActiveProvenanceFilter('ALL')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeProvenanceFilter === 'ALL' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveProvenanceFilter('OBSERVED')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeProvenanceFilter === 'OBSERVED' ? 'bg-cyan-700 text-white font-bold' : 'text-cyan-400 hover:text-cyan-300'
            }`}
          >
            [OBSERVED]
          </button>
          <button
            onClick={() => setActiveProvenanceFilter('FORECAST')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeProvenanceFilter === 'FORECAST' ? 'bg-amber-700 text-white font-bold' : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            [FORECAST]
          </button>
          <button
            onClick={() => setActiveProvenanceFilter('SIMULATED')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeProvenanceFilter === 'SIMULATED' ? 'bg-purple-700 text-white font-bold' : 'text-purple-400 hover:text-purple-300'
            }`}
          >
            [SIMULATED]
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 h-[640px]">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Map Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 text-xs text-slate-300 shadow-xl max-w-xs space-y-2">
          <div className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span>4D Map Legend</span>
            <Compass className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-cyan-500/60 border border-cyan-400 shrink-0"></span>
              <span><b>Observed Water (SAR):</b> Sentinel-1 GRD 10m</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-500/60 border border-amber-400 shrink-0"></span>
              <span><b>Forecast Surge:</b> 24h/48h Hydrodynamic Model</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-purple-500/60 border border-purple-400 border-dashed shrink-0"></span>
              <span><b>Simulated Breach:</b> 2D PINN Wavefront</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-red-500 rounded shrink-0"></span>
              <span><b>Embankment Critical (BHI &gt; 80):</b> Red Dyke</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white shrink-0"></span>
              <span><b>CWC Gauge:</b> Red = Above Danger Level</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
            Click any polygon or marker for telemetry & uncertainty indicators.
          </div>
        </div>
      </div>
    </div>
  );
};
