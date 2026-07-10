export type CleanerStatus = "active" | "paused" | "pending_review";
export type CleanerPlan = "starter" | "pro" | "featured";
export type CleanerSource = "seed" | "contractor_signup";
export type ServiceKey =
  | "standard_cleaning"
  | "two_story"
  | "heavy_debris"
  | "downspouts"
  | "gutter_guards"
  | "recurring_maintenance"
  | "emergency_overflow";

export type RatingBreakdown = {
  reviewAverage: number;
  reviewCount: number;
  responseScore: number;
  qualityScore: number;
  reliabilityScore: number;
  verificationScore: number;
};

export type CleanerReview = {
  author: string;
  city: string;
  rating: number;
  date: string;
  text: string;
};

export type CleanerProfile = {
  id: string;
  source: CleanerSource;
  status: CleanerStatus;
  plan: CleanerPlan;
  companyName: string;
  slug: string;
  headline: string;
  description: string;
  profileSummary: string;
  reviewThemes: string[];
  featuredReviews: CleanerReview[];
  contactName: string;
  phone: string;
  email: string;
  website?: string;
  licenseLabel?: string;
  insuranceVerified: boolean;
  photoReports: boolean;
  yearsInBusiness: number;
  responseTimeMinutes: number;
  minimumJobPrice: number;
  serviceAreas: string[];
  zipCodes: string[];
  counties: string[];
  services: ServiceKey[];
  propertyTypes: string[];
  rating: RatingBreakdown;
  badges: string[];
  lastVerifiedAt: string;
};

export type CleanerSearchResult = {
  cleaner: CleanerProfile;
  matchScore: number;
  ratingScore: number;
  overallScore: number;
  matchReasons: string[];
};

export const serviceLabels: Record<ServiceKey, string> = {
  standard_cleaning: "Standard cleaning",
  two_story: "Two-story access",
  heavy_debris: "Heavy debris",
  downspouts: "Downspouts",
  gutter_guards: "Gutter guards",
  recurring_maintenance: "Recurring maintenance",
  emergency_overflow: "Overflow help",
};

export const partnerCleaners: CleanerProfile[] = [
  {
    id: "rainready-pasadena",
    source: "seed",
    status: "active",
    plan: "featured",
    companyName: "RainReady Gutter Cleaning",
    slug: "rainready-gutter-cleaning-pasadena",
    headline: "Top match for Pasadena, Altadena, and foothill homes with mature trees.",
    description:
      "Residential gutter cleaner focused on seasonal debris removal, downspout checks, and photo-documented cleanups.",
    profileSummary:
      "RainReady is the kind of company that makes sense in Pasadena because the problem here is not mysterious. There are older homes, mature trees, and gutters that can go from fine to packed with leaves faster than people expect. Reviews tend to mention the same simple things: they show up, they explain what they found, and they send photos when the job is done. That sounds basic, but basic is exactly what most homeowners are trying to buy when rain is coming.",
    reviewThemes: ["Clear before-and-after photos", "Good fit for tree-heavy homes", "Fast scheduling before storms"],
    featuredReviews: [
      {
        author: "M. Alvarez",
        city: "Pasadena",
        rating: 5,
        date: "2026-05-22",
        text: "They sent photos of the gutters and downspouts after the cleaning, which made it easy to see what was actually done.",
      },
      {
        author: "D. Kim",
        city: "Altadena",
        rating: 5,
        date: "2026-04-18",
        text: "Our house gets a lot of leaf drop. They cleared everything, bagged the debris, and left the side yard clean.",
      },
    ],
    contactName: "Partner Desk",
    phone: "+13237095357",
    email: "clearflowgutterspro@gmail.com",
    insuranceVerified: true,
    photoReports: true,
    yearsInBusiness: 7,
    responseTimeMinutes: 90,
    minimumJobPrice: 175,
    serviceAreas: ["Pasadena", "Altadena", "Sierra Madre", "Arcadia", "San Marino"],
    zipCodes: ["91001", "91006", "91007", "91024", "91101", "91103", "91104", "91105", "91106", "91107", "91108"],
    counties: ["Los Angeles County"],
    services: ["standard_cleaning", "two_story", "heavy_debris", "downspouts", "recurring_maintenance"],
    propertyTypes: ["Single-family homes", "Two-story homes", "Hillside homes"],
    rating: {
      reviewAverage: 4.9,
      reviewCount: 86,
      responseScore: 96,
      qualityScore: 94,
      reliabilityScore: 95,
      verificationScore: 98,
    },
    badges: ["Fast response", "Photo reports", "Foothill debris"],
    lastVerifiedAt: "2026-06-15",
  },
  {
    id: "central-la-flow",
    source: "seed",
    status: "active",
    plan: "pro",
    companyName: "Central LA Flow Pros",
    slug: "central-la-flow-pros",
    headline: "Good fit for dense LA neighborhoods, small lots, and quick routine cleanouts.",
    description:
      "Covers central Los Angeles properties with practical scheduling, downspout clearing, and debris haul-away.",
    profileSummary:
      "Central LA Flow Pros is built for the less glamorous part of gutter cleaning: tight driveways, small lots, awkward access, and homes where a big crew would just get in the way. The reviews are not dramatic, which I actually like. People mostly talk about practical things, like getting a response, getting a fair window, and having the gutters cleared without the property turning into a mess. For central LA, that practicality matters.",
    reviewThemes: ["Works well on tight lots", "Straightforward scheduling", "Helpful for overflow calls"],
    featuredReviews: [
      {
        author: "S. Martin",
        city: "Los Angeles",
        rating: 5,
        date: "2026-06-01",
        text: "They were realistic about the access on our side yard and still got the downspouts flowing again.",
      },
      {
        author: "R. Chavez",
        city: "Glendale",
        rating: 4,
        date: "2026-03-29",
        text: "Quick communication and no surprise cleanup afterward. That was the main thing I cared about.",
      },
    ],
    contactName: "Partner Desk",
    phone: "+13237095357",
    email: "clearflowgutterspro@gmail.com",
    insuranceVerified: true,
    photoReports: true,
    yearsInBusiness: 5,
    responseTimeMinutes: 180,
    minimumJobPrice: 195,
    serviceAreas: ["Los Angeles", "Glendale", "Burbank", "Inglewood", "Downey"],
    zipCodes: ["90004", "90012", "90026", "90027", "90032", "90039", "90041", "90241", "90301", "91201", "91501"],
    counties: ["Los Angeles County"],
    services: ["standard_cleaning", "downspouts", "gutter_guards", "emergency_overflow"],
    propertyTypes: ["Single-family homes", "Townhomes", "Duplexes"],
    rating: {
      reviewAverage: 4.8,
      reviewCount: 64,
      responseScore: 91,
      qualityScore: 90,
      reliabilityScore: 92,
      verificationScore: 95,
    },
    badges: ["Central LA", "Overflow help", "Townhomes"],
    lastVerifiedAt: "2026-06-12",
  },
  {
    id: "south-bay-downspout",
    source: "seed",
    status: "active",
    plan: "pro",
    companyName: "South Bay Downspout Co.",
    slug: "south-bay-downspout-co",
    headline: "Strong match for South Bay and coastal homes that need gutters and downspouts cleared.",
    description:
      "Focused on downspout flow, gutter guard handling, and recurring maintenance before rainy weather.",
    profileSummary:
      "South Bay Downspout Co. seems strongest when the job is less about a dramatic mess and more about making sure water has somewhere to go. Reviews mention downspouts a lot, which is a useful signal because gutters can look clean and still fail if the outlets are blocked. Their profile fits homeowners who want maintenance done before the weather makes the decision for them. Not exciting, maybe, but houses usually reward boring preparation.",
    reviewThemes: ["Strong downspout checks", "Good maintenance option", "Works with gutter guards"],
    featuredReviews: [
      {
        author: "J. Peters",
        city: "Long Beach",
        rating: 5,
        date: "2026-05-06",
        text: "They found a downspout blockage we had missed and flushed it before the next rain.",
      },
      {
        author: "A. Nguyen",
        city: "Torrance",
        rating: 4,
        date: "2026-04-11",
        text: "Good option for regular maintenance. They were clear about what they could do with our gutter guards.",
      },
    ],
    contactName: "Partner Desk",
    phone: "+13237095357",
    email: "clearflowgutterspro@gmail.com",
    insuranceVerified: true,
    photoReports: false,
    yearsInBusiness: 6,
    responseTimeMinutes: 240,
    minimumJobPrice: 185,
    serviceAreas: ["Long Beach", "Torrance", "Santa Monica", "South Bay", "Redondo Beach"],
    zipCodes: ["90401", "90403", "90501", "90503", "90712", "90802", "90803", "90807", "90277", "90278"],
    counties: ["Los Angeles County"],
    services: ["standard_cleaning", "downspouts", "gutter_guards", "recurring_maintenance"],
    propertyTypes: ["Single-family homes", "Townhomes", "Small multifamily"],
    rating: {
      reviewAverage: 4.8,
      reviewCount: 52,
      responseScore: 88,
      qualityScore: 91,
      reliabilityScore: 89,
      verificationScore: 93,
    },
    badges: ["Downspout checks", "South Bay", "Maintenance"],
    lastVerifiedAt: "2026-06-10",
  },
  {
    id: "sgv-seasonal-care",
    source: "seed",
    status: "active",
    plan: "starter",
    companyName: "SGV Seasonal Gutter Care",
    slug: "sgv-seasonal-gutter-care",
    headline: "Good fit for recurring cleanings across the San Gabriel Valley.",
    description:
      "Handles standard cleanouts, single-story homes, and debris haul-away across SGV cities.",
    profileSummary:
      "SGV Seasonal Gutter Care is a practical choice for homeowners who do not need a whole production. The pattern in the reviews is pretty clear: standard homes, seasonal debris, routine cleanups, and a crew that handles the unglamorous stuff without making it complicated. There are companies with stronger verification signals, so I would ask a few extra questions before booking. But for a simple seasonal cleaning, this profile has a real place.",
    reviewThemes: ["Good for routine seasonal work", "Debris haul-away", "Simple single-story cleanings"],
    featuredReviews: [
      {
        author: "L. Moreno",
        city: "Monrovia",
        rating: 5,
        date: "2026-03-16",
        text: "They handled a normal seasonal cleaning and hauled away the debris. Nothing fancy, just done right.",
      },
      {
        author: "P. Tran",
        city: "Temple City",
        rating: 4,
        date: "2026-02-21",
        text: "Good communication for a basic one-story job. I would use them again before the rainy season.",
      },
    ],
    contactName: "Partner Desk",
    phone: "+13237095357",
    email: "clearflowgutterspro@gmail.com",
    insuranceVerified: false,
    photoReports: true,
    yearsInBusiness: 4,
    responseTimeMinutes: 360,
    minimumJobPrice: 165,
    serviceAreas: ["Whittier", "West Covina", "Monrovia", "Temple City", "San Gabriel", "Rosemead"],
    zipCodes: ["90601", "90602", "91722", "91723", "91790", "91016", "91780", "91776", "91770"],
    counties: ["Los Angeles County"],
    services: ["standard_cleaning", "heavy_debris", "recurring_maintenance"],
    propertyTypes: ["Single-family homes", "One-story homes"],
    rating: {
      reviewAverage: 4.7,
      reviewCount: 39,
      responseScore: 84,
      qualityScore: 88,
      reliabilityScore: 87,
      verificationScore: 82,
    },
    badges: ["Seasonal plans", "SGV", "Debris haul-away"],
    lastVerifiedAt: "2026-06-05",
  },
  {
    id: "foothill-overflow-response",
    source: "seed",
    status: "active",
    plan: "featured",
    companyName: "Foothill Overflow Response",
    slug: "foothill-overflow-response",
    headline: "Best for overflow issues, second-story access, and storm-prep cleaning.",
    description:
      "Specializes in urgent clogs, taller homes, and pre-rain gutter clearing in foothill-adjacent neighborhoods.",
    profileSummary:
      "Foothill Overflow Response is the profile I would look at when the job feels a little more urgent or a little less straightforward. The reviews point toward taller homes, hillside access, and gutters that are already starting to overflow. That usually means the cleaner has to do more than scoop leaves. They need to understand access, water flow, and timing. This company scores well because the reviews keep returning to those pressure points.",
    reviewThemes: ["Urgent overflow response", "Comfortable with taller access", "Strong storm-prep option"],
    featuredReviews: [
      {
        author: "N. Walker",
        city: "La Canada Flintridge",
        rating: 5,
        date: "2026-06-08",
        text: "We had overflow on a second-story run. They explained the access plan and cleared it before the next storm.",
      },
      {
        author: "E. Foster",
        city: "Glendale",
        rating: 5,
        date: "2026-05-14",
        text: "Good for a hillside property. They were careful with ladders and showed where the blockage had been.",
      },
    ],
    contactName: "Partner Desk",
    phone: "+13237095357",
    email: "clearflowgutterspro@gmail.com",
    insuranceVerified: true,
    photoReports: true,
    yearsInBusiness: 9,
    responseTimeMinutes: 60,
    minimumJobPrice: 225,
    serviceAreas: ["La Canada Flintridge", "Glendale", "Altadena", "Pasadena", "La Crescenta"],
    zipCodes: ["91011", "91020", "91001", "91103", "91104", "91105", "91208", "91214"],
    counties: ["Los Angeles County"],
    services: ["two_story", "heavy_debris", "downspouts", "emergency_overflow"],
    propertyTypes: ["Two-story homes", "Hillside homes", "Large homes"],
    rating: {
      reviewAverage: 4.9,
      reviewCount: 73,
      responseScore: 98,
      qualityScore: 92,
      reliabilityScore: 94,
      verificationScore: 97,
    },
    badges: ["Urgent overflow", "Two-story access", "Storm prep"],
    lastVerifiedAt: "2026-06-18",
  },
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getZipPrefix(zip: string) {
  return zip.replace(/\D/g, "").slice(0, 3);
}

function isActiveListedCleaner(cleaner: CleanerProfile) {
  return cleaner.status === "active";
}

export function getCleanerRatingScore(cleaner: CleanerProfile) {
  const ratingPercent = (cleaner.rating.reviewAverage / 5) * 100;
  const reviewConfidence = Math.min(cleaner.rating.reviewCount / 75, 1) * 100;
  const responseBoost = Math.max(0, 100 - cleaner.responseTimeMinutes / 12);

  return Math.round(
    ratingPercent * 0.28 +
      reviewConfidence * 0.12 +
      cleaner.rating.responseScore * 0.16 +
      cleaner.rating.qualityScore * 0.18 +
      cleaner.rating.reliabilityScore * 0.16 +
      cleaner.rating.verificationScore * 0.08 +
      responseBoost * 0.02,
  );
}

export function getDisplayRating(cleaner: CleanerProfile) {
  return (getCleanerRatingScore(cleaner) / 20).toFixed(1);
}

export function getPartnerCleanerBySlug(slug: string) {
  return partnerCleaners.find((cleaner) => cleaner.slug === slug && isActiveListedCleaner(cleaner)) || null;
}

export function findPartnerCleaners(location: string, service?: ServiceKey): CleanerSearchResult[] {
  const query = normalize(location);
  const zip = location.replace(/\D/g, "");
  const zipPrefix = getZipPrefix(location);
  const requestedService = service || null;

  return partnerCleaners
    .filter(isActiveListedCleaner)
    .map((cleaner) => {
      const normalizedAreas = cleaner.serviceAreas.map(normalize);
      const exactCityMatch = query ? normalizedAreas.includes(query) : false;
      const partialCityMatch = query ? normalizedAreas.some((area) => area.includes(query) || query.includes(area)) : false;
      const exactZipMatch = zip.length === 5 ? cleaner.zipCodes.includes(zip) : false;
      const prefixZipMatch = zipPrefix ? cleaner.zipCodes.some((cleanerZip) => cleanerZip.startsWith(zipPrefix)) : false;
      const serviceMatch = requestedService ? cleaner.services.includes(requestedService) : false;
      const countyMatch = cleaner.counties.some((county) => normalize(county).includes(query));
      const specialtyMatch = query
        ? cleaner.services.some((item) => serviceLabels[item].toLowerCase().includes(query)) ||
          cleaner.badges.some((badge) => normalize(badge).includes(query))
        : false;

      const matchScore =
        Number(exactZipMatch) * 45 +
        Number(exactCityMatch) * 35 +
        Number(prefixZipMatch && !exactZipMatch) * 22 +
        Number(partialCityMatch && !exactCityMatch) * 18 +
        Number(serviceMatch) * 12 +
        Number(countyMatch) * 8 +
        Number(specialtyMatch) * 8 +
        (cleaner.plan === "featured" ? 4 : cleaner.plan === "pro" ? 2 : 0);

      const ratingScore = getCleanerRatingScore(cleaner);
      const overallScore = Math.round(matchScore * 0.68 + ratingScore * 0.32);
      const matchReasons = [
        exactZipMatch ? "Exact ZIP coverage" : "",
        exactCityMatch ? "Exact city match" : "",
        prefixZipMatch && !exactZipMatch ? "Nearby ZIP coverage" : "",
        serviceMatch ? "Matches requested service" : "",
        specialtyMatch ? "Specialty match" : "",
        cleaner.insuranceVerified ? "Insurance verified" : "",
        cleaner.photoReports ? "Photo reports available" : "",
      ].filter(Boolean);

      return {
        cleaner,
        matchScore,
        ratingScore,
        overallScore,
        matchReasons,
      };
    })
    .filter((result) => !query || result.matchScore > 0)
    .sort((a, b) => b.overallScore - a.overallScore || b.cleaner.rating.reviewAverage - a.cleaner.rating.reviewAverage);
}
