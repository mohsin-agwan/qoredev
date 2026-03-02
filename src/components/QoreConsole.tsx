"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Terminal, Trash2 } from "lucide-react";

type LogType = "info" | "success" | "error" | "warning";
type FilterType = "all" | LogType;

interface LogEntry {
  id: number;
  time: string;
  msg: string;
  type: LogType;
}

const TYPE_STYLES: Record<LogType, string> = {
  info: "text-gray-400",
  success: "text-green-400",
  error: "text-red-400",
  warning: "text-yellow-400",
};

const TYPE_PREFIX: Record<LogType, string> = {
  info: "[INFO]",
  success: "[OK]",
  error: "[ERR]",
  warning: "[WARN]",
};

const MAX_LOG_ENTRIES = 50;

const FILTER_LABELS: { key: FilterType; label: string }[] = [
  { key: "all",     label: "All" },
  { key: "info",    label: "Info" },
  { key: "success", label: "OK" },
  { key: "error",   label: "Err" },
  { key: "warning", label: "Warn" },
];

const SIMULATED_LOGS: { msg: string; type: LogType }[] = [
  { msg: "Scanning repository for changes…", type: "info" },
  { msg: "Detected new commit on main branch.", type: "info" },
  { msg: "Running pre-deploy checks…", type: "info" },
  { msg: "All checks passed.", type: "success" },
  { msg: "Building Docker image…", type: "info" },
  { msg: "Image built successfully.", type: "success" },
  { msg: "Pushing image to registry…", type: "info" },
  { msg: "Image pushed: qoredev/app:latest", type: "success" },
  { msg: "Deploying to production environment…", type: "info" },
  { msg: "Health check passed. Service is live.", type: "success" },
];

const QoreConsole = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((message: string, type: LogType = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev.slice(-(MAX_LOG_ENTRIES - 1)),
      { id: Date.now(), time: timestamp, msg: message, type },
    ]);
  }, []);

  // Seed initial logs client-side to avoid hydration timestamp mismatch
  useEffect(() => {
    const now = new Date();
    const t1 = new Date(now.getTime() - 8000).toLocaleTimeString();
    const t2 = new Date(now.getTime() - 4000).toLocaleTimeString();
    setLogs([
      { id: 1, time: t1, msg: "System initialized. Ready for command.", type: "info" },
      { id: 2, time: t2, msg: "Owner verified: Mohsin Agwan.", type: "success" },
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < SIMULATED_LOGS.length) {
        const { msg, type } = SIMULATED_LOGS[index];
        addLog(msg, type);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [addLog]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const filteredLogs = filter === "all" ? logs : logs.filter((l) => l.type === filter);

  return (
    <section className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
        <Terminal className="w-4 h-4 text-indigo-400" />
        <span className="text-sm font-semibold text-indigo-400 tracking-wide">
          QoreConsole
        </span>
        <span className="ml-auto text-xs text-gray-500 mr-2">{logs.length} entries</span>
        {/* Filter tabs */}
        <div className="flex items-center gap-1">
          {FILTER_LABELS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`text-xs px-2 py-0.5 rounded transition-colors ${
                filter === key
                  ? "bg-indigo-600/30 text-indigo-300"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setLogs([])}
          aria-label="Clear logs"
          className="text-gray-500 hover:text-red-400 transition-colors ml-2"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="h-64 overflow-y-auto px-4 py-3 font-mono text-xs space-y-1">
        {filteredLogs.length === 0 ? (
          <p className="text-gray-600 italic">
            No log entries{filter !== "all" ? ` matching filter "${filter}"` : ""}.
          </p>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex gap-2">
              <span className="text-gray-600 shrink-0">{log.time}</span>
              <span
                className={`shrink-0 font-semibold ${TYPE_STYLES[log.type]}`}
              >
                {TYPE_PREFIX[log.type]}
              </span>
              <span className="text-gray-300">{log.msg}</span>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </section>
  );
};

export default QoreConsole;
