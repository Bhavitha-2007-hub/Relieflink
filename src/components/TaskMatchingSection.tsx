import React, { useState } from 'react';
import {
  ReliefTask,
  TaskMatchResult,
  VolunteerProfile,
  AVAILABLE_SKILLS,
  NEIGHBORHOODS,
  NeighborhoodId,
  Skill,
  UrgencyLevel,
} from '../types/relief';
import {
  ArrowRight,
  Filter,
  CheckCircle,
  Search,
  ChevronRight,
  ShieldCheck,
  Clock,
  MapPin,
  Flame,
} from 'lucide-react';

interface TaskMatchingSectionProps {
  tasks: ReliefTask[];
  matchedResults: TaskMatchResult[];
  profile: VolunteerProfile;
  activeView: 'matches' | 'all';
  setActiveView: (view: 'matches' | 'all') => void;
  onSelectTask: (task: ReliefTask) => void;
  registeredTaskIds: string[];
}

export const TaskMatchingSection: React.FC<TaskMatchingSectionProps> = ({
  tasks,
  matchedResults,
  profile,
  activeView,
  setActiveView,
  onSelectTask,
  registeredTaskIds,
}) => {
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [selectedNeighborhoodFilter, setSelectedNeighborhoodFilter] = useState<string>('all');
  const [selectedUrgencyFilter, setSelectedUrgencyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Clean, high-utility emergency dispatch urgency indicator (no emojis)
  const renderUrgencyTag = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'high':
        return (
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 border border-[#B45309]/30">
            Urgency: High
          </span>
        );
      case 'medium':
        return (
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#92400E] bg-[#FFFBEB] px-2 py-0.5 border border-[#D97706]/30">
            Urgency: Med
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono uppercase font-medium tracking-wider text-slate-600 bg-[#ECEEF1] px-2 py-0.5">
            Urgency: Low
          </span>
        );
    }
  };

  // Strictly filter recommendations by selected skills
  const skillMatchedList = matchedResults.filter((m) => m.hasSkillMatch);
  const topMatches = skillMatchedList.slice(0, 3);

  // Filtered tasks for View All
  const filteredAllTasks = matchedResults.filter((item) => {
    const task = item.task;
    const matchesSkill =
      selectedSkillFilter === 'all' || task.requiredSkills.includes(selectedSkillFilter as Skill);
    const matchesNeighborhood =
      selectedNeighborhoodFilter === 'all' || task.neighborhoodId === selectedNeighborhoodFilter;
    const matchesUrgency =
      selectedUrgencyFilter === 'all' || task.urgencyLevel === selectedUrgencyFilter;
    const matchesQuery =
      searchQuery.trim() === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.neighborhoodName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSkill && matchesNeighborhood && matchesUrgency && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* View Switcher Bar with Tactile Button Tabs */}
      <div className="bg-white border-2 border-[#0B0F19] p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveView('matches')}
            className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider font-bold transition-colors ${
              activeView === 'matches'
                ? 'bg-[#0B0F19] text-white'
                : 'text-slate-700 hover:text-[#0B0F19] hover:bg-[#ECEEF1]'
            }`}
          >
            Recommended ({skillMatchedList.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveView('all')}
            className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider font-bold transition-colors ${
              activeView === 'all'
                ? 'bg-[#0B0F19] text-white'
                : 'text-slate-700 hover:text-[#0B0F19] hover:bg-[#ECEEF1]'
            }`}
          >
            All Verified ({tasks.length})
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-500">
          Ranked by skills fit · {profile.availableHours}h shift · {profile.travelRadiusKm}km radius
        </div>
      </div>

      {/* TOP RECOMMENDED MATCHES VIEW */}
      {activeView === 'matches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-[#0B0F19] tracking-tight uppercase">
                Top Priority Matches
              </h3>
              <p className="text-xs text-slate-500">
                Verified relief tasks ranked deterministically by skill alignment, transit distance, and sector safety.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('all')}
              className="text-xs font-mono uppercase font-bold text-[#0052CC] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {topMatches.length === 0 ? (
            <div className="bg-white border-2 border-[#0B0F19] p-8 text-center space-y-3">
              <div className="text-sm font-bold text-[#0B0F19]">
                No verified tasks match current constraints
              </div>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                No relief operations currently match your selected skills ({profile.skills.join(', ')}) within {profile.travelRadiusKm} km. Try expanding transit radius or selecting additional certified capabilities.
              </p>
              <button
                type="button"
                onClick={() => setActiveView('all')}
                className="inline-block py-2 px-4 bg-[#0B0F19] text-white text-xs font-mono uppercase tracking-wider font-bold"
              >
                View All Operations ({tasks.length})
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {topMatches.map((match, idx) => {
                const task = match.task;
                const isRegistered = registeredTaskIds.includes(task.id);
                const spotsOpen = Math.max(0, task.totalCapacity - task.spotsFilled);
                const percentFilled = Math.min(
                  100,
                  Math.round((task.spotsFilled / task.totalCapacity) * 100)
                );

                return (
                  <div
                    key={task.id}
                    className="bg-white border-2 border-[#0B0F19] p-5 transition-colors hover:border-[#0052CC] relative"
                  >
                    {/* Header Row: Rank Callout, Urgency, Verification */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black bg-[#0B0F19] text-white px-2 py-0.5 tracking-wider">
                          RANK #{idx + 1}
                        </span>
                        {renderUrgencyTag(task.urgencyLevel)}
                        <span className="text-[11px] font-mono text-slate-500">
                          {task.verificationStatus}
                        </span>
                      </div>

                      {/* Deterministic Score Callout */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                          Match Score:
                        </span>
                        <span className="text-sm font-mono font-black text-[#0052CC] tabular-nums">
                          {match.score}%
                        </span>
                      </div>
                    </div>

                    {/* Task Title & Narrative */}
                    <div className="space-y-1 mb-4">
                      <h4 className="text-lg font-black text-[#0B0F19] tracking-tight leading-snug">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {task.shortDescription}
                      </p>
                    </div>

                    {/* Dispatch Metadata Strip (Unboxed text with typographic separators) */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-mono mb-4">
                      <span>{task.neighborhoodName}</span>
                      <span aria-hidden="true" className="text-slate-300">/</span>
                      <span className="font-bold text-[#0B0F19]">{match.distanceKm} km away</span>
                      <span aria-hidden="true" className="text-slate-300">/</span>
                      <span>Requires {task.estimatedHours}h</span>
                      <span aria-hidden="true" className="text-slate-300">/</span>
                      <span className="text-slate-500">{task.requiredSkills.map(s => s.replace('_', ' ')).join(', ')}</span>
                    </div>

                    {/* Capacity Progress Bar Component */}
                    <div className="bg-[#F8F9FA] p-3 border border-slate-200 mb-4">
                      <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                        <span className="text-slate-600 uppercase text-[10px] font-bold">
                          Volunteer Capacity
                        </span>
                        <span className="font-bold text-[#0B0F19] tabular-nums">
                          {task.spotsFilled} / {task.totalCapacity} Spots Filled ({spotsOpen} Open)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-[#E5E7EB] overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            spotsOpen === 0 ? 'bg-slate-500' : 'bg-[#064E3B]'
                          }`}
                          style={{ width: `${percentFilled}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Plain Language Deterministic Explanation Callout */}
                    <div className="bg-[#ECEEF1] p-3 text-xs text-slate-700 mb-4 border-l-2 border-[#0B0F19]">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-0.5">
                        Match Rationale
                      </div>
                      <p className="font-medium leading-relaxed">
                        {match.explanation}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="text-[11px] font-mono text-[#B45309]">
                        Hazard: {task.safetyNote}
                      </div>

                      <div className="flex items-center gap-2 ml-auto">
                        {isRegistered && (
                          <span className="text-xs font-mono font-bold text-[#064E3B] flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Confirmed
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => onSelectTask(task)}
                          className="py-2 px-4 bg-[#0B0F19] hover:bg-[#1A2333] text-white text-xs font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer"
                        >
                          View Details &amp; Register →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ALL VERIFIED TASKS VIEW */}
      {activeView === 'all' && (
        <div className="space-y-4">
          {/* Tactical Filter Toolbar */}
          <div className="bg-white border-2 border-[#0B0F19] p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter tasks by name, sector, or supply type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#F8F9FA] border border-slate-300 text-xs text-[#0B0F19] placeholder-slate-400 font-medium focus:outline-none focus:border-[#0052CC]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedSkillFilter}
                  onChange={(e) => setSelectedSkillFilter(e.target.value)}
                  className="px-2.5 py-2 bg-[#F8F9FA] border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#0052CC]"
                >
                  <option value="all">All Skills</option>
                  {AVAILABLE_SKILLS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedUrgencyFilter}
                  onChange={(e) => setSelectedUrgencyFilter(e.target.value)}
                  className="px-2.5 py-2 bg-[#F8F9FA] border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#0052CC]"
                >
                  <option value="all">All Urgency</option>
                  <option value="high">High Urgency</option>
                  <option value="medium">Medium Urgency</option>
                  <option value="low">Low Urgency</option>
                </select>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between">
              <span>Showing {filteredAllTasks.length} of {tasks.length} operations</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[#0052CC] hover:underline"
                >
                  Reset query
                </button>
              )}
            </div>
          </div>

          {/* All Tasks Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAllTasks.map((match) => {
              const task = match.task;
              const isRegistered = registeredTaskIds.includes(task.id);
              const spotsOpen = Math.max(0, task.totalCapacity - task.spotsFilled);
              const percentFilled = Math.min(
                100,
                Math.round((task.spotsFilled / task.totalCapacity) * 100)
              );

              return (
                <div
                  key={task.id}
                  className="bg-white border border-slate-300 p-4 hover:border-[#0B0F19] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {renderUrgencyTag(task.urgencyLevel)}
                        <span className="text-[10px] font-mono text-slate-500">
                          {task.neighborhoodName}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#0052CC]">
                        {match.score}% match
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#0B0F19] mb-1">
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                      {task.shortDescription}
                    </p>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-3">
                      <span>{task.estimatedHours}h shift</span>
                      <span aria-hidden="true">·</span>
                      <span>{match.distanceKm} km transit</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-slate-700">{spotsOpen} spots open</span>
                    </div>

                    {/* Mini Capacity Indicator */}
                    <div className="h-1.5 w-full bg-[#E5E7EB] mb-3">
                      <div
                        className="h-full bg-[#064E3B]"
                        style={{ width: `${percentFilled}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]">
                      {task.verificationStatus}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectTask(task)}
                      className="text-xs font-mono font-bold text-[#0052CC] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
