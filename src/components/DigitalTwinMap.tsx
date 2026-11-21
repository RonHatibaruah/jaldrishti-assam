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
  Compass,
  Satellite,
  Mountain,
  Moon,
  Sun,
  Globe
} from 'lucide-react';
import L from 'leaflet';
import { 
  ASSAM_RIVER_STATIONS, 
  ASSAM_EMBANKMENTS, 
  ASSAM_INUNDATION_LAYERS 
} from '../data/assam_flood_data';
import { DataProvenanceTier } from '../types/flood';

type BaseMapMode = 'satellite' | 'topo' | 'dark' | 'light';

interface BaseMapConfig {
  id: BaseMapMode;
  name: string;
  url: string;
  attribution: string;
  subdomains?: string[];
  maxZoom: number;
}

const BASE_MAPS: Record<BaseMapMode, BaseMapConfig> = {
  satellite: {
    id: 'satellite',
    name: 'Satellite (ESRI)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19
  },
  topo: {
    id: 'topo',
    name: 'Topography (OpenTopo)',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 17
  },
  dark: {
    id: 'dark',
    name: 'Dark Tactical (CARTO)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 19
  },
  light: {
    id: 'light',
    name: 'Light Blueprint (CARTO)',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 19
  }
};

export const DigitalTwinMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const activeTileLayerRef = useRef<L.TileLayer | null>(null);

  // Active Basemap Selection
  const [activeBaseMap, setActiveBaseMap] = useState<BaseMapMode>('satellite');

  // Layer Visibility State
  const [showObservedSAR, setShowObservedSAR] = useState<boolean>(true);
  const [showForecastWavefront, setShowForecastWavefront] = useState<boolean>(true);
  const [showSimulatedBreach, setShowSimulatedBreach] = useState<boolean>(true);
  const [showRiverStations, setShowRiverStations] = useState<boolean>(true);
  const [showEmbankments, setShowEmbankments] = useState<boolean>(true);

  // Provenance Filter
  const [activeProvenanceFilter, setActiveProvenanceFilter] = useState<DataProvenanceTier | 'ALL'>('ALL');
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [26.35, 92.50],
        zoom: 7,
        zoomControl: true,
        attributionControl: true
      });

      // Initialize with default basemap (Satellite)
      const initialConfig = BASE_MAPS[activeBaseMap];
      const tileLayer = L.tileLayer(initialConfig.url, {
        attribution: initialConfig.attribution,
        subdomains: initialConfig.subdomains || ['a', 'b', 'c'],
        maxZoom: initialConfig.maxZoom
      }).addTo(map);

      activeTileLayerRef.current = tileLayer;
      mapInstanceRef.current = map;
    }
  }, []);

  // Update Basemap Layer when activeBaseMap changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (activeTileLayerRef.current) {
      map.removeLayer(activeTileLayerRef.current);
    }

    const config = BASE_MAPS[activeBaseMap];
    const newTileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      subdomains: config.subdomains || ['a', 'b', 'c'],
      maxZoom: config.maxZoom
    }).addTo(map);

    // Send tile layer to back so vector layers stay on top
    newTileLayer.bringToBack();
    activeTileLayerRef.current = newTileLayer;
  }, [activeBaseMap]);

  // Update Vector Overlays (Polygons, Embankments, Markers)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing vector layers (preserve tileLayer)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polygon || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // 1. Draw Inundation Polygons
    ASSAM_INUNDATION_LAYERS.forEach((poly) => {
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
        fillOpacity: activeBaseMap === 'satellite' ? 0.55 : 0.45,
        weight: 2.5,
        dashArray: poly.provenance === 'SIMULATED' ? '6, 6' : undefined
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
          weight: 4.5,
          opacity: 0.95
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

        const customIcon = L.divIcon({
          className: 'custom-river-marker',
          html: `
            <div style="
              width: 18px; 
              height: 18px; 
              background: ${markerColor}; 
              border: 2px solid #ffffff; 
              border-radius: 50%; 
              box-shadow: 0 0 12px ${markerColor};
              animation: ${isCritical ? 'pulse 1.5s infinite' : 'none'};
            "></div>
          `,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
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
    activeProvenanceFilter,
    activeBaseMap
  ]);

  return (
    <div className="space-y-4">
      {/* Control & Filter Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Layers className="w-4 h-4 text-cyan-400" /> Overlays:
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
            <span>Simulated Breach</span>
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

        {/* Top-Right Free Base Map Mode Selector */}
        <div className="absolute top-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-700 text-xs text-slate-300 shadow-xl flex items-center gap-1">
          <div className="text-[11px] font-bold text-slate-300 px-2 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Basemap:</span>
          </div>

          <button
            onClick={() => setActiveBaseMap('satellite')}
            title="ESRI World Imagery (Free High-Resolution Satellite)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeBaseMap === 'satellite'
                ? 'bg-cyan-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Satellite</span>
          </button>

          <button
            onClick={() => setActiveBaseMap('topo')}
            title="OpenTopoMap (Free Elevation Contours & Drainage Terrain)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeBaseMap === 'topo'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Topography</span>
          </button>

          <button
            onClick={() => setActiveBaseMap('dark')}
            title="CartoDB Dark Matter (Free High-Contrast Tactical View)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeBaseMap === 'dark'
                ? 'bg-slate-800 text-white shadow-md font-bold border border-slate-600'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>

          <button
            onClick={() => setActiveBaseMap('light')}
            title="CartoDB Positron (Free Clean Light Blueprint)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeBaseMap === 'light'
                ? 'bg-slate-200 text-slate-900 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>
        </div>

        {/* Floating Map Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 text-xs text-slate-300 shadow-xl max-w-xs space-y-2">
          <div className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span>4D Map Legend</span>
            <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono">
              <Compass className="w-3.5 h-3.5" />
              <span>{BASE_MAPS[activeBaseMap].name}</span>
            </div>
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
            Switch basemaps above. Click any feature for telemetry & uncertainty indicators.
          </div>
        </div>
      </div>
    </div>
  );
};
