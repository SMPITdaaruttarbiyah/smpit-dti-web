# SMPIT DTI Website

Website resmi SMPIT Daarut Tarbiyah Indonesia yang dibangun dengan Eleventy dan Decap CMS dengan sistem Page Builder modular.

---

## 🚀 Untuk Developer

### Teknologi yang Digunakan
- **Static Site Generator**: Eleventy 11ty
- **CMS**: Decap CMS (sebelumnya Netlify CMS)
- **Deployment**: GitHub Pages
- **Styling**: CSS Inline (dalam template)
- **Template Engine**: Nunjucks

### Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/smpitdti/smpitdti-website.git
   cd smpitdti-website
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Jalankan Development Server**
   ```bash
   npm run serve
   ```
   Website akan berjalan di `http://localhost:8080`

4. **Build untuk Production**
   ```bash
   npm run build
   ```
   Hasil build akan ada di folder `_site`

### Struktur Proyek

```
smpitdti-website/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions untuk auto-deploy
├── src/
│   ├── _data/
│   │   └── school.js           # Data sekolah (visi, misi, fasilitas)
│   ├── _includes/
│   │   ├── layout.njk          # Template utama dengan CSS inline
│   │   └── components/         # Komponen Page Builder
│   │       ├── text_block.njk
│   │       ├── visi_misi_block.njk
│   │       ├── fasilitas_block.njk
│   │       └── quote_block.njk
│   ├── admin/
│   │   ├── config.yml          # Konfigurasi Decap CMS
│   │   └── index.html          # Halaman admin
│   ├── assets/
│   │   └── images/             # Upload gambar via CMS
│   ├── berita/                 # Folder berita (dibuat via CMS)
│   ├── profil.md               # Halaman profil (opsional)
│   └── index.md                # Halaman utama (opsional)
├── .eleventy.js                # Konfigurasi Eleventy
├── .gitignore
├── package.json
└── README.md
```

### Cara Kerja Page Builder

Sistem Page Builder menggunakan 4 komponen modular:

1. **text_block**: Blok teks biasa (manual input)
2. **visi_misi_block**: Otomatis dari `school.js`
3. **fasilitas_block**: Otomatis dari `school.js`
4. **quote_block**: API quotes dengan auto-refresh

Setiap halaman bisa memiliki kombinasi blok-blok ini sesuai kebutuhan.

### Environment Variables

Tidak ada environment variables yang diperlukan. Semua konfigurasi sudah embedded dalam file.

### Deployment

Website menggunakan GitHub Pages dengan GitHub Actions:

1. Push ke branch `main` → Auto build & deploy
2. Pull request → Build test saja
3. Hasil deploy di `https://smpitdti.github.io/smpitdti-website`

---

## 👥 Untuk Staf Sekolah (Non-Teknis)

### Cara Login CMS

1. Buka `https://smpitdti.github.io/smpitdti-website/admin`
2. Klik tombol "Login"
3. Pilih "Login with GitHub"
4. Authorize aplikasi (hanya sekali)
5. Setelah login, Anda akan melihat dashboard admin

**Catatan**: Pastikan Anda sudah ditambahkan sebagai collaborator di repository GitHub.

### Cara Membuat Berita

1. **Login ke CMS** (lihat cara di atas)
2. Klik menu **"Berita"** di sidebar kiri
3. Klik tombol **"New Berita"**
4. **Isi form berita**:
   - **Judul**: Judul berita (contoh: "Wisuda Tahfidz Angkatan ke-5")
   - **Tanggal**: Pilih tanggal berita
   - **Gambar**: Upload gambar (klik "Choose image")
   - **Ringkasan**: Singkat berita (2-3 kalimat)
   - **Konten**: Isi lengkap berita (bisa pakai format markdown)
   - **Tags**: Tambahkan tags (contoh: wisuda, tahfidz, prestasi)
   - **Author**: Nama penulis (default: Admin SMPIT DTI)
5. Klik **"Save"** untuk menyimpan draft
6. Klik **"Publish"** untuk publikasi ke website

### Cara Menggunakan Page Builder

Page Builder memungkinkan Anda membuat halaman dengan drag & drop blok konten.

#### 1. Blok Teks (Manual)
- **Fungsi**: Menambahkan teks biasa
- **Cara pakai**:
  1. Pilih tipe "Blok Teks"
  2. Isi "Judul Block" (opsional)
  3. Isi "Konten Teks"
  4. Simpan

#### 2. Blok Visi & Misi (Otomatis)
- **Fungsi**: Menampilkan visi & misi sekolah
- **Cara pakai**:
  1. Pilih tipe "Visi & Misi"
  2. Data otomatis dari file `school.js`
  3. Tidak perlu input manual
  4. Untuk edit data, hubungi developer

#### 3. Blok Fasilitas (Otomatis)
- **Fungsi**: Menampilkan fasilitas sekolah
- **Cara pakai**:
  1. Pilih tipe "Fasilitas"
  2. Data otomatis dari file `school.js`
  3. Tidak perlu input manual
  4. Untuk edit data, hubungi developer

#### 4. Blok Kutipan (API)
- **Fungsi**: Menampilkan kutipan inspiratif dari API
- **Cara pakai**:
  1. Pilih tipe "Kutipan"
  2. **Judul Block**: Judul section (opsional)
  3. **Keyword Kutipan**: Filter kutipan (contoh: education, inspiration, wisdom)
  4. **Max Length**: Maksimal karakter (default: 200)
  5. **Auto Refresh**: Aktifkan auto refresh (default: true)
  6. **Refresh Interval**: Interval refresh dalam detik (default: 30)
  7. Simpan

**Fitur Blok Kutipan**:
- Auto refresh setiap 30 detik (bisa diatur)
- Manual refresh dengan tombol
- Loading state dan error handling
- Fallback quote jika API error

### Workflow Publikasi

1. **Draft**: Simpan sebagai draft (belum terlihat di website)
2. **Review**: Ajukan untuk review (perlu approval)
3. **Publish**: Publikasi ke website (langsung terlihat)

### Tips & Best Practices

#### Untuk Berita
- Gunakan judul yang jelas dan menarik
- Upload gambar dengan ukuran optimal (max 1MB)
- Tulis ringkasan yang informatif
- Gunakan tags yang relevan
- Cek preview sebelum publish

#### Untuk Page Builder
- Kombinasikan berbagai tipe blok untuk halaman yang menarik
- Gunakan blok teks untuk konten kustom
- Manfaatkan blok otomatis (visi/misi, fasilitas)
- Eksperimen dengan keyword kutipan yang berbeda

#### Umum
- Selalu preview sebelum publish
- Simpan draft secara berkala
- Gunakan bahasa yang sopan dan profesional
- Perhatikan ejaan dan tata bahasa

### Troubleshooting

#### Tidak Bisa Login
- Pastikan Anda sudah collaborator di repository
- Coba logout dan login kembali
- Clear browser cache
- Hubungi developer jika masih gagal

#### Gambar Tidak Muncul
- Pastikan ukuran gambar tidak terlalu besar
- Format yang didukung: JPG, PNG, GIF
- Coba upload ulang gambar

#### Konten Tidak Update
- Tunggu beberapa saat (ada delay deployment)
- Refresh browser dengan Ctrl+F5
- Cek apakah sudah di-publish (bukan draft)

---

## 📞 Bantuan

### Untuk Developer
- **Issue**: GitHub repository
- **Documentation**: README ini
- **Tech Stack**: Eleventy, Decap CMS, GitHub Pages

### Untuk Staf Sekolah
- **CMS Access**: Hubungi admin IT
- **Content Issues**: Hubungi bagian humas
- **Technical Issues**: Hubungi developer

---

## 📄 Lisensi

MIT License - SMPIT Daarut Tarbiyah Indonesia

---

## 🙏 Credit

Website ini dikembangkan dengan ❤️ untuk SMPIT Daarut Tarbiyah Indonesia

**Build with**: Eleventy + Decap CMS + GitHub Pages