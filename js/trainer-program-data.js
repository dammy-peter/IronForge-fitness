/* ==========================================================================
   PROGRAMS DATA — single source of truth for classes/programs, mirroring
   the cards on classes.html. Consumed by trainer-detail.html to show which
   programs each coach leads without duplicating program content.
   ========================================================================== */

const programsData = [
  {
    slug: "strength-training",
    name: "Strength Training",
    category: "Intermediate · 60 min",
    description:
      "Build raw power with progressive barbell and compound-lift programming, coached for safe technique.",
   image: "assets/images/classes/C01.webp",
  },
  {
    slug: "hiit",
    name: "HIIT",
    category: "All levels · 45 min",
    description:
      "High-intensity interval circuits that torch calories and sharpen conditioning fast.",
    image: "assets/images/classes/Co2.webp",
  },
  {
    slug: "boxing",
    name: "Boxing",
    category: "Beginner-friendly · 50 min",
    description:
      "Pad work and technique drills that build speed, footwork and real boxing skill.",
    image: "assets/images/classes/C03.webp",
  },
  {
    slug: "cardio",
    name: "Cardio",
    category: "All levels · 40 min",
    description: "Guided cardio circuits to build stamina and long-term heart health.",
    image: "assets/images/classes/C04.webp",
  },
  {
    slug: "yoga-mobility",
    name: "Yoga & Mobility",
    category: "All levels · 50 min",
    description:
      "Improve flexibility, ease tension and support recovery between hard training days.",
    image: "assets/images/classes/C05.webp",
  },
  {
    slug: "functional-training",
    name: "Functional Training",
    category: "Intermediate · 50 min",
    description: "Multi-plane movement patterns using kettlebells, sleds and bodyweight work.",
    image: "assets/images/classes/C06.webp",
  },
  {
    slug: "personal-training",
    name: "Personal Training",
    category: "All levels · 60 min",
    description: "One-on-one coaching built entirely around your goals and schedule.",
    image: "assets/images/classes/C07.webp",
  },
  {
    slug: "dance-fitness",
    name: "Dance Fitness",
    category: "Beginner-friendly · 45 min",
    description:
      "High-energy choreography that makes cardio feel like a party, not a chore.",
   image: "assets/images/classes/C08.webp",
  },
];

function getProgramBySlug(slug) {
  return programsData.find((p) => p.slug === slug) || null;
}