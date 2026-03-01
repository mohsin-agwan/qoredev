export default function DashboardLoading() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight text-indigo-400">
          QoreDev
        </span>
      </header>
      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-48 mb-4" />
        <div className="h-4 bg-gray-800 rounded w-72 mb-10" />
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div className="h-5 bg-gray-800 rounded w-32" />
          <div className="h-4 bg-gray-800 rounded w-full" />
          <div className="h-28 bg-gray-800 rounded" />
          <div className="h-10 bg-gray-800 rounded w-32" />
        </div>
      </div>
    </main>
  );
}
