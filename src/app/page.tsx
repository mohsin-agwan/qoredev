import Link from "next/link";
import {
  Shield,
  Database,
  Cpu,
  CreditCard,
  Zap,
  GitBranch,
  ArrowRight,
  CheckCircle2,
  Layers,
  Terminal,
  Globe,
} from "lucide-react";

const categories = [
  {
    icon: <Shield size={22} />,
    label: "Authentication",
    color: "from-indigo-500 to-blue-500",
    features: ["Email & password login", "Magic link (OTP)", "Session management", "Row-level security"],
  },
  {
    icon: <Database size={22} />,
    label: "Vector Database",
    color: "from-violet-500 to-purple-500",
    features: ["PostgreSQL + pgvector", "Semantic search", "AI embeddings", "Auto SQL migrations"],
  },
  {
    icon: <Cpu size={22} />,
    label: "AI Copilot",
    color: "from-fuchsia-500 to-pink-500",
    features: ["Autonomous assistant", "Stuck mode", "Step-by-step breakdown", "Architecture guidance"],
  },
  {
    icon: <CreditCard size={22} />,
    label: "Payments",
    color: "from-emerald-500 to-teal-500",
    features: ["Stripe, PayPal, Razorpay", "One connector interface", "Provider hot-swap", "Manifest-driven config"],
  },
  {
    icon: <Zap size={22} />,
    label: "Auto-Deploy",
    color: "from-amber-500 to-orange-500",
    features: ["Railway + Vercel push", "Manifest-driven triggers", "Zero config deploys", "Instant rollbacks"],
  },
  {
    icon: <Layers size={22} />,
    label: "Quantum Canvas",
    color: "from-cyan-500 to-sky-500",
    features: ["Visual schema editor", "Drag & drop nodes", "Relational edge drawing", "SQL migration export"],
  },
];

const stats = [
  { value: "6+", label: "Built-in integrations" },
  { value: "1", label: "Unified connector API" },
  { value: "∞", label: "Scalable on Railway" },
  { value: "0", label: "Config files needed" },
];

const steps = [
  {
    icon: <Terminal size={20} />,
    title: "Clone & configure",
    desc: "One command setup with env-driven feature flags via qf-manifest.json.",
  },
  {
    icon: <GitBranch size={20} />,
    title: "Toggle features",
    desc: "Enable auth, payments, AI copilot from your dashboard — no code changes.",
  },
  {
    icon: <Globe size={20} />,
    title: "Deploy everywhere",
    desc: "Auto-deployer pushes to Railway and Vercel on every manifest save.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-950">
      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">Q</span>
          <span className="text-xl font-bold tracking-tight text-white">QoreDev</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#categories" className="hover:text-white transition-colors">Features</a>
          <a href="#categories" className="hover:text-white transition-colors">Categories</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1.5">
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            Get started <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-28 pb-24 text-center overflow-hidden hero-grid-bg">
        {/* Radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] rounded-full bg-indigo-600/10 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-indigo-400 uppercase bg-indigo-950/60 border border-indigo-800/60 px-4 py-1.5 rounded-full mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" aria-hidden="true" />
            AI-Native Backend OS
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white mb-6 animate-fade-in animate-delay-100">
            Build smarter backends{" "}
            <span className="gradient-text">with AI</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in animate-delay-200">
            QoreDev unifies authentication, vector storage, payments, and an
            autonomous AI copilot into one developer platform. Toggle features,
            deploy instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animate-delay-300">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all glow-indigo flex items-center justify-center gap-2"
            >
              Start for free <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold px-8 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-gray-800/60 bg-gray-900/30 px-6 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-extrabold gradient-text mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Categories ── */}
      <section id="categories" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase">Platform categories</span>
            <h2 className="mt-3 text-4xl font-bold text-white">Everything you need, built in</h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              All major backend concerns solved. Enable what you need, skip what you don&apos;t.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.label}
                className="card-glass rounded-2xl p-6 hover:border-gray-700 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{cat.label}</h3>
                <ul className="space-y-2">
                  {cat.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="px-6 py-20 bg-gray-900/30 border-y border-gray-800/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase">How it works</span>
            <h2 className="mt-3 text-4xl font-bold text-white">Zero to production in minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+2rem)] right-[-calc(50%-2rem)] h-px bg-gradient-to-r from-indigo-600/40 to-transparent" />
                )}
                <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-800/50 flex items-center justify-center text-indigo-400 mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 text-xs font-bold text-gray-400 flex items-center justify-center mx-auto mb-3">
                  {i + 1}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center card-glass rounded-3xl p-12 glow-indigo">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to <span className="gradient-text">QoreDev</span>?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Start free, no credit card required. Upgrade when you need to scale.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all"
          >
            Create your account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800/60 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">Q</span>
            <span className="text-sm font-semibold text-white">QoreDev</span>
          </div>
          <nav className="flex gap-6 text-xs text-gray-500">
            <Link href="/login" className="hover:text-gray-300 transition-colors">Sign in</Link>
            <Link href="/register" className="hover:text-gray-300 transition-colors">Register</Link>
          </nav>
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} QoreDev. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
