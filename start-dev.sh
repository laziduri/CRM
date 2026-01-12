#!/bin/bash

echo "🚀 Starting Next.js Development Server..."
echo ""

# Navigate to project directory
cd /Users/lazawalrus/CRM

# Kill any existing process on port 3000
echo "📌 Checking port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "   ✓ Killed existing process" || echo "   ✓ Port 3000 is free"

# Clean build cache
echo "🧹 Cleaning build cache..."
rm -rf .next
echo "   ✓ Cache cleared"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "   ✓ Dependencies found"
fi

echo ""
echo "🚀 Starting dev server..."
echo "   Waiting for server to start..."
echo ""

# Start the dev server
npm run dev
