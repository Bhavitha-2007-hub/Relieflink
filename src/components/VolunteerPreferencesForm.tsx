import React from 'react';
import {
  VolunteerProfile,
  Skill,
  AVAILABLE_SKILLS,
  NeighborhoodInfo,
} from '../types/relief';
import { VIJAYAWADA_SECTORS } from '../data/locationsData';
import {
  HeartPulse,
  Truck,
  Languages,
  Boxes,
  UtensilsCrossed,
  HelpingHand,
  Check,
  Search,
  Crosshair,
} from 'lucide-react';

interface VolunteerPreferencesFormProps {
  profile: VolunteerProfile;
  onChangeProfile: (updated: Partial<VolunteerProfile>) => void;
  onFindMatches: () => void;
  isSearching: boolean;
  matchCount: number;
  sectors?: Record<string, NeighborhoodInfo>;
  cityName?: string;
}

export const VolunteerPreferencesForm: React.FC<VolunteerPreferencesFormProps> = ({
  profile,
  onChangeProfile,
  onFindMatches,
  isSearching,
  matchCount,
  sectors = VIJAYAWADA_SECTORS,
  cityName = 'Vijayawada',
}) => {
  const toggleSkill = (skill: Skill) => {
    const current = profile.skills;
    if (current.includes(skill)) {
      if (current.length === 1) return;
      onChangeProfile({ skills: current.filter((s) => s !== skill) });
    } else {
      onChangeProfile({ skills: [...current, skill] });
    }
  };

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse':
        return <HeartPulse className="w-3.5 h-3.5" />;
      case 'Truck':
        return <Truck className="w-3.5 h-3.5" />;
      case 'Languages':
        return <Languages className="w-3.5 h-3.5" />;
      case 'Boxes':
        return <Boxes className="w-3.5 h-3.5" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-3.5 h-3.5" />;
      default:
        return <HelpingHand className="w-3.5 h-3.5" />;
    }
  };

  const sectorKeys = Object.keys(sectors);

  return (
    <div className="bg-white border-2 border-[#0B0F19] p-5 sm:p-6 space-y-6">
      {/* Field Guide Controller Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#0052CC] font-bold">
            Dispatch Profile Controller
          </span>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#ECEEF1] text-[#0B0F19] font-bold">
            Sector: {cityName}
          </span>
        </div>
        <h2 className="text-xl font-black text-[#0B0F19] tracking-tight">
          Volunteer Operational Parameters
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          Configure verified skills, time budget, and sector radius to calculate deterministic task eligibility.
        </p>
      </div>

      {/* 1. Available Time */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold">
            01 / Available Shift Duration
          </label>
          <span className="text-xs font-mono font-bold text-[#0052CC] tabular-nums">
            {profile.availableHours}h committed
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 4, 6].map((hrs) => {
            const isSelected = profile.availableHours === hrs;
            return (
              <button
                key={hrs}
                type="button"
                onClick={() => onChangeProfile({ availableHours: hrs })}
                className={`py-2 px-1 text-center transition-colors border-2 font-mono ${
                  isSelected
                    ? 'bg-[#0B0F19] text-white border-[#0B0F19]'
                    : 'bg-[#F8F9FA] text-[#0B0F19] border-slate-300 hover:border-[#0B0F19]'
                }`}
              >
                <div className="text-lg font-black leading-none tabular-nums">{hrs}</div>
                <div className="text-[10px] uppercase tracking-wider mt-1 font-semibold opacity-85">
                  {hrs === 1 ? 'Hour' : 'Hours'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Skills Multi-select */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold">
            02 / Skill Capabilities
          </label>
          <span className="text-[10px] font-mono text-slate-500 uppercase">
            {profile.skills.length} Certified
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {AVAILABLE_SKILLS.map((skill) => {
            const isSelected = profile.skills.includes(skill.id);
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => toggleSkill(skill.id)}
                className={`p-2.5 text-left transition-colors border flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-[#EBF3FF] border-[#0052CC] text-[#0B0F19]'
                    : 'bg-[#F8F9FA] border-slate-200 text-slate-700 hover:border-slate-400'
                }`}
              >
                <div
                  className={`p-1.5 shrink-0 ${
                    isSelected ? 'bg-[#0052CC] text-white' : 'bg-[#ECEEF1] text-slate-600'
                  }`}
                >
                  {getSkillIcon(skill.iconName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold leading-tight truncate">
                      {skill.label}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#0052CC] shrink-0 ml-1" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-0.5 line-clamp-1">
                    {skill.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Travel Radius & Starting Neighborhood (Tactical 2-column strip) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Travel Radius */}
        <div className="bg-[#F8F9FA] p-3.5 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold">
              03 / Max Transit Radius
            </label>
            <span className="text-xs font-mono font-bold text-[#0052CC] tabular-nums">
              {profile.travelRadiusKm} km
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[5, 10, 20].map((radius) => {
              const isSelected = profile.travelRadiusKm === radius;
              return (
                <button
                  key={radius}
                  type="button"
                  onClick={() => onChangeProfile({ travelRadiusKm: radius })}
                  className={`py-1.5 px-2 text-center text-xs font-mono font-bold transition-colors border ${
                    isSelected
                      ? 'bg-[#0B0F19] text-white border-[#0B0F19]'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
                  }`}
                >
                  {radius} km
                </button>
              );
            })}
          </div>
        </div>

        {/* Starting Neighborhood */}
        <div className="bg-[#F8F9FA] p-3.5 border border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold">
              04 / Starting Deployment Hub
            </label>
            <Crosshair className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <select
            value={profile.startingNeighborhood}
            onChange={(e) => onChangeProfile({ startingNeighborhood: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 text-xs text-[#0B0F19] font-medium focus:outline-none focus:border-[#0052CC]"
          >
            {sectorKeys.map((secKey) => (
              <option key={secKey} value={secKey}>
                {sectors[secKey]?.name || secKey} ({sectors[secKey]?.floodStatus || 'Sector Hub'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Match Trigger & Status Summary Callout */}
      <div className="bg-[#ECEEF1] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#0B0F19]">
            Active Eligibility Status
          </div>
          <div className="text-xs text-slate-600 mt-0.5">
            <span className="font-mono font-bold text-[#064E3B] tabular-nums">{matchCount} Tasks</span> match your skills, shift window, and safety perimeter.
          </div>
        </div>

        <button
          type="button"
          onClick={onFindMatches}
          disabled={isSearching}
          className="py-3 px-6 bg-[#0052CC] hover:bg-[#0041A8] active:bg-[#003180] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isSearching ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Evaluating Constraints...</span>
            </>
          ) : (
            <>
              <Search className="w-3.5 h-3.5" />
              <span>Calculate Best Matches</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
