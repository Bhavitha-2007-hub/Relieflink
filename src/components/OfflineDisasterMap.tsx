import React, { useState } from 'react';
import { ReliefTask, TaskMatchResult, VolunteerProfile, NEIGHBORHOODS, NeighborhoodId, NeighborhoodInfo } from '../types/relief';
import {
  Compass,
  WifiOff,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  MapPin,
} from 'lucide-react';

interface OfflineDisasterMapProps {
  tasks: ReliefTask[];
  matchedResults: TaskMatchResult[];
  profile: VolunteerProfile;
  selectedTaskId: string | null;
  onSelectTask: (task: ReliefTask) => void;
  onSelectNeighborhood?: (neighborhoodId: string) => void;
  sectors?: Record<string, NeighborhoodInfo>;
  cityName?: string;
}

export const OfflineDisasterMap: React.FC<OfflineDisasterMapProps> = ({
  tasks,
  matchedResults,
  profile,
  selectedTaskId,
  onSelectTask,
  onSelectNeighborhood,
  sectors,
  cityName = 'Vijayawada',
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showFloodOverlay, setShowFloodOverlay] = useState<boolean>(true);
  const [showRoadStatus, setShowRoadStatus] = useState<boolean>(true);
  const [showRadius, setShowRadius] = useState<boolean>(true);
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);

  const activeSectors = sectors || NEIGHBORHOODS;
  const volunteerCoords =
    activeSectors[profile.startingNeighborhood]?.centerCoords ||
    activeSectors[Object.keys(activeSectors)[0]]?.centerCoords || { x: 390, y: 270 };

  // 1 km ~= 30 SVG coordinate units
  const radiusSvgUnits = profile.travelRadiusKm * 28;

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(2.2, Math.max(0.85, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const getMatchForTask = (taskId: string) => {
    return matchedResults.find((m) => m.task.id === taskId);
  };

  return (
    <div className="bg-white border-2 border-[#0B0F19] overflow-hidden flex flex-col">
      {/* Map Header Bar - Emergency Navy Dispatch Command */}
      <div className="bg-[#0B0F19] text-[#F4F5F6] px-4 py-3 border-b-2 border-[#0B0F19] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0052CC] text-white flex items-center justify-center font-bold text-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                {cityName} Disaster Vector Cartography
              </h3>
              <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 bg-[#064E3B] text-white">
                Offline Cached
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">
              Budameru breach basin, Krishna river perimeter, high staging decks, and active task coordinates
            </p>
          </div>
        </div>

        {/* Layer Controls & Zoom */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setShowFloodOverlay(!showFloodOverlay)}
            className={`px-2.5 py-1 text-[11px] uppercase font-bold transition-colors ${
              showFloodOverlay
                ? 'bg-[#0052CC] text-white'
                : 'bg-white/10 text-slate-300 hover:text-white'
            }`}
            title="Toggle Budameru Inundation Overlay"
          >
            Inundation Zone
          </button>

          <button
            type="button"
            onClick={() => setShowRoadStatus(!showRoadStatus)}
            className={`px-2.5 py-1 text-[11px] uppercase font-bold transition-colors ${
              showRoadStatus
                ? 'bg-[#B45309] text-white'
                : 'bg-white/10 text-slate-300 hover:text-white'
            }`}
            title="Toggle Safe Corridors & Flyovers"
          >
            Road Corridors
          </button>

          <button
            type="button"
            onClick={() => setShowRadius(!showRadius)}
            className={`px-2.5 py-1 text-[11px] uppercase font-bold transition-colors ${
              showRadius
                ? 'bg-[#064E3B] text-white'
                : 'bg-white/10 text-slate-300 hover:text-white'
            }`}
            title="Toggle Volunteer Radius"
          >
            {profile.travelRadiusKm}km Transit
          </button>

          <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block"></div>

          <div className="flex items-center bg-white/10 p-0.5">
            <button
              type="button"
              onClick={() => handleZoom(0.2)}
              className="p-1 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
              title="Zoom In"
              aria-label="Zoom in on map"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(-0.2)}
              className="p-1 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
              title="Zoom Out"
              aria-label="Zoom out on map"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
              title="Reset Zoom"
              aria-label="Reset map zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full h-[450px] bg-slate-50 overflow-hidden select-none cursor-crosshair">
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full max-h-[500px]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Pattern for Budameru Inundation Flood Zone */}
              <pattern
                id="vjaFloodHatch"
                width="14"
                height="14"
                patternTransform="rotate(45 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <line x1="0" y1="0" x2="0" y2="14" stroke="#0284c7" strokeWidth="2" strokeOpacity="0.3" />
                <rect width="14" height="14" fill="#e0f2fe" fillOpacity="0.75" />
              </pattern>

              {/* Grid pattern */}
              <pattern id="vjaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
              </pattern>

              {/* Soft glow for beacon */}
              <filter id="vjaBeaconGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Canvas */}
            <rect width="800" height="500" fill="#f8fafc" />
            <rect width="800" height="500" fill="url(#vjaGrid)" />

            {/* Indrakeeladri Hill Topography (Kanaka Durga Temple - High Rocky Ridge) */}
            <path
              d="M 60,320 C 110,290 180,310 200,380 C 190,440 120,470 60,450 C 30,420 30,350 60,320 Z"
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <text x="110" y="380" fill="#64748b" fontSize="8.5" fontWeight="bold">
              INDRAKEELADRI HILL (HIGH GROUND)
            </text>

            {/* Krishna River (Massive wide river along South / Bhavanipuram to Prakasam Barrage) */}
            <path
              d="M 0,440 C 140,430 250,420 360,450 C 470,480 620,490 800,480"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="48"
              strokeLinecap="round"
            />
            <path
              d="M 0,440 C 140,430 250,420 360,450 C 470,480 620,490 800,480"
              fill="none"
              stroke="#0284c7"
              strokeWidth="36"
              strokeOpacity="0.75"
              strokeLinecap="round"
            />
            <text x="280" y="445" fill="#ffffff" fontSize="10" fontWeight="bold" letterSpacing="2">
              KRISHNA RIVER
            </text>

            {/* Prakasam Barrage Structure */}
            <rect x="250" y="415" width="22" height="42" rx="3" fill="#0f172a" />
            <text x="261" y="438" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle" transform="rotate(-90 261 438)">
              PRAKASAM BARRAGE
            </text>

            {/* Budameru Rivulet Channel (Flowing into Northern Vijayawada Basin) */}
            <path
              d="M 280,0 C 340,40 400,70 480,90 C 560,110 680,115 800,100"
              fill="none"
              stroke="#0284c7"
              strokeWidth="10"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
            <text x="520" y="80" fill="#0369a1" fontSize="8.5" fontWeight="bold">
              BUDAMERU DIVERSION CHANNEL
            </text>

            {/* Budameru Flood Inundation Zone (Ajit Singh Nagar, Payakapuram, Kundavari Kandrika) */}
            {showFloodOverlay && (
              <g>
                <path
                  d="M 400,90 C 490,70 650,80 720,130 C 760,180 710,240 600,250 C 480,260 410,210 400,150 Z"
                  fill="url(#vjaFloodHatch)"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                />
                <rect x="490" y="115" width="170" height="20" rx="4" fill="#0284c7" fillOpacity="0.9" />
                <text x="575" y="129" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                  AJIT SINGH NAGAR INUNDATION BASIN
                </text>
                <text x="575" y="148" fill="#0369a1" fontSize="8" fontWeight="600" textAnchor="middle">
                  Submerged 4ft to 7ft • NDRF Boat Access Only
                </text>
              </g>
            )}

            {/* Safe High Ground Core (Gandhinagar / Governorpet / BRTS Road) */}
            <rect
              x="300"
              y="200"
              width="230"
              height="150"
              rx="18"
              fill="#f0fdf4"
              stroke="#22c55e"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <text x="315" y="218" fill="#15803d" fontSize="9" fontWeight="bold">
              CENTRAL SAFE URBAN ZONE (UNFLOODED)
            </text>

            {/* Road Network & Flyovers */}
            {showRoadStatus && (
              <g>
                {/* MG Road / Bandar Road (Main unflooded lifeline artery) */}
                <path
                  d="M 280,390 L 380,310 L 530,300 L 720,320"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <text x="410" y="325" fill="#14532d" fontSize="8" fontWeight="bold">
                  MG ROAD (BANDAR RD) — DRY &amp; CLEAR
                </text>

                {/* BRTS Corridor (Connects Railway Station to Singh Nagar Flyover approach) */}
                <path
                  d="M 360,340 L 410,240 L 480,185"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="4"
                  strokeDasharray="6 3"
                />
                <text x="390" y="228" fill="#115e59" fontSize="7.5" fontWeight="bold">
                  BRTS ROAD (RELIEF CONVOYS)
                </text>

                {/* Ajit Singh Nagar Flyover (Dry elevated bridge over flood waters) */}
                <path
                  d="M 460,200 L 520,150 L 570,120"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="6"
                  strokeLinecap="square"
                />
                <rect x="480" y="152" width="75" height="14" rx="2" fill="#d97706" />
                <text x="517" y="162" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                  SINGH NAGAR FLYOVER
                </text>

                {/* NH65 Bypass (Gollapudi & Bhavanipuram) */}
                <path
                  d="M 120,400 L 220,350 L 300,320"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="4"
                />
                <text x="140" y="365" fill="#1e40af" fontSize="7.5" fontWeight="bold">
                  NH65 BYPASS (GOLLAPUDI)
                </text>

                {/* Flooded Underpass Warning */}
                <circle cx="445" cy="180" r="7" fill="#ef4444" />
                <text x="445" y="183" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                  ✕
                </text>
                <text x="445" y="194" fill="#b91c1c" fontSize="7" fontWeight="bold" textAnchor="middle">
                  Underpass Closed
                </text>
              </g>
            )}

            {/* Neighborhood Zone Hubs */}
            {/* 1. Ajit Singh Nagar */}
            <g
              className="cursor-pointer"
              onClick={() => onSelectNeighborhood?.('singh_nagar')}
            >
              <circle cx="500" cy="150" r="14" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
              <text x="500" y="154" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                SN
              </text>
              <rect x="440" y="170" width="120" height="22" rx="4" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
              <text x="500" y="181" fill="#0369a1" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                Ajit Singh Nagar
              </text>
              <text x="500" y="190" fill="#64748b" fontSize="7" textAnchor="middle">
                Flyover Boat Staging Hub
              </text>
            </g>

            {/* 2. Gandhinagar / Governorpet */}
            <g
              className="cursor-pointer"
              onClick={() => onSelectNeighborhood?.('gandhinagar_central')}
            >
              <circle cx="390" cy="270" r="14" fill="#16a34a" stroke="#ffffff" strokeWidth="2.5" />
              <text x="390" y="274" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                GC
              </text>
              <rect x="330" y="290" width="120" height="22" rx="4" fill="#ffffff" stroke="#16a34a" strokeWidth="1" />
              <text x="390" y="301" fill="#15803d" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                Gandhinagar &amp; Governorpet
              </text>
              <text x="390" y="310" fill="#64748b" fontSize="7" textAnchor="middle">
                Stadium &amp; GGH Hospital Hub
              </text>
            </g>

            {/* 3. Bhavanipuram / Gollapudi */}
            <g
              className="cursor-pointer"
              onClick={() => onSelectNeighborhood?.('bhavanipuram')}
            >
              <circle cx="220" cy="350" r="14" fill="#d97706" stroke="#ffffff" strokeWidth="2.5" />
              <text x="220" y="354" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                BH
              </text>
              <rect x="160" y="370" width="120" height="22" rx="4" fill="#ffffff" stroke="#d97706" strokeWidth="1" />
              <text x="220" y="381" fill="#b45309" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                Bhavanipuram &amp; Gollapudi
              </text>
              <text x="220" y="390" fill="#64748b" fontSize="7" textAnchor="middle">
                NH65 &amp; River Logistics
              </text>
            </g>

            {/* Volunteer Location Beacon & Travel Radius */}
            {showRadius && (
              <g>
                <circle
                  cx={volunteerCoords.x}
                  cy={volunteerCoords.y}
                  r={radiusSvgUnits}
                  fill="#0d9488"
                  fillOpacity="0.08"
                  stroke="#0f766e"
                  strokeWidth="1.8"
                  strokeDasharray="5 4"
                />
                <circle
                  cx={volunteerCoords.x}
                  cy={volunteerCoords.y}
                  r="20"
                  fill="#0d9488"
                  fillOpacity="0.2"
                />
                <circle
                  cx={volunteerCoords.x}
                  cy={volunteerCoords.y}
                  r="9"
                  fill="#0f766e"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  filter="url(#vjaBeaconGlow)"
                />
                <circle cx={volunteerCoords.x} cy={volunteerCoords.y} r="3.5" fill="#ffffff" />
                <rect
                  x={volunteerCoords.x - 42}
                  y={volunteerCoords.y - 28}
                  width="84"
                  height="16"
                  rx="4"
                  fill="#0f766e"
                />
                <text
                  x={volunteerCoords.x}
                  y={volunteerCoords.y - 17}
                  fill="#ffffff"
                  fontSize="7.5"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  STARTING POINT
                </text>
              </g>
            )}

            {/* Relief Task Pinpoints */}
            {tasks.map((task) => {
              const match = getMatchForTask(task.id);
              const score = match?.score ?? 0;
              const isSelected = selectedTaskId === task.id;
              const isHovered = hoveredTaskId === task.id;
              const openSpots = task.totalCapacity - task.spotsFilled;
              const isWithinRadius = match?.isWithinRadius ?? true;

              let pinBg = '#2563eb';
              let pinBorder = '#ffffff';

              if (score >= 80) {
                pinBg = '#16a34a'; // green
              } else if (score >= 60) {
                pinBg = '#f59e0b'; // amber
              } else if (!isWithinRadius) {
                pinBg = '#94a3b8'; // muted gray
              }

              if (isSelected) {
                pinBg = '#7c3aed'; // purple selected
              }

              return (
                <g
                  key={task.id}
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => onSelectTask(task)}
                  onMouseEnter={() => setHoveredTaskId(task.id)}
                  onMouseLeave={() => setHoveredTaskId(null)}
                >
                  {(isSelected || isHovered || score >= 85) && (
                    <circle
                      cx={task.coords.x}
                      cy={task.coords.y}
                      r={isSelected ? '20' : '16'}
                      fill={pinBg}
                      fillOpacity="0.25"
                      stroke={pinBg}
                      strokeWidth="1.5"
                    />
                  )}

                  <circle
                    cx={task.coords.x}
                    cy={task.coords.y}
                    r={isSelected ? '11' : '9'}
                    fill={pinBg}
                    stroke={pinBorder}
                    strokeWidth="2"
                  />

                  <text
                    x={task.coords.x}
                    y={task.coords.y + 3}
                    fill="#ffffff"
                    fontSize={isSelected ? '8' : '7.5'}
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    {openSpots}
                  </text>

                  {/* Task Label on Map */}
                  <rect
                    x={task.coords.x - 42}
                    y={task.coords.y + 13}
                    width="84"
                    height="16"
                    rx="3"
                    fill="#ffffff"
                    stroke={isSelected ? '#7c3aed' : '#cbd5e1'}
                    strokeWidth={isSelected ? '1.5' : '1'}
                  />
                  <text
                    x={task.coords.x}
                    y={task.coords.y + 24}
                    fill={isSelected ? '#6d28d9' : '#1e293b'}
                    fontSize="7"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {task.title.length > 16 ? task.title.slice(0, 15) + '…' : task.title}
                  </text>

                  {/* Hover Card */}
                  {isHovered && (
                    <g>
                      <rect
                        x={task.coords.x - 75}
                        y={task.coords.y - 48}
                        width="150"
                        height="40"
                        rx="5"
                        fill="#0f172a"
                        stroke="#0284c7"
                        strokeWidth="1.5"
                      />
                      <text
                        x={task.coords.x}
                        y={task.coords.y - 34}
                        fill="#ffffff"
                        fontSize="8"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {task.title.length > 22 ? task.title.slice(0, 21) + '…' : task.title}
                      </text>
                      <text
                        x={task.coords.x}
                        y={task.coords.y - 22}
                        fill={task.urgencyLevel === 'high' ? '#f43f5e' : '#38bdf8'}
                        fontSize="7.5"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {task.urgencyLevel === 'high' ? '🚨 HIGH URGENCY' : `${task.urgencyLevel.toUpperCase()} URGENCY`} • {score}% Match • {openSpots} spots open
                      </text>
                      <text
                        x={task.coords.x}
                        y={task.coords.y - 12}
                        fill="#94a3b8"
                        fontSize="6.8"
                        textAnchor="middle"
                      >
                        Click pin to view details &amp; capacity
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Floating Map Legend / Info */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-2.5 text-xs pointer-events-none text-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-slate-800">Vijayawada Sector Grid 1:20,000</span>
            <span className="text-[10px] text-teal-700 font-mono font-bold">OFFLINE CACHED</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <div className="w-14 h-1 bg-slate-300 rounded flex">
              <div className="w-1/2 h-full bg-teal-600"></div>
            </div>
            <span>5 km scale</span>
          </div>
        </div>
      </div>

      {/* Map Legend Footer */}
      <div className="bg-[#F8F9FA] px-4 py-2.5 border-t border-slate-300 flex flex-wrap items-center justify-between gap-y-2 text-xs font-mono text-slate-700">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-500 font-bold uppercase text-[10px]">
            Legend:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#064E3B]"></span>
            <span className="text-[11px]">Primary Match (&gt;80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#B45309]"></span>
            <span className="text-[11px]">Secondary Match</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-sky-200 border border-sky-600"></span>
            <span className="text-[11px]">Budameru Inundation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 bg-[#064E3B]"></span>
            <span className="text-[11px]">Open Road Corridor</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500">
          Select marker pin to inspect live spot capacity
        </div>
      </div>
    </div>
  );
};
