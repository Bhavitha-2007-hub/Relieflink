import React, { useState, useMemo, useEffect } from 'react';
import {
  ReliefTask,
  VolunteerProfile,
  TaskMatchResult,
  LocationRegion,
} from './types/relief';
import { calculateTaskMatch } from './data/mockData';
import { SUPPORTED_LOCATIONS } from './data/locationsData';
import { OfflineDisasterMap } from './components/OfflineDisasterMap';
import { TaskDetailPanel } from './components/TaskDetailPanel';
import { VolunteerPreferencesForm } from './components/VolunteerPreferencesForm';
import { TaskMatchingSection } from './components/TaskMatchingSection';
import { NoCalamityView } from './components/NoCalamityView';
import { LoginPage } from './components/LoginPage';
import { UserIdentityProfile, signOutUser } from './lib/firebase';
import {
  AlertCircle,
  ShieldAlert,
  LifeBuoy,
  HelpCircle,
  CheckCircle2,
  LogOut,
  UserCheck,
  MapPin,
  Navigation,
  Radio,
} from 'lucide-react';

export default function App() {
  // Authentication State with Verified OpenID Connect claims & stable sub identifier
  const [currentUser, setCurrentUser] = useState<UserIdentityProfile | null>(() => {
    try {
      const savedProfile = localStorage.getItem('relieflink_user_profile');
      if (savedProfile) {
        return JSON.parse(savedProfile);
      }
      const legacyEmail = localStorage.getItem('relieflink_user');
      if (legacyEmail) {
        return {
          sub: `usr_${legacyEmail.replace(/[^a-zA-Z0-9]/g, '').slice(0, 24)}`,
          email: legacyEmail,
          emailVerified: true,
          displayName: legacyEmail.split('@')[0],
          role: 'Verified Coordinator',
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  // Selected Location (Default: Vijayawada, Andhra Pradesh)
  const [selectedLocationId, setSelectedLocationId] = useState<string>('vijayawada');

  const currentLocation: LocationRegion = useMemo(() => {
    return (
      SUPPORTED_LOCATIONS.find((loc) => loc.id === selectedLocationId) ||
      SUPPORTED_LOCATIONS[0]
    );
  }, [selectedLocationId]);

  // Tasks for current location
  const [tasks, setTasks] = useState<ReliefTask[]>(() => currentLocation.tasks);

  // Update tasks when location changes
  useEffect(() => {
    setTasks(currentLocation.tasks);
    const firstSector = Object.keys(currentLocation.sectors)[0];
    if (firstSector) {
      setProfile((prev) => ({ ...prev, startingNeighborhood: firstSector }));
    }
  }, [currentLocation]);

  const [profile, setProfile] = useState<VolunteerProfile>({
    availableHours: 2,
    skills: ['sorting_supplies', 'general_help'],
    travelRadiusKm: 10,
    startingNeighborhood: 'gandhinagar_central',
  });

  const [registeredTaskIds, setRegisteredTaskIds] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<ReliefTask | null>(null);
  const [activeView, setActiveView] = useState<'matches' | 'all'>('matches');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSafetyGuide, setShowSafetyGuide] = useState<boolean>(false);
  const [gpsDetecting, setGpsDetecting] = useState<boolean>(false);

  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});

  const matchedResults: TaskMatchResult[] = useMemo(() => {
    return tasks
      .map((task) => {
        const match = calculateTaskMatch(task, profile);
        if (aiExplanations[task.id]) {
          return {
            ...match,
            explanation: aiExplanations[task.id],
            isAiExplanation: true,
          };
        }
        return match;
      })
      .sort((a, b) => b.score - a.score);
  }, [tasks, profile, aiExplanations]);

  const selectedTaskMatch = useMemo(() => {
    if (!selectedTask) return null;
    return matchedResults.find((m) => m.task.id === selectedTask.id) || null;
  }, [selectedTask, matchedResults]);

  const handleProfileChange = (updated: Partial<VolunteerProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleFindMatches = async () => {
    setIsSearching(true);
    const skillMatched = matchedResults.filter((m) => m.hasSkillMatch);
    const topMatches = skillMatched.slice(0, 3);

    try {
      const topTask = topMatches[0];
      if (topTask) {
        const res = await fetch('/api/explain-match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            task: topTask.task,
            volunteerProfile: profile,
            distanceKm: topTask.distanceKm,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.explanation) {
            setAiExplanations((prev) => ({
              ...prev,
              [topTask.task.id]: data.explanation,
            }));
          }
        }
      }
    } catch (e) {
      console.warn('AI endpoint fallback:', e);
    } finally {
      setTimeout(() => {
        setIsSearching(false);
        setActiveView('matches');
      }, 300);
    }
  };

  const handleToggleRegistration = (taskId: string) => {
    const isCurrentlyRegistered = registeredTaskIds.includes(taskId);

    if (isCurrentlyRegistered) {
      setRegisteredTaskIds((prev) => prev.filter((id) => id !== taskId));
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, spotsFilled: Math.max(0, t.spotsFilled - 1) } : t))
      );
      if (selectedTask?.id === taskId) {
        setSelectedTask((prev) =>
          prev ? { ...prev, spotsFilled: Math.max(0, prev.spotsFilled - 1) } : null
        );
      }
    } else {
      setRegisteredTaskIds((prev) => [...prev, taskId]);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, spotsFilled: Math.min(t.totalCapacity, t.spotsFilled + 1) }
            : t
        )
      );
      if (selectedTask?.id === taskId) {
        setSelectedTask((prev) =>
          prev ? { ...prev, spotsFilled: Math.min(prev.totalCapacity, prev.spotsFilled + 1) } : null
        );
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      localStorage.removeItem('relieflink_user_profile');
      localStorage.removeItem('relieflink_user');
    } catch {
      // ignore
    }
    setCurrentUser(null);
  };

  const handleLoginSuccess = (profile: UserIdentityProfile) => {
    try {
      localStorage.setItem('relieflink_user_profile', JSON.stringify(profile));
      localStorage.setItem('relieflink_user', profile.email);
    } catch {
      // ignore
    }
    setCurrentUser(profile);
  };

  // GPS Simulation / Location Detection
  const handleDetectLocation = () => {
    setGpsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            setGpsDetecting(false);
            setSelectedLocationId('vijayawada');
          }, 450);
        },
        () => {
          setTimeout(() => {
            setGpsDetecting(false);
            setSelectedLocationId('vijayawada');
          }, 450);
        }
      );
    } else {
      setTimeout(() => {
        setGpsDetecting(false);
        setSelectedLocationId('vijayawada');
      }, 450);
    }
  };

  // If not logged in, display the login verification page
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F4F5F6] text-[#0B0F19] flex flex-col font-sans selection:bg-[#0052CC] selection:text-white">
      {/* 1. DISASTER STATUS COMMAND STRIP */}
      {currentLocation.hasCalamity ? (
        <aside
          aria-label="Disaster simulation announcement"
          className="bg-[#B45309] text-white px-4 py-2 font-mono text-xs tracking-wide flex items-center justify-between gap-3 border-b border-[#92400E]"
        >
          <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-black uppercase tracking-wider bg-black/20 px-2 py-0.5">
                ACTIVE CALAMITY DISPATCH
              </span>
              <span className="font-bold">
                {(currentLocation.calamityType || 'Emergency').toUpperCase()} — {currentLocation.cityName.toUpperCase()}
              </span>
            </div>
            <div className="text-[11px] font-medium text-amber-100 hidden sm:block">
              {currentLocation.weatherSummary}
            </div>
          </div>
        </aside>
      ) : (
        <aside
          aria-label="Normal weather status"
          className="bg-[#064E3B] text-white px-4 py-2 font-mono text-xs tracking-wide flex items-center justify-between gap-3 border-b border-[#043327]"
        >
          <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-black uppercase tracking-wider bg-black/20 px-2 py-0.5">
                SECTOR NOMINAL
              </span>
              <span className="font-bold">
                NO CALAMITY DETECTED — {currentLocation.cityName.toUpperCase()}
              </span>
            </div>
            <div className="text-[11px] font-medium text-emerald-100 hidden sm:block">
              {currentLocation.weatherSummary}
            </div>
          </div>
        </aside>
      )}

      {/* 2. TOP BAR CONTRACT */}
      <header className="bg-white border-b-2 border-[#0B0F19] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0B0F19] text-white flex items-center justify-center font-black text-sm">
              RL
            </div>
            <div>
              <a href="/" className="text-xl font-black tracking-tight text-[#0B0F19] whitespace-nowrap block leading-none">
                ReliefLink
              </a>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mt-1">
                Public Safety Dispatch // {currentLocation.cityName}
              </span>
            </div>
          </div>

          {/* Zone 2: Sector Switcher & GPS Affordance */}
          <div className="flex items-center gap-2 bg-[#ECEEF1] p-1 border border-slate-300">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-600 px-2 hidden sm:inline">
              Sector:
            </span>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              aria-label="Select user location"
              className="px-2 py-1 bg-white border border-slate-300 text-xs font-mono font-bold text-[#0B0F19] focus:outline-none focus:border-[#0052CC]"
            >
              <optgroup label="Active Calamity Theaters">
                <option value="vijayawada">Vijayawada, AP (Severe Flood)</option>
                <option value="wayanad">Wayanad, Kerala (Landslide Slip)</option>
                <option value="chennai">Chennai, TN (Cyclone Surge)</option>
              </optgroup>
              <optgroup label="Standby Sectors (No Calamity)">
                <option value="hyderabad">Hyderabad, Telangana (Nominal)</option>
                <option value="bengaluru">Bengaluru, Karnataka (Nominal)</option>
                <option value="visakhapatnam">Visakhapatnam, AP (Nominal)</option>
                <option value="mumbai">Mumbai, Maharashtra (Nominal)</option>
              </optgroup>
            </select>

            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={gpsDetecting}
              className="px-2 py-1 bg-white hover:bg-slate-100 text-[#0B0F19] border border-slate-300 transition-colors text-xs font-mono flex items-center gap-1 cursor-pointer"
              title="Detect current location via GPS"
            >
              <Navigation className={`w-3.5 h-3.5 text-[#0052CC] ${gpsDetecting ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline font-bold">GPS</span>
            </button>
          </div>

          {/* Zone 3: Authenticated Identity Profile with OIDC verified credentials */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2.5 bg-[#F8F9FA] border border-slate-300 px-3 py-1.5 font-mono">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-6 h-6 object-cover border border-slate-400"
                />
              ) : (
                <div className="w-6 h-6 bg-[#0B0F19] text-white flex items-center justify-center font-bold text-[10px]">
                  {currentUser.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : 'CO'}
                </div>
              )}
              <div className="hidden lg:block text-left text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#0B0F19] block truncate max-w-[130px]" title={currentUser.email}>
                    {currentUser.displayName || currentUser.email}
                  </span>
                  {currentUser.emailVerified && (
                    <span className="text-[9px] font-bold text-[#064E3B] bg-[#ECFDF5] px-1 py-0.2 border border-[#064E3B]/30">
                      VERIFIED
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 block truncate max-w-[160px]" title={`Firestore Primary Key: ${currentUser.sub}`}>
                  sub: {currentUser.sub.length > 12 ? `${currentUser.sub.slice(0, 10)}…` : currentUser.sub}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1 text-slate-400 hover:text-[#B45309] transition-colors cursor-pointer"
                title="Sign out from Firebase"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSafetyGuide(true)}
              className="p-2 bg-white hover:bg-[#ECEEF1] border border-slate-300 text-xs text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              title="System safety directives"
            >
              <HelpCircle className="w-4 h-4 text-[#0052CC]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* IF NO CALAMITY DETECTED */}
        {!currentLocation.hasCalamity ? (
          <NoCalamityView
            location={currentLocation}
            onSwitchLocation={(locId) => setSelectedLocationId(locId)}
          />
        ) : (
          /* IF CALAMITY DETECTED: 2-Column Responsive Incident Dispatch System */
          <>
            {/* Tactical Incident Overview Callout */}
            <div className="bg-white border-2 border-[#0B0F19] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-white bg-[#B45309] px-2 py-0.5">
                    {currentLocation.calamitySeverity} Crisis
                  </span>
                  <h2 className="font-black text-[#0B0F19] text-base sm:text-lg tracking-tight">
                    {currentLocation.calamityType} Operation // {currentLocation.cityName}
                  </h2>
                </div>
                <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                  {currentLocation.calamityDescription}
                </p>
              </div>

              <div className="shrink-0 font-mono text-xs">
                <span className="font-bold text-[#0B0F19] bg-[#ECEEF1] px-3 py-1.5 border border-slate-300">
                  {tasks.length} Verified Shifts Active
                </span>
              </div>
            </div>

            {/* Asymmetrical 2-Column Dispatch Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Volunteer Preferences Controller (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <VolunteerPreferencesForm
                  profile={profile}
                  onChangeProfile={handleProfileChange}
                  onFindMatches={handleFindMatches}
                  isSearching={isSearching}
                  matchCount={tasks.length}
                  sectors={currentLocation.sectors}
                  cityName={currentLocation.cityName}
                />

                {/* Claimed Shifts Manifest */}
                {registeredTaskIds.length > 0 && (
                  <div className="bg-white border-2 border-[#064E3B] p-4 text-xs font-mono space-y-3">
                    <div className="flex items-center justify-between text-[#064E3B] font-bold pb-2 border-b border-slate-200">
                      <span className="uppercase text-[11px] tracking-wider">
                        Confirmed Volunteer Manifest
                      </span>
                      <span className="tabular-nums">
                        {registeredTaskIds.length} Claimed
                      </span>
                    </div>
                    <div className="space-y-2">
                      {registeredTaskIds.map((id) => {
                        const t = tasks.find((item) => item.id === id);
                        if (!t) return null;
                        return (
                          <div
                            key={id}
                            onClick={() => setSelectedTask(t)}
                            className="p-2.5 bg-[#F8F9FA] border border-slate-300 flex items-center justify-between cursor-pointer hover:border-[#0B0F19] transition-colors"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="font-bold text-[#0B0F19] block truncate text-xs">
                                {t.title}
                              </span>
                              <span className="text-[10px] text-slate-500 block truncate">
                                {t.neighborhoodName.split('&')[0]} · {t.estimatedHours}h shift
                              </span>
                            </div>
                            <span className="text-[10px] text-[#0052CC] font-bold uppercase shrink-0">
                              Details →
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Offline Tactical Disaster Map (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <OfflineDisasterMap
                  tasks={tasks}
                  matchedResults={matchedResults}
                  profile={profile}
                  selectedTaskId={selectedTask?.id || null}
                  onSelectTask={(task) => setSelectedTask(task)}
                  onSelectNeighborhood={(nid) => handleProfileChange({ startingNeighborhood: nid })}
                  sectors={currentLocation.sectors}
                  cityName={currentLocation.cityName}
                />
              </div>
            </div>

            {/* Step 3: Match Results & Task Lists */}
            <section className="pt-2">
              <TaskMatchingSection
                tasks={tasks}
                matchedResults={matchedResults}
                profile={profile}
                activeView={activeView}
                setActiveView={setActiveView}
                onSelectTask={(task) => setSelectedTask(task)}
                registeredTaskIds={registeredTaskIds}
              />
            </section>
          </>
        )}
      </main>

      {/* Task Detail Modal with Visual Capacity Progress Bar */}
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          matchResult={selectedTaskMatch}
          profile={profile}
          isRegistered={registeredTaskIds.includes(selectedTask.id)}
          onClose={() => setSelectedTask(null)}
          onToggleRegistration={handleToggleRegistration}
        />
      )}

      {/* Safety & System Rules Modal */}
      {showSafetyGuide && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0B0F19]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#0B0F19] w-full max-w-xl p-6 relative text-[#0B0F19]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#0052CC]" />
                <h3 className="text-base font-black uppercase tracking-wider font-mono">
                  ReliefLink Matching &amp; Safety Protocol
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSafetyGuide(false)}
                className="text-slate-400 hover:text-[#0B0F19] p-1 font-mono font-bold"
                aria-label="Close safety guide"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono text-slate-700 leading-relaxed">
              <div>
                <h4 className="font-bold text-[#0052CC] uppercase mb-1">
                  01 / Geographic Sector Calamity Sensing
                </h4>
                <p className="text-slate-600 font-sans text-xs">
                  ReliefLink validates municipal incident telemetry against user coordinates. Peaceful sectors (Hyderabad, Bengaluru, Visakhapatnam) remain on nominal standby, while active calamity zones show verified emergency shifts.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0052CC] uppercase mb-1">
                  02 / Deterministic Skill-Bound Matching
                </h4>
                <p className="text-slate-600 font-sans text-xs">
                  Volunteers are strictly matched to tasks for which they possess certified capabilities. Tasks requiring specialized skills not in the volunteer profile are filtered out of recommendations to prevent unsafe deployments.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0052CC] uppercase mb-1">
                  03 / Risk &amp; Urgency Prioritization
                </h4>
                <p className="text-slate-600 font-sans text-xs">
                  Critical flood zones (e.g. Singh Nagar, Payakapuram) and levee fortifications receive high urgency tags and immediate dispatch ranking.
                </p>
              </div>

              <div className="p-3 bg-[#FFFBEB] border-l-4 border-[#B45309] text-xs text-[#92400E] font-sans">
                <strong>Emergency Directive:</strong> Fictional demonstration portal. In a real disaster, follow official commands from the National Disaster Management Authority (NDMA) and civil administration.
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setShowSafetyGuide(false)}
                className="px-5 py-2.5 bg-[#0B0F19] text-white font-mono uppercase text-xs font-bold transition-colors"
              >
                Understood &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prominent Prototype Safety Disclaimer Footer */}
      <footer className="border-t-2 border-[#0B0F19] bg-white py-6 px-4 sm:px-6 mt-12 text-xs text-slate-600 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <strong>Prototype Disclaimer:</strong> Fictional demonstration data. Calamity status dynamically adjusts to the user's selected location. In a real emergency, follow official instructions from local disaster management authorities.
          </div>

          <div className="text-center sm:text-right shrink-0 text-slate-500 text-[11px]">
            <span>Sector: {currentLocation.cityName} // User: {currentUser.email}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
