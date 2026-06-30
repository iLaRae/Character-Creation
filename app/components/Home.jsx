import Link from "next/link";

/* ---------- tiny presentational helpers ---------- */

function Sparkle({ className = "" }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l1.2 5.2L18 8.5l-4.8 1.3L12 15l-1.2-5.2L6 8.5l4.8-1.3L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M19 13l.6 2.4L22 16l-2.4.6L19 19l-.6-2.4L16 16l2.4-.6L19 13Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlowBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-32 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="absolute -bottom-40 right-[-160px] h-[560px] w-[560px] rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="absolute bottom-0 left-[-180px] h-[560px] w-[560px] rounded-full bg-indigo-500/15 blur-3xl" />
    </div>
  );
}

const FEATURES = [
  {
    emoji: "🎨",
    title: "16+ art styles",
    body: "Watercolor, colored pencil, marker render, cel-shaded, comic halftone, manga tones, neon gel pen and more — one tap each.",
  },
  {
    emoji: "📸",
    title: "Snap or upload",
    body: "Use the full-screen camera to capture a page from your sketchbook, or drag & drop an existing PNG/JPG.",
  },
  {
    emoji: "🌈",
    title: "Guide the palette",
    body: "Add color accents like ‘sunset warm gradients’ or upload a reference image to sample its colors.",
  },
  {
    emoji: "✏️",
    title: "Keeps your line work",
    body: "Your original linework stays intact — the AI fills and shades around it for a clean, faithful result.",
  },
  {
    emoji: "🕘",
    title: "Local history",
    body: "Every result is saved as a thumbnail right in your browser so you can revisit and re-apply settings.",
  },
  {
    emoji: "⚡",
    title: "No account, no fuss",
    body: "Everything runs straight from the browser. Download your colored artwork as a crisp PNG instantly.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Add your sketch",
    body: "Snap a photo with the full-screen camera or upload a file. Pencil, pen, or ink line art all work great.",
  },
  {
    n: "02",
    title: "Pick a style & palette",
    body: "Choose from 16+ rendering styles, sprinkle in color accents, and optionally drop in a reference image.",
  },
  {
    n: "03",
    title: "Colorize & download",
    body: "Hit Colorize, watch the magic, then download your fully colored artwork as a high-quality PNG.",
  },
];

const STYLES = [
  { emoji: "🎨", label: "Watercolor" },
  { emoji: "✏️", label: "Color Pencil" },
  { emoji: "🖍️", label: "Marker Render" },
  { emoji: "🧩", label: "Cel Shaded" },
  { emoji: "🗞️", label: "Comic Dots" },
  { emoji: "🖤", label: "Manga Tones" },
  { emoji: "🟧", label: "Oil Pastel" },
  { emoji: "🖌️", label: "Gouache" },
  { emoji: "📜", label: "Sepia Wash" },
  { emoji: "💡", label: "Neon Gel" },
  { emoji: "🟦", label: "Posca" },
  { emoji: "🪶", label: "Graphite Tint" },
];

const FAQ = [
  {
    q: "Is Magic Sketch Studio free?",
    a: "Yes — open the studio and start colorizing right away. No sign-up or account is required.",
  },
  {
    q: "What kind of images work best?",
    a: "Clean line art on a light background works best: pencil, pen, or ink drawings. Good, even lighting helps the camera capture sharp lines.",
  },
  {
    q: "Will it change my drawing?",
    a: "No — the goal is to preserve your original linework. The AI adds color and shading on top while keeping your strokes faithful.",
  },
  {
    q: "Where are my results stored?",
    a: "Result thumbnails are saved locally in your browser (localStorage). Nothing is published anywhere, and you can clear your history anytime.",
  },
];

/* ---------- sections ---------- */

function Hero() {
  return (
    <section className="relative">
      <GlowBlobs />
      <div className="relative mx-auto w-full max-w-[1200px] px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-rise inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/85 backdrop-blur">
            <Sparkle className="text-sky-200" />
            AI-powered sketch colorizer
          </div>

          <h1 className="animate-rise mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl" style={{ animationDelay: "60ms" }}>
            Turn your sketches into
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient">fully colored art</span>
          </h1>

          <p className="animate-rise mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg" style={{ animationDelay: "120ms" }}>
            Snap a photo of any pencil or ink drawing and watch it bloom into vivid,
            finished artwork — in watercolor, comic, marker, cel-shaded and more. Your
            linework stays exactly as you drew it.
          </p>

          <div className="animate-rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: "180ms" }}>
            <Link
              href="/studio"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 px-7 py-3.5 text-base font-bold text-[#061028] shadow-[0_18px_40px_-20px_rgba(56,189,248,0.9)] transition hover:brightness-110 active:scale-[.98] sm:w-auto"
            >
              <Sparkle className="text-[#061028]" />
              Start colorizing — it&apos;s free
            </Link>
            <Link
              href="#how"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/15 sm:w-auto"
            >
              See how it works
            </Link>
          </div>

          <p className="animate-rise mt-4 text-xs text-white/55" style={{ animationDelay: "220ms" }}>
            No account needed • Works on mobile • Download as PNG
          </p>
        </div>

        {/* Floating preview card */}
        <div className="animate-rise mx-auto mt-14 max-w-4xl" style={{ animationDelay: "260ms" }}>
          <div className="animate-floaty rounded-[28px] border border-white/12 bg-white/[0.06] p-3 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.9)] backdrop-blur">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-dashed border-white/20 bg-black/20 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-white/55">Before</p>
                <div className="mt-3 grid h-44 place-items-center rounded-2xl bg-white/[0.04] text-5xl">
                  ✏️
                </div>
                <p className="mt-3 text-sm text-white/70">Your raw pencil sketch</p>
              </div>
              <div className="relative rounded-3xl border border-white/15 bg-gradient-to-br from-sky-500/15 via-indigo-500/10 to-fuchsia-500/15 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-200">After</p>
                <div className="mt-3 grid h-44 place-items-center rounded-2xl bg-white/[0.06] text-5xl">
                  🌈
                </div>
                <p className="mt-3 text-sm text-white/85">Vivid, fully colored artwork</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="relative mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Everything you need to bring a sketch to life
        </h2>
        <p className="mt-4 text-white/70">
          A focused little studio with all the controls that matter — and none of the clutter.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group rounded-3xl border border-white/12 bg-white/[0.05] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.08]"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white/10 text-2xl transition group-hover:scale-110">
              {f.emoji}
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="relative scroll-mt-24 border-y border-white/10 bg-white/[0.03]">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-sky-200">How it works</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Three steps from line art to color
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="relative rounded-3xl border border-white/12 bg-white/[0.05] p-7 backdrop-blur">
              <span className="text-4xl font-black text-gradient">{s.n}</span>
              <h3 className="mt-3 text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/studio"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 px-7 py-3.5 text-base font-bold text-[#061028] shadow-[0_18px_40px_-20px_rgba(56,189,248,0.9)] transition hover:brightness-110 active:scale-[.98]"
          >
            <Sparkle className="text-[#061028]" />
            Try it now
          </Link>
        </div>
      </div>
    </section>
  );
}

function Styles() {
  return (
    <section id="styles" className="relative scroll-mt-24 mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-bold uppercase tracking-widest text-fuchsia-200">Style library</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          One sketch, endless looks
        </h2>
        <p className="mt-4 text-white/70">
          Switch between rendering styles instantly to find the perfect vibe.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        {STYLES.map((s) => (
          <div
            key={s.label}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white/85 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
          >
            <span className="text-lg">{s.emoji}</span>
            {s.label}
          </div>
        ))}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white/55 backdrop-blur">
          + more
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-24 border-t border-white/10 bg-white/[0.03]">
      <div className="mx-auto w-full max-w-[820px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Frequently asked
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-3xl border border-white/12 bg-white/[0.05] p-5 backdrop-blur transition hover:border-white/20 [&_summary]:list-none"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4">
                <span className="text-base font-bold text-white">{item.q}</span>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 text-white/80 transition group-open:rotate-45">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaFooter() {
  return (
    <footer className="relative overflow-hidden">
      <GlowBlobs />
      <div className="relative mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-white/12 bg-gradient-to-br from-sky-500/15 via-indigo-500/10 to-fuchsia-500/15 p-10 text-center backdrop-blur sm:p-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to color your next sketch?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/75">
            Open the studio and turn your drawing into finished artwork in under a minute.
          </p>
          <Link
            href="/studio"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 px-8 py-4 text-base font-bold text-[#061028] shadow-[0_18px_40px_-20px_rgba(56,189,248,0.9)] transition hover:brightness-110 active:scale-[.98]"
          >
            <Sparkle className="text-[#061028]" />
            Open Magic Sketch Studio
          </Link>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/55 sm:flex-row">
          <p>© {new Date().getFullYear()} Magic Sketch Studio</p>
          <div className="flex items-center gap-5">
            <Link href="/#how" className="transition hover:text-white">How it works</Link>
            <Link href="/#styles" className="transition hover:text-white">Styles</Link>
            <Link href="/studio" className="transition hover:text-white">Studio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#07102b] via-[#0a1b44] to-[#06081a] text-white">
      <Hero />
      <Features />
      <HowItWorks />
      <Styles />
      <Faq />
      <CtaFooter />
    </main>
  );
}
