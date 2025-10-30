#!/bin/bash

# ===================================
# SMPIT DAARUT TARBIYAH INDONESIA
# GitHub Update Script
# ===================================

echo "🚀 SMPIT DAARUT TARBIYAH INDONESIA - GitHub Update Script"
echo "=========================================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory."
    exit 1
fi

# Check current status
echo "📋 Checking current git status..."
git status

# Add all changes
echo "📁 Adding all changes..."
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "✅ No changes to commit. Everything is up to date!"
    exit 0
fi

# Create commit message
echo "📝 Creating commit..."
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
COMMIT_MESSAGE="Update website content - $TIMESTAMP

- Updated news and content
- Improved admin panel functionality
- Enhanced user experience
- Fixed bugs and performance issues

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git commit -m "$COMMIT_MESSAGE"

# Try to push to GitHub
echo "🚀 Pushing to GitHub..."
echo "Note: If authentication fails, please use one of these methods:"
echo "1. GitHub CLI: gh auth login"
echo "2. Personal Access Token: git remote set-url origin https://TOKEN@github.com/SMPITdaaruttarbiyah/smpit-dti-web.git"
echo "3. SSH Key: git remote set-url origin git@github.com:SMPITdaaruttarbiyah/smpit-dti-web.git"
echo ""

# Try different push methods
echo "🔄 Attempting to push..."

# Method 1: Try with GitHub CLI if available
if command -v gh &> /dev/null; then
    echo "📱 Using GitHub CLI..."
    if gh auth status &> /dev/null; then
        git push origin master
        if [ $? -eq 0 ]; then
            echo "✅ Successfully pushed to GitHub using GitHub CLI!"
            exit 0
        fi
    else
        echo "❌ GitHub CLI not authenticated. Run 'gh auth login' first."
    fi
fi

# Method 2: Try with HTTPS (will prompt for credentials)
echo "🔐 Trying HTTPS (will prompt for credentials)..."
git push origin master
if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    exit 0
fi

# Method 3: Instructions for manual setup
echo ""
echo "❌ Automatic push failed. Please set up authentication manually:"
echo ""
echo "Option 1 - GitHub CLI (Recommended):"
echo "  1. Install GitHub CLI: https://cli.github.com/"
echo "  2. Run: gh auth login"
echo "  3. Run this script again"
echo ""
echo "Option 2 - Personal Access Token:"
echo "  1. Create token at: https://github.com/settings/tokens"
echo "  2. Run: git remote set-url origin https://TOKEN@github.com/SMPITdaaruttarbiyah/smpit-dti-web.git"
echo "  3. Run this script again"
echo ""
echo "Option 3 - SSH Key:"
echo "  1. Generate SSH key: ssh-keygen -t ed25519 -C \"your-email@example.com\""
echo "  2. Add to GitHub: https://github.com/settings/keys"
echo "  3. Run: git remote set-url origin git@github.com:SMPITdaaruttarbiyah/smpit-dti-web.git"
echo "  4. Run this script again"
echo ""
echo "Option 4 - Manual Push:"
echo "  1. Open GitHub Desktop or Git GUI"
echo "  2. Commit changes manually"
echo "  3. Push to master branch"
echo ""

exit 1