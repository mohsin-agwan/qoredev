const fs = require('fs');
const { execSync } = require('child_process');
const chokidar = require('chokidar'); // Library to watch file changes

console.log("⚡ QoreDev Auto-Deployer is watching for magic movements...");

// Watch the manifest for any saved changes
chokidar.watch('qf-manifest.json').on('change', (path) => {
  console.log(`🔮 Manifest change detected! Synchronizing infrastructure...`);

  try {
    const manifest = JSON.parse(fs.readFileSync(path, 'utf8'));

    // 1. Check for Database Migrations
    if (manifest.magic_toggles?.database?.auto_migrations) {
      console.log("🛠️ Running AI-Generated SQL Migrations...");
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    }

    // 2. Trigger Cloud Deployment
    console.log("🚀 Pushing updates to Railway & Vercel...");

    // Deploys the backend services to Railway
    execSync('railway up --detach', { stdio: 'inherit' });

    // Deploys the frontend to Vercel
    execSync('vercel --prod --confirm', { stdio: 'inherit' });

    console.log("✅ Deployment Successful. Your changes are live!");
    console.log(`📞 Support: ${manifest.project?.contact ?? 'N/A'}`);

  } catch (error) {
    console.error("❌ Deployment Failed. Copilot is analyzing the logs...", error.message);
  }
});
