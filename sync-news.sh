#!/bin/bash

# Script untuk otomatisasi sinkronisasi berita
# Usage: ./sync-news.sh

set -e

echo "🚀 Starting news synchronization..."

# Configuration
REPO_URL="https://github.com/SMPITdaaruttarbiyah/smpit-dti-web.git"
BRANCH="main"
NEWS_FILE="assets/data/news.json"
TEMP_DIR="/tmp/smpit-sync-$$"

# Create temporary directory
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

# Clone repository
echo "📥 Cloning repository..."
git clone "$REPO_URL" .
git checkout "$BRANCH"

# Check if there are news updates
if [ -f "$NEWS_FILE" ]; then
    echo "📊 Found news data file"
    NEWS_COUNT=$(jq '.statistics.totalNews' "$NEWS_FILE" 2>/dev/null || echo "0")
    echo "📰 Total news items: $NEWS_COUNT"
    
    # Add and commit changes
    git add "$NEWS_FILE"
    
    if git diff --staged --quiet; then
        echo "ℹ️ No changes to commit"
    else
        echo "💾 Committing changes..."
        git config user.name "SMPIT DTI Bot"
        git config user.email "smpitdti@users.noreply.github.com"
        git commit -m "Update news data - $(date '+%Y-%m-%d %H:%M:%S') [${NEWS_COUNT} items]"
        
        echo "🔄 Pushing to repository..."
        git push origin "$BRANCH"
        
        echo "✅ News data synchronized successfully!"
        echo "🌐 Website will update in 1-3 minutes: https://smpitdaaruttarbiyah.github.io/smpit-dti-web/"
    fi
else
    echo "⚠️ News data file not found"
fi

# Cleanup
cd /
rm -rf "$TEMP_DIR"

echo "🎉 Synchronization completed!"