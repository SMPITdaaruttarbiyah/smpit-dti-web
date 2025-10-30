# 🚀 Panduan Lengkap Auto-Publish Berita ke GitHub Pages

## 📋 Overview

Sistem ini memungkinkan Anda untuk mempublikasikan berita secara **otomatis** ke website `https://smpitdaaruttarbiyah.github.io/smpit-dti-web/` hanya dengan satu klik!

## 🔧 Cara Setup Awal (Hanya Sekali)

### 1. Buka Admin Panel
- Akses: `http://localhost:3000/admin`
- Atau: `http://localhost:3000/test-login.html` (untuk testing)

### 2. Ikuti Setup Wizard (4 Langkah)

#### 📝 Langkah 1: GitHub Token
1. Klik link: https://github.com/settings/tokens/new
2. Login ke GitHub
3. **Note**: Ketik `SMPIT DTI Admin`
4. **Expiration**: Pilih `No expiration`
5. **Select scopes**: Centang `repo` (paling atas)
6. Klik **"Generate token"**
7. **Copy token** (mulai dengan `ghp_`)
8. **Paste** di form

#### 🏠 Langkah 2: Repository
- **Username GitHub**: `SMPITdaaruttarbiyah`
- **Nama Repository**: `smpit-dti-web`
- **Branch**: `main`

#### 🔐 Langkah 3: Password Master
- Buat password minimal 8 karakter
- Ulangi password yang sama
- **INGAT**: Password ini untuk melindungi token GitHub

#### ✅ Langkah 4: Selesai
- Klik **"Mulai Kelola Berita"**

## 📝 Cara Menulis & Publish Berita

### 1. Tulis Berita
- **Judul Berita**: Judul yang menarik
- **Kategori**: Pilih (Pengumuman, Kegiatan, Prestasi, Umum)
- **Tanggal**: Otomatis hari ini
- **Konten Berita**: Isi berita lengkap
- **Upload Gambar**: Opsional, klik area upload

### 2. Publish ke Website
1. Klik tombol **"🚀 Publish ke Website"**
2. Masukkan **Password Master** yang Anda buat
3. Klik **"✅ Konfirmasi"**
4. **Tunggu proses publishing...**

### 3. ✅ Hasil
- Berita otomatis tersimpan di GitHub
- Website update otomatis dalam 1-3 menit
- Berita muncul di: https://smpitdaaruttarbiyah.github.io/smpit-dti-web/

## 🌐 Cara Melihat Hasil

### 1. Website Utama
- Buka: https://smpitdaaruttarbiyah.github.io/smpit-dti-web/
- Klik menu **"Berita"**
- Berita baru akan muncul di bagian atas

### 2. Development Server
- Buka: http://localhost:3000
- Klik menu **"Berita"**
- Berita muncul secara real-time

## 📱 Fitur yang Tersedia

### ✅ Fitur Utama
- **One-Click Publishing**: Publish dengan satu klik
- **Real-time Sync**: Otomatis sinkronisasi ke GitHub
- **Image Upload**: Upload gambar dengan kompresi otomatis
- **Secure Encryption**: Token GitHub dienkripsi dengan aman
- **Responsive Design**: Bisa diakses dari HP/tablet/laptop

### ✅ Fitur Tambahan
- **Edit Berita**: Edit berita yang sudah dipublish
- **Hapus Berita**: Hapus berita yang tidak diperlukan
- **Statistics**: Lihat statistik berita (total, kategori, terpublish)
- **Draft Mode**: Simpan dulu, publish nanti

## 🔒 Keamanan

### ✅ Token Management
- Token GitHub dienkripsi dengan password master
- Tidak ada token yang tersimpan plain text
- Password master tidak disimpan, hanya hash-nya

### ✅ Access Control
- Hanya orang yang tahu password master yang bisa publish
- Session timeout otomatis
- Secure HTTPS connection

## 🛠️ Troubleshooting

### ❌ Token tidak valid
- Pastikan token dimulai dengan `ghp_`
- Pastikan scope `repo` sudah dicentang
- Generate token baru jika perlu

### ❌ Password salah
- Gunakan password master yang Anda buat saat setup
- Jika lupa, harus setup ulang dari awal

### ❌ Gagal publish ke GitHub
- Periksa koneksi internet
- Pastikan repository info benar
- Coba refresh dan publish lagi

### ❌ Berita tidak muncul di website
- Tunggu 1-3 menit (GitHub Pages butuh waktu untuk build)
- Clear cache browser
- Periksa apakah publish berhasil (ada notifikasi sukses)

## 📞 Bantuan

### 🆘 Jika Ada Masalah
1. **Cek console browser** (F12 → Console) untuk error message
2. **Refresh halaman** dan coba lagi
3. **Clear cache browser**
4. **Restart development server** jika perlu

### 💡 Tips Pro
- **Save draft**: Tulis berita dulu, publish nanti
- **Image optimization**: Upload gambar max 2MB
- **SEO friendly**: Gunakan judul dan konten yang relevan
- **Regular publishing**: Publish berita secara rutin

## 🎉 Selamat Menggunakan!

Sekarang Anda bisa:
- ✅ Menulis berita kapan saja
- ✅ Publish dengan satu klik
- ✅ Update website secara real-time
- ✅ Mengelola konten dengan mudah

**Website Anda akan selalu up-to-date dengan berita terbaru!** 🚀

---
*Generated with ❤️ by SMPIT DTI Admin Panel*