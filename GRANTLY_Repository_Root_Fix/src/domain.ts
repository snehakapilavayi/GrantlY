export type Profile = {
  name: string;
  course: string;
  year: number;
  state: string;
  institution: string;
  score: number;
  scale: "Percentage" | "CGPA / 10";
  income: number;
  cost: number;
  available: number;
  firstGen: string;
};
export type Scholarship = {
  id: string;
  name: string;
  provider: string;
  amount: number;
  structure: "Annual" | "One-time";
  course: string;
  state: string;
  minScore: number;
  income: number;
  institution: string;
  years: number[];
  firstGen: boolean;
  docs: string[];
  days: number;
  effort: number;
  group?: string;
  combination: "Allowed" | "Unknown" | "Exclusive";
  color: string;
  initials: string;
  description: string;
};
export type Application = {
  status: "Preparing" | "Demo submitted" | "Outcome recorded";
  step: number;
  answer: string;
  notes: string;
  reference?: string;
  submitted?: string;
  outcome?: string;
};
export type State = {
  version: 1;
  seed: string;
  profile: Profile;
  prepared: string[];
  saved: string[];
  selected: string[];
  applications: Record<string, Application>;
  documentMeta?: Record<string, { name: string; size: number; type: string }>;
  activity: { text: string; time: string }[];
};
export const documents: Record<string, { name: string; help: string }> = {
  identity: {
    name: "Student ID",
    help: "A current institution-issued student ID. Use a demonstration file, not a real identity document.",
  },
  marks: {
    name: "Academic transcript",
    help: "Your latest semester marks or academic transcript.",
  },
  income: {
    name: "Income certificate",
    help: "A household income certificate for the current financial year. In this demo, mark the checklist prepared to explore readiness.",
  },
  admission: {
    name: "Admission letter",
    help: "An admission or enrolment confirmation from your college.",
  },
  essay: {
    name: "Personal statement",
    help: "A short statement about your learning goals and the support you need.",
  },
  recommendation: {
    name: "Recommendation letter",
    help: "A supporting letter from a teacher or academic mentor.",
  },
};
export const defaultProfile: Profile = {
  name: "Aanya Sharma",
  course: "Engineering",
  year: 2,
  state: "Karnataka",
  institution: "Public",
  score: 82,
  scale: "Percentage",
  income: 300000,
  cost: 150000,
  available: 40000,
  firstGen: "Yes",
};
const base = {
  course: "Any",
  state: "Any",
  minScore: 60,
  income: 600000,
  institution: "Any",
  years: [1, 2, 3, 4, 5],
  firstGen: false,
  docs: ["identity", "marks"],
  days: 20,
  effort: 20,
  combination: "Allowed" as const,
  structure: "Annual" as const,
};
export const scholarships: Scholarship[] = [
  {
    ...base,
    id: "udaan",
    name: "Udaan Scholars Grant",
    provider: "Udaan Learning Foundation",
    amount: 50000,
    minScore: 75,
    income: 400000,
    docs: ["identity", "marks", "income"],
    days: 6,
    effort: 25,
    color: "lime",
    initials: "u.",
    description:
      "A little room to aim higher. Annual tuition support for students building a strong academic foundation.",
  },
  {
    ...base,
    id: "next",
    name: "Next Chapter Fellowship",
    provider: "Chapter One Collective",
    amount: 35000,
    minScore: 70,
    income: 500000,
    docs: ["identity", "marks", "income"],
    days: 12,
    effort: 20,
    color: "lavender",
    initials: "nc",
    description:
      "Helping promising students turn their next year of college into their next big chapter.",
  },
  {
    ...base,
    id: "build",
    name: "Build Tomorrow Scholarship",
    provider: "Tomorrow Works Trust",
    amount: 45000,
    course: "Engineering",
    minScore: 80,
    income: 500000,
    days: 17,
    effort: 30,
    color: "peach",
    initials: "bt",
    description:
      "For engineering students who want to turn thoughtful ideas into useful things. Support for your next year of study.",
  },
  {
    ...base,
    id: "roots",
    name: "Roots & Wings Award",
    provider: "Roots Education Circle",
    amount: 25000,
    state: "Karnataka",
    firstGen: true,
    days: 9,
    effort: 15,
    color: "sage",
    initials: "r/w",
    structure: "One-time",
    description:
      "A first step that can change a family story. One-time support for first-generation college students.",
  },
  {
    ...base,
    id: "horizon",
    name: "Horizon Merit Fellowship",
    provider: "Horizon Academic Trust",
    amount: 75000,
    minScore: 90,
    group: "merit",
    combination: "Exclusive",
    days: 25,
    color: "lavender",
    initials: "hz",
    description:
      "Recognising exceptional academic achievement with substantial tuition support.",
  },
  {
    ...base,
    id: "spark",
    name: "Spark STEM Grant",
    provider: "Spark Futures Foundation",
    amount: 40000,
    course: "Engineering",
    docs: ["identity", "marks", "essay"],
    days: 14,
    color: "lime",
    initials: "sp",
    description:
      "An opportunity for curious engineering students to explore, experiment and keep learning.",
  },
  {
    ...base,
    id: "care",
    name: "Care Forward Scholarship",
    provider: "Care Forward Collective",
    amount: 60000,
    course: "Medicine",
    docs: ["identity", "marks", "income", "admission"],
    days: 30,
    color: "peach",
    initials: "cf",
    description:
      "Supporting the next generation of thoughtful healthcare professionals.",
  },
  {
    ...base,
    id: "canvas",
    name: "Open Canvas Bursary",
    provider: "Open Canvas Foundation",
    amount: 30000,
    course: "Arts & Design",
    docs: ["identity", "marks", "essay"],
    days: 22,
    combination: "Unknown",
    color: "lavender",
    initials: "oc",
    description:
      "For students developing their own creative voice through arts and design education.",
  },
  {
    ...base,
    id: "bridge",
    name: "Bridge to Business Grant",
    provider: "Bridge Learning Trust",
    amount: 28000,
    course: "Commerce",
    docs: ["identity", "marks", "income"],
    days: 18,
    color: "sage",
    initials: "bb",
    description:
      "Tuition support for commerce students preparing to shape responsible businesses.",
  },
  {
    ...base,
    id: "south",
    name: "Southern Horizons Award",
    provider: "Southern Horizons Trust",
    amount: 32000,
    state: "Tamil Nadu",
    docs: ["identity", "marks", "admission"],
    days: 35,
    color: "peach",
    initials: "sh",
    structure: "One-time",
    description:
      "A one-time education award for students resident in Tamil Nadu.",
  },
  {
    ...base,
    id: "equal",
    name: "Equal Start Scholarship",
    provider: "Equal Start Foundation",
    amount: 20000,
    income: 300000,
    docs: ["identity", "marks", "admission", "recommendation"],
    days: 4,
    color: "sage",
    initials: "es",
    description:
      "Practical financial support that helps students keep moving through a demanding academic year.",
  },
  {
    ...base,
    id: "ascent",
    name: "Ascent Academic Award",
    provider: "Ascent Education Guild",
    amount: 55000,
    minScore: 80,
    group: "merit",
    combination: "Exclusive",
    docs: ["identity", "marks", "essay", "recommendation"],
    days: 28,
    color: "lime",
    initials: "a↗",
    description:
      "Merit-based support for students with strong academic progress and a clear learning ambition.",
  },
];
export const initialState = (): State => ({
  version: 1,
  seed: new Date().toISOString(),
  profile: { ...defaultProfile },
  prepared: ["identity", "marks"],
  saved: ["udaan", "build"],
  selected: [],
  applications: {
    build: { status: "Preparing", step: 1, answer: "", notes: "" },
  },
  activity: [
    {
      text: "Your funding journey is ready to begin.",
      time: new Date().toISOString(),
    },
  ],
});
export function loadState(): State {
  try {
    const s = JSON.parse(localStorage.getItem("grantly-v1") || "null");
    const p = s?.profile;
    if (
      s?.version === 1 &&
      Number.isFinite(Date.parse(s.seed)) &&
      p &&
      typeof p.name === "string" &&
      [
        "Engineering",
        "Medicine",
        "Commerce",
        "Arts & Design",
        "Science",
      ].includes(p.course) &&
      ["Percentage", "CGPA / 10"].includes(p.scale) &&
      [p.year, p.score, p.income, p.cost, p.available].every(
        (v: unknown) => typeof v === "number" && Number.isFinite(v) && v >= 0,
      ) &&
      p.score <= (p.scale === "Percentage" ? 100 : 10) &&
      Array.isArray(s.prepared) &&
      Array.isArray(s.saved) &&
      Array.isArray(s.selected) &&
      Array.isArray(s.activity) &&
      s.applications &&
      typeof s.applications === "object" &&
      Object.values(s.applications).every(
        (a: any) =>
          a &&
          ["Preparing", "Demo submitted", "Outcome recorded"].includes(
            a.status,
          ) &&
          Number.isInteger(a.step) &&
          a.step >= 0 &&
          a.step <= 3 &&
          typeof a.answer === "string",
      )
    )
      return s;
  } catch {}
  return initialState();
}
export function eligibility(s: Scholarship, p: Profile) {
  const score = p.scale === "Percentage" ? p.score : p.score * 10;
  return [
    {
      label: `${s.course === "Any" ? "All courses" : s.course} accepted`,
      state: s.course === "Any" || s.course === p.course ? "met" : "unmet",
    },
    {
      label: `${s.state === "Any" ? "All Indian states" : s.state + " residents"}`,
      state: s.state === "Any" || s.state === p.state ? "met" : "unmet",
    },
    {
      label: `At least ${s.minScore}% academic score`,
      state: score >= s.minScore ? "met" : "unmet",
    },
    {
      label: `Household income up to ${money(s.income)}`,
      state: p.income <= s.income ? "met" : "unmet",
    },
    {
      label: `Years ${s.years.join(", ")} of study`,
      state: s.years.includes(p.year) ? "met" : "unmet",
    },
    {
      label:
        s.institution === "Any"
          ? "Public and private institutions"
          : s.institution + " institutions",
      state:
        s.institution === "Any" || s.institution === p.institution
          ? "met"
          : "unmet",
    },
    ...(s.firstGen
      ? [
          {
            label: "First-generation college student",
            state:
              p.firstGen === "Prefer not to say"
                ? "unknown"
                : p.firstGen === "Yes"
                  ? "met"
                  : "unmet",
          },
        ]
      : []),
  ];
}
export const fit = (s: Scholarship, p: Profile) => {
  const r = eligibility(s, p);
  return r.some((x) => x.state === "unmet")
    ? "unmet"
    : r.some((x) => x.state === "unknown")
      ? "unknown"
      : "met";
};
export const missing = (s: Scholarship, prepared: string[]) =>
  s.docs.filter((d) => !prepared.includes(d));
export const deadline = (s: Scholarship, seed: string) =>
  new Date(new Date(seed).getTime() + s.days * 86400000);
export const daysLeft = (s: Scholarship, seed: string) =>
  Math.ceil((deadline(s, seed).getTime() - Date.now()) / 86400000);
export const money = (v: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);
export function oneAway(state: State) {
  const groups: Record<string, Scholarship[]> = {};
  scholarships
    .filter(
      (s) =>
        fit(s, state.profile) === "met" &&
        daysLeft(s, state.seed) >= 0 &&
        missing(s, state.prepared).length === 1,
    )
    .forEach((s) => {
      const d = missing(s, state.prepared)[0];
      (groups[d] ??= []).push(s);
    });
  return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
}
export const incompatible = (a: Scholarship, b: Scholarship) =>
  a.id !== b.id && !!a.group && a.group === b.group;
export function funding(state: State) {
  const selected = scholarships.filter((s) => state.selected.includes(s.id));
  const potential = selected.reduce((v, s) => v + s.amount, 0);
  return {
    selected,
    potential,
    gap: Math.max(0, state.profile.cost - state.profile.available - potential),
    excess: Math.max(
      0,
      state.profile.available + potential - state.profile.cost,
    ),
  };
}
export function priority(s: Scholarship, state: State) {
  return (
    (fit(s, state.profile) === "met" ? 1000 : 0) +
    (missing(s, state.prepared).length === 0 ? 300 : 0) -
    Math.max(daysLeft(s, state.seed), 0) * 2 -
    s.effort
  );
}
