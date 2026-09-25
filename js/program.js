/* ==========================================================================
   PROGRAMS DATA — single source of truth for every IronForge program.
   Used by classes.html and class-detail.html. The site uses local WebP
   assets only for program imagery.
   ========================================================================== */

const programsData = {
  "strength-training": {
    slug: "strength-training",
    name: "Strength Training",
    category: "Strength",
    categorySlug: "strength",
    level: "Beginner – Advanced",
    duration: "60 min",
    shortDescription: "Build strength, improve technique and develop a stronger foundation through structured resistance training.",
    image: "assets/images/classes/C01.webp",
    imageAlt: "Member performing a barbell deadlift during Strength Training",
    whatToExpect: "A structured resistance session built around compound lifts such as squats, deadlifts, presses and rows. Expect a coached warm-up, technique work, a main strength block and accessory exercises.",
    benefits: [
      "Builds strength and lean muscle over time",
      "Improves lifting technique and movement quality",
      "Supports stronger bones, joints and connective tissue",
      "Progressive programming that adapts to your level"
    ],
    whoFor: "Anyone who wants to get stronger with a clear plan, from first-time lifters learning the basics to experienced members working toward new personal bests.",
    whatToBring: [
      "Training shoes with a flat, stable sole",
      "A water bottle",
      "A notebook or app to track your numbers"
    ],
    schedule: "Monday 6:00 AM · Friday 6:00 PM",
    coachName: "David Okafor",
    coachRole: "Head Strength Coach"
  },

  "power-hypertrophy": {
    slug: "power-hypertrophy",
    name: "Power & Hypertrophy",
    category: "Strength",
    categorySlug: "strength",
    level: "Intermediate – Advanced",
    duration: "60 min",
    shortDescription: "Combine heavy compound lifting with focused volume to build strength, power and muscle.",
    image: "assets/images/classes/Co2.webp",
    imageAlt: "Athlete performing a heavy barbell deadlift during Power and Hypertrophy training",
    whatToExpect: "A more focused strength session combining heavier compound work with controlled hypertrophy volume. Coaching emphasizes load selection, technique and progressive overload.",
    benefits: [
      "Develops strength and muscular size together",
      "Improves power through compound movements",
      "Uses progressive overload to create measurable progress",
      "Provides structured training for experienced lifters"
    ],
    whoFor: "Members with a solid training foundation who want to build more strength, power and muscle through structured programming.",
    whatToBring: [
      "Stable training shoes",
      "A water bottle",
      "A lifting belt or straps if you normally use them"
    ],
    schedule: "Tuesday 6:00 AM · Saturday 10:00 AM",
    coachName: "David Okafor",
    coachRole: "Head Strength Coach"
  },

  "strength-foundations": {
    slug: "strength-foundations",
    name: "Strength Foundations",
    category: "Strength",
    categorySlug: "strength",
    level: "Beginner – Intermediate",
    duration: "50 min",
    shortDescription: "Learn the essential movement patterns, lifting techniques and habits that make strength training sustainable.",
    image: "assets/images/classes/C11.webp",
    imageAlt: "Member performing a coached dumbbell exercise during Strength Foundations",
    whatToExpect: "A technique-first session covering fundamental movement patterns, safe loading and basic strength progressions. Coaches give clear cues and modifications throughout.",
    benefits: [
      "Builds confidence with resistance training",
      "Improves fundamental movement patterns",
      "Creates a strong base for future strength work",
      "Progresses at a manageable pace"
    ],
    whoFor: "Beginners and members returning to structured training who want to learn good technique before increasing intensity.",
    whatToBring: [
      "Comfortable training clothes",
      "Stable training shoes",
      "A water bottle"
    ],
    schedule: "Wednesday 6:00 AM · Saturday 8:00 AM",
    coachName: "Michael Adeyemi",
    coachRole: "Performance Coach"
  },

  "hiit": {
    slug: "hiit",
    name: "HIIT",
    category: "Conditioning",
    categorySlug: "conditioning",
    level: "All Levels",
    duration: "45 min",
    shortDescription: "Short, demanding intervals designed to improve cardiovascular fitness, conditioning and full-body work capacity.",
    image: "assets/images/classes/C03.webp",
    imageAlt: "Members training in a high-intensity gym conditioning session",
    whatToExpect: "A coach-led interval session combining cardio and resistance movements with planned recovery periods. Intensity is scaled so members can train hard without losing movement quality.",
    benefits: [
      "Improves cardiovascular fitness and work capacity",
      "Builds full-body conditioning",
      "Keeps sessions efficient and varied",
      "Scales to different fitness levels"
    ],
    whoFor: "Anyone looking for an efficient conditioning workout, from beginners building fitness to experienced members adding more cardio to their week.",
    whatToBring: [
      "Training shoes with good grip",
      "A water bottle",
      "A sweat towel"
    ],
    schedule: "Tuesday 6:00 PM · Thursday 6:00 AM",
    coachName: "Amaka Johnson",
    coachRole: "HIIT & Conditioning Coach"
  },

  "functional-training": {
    slug: "functional-training",
    name: "Functional Training",
    category: "Conditioning",
    categorySlug: "conditioning",
    level: "All Levels",
    duration: "50 min",
    shortDescription: "Build strength, coordination, mobility and conditioning through practical full-body movements.",
    image: "assets/images/classes/C04.webp",
    imageAlt: "Member training with resistance equipment during Functional Training",
    whatToExpect: "Sessions combine loaded carries, resistance work, bodyweight movements and conditioning drills around practical pushing, pulling, carrying and bracing patterns.",
    benefits: [
      "Builds useful full-body strength",
      "Improves coordination and balance",
      "Develops conditioning without repetitive workouts",
      "Can be modified for different abilities"
    ],
    whoFor: "Members who want varied full-body training that supports both gym performance and everyday movement.",
    whatToBring: [
      "Training shoes with good grip",
      "A water bottle",
      "A sweat towel"
    ],
    schedule: "Thursday 6:00 AM · Saturday 9:00 AM",
    coachName: "Michael Adeyemi",
    coachRole: "Performance Coach"
  },

  "athletic-conditioning": {
    slug: "athletic-conditioning",
    name: "Athletic Conditioning",
    category: "Conditioning",
    categorySlug: "conditioning",
    level: "Intermediate – Advanced",
    duration: "50 min",
    shortDescription: "Train speed, stamina, coordination and repeat-effort capacity with athletic-style conditioning drills.",
    image: "assets/images/classes/C06.webp",
    imageAlt: "Athlete performing a battle-rope conditioning drill",
    whatToExpect: "A performance-focused session using intervals, battle ropes, dynamic movement and repeat-effort drills. Sessions are structured around measurable conditioning work.",
    benefits: [
      "Improves repeat-effort conditioning",
      "Develops speed, coordination and stamina",
      "Builds athletic work capacity",
      "Uses progressive conditioning blocks"
    ],
    whoFor: "Athletes and experienced members who want more structured performance conditioning and higher-output training.",
    whatToBring: [
      "Training shoes with strong grip",
      "A water bottle",
      "A training towel"
    ],
    schedule: "Monday 7:00 PM · Saturday 11:00 AM",
    coachName: "Michael Adeyemi",
    coachRole: "Performance Coach"
  },

  "boxing": {
    slug: "boxing",
    name: "Boxing",
    category: "Combat",
    categorySlug: "combat",
    level: "Beginner – Intermediate",
    duration: "60 min",
    shortDescription: "Boxing fundamentals, pad work, movement and conditioning in a structured coached session.",
    image: "assets/images/classes/C09.webp",
    imageAlt: "Member practising boxing combinations on a heavy bag",
    whatToExpect: "Sessions cover stance, footwork, combinations, bag work and conditioning. Coaching focuses on technique and controlled progression; sparring is not required.",
    benefits: [
      "Builds speed, footwork and coordination",
      "Develops practical boxing fundamentals",
      "Improves conditioning and full-body power",
      "Provides focused, skill-based training"
    ],
    whoFor: "Beginners learning boxing fundamentals and intermediate members who want to sharpen technique and conditioning.",
    whatToBring: [
      "Hand wraps",
      "Training shoes with good grip",
      "A water bottle and towel"
    ],
    schedule: "Wednesday 7:00 PM · Saturday 11:00 AM",
    coachName: "Chidi Nwosu",
    coachRole: "Boxing Coach"
  },

  "boxing-fundamentals": {
    slug: "boxing-fundamentals",
    name: "Boxing Fundamentals",
    category: "Combat",
    categorySlug: "combat",
    level: "Beginner",
    duration: "60 min",
    shortDescription: "Learn boxing stance, footwork, basic combinations and pad-work technique from the ground up.",
    image: "assets/images/classes/C07.webp",
    imageAlt: "Coach guiding a member through boxing fundamentals",
    whatToExpect: "A beginner-friendly progression through stance, guard, footwork, basic punches and coach-led pad combinations. Pace and combinations are adjusted as you learn.",
    benefits: [
      "Builds solid boxing fundamentals",
      "Improves coordination and footwork",
      "Develops confidence with pad work",
      "Creates a clear base for future boxing sessions"
    ],
    whoFor: "New boxers and members who want to learn the fundamentals before moving into faster combinations and conditioning.",
    whatToBring: [
      "Hand wraps",
      "Comfortable training shoes",
      "A water bottle"
    ],
    schedule: "Tuesday 7:00 PM · Sunday 10:00 AM",
    coachName: "Chidi Nwosu",
    coachRole: "Boxing Coach"
  },

  "boxing-conditioning": {
    slug: "boxing-conditioning",
    name: "Boxing Conditioning",
    category: "Combat",
    categorySlug: "combat",
    level: "Intermediate",
    duration: "50 min",
    shortDescription: "Combine boxing combinations with conditioning rounds to build speed, stamina and repeat-effort power.",
    image: "assets/images/classes/C08.webp",
    imageAlt: "Member working on a boxing bag during Boxing Conditioning",
    whatToExpect: "Expect boxing combinations, bag rounds, footwork and conditioning intervals with short recovery periods. Technique stays central while the pace increases.",
    benefits: [
      "Improves boxing-specific conditioning",
      "Builds speed and repeat-effort stamina",
      "Develops coordination under fatigue",
      "Combines skill practice with a demanding workout"
    ],
    whoFor: "Members with basic boxing experience who want to improve conditioning while continuing to sharpen technique.",
    whatToBring: [
      "Hand wraps",
      "Training shoes with good grip",
      "A water bottle and towel"
    ],
    schedule: "Thursday 7:00 PM · Saturday 1:00 PM",
    coachName: "Chidi Nwosu",
    coachRole: "Boxing Coach"
  },

  "personal-training": {
    slug: "personal-training",
    name: "Personal Training",
    category: "Personal Training",
    categorySlug: "personal-training",
    level: "All Levels",
    duration: "60 min",
    shortDescription: "One-on-one coaching built around your goals, training history and individual needs.",
    image: "assets/images/classes/C14.webp",
    imageAlt: "Coach guiding a member through an individual training exercise",
    whatToExpect: "Your coach builds a programme around your goals, movement and training history, then adjusts it as you progress. Every session is focused on individual coaching and feedback.",
    benefits: [
      "A programme designed around your goals",
      "Direct coaching and technique correction",
      "Flexible scheduling around your routine",
      "Clear accountability and progress tracking"
    ],
    whoFor: "Members who want individual attention, whether they are new to training, returning after time away or working toward a specific goal.",
    whatToBring: [
      "Training shoes and comfortable workout clothing",
      "A water bottle",
      "Any relevant training history for your first session"
    ],
    schedule: "By appointment, Monday – Saturday",
    coachName: "Sarah Williams",
    coachRole: "Personal Trainer"
  },

  "one-on-one-strength": {
    slug: "one-on-one-strength",
    name: "1-on-1 Strength Coaching",
    category: "Personal Training",
    categorySlug: "personal-training",
    level: "All Levels",
    duration: "60 min",
    shortDescription: "Individual strength coaching with focused technique feedback, programming and progressive overload.",
    image: "assets/images/classes/C10.webp",
    imageAlt: "Coach guiding a member through a strength and movement exercise",
    whatToExpect: "Work one-on-one with a coach on movement technique, strength programming and progressive loading. Sessions are adjusted to your current ability and goals.",
    benefits: [
      "Individualized strength programming",
      "Detailed technique feedback",
      "Progressive loading matched to your ability",
      "A clear plan between coached sessions"
    ],
    whoFor: "Members who want focused strength coaching and more individualized feedback than a group session provides.",
    whatToBring: [
      "Stable training shoes",
      "A water bottle",
      "Your current training notes if available"
    ],
    schedule: "By appointment, Monday – Friday",
    coachName: "David Okafor",
    coachRole: "Head Strength Coach"
  },

  "goal-based-personal-training": {
    slug: "goal-based-personal-training",
    name: "Goal-Based Personal Training",
    category: "Personal Training",
    categorySlug: "personal-training",
    level: "All Levels",
    duration: "60 min",
    shortDescription: "Targeted one-on-one coaching built around a specific fitness, strength, movement or performance goal.",
    image: "assets/images/classes/C05.webp",
    imageAlt: "Coach assisting a member during an individualized training session",
    whatToExpect: "Start with a clear goal and a practical assessment, then train through a focused plan with regular adjustments. Sessions emphasize consistency, technique and measurable progress.",
    benefits: [
      "Training built around a specific outcome",
      "Regular coaching and plan adjustments",
      "Measurable progress toward your target",
      "Accountability throughout the process"
    ],
    whoFor: "Members who have a clear target and want a coach to organize their training around it.",
    whatToBring: [
      "Comfortable training clothes",
      "A water bottle",
      "Any relevant goal or training history"
    ],
    schedule: "By appointment, Monday – Saturday",
    coachName: "Sarah Williams",
    coachRole: "Personal Trainer"
  },

  "mobility": {
    slug: "mobility",
    name: "Mobility & Recovery",
    category: "Recovery",
    categorySlug: "recovery",
    level: "All Levels",
    duration: "45 min",
    shortDescription: "Improve mobility, movement quality and recovery through controlled mobility-focused sessions.",
    image: "assets/images/classes/C12.webp",
    imageAlt: "Coach guiding a member through a recovery and mobility exercise",
    whatToExpect: "A slower-paced, coach-guided session using controlled stretching, joint mobility drills and breathing work to help your body recover between harder training days.",
    benefits: [
      "Improves range of motion and movement quality",
      "Eases tension and supports recovery",
      "Balances harder training sessions",
      "Can be modified for different movement levels"
    ],
    whoFor: "Anyone training hard elsewhere in the week, managing stiffness or simply wanting to move and recover better.",
    whatToBring: [
      "Comfortable, non-restrictive clothing",
      "A water bottle",
      "A mat if you have a preferred one"
    ],
    schedule: "Saturday 9:00 AM",
    coachName: "Grace Abiodun",
    coachRole: "Mobility & Yoga Coach"
  },

  "yoga-mobility": {
    slug: "yoga-mobility",
    name: "Yoga & Mobility",
    category: "Recovery",
    categorySlug: "recovery",
    level: "All Levels",
    duration: "50 min",
    shortDescription: "Blend breath-led yoga movement with mobility work to improve control, range of motion and recovery.",
    image: "assets/images/classes/C15.webp",
    imageAlt: "Member practising a yoga and mobility session",
    whatToExpect: "A controlled session combining yoga-inspired movement, breathing and mobility drills. Expect a slower pace, clear modifications and an emphasis on moving with control.",
    benefits: [
      "Supports mobility and range of motion",
      "Improves movement control and body awareness",
      "Provides lower-intensity recovery work",
      "Helps balance demanding training weeks"
    ],
    whoFor: "Beginners, busy professionals and experienced members who want a calmer mobility practice alongside strength or conditioning.",
    whatToBring: [
      "Comfortable clothing",
      "A water bottle",
      "A yoga mat if you prefer your own"
    ],
    schedule: "Sunday 9:00 AM",
    coachName: "Grace Abiodun",
    coachRole: "Mobility & Yoga Coach"
  },

  "stretch-restore": {
    slug: "stretch-restore",
    name: "Stretch & Restore",
    category: "Recovery",
    categorySlug: "recovery",
    level: "All Levels",
    duration: "45 min",
    shortDescription: "A gentle recovery session focused on stretching, breathing and restoring comfortable movement.",
    image: "assets/images/classes/C13.webp",
    imageAlt: "Member performing a controlled mobility exercise during Stretch and Restore",
    whatToExpect: "A gentle, guided recovery session using controlled stretches, mobility drills and breathing. The focus is on comfortable range of motion rather than intensity.",
    benefits: [
      "Encourages relaxed, controlled movement",
      "Supports recovery after demanding training",
      "Improves flexibility and body awareness",
      "Adds a low-intensity option to your training week"
    ],
    whoFor: "Anyone who wants dedicated recovery time, especially members balancing strength, conditioning or boxing sessions.",
    whatToBring: [
      "Comfortable clothing",
      "A water bottle",
      "A mat if you prefer your own"
    ],
    schedule: "Friday 7:00 PM",
    coachName: "Grace Abiodun",
    coachRole: "Mobility & Yoga Coach"
  }
};

const programOrder = [
  "strength-training",
  "power-hypertrophy",
  "strength-foundations",
  "hiit",
  "functional-training",
  "athletic-conditioning",
  "boxing",
  "boxing-fundamentals",
  "boxing-conditioning",
  "personal-training",
  "one-on-one-strength",
  "goal-based-personal-training",
  "mobility",
  "yoga-mobility",
  "stretch-restore"
];

const programCategories = [
  { slug: "all", label: "All" },
  { slug: "strength", label: "Strength" },
  { slug: "conditioning", label: "Conditioning" },
  { slug: "combat", label: "Combat" },
  { slug: "personal-training", label: "Personal Training" },
  { slug: "recovery", label: "Recovery" }
];