# 🚀 STEP BY STEP GUIDE - PUBLISH BERITA

## 📋 PERSIAPAN AWAL

### 1. Buka Halaman Test Publish
**URL**: `http://localhost:3000/test-publish.html`

Ini adalah halaman testing yang lebih sederhana dari admin panel.

## 🔑 DAPATKAN GITHUB TOKEN

### 1. Buat GitHub Token
1. Buka: https://github.com/settings/tokens/new
2. Login dengan GitHub Anda
3. **Note**: Ketik `SMPIT DTI Test`
4. **Expiration**: Pilih `No expiration`
5. **Select scopes**: Centang **`repo`** (yang paling atas)
6. Scroll ke bawah, klik **"Generate token"**
7. **Copy token** (mulai dengan `ghp_`)

## 📝 TULIS BERITA

### 1. Isi Form di Test Publish Page
- **Judul Berita**: Test Berita Pertama
- **Kategori**: Pengumuman
- **Tanggal**: Otomatis hari ini
- **Isi Berita**: Ini adalah test berita pertama saya
- **GitHub Token**: Paste token yang Anda copy
- **Username GitHub**: SMPITdaaruttarbiyah
- **Repository**: smpit-dti-web

### 2. Klik "🚀 Publish ke GitHub"

## ⏱️ TUNGGU PROSES

### 1. Lihat Log
- Log akan muncul di bagian bawah halaman
- Proses akan menunjukkan setiap langkah
- Jika berhasil, akan ada pesan sukses

### 2. Error Handling
- Jika ada error, akan muncul di log
- Periksa token dan repository info

## 🌐 LIHAT HASIL

### 1. Development Server (Langsung)
- Buka: `http://localhost:3000`
- Klik menu **"Berita"**
- Berita baru akan muncul **langsung**

### 2. GitHub Pages (1-3 menit)
- Buka: https://smpitdaaruttarbiyah.github.io/smpit-dti-web/
- Klik menu **"Berita"**
- Berita akan muncul dalam 1-3 menit

## 🔧 TROUBLESHOOTING

### ❌ Token Error
- Pastikan token dimulai dengan `ghp_`
- Pastikan scope `repo` sudah dicentang
- Generate token baru jika perlu

### ❌ Repository Error
- Username: `SMPITdaaruttarbiyah`
- Repository: `smpit-dti-web`
- Branch: `main`

### ❌ Permission Error
- Pastikan token memiliki permission `repo`
- Pastikan repository benar

## ✅ SUCCESS INDICATORS

### 1. Di Test Publish Page
- ✅ Hijau status box
- ✅ Log menunjukkan "Successfully published"
- ✅ File URL GitHub muncul

### 2. Di Development Server
- ✅ Berita muncul di halaman Berita
- ✅ Judul dan konten benar
- ✅ Kategori sesuai

### 3. Di GitHub Pages
- ✅ Website terupdate
- ✅ Berita muncul di menu Berita
- ✅ Responsive di mobile

## 🎯 NEXT STEPS

### 1. Setelah Success
- Coba publish berita lain
- Test dengan gambar
- Test kategori berbeda

### 2. Gunakan Admin Panel
- Jika test publish berhasil, gunakan admin panel: `http://localhost:3000/admin`
- Setup wizard 4 langkah
- Lebih banyak fitur

## 📞 HELP

### Jika Masih Error
1. **Check Console**: F12 → Console
2. **Clear Cache**: Ctrl+Shift+R
3. **Restart Server**: Stop & start npm run dev
4. **Check Token**: Generate baru

### Quick Fix
- Gunakan test publish page dulu
- Setelah berhasil, baru coba admin panel

---

**🚀 Sekarang coba langkah di atas satu per satu!**

1. Buka http://localhost:3000/test-publish.html
2. Generate GitHub token
3. Isi form dan publish
4. Lihat hasil di website

*Good luck! 🎉*