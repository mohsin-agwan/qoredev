import Link from "next/link";

const features = [
  {
    title: "Supabase Auth",
    description:
      "Email/password and magic link authentication out of the box, backed by Supabase.",
  },
  {
    title: "Vector Database",
    description:
      "PostgreSQL with pgvector support for semantic search and AI embeddings.",
  },
  {
    title: "AI Copilot",
    description:
      "Autonomous AI assistant with a 'stuck' mode that breaks down complex problems step by step.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight text-indigo-400">
          QoreDev
        </span>
        <nav className="flex gap-4">
          <Link
            href="/login"
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md transition-colors"
          >
            Get started
          </Link>
        </nav>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-4">
          AI-Native Backend OS
        </span>
        <h1 className="text-5xl font-extrabold leading-tight text-white mb-6 max-w-3xl">
          Build faster with an intelligent backend that thinks with you
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mb-10">
          QoreDev combines authentication, vector storage, and an autonomous AI
          copilot into one unified developer platform.
        </p>
        <div className="flex gap-4">
          <Link
            href="/register"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-gray-400">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-800 px-6 py-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} QoreDev. All rights reserved.
      </footer>
    </main>
  );
}
