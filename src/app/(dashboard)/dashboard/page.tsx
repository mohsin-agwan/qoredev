"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Settings, Shield, Database, CreditCard, Cpu } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import QoreConsole from "@/components/QoreConsole";

type ToggleKey = "auth" | "database" | "payments" | "ai_copilot";

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

const featureConfig: {
  key: ToggleKey;
  icon: React.ReactNode;
  title: string;
}[] = [
  { key: "auth", icon: <Shield size={18} />, title: "Auth" },
  { key: "database", icon: <Database size={18} />, title: "Database" },
  { key: "payments", icon: <CreditCard size={18} />, title: "Payments" },
  { key: "ai_copilot", icon: <Cpu size={18} />, title: "AI Copilot" },
];

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

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

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight text-indigo-400">
          QoreDev
        </span>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </header>

      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400 mb-10">Welcome back. Your AI copilot is ready.</p>

        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Settings size={18} className="text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Magic Toggles</h2>
          </div>
          <p className="text-sm text-gray-400 mb-5">
            Enable or disable platform features for{" "}
            <span className="text-indigo-400 font-medium">
              {manifest.project.name}
            </span>
            . Changes trigger the QoreOrchestrator to re-provision your stack.
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

        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-1">AI Copilot</h2>
          <p className="text-sm text-gray-400 mb-6">
            Ask anything about your backend, architecture, or code. Enable{" "}
            <strong className="text-indigo-400">Stuck mode</strong> if you need a
            step-by-step breakdown.
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
                <span className="text-sm text-gray-300">
                  Stuck mode — break it down step by step
                </span>
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
            <div className="mt-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-300">
              {error}
            </div>
          )}

          {response && (
            <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
              {response}
            </div>
          )}
        </section>

        <div className="mt-8">
          <QoreConsole />
        </div>
      </div>
    </main>
  );
}
