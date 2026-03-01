"use client";

export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import nextDynamic from "next/dynamic";
import {
  Settings,
  Shield,
  Database,
  CreditCard,
  Cpu,
  LayoutDashboard,
  GitMerge,
  Terminal,
  Plug,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import QoreConsole from "@/components/QoreConsole";

const QuantumCanvas = nextDynamic(() => import("@/components/QuantumCanvas"), {
  ssr: false,
});

type ToggleKey = "auth" | "database" | "payments" | "ai_copilot";
type TabId = "overview" | "features" | "copilot" | "payments" | "canvas" | "console";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  active: boolean;
  onToggle: () => void;
}

const FeatureCard = ({ icon, title, active, onToggle }: FeatureCardProps) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <span className={active ? "text-indigo-400" : "text-gray-600"}>{icon}</span>
      <span className="text-sm font-medium text-white">{title}</span>
    </div>
    <button
      onClick={onToggle}
      aria-label={`Toggle ${title}`}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
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
);

const featureConfig: { key: ToggleKey; icon: React.ReactNode; title: string }[] = [
  { key: "auth", icon: <Shield size={18} />, title: "Auth" },
  { key: "database", icon: <Database size={18} />, title: "Database" },
  { key: "payments", icon: <CreditCard size={18} />, title: "Payments" },
  { key: "ai_copilot", icon: <Cpu size={18} />, title: "AI Copilot" },
];

const navItems: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { id: "features", label: "Features", icon: <Settings size={18} /> },
  { id: "copilot", label: "AI Copilot", icon: <Cpu size={18} /> },
  { id: "payments", label: "Payments", icon: <CreditCard size={18} /> },
  { id: "canvas", label: "Canvas", icon: <GitMerge size={18} /> },
  { id: "console", label: "Console", icon: <Terminal size={18} /> },
];

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const [manifest, setManifest] = useState({
    project: { name: "QoreDev", owner: "Mohsin Agwan" },
    magic_toggles: {
      auth: true,
      database: true,
      payments: false,
      ai_copilot: true,
    },
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

  const [paymentAmount, setPaymentAmount] = useState("");
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
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
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
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPaymentError(data.error ?? "Payment failed.");
      } else {
        setPaymentResult(JSON.stringify(data, null, 2));
      }
    } catch {
      setPaymentError("Network error. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  }

  const activeCount = useMemo(
    () => Object.values(manifest.magic_toggles).filter(Boolean).length,
    [manifest.magic_toggles]
  );

  const MagicToggles = ({ showDesc }: { showDesc?: boolean }) => (
    <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <Settings size={18} className="text-indigo-400" />
        <h2 className="text-lg font-semibold text-white">Magic Toggles</h2>
      </div>
      <p className="text-sm text-gray-400 mb-5">
        {showDesc
          ? "Enable or disable individual platform modules. Each toggle instructs the QoreOrchestrator to provision or teardown the corresponding service in your stack."
          : <>Enable or disable features for <span className="text-indigo-400 font-medium">{manifest.project.name}</span>. Changes trigger re-provisioning.</>}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {featureConfig.map(({ key, icon, title }) => (
          <FeatureCard
            key={key}
            icon={icon}
            title={title}
            active={manifest.magic_toggles[key]}
            onToggle={() => toggleFeature(key)}
          />
        ))}
      </div>
    </section>
  );

  const CopilotSection = () => (
    <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-1">AI Copilot</h2>
      <p className="text-sm text-gray-400 mb-6">
        Ask anything about your backend, architecture, or code. Enable{" "}
        <strong className="text-indigo-400">Stuck mode</strong> if you need a step-by-step breakdown.
      </p>
      <form onSubmit={handleCopilot} className="space-y-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={4}
          placeholder="e.g. How do I set up row-level security for a multi-tenant app?"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
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
        <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{response}</div>
      )}
    </section>
  );

  const PaymentsSection = () => (
    <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-1">Universal Payment Connector</h2>
      <p className="text-sm text-gray-400 mb-1">
        Powered by{" "}
        <code className="text-indigo-400 text-xs bg-gray-800 px-1.5 py-0.5 rounded">QoreConnector</code>{" "}
        — one interface for Stripe, PayPal, and Razorpay.
      </p>
      <p className="text-xs text-gray-500 mb-6">
        Enable providers via env vars (<code className="text-gray-400">QORE_PAYMENTS_STRIPE_ENABLED=true</code>, etc.).
      </p>
      <form onSubmit={handlePayment} className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1">Amount (USD)</label>
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
    </section>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-950/60 to-violet-950/30 border border-indigo-800/30 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-1">
                Welcome back to <span className="text-indigo-400">{manifest.project.name}</span>
              </h2>
              <p className="text-gray-400 text-sm">Your AI copilot is ready. {activeCount} of {featureConfig.length} features active.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Features Active", value: `${activeCount} / ${featureConfig.length}`, icon: <Settings size={18} />, color: "text-indigo-400" },
                { label: "AI Queries", value: "Ready", icon: <Cpu size={18} />, color: "text-violet-400" },
                { label: "Payments", value: manifest.magic_toggles.payments ? "Configured" : "Not Configured", icon: <CreditCard size={18} />, color: manifest.magic_toggles.payments ? "text-green-400" : "text-gray-500" },
                { label: "Canvas", value: "Live", icon: <GitMerge size={18} />, color: "text-cyan-400" },
              ].map((m) => (
                <div key={m.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className={`${m.color} mb-3`}>{m.icon}</div>
                  <div className="text-lg font-bold text-white">{m.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
            <MagicToggles />
          </div>
        );
      case "features":
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Feature Management</h2>
              <p className="text-gray-400 text-sm">Control which platform modules are active for your project.</p>
            </div>
            <MagicToggles showDesc />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <Shield size={20} />, title: "Auth Module", desc: "Supabase-backed email, magic link, and session management." },
                { icon: <Database size={20} />, title: "Vector Database", desc: "pgvector-enabled PostgreSQL for semantic search and embeddings." },
                { icon: <Plug size={20} />, title: "Universal Connectors", desc: "One interface for payments, storage, and email providers." },
                { icon: <Zap size={20} />, title: "Auto-Deploy Watcher", desc: "Manifest-driven CI that deploys to Railway and Vercel on save." },
              ].map((c) => (
                <div key={c.title} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="text-indigo-400 mb-3">{c.icon}</div>
                  <h3 className="text-sm font-semibold text-white mb-1">{c.title}</h3>
                  <p className="text-xs text-gray-400">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "copilot":
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">AI Copilot</h2>
              <p className="text-gray-400 text-sm">Autonomous reasoning for your backend challenges.</p>
            </div>
            <CopilotSection />
          </div>
        );
      case "payments":
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Payment Connector</h2>
              <p className="text-gray-400 text-sm">Process payments via the unified QoreConnector interface.</p>
            </div>
            <PaymentsSection />
          </div>
        );
      case "canvas":
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Quantum Canvas</h2>
              <p className="text-gray-400 text-sm">Visually connect your database entities. Drag nodes and draw edges to establish relational links.</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <QuantumCanvas />
            </div>
          </div>
        );
      case "console":
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">QoreConsole</h2>
              <p className="text-gray-400 text-sm">Real-time logs and orchestrator events.</p>
            </div>
            <QoreConsole />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between bg-gray-950 z-10">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight text-indigo-400">QoreDev</span>
          <span className="hidden sm:block text-gray-600">·</span>
          <span className="hidden sm:block text-sm text-gray-400">{manifest.project.name}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar — hidden on mobile */}
        <aside className="hidden md:flex flex-col w-56 border-r border-gray-800 bg-gray-950 p-4 gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left w-full ${
                activeTab === item.id
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-700/40"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </aside>

        {/* Mobile tabs */}
        <div role="tablist" aria-orientation="horizontal" className="md:hidden w-full border-b border-gray-800 flex overflow-x-auto bg-gray-950 px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === item.id
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
