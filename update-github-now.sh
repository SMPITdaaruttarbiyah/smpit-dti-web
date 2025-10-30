#!/bin/bash

echo "🚀 SMPIT DTI GitHub Update Script"
echo "=================================="
echo ""

# Check current status
echo "📊 Checking current status..."
git status
echo ""

# Check if we have changes to commit
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Found changes, committing..."
    git add .
    git commit -m "Update project: Complete Next.js website with admin panel

✨ Features:
- Modern Next.js 15 website with TypeScript
- Responsive design with Tailwind CSS and shadcn/ui
- Admin panel for news management
- API routes for dynamic content
- Database integration with Prisma

🔧 Technical Stack:
- Next.js 15 with App Router
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui components
- Prisma ORM with SQLite
- React 19

🎨 Design:
- Mobile-first responsive design
- Islamic school theme with emerald colors
- Complete information sections
- Interactive components and animations

This update represents a complete modernization of the SMPIT DTI website.

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
else
    echo "✅ No changes to commit"
fi

echo ""
echo "🔄 Pushing to GitHub..."

# Try to push to main branch first
if git push origin main 2>/dev/null; then
    echo "✅ Successfully pushed to main branch"
elif git push origin master 2>/dev/null; then
    echo "✅ Successfully pushed to master branch"
else
    echo "❌ Failed to push. Please check your Git credentials."
    echo ""
    echo "🔧 Manual push required:"
    echo "1. Open your terminal"
    echo "2. Navigate to this directory"
    echo "3. Run: git push origin main"
    echo "   (or: git push origin master)"
    echo ""
    echo "🌐 Or use GitHub Desktop to push the changes"
fi

echo ""
echo "📋 Deployment Status:"
echo "- GitHub Actions will automatically build and deploy"
echo "- Build time: 2-5 minutes"
echo "- Website will be available at: https://smpitdaaruttarbiyah.github.io/smpit-dti-web/"
echo "- Admin panel: https://smpitdaaruttarbiyah.github.io/smpit-dti-web/admin/"
echo ""

echo "🎉 Update complete!"