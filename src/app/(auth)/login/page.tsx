"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

const highlights = [
  "Supabase-backed auth with magic links",
  "Vector DB + AI Copilot built-in",
  "Zero-config deploys to Railway & Vercel",
];

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleMagicLink() {
    if (!email) {
      setError("Enter your email address first.");
      return;
    }
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message);
    } else {
      setMagicLinkSent(true);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex bg-gray-950">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gray-900 border-r border-gray-800 p-12">
        <span className="text-2xl font-bold text-indigo-400">QoreDev</span>
        <div>
          <h2 className="text-4xl font-extrabold text-white leading-snug mb-4">
            Your AI-native<br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">backend platform.</span>
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Everything you need to build, ship, and scale — auth, AI, databases, and payments unified into one developer experience.
          </p>
          <ul className="space-y-3">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle size={16} className="text-indigo-400 shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-gray-600">© {new Date().getFullYear()} QoreDev. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <span className="text-2xl font-bold text-indigo-400">QoreDev</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-sm text-gray-400 mb-8">Sign in to your QoreDev account</p>

          {magicLinkSent ? (
            <div className="text-center py-10 bg-gray-900 border border-gray-800 rounded-xl px-6">
              <CheckCircle size={40} className="text-green-400 mx-auto mb-4" />
              <p className="text-green-400 font-medium text-lg">Magic link sent!</p>
              <p className="text-sm text-gray-400 mt-2">Check your email to continue.</p>
            </div>
          ) : (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>

              <button
                type="button"
                onClick={handleMagicLink}
                disabled={loading}
                className="w-full border border-gray-700 hover:border-indigo-600 disabled:opacity-50 text-gray-300 hover:text-white font-medium py-3 rounded-lg transition-colors text-sm"
              >
                Send magic link
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
