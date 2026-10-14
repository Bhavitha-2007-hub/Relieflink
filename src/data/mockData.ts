import { ReliefTask, NeighborhoodId, NEIGHBORHOODS, Skill, VolunteerProfile, TaskMatchResult, MatchScoreBreakdown } from '../types/relief';

export const INITIAL_TASKS: ReliefTask[] = [
  {
    id: 'vja-1',
    title: 'Food Packets & Water Bottle Packing Hub',
    shortDescription: 'Package 10,000 ready-to-eat pulihora, bread, biscuits, and water pouches for air-drop & boat distribution.',
    detailedDescription: 'Join the mass relief kitchen at Indira Gandhi Municipal Stadium. Shifts involve packing dry food parcels (parboiled rice, biscuits, milk tetra-packs) and sealing 1-liter drinking water bottles into waterproof carry bags for flood-hit families in Singh Nagar.',
    neighborhoodId: 'gandhinagar_central',
    neighborhoodName: 'Gandhinagar & Governorpet (Central Hub)',
    coords: { x: 395, y: 260 },
    estimatedHours: 2,
    requiredSkills: ['sorting_supplies', 'general_help'],
    totalCapacity: 16,
    spotsFilled: 12,
    verificationStatus: 'Verified by VMC Relief Cell & Civil Supplies',
    coordinatorName: 'S. Ramakrishna (VMC Deputy Commissioner)',
    coordinatorBadge: 'VMC-RELIEF-4019',
    contactChannel: 'Stadium Gate 2 Dispatch Desk • Helpline 1077',
    safetyNote: 'Dry indoor stadium concourse. Clean, secure, and fully electrified. Work gloves provided.',
    safetyLevel: 'green_safe',
    urgencyLevel: 'high',
    requiredGear: ['Clean cotton clothes', 'Closed-toe footwear', 'Hairnet & gloves (provided)'],
    safeRouteInfo: 'MG Road (Bandar Road) is 100% dry and open. Stadium parking gate is operational.',
    wheelchairAccessible: true,
  },
  {
    id: 'vja-2',
    title: 'Mega-Kitchen Sambar & Khichdi Community Cooking',
    shortDescription: 'Prepare hot nutritious meals in giant cauldrons for stranded citizens across low-lying wards.',
    detailedDescription: 'The central centralized community kitchen at Siddhartha College grounds is cooking continuous batches of khichdi and hot sambar rice. Volunteers help chop vegetables, stir industrial steam cauldrons, and ladle portions into thermal distribution boxes.',
    neighborhoodId: 'gandhinagar_central',
    neighborhoodName: 'Gandhinagar & Governorpet (Central Hub)',
    coords: { x: 440, y: 280 },
    estimatedHours: 4,
    requiredSkills: ['cooking', 'general_help'],
    totalCapacity: 10,
    spotsFilled: 8,
    verificationStatus: 'Verified by District Disaster Management Authority (DDMA)',
    coordinatorName: 'Lakshmi Narayana (Community Kitchen In-Charge)',
    coordinatorBadge: 'DDMA-KITCHEN-881',
    contactChannel: 'Siddhartha Grounds Tent A',
    safetyNote: 'Elevated dry playground campus. Non-slip boots recommended due to wash areas.',
    safetyLevel: 'green_safe',
    urgencyLevel: 'high',
    requiredGear: ['Kitchen apron (provided)', 'Sturdy non-slip footwear', 'Waterproof wristband'],
    safeRouteInfo: 'Accessible via Eluru Road and Old Bus Stand overpass without water logging.',
    wheelchairAccessible: true,
  },
  {
    id: 'vja-3',
    title: 'Singh Nagar Flyover Boat Drop Staging',
    shortDescription: 'Load dry ration crates and life jackets onto NDRF/SDRF rescue boats from the dry flyover incline.',
    detailedDescription: 'The Singh Nagar flyover crest remains the primary dry staging platform above the flooded colony streets. Volunteers form a chain on the high flyover road to unload supply trucks and transfer meal boxes to inflatable rescue boats.',
    neighborhoodId: 'singh_nagar',
    neighborhoodName: 'Ajit Singh Nagar & Payakapuram',
    coords: { x: 490, y: 165 },
    estimatedHours: 2,
    requiredSkills: ['general_help', 'sorting_supplies'],
    totalCapacity: 12,
    spotsFilled: 9,
    verificationStatus: 'Verified by NDRF 10th Battalion & State Police',
    coordinatorName: 'Inspector K. Venkatesh (SDRF On-Site Lead)',
    coordinatorBadge: 'SDRF-OPS-1102',
    contactChannel: 'Flyover North Abutment Command Post',
    safetyNote: 'Work takes place strictly on the dry elevated flyover deck. Never step down into floodwaters without rescue lifejacket.',
    safetyLevel: 'yellow_caution',
    urgencyLevel: 'high',
    requiredGear: ['High-visibility safety vest (provided)', 'Grip work boots', 'Life jacket (provided on-site)'],
    safeRouteInfo: 'Approach via BRTS Road to Flyover south ramp. Water is 4 to 6 ft deep beneath the flyover.',
    wheelchairAccessible: false,
  },
  {
    id: 'vja-4',
    title: 'Medical Triage, ORS & Water-Purification Tab Distribution',
    shortDescription: 'Assist medical officers with patient registration, handing out ORS sachets and chlorine water-purification kits.',
    detailedDescription: 'The emergency medical camp at Government General Hospital (GGH) Old Block is treating evacuees for dehydration, minor cuts, and waterborne infection prevention. Volunteers register patients, distribute ORS and chlorine tablets, and guide elderly citizens.',
    neighborhoodId: 'gandhinagar_central',
    neighborhoodName: 'Gandhinagar & Governorpet (Central Hub)',
    coords: { x: 370, y: 240 },
    estimatedHours: 2,
    requiredSkills: ['first_aid'],
    totalCapacity: 6,
    spotsFilled: 4,
    verificationStatus: 'Verified by Andhra Pradesh Medical Services & GGH',
    coordinatorName: 'Dr. Ch. Anusha (Lead Medical Officer)',
    coordinatorBadge: 'AP-MED-5021',
    contactChannel: 'GGH Emergency Annex Desk #3',
    safetyNote: 'Sterile hospital courtyard marquee. Gloves, face masks, and hand sanitizer stations provided.',
    safetyLevel: 'green_safe',
    urgencyLevel: 'high',
    requiredGear: ['Medical or paramedic ID', 'N95 Mask (provided)', 'Comfortable shoes'],
    safeRouteInfo: 'Main hospital road completely unflooded. Direct entry through Gate 1.',
    wheelchairAccessible: true,
  },
  {
    id: 'vja-5',
    title: 'Budameru Embankment Sandbag Reinforcement',
    shortDescription: 'Fill and stack geotextile sandbags along the bypass embankment to prevent further overflow.',
    detailedDescription: 'Civil engineering teams along the Bhavanipuram-Gollapudi bypass need volunteer muscle to fill sandbags and fortify earthen bunds to redirect backflow away from residential colonies and back toward Krishna river channels.',
    neighborhoodId: 'bhavanipuram',
    neighborhoodName: 'Bhavanipuram & Gollapudi Bypass',
    coords: { x: 240, y: 340 },
    estimatedHours: 2,
    requiredSkills: ['general_help'],
    totalCapacity: 14,
    spotsFilled: 11,
    verificationStatus: 'Verified by Irrigation Department & Municipal Engineers',
    coordinatorName: 'Er. P. Madhusudan (Executive Engineer, Irrigation)',
    coordinatorBadge: 'IRR-AP-7734',
    contactChannel: 'Gollapudi Bypass Barrier Checkpoint',
    safetyNote: 'Dry asphalt roadway work only. Heavy lifting required. Do not approach water edge without spotter.',
    safetyLevel: 'yellow_caution',
    urgencyLevel: 'high',
    requiredGear: ['Heavy-duty work boots', 'Work gloves (provided)', 'High-vis jacket (provided)'],
    safeRouteInfo: 'NH65 Bypass from Ibrahimpatnam direction is open for authorized relief vehicles.',
    wheelchairAccessible: false,
  },
  {
    id: 'vja-6',
    title: 'High-Clearance Water Tanker & Tractor Supply Escort',
    shortDescription: 'Guide tractor-trailers carrying 500-liter potable water tanks through flooded secondary roads.',
    detailedDescription: 'Logistics volunteers with tractors or heavy SUVs accompany potable water tanks along cleared routes from Bhavanipuram filling station to peripheral colonies where municipal pipelines have ruptured.',
    neighborhoodId: 'bhavanipuram',
    neighborhoodName: 'Bhavanipuram & Gollapudi Bypass',
    coords: { x: 200, y: 370 },
    estimatedHours: 4,
    requiredSkills: ['driving'],
    totalCapacity: 6,
    spotsFilled: 4,
    verificationStatus: 'Verified by District Transport Commissioner Office',
    coordinatorName: 'M. Sudhakar (Relief Fleet Marshal)',
    coordinatorBadge: 'RTO-RELIEF-209',
    contactChannel: 'Bhavanipuram Depot Gate 1',
    safetyNote: 'Only drivers with certified high-ground tractor or 4x4 vehicles. Strictly follow pre-surveyed green routes.',
    safetyLevel: 'yellow_caution',
    urgencyLevel: 'medium',
    requiredGear: ['Valid heavy / commercial driving license', 'High-clearance vehicle', 'Offline route maps'],
    safeRouteInfo: 'Pre-inspected routes shared with depth markers. Maximum water wade limit 1.5 ft.',
    wheelchairAccessible: false,
  },
  {
    id: 'vja-7',
    title: 'Telugu & English Distress Call Helpline Intake',
    shortDescription: 'Answer 24/7 flood control room calls, record family location GPS/landmarks, and relay rescue requests.',
    detailedDescription: 'The Vijayawada District Collectorate control room operates 20 call-desk terminals. Volunteers take incoming calls from trapped families in Singh Nagar, Payakapuram, and Nunna, note landmarks, terrace locations, and medical emergencies.',
    neighborhoodId: 'gandhinagar_central',
    neighborhoodName: 'Gandhinagar & Governorpet (Central Hub)',
    coords: { x: 380, y: 295 },
    estimatedHours: 1,
    requiredSkills: ['translation', 'general_help'],
    totalCapacity: 8,
    spotsFilled: 6,
    verificationStatus: 'Verified by District Collectorate Emergency Control Room',
    coordinatorName: 'K. Sunitha (Tahsildar / Control Room Officer)',
    coordinatorBadge: 'REV-CR-104',
    contactChannel: 'Collectorate Control Desk 4 • Direct Line 0866-2574454',
    safetyNote: 'Air-conditioned collectorate conference room with backup generator power. Very safe and quiet.',
    safetyLevel: 'green_safe',
    urgencyLevel: 'medium',
    requiredGear: ['Government Photo ID (Aadhaar or Voter ID)', 'Pen & notepad'],
    safeRouteInfo: 'Collectorate compound fully accessible via Bandar Road.',
    wheelchairAccessible: true,
  },
  {
    id: 'vja-8',
    title: 'Emergency Dry Blankets & Dhotis/Sarees Sorting',
    shortDescription: 'Unpack dry clothing bales, segregate by sizes, and prepare waterproof family survival packs.',
    detailedDescription: 'Thousands of donation parcels are arriving from across Andhra Pradesh and Telangana at the Swarajya Maidan grounds. Volunteers inspect incoming clothing, sort children wear, dry blankets, and towels into sealed packs.',
    neighborhoodId: 'gandhinagar_central',
    neighborhoodName: 'Gandhinagar & Governorpet (Central Hub)',
    coords: { x: 410, y: 225 },
    estimatedHours: 1,
    requiredSkills: ['sorting_supplies'],
    totalCapacity: 12,
    spotsFilled: 7,
    verificationStatus: 'Verified by Andhra Pradesh Red Cross Society',
    coordinatorName: 'B. Subba Rao (Red Cross District Secretary)',
    coordinatorBadge: 'IRCS-AP-9901',
    contactChannel: 'Swarajya Maidan Shed 3',
    safetyNote: 'Large covered concrete exhibition shed. Dry and well-lit with overhead industrial fans.',
    safetyLevel: 'green_safe',
    urgencyLevel: 'low',
    requiredGear: ['Comfortable work attire', 'Face mask (dust protection)'],
    safeRouteInfo: 'Direct access from Mahatma Gandhi Road.',
    wheelchairAccessible: true,
  },
];

const VJA_DISTANCE_MATRIX: Record<NeighborhoodId, Record<NeighborhoodId, number>> = {
  singh_nagar: {
    singh_nagar: 2.1,
    gandhinagar_central: 6.2,
    bhavanipuram: 11.5,
  },
  gandhinagar_central: {
    singh_nagar: 6.2,
    gandhinagar_central: 1.8,
    bhavanipuram: 5.7,
  },
  bhavanipuram: {
    singh_nagar: 11.5,
    gandhinagar_central: 5.7,
    bhavanipuram: 2.4,
  },
};

export function calculateDistanceKm(
  from: NeighborhoodId,
  to: NeighborhoodId,
  taskCoords?: { x: number; y: number }
): number {
  const base = VJA_DISTANCE_MATRIX[from][to];
  if (!taskCoords) return base;
  const jitter = ((taskCoords.x * 5 + taskCoords.y * 11) % 17) / 10 - 0.8;
  return Math.max(1.1, Math.round((base + jitter) * 10) / 10);
}

export function calculateTaskMatch(
  task: ReliefTask,
  profile: VolunteerProfile
): TaskMatchResult {
  const distanceKm = calculateDistanceKm(profile.startingNeighborhood, task.neighborhoodId, task.coords);
  const isWithinRadius = distanceKm <= profile.travelRadiusKm;
  const hasEnoughTime = task.estimatedHours <= profile.availableHours;
  const spotsOpen = task.totalCapacity - task.spotsFilled;
  const hasSpotsOpen = spotsOpen > 0;

  // 1. Skill Fit (up to 35 points) - MUST PRECISELY ALIGN WITH VOLUNTEER SKILLS
  const matchedSkills = task.requiredSkills.filter((s) => profile.skills.includes(s));
  const hasSkillMatch = matchedSkills.length > 0;

  let skillScore = 0;
  if (hasSkillMatch) {
    const ratio = matchedSkills.length / task.requiredSkills.length;
    // Base 25 points for having any required skill + up to 10 points for full coverage
    skillScore = Math.round(25 + ratio * 10);
  } else {
    // If volunteer lacks ALL required skills for this task, 0 points
    skillScore = 0;
  }

  // 2. Time Fit (up to 20 points)
  let timeScore = 0;
  if (hasEnoughTime) {
    if (task.estimatedHours === profile.availableHours) {
      timeScore = 20;
    } else {
      timeScore = 17;
    }
  } else {
    timeScore = 0;
  }

  // 3. Proximity Fit (up to 20 points)
  let distanceScore = 0;
  if (isWithinRadius) {
    const proximityRatio = Math.max(0, 1 - distanceKm / (profile.travelRadiusKm * 1.25));
    distanceScore = Math.round(10 + proximityRatio * 10);
  } else {
    distanceScore = 0;
  }

  // 4. Spot Availability (up to 10 points)
  let spotScore = 0;
  if (hasSpotsOpen) {
    spotScore = spotsOpen >= 2 ? 10 : 7;
  } else {
    spotScore = 0;
  }

  // 5. Urgency Score (up to 10 points) - Highlights high urgency in flooded zones like Singh Nagar
  let urgencyScore = 4;
  if (task.urgencyLevel === 'high') {
    urgencyScore = 10;
  } else if (task.urgencyLevel === 'medium') {
    urgencyScore = 7;
  }

  // 6. Safety Eligibility (up to 5 points)
  let safetyScore = 5;
  if (task.safetyLevel === 'yellow_caution') {
    safetyScore = 4;
  } else if (task.safetyLevel === 'orange_controlled') {
    safetyScore = 2;
  }

  // Total matching calculation
  let total = skillScore + timeScore + distanceScore + spotScore + urgencyScore + safetyScore;

  // Strict enforcement: If NO skill match, cap total score so it does not rank as recommended
  if (!hasSkillMatch) {
    total = Math.min(25, Math.round(total * 0.25));
  } else {
    total = Math.min(100, total);
  }

  const breakdown: MatchScoreBreakdown = {
    skillScore,
    timeScore,
    distanceScore,
    spotScore,
    safetyScore,
    urgencyScore,
    total,
  };

  const matchedSkillsLabel =
    matchedSkills.length > 0
      ? matchedSkills.map((s) => s.replace(/_/g, ' ')).join(' & ')
      : '';

  let explanation = '';
  if (hasSkillMatch) {
    explanation = `Precise skill match: Requires ${matchedSkillsLabel} which you have. ${
      task.urgencyLevel === 'high' ? 'High critical urgency' : 'Operational need'
    } in ${task.neighborhoodName.split('&')[0].trim()} (${distanceKm} km away, ${task.estimatedHours}h shift).`;
  } else {
    const needed = task.requiredSkills.map((s) => s.replace(/_/g, ' ')).join(', ');
    explanation = `Skills mismatch: Requires ${needed}, which is not in your currently selected volunteer skills profile.`;
  }

  return {
    task,
    score: total,
    distanceKm,
    isWithinRadius,
    hasEnoughTime,
    hasSkillMatch,
    matchedSkills,
    scoreBreakdown: breakdown,
    explanation,
    isAiExplanation: false,
  };
}
