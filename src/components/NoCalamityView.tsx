import React, { useState } from 'react';
import { LocationRegion } from '../types/relief';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sun,
  Users,
  Radio,
  Waves,
  Mountain,
  Wind,
} from 'lucide-react';

interface NoCalamityViewProps {
  location: LocationRegion;
  onSwitchLocation: (locationId: string) => void;
  onSimulateCalamityInLocation?: (locationId: string) => void;
}

export const NoCalamityView: React.FC<NoCalamityViewProps> = ({
  location,
  onSwitchLocation,
}) => {
  const [standbyRegistered, setStandbyRegistered] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* Primary Status Card: Operational Standby */}
      <div className="bg-white border-2 border-[#0B0F19] p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#064E3B]"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#064E3B]">
              Monitoring Status: Nominal
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 uppercase">
            Sector ID: {location.id.toUpperCase()} // Civic Telemetry
          </span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B0F19] tracking-tight">
            No Active Calamity in {location.cityName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Met services and municipal civil defense confirm normal, nominal conditions throughout {location.cityName}, {location.stateName}. Drainage basins, transportation networks, and emergency volunteer stations remain in reserve status.
          </p>
        </div>

        {/* Civic Metrics Strip (Tactile Tinted Boxes) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#F8F9FA] border border-slate-200 p-4 font-mono">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
              Weather Telemetry
            </span>
            <span className="text-xs font-bold text-[#0B0F19]">
              {location.weatherSummary.split('•')[0] || 'Clear & Stable'}
            </span>
          </div>

          <div className="bg-[#F8F9FA] border border-slate-200 p-4 font-mono">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
              Road Corridors
            </span>
            <span className="text-xs font-bold text-[#064E3B]">
              100% Transit Passable
            </span>
          </div>

          <div className="bg-[#F8F9FA] border border-slate-200 p-4 font-mono">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
              Volunteer Queue
            </span>
            <span className="text-xs font-bold text-[#0052CC]">
              Reserve Standby Mode
            </span>
          </div>
        </div>

        {/* Standby Registration Action */}
        <div className="pt-2">
          {standbyRegistered ? (
            <div className="bg-[#EBF3FF] border border-[#0052CC] p-4 text-xs font-mono text-[#0052CC] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Standby Enrollment Confirmed: You will receive automated alerts if dispatch is activated for {location.cityName}.
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setStandbyRegistered(true)}
              className="py-3 px-6 bg-[#0B0F19] hover:bg-[#1A2333] text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
            >
              Enroll on Standby Reserve for {location.cityName}
            </button>
          )}
        </div>
      </div>

      {/* Switch to Active Calamity Deployments */}
      <div className="bg-white border-2 border-[#0B0F19] p-6 max-w-4xl mx-auto space-y-4">
        <div>
          <h3 className="text-base font-black text-[#0B0F19] uppercase tracking-wider font-mono">
            Active Calamity Operations
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Volunteers willing to coordinate remotely or deploy to emergency zones can select active theaters below:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          {/* Vijayawada Flood */}
          <button
            type="button"
            onClick={() => onSwitchLocation('vijayawada')}
            className="p-4 bg-[#F8F9FA] border-2 border-[#0B0F19] hover:border-[#0052CC] text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-[#0B0F19] group-hover:text-[#0052CC]">
                Vijayawada, AP
              </span>
              <span className="text-[10px] font-bold text-[#B45309] bg-[#FEF3C7] px-1.5 py-0.5">
                Flood
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-sans leading-tight">
              Budameru breach flood response. High boat triage and food drop needs.
            </p>
            <div className="mt-3 text-[10px] font-bold text-[#0052CC] group-hover:underline flex items-center gap-1">
              <span>Switch Dispatch Sector</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </button>

          {/* Wayanad Landslide */}
          <button
            type="button"
            onClick={() => onSwitchLocation('wayanad')}
            className="p-4 bg-[#F8F9FA] border-2 border-[#0B0F19] hover:border-[#0052CC] text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-[#0B0F19] group-hover:text-[#0052CC]">
                Wayanad, Kerala
              </span>
              <span className="text-[10px] font-bold text-[#B45309] bg-[#FEF3C7] px-1.5 py-0.5">
                Landslide
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-sans leading-tight">
              Heavy debris clearance, medical evacuation, and camp supply sorting.
            </p>
            <div className="mt-3 text-[10px] font-bold text-[#0052CC] group-hover:underline flex items-center gap-1">
              <span>Switch Dispatch Sector</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </button>

          {/* Chennai Cyclone */}
          <button
            type="button"
            onClick={() => onSwitchLocation('chennai')}
            className="p-4 bg-[#F8F9FA] border-2 border-[#0B0F19] hover:border-[#0052CC] text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-[#0B0F19] group-hover:text-[#0052CC]">
                Chennai, TN
              </span>
              <span className="text-[10px] font-bold text-[#B45309] bg-[#FEF3C7] px-1.5 py-0.5">
                Cyclone
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-sans leading-tight">
              Storm water pumping, emergency hot meals, and power generator logistics.
            </p>
            <div className="mt-3 text-[10px] font-bold text-[#0052CC] group-hover:underline flex items-center gap-1">
              <span>Switch Dispatch Sector</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
