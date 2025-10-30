# Admin Panel Login Guide

## 🔐 Login Information

**URL:** https://smpitdaaruttarbiyah.github.io/smpit-dti-web/admin/

### Credentials
- **Username:** `admin`
- **Password:** `smpitdti2024`

## 🌟 Features

### 1. Secure Login System
- Simple username/password authentication
- Session-based login (stays logged in until logout)
- Error handling for wrong credentials
- Responsive design for mobile and desktop

### 2. News Management
- **Add News:** Create new articles with title, content, category, date, and tags
- **Edit News:** Modify existing articles
- **Delete News:** Remove unwanted articles
- **Image Support:** Add images to news articles
- **Auto-generated Images:** Automatic placeholder images if none provided

### 3. Statistics Dashboard
- **Total News:** Count of all news articles
- **Today's News:** Articles published today
- **Categories:** Number of unique categories

### 4. Quick Actions
- **Sync GitHub:** Prepare for GitHub integration (coming soon)
- **View Site:** Open main website in new tab
- **Clear Cache:** Clear browser storage and refresh

## 📱 How to Use

### 1. Access Admin Panel
1. Go to: https://smpitdaaruttarbiyah.github.io/smpit-dti-web/admin/
2. Enter credentials:
   - Username: `admin`
   - Password: `smpitdti2024`
3. Click "Login"

### 2. Add News Article
1. After login, you'll see the "Manajemen Berita" section
2. Fill in the form:
   - **Judul Berita:** Title of the article
   - **Kategori:** Category (e.g., Pengumuman, Kegiatan)
   - **Tanggal:** Publication date
   - **Konten Berita:** Full article content
   - **URL Gambar:** Image link (optional)
   - **Tags:** Tags separated by commas (optional)
3. Click "Simpan Berita"

### 3. Edit News Article
1. In the "Daftar Berita" section, find the article
2. Click the "Edit" button
3. Modify the form that appears with updated information
4. Click "Simpan Berita" to save changes

### 4. Delete News Article
1. In the "Daftar Berita" section, find the article
2. Click the "Hapus" button
3. Confirm the deletion in the popup

### 5. Logout
1. Click the red "Logout" button in the top-right corner
2. You'll be returned to the login screen

## 🛠️ Technical Details

### Data Storage
- **News Articles:** Stored in browser's `localStorage`
- **Login Session:** Stored in browser's `sessionStorage`
- **Auto-save:** All changes are saved immediately

### Security Notes
- This is a simple authentication system for demonstration
- In production, consider using proper backend authentication
- Login credentials are visible in the source code
- Data is stored locally in the browser

### Browser Compatibility
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🚨 Important Notes

1. **Data Persistence:** News articles are stored in the browser's local storage. Clearing browser data will remove all articles.
2. **Single User:** This system supports one admin user at a time.
3. **No Backend:** This is a frontend-only solution. For production use, integrate with a proper backend system.
4. **GitHub Integration:** The "Sync GitHub" feature is prepared but not yet implemented.

## 📞 Support

If you encounter any issues:
1. Try clearing your browser cache
2. Ensure you're using the correct URL
3. Check that JavaScript is enabled
4. Use a modern browser

---

**Last Updated:** October 30, 2024
**Version:** 1.0.0