'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Tag, Newspaper } from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  category: string
  date: string
  content: string
  image?: string
  tags?: string
}

interface NewsData {
  lastUpdated: string
  syncType: string
  version: string
  news: NewsItem[]
  statistics: {
    totalNews: number
    categories: string[]
    lastSync: string
  }
}

export default function NewsSection() {
  const [newsData, setNewsData] = useState<NewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/news')
      
      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }
      
      const data = await response.json()
      setNewsData(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching news:', err)
      setError('Gagal memuat berita. Silakan coba lagi nanti.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">Berita Terkini</h2>
            <p className="text-gray-600">Memuat berita...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">Berita Terkini</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchNews}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!newsData || newsData.news.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">Berita Terkini</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 max-w-2xl mx-auto">
              <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-lg">Belum ada berita tersedia</p>
              <p className="text-gray-500 text-sm mt-2">Silakan periksa kembali nanti untuk update terbaru</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">Berita Terkini</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dapatkan informasi terbaru tentang kegiatan dan prestasi SMPIT DAARUT TARBIYAH INDONESIA
          </p>
          {newsData.statistics.lastSync && (
            <p className="text-sm text-gray-500 mt-2">
              Terakhir diperbarui: {formatDate(newsData.statistics.lastSync)}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsData.news.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow border-emerald-200">
              {item.image && (
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-emerald-600 hover:bg-emerald-700">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(item.date)}</span>
                </div>
                <h3 className="text-xl font-semibold text-emerald-800 mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.content}
                </p>
                {item.tags && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {item.tags.split(',').map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {newsData.news.length > 0 && (
          <div className="text-center mt-12">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-emerald-700 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Statistik Berita</span>
              </div>
              <p className="text-gray-600">
                Total {newsData.statistics.totalNews} berita dari {newsData.statistics.categories.length} kategori
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}