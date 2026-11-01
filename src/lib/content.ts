/** Long-form copy for the public site. Kept out of the practice state because
 *  none of it is editable in the console — it's the page's own narrative. */

export interface Step {
  step: string;
  icon: string;
  title: string;
  body: string;
  meta: string;
}

export const STEPS: Step[] = [
  {
    step: "01",
    icon: "phone",
    title: "A free 15-minute call",
    body: "Tell Dr. Rahman what's been happening. No intake forms before you've decided anything, and no obligation to book afterwards.",
    meta: "Free · 15 min · phone or WhatsApp",
  },
  {
    step: "02",
    icon: "calendar",
    title: "Your first full hour",
    body: "Sixty minutes to map the problem properly — history, what you've already tried, and what a workable plan would look like for you.",
    meta: "₹2,200 · 60 min · video or in-person",
  },
  {
    step: "03",
    icon: "note",
    title: "A plan you can keep",
    body: "Weekly or fortnightly sessions with written goals, clinical notes kept private, and prepaid packages if you'd rather settle ahead.",
    meta: "Weekly or fortnightly · review every 6 sessions",
  },
];

export interface Concern {
  icon: string;
  title: string;
  body: string;
}

export const CONCERNS: Concern[] = [
  {
    icon: "bolt",
    title: "Anxiety, panic & overthinking",
    body: "Racing thoughts, chest tightness, the 3 a.m. spiral, and the avoidance that quietly shrinks your week.",
  },
  {
    icon: "clock",
    title: "Depression & low mood",
    body: "Flatness, no appetite for things that used to matter, days that cost more than they should.",
  },
  {
    icon: "star",
    title: "Burnout & work stress",
    body: "Holding it together on the outside and running on empty inside — including the guilt about that.",
  },
  {
    icon: "users",
    title: "Relationships & couples",
    body: "Recurring fights, long silences, jealousy, the same argument in new clothes, and premarital clarity.",
  },
  {
    icon: "shield",
    title: "Trauma & difficult memories",
    body: "Trauma-informed work at a pace you set. Nothing is opened faster than you can hold it.",
  },
  {
    icon: "note",
    title: "Grief & loss",
    body: "A death, a divorce, a miscarriage, a friendship that ended — losses other people seem to have moved past.",
  },
  {
    icon: "lock",
    title: "Self-worth & people-pleasing",
    body: "Saying yes and resenting it, perfectionism, the fear of being too much or never quite enough.",
  },
  {
    icon: "phone",
    title: "Life transitions",
    body: "A move, a layoff, a new city, new parenthood, a diagnosis — identity work when the ground shifts.",
  },
];

export const SIGNS: string[] = [
  "You're keeping everything running, and it's costing you",
  "The same argument keeps coming back in a new shape",
  "You've stopped telling people how you actually are",
  "Something happened and you still can't put it down",
  "You want to understand yourself before the next big decision",
  "Sleep, appetite or concentration changed and stayed changed",
];

export interface Inclusion {
  icon: string;
  title: string;
  body: string;
}

export const INCLUSIONS: Inclusion[] = [
  {
    icon: "check",
    title: "A proper assessment, not a chat",
    body: "The first two hours are diagnostic: history, patterns, what's been tried, and what would actually count as progress.",
  },
  {
    icon: "note",
    title: "Notes with a visibility switch",
    body: "Clinical records stay on the practice side. Anything you see in the portal was shared deliberately.",
  },
  {
    icon: "bolt",
    title: "Between-session coordination",
    body: "Scheduling, a moved hour, a practical question over WhatsApp. Not crisis care — that needs a helpline or emergency services.",
  },
  {
    icon: "calendar",
    title: "Receipts and package credits",
    body: "A GST invoice for every payment, and prepaid packages that draw down one hour at a time.",
  },
];

export interface Programme {
  title: string;
  body: string;
  meta: string;
  points: string[];
}

export const PROGRAMMES: Programme[] = [
  {
    title: "Campus & college",
    body: "For students in exam pressure, hostel isolation and placement anxiety — the years where everything seems to be decided at once.",
    meta: "Individual or group · colleges across India",
    points: ["Exam and result anxiety", "Hostel and family distance", "Study routines that survive a bad week"],
  },
  {
    title: "Employee experience",
    body: "Confidential counselling woven into the working week, with manager training and a private line staff can use without telling HR.",
    meta: "Organisations · annual programme",
    points: ["Confidential staff line", "Manager and HR briefings", "Utilisation reported without names"],
  },
  {
    title: "Couples & premarital",
    body: "Ninety minutes for two people: communication, money, families, intimacy, and deciding honestly whether the fit is right.",
    meta: "90 min · in-person or video",
    points: ["One shared hour, two histories", "Money and in-law conversations", "A clear recommendation at the end"],
  },
];

export interface Policy {
  title: string;
  body: string;
}

export const POLICIES: Policy[] = [
  {
    title: "Cancellations",
    body: "Reschedule or cancel up to 24 hours before the hour at no cost. Inside 24 hours the session is charged in full.",
  },
  {
    title: "Refunds",
    body: "The first session is refundable if the fit isn't workable. Package credits stay valid for 12 months from purchase.",
  },
  {
    title: "Fees & GST",
    body: "Every price is per session in INR and shown before you pay. A GST invoice is issued for each payment.",
  },
  {
    title: "No lock-in",
    body: "Pay as you go or prepay a package. Ending therapy is a conversation, not a cancellation policy.",
  },
];

export const CONFIDENTIALITY: string[] = [
  "Clinical notes belong to the practice. You only ever see what's shared to your portal on purpose.",
  "Nothing goes to family, a college or an employer without written consent from you.",
  "The legal limits are named up front: immediate risk to your life, risk to a child or another person, or a court order.",
  "Video links are generated per booking and are not reused between sessions.",
];

export interface Credential {
  k: string;
  v: string;
}

export const CREDENTIALS: Credential[] = [
  { k: "Qualification", v: "M.Phil Clinical Psychology, NIMHANS" },
  { k: "Registration", v: "RCI-registered clinical psychologist" },
  { k: "Approach", v: "CBT · ACT · trauma-informed" },
  { k: "Hours", v: "Mon–Sat · 9:00–18:00 IST" },
  { k: "Location", v: "Mumbai · video across India" },
  { k: "Languages", v: "English · Hindi · Marathi" },
];

export interface CrisisLine {
  name: string;
  number: string;
  tel: string;
  note: string;
}

export const CRISIS_LINES: CrisisLine[] = [
  { name: "Tele-MANAS", number: "14416", tel: "14416", note: "24×7 national mental health helpline" },
  {
    name: "KIRAN",
    number: "1800-599-0019",
    tel: "18005990019",
    note: "24×7 · 13 Indian languages",
  },
  {
    name: "AASRA",
    number: "+91 98204 66726",
    tel: "+919820466726",
    note: "Mumbai · 24×7 suicide prevention",
  },
  { name: "Emergency", number: "112", tel: "112", note: "Immediate danger to life" },
];
