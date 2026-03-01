#!/bin/bash

# QoreDev: The AI-Native Backend OS Installer
# Created by: Mohsin Agwan

echo "🚀 Starting QoreDev Installation..."

# 1. Environment Check
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required. Please install it and try again."
    exit 1
fi

# 2. Clone and Install Dependencies
echo "📂 Setting up QoreDev Monorepo..."
git clone https://github.com/mohsin-agwan/qoredev.git
cd qoredev
npm install

# 3. Authenticate Cloud Providers
echo "🔗 Connecting to Magic Infrastructure (Railway & Vercel)..."
if ! railway login; then
    echo "❌ Railway login failed. Please check your credentials and try again."
    exit 1
fi
if ! vercel login; then
    echo "❌ Vercel login failed. Please check your credentials and try again."
    exit 1
fi

# 4. Initialize the Brain
echo "🧠 Generating qf-manifest.json..."
npm run qf-init

# 5. Launch the Command Center
echo "✨ QoreDev is ready! Launching your Visual Dashboard..."
npm run dev

echo "--------------------------------------------------------"
echo "✅ Installation Complete!"
echo "📍 Dashboard: http://localhost:3000"
echo "📞 Support: 82338 33576"
echo "🌐 Updates: https://editra.studio"
echo "--------------------------------------------------------"
