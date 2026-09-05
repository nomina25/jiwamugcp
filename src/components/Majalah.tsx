import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, Send, Download, Layers, CheckCircle2, Award, Shield, FileText, 
  ChevronRight, Share2, Copy, ExternalLink, Maximize2, Minimize2, ArrowLeft, 
  Sparkles, Check, RefreshCw 
} from "lucide-react";
import { MajalahEdisi } from "../types";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

interface MajalahProps {
  majalahList: MajalahEdisi[];
  currentHash: string;
  setHash: (hash: string) => void;
}

export default function Majalah({ majalahList, currentHash, setHash }: MajalahProps) {
  const [subName, setSubName] = useState("");
  const [subPhone, setSubPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  const readerContainerRef = useRef<HTMLDivElement>(null);

  const navigateTo = (target: string) => {
    setHash(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName || !subPhone) return;
    
    try {
      await addDoc(collection(db, "subscribers"), {
        nama: subName,
        whatsapp: subPhone,
        tanggalBerlangganan: new Date().toISOString(),
        sumber: "Form Berlangganan Majalah"
      });
      setIsSubmitted(true);
      setSubName("");
      setSubPhone("");
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error("Error saving subscriber to Firestore:", err);
      setIsSubmitted(true);
      setSubName("");
      setSubPhone("");
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }
  };

  const handleCopyLink = (slug: string) => {
    const cleanUrl = `${window.location.origin}/majalah/${slug}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cleanUrl).then(() => {
        setCopiedSlug(slug);
        setTimeout(() => setCopiedSlug(null), 2500);
      }).catch(() => {
        prompt("Salin tautan majalah ini:", cleanUrl);
      });
    } else {
      prompt("Salin tautan majalah ini:", cleanUrl);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerContainerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const isWritingPage = currentHash === "majalah/kirim-tulisan";

  // Check if viewing a specific magazine edition: #majalah/<slug>
  const isReaderPage = currentHash.startsWith("majalah/") && !isWritingPage;
  const currentSlug = isReaderPage ? currentHash.replace(/^majalah\//, "").trim().toLowerCase() : null;

  // Resolve matching edition
  const activeEdition = isReaderPage && currentSlug ? (
    majalahList.find(m => {
      const s = (m.slug || "").toLowerCase().trim();
      const idClean = m.id.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const numClean = (m.nomor || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      return s === currentSlug || 
             idClean === currentSlug || 
             numClean === currentSlug || 
             (currentSlug === "edisi1" && (s === "edisi1" || m.nomor.toLowerCase().includes("23") || m.nomor.toLowerCase().includes("1")));
    }) || majalahList[0]
  ) : null;

  // Reset iframe loading when slug changes
  useEffect(() => {
    if (activeEdition) {
      setIsIframeLoading(true);
    }
  }, [currentSlug, activeEdition?.id]);

  // SUBPAGE 1: KIRIM TULISAN
  if (isWritingPage) {
    const rubriks = [
      { name: "Artikel Utama", desc: "Tulisan populer dan reflektif mengenai berbagai persoalan mengenai kejiwaan dan kehidupan sebagai manusia di zaman modern." },
      { name: "Artikel Ilmiah", desc: "Tulisan berbasis kajian, penelitian, atau tinjauan konseptual dengan bahasa yang tetap komunikatif bagi publik." },
      { name: "Artikel Opini", desc: "Pandangan personal, refleksi, kritik sosial, maupun gagasan tentang manusia dan kehidupan relasional." },
      { name: "Tumbuh Asuh", desc: "Rubrik khusus pengasuhan, tumbuh kembang, dan relasi orang tua-anak." },
      { name: "Jiwa Bangsa", desc: "Komentar atau renungan mengenai kehidupan dan keberadaan kita sebagai masyarakat Indonesia." }
    ];

    const benefits = [
      "Mendapatkan Majalah cetak edisi terbit langsung ke rumahmu",
      "Sertifikat penghargaan resmi sebagai kontributor tulisan",
      "Kesempatan memperluas pengaruh dan gagasan positif ke publik",
      "Peluang bergabung dalam ekosistem penulis dan profesional Jiwamu",
      "Kesempatan pengembangan tulisan terpilih menuju publikasi buku fisik",
      "Khusus untuk psikolog, berpeluang untuk memperoleh SKP HIMPSI Ranah 4."
    ];

    const rules = [
      "Tulisan merupakan karya asli (orisinil) hasil pemikiran sendiri",
      "Belum pernah diterbitkan di media atau platform cetak/digital lain",
      "Menggunakan bahasa yang hangat, komunikatif, dan bertanggung jawab (nondiskriminatif)."
    ];

    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-16">
        {/* Back link */}
        <button 
          onClick={() => navigateTo("majalah")} 
          className="text-xs font-black text-[#1A1A1A] hover:text-[#8B5CF6] flex items-center gap-1 cursor-pointer bg-white px-3.5 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          ← Kembali ke Majalah
        </button>

        {/* Hero */}
        <div className="space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FF71CF] px-3.5 py-1.5 rounded-full w-fit border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-2 inline-block">
            Menjadi Kontributor
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] leading-tight">
            Punya gagasan, pengalaman, atau keresahan yang ingin dibagikan?
          </h1>
          <p className="text-slate-800 font-bold text-xs sm:text-sm leading-relaxed max-w-2xl bg-white p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            Kami percaya bahwa pengalaman manusia terlalu berharga untuk disimpan sendirian. Jika kamu punya ide atau argumen yang segar, kami membuka kesempatan untuk menjadi bagian dari percakapan tentang jiwa dan kehidupan manusia.
          </p>
        </div>

        {/* Rubriks list */}
        <div className="space-y-6">
          <h2 className="font-sans text-xs font-black uppercase tracking-wider text-[#1A1A1A]">Pilihan Rubrik Tulisan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rubriks.map((rb, i) => (
              <div key={i} className="p-5 border-2 border-black bg-white rounded-2xl space-y-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black bg-[#FFD600] text-black px-2.5 py-1 rounded-md font-mono border border-black shadow-sm">
                  RUBRIK
                </span>
                <h4 className="font-sans text-xs sm:text-sm font-extrabold text-[#1A1A1A]">{rb.name}</h4>
                <p className="text-xxs sm:text-xs text-slate-700 font-medium leading-relaxed">{rb.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits & Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#D9F99D] border-2 border-black p-6 sm:p-8 rounded-3xl space-y-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-black">
            <span className="text-xs font-black text-black uppercase tracking-widest block">KEUNTUNGAN KONTRIBUTOR</span>
            <ul className="space-y-3">
              {benefits.map((b, i) => (
                <li key={i} className="flex gap-2.5 items-start text-xs text-slate-900 font-bold">
                  <Award className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#BFDBFE] border-2 border-black p-6 sm:p-8 rounded-3xl space-y-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-black">
            <span className="text-xs font-black text-black uppercase tracking-widest block">PERSYARATAN NASKAH</span>
            <ul className="space-y-3">
              {rules.map((r, i) => (
                <li key={i} className="flex gap-2.5 items-start text-xs text-slate-900 font-bold">
                  <Shield className="w-4 h-4 text-[#FF71CF] shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Call */}
        <div className="bg-[#8B5CF6] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="font-sans text-xl font-extrabold text-white">Siap mengirimkan tulisanmu?</h2>
          <p className="text-xs sm:text-sm text-purple-100 max-w-lg mx-auto font-bold">
            Kami menanti gagasan dan suaramu untuk bertumbuh bersama lebih banyak orang. Klik di bawah untuk mulai mengirimkan naskahmu.
          </p>
          <a
            href="https://wa.me/6289653881556?text=Hai%20Kak%20Nuy%2C%20saya%20ingin%20menjadi%20kontributor%20Majalah%20Jiwamu!"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#FFD600] hover:bg-white text-black font-black text-xs px-8 py-3.5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" /> Kirim Tulisan (WA)
          </a>
        </div>
      </div>
    );
  }

  // SUBPAGE 2: INTERACTIVE FLIPBOOK READER (#majalah/<slug> e.g. jiwamu.com/majalah/edisi1)
  if (isReaderPage && activeEdition) {
    const activeSlug = activeEdition.slug || (activeEdition.nomor ? activeEdition.nomor.toLowerCase().replace(/[^a-z0-9]/g, "") : activeEdition.id.toLowerCase().replace(/[^a-z0-9]/g, "-"));
    const shareUrl = `${window.location.origin}/majalah/${activeSlug}`;
    const waShareUrl = `https://wa.me/?text=${encodeURIComponent(`Yuk baca Majalah Jiwamu (${activeEdition.nomor}) - "${activeEdition.tema}" secara interaktif di: ${shareUrl}`)}`;
    const otherEditions = majalahList.filter(m => m.id !== activeEdition.id);

    return (
      <div className="space-y-10 pb-20 pt-6">
        
        {/* Top Navigation & Action Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={() => navigateTo("majalah")} 
                className="inline-flex items-center gap-1.5 text-xs font-black text-black bg-white hover:bg-[#FFD600] px-3.5 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Semua Edisi
              </button>
              <span className="text-slate-400 font-bold">/</span>
              <span className="text-xs font-black font-mono bg-[#FDF4FF] border border-black px-2.5 py-1 rounded-lg">
                {activeEdition.nomor} ({activeEdition.bulanTahun})
              </span>
              <span className="text-xxs font-mono font-bold bg-[#D9F99D] text-black border border-black px-2 py-0.5 rounded-full">
                ISSN 3063-542X
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleCopyLink(activeSlug)}
                className="inline-flex items-center gap-1.5 text-xs font-black bg-white hover:bg-[#FF71CF] text-black px-3.5 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                title="Salin Tautan Bersih"
              >
                {copiedSlug === activeSlug ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-green-700">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>

              <a
                href={waShareUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-black bg-[#25D366] text-white hover:bg-black px-3.5 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                title="Bagikan ke WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bagikan WA</span>
              </a>

              <button
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1.5 text-xs font-black bg-[#BFDBFE] hover:bg-white text-black px-3.5 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                title="Mode Layar Penuh"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{isFullscreen ? "Tutup Layar Penuh" : "Layar Penuh"}</span>
              </button>

              {activeEdition.flipbookUrl && (
                <a
                  href={activeEdition.flipbookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-black bg-white hover:bg-[#FEF08A] text-black px-3 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  title="Buka di Tab Baru"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Tab Baru</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Embedded Interactive Flipbook Viewer */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={readerContainerRef}
            className={`relative bg-[#0F172A] border-4 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all ${
              isFullscreen ? "h-screen w-screen rounded-none border-0 shadow-none p-0" : "h-[620px] sm:h-[720px] md:h-[780px] lg:h-[840px]"
            }`}
          >
            {/* Embedded Flipbook iframe */}
            {activeEdition.flipbookUrl ? (
              <>
                {isIframeLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/95 text-white gap-3 p-6 text-center">
                    <RefreshCw className="w-8 h-8 text-[#FFD600] animate-spin" />
                    <p className="font-mono text-sm font-black tracking-wider text-slate-200">
                      Memuat Majalah Digital ({activeEdition.nomor})...
                    </p>
                    <p className="text-xs text-slate-400 font-sans max-w-sm">
                      Buku interaktif sedang disiapkan. Anda dapat membolak-balik halaman seperti majalah fisik.
                    </p>
                  </div>
                )}
                <iframe
                  src={activeEdition.flipbookUrl}
                  title={`Majalah Jiwamu - ${activeEdition.nomor}`}
                  className="w-full h-full border-0 rounded-2xl"
                  allow="fullscreen; clipboard-write"
                  allowFullScreen
                  onLoad={() => setIsIframeLoading(false)}
                />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 text-white space-y-4">
                <BookOpen className="w-16 h-16 text-[#FFD600]" />
                <h3 className="text-xl font-black">Edisi Digital Sedang Dipersiapkan</h3>
                <p className="text-xs text-slate-300 max-w-md font-medium leading-relaxed">
                  Tautan flipbook untuk edisi {activeEdition.nomor} belum disematkan. Anda dapat mengunduh naskah versi PDF di bawah atau memeriksa kembali nanti.
                </p>
                {activeEdition.pdfUrl && activeEdition.pdfUrl !== "#" && (
                  <a
                    href={activeEdition.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#FFD600] text-black font-black text-xs px-6 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Unduh Naskah PDF
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Reader Hint Note */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-3 px-2 text-xs text-slate-600 font-medium">
            <p className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              Gunakan mode <span className="font-bold text-black">Layar Penuh</span> untuk pengalaman membaca layaknya buku cetak.
            </p>
            <p className="font-mono text-[11px] text-slate-500">
              Didukung oleh FlipHTML5 Interactive Embed
            </p>
          </div>
        </section>

        {/* Edition Detailed Metadata & Editorial Info */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Metadata & Abstraksi */}
            <div className="lg:col-span-8 bg-white border-4 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black bg-[#FF71CF] text-black border-2 border-black px-3 py-1 rounded-xl shadow-sm">
                  {activeEdition.nomor}
                </span>
                <span className="text-xs font-black font-mono bg-[#BAE6FD] text-black border-2 border-black px-3 py-1 rounded-xl shadow-sm">
                  {activeEdition.bulanTahun}
                </span>
                <span className="text-xs font-mono font-bold bg-[#D9F99D] text-black border-2 border-black px-3 py-1 rounded-xl shadow-sm">
                  SK ISSN 3063542X/II.7.4/SK.ISSN/09/2024
                </span>
              </div>

              <div>
                <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] leading-tight">
                  Tema: {activeEdition.tema}
                </h2>
              </div>

              <div className="space-y-3 border-t-2 border-black pt-4">
                <h4 className="font-mono text-xs font-black uppercase tracking-wider text-slate-500">
                  Abstraksi & Ringkasan Edisi:
                </h4>
                <p className="text-slate-800 text-xs sm:text-sm font-medium leading-relaxed">
                  {activeEdition.deskripsi}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t-2 border-black flex-wrap">
                {activeEdition.pdfUrl && activeEdition.pdfUrl !== "#" && (
                  <a
                    href={activeEdition.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#D9F99D] hover:bg-white text-black font-black text-xs px-5 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Unduh PDF Edisi Ini
                  </a>
                )}
                <button
                  onClick={() => handleCopyLink(activeSlug)}
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#FFD600] text-black font-black text-xs px-5 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                >
                  <Copy className="w-4 h-4" /> Salin Tautan Edisi
                </button>
              </div>
            </div>

            {/* Right: Contributor Call & Editorial Box */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#8B5CF6] text-white border-4 border-black rounded-3xl p-6 sm:p-7 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-black bg-[#FFD600] px-3 py-1 rounded-full border border-black shadow-sm inline-block">
                  TERBITAN BERIKUTNYA
                </span>
                <h3 className="font-sans text-lg font-extrabold text-white leading-snug">
                  Tertarik Menulis untuk Edisi Majalah Jiwamu Selanjutnya?
                </h3>
                <p className="text-xs text-purple-100 font-medium leading-relaxed">
                  Kami membuka ruang bagi psikolog, akademisi, pamong jiwa, serta pemerhati isu kejiwaan untuk menyumbangkan naskah orisinil.
                </p>
                <button
                  onClick={() => navigateTo("majalah/kirim-tulisan")}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#FFD600] hover:bg-white text-black font-black text-xs px-4 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                >
                  Panduan Menjadi Kontributor
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Share Box Widget */}
              <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
                <h4 className="font-mono text-xs font-black uppercase tracking-wider text-black">
                  Bagikan Edisi Ini:
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-slate-100 border-2 border-black rounded-xl px-3 py-2 text-xs font-mono text-slate-700 outline-none select-all"
                  />
                  <button
                    onClick={() => handleCopyLink(activeSlug)}
                    className="bg-[#FF71CF] hover:bg-black hover:text-white text-black font-black text-xs px-3 py-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer shrink-0"
                  >
                    {copiedSlug === activeSlug ? "✓" : "Salin"}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Section: Other Editions */}
        {otherEditions.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <span className="text-xs font-black uppercase tracking-widest text-black bg-[#FFD600] px-3.5 py-1.5 rounded-full border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] inline-block">
                Edisi Lainnya
              </span>
              <button
                onClick={() => navigateTo("majalah")}
                className="text-xs font-black text-[#8B5CF6] hover:text-black flex items-center gap-1 cursor-pointer"
              >
                Lihat Katalog Lengkap →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {otherEditions.slice(0, 3).map((maj) => {
                const itemSlug = maj.slug || (maj.nomor ? maj.nomor.toLowerCase().replace(/[^a-z0-9]/g, "") : maj.id.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                return (
                  <div key={maj.id} className="bg-white border-3 border-black rounded-3xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <img src={maj.cover} alt={maj.tema} className="w-full aspect-[3/4] object-cover rounded-2xl border-2 border-black bg-slate-50" />
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-black bg-[#FDF4FF] border border-black px-2 py-0.5 rounded inline-block">
                          {maj.nomor} · {maj.bulanTahun}
                        </span>
                        <h4 className="font-sans text-xs sm:text-sm font-extrabold text-slate-900 leading-snug line-clamp-2">
                          Tema: {maj.tema}
                        </h4>
                      </div>
                    </div>
                    <div className="pt-2 border-t-2 border-black">
                      <button
                        onClick={() => navigateTo(`majalah/${itemSlug}`)}
                        className="w-full bg-[#FFD600] hover:bg-white text-black border-2 border-black text-xs font-black py-2 rounded-xl text-center cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                      >
                        Baca Edisi Ini →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    );
  }

  // MAIN CATALOG PAGE (#majalah)
  const latestEdition = majalahList[0];
  const previousEditions = majalahList.slice(1);

  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero */}
      <section className="bg-[#FDF4FF] border-b-4 border-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-2 inline-block">
            Majalah Bulanan
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Media resmi <span className="underline decoration-wavy decoration-[#8B5CF6]">Perkumpulan Pamong Jiwa</span> Indonesia.
          </h1>
          <p className="text-slate-800 font-medium text-xs sm:text-sm max-w-2xl leading-relaxed">
            Majalah Jiwamu terbit berkala setiap bulan dengan tema berbeda, menghadirkan gagasan populer, reflektif, dan edukatif seputar kejiwaan yang ber-ISSN 3063-542X dari BRIN melalui SK 3063542X/II.7.4/SK.ISSN/09/2024.
          </p>
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigateTo("majalah/kirim-tulisan")}
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#8B5CF6] hover:text-[#FF71CF] cursor-pointer bg-white border-2 border-black px-4 py-2.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0.5 active:shadow-none"
            >
              Kirim tulisanmu di sini
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            {latestEdition && (
              <button
                onClick={() => {
                  const slug = latestEdition.slug || "edisi1";
                  navigateTo(`majalah/${slug}`);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-black text-black bg-[#FFD600] hover:bg-white cursor-pointer border-2 border-black px-4 py-2.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0.5 active:shadow-none"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Baca Edisi Terbaru Langsung
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Latest Edition Hero Card */}
      {latestEdition && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs font-black uppercase tracking-widest text-black bg-[#FF71CF] px-3.5 py-1.5 rounded-full w-fit border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] block">
              Edisi Terbaru Bulan Ini
            </span>
            {latestEdition.flipbookUrl && (
              <span className="text-xs font-mono font-bold bg-[#D9F99D] text-black border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                📖 Tersedia dalam Pembaca Interaktif
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white text-black rounded-3xl p-6 sm:p-10 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] items-center overflow-hidden relative">
            <div className="absolute top-0 right-0 w-84 h-84 bg-[#FF71CF]/5 rounded-full filter blur-3xl"></div>
            
            <div className="md:col-span-4 shrink-0 max-w-xs mx-auto md:mx-0">
              <img 
                src={latestEdition.cover} 
                alt={latestEdition.tema} 
                className="w-full h-auto aspect-[3/4] object-cover rounded-2xl shadow-sm border-3 border-black bg-slate-100"
              />
            </div>

            <div className="md:col-span-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#8B5CF6] font-mono text-xs font-black bg-[#FDF4FF] border border-black px-3 py-1.5 rounded-xl inline-block shadow-sm">
                    {latestEdition.nomor} · {latestEdition.bulanTahun}
                  </span>
                  <span className="text-xxs font-mono font-bold bg-[#F1F5F9] text-slate-700 border border-black px-2.5 py-1 rounded-lg">
                    Edisi Khusus
                  </span>
                </div>
                <h3 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">
                  Tema: {latestEdition.tema}
                </h3>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed max-w-xl">
                  {latestEdition.deskripsi}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button 
                  onClick={() => {
                    const slug = latestEdition.slug || "edisi1";
                    navigateTo(`majalah/${slug}`);
                  }}
                  className="bg-[#FFD600] hover:bg-white text-black font-black text-xs px-6 py-3.5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" /> Baca Majalah Interaktif
                </button>
                {latestEdition.pdfUrl && latestEdition.pdfUrl !== "#" ? (
                  <a 
                    href={latestEdition.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#BFDBFE] hover:bg-white text-black font-black text-xs px-6 py-3.5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Unduh PDF
                  </a>
                ) : (
                  <button 
                    onClick={() => {
                      const slug = latestEdition.slug || "edisi1";
                      handleCopyLink(slug);
                    }}
                    className="bg-white hover:bg-[#FF71CF] text-black font-black text-xs px-6 py-3.5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" /> Salin Tautan Edisi
                  </button>
                )}
                <button
                  onClick={() => {
                    const slug = latestEdition.slug || "edisi1";
                    handleCopyLink(slug);
                  }}
                  className="bg-white hover:bg-slate-100 text-black font-bold text-xs p-3.5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  title="Salin Tautan"
                >
                  {copiedSlug === (latestEdition.slug || "edisi1") ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* History Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] block">
          Riwayat Terbitan Sebelumnya
        </span>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {previousEditions.map((maj) => {
            const itemSlug = maj.slug || (maj.nomor ? maj.nomor.toLowerCase().replace(/[^a-z0-9]/g, "") : maj.id.toLowerCase().replace(/[^a-z0-9]/g, "-"));
            return (
              <div key={maj.id} className="bg-white border-3 border-black rounded-3xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <img src={maj.cover} alt={maj.tema} className="w-full aspect-[3/4] object-cover rounded-2xl bg-slate-50 border-2 border-black" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] text-slate-800 bg-[#FDF4FF] px-2.5 py-1 rounded-md font-mono font-black border border-black block shadow-sm">
                        {maj.nomor} · {maj.bulanTahun}
                      </span>
                      <span className="text-[9px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        /{itemSlug}
                      </span>
                    </div>
                    <h4 className="font-sans text-xs sm:text-sm font-extrabold text-[#1A1A1A] leading-snug">Tema: {maj.tema}</h4>
                    <p className="text-[11px] text-slate-600 font-medium line-clamp-3 leading-relaxed">
                      {maj.deskripsi}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 pt-3 border-t-2 border-black">
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => navigateTo(`majalah/${itemSlug}`)}
                      className="bg-[#FFD600] hover:bg-white text-black border-2 border-black text-xs font-black py-2.5 rounded-xl text-center cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Baca
                    </button>
                    {maj.pdfUrl && maj.pdfUrl !== "#" ? (
                      <a 
                        href={maj.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#D9F99D] hover:bg-white text-black border-2 border-black text-xs font-black py-2.5 rounded-xl text-center cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </a>
                    ) : (
                      <button 
                        onClick={() => handleCopyLink(itemSlug)}
                        className="bg-white hover:bg-[#BAE6FD] text-black border-2 border-black text-xs font-black py-2.5 rounded-xl text-center cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Salin Link
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Subscribe Free Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FF71CF] rounded-3xl p-8 sm:p-12 text-black relative overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[#8B5CF6]/10 rounded-full filter blur-2xl"></div>
          
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] block">
              Berlangganan Gratis
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold leading-tight text-black">
              Berlangganan Gratis Sekarang
            </h2>
            <p className="text-xs text-[#1A1A1A] font-bold leading-relaxed">
              Dapatkan edisi terbaru Majalah Jiwamu langsung melalui WhatsApp kamu segera setelah terbit setiap bulan.
            </p>

            {isSubmitted ? (
              <div className="bg-[#D9F99D] border-2 border-black rounded-2xl p-4 flex gap-3 items-center text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CheckCircle2 className="w-5 h-5 text-black shrink-0" />
                <div>
                  <p className="font-black text-black">Berhasil Berlangganan!</p>
                  <p className="text-slate-800 font-bold text-[11px] mt-0.5">Kami akan segera mengirimkan tautan edisi terbaru ke nomor WhatsApp Anda.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  id="sub-maj-name"
                  type="text"
                  placeholder="Nama Lengkap"
                  value={subName}
                  onChange={e => setSubName(e.target.value)}
                  className="bg-white border-2 border-black rounded-xl px-4 py-3 text-xs flex-1 placeholder:text-slate-400 font-bold"
                  required
                />
                <input
                  id="sub-maj-phone"
                  type="tel"
                  placeholder="No. WhatsApp"
                  value={subPhone}
                  onChange={e => setSubPhone(e.target.value)}
                  className="bg-white border-2 border-black rounded-xl px-4 py-3 text-xs flex-1 placeholder:text-slate-400 font-mono font-bold"
                  required
                />
                <button
                  id="sub-maj-submit"
                  type="submit"
                  className="bg-[#FFD600] hover:bg-white text-black font-black text-xs px-6 py-3.5 rounded-xl transition-all shrink-0 cursor-pointer border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  Kirim
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
