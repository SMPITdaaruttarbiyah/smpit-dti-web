/**
 * SMPIT DAARUT TARBIYAH INDONESIA - News API
 * API untuk mengelola berita dan konten website
 */

import { NextRequest, NextResponse } from 'next/server';

// Simulasi database berita (dalam production, gunakan database yang sebenarnya)
let newsData = [
  {
    id: 1,
    title: "Prestasi Siswa di Olimpiade Sains",
    category: "prestasi",
    content: "Alhamdulillah, siswa-siswi SMPIT DAARUT TARBIYAH INDONESIA berhasil meraih juara dalam Olimpiade Sains tingkat provinsi. Prestasi ini menunjukkan kualitas pendidikan yang kami berikan.",
    image: "/smpit-dti-web/assets/images/news/olympiade.jpg",
    status: "published",
    date: new Date().toISOString(),
    author: "Admin SMPIT DTI"
  },
  {
    id: 2,
    title: "Kegiatan Pesantren Kilat Ramadhan",
    category: "kegiatan",
    content: "SMPIT DAARUT TARBIYAH INDONESIA menyelenggarakan kegiatan pesantren kilat selama bulan Ramadhan untuk meningkatkan keimanan dan ketaqwaan siswa.",
    image: "/smpit-dti-web/assets/images/news/ramadhan.jpg",
    status: "published",
    date: new Date().toISOString(),
    author: "Admin SMPIT DTI"
  }
];

// GET /api/news - Mendapatkan semua berita
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    let filteredNews = [...newsData];

    // Filter berdasarkan kategori
    if (category) {
      filteredNews = filteredNews.filter(news => news.category === category);
    }

    // Filter berdasarkan status
    if (status) {
      filteredNews = filteredNews.filter(news => news.status === status);
    }

    // Batasi jumlah berita
    if (limit) {
      filteredNews = filteredNews.slice(0, parseInt(limit));
    }

    // Sort berdasarkan tanggal terbaru
    filteredNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      data: filteredNews,
      total: filteredNews.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST /api/news - Menambah berita baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, content, image, status, author } = body;

    // Validasi input
    if (!title || !category || !content) {
      return NextResponse.json(
        { success: false, error: 'Title, category, and content are required' },
        { status: 400 }
      );
    }

    // Buat berita baru
    const newNews = {
      id: Date.now(),
      title,
      category,
      content,
      image: image || '',
      status: status || 'draft',
      author: author || 'Admin SMPIT DTI',
      date: new Date().toISOString()
    };

    // Tambahkan ke array
    newsData.unshift(newNews);

    // Jika status published, trigger GitHub sync
    if (newNews.status === 'published') {
      await triggerGitHubSync(newNews);
    }

    return NextResponse.json({
      success: true,
      data: newNews,
      message: 'News created successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT /api/news - Update berita
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, category, content, image, status } = body;

    // Cari berita berdasarkan ID
    const newsIndex = newsData.findIndex(news => news.id === id);
    
    if (newsIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'News not found' },
        { status: 404 }
      );
    }

    // Update berita
    const updatedNews = {
      ...newsData[newsIndex],
      title: title || newsData[newsIndex].title,
      category: category || newsData[newsIndex].category,
      content: content || newsData[newsIndex].content,
      image: image !== undefined ? image : newsData[newsIndex].image,
      status: status || newsData[newsIndex].status,
      date: new Date().toISOString()
    };

    newsData[newsIndex] = updatedNews;

    // Jika status published, trigger GitHub sync
    if (updatedNews.status === 'published') {
      await triggerGitHubSync(updatedNews);
    }

    return NextResponse.json({
      success: true,
      data: updatedNews,
      message: 'News updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE /api/news - Hapus berita
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'News ID is required' },
        { status: 400 }
      );
    }

    // Hapus berita
    const newsIndex = newsData.findIndex(news => news.id === id);
    
    if (newsIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'News not found' },
        { status: 404 }
      );
    }

    const deletedNews = newsData.splice(newsIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedNews,
      message: 'News deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Fungsi untuk trigger GitHub sync
async function triggerGitHubSync(newsData: any) {
  try {
    // Dalam production, ini akan memanggil GitHub API
    // Untuk sekarang, kita simulasikan saja
    
    console.log('Triggering GitHub sync for news:', newsData.title);
    
    // Simulasi delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulasi GitHub commit
    const commitData = {
      message: `Update news: ${newsData.title}`,
      content: JSON.stringify(newsData, null, 2),
      sha: 'abc123' // Dalam production, dapat dari GitHub API
    };
    
    console.log('GitHub sync completed:', commitData);
    
    return {
      success: true,
      commit: commitData.sha,
      message: 'Successfully synced to GitHub'
    };
  } catch (error) {
    console.error('GitHub sync failed:', error);
    throw error;
  }
}