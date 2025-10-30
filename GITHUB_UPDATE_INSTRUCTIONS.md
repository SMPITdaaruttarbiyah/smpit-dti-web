# 🚀 GitHub Update Instructions

## 📋 Cara Update GitHub Repository

### 🎯 **Opsi 1: Menggunakan Script Update**

Jalankan script update yang sudah disediakan:

```bash
./update-github.sh
```

Script ini akan:
- ✅ Menambahkan semua perubahan
- ✅ Membuat commit dengan pesan yang deskriptif
- ✅ Mencoba push ke GitHub
- ✅ Memberikan instruksi jika gagal

### 🎯 **Opsi 2: Manual Git Commands**

```bash
# 1. Tambahkan semua perubahan
git add .

# 2. Buat commit
git commit -m "Update website content - $(date '+%Y-%m-%d %H:%M:%S')

- Updated news and content
- Improved admin panel functionality
- Enhanced user experience
- Fixed bugs and performance issues

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 3. Push ke GitHub
git push origin master
```

### 🎯 **Opsi 3: GitHub CLI (Recommended)**

Install GitHub CLI terlebih dahulu:
```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# Windows
# Download dari https://cli.github.com/
```

Login ke GitHub:
```bash
gh auth login
```

Push dengan GitHub CLI:
```bash
git push origin master
# atau
gh repo sync
```

### 🎯 **Opsi 4: Personal Access Token**

1. **Buat Token** di GitHub:
   - Buka https://github.com/settings/tokens
   - Klik "Generate new token"
   - Pilih "repo" permissions
   - Copy token

2. **Set remote URL** dengan token:
   ```bash
   git remote set-url origin https://TOKEN@github.com/SMPITdaaruttarbiyah/smpit-dti-web.git
   ```

3. **Push**:
   ```bash
   git push origin master
   ```

### 🎯 **Opsi 5: SSH Key**

1. **Generate SSH Key**:
   ```bash
   ssh-keygen -t ed25519 -C "admin@smpitdaaruttarbiyah.sch.id"
   ```

2. **Add to GitHub**:
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Buka https://github.com/settings/keys
   - Add new SSH key

3. **Set remote URL**:
   ```bash
   git remote set-url origin git@github.com:SMPITdaaruttarbiyah/smpit-dti-web.git
   ```

4. **Push**:
   ```bash
   git push origin master
   ```

## 📁 **File yang Telah Diupdate**

### ✅ **Admin Panel & News Management**
- `src/admin.html` - Admin panel interface
- `src/app/api/news/route.ts` - News management API
- `src/app/api/github-sync/route.ts` - GitHub sync API
- `src/assets/js/news-loader.js` - Dynamic news loader

### ✅ **Enhanced Features**
- `src/assets/css/main.css` - Updated with news styles
- `src/index.html` - Fixed quotes section, added news loader
- `src/assets/js/quotes-local.js` - Local Islamic quotes

### ✅ **Documentation**
- `update-github.sh` - Update script
- `GITHUB_UPDATE_INSTRUCTIONS.md` - This file

## 🔧 **Troubleshooting**

### ❌ **Authentication Failed**
- Gunakan GitHub CLI atau Personal Access Token
- Pastikan token memiliki permission `repo`

### ❌ **Permission Denied**
- Check repository access permissions
- Pastikan Anda adalah collaborator atau owner

### ❌ **Merge Conflict**
```bash
git pull origin master
# Resolve conflicts
git add .
git commit -m "Resolve merge conflicts"
git push origin master
```

### ❌ **Branch Issues**
```bash
# Switch to master branch
git checkout master
# Push to master
git push origin master
```

## 🌐 **Live Website URL**

Setelah berhasil push:
- **GitHub Pages**: https://smpitdaaruttarbiyah.github.io/smpit-dti-web/
- **Custom Domain**: https://smpitdaaruttarbiyah.sch.id (jika sudah dikonfigurasi)

## 📞 **Support**

Jika mengalami masalah:
1. Cek log error di console
2. Pastikan semua file sudah di-commit
3. Verify repository permissions
4. Contact development team

---

**🏫 SMPIT DAARUT TARBIYAH INDONESIA**
*Building Islamic Civilization Excellence*