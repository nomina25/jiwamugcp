import React, { useState, useEffect } from "react";
import { DokumenKhusus } from "../types";
import { db } from "../firebase";
import { doc as firestoreDoc, getDoc } from "firebase/firestore";
import { 
  FileText, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  ShieldCheck, 
  BookOpen, 
  ArrowLeft,
  Clock,
  HeartHandshake,
  QrCode,
  X,
  Loader2,
  Share2
} from "lucide-react";

interface DokumenViewerProps {
  slug: string;
  dokumenList: DokumenKhusus[];
  setHash: (hash: string) => void;
}

// Helper to detect Google Drive file ID if admin pastes a Google Drive link
function extractGoogleDriveId(url: string): string | null {
  if (!url || !url.includes("drive.google.com")) return null;
  const matchFile = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile && matchFile[1]) return matchFile[1];
  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) return matchId[1];
  return null;
}

// Helper to convert base64 string to Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export default function DokumenViewer({ slug, dokumenList, setHash }: DokumenViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [resolvedPdfUrl, setResolvedPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<string>("Memuat dokumen resmi...");
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [isGeneratingQrCard, setIsGeneratingQrCard] = useState<boolean>(false);

  // Normalize slug matching (e.g. 'saka', 'saka-secure', 'edisi-saka')
  const cleanTarget = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
  const doc = dokumenList.find(d => {
    const s = d.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const id = d.id.toLowerCase().replace(/[^a-z0-9]/g, "");
    return s === cleanTarget || id === cleanTarget || cleanTarget.includes(s) || s.includes(cleanTarget);
  });

  // Resolve PDF source (Static PDF -> Firestore Chunked PDF -> Google Drive)
  useEffect(() => {
    let active = true;
    let createdBlobUrl: string | null = null;

    async function resolvePdf() {
      if (!doc) {
        setIsLoadingPdf(false);
        return;
      }

      setIsLoadingPdf(true);
      setLoadProgress("Menyiapkan dokumen PDF...");

      try {
        // 1. Check if it's a Google Drive link
        const driveId = extractGoogleDriveId(doc.pdfUrl);
        if (driveId) {
          if (active) {
            setResolvedPdfUrl(`https://drive.google.com/file/d/${driveId}/preview`);
            setIsLoadingPdf(false);
          }
          return;
        }

        // 2. If it's a local/static path (not firestore://), check if the static file exists and is actually a PDF
        if (doc.pdfUrl && !doc.pdfUrl.startsWith("firestore://")) {
          try {
            const headRes = await fetch(doc.pdfUrl, { method: "HEAD" });
            const contentType = headRes.headers.get("content-type") || "";
            if (headRes.ok && contentType.toLowerCase().includes("application/pdf")) {
              if (active) {
                setResolvedPdfUrl(doc.pdfUrl);
                setIsLoadingPdf(false);
              }
              return;
            }
          } catch {
            // Fallback to Firestore chunk storage below
          }
        }

        // 3. Load PDF binary from Firestore `dokumen_files` collection (works on Vercel/jiwamu.com without static file sync issues)
        const targetSlug = doc.slug.toLowerCase().replace(/[^a-z0-9-]/g, "");
        setLoadProgress("Mengambil dokumen dari Cloud Jiwamu...");
        const metaSnap = await getDoc(firestoreDoc(db, "dokumen_files", `${targetSlug}_meta`));

        if (metaSnap.exists()) {
          const meta = metaSnap.data();
          const totalChunks = Number(meta.totalChunks || 0);

          if (totalChunks > 0) {
            const chunkPromises = [];
            for (let i = 0; i < totalChunks; i++) {
              chunkPromises.push(getDoc(firestoreDoc(db, "dokumen_files", `${targetSlug}_chunk_${i}`)));
            }
            const chunkSnaps = await Promise.all(chunkPromises);
            const orderedBase64 = chunkSnaps
              .map(snap => (snap.exists() ? (snap.data().data as string) : ""))
              .join("");

            if (orderedBase64.length > 0) {
              const pdfBytes = base64ToUint8Array(orderedBase64);
              const blob = new Blob([pdfBytes], { type: "application/pdf" });
              createdBlobUrl = URL.createObjectURL(blob);
              if (active) {
                setResolvedPdfUrl(createdBlobUrl);
                setIsLoadingPdf(false);
              }
              return;
            }
          }
        }

        // Fallback to raw pdfUrl if nothing in Firestore
        if (active) {
          setResolvedPdfUrl(doc.pdfUrl);
          setIsLoadingPdf(false);
        }
      } catch (err) {
        console.error("Error resolving PDF document:", err);
        if (active) {
          setResolvedPdfUrl(doc.pdfUrl);
          setIsLoadingPdf(false);
        }
      }
    }

    resolvePdf();

    return () => {
      active = false;
      if (createdBlobUrl) {
        URL.revokeObjectURL(createdBlobUrl);
      }
    };
  }, [doc?.id, doc?.slug, doc?.pdfUrl]);

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

  const shareUrl = doc
    ? `${window.location.origin}/#laporan/${doc.slug}`
    : window.location.href;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=16&format=png&data=${encodeURIComponent(shareUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownload = () => {
    if (!doc) return;
    setIsDownloading(true);

    const driveId = extractGoogleDriveId(doc.pdfUrl);
    const downloadHref = driveId
      ? `https://drive.google.com/uc?export=download&id=${driveId}`
      : resolvedPdfUrl || doc.pdfUrl;

    const link = document.createElement("a");
    link.href = downloadHref;
    const safeTitle = `${doc.karakter || doc.judul}`.replace(/[/\\?%*:|"<>]/g, "-");
    link.download = `Jiwamu - ${safeTitle}.pdf`;
    if (driveId) {
      link.target = "_blank";
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsDownloading(false);
    }, 1200);
  };

  const handleDownloadQrCard = async () => {
    if (!doc) return;
    setIsGeneratingQrCard(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1040;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background
      ctx.fillStyle = "#FFFDF0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Outer Brutalist Frame
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 8;
      ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

      // Top Header Pill
      ctx.fillStyle = "#FFD600";
      ctx.fillRect(60, 64, canvas.width - 120, 76);
      ctx.strokeRect(60, 64, canvas.width - 120, 76);

      ctx.fillStyle = "#000000";
      ctx.font = "900 28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("JIWAMU ECOSYSTEM • DOKUMEN RESMI", canvas.width / 2, 112);

      // Character Title
      ctx.fillStyle = "#0F172A";
      ctx.font = "900 36px sans-serif";
      ctx.fillText(doc.karakter || doc.slug.toUpperCase(), canvas.width / 2, 205);

      // Subtitle / Badge
      ctx.fillStyle = "#475569";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(`${doc.badge} • ${doc.tipe}`, canvas.width / 2, 248);

      // White QR Box
      const qrBoxSize = 500;
      const qrBoxX = (canvas.width - qrBoxSize) / 2;
      const qrBoxY = 290;

      // Shadow
      ctx.fillStyle = "#000000";
      ctx.fillRect(qrBoxX + 10, qrBoxY + 10, qrBoxSize, qrBoxSize);

      // Box
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);
      ctx.strokeRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);

      // Load QR Image
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load QR image"));
        img.src = qrImageUrl;
      });

      ctx.drawImage(img, qrBoxX + 25, qrBoxY + 25, qrBoxSize - 50, qrBoxSize - 50);

      // Instructions & URL Footer
      ctx.fillStyle = "#0F172A";
      ctx.font = "900 24px sans-serif";
      ctx.fillText("SCAN QR CODE UNTUK MENGUNDUH LAPORAN PDF", canvas.width / 2, 865);

      ctx.fillStyle = "#6D28D9";
      ctx.font = "bold 22px monospace";
      ctx.fillText(`jiwamu.com/#laporan/${doc.slug}`, canvas.width / 2, 915);

      ctx.fillStyle = "#64748B";
      ctx.font = "600 18px sans-serif";
      ctx.fillText("PT Jiwa Media Utama • #BertumbuhBersama", canvas.width / 2, 965);

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `QR-Jiwamu-${doc.slug.toUpperCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error("Failed to generate QR Card:", e);
      window.open(qrImageUrl, "_blank");
    } finally {
      setIsGeneratingQrCard(false);
    }
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
          className="inline-flex items-center gap-2 text-xs font-black text-slate-700 hover:text-black transition-colors cursor-pointer"
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
        <div className="p-6 sm:p-8 bg-white flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
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
            {/* QR Code Button for Crew / Respondent Sharing */}
            <button
              onClick={() => setShowQrModal(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-black bg-[#F3E8FF] hover:bg-[#E9D5FF] text-xs font-black text-purple-950 transition-all cursor-pointer brutal-shadow-sm"
              title="Tampilkan QR Code untuk dibagikan ke responden"
            >
              <QrCode className="w-4 h-4 text-purple-700" />
              <span>QR Code</span>
            </button>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-slate-300 hover:border-black bg-slate-50 hover:bg-slate-100 text-xs font-black text-slate-800 transition-all cursor-pointer"
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
            {resolvedPdfUrl && !isLoadingPdf && (
              <a
                href={resolvedPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-slate-300 hover:border-black bg-white text-xs font-black text-slate-800 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka di Tab Baru</span>
              </a>
            )}

            {/* Primary Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading || isLoadingPdf}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl border-2 border-black bg-[#FFD600] hover:bg-[#ffe14d] disabled:opacity-60 text-slate-950 font-black text-sm brutal-shadow hover:translate-x-0.5 hover:translate-y-0.5 transition-all shadow-sm active:translate-x-1 active:translate-y-1 cursor-pointer"
            >
              {isLoadingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyiapkan File PDF...</span>
                </>
              ) : (
                <>
                  <Download className={`w-4 h-4 ${isDownloading ? "animate-bounce" : ""}`} />
                  <span>{isDownloading ? "Mengunduh File PDF..." : "Unduh Laporan Lengkap (PDF)"}</span>
                </>
              )}
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

        <div className="relative w-full bg-slate-200 flex items-center justify-center" style={{ height: "720px" }}>
          {isLoadingPdf ? (
            <div className="text-center space-y-3 p-6 bg-white rounded-2xl border-2 border-black brutal-shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
              <div className="text-sm font-black text-slate-900">{loadProgress}</div>
              <p className="text-xs text-slate-500">Mohon tunggu sebentar, sedang memuat dokumen resolusi tinggi...</p>
            </div>
          ) : resolvedPdfUrl ? (
            <iframe
              src={resolvedPdfUrl.includes("drive.google.com") ? resolvedPdfUrl : `${resolvedPdfUrl}#toolbar=1&navpanes=0`}
              title={doc.judul}
              className="w-full h-full border-none bg-white"
            />
          ) : (
            <div className="text-center p-6">
              <p className="text-sm font-bold text-slate-700">Pratinjau belum tersedia. Silakan unduh dokumen secara langsung.</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t-2 border-black text-center text-xs text-slate-500">
          Jika pratinjau di atas tidak tampil penuh di layar ponsel Anda, silakan klik tombol{" "}
          <button 
            onClick={handleDownload} 
            className="font-bold text-blue-700 underline hover:text-blue-900 cursor-pointer"
          >
            Unduh Laporan Lengkap (PDF)
          </button>{" "}
          untuk menyimpan dan membaca langsung di perangkat Anda.
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
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 text-xs font-black px-4 py-2.5 rounded-xl border-2 border-black brutal-shadow-sm transition-all whitespace-nowrap cursor-pointer"
        >
          <span>Lihat Layanan Pendampingan</span>
        </button>
      </div>

      {/* QR CODE MODAL FOR CREW & RESPONDENTS */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFFDF0] rounded-3xl border-4 border-black p-6 sm:p-8 max-w-md w-full brutal-shadow space-y-5 relative text-center">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white border-2 border-black flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 bg-[#FFD600] border-2 border-black px-3 py-1 rounded-full text-[11px] font-black uppercase">
              <QrCode className="w-3.5 h-3.5" />
              <span>Kartu Akses QR Code Resmi</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-950">
                {doc.karakter || doc.judul}
              </h3>
              <p className="text-xs font-bold text-slate-600">
                Scan dengan kamera HP untuk membuka & mengunduh PDF laporan ini
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-black brutal-shadow-sm inline-block mx-auto">
              <img
                src={qrImageUrl}
                alt={`QR Code ${doc.judul}`}
                className="w-56 h-56 mx-auto object-contain"
              />
            </div>

            <div className="bg-white px-3 py-2 rounded-xl border-2 border-black text-xs font-mono font-bold text-purple-800 break-all">
              {shareUrl}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handleCopyLink}
                className="w-full py-3 px-4 rounded-xl border-2 border-black bg-white hover:bg-slate-100 text-xs font-black text-slate-900 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Tautan Tersalin!" : "Salin Tautan"}</span>
              </button>

              <button
                onClick={handleDownloadQrCard}
                disabled={isGeneratingQrCard}
                className="w-full py-3 px-4 rounded-xl border-2 border-black bg-[#FFD600] hover:bg-[#ffe14d] text-xs font-black text-slate-950 inline-flex items-center justify-center gap-2 brutal-shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingQrCard ? "Membuat Kartu..." : "Unduh Kartu QR (PNG)"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
