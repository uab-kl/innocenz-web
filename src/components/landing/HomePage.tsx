import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  CalendarRange,
  LineChart,
  MapPin,
  ReceiptText,
  Star,
  Wallet,
} from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { SiteNav } from "@/components/landing/SiteNav";

const wordVariant = {
  hidden: { opacity: 0, y: 40, rotateX: -40 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

const fadeWord = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
} as const;

const features = [
  {
    icon: CalendarRange,
    title: "Roster planning",
    desc: "Assign talent to shifts across outlets with live availability and conflict detection.",
  },
  {
    icon: MapPin,
    title: "Live shift tracking",
    desc: "GPS check-in, selfie verification, and a real-time floor view of every shift.",
  },
  {
    icon: ReceiptText,
    title: "Receipt scanning",
    desc: "Scan receipts on-shift — drinks, tips, and commissions auto-calculated by tier.",
  },
  {
    icon: Wallet,
    title: "Payment vouchers",
    desc: "Issue e-signed vouchers each cycle. Talent reviews, signs, or disputes in-app.",
  },
  {
    icon: LineChart,
    title: "Sales & PNL",
    desc: "Track live sales and weekly reconciliation with variance reporting built in.",
  },
  {
    icon: Star,
    title: "Ratings & KPI",
    desc: "Rate talent after every shift and track tiers, attendance, and quality flags.",
  },
];

const portals = {
  Agency: [
    "Onboard your roster with full profiles and tiers",
    "Plan weekly shifts with per-tier wage rules",
    "Monitor live operations and incidents",
    "Issue payroll and reconcile every cycle",
  ],
  Outlet: [
    "Set up your venue menu and pay scales",
    "View tonight's roster and check-in status",
    "Log floor sales as the night runs",
    "Confirm reconciliation and settle invoices",
  ],
  Talent: [
    "Build your profile and unlock higher tiers",
    "Accept shift offers with full details",
    "Check in with selfie + GPS, scan receipts",
    "Review your voucher, sign, and get paid",
  ],
};

type Plan = {
  name: string;
  price: string;
  rosterCap: string;
  description: string;
  featured: boolean;
};

const plans = {
  Agency: [] as Plan[],
  Outlet: [] as Plan[],
};

const hasPricing = Object.values(plans).some((tier) => tier.length > 0);

export function HomePage() {
  const [portal, setPortal] = useState<keyof typeof portals>("Agency");
  const [planTab, setPlanTab] = useState<keyof typeof plans>("Agency");
  const reduceMotion = useReducedMotion();
  const activePlans = plans[planTab];

  return (
    <div id="top" className="landing-page min-h-screen w-full bg-background">
      <SiteNav />

      <section className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden px-6 pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-aurora opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,color-mix(in_oklab,var(--background)_80%,transparent)_95%)]" />
        </div>

        <div className="relative z-10 w-full text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-bright backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-gold" />
            The Future Standard of Workforce Management
          </motion.span>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: reduceMotion
                  ? { staggerChildren: 0 }
                  : { staggerChildren: 0.12, delayChildren: 0.1 },
              },
            }}
            className="mb-8 text-6xl uppercase leading-[0.9] tracking-tight text-foreground sm:text-8xl lg:text-9xl"
          >
            {["Elevate", "your"].map((w) => (
              <motion.span
                key={w}
                variants={reduceMotion ? fadeWord : wordVariant}
                className="inline-block"
              >
                {w}&nbsp;
              </motion.span>
            ))}
            <motion.span
              variants={reduceMotion ? fadeWord : wordVariant}
              className="inline-block text-gradient-gold drop-shadow-[0_0_30px_color-mix(in_oklab,var(--gold)_45%,transparent)]"
            >
              workplace&nbsp;operation
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mx-auto mb-12 w-full text-lg leading-relaxed text-foreground/80 sm:text-xl"
          >
            Unified workforce intelligence for the world&apos;s most exclusive
            venues. Roster planning, live shift tracking, and P&amp;L
            optimization in one high-performance interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <a
              href="#pricing"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden bg-[image:var(--gradient-gold)] px-10 py-4 text-sm font-bold uppercase tracking-widest text-gold-foreground shadow-glow-gold transition-transform hover:-translate-y-0.5"
            >
              <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-sheen bg-white/30 blur-md" />
              Get priority access <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center border border-foreground/25 px-10 py-4 text-sm font-bold uppercase tracking-widest text-foreground backdrop-blur-sm transition-all hover:bg-foreground hover:text-background"
            >
              Explore solutions
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-10 flex items-center justify-center"
          >
            <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/95 px-5 py-2.5 shadow-lg shadow-black/15">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                Powered by
              </span>
              <img
                src="/img/uab-logo.webp"
                alt="UAB"
                className="h-7 w-auto object-contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="w-full bg-section-gold px-6 py-24">
        <div className="w-full">
          <SectionHead
            label="Platform features"
            title="Everything your operation needs"
            sub="From roster planning to financial close — built for the pace of nightlife."
          />
          <div className="grid gap-px border border-gold/20 bg-gold/20 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="group relative h-full overflow-hidden bg-background p-10 transition-colors duration-500 hover:bg-surface-2">
                  <div className="mb-8 flex h-12 w-12 items-center justify-center border border-gold/30 bg-gold/10 transition-all duration-500 group-hover:scale-110 group-hover:border-transparent group-hover:bg-[image:var(--gradient-gold)] group-hover:shadow-glow-gold">
                    <f.icon className="h-6 w-6 text-gold-bright transition-colors duration-500 group-hover:text-gold-foreground" />
                  </div>
                  <h3 className="mb-3 text-3xl uppercase text-foreground">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/70">
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="w-full bg-section-violet px-6 py-24">
        <div className="w-full">
          <SectionHead
            label="How it works"
            title="One platform, three portals"
            sub="Agency, Outlet, and Talent each get a tailored view — synced in real time."
            center
          />
          <div className="mx-auto mb-10 flex w-fit border border-foreground/10 p-1">
            {(Object.keys(portals) as (keyof typeof portals)[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPortal(p)}
                className={`px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${
                  portal === p
                    ? "bg-gold text-gold-foreground"
                    : "text-foreground/50 hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {portals[portal].map((step, i) => (
              <Reveal key={step} delay={i * 80}>
                <div className="h-full border border-gold/15 bg-surface p-6">
                  <div className="flex h-10 w-10 items-center justify-center border border-gold/40 bg-gold/10 font-display text-xl text-gold-bright">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                    {step}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="w-full bg-section-mix px-6 py-24">
        <div className="w-full">
          <SectionHead
            label="Pricing"
            title="Choose your access tier"
            sub={
              hasPricing
                ? "Core portal access, payroll, and reconciliation in every plan."
                : undefined
            }
            center
          />
          {hasPricing ? (
            <>
              <div className="mx-auto mb-12 flex w-fit border border-foreground/10 p-1">
                {(Object.keys(plans) as (keyof typeof plans)[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlanTab(p)}
                    className={`px-8 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${
                      planTab === p
                        ? "bg-gold text-gold-foreground"
                        : "text-foreground/50 hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {activePlans.map((p, i) => (
                  <Reveal key={p.name} delay={i * 100}>
                    <div
                      className={`flex h-full flex-col rounded-xl p-6 ${
                        p.featured
                          ? "border-2 border-gold/60 bg-background shadow-glow-gold-lg"
                          : "border border-foreground/10 bg-background"
                      }`}
                    >
                      <div className="mb-6 flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold text-foreground">
                          {p.name}
                        </h3>
                      </div>

                      <div className="mb-2 text-3xl font-bold text-gold">
                        {p.price}
                        <span className="ml-1 text-sm font-normal text-foreground/50">
                          / month
                        </span>
                      </div>

                      <p className="mb-8 flex-1 text-sm text-foreground/60">
                        {p.description}
                      </p>

                      <a
                        href="#top"
                        className="w-full rounded-lg border border-foreground/15 bg-foreground/5 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
                      >
                        Apply now
                      </a>
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          ) : (
            <Reveal className="mx-auto max-w-lg text-center">
              <p className="text-lg font-medium tracking-wide text-foreground/75 sm:text-xl">
                We are preparing now.
              </p>
              <p className="mt-5 font-display text-4xl uppercase tracking-[0.08em] text-gradient-gold sm:text-5xl">
                See You Soon
              </p>
            </Reveal>
          )}
        </div>
      </section>

      <footer className="w-full border-t border-foreground/5 px-6 py-14">
        <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="w-full sm:max-w-md">
            <div className="font-display text-2xl font-bold uppercase tracking-[0.2em] text-gold-bright">
              InnocenZ
            </div>
            <p className="mt-3 text-sm text-foreground/50">
              The workforce operating platform for Malaysia&apos;s nightlife
              industry.
            </p>
          </div>
          <nav className="flex gap-12 text-sm">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                Platform
              </span>
              <a
                href="#features"
                className="text-foreground/60 transition-colors hover:text-gold-bright"
              >
                Features
              </a>
              <a
                href="#how"
                className="text-foreground/60 transition-colors hover:text-gold-bright"
              >
                How it works
              </a>
              <a
                href="#pricing"
                className="text-foreground/60 transition-colors hover:text-gold-bright"
              >
                Pricing
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                Company
              </span>
              <a
                href="#top"
                className="text-foreground/60 transition-colors hover:text-gold-bright"
              >
                About
              </a>
              <a
                href="#top"
                className="text-foreground/60 transition-colors hover:text-gold-bright"
              >
                Contact
              </a>
              <a
                href="#top"
                className="text-foreground/60 transition-colors hover:text-gold-bright"
              >
                Privacy
              </a>
            </div>
          </nav>
        </div>
        <div className="mt-10 flex w-full flex-wrap items-center justify-between gap-3 border-t border-foreground/5 pt-6 text-[10px] uppercase tracking-widest text-foreground/40">
          <span>
            © {new Date().getFullYear()} InnocenZ. All rights reserved.
          </span>
          <span>Made in Malaysia 🇲🇾</span>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({
  label,
  title,
  sub,
  center,
}: {
  label: string;
  title: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={`mb-14 ${center ? "text-center" : ""}`}>
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-bright">
        {label}
      </div>
      <h2 className="mt-3 text-4xl uppercase tracking-tight sm:text-5xl">
        {title}
      </h2>
      {sub && (
        <p
          className={`mt-3 w-full text-base text-foreground/70 ${center ? "mx-auto" : ""}`}
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
}
