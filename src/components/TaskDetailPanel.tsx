import React, { useState } from 'react';
import { ReliefTask, TaskMatchResult, VolunteerProfile, AVAILABLE_SKILLS } from '../types/relief';
import {
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface TaskDetailPanelProps {
  task: ReliefTask | null;
  matchResult?: TaskMatchResult | null;
  profile: VolunteerProfile;
  isRegistered: boolean;
  onClose: () => void;
  onToggleRegistration: (taskId: string) => void;
}

export const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({
  task,
  matchResult,
  profile,
  isRegistered,
  onClose,
  onToggleRegistration,
}) => {
  const [checkedGear, setCheckedGear] = useState<Record<string, boolean>>({});

  if (!task) return null;

  const totalCapacity = task.totalCapacity;
  const spotsFilled = task.spotsFilled;
  const spotsOpen = Math.max(0, totalCapacity - spotsFilled);
  const percentFilled = Math.min(100, Math.round((spotsFilled / totalCapacity) * 100));

  const toggleGearCheck = (item: string) => {
    setCheckedGear((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const getSkillLabel = (skillId: string) => {
    return AVAILABLE_SKILLS.find((s) => s.id === skillId)?.label || skillId;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0B0F19]/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white border-2 border-[#0B0F19] w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-none flex flex-col text-[#0B0F19]">
        {/* Panel Header */}
        <div className="bg-[#0B0F19] text-[#F4F5F6] px-6 py-4 flex items-start justify-between gap-4 border-b-2 border-[#0B0F19]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5 font-mono text-[11px] tracking-wider uppercase">
              <span className="bg-[#0052CC] text-white px-2 py-0.5 font-bold">
                Task Ref: {task.id.toUpperCase()}
              </span>
              <span className="text-slate-300">
                {task.neighborhoodName}
              </span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-300">
                {task.verificationStatus}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {task.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close task details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Body */}
        <div className="p-6 space-y-6">
          {/* Visual Progress Bar Section: Spot Capacity */}
          <div className="bg-[#F8F9FA] border-2 border-slate-300 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-700">
                Volunteer Capacity Fill Rate
              </span>
              <span className="text-xs font-mono font-bold text-[#0B0F19] tabular-nums">
                {spotsFilled} of {totalCapacity} Filled ({spotsOpen} Open)
              </span>
            </div>

            {/* Visual Bar */}
            <div className="h-3.5 w-full bg-[#E5E7EB] border border-slate-300 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  spotsOpen === 0 ? 'bg-slate-500' : 'bg-[#064E3B]'
                }`}
                style={{ width: `${percentFilled}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-slate-500">
              <span>0% Empty</span>
              <span className="font-bold text-[#0B0F19]">{percentFilled}% Capacity Reached</span>
              <span>100% Staged</span>
            </div>
          </div>

          {/* Quick Data Callouts Strip (Tinted Box) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#ECEEF1] p-3 text-center font-mono">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Estimated Shift</div>
              <div className="text-base font-black text-[#0B0F19] tabular-nums">{task.estimatedHours} Hours</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Distance</div>
              <div className="text-base font-black text-[#0B0F19] tabular-nums">{matchResult?.distanceKm ?? 4} km</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Match Score</div>
              <div className="text-base font-black text-[#0052CC] tabular-nums">{matchResult?.score ?? 85}%</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Urgency</div>
              <div className="text-base font-black text-[#B45309] uppercase">{task.urgencyLevel}</div>
            </div>
          </div>

          {/* Task Detailed Narrative */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5">
              Operation Summary
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {task.detailedDescription}
            </p>
          </div>

          {/* Required Skills */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
              Mandatory Skills &amp; Qualifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {task.requiredSkills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 text-xs font-mono font-semibold bg-[#F8F9FA] border border-slate-300 text-[#0B0F19]"
                >
                  {getSkillLabel(s)}
                </span>
              ))}
            </div>
          </div>

          {/* Hazard & Safety Directive (Earth Ochre Tone) */}
          <div className="p-3.5 bg-[#FFFBEB] border-l-4 border-[#B45309] text-xs text-[#92400E]">
            <div className="font-mono uppercase text-[10px] tracking-wider font-bold text-[#B45309] mb-1">
              Safety Protocol &amp; Hazard Notice
            </div>
            <p className="leading-relaxed">
              {task.safetyNote}
            </p>
          </div>

          {/* Equipment Checklist */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
              Field Gear Verification Checklist
            </h3>
            <div className="space-y-1.5 bg-[#F8F9FA] p-3 border border-slate-200">
              {task.requiredGear.map((item) => {
                const isChecked = !!checkedGear[item];
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleGearCheck(item)}
                    className="w-full flex items-center justify-between p-2 text-left bg-white border border-slate-200 hover:border-slate-400 transition-colors cursor-pointer text-xs"
                  >
                    <span className={isChecked ? 'text-slate-400 line-through' : 'text-[#0B0F19] font-medium'}>
                      {item}
                    </span>
                    <span
                      className={`w-4 h-4 border flex items-center justify-center ${
                        isChecked
                          ? 'bg-[#064E3B] border-[#064E3B] text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deterministic Explanation */}
          {matchResult && (
            <div className="bg-[#ECEEF1] p-3 text-xs text-slate-700 border-l-2 border-[#0B0F19]">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1">
                Automated Match Explanation
              </div>
              <p className="font-medium leading-relaxed">
                {matchResult.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Panel Footer */}
        <div className="bg-[#F8F9FA] px-6 py-4 border-t-2 border-[#0B0F19] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-slate-500">
            Coordinator: <strong className="text-[#0B0F19]">{task.coordinatorName}</strong> ({task.contactChannel})
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-white border border-slate-300 hover:border-slate-500 text-xs font-mono uppercase font-bold text-slate-700 transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => onToggleRegistration(task.id)}
              disabled={spotsOpen === 0 && !isRegistered}
              className={`py-2.5 px-6 text-xs font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer border-2 ${
                isRegistered
                  ? 'bg-[#064E3B] text-white border-[#064E3B] hover:bg-[#043327]'
                  : spotsOpen === 0
                  ? 'bg-slate-400 text-white border-slate-400 cursor-not-allowed'
                  : 'bg-[#0B0F19] text-white border-[#0B0F19] hover:bg-[#1A2333]'
              }`}
            >
              {isRegistered ? 'Release Claimed Spot' : spotsOpen === 0 ? 'Shift Fully Booked' : 'Confirm Dispatch Spot'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
