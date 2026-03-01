#!/usr/bin/env node
// QoreDev: qf-init — Generates qf-manifest.json from .env.example and project metadata

const fs = require("fs");
const path = require("path");

const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
);

const envExample = fs.existsSync(
  path.join(__dirname, "..", ".env.example")
)
  ? fs
      .readFileSync(path.join(__dirname, "..", ".env.example"), "utf8")
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("#"))
      .map((line) => line.split("=")[0].trim())
  : [];

const manifest = {
  name: pkg.name,
  version: pkg.version,
  generatedAt: new Date().toISOString(),
  stack: {
    framework: "Next.js 14 (App Router)",
    auth: "Supabase",
    ai: "OpenAI",
    frontendHosting: "Vercel",
    backendHosting: "Railway",
    styling: "Tailwind CSS",
  },
  requiredEnvVars: envExample,
  scripts: Object.keys(pkg.scripts || {}),
  endpoints: {
    dashboard: "http://localhost:3000",
    health: "/api/health",
    copilot: "/api/copilot",
  },
};

const outPath = path.join(__dirname, "..", "qf-manifest.json");
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n");
console.log("✅ qf-manifest.json generated successfully.");
