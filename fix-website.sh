#!/bin/bash

echo "🔧 Fixing website issues..."

# Kill any process on port 3000
echo "📌 Killing processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No process found on port 3000"

# Remove build cache
echo "🧹 Cleaning build cache..."
rm -rf .next

# Remove node_modules and reinstall (optional, uncomment if needed)
# echo "📦 Reinstalling dependencies..."
# rm -rf node_modules
# npm install

echo "✅ Cleanup complete!"
echo ""
echo "Now run: npm run dev"
