"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Terminal } from "lucide-react";

type LogType = "info" | "success" | "error" | "warning";

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
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const now = new Date();
    const t1 = new Date(now.getTime() - 8000).toLocaleTimeString();
    const t2 = new Date(now.getTime() - 4000).toLocaleTimeString();
    return [
      { id: 1, time: t1, msg: "System initialized. Ready for command.", type: "info" },
      { id: 2, time: t2, msg: "Owner verified: Mohsin Agwan.", type: "success" },
    ];
  });
  const logEndRef = useRef<HTMLDivElement>(null);

  // Simulates listening to the Auto-Deployer script
  const addLog = useCallback((message: string, type: LogType = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev.slice(-9),
      { id: Date.now(), time: timestamp, msg: message, type },
    ]);
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

  return (
    <section className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
        <Terminal className="w-4 h-4 text-indigo-400" />
        <span className="text-sm font-semibold text-indigo-400 tracking-wide">
          QoreConsole
        </span>
        <span className="ml-auto text-xs text-gray-500">Auto-Deployer</span>
      </div>
      <div className="h-64 overflow-y-auto px-4 py-3 font-mono text-xs space-y-1">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2">
            <span className="text-gray-600 shrink-0">{log.time}</span>
            <span
              className={`shrink-0 font-semibold ${TYPE_STYLES[log.type]}`}
            >
              {TYPE_PREFIX[log.type]}
            </span>
            <span className="text-gray-300">{log.msg}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </section>
  );
};

export default QoreConsole;
