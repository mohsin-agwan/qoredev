"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import nextDynamic from "next/dynamic";
import {
  Settings,
  Shield,
  Database,
  CreditCard,
  Cpu,
  LayoutDashboard,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Copy,
  CheckCheck,
  Zap,
  BarChart3,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import QoreConsole from "@/components/QoreConsole";

const QuantumCanvas = nextDynamic(() => import("@/components/QuantumCanvas"), {
  ssr: false,
});

type ToggleKey = "auth" | "database" | "payments" | "ai_copilot";
type SectionKey = "overview" | "toggles" | "copilot" | "payments" | "canvas";
type CurrencyCode = "USD" | "EUR" | "GBP" | "INR";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}

const FeatureCard = ({ icon, title, description, active, onToggle }: FeatureCardProps) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <span className={`p-2 rounded-lg mt-0.5 ${active ? "bg-indigo-950 text-indigo-400" : "bg-gray-800 text-gray-600"}`}>
          {icon}
        </span>
        <div>
          <span className="text-sm font-medium text-white block">{title}</span>
          <span className="text-xs text-gray-500 mt-0.5 block">{description}</span>
        </div>
      </div>
      <button
        onClick={onToggle}
        aria-label={`Toggle ${title}`}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-shrink-0 ${
          active ? "bg-indigo-600" : "bg-gray-700"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            active ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  </div>
);

const featureConfig: { key: ToggleKey; icon: React.ReactNode; title: string; description: string }[] = [
  { key: "auth",       icon: <Shield size={18} />,     title: "Auth",       description: "Email, magic link & session management" },
  { key: "database",   icon: <Database size={18} />,   title: "Database",   description: "PostgreSQL + pgvector with AI embeddings" },
  { key: "payments",   icon: <CreditCard size={18} />, title: "Payments",   description: "Stripe, PayPal & Razorpay via one connector" },
  { key: "ai_copilot", icon: <Cpu size={18} />,        title: "AI Copilot", description: "Autonomous assistant with stuck mode" },
];

const MAX_QUERY_LENGTH = 2000;

const CURRENCIES: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: "USD", symbol: "$", label: "USD — US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR — Euro" },
  { code: "GBP", symbol: "£", label: "GBP — British Pound" },
  { code: "INR", symbol: "₹", label: "INR — Indian Rupee" },
];

const PAYMENT_PROVIDERS = [
  { key: "stripe",   label: "Stripe",   envHint: "QORE_PAYMENTS_STRIPE_ENABLED" },
  { key: "paypal",   label: "PayPal",   envHint: "QORE_PAYMENTS_PAYPAL_ENABLED" },
  { key: "razorpay", label: "Razorpay", envHint: "QORE_PAYMENTS_RAZORPAY_ENABLED" },
];

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [activeSection, setActiveSection] = useState<SectionKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [manifest, setManifest] = useState({
    project: { name: "QoreDev", owner: "Mohsin Agwan" },
    magic_toggles: { auth: true, database: true, payments: false, ai_copilot: true },
  });

  const toggleFeature = (key: ToggleKey) => {
    setManifest((prev) => ({
      ...prev,
      magic_toggles: { ...prev.magic_toggles, [key]: !prev.magic_toggles[key] },
    }));
    console.log(`🔮 QoreDev Agent: Re-provisioning ${key}...`);
  };

  const [query, setQuery] = useState("");
  const [stuck, setStuck] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ q: string; a: string; stuck: boolean }[]>([]);

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentCurrency, setPaymentCurrency] = useState<CurrencyCode>("USD");
  const [paymentResult, setPaymentResult] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function handleCopilot(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, stuck }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setResponse(data.answer);
        setChatHistory((prev) => [{ q: query, a: data.answer, stuck }, ...prev.slice(0, 4)]);
        setQuery("");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyResponse(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API not available
    }
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) {
      setPaymentError("Please enter a valid amount greater than zero.");
      return;
    }
    setPaymentLoading(true);
    setPaymentError(null);
    setPaymentResult(null);
    try {
      const res = await fetch("/api/connectors/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: paymentCurrency }),
      });
      const data = await res.json();
      if (!res.ok) setPaymentError(data.error ?? "Payment failed.");
      else setPaymentResult(JSON.stringify(data, null, 2));
    } catch {
      setPaymentError("Network error. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  }

  const activeCount = Object.values(manifest.magic_toggles).filter(Boolean).length;

  const navItems: { key: SectionKey; icon: React.ReactNode; label: string; badge?: number }[] = [
    { key: "overview",  icon: <LayoutDashboard size={17} />, label: "Overview" },
    { key: "toggles",   icon: <Settings size={17} />,        label: "Magic Toggles", badge: activeCount },
    { key: "copilot",   icon: <Cpu size={17} />,             label: "AI Copilot",    badge: chatHistory.length > 0 ? chatHistory.length : undefined },
    { key: "payments",  icon: <CreditCard size={17} />,      label: "Payments" },
    { key: "canvas",    icon: <Database size={17} />,        label: "Quantum Canvas" },
  ];

  const selectedCurrency = CURRENCIES.find((c) => c.code === paymentCurrency)!;

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-60 flex-shrink-0 flex flex-col bg-gray-900 border-r border-gray-800 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-2 px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">Q</span>
            <span className="text-base font-bold text-white tracking-tight">QoreDev</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ key, icon, label, badge }) => (
            <button
              key={key}
              onClick={() => { setActiveSection(key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === key
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-600/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {icon}
              <span className="flex-1 text-left">{label}</span>
              {badge !== undefined && badge > 0 && (
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                  activeSection === key ? "bg-indigo-600/40 text-indigo-300" : "bg-gray-700 text-gray-400"
                }`}>
                  {badge}
                </span>
              )}
              {activeSection === key && <ChevronRight size={14} className="ml-auto shrink-0" />}
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-gray-800">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-400 hover:text-white"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white capitalize">
              {navItems.find((n) => n.key === activeSection)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-900 border border-gray-800 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              {activeCount} active
            </span>
            <button
              onClick={handleSignOut}
              className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 overflow-y-auto px-6 py-8 max-w-4xl w-full mx-auto">

          {/* Overview */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              <p className="text-gray-400 text-sm">Welcome back to your AI-native backend platform.</p>

              {/* Feature status cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featureConfig.map(({ key, icon, title }) => (
                  <div
                    key={key}
                    className={`rounded-xl p-4 border transition-colors ${
                      manifest.magic_toggles[key]
                        ? "bg-indigo-950/30 border-indigo-800/50"
                        : "bg-gray-900 border-gray-800"
                    }`}
                  >
                    <span className={manifest.magic_toggles[key] ? "text-indigo-400" : "text-gray-600"}>
                      {icon}
                    </span>
                    <p className="mt-2 text-sm font-medium text-white">{title}</p>
                    <p className={`text-xs mt-0.5 ${manifest.magic_toggles[key] ? "text-indigo-400" : "text-gray-500"}`}>
                      {manifest.magic_toggles[key] ? "Active" : "Disabled"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={16} className="text-indigo-400" />
                  <h2 className="text-sm font-semibold text-white">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {navItems.filter((n) => n.key !== "overview").map(({ key, icon, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveSection(key)}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-colors text-gray-300 hover:text-white"
                    >
                      <span className="text-indigo-400">{icon}</span>
                      <span className="text-xs font-medium text-center">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* System info */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 size={16} className="text-indigo-400" />
                  <h2 className="text-sm font-semibold text-white">System Info</h2>
                </div>
                <p className="text-sm text-gray-400">
                  Project: <span className="text-white font-medium">{manifest.project.name}</span>
                  {" · "}
                  Owner: <span className="text-white font-medium">{manifest.project.owner}</span>
                  {" · "}
                  <span className="text-indigo-400 font-medium">{activeCount} of {featureConfig.length} features active</span>
                </p>
              </div>

              <QoreConsole />
            </div>
          )}

          {/* Magic Toggles */}
          {activeSection === "toggles" && (
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Settings size={18} className="text-indigo-400" />
                  <h2 className="text-lg font-semibold text-white">Magic Toggles</h2>
                  <span className="ml-auto text-xs text-indigo-400 font-semibold bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded-full">
                    {activeCount}/{featureConfig.length} active
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-5">
                  Enable or disable platform features for{" "}
                  <span className="text-indigo-400 font-medium">{manifest.project.name}</span>.
                  Changes trigger the QoreOrchestrator to re-provision your stack.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {featureConfig.map(({ key, icon, title, description }) => (
                    <FeatureCard
                      key={key}
                      icon={icon}
                      title={title}
                      description={description}
                      active={manifest.magic_toggles[key]}
                      onToggle={() => toggleFeature(key)}
                    />
                  ))}
                </div>
              </div>

              {/* Manifest preview */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-widest">qf-manifest.json preview</p>
                <pre className="text-xs text-green-300 font-mono bg-gray-950 rounded-lg p-4 overflow-x-auto">
                  {JSON.stringify(manifest, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* AI Copilot */}
          {activeSection === "copilot" && (
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-1">AI Copilot</h2>
                <p className="text-sm text-gray-400 mb-6">
                  Ask anything about your backend, architecture, or code. Enable{" "}
                  <strong className="text-indigo-400">Stuck mode</strong> for step-by-step breakdowns.
                </p>
                <form onSubmit={handleCopilot} className="space-y-4">
                  <div className="relative">
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      rows={4}
                      maxLength={MAX_QUERY_LENGTH}
                      placeholder="e.g. How do I set up row-level security for a multi-tenant app?"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                    <span className="absolute bottom-2 right-3 text-xs text-gray-600">{query.length}/{MAX_QUERY_LENGTH}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={stuck}
                        onChange={(e) => setStuck(e.target.checked)}
                        className="w-4 h-4 accent-indigo-500"
                      />
                      <span className="text-sm text-gray-300">Stuck mode — break it down step by step</span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
                  >
                    {loading ? "Thinking…" : "Ask Copilot"}
                  </button>
                </form>
                {error && (
                  <div className="mt-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-300">{error}</div>
                )}
                {response && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Response</span>
                      <button
                        onClick={() => handleCopyResponse(response)}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        {copied ? <CheckCheck size={13} className="text-green-400" /> : <Copy size={13} />}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{response}</div>
                  </div>
                )}
              </div>

              {/* Session history */}
              {chatHistory.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white">Session History</h3>
                    <button
                      onClick={() => setChatHistory([])}
                      className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-4">
                    {chatHistory.map((item, i) => (
                      <div key={i} className="border-l-2 border-indigo-800/50 pl-4 space-y-2">
                        <p className="text-xs text-gray-400">
                          <span className="font-semibold text-indigo-400">Q:</span>{" "}
                          {item.q}
                          {item.stuck && <span className="ml-2 text-xs text-yellow-500">[Stuck mode]</span>}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-3">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payments */}
          {activeSection === "payments" && (
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-1">Universal Payment Connector</h2>
                <p className="text-sm text-gray-400 mb-1">
                  Powered by{" "}
                  <code className="text-indigo-400 text-xs bg-gray-800 px-1.5 py-0.5 rounded">QoreConnector</code>
                  {" "}— one interface for Stripe, PayPal, and Razorpay.
                </p>
                <p className="text-xs text-gray-500 mb-5">
                  Enable providers via env vars (<code className="text-gray-400">QORE_PAYMENTS_STRIPE_ENABLED=true</code>, etc.).
                </p>

                {/* Provider chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {PAYMENT_PROVIDERS.map(({ key, label }) => (
                    <span
                      key={key}
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-400"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                      {label}
                    </span>
                  ))}
                </div>

                <form onSubmit={handlePayment} className="flex flex-col sm:flex-row items-end gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Currency</label>
                    <select
                      value={paymentCurrency}
                      onChange={(e) => setPaymentCurrency(e.target.value as CurrencyCode)}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 w-full sm:w-auto">
                    <label className="block text-xs text-gray-400 mb-1">Amount ({selectedCurrency.symbol})</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="e.g. 49.99"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={paymentLoading || !paymentAmount || Number(paymentAmount) <= 0}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm whitespace-nowrap"
                  >
                    {paymentLoading ? "Processing…" : "Process Payment"}
                  </button>
                </form>
                {paymentError && (
                  <div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-300">{paymentError}</div>
                )}
                {paymentResult && (
                  <div className="mt-4 p-4 bg-gray-800 border border-gray-700 rounded-lg text-xs text-green-300 font-mono whitespace-pre-wrap leading-relaxed">{paymentResult}</div>
                )}
              </div>
            </div>
          )}

          {/* Quantum Canvas */}
          {activeSection === "canvas" && (
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-1">Quantum Canvas</h2>
                <p className="text-sm text-gray-400 mb-4">
                  Visually connect your database entities. Drag nodes and draw edges to establish relational links.
                </p>
                <QuantumCanvas />
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
