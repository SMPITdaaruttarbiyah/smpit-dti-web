# GitHub Pages Deployment Setup Guide

## 🔧 Current Issue
The GitHub Actions deployment is failing with a permission error:
```
remote: Permission to SMPITdaaruttarbiyah/smpit-dti-web.git denied to github-actions[bot].
```

## ✅ What's Fixed
1. Updated `auto-sync.yml` to use the newer `actions/deploy-pages@v4` action
2. Added proper permissions and environment configuration
3. Fixed the deployment workflow to match the main deploy workflow

## 🚀 Required Repository Settings

To complete the setup, you need to configure the repository settings:

### 1. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under "Build and deployment", select:
   - **Source**: GitHub Actions
5. Save the settings

### 2. Check Workflow Permissions
1. Go to **Settings** → **Actions** → **General**
2. Scroll down to "Workflow permissions"
3. Ensure **Read and write permissions** is selected
4. Check **Allow GitHub Actions to create and approve pull requests**
5. Save the settings

### 3. Environment Protection Settings (if needed)
1. Go to **Settings** → **Environments**
2. Click on **github-pages** environment
3. Ensure deployment protection rules allow the workflow to run
4. Add any required approval rules if needed

## 📋 Updated Workflow Files

### Main Deploy Workflow (`.github/workflows/deploy.yml`)
- ✅ Uses `actions/deploy-pages@v4`
- ✅ Proper permissions configured
- ✅ Environment settings included

### Auto Sync Workflow (`.github/workflows/auto-sync.yml`)
- ✅ Updated to use `actions/deploy-pages@v4`
- ✅ Fixed permissions from `read` to `write`
- ✅ Added environment configuration
- ✅ Added deployment ID for URL reference

## 🔄 Next Steps

1. **Commit and push** the updated workflow files
2. **Configure repository settings** as described above
3. **Test the deployment** by pushing a change or running the workflow manually
4. **Monitor the Actions tab** to ensure successful deployment

## 🌐 Expected URLs After Fix

- **Main Website**: https://smpitdaaruttarbiyah.github.io/smpit-dti-web/
- **Admin Panel**: https://smpitdaaruttarbiyah.github.io/smpit-dti-web/admin/

## 🛠️ Troubleshooting

If deployment still fails after these changes:

1. Check that the repository is public or has GitHub Pages enabled for private repos
2. Verify the workflow permissions are set correctly
3. Ensure the `gh-pages` branch doesn't have protection rules blocking the deployment
4. Check the Actions tab for detailed error messages

## 📊 Workflow Status

After fixing, both workflows should:
- ✅ Build the Eleventy site successfully
- ✅ Deploy to GitHub Pages with proper permissions
- ✅ Update the live site automatically on changes
- ✅ Provide deployment URLs and status summaries