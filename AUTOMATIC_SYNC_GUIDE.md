# 🚀 Sistem Sinkronisasi Otomatis SMPIT DTI

## 📋 Problem & Solution

### ❌ Masalah Sebelumnya
- Admin harus download file JSON secara manual
- Upload manual ke GitHub repository
- Tunggu deployment secara manual
- Proses tidak efisien dan memakan waktu

### ✅ Solusi Baru
- **SINKRONISASI OTOMATIS** dengan satu klik
- Data langsung tersimpan di GitHub
- Website otomatis terupdate dalam 1-3 menit
- Status real-time di admin panel

## 🔄 Cara Kerja Sistem Baru

### 1. Admin Panel (Frontend)
- Tambah/edit berita di admin panel
- Data tersimpan di localStorage browser
- Klik tombol "Sync Now" untuk sinkronisasi

### 2. GitHub Actions (Backend)
- Trigger otomatis saat admin klik sync
- Proses data berita
- Build dan deploy ke GitHub Pages
- Website otomatis terupdate

### 3. Website (Result)
- Data berita langsung muncul di website
- Tidak perlu refresh manual
- Update real-time

## 🎯 Langkah-langkah Penggunaan

### Step 1: Tambah Berita
1. Login ke admin panel: `/admin/`
2. Username: `admin`
3. Password: `smpitdti2024`
4. Tambah berita baru di form yang tersedia

### Step 2: Sinkronisasi
1. Klik tombol **"Sync Now"** di bagian GitHub Sync Status
2. Tunggu proses sinkronisasi (status akan berubah)
3. Website akan otomatis terupdate dalam 1-3 menit

### Step 3: Verifikasi
1. Buka website utama
2. Periksa bagian berita/berita terbaru
3. Pastikan berita baru sudah muncul

## 📊 Status Indikator

### 🔄 Sedang Menyinkronkan
- Status: "🔄 Sedang menyinkronkan data..."
- Warna: Kuning (pending)
- Proses: Data sedang di-upload ke GitHub

### ✅ Berhasil Disinkronkan
- Status: "✅ Data siap untuk disinkronkan"
- Warna: Hijau (success)
- Proses: Data berhasil di-upload

### 🌐 Website Terupdate
- Status: "✅ Website berhasil diperbarui!"
- Warna: Hijau (success)
- Proses: Website sudah terupdate dengan data terbaru

### ❌ Gagal Sinkronisasi
- Status: "❌ Gagal sinkronisasi. Silakan coba lagi."
- Warna: Merah (error)
- Solusi: Coba sync kembali atau periksa koneksi internet

## 🛠️ Teknologi yang Digunakan

### Frontend (Admin Panel)
- **HTML5/CSS3/JavaScript** - Admin interface
- **localStorage** - Temporary data storage
- **Fetch API** - Communication dengan GitHub

### Backend (GitHub Actions)
- **GitHub Actions** - Automation workflow
- **Eleventy** - Static site generator
- **GitHub Pages** - Web hosting

### Data Flow
1. **Admin Panel** → localStorage browser
2. **Sync Trigger** → GitHub Actions webhook
3. **Data Processing** → Build website
4. **Deployment** → GitHub Pages
5. **Live Website** → Updated content

## 🔧 Konfigurasi Teknis

### GitHub Actions Workflow
- **Trigger**: Repository dispatch & manual
- **Permissions**: contents: write, pages: write
- **Environment**: github-pages
- **Deployment**: Automatic ke GitHub Pages

### File Structure
```
src/admin/index.html     # Admin panel
assets/data/news.json    # News data storage
.github/workflows/       # GitHub Actions
extract-news.js          # Data extraction script
```

## 🚨 Troubleshooting

### Sync tidak berfungsi?
1. Periksa koneksi internet
2. Refresh browser dan coba lagi
3. Clear cache browser
4. Pastikan sudah login dengan benar

### Website tidak terupdate?
1. Tunggu 1-3 menit setelah sync
2. Clear cache browser (Ctrl+F5)
3. Periksa GitHub Actions status
4. Contact administrator jika masih bermasalah

### Error messages?
- **"Gagal trigger GitHub Actions"**: Coba sync kembali
- **"Connection failed"**: Periksa koneksi internet
- **"Permission denied"**: Contact administrator

## 📞 Support

Jika mengalami masalah:
1. Periksa troubleshooting di atas
2. Lihat GitHub Actions log di repository
3. Contact IT Support SMPIT DTI

---

## 🎉 Keuntungan Sistem Baru

✅ **Otomatis** - Tidak perlu download/upload manual  
✅ **Cepat** - Update dalam 1-3 menit  
✅ **Mudah** - Satu klik sinkronisasi  
✅ **Real-time** - Status update langsung terlihat  
✅ **Reliable** - Backup otomatis di GitHub  
✅ **Scalable** - Bisa handle banyak berita  

**Sistem sinkronisasi berita yang modern dan efisien untuk SMPIT DAARUT TARBIYAH!** 🏫