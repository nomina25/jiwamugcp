import React, { useState } from "react";
import { Buku } from "../types";
import { Search, BookOpen, Send, DollarSign, Calendar, FileText, Scale } from "lucide-react";

interface BukuProps {
  bukuList: Buku[];
  currentHash: string;
  setHash: (hash: string) => void;
}

export default function BukuComponent({ bukuList, currentHash, setHash }: BukuProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const navigateTo = (target: string) => {
    setHash(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Check if hash matches a specific book slug, e.g., #buku/what-the-wound-knows
  const isDetail = currentHash.startsWith("buku/") && currentHash !== "buku";
  const slug = isDetail ? currentHash.replace("buku/", "") : null;
  const currentBuku = slug ? bukuList.find(b => b.slug === slug) : null;

  const filteredBuku = bukuList.filter((b) => {
    return b.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
           b.pengarang.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Render Book Detail View
  if (isDetail && currentBuku) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-12 animate-fade-in">
        <button 
          onClick={() => navigateTo("buku")} 
          className="text-xs font-black text-black hover:text-[#8B5CF6] flex items-center gap-1 cursor-pointer bg-white px-3.5 py-2 rounded-xl brutal-border-thin shadow-sm w-fit"
        >
          ← Kembali ke Katalog Buku
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Cover image (Left column) */}
          <div className="md:col-span-5 shrink-0">
            <img 
              src={currentBuku.cover} 
              alt={currentBuku.judul} 
              className="w-full h-auto aspect-[3/4] object-cover rounded-3xl border-2 border-black bg-slate-50 shadow-sm"
            />
          </div>

          {/* Book Identity Grid (Right column) */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black bg-[#FFD600] text-black px-3 py-1 rounded-full border border-black shadow-sm mb-2 inline-block">
                {currentBuku.penerbit}
              </span>
              <h1 className="font-sans text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
                {currentBuku.judul}
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 font-bold">Karya {currentBuku.pengarang}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-white p-5 rounded-2xl border-2 border-black brutal-shadow-sm">
              <div className="space-y-1">
                <span className="text-slate-500 block uppercase tracking-wider font-black text-[9px]">Tahun Terbit</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  {currentBuku.tahun}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block uppercase tracking-wider font-black text-[9px]">Tebal Halaman</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  {currentBuku.halaman} Halaman
                </span>
              </div>
              <div className="space-y-1 border-t-2 border-black pt-3">
                <span className="text-slate-500 block uppercase tracking-wider font-black text-[9px]">Dimensi</span>
                <span className="font-bold text-slate-900 block">{currentBuku.ukuran}</span>
              </div>
              <div className="space-y-1 border-t-2 border-black pt-3">
                <span className="text-slate-500 block uppercase tracking-wider font-black text-[9px]">Berat Pengiriman</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  {currentBuku.berat}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-[#D9F99D] p-5 rounded-2xl border-2 border-black brutal-shadow-sm text-black">
              <div>
                <span className="text-xxs font-black text-[#1A1A1A] block uppercase">Harga Spesial</span>
                <span className="font-mono text-lg sm:text-xl font-black text-slate-950">
                  Rp {currentBuku.harga.toLocaleString("id-ID")}
                </span>
              </div>
              
              <a
                href={`https://wa.me/6289653881556?text=Hai%20Kak%20Nuy%2C%20saya%20mau%20beli%20buku%20${encodeURIComponent(currentBuku.judul)}!`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#8B5CF6] hover:bg-white text-white hover:text-black font-black text-xs px-5 py-3 rounded-xl brutal-border brutal-shadow-sm transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Pesan Sekarang!
              </a>
            </div>
          </div>
        </div>

        {/* Below Description & Table of Contents */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t-2 border-black">
          <div className="md:col-span-7 space-y-4">
            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-slate-600">Deskripsi Buku</h3>
            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-line">{currentBuku.deskripsi}</p>
          </div>

          <div className="md:col-span-5 space-y-4 bg-[#BFDBFE] p-6 rounded-2xl border-2 border-black brutal-shadow-sm h-fit text-black">
            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-slate-800">Daftar Isi Buku</h3>
            <ul className="space-y-2">
              {currentBuku.daftarIsi.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-900 font-bold flex items-start gap-2">
                  <span className="text-[#8B5CF6] font-black">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Render Book Catalog Grid
  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero */}
      <section className="bg-[#FDF4FF] border-b-4 border-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-2 inline-block">
            Penerbit Jiwamu
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Rumah penerbitan bagi pemengaruh, <br />
            pemerhati, dan <span className="underline decoration-wavy decoration-[#8B5CF6]">profesional</span> kesehatan mental.
          </h1>
          <p className="text-slate-800 font-medium text-xs sm:text-sm max-w-2xl leading-relaxed">
            Kami berfokus pada penerbitan buku-buku populer berkualitas tinggi yang berlandaskan sains, pengalaman klinis, dan pengetahuan kejiwaan yang memadai. Kami juga menerbitkan Healing Companion untuk menemanimu memahami batin.
          </p>
        </div>
      </section>

      {/* Catalog Search & Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h2 className="font-sans text-xl font-extrabold text-slate-900">Katalog Buku</h2>
            <p className="text-xxs sm:text-xs text-slate-600 font-semibold">Temukan bacaan pemulihan batin yang hangat dan bertanggung jawab.</p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 font-black" />
            <input
              id="buku-search-input"
              type="text"
              placeholder="Cari judul buku atau pengarang..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-black rounded-xl text-xs focus:outline-none bg-white font-bold shadow-sm"
            />
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBuku.map((buku, idx) => (
            <div 
              key={buku.slug} 
              className="bg-white border-2 border-black rounded-3xl overflow-hidden brutal-shadow flex flex-col justify-between hover:translate-y-[-2px] transition-all"
            >
              <div 
                onClick={() => navigateTo(`buku/${buku.slug}`)}
                className="cursor-pointer group"
              >
                <div className="aspect-[3/4] overflow-hidden bg-slate-50 relative border-b-2 border-black">
                  <img 
                    src={buku.cover} 
                    alt={buku.judul} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-mono font-black text-[#8B5CF6] block">{buku.pengarang.split(",")[0]}</span>
                  <h3 className="font-sans text-xs sm:text-sm font-extrabold text-slate-900 leading-snug line-clamp-1 group-hover:text-[#8B5CF6]">
                    {buku.judul}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono font-black">{buku.penerbit} · {buku.tahun}</p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 border-t-2 border-black flex justify-between items-center bg-[#FDF4FF]">
                <span className="text-xs font-mono font-black text-slate-900">
                  Rp {buku.harga.toLocaleString("id-ID")}
                </span>
                <button
                  id={`btn-buku-${buku.slug}-detail`}
                  onClick={() => navigateTo(`buku/${buku.slug}`)}
                  className="text-xs font-black text-[#8B5CF6] hover:text-[#FF71CF] cursor-pointer bg-white border border-black px-2.5 py-1 rounded-lg shadow-sm hover:shadow-none transition-all"
                >
                  Detail
                </button>
              </div>
            </div>
          ))}

          {filteredBuku.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-600 bg-white border-2 border-black rounded-2xl brutal-shadow">
              <p className="text-xs font-bold">Tidak ditemukan buku dengan kata kunci tersebut.</p>
              <button onClick={() => setSearchTerm("")} className="text-xs text-[#8B5CF6] font-black hover:underline mt-2 cursor-pointer">
                Reset Pencarian
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
