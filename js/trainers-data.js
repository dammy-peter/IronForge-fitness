/* ==========================================================================
   TRAINERS DATA — single source of truth for the coaching roster.
   Consumed by trainers.html (directory + filters) and trainer-detail.html
   (dynamic profile via ?trainer=<slug>). Edit this file to add, remove or
   update coaches instead of touching the HTML.
   ========================================================================== */

const trainersData = [
  {
    slug: "david-okafor",
    name: "David Okafor",
    role: "Head Strength Coach",
    category: "strength",
    categoryLabel: "Strength",
    image: "assets/images/trainers/T01 (2).webp",
    shortBio:
      "Head Strength Coach with 12 years building strength and powerlifting programs across Lagos.",
    bio: [
      "David has spent over a decade coaching strength and powerlifting athletes across Lagos. He joined IronForge to build a strength program that combines serious programming with genuine, patient coaching.",
      "Whether a member is chasing a first pull-up or a first 100kg deadlift, David breaks the process down into stages that are realistic to hit and easy to stay consistent with.",
    ],
    specialties: ["Strength Training", "Powerlifting", "Personal Training"],
    certifications: [
      "NASM Certified Personal Trainer",
      "USA Powerlifting Coaching Certificate",
      "First Aid & CPR Certified",
    ],
    experience: "12+ Years",
    philosophy:
      "Strength is built in the details — consistent technique, honest effort and a plan that respects where you are today. Nothing about progress needs to be rushed to be real.",
    trainingStyle:
      "David runs sessions around progressive overload and movement quality, tracking numbers session to session so every member can see exactly how far they've come.",
    trainingPrinciples: ["Technique First", "Progressive Overload", "Consistency Over Extremes"],
    whoTheyHelp: ["Beginners", "Strength-focused Members", "Athletes"],
    programs: ["strength-training", "personal-training"],
    availability: "Monday – Friday, morning & evening sessions",
    location: "Lagos",
    testimonial: {
      quote:
        "David's programming took the guesswork out of the gym. I finally understand why I'm doing what I'm doing.",
      author: "Tunde A., IronForge Member",
    },
  },
  {
    slug: "daniel-adebayo",
    name: "Daniel Adebayo",
    role: "Strength & Conditioning Coach",
    category: "strength",
    categoryLabel: "Strength",
    image: "assets/images/trainers/T02.webp",
    shortBio:
      "Strength & Conditioning Coach with 9 years helping members build power, movement quality and practical strength.",
    bio: [
      "Daniel coaches strength with a strong emphasis on movement quality, work capacity and repeatable progress. His sessions are structured enough to keep members progressing without making training feel complicated.",
      "He works with members building a stronger foundation as well as experienced lifters who want more structure around their conditioning and accessory work.",
    ],
    specialties: ["Strength & Conditioning", "Functional Strength", "Athletic Development"],
    certifications: [
      "NSCA Certified Strength & Conditioning Specialist",
      "First Aid & CPR Certified",
    ],
    experience: "9+ Years",
    philosophy:
      "Strong training should make everyday movement and athletic performance feel more capable. Daniel builds that strength through clear progressions and quality repetitions.",
    trainingStyle:
      "Sessions combine compound strength work, accessory movements and controlled conditioning, with loads and volume adjusted to the member's training level.",
    trainingPrinciples: ["Quality Reps", "Progressive Loading", "Build the Base"],
    whoTheyHelp: ["Beginners", "Strength-focused Members", "Athletes"],
    programs: ["strength-training", "functional-training"],
    availability: "Monday – Saturday, morning & evening sessions",
    location: "Lagos",
  },
  {
    slug: "michael-adeyemi",
    name: "Michael Adeyemi",
    role: "Performance Coach",
    category: "performance",
    categoryLabel: "Performance",
    image: "assets/images/trainers/T08.webp",
    shortBio:
      "Performance Coach with 10 years working with athletes on strength, speed and conditioning.",
    bio: [
      "Michael's background is in athletic performance, working with footballers and combat athletes on the qualities that actually move the needle in competition: strength, speed and repeatable conditioning.",
      "He also coaches members who simply want to train with an athlete's structure — clear phases, measurable benchmarks and a plan that builds toward something.",
    ],
    specialties: ["Athletic Performance", "Strength & Conditioning", "Speed Training"],
    certifications: ["CSCS Certified Strength & Conditioning Specialist"],
    experience: "10+ Years",
    philosophy:
      "Performance is a long game. Michael programs in phases, building a base before layering in intensity, so gains hold up instead of burning out.",
    trainingStyle:
      "Expect structured blocks with clear benchmarks — strength phases, power phases and conditioning phases, each building on the last.",
    trainingPrinciples: ["Phased Programming", "Measurable Benchmarks", "Built to Last"],
    whoTheyHelp: ["Athletes", "Strength-focused Members", "Group Training Members"],
    programs: ["functional-training", "strength-training"],
    availability: "Monday, Wednesday, Friday evenings & Saturday mornings",
    location: "Lagos",
  },
  {
    slug: "sarah-williams",
    name: "Sarah Williams",
    role: "Personal Trainer",
    category: "personal",
    categoryLabel: "Personal Training",
    image: "assets/images/trainers/T04.webp",
    shortBio:
      "Personal Trainer with 8 years of experience helping busy professionals build sustainable habits.",
    bio: [
      "Sarah works almost exclusively one-on-one, which means every plan she builds is shaped entirely around the member's schedule, starting point and goals.",
      "She specializes in members who are new to structured training or returning after time away, and puts extra care into making the first few weeks feel manageable, not overwhelming.",
    ],
    specialties: ["Personal Training", "Weight Management", "Beginner Coaching"],
    certifications: ["ACE Certified Personal Trainer", "Nutrition Coaching Certificate"],
    experience: "8+ Years",
    philosophy:
      "The best program is the one you'll actually keep doing. Sarah builds routines around a member's real life instead of asking them to rebuild their life around a routine.",
    trainingStyle:
      "Sessions are structured but flexible — clear weekly targets with room to adjust when work or life gets in the way, so momentum never fully resets.",
    trainingPrinciples: ["Sustainable Habits", "Realistic Goal-Setting", "Steady Accountability"],
    whoTheyHelp: ["Beginners", "Busy Professionals", "Weight-loss Clients"],
    programs: ["personal-training", "functional-training"],
    availability: "Tuesday – Saturday, flexible daytime slots",
    location: "Lagos",
    testimonial: {
      quote:
        "Sarah never made me feel behind. She just kept meeting me where I was and moving me forward.",
      author: "Ifeoma K., IronForge Member",
    },
  },
  {
    slug: "naomi-eze",
    name: "Naomi Eze",
    role: "Personal Trainer",
    category: "personal",
    categoryLabel: "Personal Training",
    image: "assets/images/trainers/T05.webp",
    shortBio:
      "Personal Trainer with 7 years helping members improve strength, confidence and consistency through focused one-on-one coaching.",
    bio: [
      "Naomi builds personal training plans around the person in front of her — their current fitness level, schedule, movement patterns and the reason they want to train.",
      "Her coaching is practical and encouraging, with simple progress markers that help members understand what is improving and what to work on next.",
    ],
    specialties: ["Personal Training", "Strength Foundations", "Habit Coaching"],
    certifications: [
      "NASM Certified Personal Trainer",
      "Functional Training Certification",
    ],
    experience: "7+ Years",
    philosophy:
      "Good coaching makes progress feel clear. Naomi turns big goals into manageable sessions and habits that members can keep long after the first few weeks.",
    trainingStyle:
      "One-on-one sessions combine strength fundamentals, movement coaching and goal-specific conditioning, scaled carefully to each member.",
    trainingPrinciples: ["Coach the Person", "Small Wins Matter", "Consistency Builds Confidence"],
    whoTheyHelp: ["Beginners", "Busy Professionals", "Weight-loss Clients"],
    programs: ["personal-training", "functional-training"],
    availability: "Monday – Saturday, daytime & early evening appointments",
    location: "Lagos",
  },
  {
    slug: "amaka-johnson",
    name: "Amaka Johnson",
    role: "HIIT & Conditioning Coach",
    category: "hiit",
    categoryLabel: "HIIT",
    image: "assets/images/trainers/T03.webp",
    shortBio:
      "HIIT & Conditioning Coach with 6 years running high-energy circuit and interval training.",
    bio: [
      "Amaka coaches members who want their heart rate up and their sessions to move fast. Her circuits mix bodyweight, kettlebell and cardio intervals so no two weeks feel identical.",
      "She keeps close attention on form under fatigue, since that's usually where HIIT training goes wrong, and adjusts intensity in real time for every member in the room.",
    ],
    specialties: ["HIIT", "Conditioning", "Circuit Training"],
    certifications: ["ACSM Certified Group Exercise Instructor"],
    experience: "6+ Years",
    philosophy:
      "Intensity only works if the technique holds up. Amaka would rather a member finish a round with good form than push through with poor mechanics.",
    trainingStyle:
      "High-energy interval circuits with built-in coaching cues, so members are pushed hard but never left to guess whether they're moving correctly.",
    trainingPrinciples: ["Form Under Fatigue", "Varied Programming", "Push, Don't Break"],
    whoTheyHelp: ["Group Training Members", "Weight-loss Clients", "Busy Professionals"],
    programs: ["hiit", "functional-training"],
    availability: "Monday – Saturday, early morning & evening classes",
    location: "Lagos",
    testimonial: {
      quote:
        "Amaka's classes are the one session I never want to skip. Tough, but she's watching everyone's form the whole time.",
      author: "Bola O., IronForge Member",
    },
  },
  {
    slug: "chidi-nwosu",
    name: "Chidi Nwosu",
    role: "Boxing Coach",
    category: "boxing",
    categoryLabel: "Boxing",
    image: "assets/images/trainers/T07.webp",
    shortBio:
      "Boxing Coach with 9 years teaching footwork, technique and pad work to members of all levels.",
    bio: [
      "Chidi teaches boxing as a skill first and a workout second. Members leave every session having actually learned something — footwork, combinations, defensive positioning — not just tired.",
      "He works with complete beginners as often as members with previous boxing experience, adjusting pad combinations and pace to match where each person is.",
    ],
    specialties: ["Boxing", "Footwork", "Conditioning"],
    certifications: ["Certified Boxing Coach", "First Aid & CPR Certified"],
    experience: "9+ Years",
    philosophy:
      "Good boxing is built on footwork and fundamentals, not power. Chidi teaches the technical pieces before he lets a session get fast.",
    trainingStyle:
      "Sessions open with technique and shadow work, then move into pad combinations and conditioning rounds once the fundamentals are solid.",
    trainingPrinciples: ["Footwork First", "Technique Before Speed", "Beginner-Friendly Pace"],
    whoTheyHelp: ["Beginners", "Weight-loss Clients", "Group Training Members"],
    programs: ["boxing", "hiit"],
    availability: "Tuesday – Sunday, afternoon & evening sessions",
    location: "Lagos",
  },
  {
    slug: "grace-abiodun",
    name: "Grace Abiodun",
    role: "Mobility & Yoga Coach",
    category: "mobility",
    categoryLabel: "Mobility",
    image: "assets/images/trainers/T06.webp",
    shortBio:
      "Mobility & Yoga Coach with 7 years helping members move better and recover between hard sessions.",
    bio: [
      "Grace focuses on the training members often skip — mobility, breathing and recovery work that keeps them able to train hard everywhere else.",
      "Her sessions are as useful for a strength athlete managing stiffness as they are for a member starting a movement practice from scratch.",
    ],
    specialties: ["Mobility", "Recovery", "Yoga"],
    certifications: ["RYT-200 Registered Yoga Teacher", "Mobility Coach Certification"],
    experience: "7+ Years",
    philosophy:
      "Recovery isn't optional, it's part of the training. Grace treats mobility work as seriously as any strength session, because it's what lets the rest of the training stick.",
    trainingStyle:
      "Slower, breath-led sessions focused on range of motion and control, with modifications offered for every level in the room.",
    trainingPrinciples: ["Recovery Is Training", "Move Well Before Moving Fast", "Everyone Modifies"],
    whoTheyHelp: ["Beginners", "Busy Professionals", "Strength-focused Members"],
    programs: ["yoga-mobility"],
    availability: "Monday – Friday mornings, Sunday recovery sessions",
    location: "Lagos",
    testimonial: {
      quote:
        "Grace's sessions are the reason my back stopped bothering me during heavy lifting weeks.",
      author: "Emeka N., IronForge Member",
    },
  },
  {
    slug: "ibrahim-musa",
    name: "Ibrahim Musa",
    role: "Mobility & Recovery Coach",
    category: "mobility",
    categoryLabel: "Mobility",
    image: "assets/images/trainers/T09.webp",
    shortBio:
      "Mobility & Recovery Coach with 6 years helping members improve movement quality, flexibility and recovery.",
    bio: [
      "Ibrahim helps members build mobility that carries over into lifting, conditioning and everyday movement. His approach focuses on control, usable range of motion and recovery rather than simply chasing flexibility.",
      "He works with members who feel stiff between training sessions as well as athletes who want a better recovery routine around demanding workloads.",
    ],
    specialties: ["Mobility", "Recovery", "Movement Quality"],
    certifications: [
      "Certified Mobility Specialist",
      "Functional Movement Screening Certification",
    ],
    experience: "6+ Years",
    philosophy:
      "Mobility is useful when you can control the range you have. Ibrahim builds movement quality patiently so members can use it when training gets demanding.",
    trainingStyle:
      "Sessions combine controlled mobility drills, recovery work and movement preparation, with progressions based on how each member moves that day.",
    trainingPrinciples: ["Control the Range", "Recovery With Purpose", "Movement Before Intensity"],
    whoTheyHelp: ["Beginners", "Athletes", "Strength-focused Members"],
    programs: ["yoga-mobility", "functional-training"],
    availability: "Monday – Friday, morning & evening recovery sessions",
    location: "Lagos",
  },
];

/**
 * Returns the ordered list of categories actually present in trainersData,
 * so the trainer directory only ever shows filters that have matching
 * trainers. "All" is always included first.
 */
function getTrainerCategories() {
  const seen = new Map();
  trainersData.forEach((t) => {
    if (!seen.has(t.category)) seen.set(t.category, t.categoryLabel);
  });
  return [{ value: "all", label: "All" }, ...Array.from(seen, ([value, label]) => ({ value, label }))];
}

function getTrainerBySlug(slug) {
  return trainersData.find((t) => t.slug === slug) || null;
}

function getRelatedTrainers(trainer, count = 3) {
  const others = trainersData.filter((t) => t.slug !== trainer.slug);
  const sameCategory = others.filter((t) => t.category === trainer.category);
  const rest = others.filter((t) => t.category !== trainer.category);
  return [...sameCategory, ...rest].slice(0, count);
}