/* ==========================================================================
   MEMBERSHIP DATA — single source of truth for membership pricing and
   included benefits. Replace demo pricing here when real commercial pricing
   is approved; membership.html does not need to change.

   `benefits` on each plan is the single source of truth for what that plan
   includes. The comparison table below is generated FROM these benefits
   (see membershipComparison at the bottom of this file), so the pricing
   cards and the comparison table can never contradict each other — update
   a benefit here and both places update together.
   ========================================================================== */

const membershipPlans = [
  {
    slug: "starter",
    name: "Starter",
    price: "₦25,000",
    period: "per month",
    duration: "Monthly",
    description: "A straightforward starting point for regular gym training.",
    popular: false,
    benefits: {
      gymAccess: true,
      lockerFacilities: true,
      groupClasses: false,
      assessment: "Basic",
      personalTraining: false,
      prioritySupport: false,
    },
    features: [
      "Gym access",
      "Locker facilities",
      "Basic fitness assessment",
      "Community access",
    ],
    cta: "GET STARTED",
  },
  {
    slug: "pro",
    name: "Pro",
    price: "₦40,000",
    period: "per month",
    duration: "Monthly",
    description: "More structure for members who want regular coached sessions.",
    popular: true,
    benefits: {
      gymAccess: true,
      lockerFacilities: true,
      groupClasses: true,
      assessment: "Full",
      personalTraining: false,
      prioritySupport: false,
    },
    features: [
      "Everything in Starter",
      "Group classes",
      "Full fitness assessment",
      "Training consultation",
    ],
    cta: "GET STARTED",
  },
  {
    slug: "elite",
    name: "Elite",
    price: "₦65,000",
    period: "per month",
    duration: "Monthly",
    description: "For members who want added coaching and one-on-one support.",
    popular: false,
    benefits: {
      gymAccess: true,
      lockerFacilities: true,
      groupClasses: true,
      assessment: "Advanced",
      personalTraining: true,
      prioritySupport: true,
    },
    features: [
      "Everything in Pro",
      "Personal training sessions",
      "Priority support",
      "Advanced fitness assessment",
    ],
    cta: "GET STARTED",
  },
];

// Ordered list of benefits shown in the comparison table. Each row is read
// straight off membershipPlans[*].benefits, so the table always agrees with
// what the pricing cards above claim.
const membershipBenefitRows = [
  { key: "gymAccess", label: "Gym access" },
  { key: "lockerFacilities", label: "Locker facilities" },
  { key: "groupClasses", label: "Group classes" },
  { key: "assessment", label: "Fitness assessment" },
  { key: "personalTraining", label: "Personal training sessions" },
  { key: "prioritySupport", label: "Priority support" },
];

const membershipComparison = membershipBenefitRows.map(({ key, label }) => ({
  feature: label,
  starter: membershipPlans.find((plan) => plan.slug === "starter").benefits[key],
  pro: membershipPlans.find((plan) => plan.slug === "pro").benefits[key],
  elite: membershipPlans.find((plan) => plan.slug === "elite").benefits[key],
}));

// Additional options — services members can add on top of a plan.
// These are NOT membership tiers; the free first visit lives only in the
// dedicated "Try IronForge First" trial section on membership.html.
const membershipAddOns = [
  {
    name: "Personal Training",
    price: "₦15,000",
    period: "per session",
    description: "Add one-on-one coaching to any membership plan.",
  },
  {
    name: "Day Pass",
    price: "₦5,000",
    period: "per day",
    description: "Try the gym floor and one class for a single day.",
  },
];