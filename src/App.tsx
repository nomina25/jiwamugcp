import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Kelas from "./components/Kelas";
import Layanan from "./components/Layanan";
import BukuComponent from "./components/Buku";
import Majalah from "./components/Majalah";
import TentangKami from "./components/TentangKami";
import ProyekComponent from "./components/Proyek";
import Alumni from "./components/Alumni";
import TesKelekatan from "./components/TesKelekatan";
import Admin from "./components/Admin";

import { Buku, Proyek, Artikel, VideoItem, MajalahEdisi, UnduhanItem } from "./types";
import { initialBukuList } from "./data/buku";
import { initialProyekList } from "./data/proyek";
import { initialArtikelList, initialVideoList, initialUnduhanList } from "./data/sumberDaya";

// Magazines static list
const initialMajalahList: MajalahEdisi[] = [
  {
    id: "Ed. 22/2026",
    nomor: "Edisi 22",
    bulanTahun: "Juni 2026",
    tema: "Membongkar Topeng 'Si Baik-Baik Saja'",
    deskripsi: "Mengupas bagaimana kebudayaan ketimuran membentuk pola represi emosional sejak dini, dan cara melatih kepekaan asertif untuk menyatakan kebutuhan emosional kita tanpa takut dianggap lemah atau cengeng.",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "Ed. 21/2026",
    nomor: "Edisi 21",
    bulanTahun: "Mei 2026",
    tema: "Rupture-Repair dalam Pertemanan",
    deskripsi: "Kenapa konflik kecil bisa membuat kita menjauh dari sahabat dekat? Meninjau keretakan hubungan relasional dari sudut pandang teori kelekatan, serta formula praktis mereparasi rasa aman yang sempat pudar.",
    cover: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=600&auto=format&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "Ed. 20/2026",
    nomor: "Edisi 20",
    bulanTahun: "April 2026",
    tema: "Dekolonisasi Batin Nusantara",
    deskripsi: "Eksplorasi panjang tim peneliti PANJI mengenai cara masyarakat Indonesia merawat kewarasan jiwanya secara komunal lewat laku tirakat, kidung penyembuhan, dan kearifan gotong royong sebelum maraknya terapi modern.",
    cover: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=600&auto=format&fit=crop",
    pdfUrl: "#"
  }
];

export default function App() {
  const [currentHash, setCurrentHash] = useState("");

  // Lifted dynamic states for live admin simulation
  const [bukuList, setBukuList] = useState<Buku[]>(initialBukuList);
  const [proyekList, setProyekList] = useState<Proyek[]>(initialProyekList);
  const [artikelList, setArtikelList] = useState<Artikel[]>(initialArtikelList);
  const [videoList, setVideoList] = useState<VideoItem[]>(initialVideoList);
  const [majalahList, setMajalahList] = useState<MajalahEdisi[]>(initialMajalahList);
  const [unduhanList] = useState<UnduhanItem[]>(initialUnduhanList);

  useEffect(() => {
    const handleHashChange = () => {
      // Parse the hash string (remove leading '#')
      const hash = window.location.hash.substring(1);
      setCurrentHash(hash);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Initialize on first render
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const setHash = (newHash: string) => {
    window.location.hash = newHash;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-800">
      
      {/* HEADER SECTION */}
      <Header currentHash={currentHash} setHash={setHash} />

      {/* DYNAMIC CONTENT ROUTER */}
      <main className="flex-1">
        {currentHash === "" && (
          <Home setHash={setHash} />
        )}

        {currentHash.startsWith("kelas") && (
          <Kelas currentHash={currentHash} setHash={setHash} />
        )}

        {currentHash === "layanan" && (
          <Layanan />
        )}

        {currentHash.startsWith("buku") && (
          <BukuComponent 
            bukuList={bukuList} 
            currentHash={currentHash} 
            setHash={setHash} 
          />
        )}

        {currentHash.startsWith("majalah") && (
          <Majalah 
            majalahList={majalahList} 
            currentHash={currentHash} 
            setHash={setHash} 
          />
        )}

        {currentHash === "tentangkami" && (
          <TentangKami setHash={setHash} />
        )}

        {currentHash === "proyek" && (
          <ProyekComponent 
            proyekList={proyekList} 
            setProyekList={setProyekList} 
          />
        )}

        {currentHash === "alumni" && (
          <Alumni />
        )}

        {currentHash === "tes-kelekatan" && (
          <TesKelekatan />
        )}

        {currentHash === "admin" && (
          <Admin 
            bukuList={bukuList}
            setBukuList={setBukuList}
            proyekList={proyekList}
            setProyekList={setProyekList}
            artikelList={artikelList}
            setArtikelList={setArtikelList}
            videoList={videoList}
            setVideoList={setVideoList}
            majalahList={majalahList}
            setMajalahList={setMajalahList}
          />
        )}

        {/* ARTICLES LISTING PAGE */}
        {currentHash === "artikel" && (
          <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-12 animate-fade-in">
            <div className="space-y-3">
              <span className="text-xxs font-mono uppercase tracking-widest text-blue-600 font-bold block">Artikel & Edukasi</span>
              <h1 className="font-sans text-3xl font-bold text-slate-900 tracking-tight">Katalog Artikel Jiwamu</h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl">Ulasan populer dan teoretis seputar kesehatan mental, gaya attachment, relasi, dan dekolonisasi kejiwaan Indonesia.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {artikelList.map((art) => (
                <div key={art.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-mono font-semibold text-slate-400">
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{art.kategori}</span>
                      <span>{art.bacaMilik}</span>
                    </div>
                    <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 leading-snug line-clamp-2">{art.judul}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{art.ringkasan}</p>
                  </div>
                  
                  <div className="border-t border-slate-50 pt-4 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-semibold text-slate-800 block">{art.penulis}</span>
                      <span className="text-[9px] text-slate-400 block font-mono">{art.tanggal}</span>
                    </div>
                    <button 
                      onClick={() => alert(`Membaca artikel lengkap: "${art.judul}"\n\n${art.konten}`)}
                      className="text-xxs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Baca Lengkap
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIDEOS LISTING PAGE */}
        {currentHash === "video" && (
          <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-12 animate-fade-in">
            <div className="space-y-3">
              <span className="text-xxs font-mono uppercase tracking-widest text-blue-600 font-bold block">Video Edukasi</span>
              <h1 className="font-sans text-3xl font-bold text-slate-900 tracking-tight">Jiwamu Talks YouTube</h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl">Dokumentasi diskusi panel, ulasan literatur, dan bimbingan relasional visual dari para praktisi senior kami.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {videoList.map((vid) => (
                <div key={vid.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="group cursor-pointer" onClick={() => alert(`Memutar Video: "${vid.judul}"\n(Simulated YouTube Player)`)}>
                    <div className="aspect-video relative overflow-hidden bg-slate-900">
                      <img src={vid.thumbnail} alt={vid.judul} className="w-full h-full object-cover opacity-85 transition-transform group-hover:scale-105" />
                      <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-0.5 text-xxs font-mono text-white rounded">
                        {vid.durasi}
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="font-sans font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-1">{vid.judul}</h3>
                      <p className="text-xxs text-slate-500 leading-relaxed line-clamp-2">{vid.deskripsi}</p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-2 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-400">YouTube Talks</span>
                    <button 
                      onClick={() => alert(`Memutar video Talks: "${vid.judul}"`)}
                      className="text-xxs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Tonton Sekarang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOWNLOADS LISTING PAGE */}
        {currentHash === "unduhan" && (
          <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-12 animate-fade-in">
            <div className="space-y-3">
              <span className="text-xxs font-mono uppercase tracking-widest text-blue-600 font-bold block">Pusat Unduhan</span>
              <h1 className="font-sans text-3xl font-bold text-slate-900 tracking-tight">Materi & Lembar Kerja Mandiri</h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl font-sans">Unduh panduan awal, kurikulum lengkap, maupun lembar pemetaan batin mandiri secara cuma-cuma.</p>
            </div>
            
            <div className="space-y-4">
              {unduhanList.map((dl) => (
                <div key={dl.id} className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-100 transition-all">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded">{dl.format}</span>
                      <span className="text-[10px] text-slate-400 font-mono font-bold">{dl.ukuran}</span>
                    </div>
                    <h3 className="font-sans font-bold text-xs sm:text-sm text-slate-900">{dl.judul}</h3>
                    <p className="text-xxs sm:text-xs text-slate-500 leading-relaxed">{dl.deskripsi}</p>
                  </div>
                  <button 
                    onClick={() => alert(`Mengunduh berkas "${dl.judul}" (${dl.format} - ${dl.ukuran})`)}
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer shrink-0"
                  >
                    Unduh Berkas
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER SECTION */}
      <Footer setHash={setHash} />

    </div>
  );
}
