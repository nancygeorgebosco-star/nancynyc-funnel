/**
 * Obsidian Editorial Authority: asymmetric editorial scale, champagne-gold accents,
 * three-plane orbital motifs, and precise conversion-focused motion.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Eye,
  Hand,
  Headphones,
  Menu,
  Utensils,
  Wind,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const FREQUENCY_MARK = "/assets/frequency-mark_1a2f5a05.png";
const ORBITAL_FIELD = "/assets/orbital-field_da9c3c02.png";
const WHITEBOARD_TEXTURE = "/assets/whiteboard-texture_66a2f984.png";
const APPROVED_PORTRAIT = "/assets/nancynyc-navy-suit-from-scratch_37409ed7.png";
const DIALOG_PORTRAIT = "/assets/nancynyc-dialog-portrait_40039dfd.png";
const APPROVED_SPORTSWEAR = "/assets/nancynyc-petite-luxury-gym-portrait_a2c9ec26.png";

// NancyNYC's private 45-minute 1-on-1 Fit Call in Acuity Scheduling.
const ACUITY_OWNER_ID = "33157398";
const ACUITY_APPOINTMENT_TYPE_ID = "99028191";

const navItems = [
  { label: "The Method", href: "#method" },
  { label: "Why It’s Different", href: "#different" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
];

const planes = [
  {
    number: "01",
    title: "3D Physical & Spatial Blueprint",
    subtitle: "ASTROLOGICAL TIMING • WARDROBE & NUTRITIONAL FREQUENCY • VASTU & EXECUTIVE SPACES",
    status: "Foundational Stabilization",
    text: "The 3D plane establishes your environmental, physiological, and strategic baseline. We align your physical inputs—wardrobe colors, daily nutrition, movement protocols, and business focus—with your natal chart and active planetary cycles before deeper mental or spiritual work begins.",
    deliverables: [
      {
        title: "TEMPORAL TIMING & BUSINESS FOCUS",
        text: "Comprehensive natal chart diagnostics and active Mahadasha/Antardasha cycles. We align your current business model, capital allocation, risk tolerance, and career pivots directly to your peak planetary timing windows.",
      },
      {
        title: "PHYSICAL FREQUENCY & SENSORY CALIBRATION",
        text: "Personalized physical optimization matched to your dominant planets: bespoke wardrobe color palettes, tailored dietary and nutritional inputs, nervous-system-aligned exercise, and five-sense sensory leak mitigation.",
      },
      {
        title: "SPATIAL, HOME & OFFICE VASTU",
        text: "Directional Vastu alignment for executive offices and residences—optimizing desk facing, sleep vectors, primary entryways, and property number frequencies to anchor clarity and momentum in the physical space.",
      },
    ],
  },
  {
    number: "WEEK 2",
    title: "WEEK 2: REPROGRAM YOUR SUBCONSCIOUS (MENTAL)",
    subtitle: "Kill Hidden Beliefs · Rewire Why You Act",
    status: "Active Re-Patterning",
    text: "We dive deep into why you do what you do. We dig up the hidden beliefs and mental blocks that cause hesitation, self-sabotage, and friction. Then, we rewire your mind with custom subconscious hypnosis so taking the right, big actions feels completely effortless.",
    deliverables: [
      {
        title: "ROOT CAUSE AUDIT",
        text: "We find the hidden beliefs driving your bad habits, stalling, and second-guessing.",
      },
      {
        title: "SUBCONSCIOUS CLEARING",
        text: "We remove the deep mental blocks stopping you from holding higher levels of wealth and scale.",
      },
      {
        title: "MIND REPROGRAMMING",
        text: "We install custom hypnosis audios matched to your chart so aligned action becomes automatic.",
      },
    ],
  },
  {
    number: "03",
    title: "5D Spiritual Coherence",
    subtitle: "Divine Oneness • Prayer & Chants • Meditative State Creation",
    status: "Optimal Flow State Unlocked",
    text: "The 5D realm aligns the individual with Divine Oneness through prayer, chant, meditative-state creation, and hypnosis—moving beyond the old identity into the state Nancy describes as No Body, No Time, Pure Source.",
    deliverables: [
      {
        title: "Sacred Communion & Prayer",
        text: "Intentional, structured prayer and resonance practices shift the relationship with the Creator from petitioning toward conscious divine partnership.",
      },
      {
        title: "Chants & Meditative State",
        text: "Selected sound practices, mantras and chants, deep meditation, and hypnosis are used to soften ego boundaries and support the experience of No Body, No Time, Pure Source.",
      },
      {
        title: "Aligned Action",
        text: "High-value decisions and execution are approached from greater spiritual coherence, broader possibility, and less dependence on force or willpower burnout.",
      },
    ],
  },
];

const senses = [
  {
    name: "Sight",
    icon: Eye,
    subhead: "Desk & Lighting",
    description: "We fix your screen angles, room lighting, and sightlines to match your Sun and Moon so your eyes and brain don't burn out.",
  },
  {
    name: "Sound",
    icon: Headphones,
    subhead: "Noise & Silence",
    description: "We set up your room's acoustics, background sound, and quiet hours to stop interruptions and keep your focus locked.",
  },
  {
    name: "Smell",
    icon: Wind,
    subhead: "Air & Scents",
    description: "We add the exact natural scents to your office that calm your body based on your chart's best elements.",
  },
  {
    name: "Taste",
    icon: Utensils,
    subhead: "Food & Drink Timing",
    description: "We tune your caffeine, water, and meal timing so your body stays energized when you need to make big moves.",
  },
  {
    name: "Touch",
    icon: Hand,
    subhead: "Furniture & Layout",
    description: "We fix where you sit, what direction you face, and your room setup so your space stops blocking your momentum.",
  },
];

const process = [
  {
    title: "Application & strategic brief",
    text: "Begin with a private conversation about the objective, decision pressure, repeating pattern, current timing, and whether the NancyNYC advisory is the right fit.",
  },
  {
    title: "3D physical & spatial calibration",
    text: "Interpret natal-chart themes, Mahadasha and Antardasha cycles, macro transits, Vastu direction, residential number symbolism, and the five sensory channels shaping the present operating environment.",
  },
  {
    title: "Mental pattern interruption",
    text: "Use high-touchpoint connection, tailored subconscious suggestion, and bespoke audio practices to interrupt repeating thought loops, early imprinting, anxiety patterns, and identity ceilings.",
  },
  {
    title: "5D state creation & embodiment",
    text: "Integrate structured prayer, sacred chants, meditative-state creation, and hypnosis to support Divine Oneness—then translate the state into grounded decisions and execution.",
  },
];

const fitFor = [
  "You have created real momentum, but effort alone is no longer producing the quality of result you want.",
  "You have tried mindset work, meditation, coaching, or hypnosis and sense that the picture is still incomplete.",
  "You are open to astrology as a diagnostic map—and prepared to make practical changes, not only collect insight.",
  "You value privacy, directness, and a method tailored to the pattern beneath your goal.",
];

const notFor = [
  "You want a passive prediction, guaranteed financial outcome, or instant fix without personal participation.",
  "You are unwilling to examine the physical habits and sensory inputs reinforcing your current state.",
  "You need medical or mental-health diagnosis or treatment rather than educational personal-development work.",
];

const faqs = [
  {
    q: "Is this simply hypnosis with a spiritual name?",
    a: "No. NancyNYC begins by stabilizing the 3D physical and spatial container, then interrupts the Mental operating pattern. Hypnosis is one of the state-creation practices used alongside prayer, chants, and meditation in the 5D Spiritual Realm; it is not treated as the entire methodology.",
  },
  {
    q: "Why start with the five senses?",
    a: "The senses are your constant interface with the physical world. What you repeatedly see, hear, smell, taste, and touch influences attention, habit, and state. The NancyNYC method addresses those inputs before asking you to sustain deeper mental or spiritual work.",
  },
  {
    q: "Do I need to understand astrology first?",
    a: "No. The birth chart is used as a structured diagnostic lens inside the method. The goal is to translate that map into practical observations and actions rather than requiring you to become an astrologer.",
  },
  {
    q: "Does hypnosis make me lose control?",
    a: "Hypnosis is generally described as a focused, receptive state—not unconsciousness or surrender of personal agency. Nancy presents it as a way to work with subconscious patterns when conscious effort alone keeps meeting resistance.",
  },
  {
    q: "Is this medical or mental-health treatment?",
    a: "No. The NancyNYC frequency framework is educational and personal-development work. It does not diagnose, treat, or replace medical or mental-health care. Anyone experiencing a health concern or crisis should work with an appropriately licensed professional.",
  },
];

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-4 font-body text-[0.68rem] font-bold uppercase tracking-[0.26em] text-cobalt">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-cobalt/35 text-[0.62rem]">
        {index}
      </span>
      <span>{children}</span>
      <span className="h-px w-12 bg-cobalt/35" />
    </div>
  );
}

function TriPlanarExecutionMap() {
  const layers = [
    {
      index: "03",
      title: "WEEK 3 — 5D SPIRITUAL POWER & FLOW",
      signal: "Divine Oneness • Prayer & Chants • Meditative State Creation",
      status: "Optimal Flow State Unlocked",
      tone: "border-gold/55 bg-gold/[0.08]",
    },
    {
      index: "02",
      title: "WEEK 2 — SUBCONSCIOUS MIND REPROGRAMMING",
      signal: "Subconscious Clearing • Negative Thought Loops • Identity Shift",
      status: "Active Re-Patterning",
      tone: "border-gold/70 bg-gold/[0.1]",
    },
    {
      index: "01",
      title: "WEEK 1 — 3D PHYSICAL & REAL-WORLD AUDIT",
      signal: "Astrological Timing • Vastu & Home Alignment • Five-Sense Energy Leaks",
      status: "Foundational Stabilization",
      tone: "border-white/28 bg-white/[0.055]",
    },
  ];

  return (
    <div className="relative w-full border border-white/18 bg-[#0f1217]/94 p-5 shadow-[0_44px_120px_rgba(0,0,0,0.5)] sm:p-7 lg:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:34px_34px]" />
      <div className="relative mb-7 flex items-start justify-between gap-6 border-b border-white/14 pb-5">
        <div>
          <div className="font-body text-[0.58rem] font-extrabold uppercase tracking-[0.24em] text-cobalt">NancyNYC proprietary framework</div>
          <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-[0.02em] sm:text-4xl">Tri-Planar Execution Map</h2>
        </div>
      </div>

      <div className="relative space-y-3">
        <div className="absolute bottom-12 left-[25px] top-12 z-0 w-px bg-gradient-to-b from-gold via-cobalt to-white/30 sm:left-[31px]" />
        {layers.map((layer) => (
          <div key={layer.index} className={`relative z-10 grid gap-4 border p-4 sm:grid-cols-[64px_1fr] sm:p-5 ${layer.tone}`}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/28 bg-ink font-display text-2xl font-extrabold text-white sm:h-14 sm:w-14 sm:text-3xl">
              {layer.index}
            </div>
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="font-display text-[1.55rem] font-bold uppercase leading-[0.95] sm:text-3xl">{layer.title}</h3>
                  <p className="mt-2 max-w-xl font-body text-sm font-normal leading-6 text-slate-300">{layer.signal}</p>
                </div>
                <div className="border border-white/14 px-2.5 py-2 font-body text-[0.48rem] font-extrabold uppercase tracking-[0.14em] text-white/42">
                  [ {layer.status} ]
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-6 border-t border-white/14 pt-5 font-display text-2xl font-extrabold uppercase tracking-[0.05em] text-white sm:text-3xl">
        RIGHT ACTION. RIGHT TIME. <span className="text-gold">ZERO LEAKS.</span>
      </div>
    </div>
  );
}

function ImprintActivationMap() {
  const imprintSignals = ["Ages 0–8", "Early Mahadasha", "Open patterning", "Foundational beliefs"];
  const activationSignals = ["Present day", "Current Mahadasha", "Transit pressure", "Sensory trigger"];

  return (
    <article className="border border-white/14 bg-[#12151b] p-5 text-white shadow-[0_30px_80px_rgba(0,0,0,0.24)] sm:p-8">
      <div className="flex items-start justify-between gap-5 border-b border-white/12 pb-5">
        <div>
          <p className="font-body text-[0.56rem] font-extrabold uppercase tracking-[0.23em] text-cobalt">NancyNYC proprietary framework · Fig. 02</p>
          <h3 className="mt-3 font-display text-3xl font-extrabold uppercase leading-none sm:text-5xl">The imprint–activation circuit</h3>
        </div>
        <div className="hidden border border-white/12 px-3 py-2 font-body text-[0.48rem] font-bold uppercase tracking-[0.16em] text-slate-500 sm:block">Symbolic timing model</div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_76px_1fr_76px_1.1fr] lg:items-stretch">
        <div className="border border-gold/45 bg-white/[0.025] p-5 sm:p-6">
          <div className="font-body text-[0.52rem] font-extrabold uppercase tracking-[0.2em] text-gold">01 / Foundational imprint</div>
          <h4 className="mt-3 font-display text-3xl font-extrabold uppercase leading-none">The first pattern</h4>
          <div className="mt-5 border-t border-white/12">
            {imprintSignals.map((signal) => <div key={signal} className="border-b border-white/10 py-3 font-body text-[0.58rem] font-bold uppercase tracking-[0.12em] text-slate-300">{signal}</div>)}
          </div>
        </div>

        <div className="flex items-center justify-center font-display text-5xl font-extrabold text-cobalt lg:text-6xl">＋</div>

        <div className="border border-gold/45 bg-gold/[0.055] p-5 sm:p-6">
          <div className="font-body text-[0.52rem] font-extrabold uppercase tracking-[0.2em] text-gold">02 / Current activation</div>
          <h4 className="mt-3 font-display text-3xl font-extrabold uppercase leading-none">What triggers it now</h4>
          <div className="mt-5 border-t border-white/12">
            {activationSignals.map((signal) => <div key={signal} className="border-b border-white/10 py-3 font-body text-[0.58rem] font-bold uppercase tracking-[0.12em] text-slate-300">{signal}</div>)}
          </div>
        </div>

        <div className="flex items-center justify-center font-display text-5xl font-extrabold text-cobalt lg:text-6xl">→</div>

        <div className="relative overflow-hidden bg-ink p-5 text-white sm:p-6">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-cobalt/30" />
          <div className="relative font-body text-[0.52rem] font-extrabold uppercase tracking-[0.2em] text-white/82">03 / Present output</div>
          <h4 className="relative mt-3 font-display text-4xl font-extrabold uppercase leading-none">The adult thought loop</h4>
          <p className="relative mt-5 font-body text-sm leading-6 text-white/82">The past pattern is reactivated by the present signal, then experienced as identity, emotion, decision, and repeated result.</p>
          <div className="relative mt-6 border-l-2 border-gold pl-4 font-serif text-xl italic text-white/90">Do not fight the output. Find the circuit.</div>
        </div>
      </div>

      <p className="mt-6 border-l-2 border-gold pl-4 font-body text-[0.58rem] font-semibold leading-5 tracking-[0.06em] text-slate-400">
        This diagram expresses NancyNYC’s symbolic developmental and astrological model. It is not a clinical account of childhood cognition or a claim of neurological causation.
      </p>
    </article>
  );
}

function BrainwaveAccessMechanics() {
  const states = [
    ["01 / STRESSED", "Racing thoughts · In fight-or-flight · Zero changes stick"],
    ["02 / BUSY FOCUS", "Everyday grind · High mental friction · Guard is up"],
    ["03 / RELAXED", "Body slows down · Mental walls start to drop"],
    ["04 / SUBCONSCIOUS REPROGRAM", "Deep hypnosis · We delete old blocks & install your new beliefs"],
    ["05 / OPEN TO RECEIVE", "Total ego stillness · Surrender · Unexpected wins & synchronicity happen"],
  ];

  return (
    <article className="border border-white/16 bg-[#080c19] p-5 text-white shadow-[0_30px_80px_rgba(4,7,17,0.2)] sm:p-8">
      <div className="flex items-start justify-between gap-5 border-b border-white/12 pb-5">
        <div>
          <p className="font-body text-[0.56rem] font-extrabold uppercase tracking-[0.23em] text-cobalt">NancyNYC proprietary framework · Fig. 03</p>
          <h3 className="mt-3 font-display text-3xl font-extrabold uppercase leading-none sm:text-5xl">WHERE YOUR BRAIN ACTUALLY REWIRES</h3>
        </div>
        <div className="hidden border border-white/12 px-3 py-2 font-body text-[0.48rem] font-bold uppercase tracking-[0.16em] text-white/35 sm:block">Conceptual state curve</div>
      </div>

      <div className="relative mt-7 overflow-hidden border border-white/10 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:38px_38px] p-3 sm:p-5">
        <svg viewBox="0 0 760 250" className="h-auto w-full" role="img" aria-label="Conceptual thought-frequency curve moving from stress through busy focus, relaxation, subconscious reprogramming, and openness to receive">
          <defs>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c9a65a" />
              <stop offset="48%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#e8e2d3" />
            </linearGradient>
            <linearGradient id="accessGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <rect x="538" y="18" width="126" height="212" fill="url(#accessGradient)" stroke="#d4af37" strokeOpacity="0.42" />
          <text x="544" y="39" fill="#e5c07b" fontSize="7" letterSpacing="1.2">THE REWRITE &amp; RECEIVING ZONE</text>
          {[50, 100, 150, 200].map((y) => <line key={y} x1="20" y1={y} x2="740" y2={y} stroke="white" strokeOpacity="0.08" />)}
          <path d="M24 62 L58 25 L92 102 L128 44 L164 120 C212 78 240 86 280 116 C330 153 372 142 414 158 C462 178 500 170 552 182 C596 192 636 193 680 198 C704 201 722 201 740 202" fill="none" stroke="url(#curveGradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {[[92,102],[244,93],[414,158],[596,192],[724,201]].map(([x,y]) => (
            <g key={`point-${x}-${y}`}>
              <circle cx={x} cy={y} r="8" fill="#080c19" stroke={x === 92 ? "#c9a65a" : x < 700 ? "#d4af37" : "#e8e2d3"} strokeWidth="3" />
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-5">
        {states.map(([title, detail]) => (
          <div key={title} className="bg-[#080c19] p-4">
            <div className="font-display text-lg font-bold uppercase leading-none">{title}</div>
            <div className="mt-3 font-body text-[0.68rem] font-medium leading-5 text-white/55">{detail}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-white/12 pt-5">
        <p className="font-body text-sm font-semibold leading-6 text-white/72">You cannot force new habits when your mind is stressed. In Stage 04, we rewrite your subconscious mind so taking big action feels natural. In Stage 05, you quiet the ego completely—opening the door for massive, unexpected wins to flow in.</p>
      </div>
    </article>
  );
}

type FunnelStep = 1 | 2 | 3 | 4 | 5 | 6;
type InvestmentReadiness = "ready" | "not-ready";
type ApplicationData = {
  bottleneck: string;
  transformation: string;
  primaryRole: string;
  revenueRange: string;
  ventureUrl: string;
  fullName: string;
  email: string;
  phone: string;
  birthDataStatus: string;
  investment: InvestmentReadiness | "";
};

const initialApplicationData: ApplicationData = {
  bottleneck: "",
  transformation: "",
  primaryRole: "",
  revenueRange: "",
  ventureUrl: "",
  fullName: "",
  email: "",
  phone: "",
  birthDataStatus: "",
  investment: "",
};

const primaryRoleOptions = [
  "Founder / Business Owner",
  "C-Suite / Senior Executive",
  "Operator / Consultant",
  "Other Professional",
];

const birthDataOptions = [
  "Yes, exact birth certificate time available",
  "Approximate time known",
  "Need to locate birth records",
];

function QualificationDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState<FunnelStep>(1);
  const [application, setApplication] = useState<ApplicationData>(initialApplicationData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const attempt = useRef<{ signature: string; submissionId: string } | null>(null);
  const submitted = useRef<string | null>(null);
  const requestSequence = useRef(0);
  const acuityConfigured = !ACUITY_OWNER_ID.startsWith("YOUR_") && !ACUITY_APPOINTMENT_TYPE_ID.startsWith("YOUR_");
  const [firstName, ...lastNameParts] = application.fullName.trim().split(" ");
  const lastName = lastNameParts.join(" ");
  const acuityQuery = new URLSearchParams({
    owner: ACUITY_OWNER_ID,
    appointmentType: ACUITY_APPOINTMENT_TYPE_ID,
    first_name: firstName || "",
    last_name: lastName || "",
    email: application.email.trim(),
    phone: application.phone.trim(),
  });
  const acuityEmbedUrl = `https://app.acuityscheduling.com/schedule.php?${acuityQuery.toString()}`;
  const stepLabels = ["Bottleneck", "Transformation", "Background", "Contact & birth data", "Investment", "Scheduling"];

  useEffect(() => {
    if (!open) {
      requestSequence.current += 1;
      const timer = window.setTimeout(() => {
        setStep(1);
        setApplication(initialApplicationData);
        setErrors({});
        setSubmitting(false);
        setSubmitError("");
        attempt.current = null;
        submitted.current = null;
      }, 180);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  const updateField = (field: keyof ApplicationData, value: string) => {
    setApplication((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const validateCurrentStep = () => {
    const nextErrors: Record<string, string> = {};

    if (step === 1 && !application.bottleneck.trim()) {
      nextErrors.bottleneck = "Please describe the primary bottleneck before continuing.";
    }
    if (step === 2 && !application.transformation.trim()) {
      nextErrors.transformation = "Please describe the transformation you want to create.";
    }
    if (step === 3) {
      if (!application.primaryRole) nextErrors.primaryRole = "Select the role that best describes you.";
      if (application.ventureUrl.trim()) {
        try {
          const candidate = application.ventureUrl.includes("://") ? application.ventureUrl : `https://${application.ventureUrl}`;
          const url = new URL(candidate);
          if (!new Set(["http:", "https:"]).has(url.protocol) || !url.hostname.includes(".")) throw new Error("Invalid URL");
        } catch {
          nextErrors.ventureUrl = "Enter a valid website or LinkedIn URL.";
        }
      }
    }
    if (step === 4) {
      if (!application.fullName.trim()) nextErrors.fullName = "Your full legal name is required.";
      if (!/^\S+@\S+\.\S+$/.test(application.email.trim())) nextErrors.email = "Enter a valid work email address.";
      if (!application.phone.trim()) nextErrors.phone = "Your direct WhatsApp or mobile number is required.";
      if (!application.birthDataStatus) nextErrors.birthDataStatus = "Select the option that matches your birth-data access.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const advance = () => {
    if (!validateCurrentStep()) return;
    setStep((current) => Math.min(6, current + 1) as FunnelStep);
  };

  const goBack = () => {
    setErrors({});
    setStep((current) => Math.max(1, current - 1) as FunnelStep);
  };

  const chooseInvestment = async (value: InvestmentReadiness) => {
    if (submitting) return;
    const payload = { ...application, investment: value };
    const signature = JSON.stringify(payload);
    if (submitted.current === signature) {
      updateField("investment", value);
      setStep(6);
      return;
    }
    if (attempt.current?.signature !== signature) {
      attempt.current = { signature, submissionId: crypto.randomUUID() };
    }
    const sequence = ++requestSequence.current;
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, submissionId: attempt.current.submissionId }),
        cache: "no-store",
        credentials: "same-origin",
      });
      const result = await response.json().catch(() => null) as { accepted?: boolean; receipt?: string; error?: string } | null;
      if (!response.ok || !result?.accepted || !result.receipt) {
        throw new Error(result?.error || "Your application could not be delivered. Please retry.");
      }
      if (sequence !== requestSequence.current) return;
      submitted.current = signature;
      updateField("investment", value);
      setStep(6);
    } catch (error) {
      if (sequence === requestSequence.current) {
        setSubmitError(error instanceof Error && error.message !== "Failed to fetch" ? error.message : "Your application could not be delivered. Please retry.");
      }
    } finally {
      if (sequence === requestSequence.current) setSubmitting(false);
    }
  };

  const exitToHome = () => {
    onOpenChange(false);
    window.setTimeout(() => {
      document.getElementById("top")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 180);
  };

  const controlClasses = "mt-4 w-full border border-white/16 bg-white/[0.035] px-4 py-4 font-body text-base leading-7 text-white outline-none transition-colors placeholder:text-white/34 focus:border-gold focus:ring-1 focus:ring-gold/45";
  const optionClasses = (selected: boolean) => `group flex w-full items-start gap-4 border p-4 text-left transition-colors active:scale-[0.985] ${selected ? "border-gold bg-gold/10" : "border-white/14 bg-white/[0.035] hover:border-gold/65 hover:bg-gold/[0.06]"}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] max-w-[960px] overflow-y-auto rounded-none border-white/14 bg-ink p-0 text-white shadow-[0_45px_140px_rgba(0,0,0,0.65)] sm:max-h-[calc(100vh-2rem)] sm:max-w-[960px]">
        <div className="relative overflow-hidden border-b border-white/12 px-5 py-5 pr-28 sm:px-9 sm:py-6 sm:pr-40">
          <img src={ORBITAL_FIELD} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25 saturate-[0.45]" />
          <img src={DIALOG_PORTRAIT} alt="" className="pointer-events-none absolute inset-y-0 right-0 h-full w-28 object-contain object-right opacity-90 sm:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-r from-ink via-ink/50 to-transparent sm:w-56" />
          <div className="relative flex items-center gap-4">
            <img src={FREQUENCY_MARK} alt="" className="h-11 w-11 object-contain sm:h-12 sm:w-12" />
            <div>
              <div className="font-display text-2xl font-extrabold tracking-[0.16em]">NANCYNYC</div>
              <div className="mt-1 font-body text-[0.58rem] font-extrabold uppercase tracking-[0.2em] text-white/64">Private advisory application</div>
            </div>
          </div>
        </div>

        <div className="px-5 py-7 sm:px-9 sm:py-9">
          <div className="mb-8 flex items-center gap-4">
            <div className="shrink-0 font-body text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-gold">0{step} / 06</div>
            <div className="grid flex-1 grid-cols-6 gap-1" aria-hidden="true">
              {[1, 2, 3, 4, 5, 6].map((progressStep) => (
                <span key={progressStep} className={`h-px ${progressStep <= step ? "bg-gold" : "bg-white/14"}`} />
              ))}
            </div>
            <div className="hidden shrink-0 font-body text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white/48 sm:block">{step === 6 && application.investment === "not-ready" ? "Outcome" : stepLabels[step - 1]}</div>
          </div>

          {step === 1 && (
            <div>
              <DialogTitle className="max-w-3xl font-display text-3xl font-bold leading-[0.98] tracking-[-0.015em] sm:text-5xl">
                What is the biggest operational or internal bottleneck currently keeping you from executing at the level you know you&apos;re capable of?
              </DialogTitle>
              <DialogDescription className="sr-only">Step 1 of 6: describe your current bottleneck.</DialogDescription>
              <textarea
                aria-label="The Bottleneck"
                aria-invalid={Boolean(errors.bottleneck)}
                value={application.bottleneck}
                onChange={(event) => updateField("bottleneck", event.target.value)}
                placeholder="Detail what is stalling your momentum, timing, physical energy, or revenue..."
                rows={7}
                className={`${controlClasses} min-h-44 resize-y`}
              />
              {errors.bottleneck && <p className="mt-2 font-body text-sm text-rose-300">{errors.bottleneck}</p>}
            </div>
          )}

          {step === 2 && (
            <div>
              <DialogTitle className="max-w-3xl font-display text-3xl font-bold leading-[0.98] tracking-[-0.015em] sm:text-5xl">
                If you could remove this friction and align your execution completely, what would your ideal life and business look like?
              </DialogTitle>
              <DialogDescription className="sr-only">Step 2 of 6: describe your desired transformation.</DialogDescription>
              <textarea
                aria-label="The Desired Transformation"
                aria-invalid={Boolean(errors.transformation)}
                value={application.transformation}
                onChange={(event) => updateField("transformation", event.target.value)}
                placeholder="Describe your target revenue, operational ease, and daily state..."
                rows={7}
                className={`${controlClasses} min-h-44 resize-y`}
              />
              {errors.transformation && <p className="mt-2 font-body text-sm text-rose-300">{errors.transformation}</p>}
            </div>
          )}

          {step === 3 && (
            <div>
              <DialogTitle className="font-display text-4xl font-extrabold uppercase leading-none tracking-[-0.015em] sm:text-6xl">Professional background</DialogTitle>
              <DialogDescription className="sr-only">Step 3 of 6: professional role and primary venture.</DialogDescription>
              <fieldset className="mt-8">
                <legend className="font-body text-base font-bold text-white sm:text-lg">Which best describes your primary role?</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Primary role">
                  {primaryRoleOptions.map((role) => (
                    <button key={role} type="button" role="radio" aria-checked={application.primaryRole === role} onClick={() => updateField("primaryRole", role)} className={optionClasses(application.primaryRole === role)}>
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${application.primaryRole === role ? "border-gold bg-gold" : "border-white/35"}`}>
                        {application.primaryRole === role && <span className="h-1.5 w-1.5 rounded-full bg-ink" />}
                      </span>
                      <span className="font-body text-sm font-semibold leading-6 text-white/82">{role}</span>
                    </button>
                  ))}
                </div>
                {errors.primaryRole && <p className="mt-2 font-body text-sm text-rose-300">{errors.primaryRole}</p>}
              </fieldset>
              <label className="mt-8 block font-body text-base font-bold text-white sm:text-lg" htmlFor="revenue-range">Current Annual Revenue or Compensation Range (Optional)</label>
              <input
                id="revenue-range"
                type="text"
                aria-invalid={Boolean(errors.revenueRange)}
                value={application.revenueRange}
                onChange={(event) => updateField("revenueRange", event.target.value)}
                placeholder="e.g., $1M–$3M in annual revenue"
                className={controlClasses}
              />
              {errors.revenueRange && <p className="mt-2 font-body text-sm text-rose-300">{errors.revenueRange}</p>}
              <label className="mt-8 block font-body text-base font-bold text-white sm:text-lg" htmlFor="venture-url">Primary Venture Website or Executive LinkedIn URL (Optional)</label>
              <input
                id="venture-url"
                type="url"
                inputMode="url"
                autoComplete="url"
                aria-invalid={Boolean(errors.ventureUrl)}
                value={application.ventureUrl}
                onChange={(event) => updateField("ventureUrl", event.target.value)}
                placeholder="https://yourcompany.com or https://linkedin.com/in/..."
                className={controlClasses}
              />
              <p className="mt-2 font-body text-sm leading-6 text-white/60">Optional — leave blank if private or operating under NDA.</p>
              {errors.ventureUrl && <p className="mt-2 font-body text-sm text-rose-300">{errors.ventureUrl}</p>}
            </div>
          )}

          {step === 4 && (
            <div>
              <DialogTitle className="font-display text-4xl font-extrabold uppercase leading-none tracking-[-0.015em] sm:text-6xl">Contact &amp; birth data</DialogTitle>
              <DialogDescription className="sr-only">Step 4 of 6: contact information and birth-data access.</DialogDescription>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <label className="font-body text-sm font-bold text-white">
                  Full Legal Name
                  <input type="text" required autoComplete="name" aria-invalid={Boolean(errors.fullName)} value={application.fullName} onChange={(event) => updateField("fullName", event.target.value)} className={controlClasses} />
                  {errors.fullName && <span className="mt-2 block font-normal text-rose-300">{errors.fullName}</span>}
                </label>
                <label className="font-body text-sm font-bold text-white">
                  Direct Work Email
                  <input type="email" required autoComplete="email" aria-invalid={Boolean(errors.email)} value={application.email} onChange={(event) => updateField("email", event.target.value)} className={controlClasses} />
                  {errors.email && <span className="mt-2 block font-normal text-rose-300">{errors.email}</span>}
                </label>
                <label className="font-body text-sm font-bold text-white sm:col-span-2">
                  Direct WhatsApp / Mobile Phone
                  <input type="tel" required autoComplete="tel" aria-invalid={Boolean(errors.phone)} value={application.phone} onChange={(event) => updateField("phone", event.target.value)} className={controlClasses} />
                  {errors.phone && <span className="mt-2 block font-normal text-rose-300">{errors.phone}</span>}
                </label>
              </div>
              <fieldset className="mt-8">
                <legend className="font-body text-base font-bold leading-7 text-white sm:text-lg">Do you have access to your exact birth date, birth time, and birth city for your planetary timing audit?</legend>
                <div className="mt-4 grid gap-3" role="radiogroup" aria-label="Birth data access">
                  {birthDataOptions.map((option) => (
                    <button key={option} type="button" role="radio" aria-checked={application.birthDataStatus === option} onClick={() => updateField("birthDataStatus", option)} className={optionClasses(application.birthDataStatus === option)}>
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${application.birthDataStatus === option ? "border-gold bg-gold" : "border-white/35"}`}>
                        {application.birthDataStatus === option && <span className="h-1.5 w-1.5 rounded-full bg-ink" />}
                      </span>
                      <span className="font-body text-sm font-semibold leading-6 text-white/82">{option}</span>
                    </button>
                  ))}
                </div>
                {errors.birthDataStatus && <p className="mt-2 font-body text-sm text-rose-300">{errors.birthDataStatus}</p>}
              </fieldset>
            </div>
          )}

          {step === 5 && (
            <div>
              <DialogTitle className="max-w-3xl font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-[-0.02em] sm:text-6xl">CONFIRM INVESTMENT READINESS</DialogTitle>
              <DialogDescription className="mt-5 max-w-2xl font-body text-base leading-7 text-white/72 sm:text-lg sm:leading-8">The 3-Week Tri-Planar Intensive requires a fixed investment of $15,000 USD.</DialogDescription>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <button type="button" disabled={submitting} onClick={() => void chooseInvestment("ready")} className={`${optionClasses(application.investment === "ready")} disabled:cursor-wait disabled:opacity-50`}>
                  <div>
                    <div className="font-display text-2xl font-bold uppercase leading-none">YES — $15,000 AVAILABLE</div>
                    <p className="mt-4 font-body text-sm leading-6 text-white/68">Capital is allocated and ready to invest to secure the 3-week intensive.</p>
                  </div>
                </button>
                <button type="button" disabled={submitting} onClick={() => void chooseInvestment("not-ready")} className={`${optionClasses(application.investment === "not-ready")} disabled:cursor-wait disabled:opacity-50`}>
                  <div>
                    <div className="font-display text-2xl font-bold uppercase leading-none">NOT AT THIS TIME</div>
                    <p className="mt-4 font-body text-sm leading-6 text-white/68">I am not positioned to make a $15,000 investment right now.</p>
                  </div>
                </button>
              </div>
              {submitting && <p role="status" className="mt-4 font-body text-sm text-gold">Sending your private application securely...</p>}
              {submitError && <p role="alert" className="mt-4 font-body text-sm text-rose-300">{submitError}</p>}
              <button type="button" disabled={submitting} onClick={goBack} className="mt-6 font-body text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-white disabled:opacity-50">← Back to contact &amp; birth data</button>
            </div>
          )}

          {step === 6 && application.investment === "not-ready" && (
            <div>
              <DialogTitle className="sr-only">Application outcome</DialogTitle>
              <DialogDescription className="sr-only">Investment readiness requirement.</DialogDescription>
              <div className="border border-gold/30 bg-gold/[0.07] p-6 sm:p-8">
                <p className="font-display text-3xl font-bold leading-[1.02] text-white sm:text-5xl">The 3-Week Tri-Planar Intensive requires a fixed investment of $15,000 USD. We suggest you apply again when you are positioned and ready to invest in your transformation at this level.</p>
              </div>
              <button type="button" onClick={exitToHome} className="mt-8 inline-flex border border-white/20 px-6 py-4 font-body text-xs font-extrabold uppercase tracking-[0.17em] text-white/72 transition-colors hover:border-white hover:text-white active:scale-[0.97] sm:text-sm">Return to home</button>
            </div>
          )}

          {step === 6 && application.investment === "ready" && (
            <div>
              <div className="font-body text-[0.6rem] font-extrabold uppercase tracking-[0.22em] text-gold">BY INVITATION ONLY</div>
              <DialogTitle className="max-w-3xl font-display text-4xl font-extrabold leading-[0.9] tracking-[-0.02em] sm:text-6xl">Private Sequence &amp; Timing Audit</DialogTitle>
              <DialogDescription className="mt-5 max-w-3xl font-body text-base leading-7 text-white/72 sm:text-lg sm:leading-8">Schedule your executive diagnostic session through the calendar below.</DialogDescription>
              <div className="mt-8 border border-gold/30 bg-gold/[0.07] p-5 sm:p-7">
                <div className="font-body text-[0.66rem] font-extrabold tracking-[0.18em] text-gold sm:text-xs">45 min | Executive Diagnostic</div>
                <p className="mt-4 max-w-4xl font-body text-sm leading-7 text-white/72 sm:text-base sm:leading-8">This is a private consultation for high-performing founders and executive leaders ready to audit their planetary timing cycles, clear subconscious ceilings, and realign their physical environment for effortless execution. During this session, we will break down your sequence leaks, pinpoint the friction holding you back, and determine if you are a fit for the 3-Week Tri-Planar Intensive.</p>
              </div>
              <div className="relative mx-auto mt-8 min-h-[850px] w-full max-w-[900px] overflow-visible border-0 bg-[#0B0D11]">
                <iframe
                  title="Acuity Scheduling — Private Sequence & Timing Audit"
                  src={acuityConfigured ? acuityEmbedUrl : "about:blank"}
                  data-acuity-embed-url={acuityEmbedUrl}
                  className="block min-h-[850px] w-full overflow-visible border-0 bg-white"
                  style={{ width: "100%", minHeight: "850px", border: "none", overflow: "visible" }}
                  scrolling="yes"
                  loading="eager"
                />
                {!acuityConfigured && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0B0D11] p-6 text-center">
                    <div className="max-w-md border border-gold/30 bg-gold/[0.07] p-6 sm:p-8">
                      <div className="font-body text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-gold">Private calendar connection pending</div>
                      <p className="mt-4 font-display text-3xl font-bold uppercase leading-none">Executive scheduling will appear here</p>
                      <p className="mt-4 font-body text-sm leading-6 text-white/64">The private Acuity calendar activates here as soon as the owner and appointment-type IDs are connected.</p>
                    </div>
                  </div>
                )}
              </div>
              <button type="button" onClick={() => { setStep(5); updateField("investment", ""); }} className="mt-6 font-body text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-white">← Back to investment readiness</button>
            </div>
          )}

          {step < 5 && (
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
              {step > 1 ? (
                <button type="button" onClick={goBack} className="px-2 py-3 text-left font-body text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-white/58 transition-colors hover:text-white">← Back</button>
              ) : <span />}
              <button type="button" onClick={advance} className="inline-flex items-center justify-center gap-3 bg-gold px-7 py-4 font-body text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-white active:scale-[0.985]">Continue <ArrowUpRight className="h-4 w-4" /></button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.62, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [qualifierOpen, setQualifierOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openQualifier = () => {
    setMenuOpen(false);
    setQualifierOpen(true);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-ink text-white selection:bg-gold selection:text-ink">
      <QualificationDialog open={qualifierOpen} onOpenChange={setQualifierOpen} />
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-200 ${
          scrolled
            ? "border-white/10 bg-ink/92 shadow-[0_16px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl"
            : "border-transparent bg-ink/35 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-[88px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#top" className="group flex items-center gap-3" aria-label="NancyNYC home">
            <img
              src={FREQUENCY_MARK}
              alt=""
              className="h-14 w-14 object-contain transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105"
            />
            <div className="leading-none text-white">
              <div className="font-display text-[1.42rem] font-extrabold tracking-[0.18em]">NANCYNYC</div>
              <div className="mt-1 font-body text-[0.47rem] font-bold uppercase tracking-[0.25em] text-white/54">
                Millionaire Astrologer &amp; Hypnotist
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-body text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/68 transition-colors hover:text-white focus-visible:text-white"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={openQualifier}
              className="group inline-flex items-center gap-3 bg-gold px-5 py-3 font-body text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-ink shadow-[0_10px_34px_rgba(212,175,55,0.15)] transition-colors hover:bg-white active:scale-[0.97]"
            >
              Apply Now
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </nav>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center border border-white/18 text-white lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-ink px-5 py-5 text-white lg:hidden">
            <div className="flex flex-col">
              {navItems.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-white/10 py-4 font-display text-2xl font-semibold uppercase tracking-[0.04em]"
                >
                  {item.label}
                  <span className="font-body text-[0.62rem] tracking-[0.2em] text-cobalt">0{index + 1}</span>
                </a>
              ))}
              <button
                type="button"
                onClick={openQualifier}
                className="mt-5 inline-flex items-center justify-center gap-3 bg-gold px-5 py-4 font-body text-xs font-extrabold uppercase tracking-[0.16em] text-ink"
              >
                Apply for private work <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="top" className="relative isolate min-h-[940px] overflow-hidden bg-ink text-white lg:min-h-[920px]">
          <img
            src={ORBITAL_FIELD}
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-65 saturate-[0.55]"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(11,13,17,0.99)_0%,rgba(11,13,17,0.94)_48%,rgba(11,13,17,0.56)_100%)]" />
          <div className="absolute inset-x-0 top-[88px] h-px bg-white/10" />

          <div className="mx-auto grid min-h-[940px] max-w-[1500px] grid-cols-1 px-5 pb-16 pt-36 sm:px-8 lg:min-h-[920px] lg:grid-cols-[1.03fr_0.97fr] lg:px-12 lg:pb-0 lg:pt-[156px]">
            <div className="relative z-10 flex flex-col justify-between pb-12 lg:pb-16 lg:pr-12">
              <Reveal>
                <div className="mb-8 flex items-center gap-4 font-body text-[0.68rem] font-bold uppercase tracking-[0.25em] text-white/58">
                  <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_0_7px_rgba(212,175,55,0.14)]" />
                  Private advisory · by application
                </div>
                <h1 className="max-w-[880px] font-display text-[clamp(3.4rem,5.3vw,6.9rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.045em]">
                  <span className="block text-white">YOU DID EVERYTHING RIGHT.</span>
                  <span className="mt-3 block text-gold">SO WHY DOES IT STILL HURT?</span>
                </h1>
              </Reveal>

              <Reveal delay={0.12} className="mt-14 flex flex-col gap-8 border-t border-white/14 pt-8">
                <p className="max-w-xl font-body text-lg leading-[1.6] text-slate-300">
                  To everyone around you, you’re holding it together. Inside, you are carrying an exhaustion and quiet hopelessness that willpower and mindset tricks cannot fix. When your 3D reality, mental subconscious wiring, and 5D spiritual power pull in opposite directions, extra effort only compounds the pain. Nancy NYC conducts a private 3-week recalibration across all 3 planes—so the internal suffering ends and your life finally shifts.
                </p>
                <div className="max-w-xl rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.24)] sm:p-5">
                  <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-b border-slate-800/80 py-2.5 font-mono text-xs leading-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:text-sm">
                    <span className="col-span-2 font-semibold text-rose-300/80 sm:col-span-1">[ ✗ WRONG TIME ]</span>
                    <span className="text-slate-400 sm:text-center">+ Right Action</span>
                    <span className="text-right font-semibold text-rose-200">= Pain &amp; Exhaustion</span>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 py-2.5 font-mono text-xs leading-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:text-sm">
                    <span className="col-span-2 font-semibold text-amber-300 sm:col-span-1">[ ✓ RIGHT TIME ]</span>
                    <span className="text-slate-300 sm:text-center">+ Right Action</span>
                    <span className="text-right font-semibold text-amber-200">= Effortless Relief &amp; Scale</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={openQualifier}
                    className="group inline-flex items-center justify-center gap-4 bg-gold px-6 py-4 font-body text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-ink shadow-[0_12px_36px_rgba(212,175,55,0.16)] transition-colors hover:bg-white active:scale-[0.97]"
                  >
                    Apply for private advisory
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <a
                    href="#method"
                    className="inline-flex items-center justify-center gap-3 border border-slate-700 px-6 py-4 font-body text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-slate-100 transition-colors hover:border-gold hover:text-gold active:scale-[0.97]"
                  >
                    Explore the framework
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.18} className="relative flex flex-col justify-end lg:pl-5">
              <TriPlanarExecutionMap />
              <div className="mt-4 flex items-start gap-4 border-l border-gold/55 pl-4 font-body text-[0.62rem] font-bold uppercase leading-5 tracking-[0.15em] text-white/45">
                  <span className="text-gold">Fig. 01</span>
                The Tri-Planar Execution Map: 3D stabilization, Mental re-patterning, and 5D Divine creation.
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-[#0f1217] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12 lg:py-40">
          <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
            <Reveal>
              <SectionLabel index="01">The hidden ceiling</SectionLabel>
                <div className="max-w-sm font-serif text-3xl italic leading-tight text-slate-300 sm:text-4xl">
                  “Your desire is not years away. The active signal is one frequency shift away.”
                </div>
                <div className="mt-10 max-w-[280px] -rotate-2 border-l-2 border-gold bg-white/[0.04] px-5 py-4 font-serif text-xl italic leading-snug text-slate-300 shadow-[8px_12px_0_rgba(212,175,55,0.08)]">
                  3D → Mental → 5D
                </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display text-[clamp(3.5rem,7vw,7.5rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.04em] text-white">
                The ceiling hypnosis alone cannot reach.
              </h2>
              <div className="mt-12 grid gap-8 border-t border-white/12 pt-8 md:grid-cols-2">
                <p className="font-body text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                  Hypnosis can create a powerful state of access. But if Vastu, directional alignment, timing,
                  relationships, sensory leaks, and daily habits keep recreating the same 3D pressure, the old
                  Mental pattern can return as soon as ordinary life resumes.
                </p>
                <p className="font-body text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                  The issue is not effort, information, or ambition. NancyNYC stabilizes the 3D container,
                  interrupts the Mental operating pattern, then uses prayer, chants, meditation, and hypnosis to
                  support 5D alignment with Divine Oneness.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="method" className="relative overflow-hidden bg-ink px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12 lg:py-40">
          <img
            src={WHITEBOARD_TEXTURE}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-screen"
          />
          <div className="relative mx-auto max-w-[1400px]">
            <Reveal className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
              <div>
                <SectionLabel index="02">The three-plane method</SectionLabel>
                <p className="max-w-md font-body text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                  This is the operating sequence: optimize the 3D to your Birth Chart → upgrade Mental
                  Reprogramming → then access the 5D realm of unshakeable Oneness, Peace, and Power.
                </p>
              </div>
              <h2 className="font-display text-[clamp(4.2rem,8.4vw,9.5rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.05em]">
                The full 3D → Mental
                <br />
                → 5D sequence.
              </h2>
            </Reveal>

            <div className="mt-20 border-t border-white/14 lg:mt-28">
              {planes.map((plane, index) => (
                <Reveal key={plane.title} delay={index * 0.05}>
                  <article className="group grid gap-6 border-b border-white/14 py-10 transition-colors hover:bg-gold/[0.035] md:grid-cols-[120px_0.72fr_1.28fr] md:items-start md:gap-10 lg:py-14">
                    {plane.number.startsWith("WEEK") ? (
                      <div className="inline-flex w-fit border border-cobalt/30 bg-cobalt/[0.06] px-3 py-2 font-body text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-cobalt">
                        {plane.number}
                      </div>
                    ) : (
                      <div className="font-display text-6xl font-extrabold leading-none text-cobalt/25 transition-colors group-hover:text-cobalt md:text-7xl">
                        {plane.number}
                      </div>
                    )}
                    <div>
                      <h3 className="font-display text-4xl font-bold uppercase leading-[0.92] sm:text-5xl">{plane.title}</h3>
                      <p className="mt-3 font-body text-[0.67rem] font-extrabold uppercase tracking-[0.2em] text-cobalt">
                        {plane.subtitle}
                      </p>
                      <div className="mt-5 inline-flex border border-white/16 px-3 py-2 font-body text-[0.52rem] font-extrabold uppercase tracking-[0.16em] text-slate-400">[ {plane.status} ]</div>
                    </div>
                    <div>
                      {/* Keep methodology copy on fresh source locators so retired visual-editor text patches cannot reapply. */}
                      <p className="max-w-2xl font-body text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">{plane.text}</p>
                      <div className="mt-7 grid gap-px bg-white/12">
                        {plane.deliverables.map((deliverable, deliverableIndex) => (
                          <div key={deliverable.title} className="grid gap-2 bg-[#12151b] p-4 sm:grid-cols-[42px_0.42fr_1fr] sm:items-start sm:p-5">
                            <span className="font-body text-[0.52rem] font-extrabold tracking-[0.16em] text-cobalt">0{deliverableIndex + 1}</span>
                            <h4 className="font-display text-xl font-bold uppercase leading-none">{deliverable.title}</h4>
                            {/* The visible description remains data-driven; only its editor locator is refreshed. */}
                            <p className="font-body text-sm leading-6 text-slate-400">{deliverable.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-white/10 bg-ink px-5 py-14 text-white sm:px-8 lg:px-12 lg:py-18">
          <img src={ORBITAL_FIELD} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 saturate-[0.45]" />
          <div className="relative mx-auto flex max-w-[1400px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <img src={FREQUENCY_MARK} alt="NancyNYC frequency mark" className="h-20 w-20 object-contain sm:h-24 sm:w-24" />
              <div>
                <div className="font-display text-5xl font-extrabold uppercase tracking-[0.12em] sm:text-7xl">NancyNYC</div>
                <div className="mt-2 font-body text-[0.6rem] font-extrabold uppercase tracking-[0.3em] text-gold">The integrated frequency method</div>
              </div>
            </div>
            <div className="flex items-center gap-3 font-serif text-2xl italic text-white/62 sm:text-3xl">
              <span>3D</span><span className="text-cobalt">↑</span><span>Mental</span><span className="text-cobalt">↑</span><span>5D</span>
            </div>
          </div>
        </section>

        <section id="different" className="bg-ink px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12 lg:py-40">
          <div className="mx-auto max-w-[1400px]">
            <Reveal className="grid gap-12 lg:grid-cols-[1.14fr_0.86fr] lg:items-end">
              <div>
                <SectionLabel index="03">The advisory contrast</SectionLabel>
                <h2 className="font-display text-[clamp(4rem,8vw,9rem)] font-extrabold uppercase leading-[0.79] tracking-[-0.05em]">
                  One-plane activation
                  <br />
                  does not work.
                </h2>
              </div>
              <p className="max-w-xl border-l-2 border-gold pl-6 font-body text-lg leading-8 text-slate-300 sm:text-xl sm:leading-9">
                Hypnosis is valuable—but it is one tool inside the 5D state-creation process, not the entire method. If timing, Vastu, relationships, appetite, or sensory inputs keep destabilizing the 3D container—and the Mental pattern remains active—the desired state becomes harder to sustain.
              </p>
            </Reveal>

            <div className="mt-20 grid gap-px bg-white/12 lg:grid-cols-2">
              <Reveal className="bg-[#0a0d19] p-7 sm:p-10 lg:p-14">
                <div className="mb-12">
                  <p className="font-body text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/42">THE WRONG WAY (FIXING ONLY ONE PART)</p>
                  <h3 className="mt-3 font-display text-4xl font-bold uppercase sm:text-5xl">WHY WORKING HARDER FAILS</h3>
                  <p className="mt-4 max-w-xl font-body text-sm leading-6 text-white/58 sm:text-base">Fixing one piece while ignoring the other two guarantees burnout:</p>
                </div>
                <div className="space-y-0">
                  {[
                    "Just Grinding (Tony Robbins Style): Pushing through 70-hour weeks with raw willpower burns out your body and does nothing if your astrological timing is bad.",
                    "Just Mindset (Basic Hypnosis): Clearing mental blocks feels good, but fails the moment you walk back into a messy workspace and poor daily habits.",
                    "Just Wishing (Law of Attraction): Meditating on money without taking real-world physical action or fixing your environment leaves you broke.",
                    "Just Horoscopes: Knowing your chart without rewiring your mind or changing your physical setup changes nothing in your bank account.",
                  ].map((item) => (
                    <div key={item} className="flex gap-4 border-t border-white/10 py-5 font-body text-sm leading-6 text-white/62 sm:text-base">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/35" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-6 font-body text-sm leading-6 text-white/76 sm:text-base">
                  <strong className="font-semibold text-white">Bottom Line:</strong> You don't lack talent. You are wasting energy trying to fix three problems with only one tool.
                </div>
              </Reveal>

              <Reveal delay={0.08} className="relative overflow-hidden border border-gold/30 bg-[#15191f] p-7 shadow-[0_24px_80px_rgba(212,175,55,0.08)] sm:p-10 lg:p-14">
                <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full border border-gold/18" />
                <div className="absolute -right-12 -top-2 h-52 w-52 rounded-full border border-gold/14" />
                <div className="relative mb-12">
                  <p className="font-body text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold">THE NANCYNYC WAY (ALL 3 PARTS)</p>
                  <h3 className="mt-3 font-display text-4xl font-bold uppercase sm:text-5xl">FIX ALL 3 PARTS AT ONCE</h3>
                  <p className="mt-4 max-w-xl font-body text-sm leading-6 text-white/72 sm:text-base">The only private 1-on-1 system that covers your full setup:</p>
                </div>
                <div className="relative space-y-0">
                  {[
                    "Complete Setup: We align your physical workspace (3D), rewire your subconscious beliefs (Mental), and connect you to Source (5D) together.",
                    "Zero Willpower Burnout: High-stakes decisions become easy when your subconscious stops fighting your daily goals.",
                    "Perfect Timing: We time major moves, hiring, and investments with your exact birth chart and winning planetary cycles.",
                    "Direct Spiritual Power: Deep calm, clarity, and certainty so you stop forcing outcomes through sheer exhaustion.",
                    "100% Private Access: Direct 1-on-1 private advisory with Nancy. No junior staff, no group webinars, and no generic fluff.",
                  ].map((item) => (
                    <div key={item} className="flex gap-4 border-t border-white/20 py-5 font-body text-sm leading-6 text-white/84 sm:text-base">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-gold" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="relative border-t border-white/20 pt-6 font-body text-sm leading-6 text-white/92 sm:text-base">
                  <strong className="font-semibold text-white">Bottom Line:</strong> When your space, your mind, and your spirit work together, high revenue and clear focus happen naturally.
                </div>
              </Reveal>
            </div>

          </div>
        </section>

        <section className="border-y border-gold/15 bg-[#111318] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1400px]">
            <Reveal className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
              <div>
                <p className="font-body text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-gold">Home &amp; Office Audit</p>
                <h2 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.88] sm:text-7xl">
                  Set up your space to match your winning planets.
                </h2>
                <p className="mt-6 max-w-xl font-body text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">If your desk, home, or daily routine clashes with your birth chart, you waste energy every single day. We audit your home and office across all 5 senses to match your strongest planets—turning your workspace into an unfair advantage.</p>
              </div>
              <div className="grid sm:grid-cols-5">
                {senses.map((sense) => {
                  const Icon = sense.icon;
                  return (
                    <div key={sense.name} className="group border border-gold/20 bg-white/[0.018] p-6 transition-colors hover:bg-white/[0.05] sm:min-h-[170px]">
                      <Icon className="h-6 w-6 text-gold transition-transform group-hover:scale-110" />
                      <div className="mt-8 font-display text-[15px] font-bold uppercase text-white">{sense.name}</div>
                      <div className="mt-2 font-body text-[11px] font-bold uppercase tracking-wider text-gold/75">{sense.subhead}</div>
                      <p className="mt-4 font-body text-[13px] font-semibold leading-[1.5] text-slate-300">{sense.description}</p>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative overflow-hidden bg-ink px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12 lg:py-40">
          <div className="pointer-events-none absolute -right-40 top-24 h-[520px] w-[520px] rounded-full border border-cobalt/10" />
          <div className="relative mx-auto max-w-[1400px]">
            <Reveal className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <div>
                <SectionLabel index="04">The intellectual property</SectionLabel>
                <p className="max-w-md font-body text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                  We map how your earliest subconscious imprints collide with active planetary transits—stopping the subconscious loop before it costs you capital, momentum, or focus.
                </p>
              </div>
              <h2 className="font-display text-[clamp(4rem,7.4vw,8rem)] font-extrabold uppercase leading-[0.8] tracking-[-0.05em]">
                Your ceiling is a
                <br />
                repeating circuit.
              </h2>
            </Reveal>

            <div className="mt-16 grid gap-8 lg:mt-24">
              <Reveal><ImprintActivationMap /></Reveal>
              <Reveal delay={0.06}><BrainwaveAccessMechanics /></Reveal>
            </div>
          </div>
        </section>

        <section className="bg-[#111318] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12 lg:py-40">
          <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <SectionLabel index="05">The process</SectionLabel>
              <h2 className="font-display text-[clamp(4.3rem,7vw,7.8rem)] font-extrabold uppercase leading-[0.8] tracking-[-0.05em]">
                A private path
                <br />
                to the root.
              </h2>
              <p className="mt-8 max-w-md font-body text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                A selective, structured engagement designed to identify the active layer, intervene precisely, and translate the shift into daily life.
              </p>
              <div className="mt-10 inline-block -rotate-2 border border-gold/25 bg-white/[0.04] px-5 py-4 font-serif text-xl italic text-slate-300 shadow-[9px_10px_0_rgba(212,175,55,0.08)]">
                Which plane is producing the signal?
              </div>
            </Reveal>
            <div className="border-t border-white/14">
              {process.map((step, index) => (
                <Reveal key={step.title} delay={index * 0.04}>
                  <article className="grid gap-5 border-b border-white/14 py-9 sm:grid-cols-[84px_1fr] sm:gap-8 sm:py-11">
                    <div className="font-display text-5xl font-extrabold text-cobalt/35">0{index + 1}</div>
                    <div>
                      <h3 className="font-display text-3xl font-bold uppercase sm:text-4xl">{step.title}</h3>
                      <p className="mt-4 max-w-2xl font-body text-base leading-7 text-slate-300">{step.text}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-gold/18 bg-[#0f1217] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12 lg:py-36">
          <img src={WHITEBOARD_TEXTURE} alt="" className="absolute inset-y-0 right-0 h-full w-[68%] object-cover opacity-12 mix-blend-screen" />
          <div className="relative mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-24">
            <Reveal className="relative min-h-[540px] overflow-hidden border border-white/24 bg-white text-ink shadow-[24px_28px_0_rgba(4,7,17,0.18)] sm:min-h-[620px]">
              <img src={WHITEBOARD_TEXTURE} alt="" className="absolute inset-0 h-full w-full object-cover opacity-75" />
              <div className="relative flex min-h-[540px] flex-col justify-between p-8 sm:min-h-[620px] sm:p-12">
                <div className="font-body text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-cobalt">Field note 03 / The ascent</div>
                <div className="relative mx-auto flex w-full max-w-[430px] flex-col gap-8 py-8">
                  {["5D Spiritual", "Mental", "3D Physical"].map((label, index) => (
                    <div key={label} className="relative flex items-center gap-5">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-cobalt font-display text-2xl font-extrabold text-cobalt">{3 - index}</span>
                      <span className="font-display text-5xl font-extrabold uppercase leading-none sm:text-6xl">{label}</span>
                      {index < 2 && <span className="absolute -bottom-7 left-[22px] font-serif text-3xl italic text-cobalt">↑</span>}
                    </div>
                  ))}
                </div>
                <div className="self-end -rotate-3 font-serif text-2xl italic text-ink/58 sm:text-3xl">Do not skip the first plane.</div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="font-body text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-white/60">The NancyNYC framework at a glance</div>
              <h2 className="mt-7 font-display text-[clamp(4.4rem,8vw,8.8rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.05em]">
                Sequence is the strategy.
              </h2>
              <p className="mt-9 max-w-xl border-l border-white/35 pl-6 font-body text-base leading-7 text-white/74 sm:text-lg sm:leading-8">
                3D fixes the external container and embodied state. Mental clears internal self-sabotage. 5D opens Divine creation through prayer, chants, meditation, and hypnosis. Skipping 3D or Mental can leave spiritual work trapped in conceptual theory.
              </p>
              <a href="#different" className="group mt-10 inline-flex items-center gap-4 bg-gold px-7 py-5 font-body text-[0.7rem] font-extrabold uppercase tracking-[0.17em] text-ink transition-colors hover:bg-white active:scale-[0.97]">
                Review the advisory contrast <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
          </div>
        </section>

        <section id="about" className="bg-ink px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12 lg:py-40">
          <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
            <Reveal className="relative aspect-[3/4] overflow-hidden border border-gold/18 bg-ink text-white shadow-[22px_26px_0_rgba(212,175,55,0.09)]">
              <img
                src={APPROVED_PORTRAIT}
                alt="Nancy, founder of NancyNYC, in a tailored navy suit"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
              <div className="absolute left-6 top-6 border border-white/20 bg-ink/68 px-4 py-3 font-body text-[0.54rem] font-extrabold uppercase tracking-[0.2em] text-white/76 backdrop-blur-md sm:left-8 sm:top-8">
                Founder · NancyNYC
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-7 pb-8 pt-7 sm:px-10 sm:pb-10 sm:pt-10">
                <div className="border-l-2 border-gold pl-5 font-serif text-2xl italic leading-tight text-white sm:text-4xl">
                  “Align your space. Rewire your mind. Move with total certainty.”
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="flex flex-col justify-center">
              <SectionLabel index="06">MILLIONAIRE ASTROLOGER &amp; PRIVATE ADVISOR</SectionLabel>
              <h2 className="font-display text-[clamp(4.5rem,8vw,9rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.05em]">
                FOUNDER OF THE TRI-PLANAR METHOD.
              </h2>
              <div className="mt-10 max-w-2xl space-y-5 font-body text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                <p>
                  When smart founders get stuck, working longer hours is usually the wrong move.
                </p>
                <p>
                  If your daily habits, your office, and your subconscious mind fight your birth chart, you hit a wall every time. That is why simple mindset tricks or standalone astrology readings never last.
                </p>
                <p>I built the Tri-Planar Method to fix all three parts at once:</p>
                <ol className="space-y-3">
                  <li><strong className="font-semibold text-white">1. The 3D World:</strong> We audit your space and daily actions to turn on your winning planets and throw out what holds you back.</li>
                  <li><strong className="font-semibold text-white">2. The Mind:</strong> We dive deep to find the hidden beliefs behind your actions and reprogram your brain with custom hypnosis.</li>
                  <li><strong className="font-semibold text-white">3. The Spirit:</strong> We connect you to Source with prayer and deep calm so you stop forcing results through raw exhaustion.</li>
                </ol>
                <p className="font-semibold text-white">No junior assistants. No pre-recorded group calls. You and I fix your entire setup 1-on-1 in 3 weeks.</p>
              </div>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#different"
                  className="group inline-flex items-center justify-center gap-4 bg-gold px-6 py-4 font-body text-[0.68rem] font-extrabold uppercase tracking-[0.17em] text-ink transition-colors hover:bg-white active:scale-[0.97]"
                >
                  Review the method <ArrowUpRight className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={openQualifier}
                  className="inline-flex items-center justify-center gap-4 border border-slate-700 px-6 py-4 font-body text-[0.68rem] font-extrabold uppercase tracking-[0.17em] text-white transition-colors hover:border-gold hover:text-gold active:scale-[0.97]"
                >
                  Apply for private work
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative overflow-hidden bg-ink text-white lg:min-h-[720px]">
          <div className="relative h-[520px] sm:h-[620px] lg:absolute lg:inset-0 lg:h-full">
            <img
              src={APPROVED_SPORTSWEAR}
              alt="Nancy in a luxury private training studio"
              className="absolute inset-0 h-full w-full object-contain object-center lg:object-right"
            />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B0D11] to-transparent lg:inset-0 lg:h-auto lg:bg-[linear-gradient(90deg,#0B0D11_0%,rgba(11,13,17,0.94)_34%,rgba(11,13,17,0.52)_60%,transparent_86%)]" />
          </div>
          <div className="relative mx-auto flex max-w-[1500px] px-5 py-16 sm:px-8 sm:py-20 lg:min-h-[720px] lg:items-center lg:px-12">
            <Reveal className="max-w-2xl">
              <div className="mb-7 flex items-center gap-4 font-body text-[0.62rem] font-extrabold uppercase tracking-[0.24em] text-gold">
                <span className="h-px w-10 bg-gold/65" />
                LEVEL 01: THE 3D WORLD
              </div>
              <h2 className="font-display text-[clamp(4.2rem,8vw,8.7rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.05em]">
                YOUR BODY AND
                <br />
                ENVIRONMENT RUN YOUR FOCUS.
              </h2>
              <p className="mt-8 max-w-xl border-l border-white/28 pl-6 font-body text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
                You cannot out-think a messy environment or an exhausted body. If your workspace, daily habits, and physical energy clash with your birth chart, your mind stays under constant stress. We audit and fix your physical foundation first—so high-level execution feels natural, not forced.
              </p>
              <a href="#method" className="group mt-9 inline-flex items-center gap-4 bg-white px-6 py-4 font-body text-[0.66rem] font-extrabold uppercase tracking-[0.17em] text-ink transition-colors hover:bg-gold active:scale-[0.97]">
                EXPLORE THE 3D AUDIT <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
          </div>
        </section>

        <section className="bg-ink px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12 lg:py-40">
          <div className="mx-auto max-w-[1400px]">
            <Reveal className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <SectionLabel index="07">A selective private practice</SectionLabel>
                <h2 className="font-display text-[clamp(4rem,7.4vw,8rem)] font-extrabold uppercase leading-[0.8] tracking-[-0.05em]">
                  This is not
                  <br />
                  for everyone.
                </h2>
              </div>
              <p className="max-w-xl border-l-2 border-gold pl-6 font-body text-lg leading-8 text-slate-300">
                NancyNYC is for people ready to examine the complete system beneath a goal. It is not prediction without participation, and it is not a promise of a particular financial outcome.
              </p>
            </Reveal>

            <div className="mt-20 grid gap-px bg-white/12 lg:grid-cols-2">
              <Reveal className="bg-[#0a0d19] p-7 sm:p-10 lg:p-12">
                <h3 className="font-display text-4xl font-bold uppercase sm:text-5xl">This is for you if</h3>
                <div className="mt-8">
                  {fitFor.map((item) => (
                    <div key={item} className="flex gap-4 border-t border-white/10 py-5 font-body text-sm leading-6 text-white/66 sm:text-base">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-cobalt" />
                      {item}
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.08} className="border border-white/10 bg-[#15191f] p-7 text-white sm:p-10 lg:p-12">
                <h3 className="font-display text-4xl font-bold uppercase sm:text-5xl">This is not for you if</h3>
                <div className="mt-8">
                  {notFor.map((item) => (
                    <div key={item} className="flex gap-4 border-t border-white/12 py-5 font-body text-sm leading-6 text-slate-300 sm:text-base">
                      <X className="mt-1 h-4 w-4 shrink-0 text-cobalt" />
                      {item}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={openQualifier} className="mt-8 inline-flex items-center gap-4 bg-gold px-6 py-4 font-body text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-white active:scale-[0.97]">
                  Apply for a private consultation <ArrowUpRight className="h-4 w-4" />
                </button>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="faq" className="bg-[#0f1217] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12 lg:py-40">
          <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
            <Reveal>
              <SectionLabel index="08">Questions, answered</SectionLabel>
              <h2 className="font-display text-[clamp(4rem,7vw,7.4rem)] font-extrabold uppercase leading-[0.8] tracking-[-0.045em]">
                Clarity before belief.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <Accordion type="single" collapsible className="border-t border-white/14">
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.q} value={`item-${index}`} className="border-white/14">
                    <AccordionTrigger className="py-7 text-left font-display text-2xl font-bold uppercase leading-tight hover:no-underline sm:py-8 sm:text-3xl">
                      <span className="flex gap-5">
                        <span className="mt-1 font-body text-[0.62rem] font-extrabold tracking-[0.18em] text-cobalt">0{index + 1}</span>
                        {faq.q}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-8 pl-10 pr-6 font-body text-base leading-7 text-slate-300 sm:pl-12 sm:pr-12 sm:text-lg sm:leading-8">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        <section className="relative isolate overflow-hidden border-y border-gold/20 bg-[#111318] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12 lg:py-40">
          <img src={FREQUENCY_MARK} alt="" className="absolute -bottom-28 right-[8%] -z-10 h-[520px] w-[520px] object-contain opacity-[0.13] sm:h-[680px] sm:w-[680px]" />
          <div className="absolute -right-40 -top-64 -z-10 h-[800px] w-[800px] rounded-full border border-white/16" />
          <div className="absolute -right-16 -top-44 -z-10 h-[620px] w-[620px] rounded-full border border-white/13" />
          <div className="absolute -right-0 -top-20 -z-10 h-[430px] w-[430px] rounded-full border border-white/12" />
          <Reveal className="mx-auto max-w-[1400px]">
            <div className="font-body text-[0.68rem] font-extrabold uppercase tracking-[0.23em] text-white/62">Limited private availability</div>
            <h2 className="mt-8 max-w-6xl font-display text-[clamp(4.2rem,8.5vw,9.8rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.05em]">
              Your next wealth level is not a time problem. It is a frequency problem.
            </h2>
            <div className="mt-14 grid gap-8 border-t border-white/25 pt-8 md:grid-cols-[1fr_auto] md:items-center">
              <p className="max-w-2xl font-body text-base leading-7 text-white/76 sm:text-lg sm:leading-8">
                You already know how to act. The question is whether your physical, mental, and spiritual planes are broadcasting the same instruction. Apply to explore the pattern privately with Nancy.
              </p>
              <button
                type="button"
                onClick={openQualifier}
                className="group inline-flex items-center justify-center gap-4 bg-gold px-7 py-5 font-body text-[0.7rem] font-extrabold uppercase tracking-[0.17em] text-ink transition-colors hover:bg-white active:scale-[0.97]"
              >
                Apply for a private consultation
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="bg-ink px-5 py-10 text-white sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 border-t border-white/12 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <img src={FREQUENCY_MARK} alt="" className="h-16 w-16 object-contain" />
            <div>
              <div className="font-display text-3xl font-extrabold tracking-[0.16em]">NANCYNYC</div>
              <div className="font-body text-[0.52rem] font-bold uppercase tracking-[0.18em] text-white/42">Millionaire Astrologer &amp; Hypnotist</div>
            </div>
          </div>
          <div className="flex flex-col gap-3 font-body text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white/45 sm:items-end">
            <a href="#top" className="transition-colors hover:text-white">Back to top</a>
            <p>Educational content only · Not medical or mental-health treatment</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
