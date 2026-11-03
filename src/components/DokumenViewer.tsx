import React, { useState } from "react";
import { DokumenKhusus } from "../types";
import { 
  FileText, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  ArrowLeft,
  Share2,
  Clock,
  HeartHandshake
} from "lucide-react";

interface DokumenViewerProps {
  slug: string;
  dokumenList: DokumenKhusus[];
  setHash: (hash: string) => void;
}

export default function DokumenViewer({ slug, dokumenList, setHash }: DokumenViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Normalize slug matching (e.g. 'saka', 'saka-secure', 'edisi-saka')
  const cleanTarget = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
  const doc = dokumenList.find(d => {
    const s = d.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const id = d.id.toLowerCase().replace(/[^a-z0-9]/g, "");
    return s === cleanTarget || id === cleanTarget || cleanTarget.includes(s) || s.includes(cleanTarget);
  });

  const getBadgeColors = (color?: string) => {
    switch (color) {
      case "emerald":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "amber":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "blue":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "rose":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "purple":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
    }
  };

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownload = () => {
    if (!doc) return;
    setIsDownloading(true);
    
    // Create an anchor and trigger clean file download
    const link = document.createElement("a");
    link.href = doc.pdfUrl;
    // Format friendly filename for saving
    const safeTitle = `${doc.karakter || doc.judul}`.replace(/[/\\?%*:|"<>]/g, "-");
    link.download = `Jiwamu - ${safeTitle}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsDownloading(false);
    }, 1200);
  };

  // If document not found
  if (!doc) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-black brutal-shadow text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 border-2 border-black rounded-2xl flex items-center justify-center mx-auto text-amber-600">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Dokumen Tidak Ditemukan
            </h1>
            <p className="text-slate-600 max-w-md mx-auto text-sm leading-relaxed">
              Tautan laporan khusus dengan kode <span className="font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-300">"{slug}"</span> belum terdaftar atau telah dipindahkan.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setHash("")}
              className="inline-flex items-center gap-2 bg-[#FFD600] text-black font-black text-xs px-5 py-3 rounded-xl border-2 border-black brutal-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </button>
          </div>

          {dokumenList.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200 text-left">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Dokumen Tersedia Lainnya:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dokumenList.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setHash(`laporan/${item.slug}`)}
                    className="p-3 bg-slate-50 hover:bg-yellow-50 rounded-xl border border-slate-200 hover:border-black text-left transition-all"
                  >
                    <div className="font-bold text-xs text-slate-900">{item.karakter}</div>
                    <div className="text-[11px] text-slate-500">{item.tipe}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8 animate-fade-in">
      
      {/* TOP BREADCRUMB / STATUS */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setHash("")}
          className="inline-flex items-center gap-2 text-xs font-black text-slate-700 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Beranda Jiwamu
        </button>

        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-emerald-800 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Tautan Dokumen Privat Resmi</span>
        </div>
      </div>

      {/* HERO DOCUMENT CARD */}
      <div className="bg-white rounded-3xl border-2 border-black brutal-shadow overflow-hidden">
        
        {/* Banner Top Bar */}
        <div className="bg-[#FFFDF0] border-b-2 border-black p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-black px-3 py-1 rounded-full border ${getBadgeColors(doc.warnaBadge)}`}>
                {doc.badge}
              </span>
              <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                {doc.tipe}
              </span>
            </div>
            {doc.fileSize && (
              <span className="text-xs font-semibold text-slate-500">
                Ukuran File: {doc.fileSize}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {doc.judul}
          </h1>

          <p className="mt-4 text-slate-700 text-sm sm:text-base leading-relaxed max-w-3xl">
            {doc.deskripsi}
          </p>

          {/* Quick Meta */}
          <div className="mt-6 pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-600 font-medium">
            {doc.penulis && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800">Penyusun:</span>
                <span>{doc.penulis}</span>
              </div>
            )}
            {doc.organisasi && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800">Penerbit:</span>
                <span>{doc.organisasi}</span>
              </div>
            )}
            {doc.catatanAkses && (
              <div className="flex items-center gap-1.5 text-slate-500 italic">
                <Clock className="w-3.5 h-3.5" />
                <span>{doc.catatanAkses}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 sm:p-8 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Format Dokumen
            </div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-500" />
              <span>Portable Document Format (PDF) • Resolusi Tinggi</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-slate-300 hover:border-black bg-slate-50 hover:bg-slate-100 text-xs font-black text-slate-800 transition-all"
              title="Salin tautan dokumen ini"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Tautan</span>
                </>
              )}
            </button>

            {/* Direct Open in New Tab */}
            <a
              href={doc.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-slate-300 hover:border-black bg-white text-xs font-black text-slate-800 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka di Tab Baru</span>
            </a>

            {/* Primary Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl border-2 border-black bg-[#FFD600] hover:bg-[#ffe14d] text-slate-950 font-black text-sm brutal-shadow hover:translate-x-0.5 hover:translate-y-0.5 transition-all shadow-sm active:translate-x-1 active:translate-y-1"
            >
              <Download className={`w-4 h-4 ${isDownloading ? "animate-bounce" : ""}`} />
              <span>{isDownloading ? "Menyiapkan Unduhan..." : "Unduh Laporan Lengkap (PDF)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* EMBEDDED PDF PREVIEW VIEWER */}
      <div className="bg-white rounded-3xl border-2 border-black brutal-shadow overflow-hidden">
        <div className="bg-slate-100 px-6 py-3 border-b-2 border-black flex items-center justify-between text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Pratinjau Dokumen Online</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">
            Scroll ke bawah untuk membaca seluruh halaman
          </span>
        </div>

        <div className="relative w-full bg-slate-200" style={{ height: "700px" }}>
          <iframe
            src={`${doc.pdfUrl}#toolbar=1&navpanes=0`}
            title={doc.judul}
            className="w-full h-full border-none"
            loading="lazy"
          />
        </div>

        <div className="p-4 bg-slate-50 border-t-2 border-black text-center text-xs text-slate-500">
          Jika pratinjau di atas tidak tampil di layar ponsel Anda, silakan klik tombol{" "}
          <button 
            onClick={handleDownload} 
            className="font-bold text-blue-700 underline hover:text-blue-900"
          >
            Unduh Laporan Lengkap (PDF)
          </button>{" "}
          untuk membaca secara offline.
        </div>
      </div>

      {/* GUIDELINES CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border-2 border-black brutal-shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 border border-black flex items-center justify-center font-black text-blue-800 text-xs">
            01
          </div>
          <h4 className="font-black text-slate-900 text-sm">Baca dengan Tenang</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Luangkan waktu 15–20 menit di ruang yang hening tanpa distraksi untuk meresapi setiap analisis karakter.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-black brutal-shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-black flex items-center justify-center font-black text-amber-800 text-xs">
            02
          </div>
          <h4 className="font-black text-slate-900 text-sm">Tandai Pola Reaksi</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Perhatikan bagian 'Pemicu Emosi' dan 'Kebutuhan Terdalam' yang paling beresonansi dengan dinamika relasi Anda.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-black brutal-shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-black flex items-center justify-center font-black text-emerald-800 text-xs">
            03
          </div>
          <h4 className="font-black text-slate-900 text-sm">Konseling / Pelatihan</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bawa laporan ini saat berkonsultasi dengan pamong atau saat mengikuti pelatihan CAF / CAC di Jiwamu.
          </p>
        </div>
      </div>

      {/* FOOTER CALLOUT */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl border-2 border-black flex items-center justify-center text-blue-700 flex-shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm">
              Ingin Berdiskusi Lebih Jauh Mengenai Hasil Ini?
            </h4>
            <p className="text-xs text-slate-600">
              Tim Pamong Jiwamu siap mendampingi proses refleksi dan pemulihan keterikatan batin Anda.
            </p>
          </div>
        </div>

        <button
          onClick={() => setHash("layanan")}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 text-xs font-black px-4 py-2.5 rounded-xl border-2 border-black brutal-shadow-sm transition-all whitespace-nowrap"
        >
          <span>Lihat Layanan Pendampingan</span>
        </button>
      </div>

    </div>
  );
}
