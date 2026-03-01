import Link from "next/link";
import { Shield, Database, Cpu, Plug, Zap, GitMerge, CheckCircle } from "lucide-react";

const features = [
  {
    icon: <Shield size={22} />,
    title: "Supabase Auth",
    description: "Enterprise-grade authentication backed by Supabase.",
    bullets: ["Email/password & magic link", "Session management", "Row-level security"],
  },
  {
    icon: <Database size={22} />,
    title: "Vector Database",
    description: "PostgreSQL with pgvector for AI-powered search.",
    bullets: ["pgvector embeddings", "Semantic search", "Auto migrations"],
  },
  {
    icon: <Cpu size={22} />,
    title: "AI Copilot",
    description: "Autonomous AI that reasons through your backend problems.",
    bullets: ["Autonomous reasoning", "Stuck mode breakdown", "Context-aware answers"],
  },
  {
    icon: <Plug size={22} />,
    title: "Universal Connectors",
    description: "One interface to rule every third-party provider.",
    bullets: ["Stripe/PayPal/Razorpay", "One interface", "Provider switching"],
  },
  {
    icon: <Zap size={22} />,
    title: "Auto-Deploy Watcher",
    description: "Manifest-driven deploys that push on every save.",
    bullets: ["Manifest-driven deploys", "Railway + Vercel", "Zero-touch CI"],
  },
  {
    icon: <GitMerge size={22} />,
    title: "Quantum Canvas",
    description: "Visual database editor with auto SQL generation.",
    bullets: ["Visual DB editor", "Drag-and-drop nodes", "SQL auto-generation"],
  },
];

const steps = [
  { num: "01", title: "Configure your manifest", desc: "Define your project structure and enabled features in qf-manifest.json with a simple JSON schema." },
  { num: "02", title: "Toggle features on/off", desc: "Use Magic Toggles in the dashboard to enable auth, database, payments, and AI with zero code changes." },
  { num: "03", title: "Deploy instantly", desc: "The Auto-Deploy Watcher detects manifest changes and pushes to Railway or Vercel automatically." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-950">
      {/* Navbar */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-gray-950/90 backdrop-blur-sm">
        <span className="text-xl font-bold tracking-tight text-indigo-400">QoreDev</span>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How It Works</a>
          <a href="#docs" className="text-sm text-gray-400 hover:text-white transition-colors">Docs</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link href="/register" className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors font-medium">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />
        <div className="inline-flex items-center gap-2 bg-indigo-950/60 border border-indigo-800/50 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase">AI-Native Backend OS</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 max-w-4xl">
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Build Smarter.
          </span>
          <br />
          <span className="text-white">Deploy Faster.</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Ship with AI.
          </span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mb-10 leading-relaxed">
          QoreDev combines authentication, vector storage, and an autonomous AI copilot
          into one unified developer platform. Zero config. Maximum power.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base shadow-lg shadow-indigo-500/20">
            Start for Free →
          </Link>
          <Link href="/login" className="border border-gray-700 hover:border-indigo-600 text-gray-300 hover:text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base">
            View Demo
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-800 bg-gray-900/50 py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-around gap-6 text-center">
          {[
            { value: "6", label: "Core Modules" },
            { value: "1", label: "Unified Interface" },
            { value: "Zero", label: "Config Deploys" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{s.value}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Six powerful modules, one cohesive platform. Toggle what you need, ignore what you don&apos;t.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-gray-900 border border-gray-800 hover:border-indigo-800/60 rounded-xl p-6 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/40 flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-900/50 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{f.description}</p>
                <ul className="space-y-1.5">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle size={13} className="text-indigo-500 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-24 bg-gray-900/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400">From zero to production in three steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="relative">
                <div className="text-5xl font-black text-indigo-900/60 mb-4">{s.num}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 to-violet-950/20 pointer-events-none rounded-2xl" />
            <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(to right, #4f46e5, #7c3aed)", padding: "1px", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-3">Ready to build?</h2>
              <p className="text-gray-400 mb-8">Start your project today. No credit card required.</p>
              <Link href="/register" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-10 py-3.5 rounded-xl transition-colors shadow-lg shadow-indigo-500/25">
                Get Started — it&apos;s free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-indigo-400 font-semibold">QoreDev</span>
          <div className="flex gap-6">
            <a href="#features" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Features</a>
            <Link href="/dashboard" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Dashboard</Link>
            <Link href="/login" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Sign in</Link>
          </div>
          <span className="text-xs text-gray-600">© {new Date().getFullYear()} QoreDev. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
