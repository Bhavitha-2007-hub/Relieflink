export type Skill =
  | 'first_aid'
  | 'driving'
  | 'translation'
  | 'sorting_supplies'
  | 'cooking'
  | 'general_help';

export interface SkillInfo {
  id: Skill;
  label: string;
  description: string;
  iconName: string;
}

export const AVAILABLE_SKILLS: SkillInfo[] = [
  {
    id: 'first_aid',
    label: 'First Aid & Health',
    description: 'Medical camp intake, ORS distribution, basic wound dressing',
    iconName: 'HeartPulse',
  },
  {
    id: 'driving',
    label: 'Driving & Transport',
    description: 'Tractor, high-clearance SUV, or relief van dry-route logistics',
    iconName: 'Truck',
  },
  {
    id: 'translation',
    label: 'Helpline & Languages',
    description: 'Regional language resident helpline and intake forms',
    iconName: 'Languages',
  },
  {
    id: 'sorting_supplies',
    label: 'Sorting & Packaging',
    description: 'Packaging dry food packets, milk cartons, water bottles, and blankets',
    iconName: 'Boxes',
  },
  {
    id: 'cooking',
    label: 'Community Cooking',
    description: 'Large-scale meal preparation at emergency mega-kitchens',
    iconName: 'UtensilsCrossed',
  },
  {
    id: 'general_help',
    label: 'General Coordination',
    description: 'Sandbagging, queue management, crowd direction, and unloading trucks',
    iconName: 'HelpingHand',
  },
];

export type UrgencyLevel = 'high' | 'medium' | 'low';
export type NeighborhoodId = string;

export interface NeighborhoodInfo {
  id: string;
  name: string;
  elevation: string;
  floodStatus: string;
  floodStatusColor: 'blue' | 'emerald' | 'amber';
  description: string;
  centerCoords: { x: number; y: number };
}

export const NEIGHBORHOODS: Record<string, NeighborhoodInfo> = {
  singh_nagar: {
    id: 'singh_nagar',
    name: 'Ajit Singh Nagar & Payakapuram',
    elevation: 'Low-Lying Basin (Budameru Inundation)',
    floodStatus: 'Submerged / High Flood Alert',
    floodStatusColor: 'blue',
    description: 'Budameru rivulet breach zone. Operations centered at elevated flyover approach and relief boat launching points.',
    centerCoords: { x: 500, y: 150 },
  },
  gandhinagar_central: {
    id: 'gandhinagar_central',
    name: 'Gandhinagar & Governorpet (Central Hub)',
    elevation: 'High Ground Plateau (Unflooded City Core)',
    floodStatus: 'Safe High Ground',
    floodStatusColor: 'emerald',
    description: 'Command center hub near BRTS Road & Indira Gandhi Stadium with central mega-kitchens and regional medical depots.',
    centerCoords: { x: 390, y: 270 },
  },
  bhavanipuram: {
    id: 'bhavanipuram',
    name: 'Bhavanipuram & Gollapudi Bypass',
    elevation: 'Krishna Riverbank & NH65 Junction',
    floodStatus: 'Controlled Embankment Zone',
    floodStatusColor: 'amber',
    description: 'Western corridor near Prakasam Barrage upstream. Active sandbagging along bypass road and safe supply transit lanes.',
    centerCoords: { x: 220, y: 350 },
  },
};

export interface ReliefTask {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  neighborhoodId: string;
  neighborhoodName: string;
  coords: { x: number; y: number };
  estimatedHours: number;
  requiredSkills: Skill[];
  totalCapacity: number;
  spotsFilled: number;
  verificationStatus: string;
  coordinatorName: string;
  coordinatorBadge: string;
  contactChannel: string;
  safetyNote: string;
  safetyLevel: 'green_safe' | 'yellow_caution' | 'orange_controlled';
  urgencyLevel: UrgencyLevel;
  requiredGear: string[];
  safeRouteInfo: string;
  wheelchairAccessible: boolean;
}

export interface VolunteerProfile {
  availableHours: number;
  skills: Skill[];
  travelRadiusKm: number;
  startingNeighborhood: string;
}

export interface MatchScoreBreakdown {
  skillScore: number;
  timeScore: number;
  distanceScore: number;
  spotScore: number;
  safetyScore: number;
  urgencyScore: number;
  total: number;
}

export interface TaskMatchResult {
  task: ReliefTask;
  score: number;
  distanceKm: number;
  isWithinRadius: boolean;
  hasEnoughTime: boolean;
  hasSkillMatch: boolean;
  matchedSkills: Skill[];
  scoreBreakdown: MatchScoreBreakdown;
  explanation: string;
  isAiExplanation: boolean;
}

export interface LocationRegion {
  id: string;
  cityName: string;
  stateName: string;
  hasCalamity: boolean;
  calamityType?: string;
  calamitySeverity?: 'Critical' | 'Severe' | 'Moderate' | 'None';
  calamityDescription?: string;
  weatherSummary: string;
  sectors: Record<string, NeighborhoodInfo>;
  tasks: ReliefTask[];
  distanceMatrix: Record<string, Record<string, number>>;
}
