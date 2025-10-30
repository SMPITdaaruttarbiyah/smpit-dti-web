const fs = require('fs');
const path = require('path');

// News data to sync to GitHub
const newsData = {
  version: "2.0.0",
  lastUpdated: new Date().toISOString(),
  website: "SMPIT DAARUT TARBIYAH INDONESIA",
  totalNews: 3,
  news: [
    {
      id: "1718865600000",
      title: "Selamat Datang Siswa Baru Tahun Ajaran 2025/2026",
      category: "Pengumuman",
      date: "2025-06-20",
      content: "SMP IT DA'ARUT TARBiyAH mengucapkan selamat datang kepada seluruh siswa baru tahun ajaran 2025/2026. Kami sangat antusias menyambut kalian di keluarga besar SMPIT DTI. Semoga menjadi tahun pembelajaran yang penuh berkah dan prestasi.",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMEEzRDczIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMTUwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TZWxhbWF0IERhdGFuZyBTaXN3YSBCYXJ1PC90ZXh0Pgo8dGV4dCB4PSI0MDAiIHk9IjI1MCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U01QSVQgREFBUlVUIFRBUkJJWUFIPC90ZXh0Pgo8L3N2Zz4K",
      tags: "siswa baru, tahun ajaran 2025, selamat datang"
    },
    {
      id: "1718779200000",
      title: "Peresmian Lab Komputer Baru",
      category: "Kegiatan",
      date: "2025-06-19",
      content: "Alhamdulillah, SMP IT DA'ARUT TARBiyAH telah meresmikan laboratorium komputer baru dengan 40 unit komputer modern. Fasilitas ini akan mendukung pembelajaran teknologi informasi dan keterampilan digital siswa.",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMUU5RTQ0Ii8+Cjx0ZXh0IHg9IjQwMCIgeT0iMTUwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MYWIgS29tcHV0ZXIgQmFydTwvdGV4dD4KPHRleHQgeD0iNDAwIiB5PSIyNTAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjQwIFVuaXQgS29tcHV0ZXIgTW9kZXJuPC90ZXh0Pgo8L3N2Zz4K",
      tags: "lab komputer, fasilitas, teknologi"
    },
    {
      id: "1718692800000",
      title: "Prestasi Gemilang di Olimpiade Sains",
      category: "Prestasi",
      date: "2025-06-18",
      content: "Siswa-siswi SMPIT DTI kembali menorehkan prestasi membanggakan dengan meraih 3 medali emas dan 2 perak dalam Olimpiade Sains Nasional tingkat provinsi. Selamat kepada para pemenang!",
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRkY2QjZEIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMTUwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QcmVzdGFzaSBHZW1pbGFuZTwvdGV4dD4KPHRleHQgeD0iNDAwIiB5PSIyNTAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjMgRW1hcywgMiBlcmFrPC90ZXh0Pgo8L3N2Zz4K",
      tags: "prestasi, olimpiade, medali"
    }
  ]
};

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write news data to file
const newsFilePath = path.join(dataDir, 'news.json');
fs.writeFileSync(newsFilePath, JSON.stringify(newsData, null, 2));

console.log('✅ News data synchronized to local file:', newsFilePath);
console.log('📰 Total news:', newsData.totalNews);
console.log('📅 Last updated:', newsData.lastUpdated);

// Instructions for manual GitHub sync
console.log('\n📋 To sync to GitHub manually:');
console.log('1. Commit the data/news.json file to your repository');
console.log('2. Push to GitHub');
console.log('3. The website will automatically update within 1-3 minutes');