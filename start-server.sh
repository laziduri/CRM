#!/bin/bash

echo "🚀 Starting your development server..."
echo ""

cd /Users/lazawalrus/CRM

# Kill any existing process on port 3000
echo "📌 Freeing port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "   ✓ Killed existing process" || echo "   ✓ Port is free"

# Clean build cache
echo "🧹 Cleaning build cache..."
rm -rf .next
echo "   ✓ Cache cleared"

# Find and use npm
if command -v npm &> /dev/null; then
    NPM_CMD="npm"
elif [ -f "/usr/local/bin/npm" ]; then
    NPM_CMD="/usr/local/bin/npm"
elif [ -d "$HOME/.nvm" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    NPM_CMD="npm"
else
    echo "❌ Error: npm not found. Please install Node.js first."
    exit 1
fi

echo ""
echo "🚀 Starting Next.js dev server..."
echo "   Server will be available at: http://localhost:3000"
echo "   Press Ctrl+C to stop the server"
echo ""

# Start the server
$NPM_CMD run dev
