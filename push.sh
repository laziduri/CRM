#!/bin/bash
# GitHub Push Helper Script
# Usage: ./push.sh YOUR_GITHUB_TOKEN
# Or: GITHUB_TOKEN=your_token ./push.sh

if [ -z "$1" ] && [ -z "$GITHUB_TOKEN" ]; then
  echo "Usage: ./push.sh YOUR_GITHUB_TOKEN"
  echo "Or set it as an environment variable: GITHUB_TOKEN=your_token ./push.sh"
  exit 1
fi

TOKEN=${1:-$GITHUB_TOKEN}
cd /Users/lazawalrus/CRM

# Update remote URL with token
git remote set-url origin https://${TOKEN}@github.com/laziduri/CRM.git

# Push to main
git push origin main

# Restore original remote (without token in URL for security)
git remote set-url origin https://github.com/laziduri/CRM.git

echo "Push completed successfully!"
