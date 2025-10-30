'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Mosque, 
  Users, 
  GraduationCap,
  Heart,
  Globe,
  Facebook,
  Instagram,
  Music,
  MessageCircle,
  Target,
  Award,
  Library,
  Computer,
  MapPin,
  Phone,
  Mail,
  Newspaper
} from 'lucide-react'
import NewsSection from '@/components/NewsSection'

export default function Home() {
  const [activeSection, setActiveSection] = useState('home')

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 md:w-16 md:h-16">
                <img
                  src="/logo.png"
                  alt="SMPIT DAARUT TARBIYAH INDONESIA"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-emerald-800">
                  SMPIT DAARUT TARBIYAH INDONESIA
                </h1>
                <p className="text-xs md:text-sm text-gray-600">
                  Jl. Lapangan Bekasi Tengah No. 3, Margahayu, Bekasi Timur
                </p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button onClick={() => setActiveSection('home')} className="text-emerald-700 hover:text-emerald-900 font-medium">Beranda</button>
              <button onClick={() => setActiveSection('berita')} className="text-emerald-700 hover:text-emerald-900 font-medium">Berita</button>
              <button onClick={() => setActiveSection('visi')} className="text-emerald-700 hover:text-emerald-900 font-medium">Visi & Misi</button>
              <button onClick={() => setActiveSection('program')} className="text-emerald-700 hover:text-emerald-900 font-medium">Program</button>
              <button onClick={() => setActiveSection('fasilitas')} className="text-emerald-700 hover:text-emerald-900 font-medium">Fasilitas</button>
              <button onClick={() => setActiveSection('ekskul')} className="text-emerald-700 hover:text-emerald-900 font-medium">Ekstrakulikuler</button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {activeSection === 'home' && (
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6">
                <img
                  src="/logo.png"
                  alt="SMPIT DAARUT TARBIYAH INDONESIA"
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-emerald-800 mb-4">
                SMPIT DAARUT TARBIYAH INDONESIA
              </h2>
              <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-3xl mx-auto">
                Membangun peradaban Islam Rahmatan Lil' Aalamiin melalui pendidikan terpadu yang berkualitas
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setActiveSection('visi')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Pelajari Lebih Lanjut
                </Button>
                <Button 
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-3"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Lokasi Kami
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Mosque className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                  <h3 className="text-2xl font-bold text-emerald-800">11</h3>
                  <p className="text-sm text-gray-600">Program Kegiatan</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Users className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                  <h3 className="text-2xl font-bold text-emerald-800">6</h3>
                  <p className="text-sm text-gray-600">Ekstrakulikuler</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                  <h3 className="text-2xl font-bold text-emerald-800">5</h3>
                  <p className="text-sm text-gray-600">Fasilitas Utama</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Heart className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                  <h3 className="text-2xl font-bold text-emerald-800">4</h3>
                  <p className="text-sm text-gray-600">Misi Utama</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* News Section */}
      {activeSection === 'berita' && <NewsSection />}

      {/* Visi & Misi Section */}
      {activeSection === 'visi' && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">Visi & Misi</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Landasan kami dalam mencetak generasi Islam yang unggul dan berkarakter
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="mb-8 border-emerald-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-emerald-800">
                    <Target className="w-6 h-6 mr-2" />
                    Visi Kami
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Membangun peradaban Islam Rahmatan Lil' Aalamiin
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-emerald-800">
                    <Award className="w-6 h-6 mr-2" />
                    Misi Kami
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
                      <span className="text-gray-700">Menyelenggarakan lembaga pendidikan pondok pesantren Tahfidz Al-Qur'an</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
                      <span className="text-gray-700">Menyelenggarakan sekolah islam terpadu</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
                      <span className="text-gray-700">Menyelenggarakan dakwah islamic center</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm mr-3">4</span>
                      <span className="text-gray-700">Menyelenggarakan kegiatan peduli sosial dan kemanusiaan</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Program Kegiatan Section */}
      {activeSection === 'program' && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">Program Kegiatan</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                11 program unggulan untuk mengembangkan potensi siswa secara maksimal
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                'Program Tahfidz Al-Qur\'an',
                'Program wisuda Tahfidz Al-Qur\'an',
                'Program belajar ilmu - ilmu keislaman',
                'Program Kewirausahaan',
                'Program Muhadroh',
                'Program Extrakulikuler',
                'Program Bahasa Arab',
                'Program Bahasa Inggris',
                'Program Pengabdian',
                'Program Praktek Khodimul Ummah',
                'Program DLF (DTI Leadership Factory)'
              ].map((program, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-emerald-200">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                        <BookOpen className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-emerald-800">{program}</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Program {index + 1} dari 11 program unggulan kami
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fasilitas Section */}
      {activeSection === 'fasilitas' && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">Fasilitas</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Fasilitas lengkap untuk menunjang proses pembelajaran yang berkualitas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Mosque className="w-12 h-12 text-emerald-600 mb-4" />
                  <h3 className="font-semibold text-emerald-800 mb-2">Masjid</h3>
                  <p className="text-sm text-gray-600">
                    Merupakan tempat yang menjiwai setiap aktivitas murid/santri
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Users className="w-12 h-12 text-emerald-600 mb-4" />
                  <h3 className="font-semibold text-emerald-800 mb-2">Ruang Kelas</h3>
                  <p className="text-sm text-gray-600">
                    Untuk melaksanakan kegiatan belajar mengajar
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Library className="w-12 h-12 text-emerald-600 mb-4" />
                  <h3 className="font-semibold text-emerald-800 mb-2">Perpustakaan</h3>
                  <p className="text-sm text-gray-600">
                    Untuk menambah literasi & wawasan para murid/santri
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Computer className="w-12 h-12 text-emerald-600 mb-4" />
                  <h3 className="font-semibold text-emerald-800 mb-2">Ruang Komputer</h3>
                  <p className="text-sm text-gray-600">
                    Untuk mempelajari hal - hal baru yang tidak bisa dijumpai pada buku
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Globe className="w-12 h-12 text-emerald-600 mb-4" />
                  <h3 className="font-semibold text-emerald-800 mb-2">Lapangan</h3>
                  <p className="text-sm text-gray-600">
                    Untuk membantu melaksanakan serangkaian upacara & kegiatan luar kelas lainnya
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Ekstrakulikuler Section */}
      {activeSection === 'ekskul' && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">Ekstrakulikuler</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                6 kegiatan ekstrakulikuler untuk mengembangkan bakat dan minat siswa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { name: 'Ekskul PMR', icon: Heart },
                { name: 'Ekskul Pramuka', icon: Users },
                { name: 'Ekskul Pelajar Pustakawan', icon: Library },
                { name: 'Ekskul Hadroh', icon: Music },
                { name: 'Ekskul Public Speaking', icon: MessageCircle },
                { name: 'Ekskul Futsal', icon: Globe }
              ].map((ekskul, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-emerald-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ekskul.icon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-emerald-800">{ekskul.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-12 bg-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">Hubungi Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mari berkolaborasi dalam mencetak generasi Islam yang unggul
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-emerald-800 mb-4">Informasi Kontak</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-gray-700">
                      Jl. Lapangan Bekasi Tengah No. 3, kel. Margahayu, kec. Bekasi Timur, Bekasi
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-emerald-800 mb-4">Media Sosial</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Instagram className="w-4 h-4 mr-2" />
                    @smpitdti
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Facebook className="w-4 h-4 mr-2" />
                    @smpitdti
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Music className="w-4 h-4 mr-2" />
                    @DTI Foundation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <img
                src="/logo.png"
                alt="SMPIT DAARUT TARBIYAH INDONESIA"
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-2">SMPIT DAARUT TARBIYAH INDONESIA</h3>
            <p className="text-emerald-100 mb-4">
              Membangun peradaban Islam Rahmatan Lil' Aalamiin
            </p>
            <p className="text-sm text-emerald-200">
              © 2024 SMPIT DAARUT TARBIYAH INDONESIA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-emerald-200 px-4 py-2">
        <div className="flex justify-around">
          <button onClick={() => setActiveSection('home')} className="p-2 text-emerald-600">
            <BookOpen className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveSection('visi')} className="p-2 text-emerald-600">
            <Target className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveSection('program')} className="p-2 text-emerald-600">
            <Award className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveSection('fasilitas')} className="p-2 text-emerald-600">
            <Library className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveSection('ekskul')} className="p-2 text-emerald-600">
            <Users className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}