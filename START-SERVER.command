#!/bin/bash

# Change to project directory
cd "$(dirname "$0")"

echo "🚀 Starting Next.js Development Server..."
echo ""

# Kill any existing process on port 3000
echo "📌 Checking port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "   ✓ Killed existing process" || echo "   ✓ Port 3000 is free"

# Clean build cache
echo "🧹 Cleaning build cache..."
rm -rf .next
echo "   ✓ Cache cleared"
echo ""

# Start the dev server
echo "🚀 Starting dev server..."
echo "   Open http://localhost:3000 in your browser once you see 'Ready'"
echo "   Press Ctrl+C to stop the server"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm run dev
