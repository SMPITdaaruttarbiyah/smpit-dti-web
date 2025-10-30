#!/bin/bash

# SMPIT DTI Manual Sync Script
# This script manually syncs news data to GitHub

echo "🔄 SMPIT DTI Manual Sync Script"
echo "================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the project root directory"
    exit 1
fi

# Build the project
echo "🏗️  Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Extract news data
echo "📊 Extracting news data..."
node extract-news.js

if [ $? -ne 0 ]; then
    echo "❌ News extraction failed"
    exit 1
fi

# Check if there are changes
if git diff --quiet && git diff --staged --quiet; then
    echo "✅ No changes to sync"
    exit 0
fi

# Add changes
echo "📝 Adding changes to git..."
git add -A

# Commit changes
echo "💾 Committing changes..."
git commit -m "Manual sync: Update news data and build $(date '+%Y-%m-%d %H:%M:%S')"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Sync completed successfully!"
    echo "🌐 Website will be updated in 1-3 minutes"
else
    echo "❌ Push failed. Please check your git configuration."
    exit 1
fi

echo ""
echo "📋 Sync Summary:"
echo "   • Build: ✅ Success"
echo "   • News extraction: ✅ Success" 
echo "   • Git commit: ✅ Success"
echo "   • GitHub push: ✅ Success"
echo ""
echo "🎉 All done! Your changes are now live on GitHub Pages."