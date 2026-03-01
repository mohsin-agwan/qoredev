import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-4" aria-label="Error 404 — Not Found">
        404 — Not Found
      </span>
      <h1 className="text-5xl font-extrabold text-white mb-4">
        Page not found
      </h1>
      <p className="text-gray-400 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Back to home
      </Link>
    </main>
  );
}
