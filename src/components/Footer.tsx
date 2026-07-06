import React from "react";
import { Heart, Mail, Phone, MapPin, Youtube, Instagram, ShoppingBag, Radio, Facebook, AtSign } from "lucide-react";
import logoIkon from "@/logo-ikon.png";

interface FooterProps {
  setHash: (hash: string) => void;
}

export default function Footer({ setHash }: FooterProps) {
  const navigateTo = (targetHash: string) => {
    setHash(targetHash);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#121212] text-slate-300 border-t-4 border-black relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand Info Column */}
          <div className="md:col-span-5 space-y-6">
            <div 
              onClick={() => navigateTo("")} 
              className="flex items-center gap-3 cursor-pointer select-none group w-fit"
            >
              <div className="relative shrink-0 transition-transform group-hover:scale-105">
                {/* Brutalist offset 3D shadow */}
                <div className="absolute inset-0 bg-[#1A1A1A] rounded-xl translate-x-[3px] translate-y-[3px] transition-transform group-hover:translate-x-[1px] group-hover:translate-y-[1px]" />
                {/* Main logo block */}
                <div className="relative w-12 h-12 bg-white border-2 border-black rounded-xl flex items-center justify-center p-1.5 transition-all">
                  <img 
                    src={logoIkon} 
                    alt="Jiwamu Logo" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div>
                <span className="font-sans font-black text-xl text-white tracking-tight block transition-colors group-hover:text-[#FF71CF]">
                  Jiwamu
                </span>
              </div>
            </div>

            <div className="text-xs space-y-2.5 leading-relaxed max-w-sm">
              <p className="font-black text-white text-sm bg-black/40 px-3 py-1.5 rounded-lg border border-slate-800 w-fit">PT Jiwa Media Utama</p>
              <p className="text-slate-300 font-medium">
                Pusat Usaha dan Kaderisasi Perkumpulan Pamong Jiwa Indonesia (PUSAKA PANJI)
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex gap-2.5 bg-black/30 p-3.5 rounded-xl border border-slate-800">
                <MapPin className="w-4 h-4 text-[#BFDBFE] shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-relaxed font-medium">
                  Perumahan Wisma Indah No. A49, Kedungwaru, Kabupaten Tulungagung, Provinsi Jawa Timur
                </p>
              </div>
              <div className="flex gap-2.5 items-center bg-black/30 px-3.5 py-2.5 rounded-xl border border-slate-800 w-fit">
                <Phone className="w-4 h-4 text-[#D9F99D] shrink-0" />
                <a 
                  href="https://wa.me/6289653881556" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-[#FF71CF] transition-all font-mono font-bold text-slate-200"
                >
                  0896-5388-1556
                </a>
              </div>
            </div>
          </div>

          {/* Kelas Navigation Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-sans text-xs font-black uppercase tracking-wider text-[#FFD600] bg-black/60 px-3 py-1.5 rounded-lg border border-slate-800 w-fit">
              Kelas & Program
            </h4>
            <ul className="space-y-2.5 text-xs font-bold">
              {[
                { label: "Attachment Facilitator (CAF)", hash: "kelas/attachmentfacilitator" },
                { label: "Attachment Coaching (CAC)", hash: "kelas/attachmentcoaching" },
                { label: "Attachment Practitioner (CABP)", hash: "kelas/attachmentpractitioner" },
                { label: "Professional Bridging", hash: "kelas/professionalbridging" },
                { label: "Jiwamu Writing Lab", hash: "kelas/writinglab" }
              ].map((item) => (
                <li key={item.label}>
                  <button 
                    onClick={() => navigateTo(item.hash)} 
                    className="text-slate-300 hover:text-[#FF71CF] hover:underline transition-all text-left cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sumber Daya Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-sans text-xs font-black uppercase tracking-wider text-[#BFDBFE] bg-black/60 px-3 py-1.5 rounded-lg border border-slate-800 w-fit">
              Sumber Daya
            </h4>
            <ul className="space-y-2.5 text-xs font-bold">
              {[
                { label: "Katalog Buku", hash: "buku" },
                { label: "Majalah Bulanan", hash: "majalah" },
                { label: "Artikel Edukasi", hash: "artikel" },
                { label: "Video Talks", hash: "video" },
                { label: "Unduhan Lembar Kerja", hash: "unduhan" }
              ].map((item) => (
                <li key={item.label}>
                  <button 
                    onClick={() => navigateTo(item.hash)} 
                    className="text-slate-300 hover:text-[#BFDBFE] hover:underline transition-all text-left cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-sans text-xs font-black uppercase tracking-wider text-[#FF71CF] bg-black/60 px-3 py-1.5 rounded-lg border border-slate-800 w-fit">
              Mari Terhubung!
            </h4>
            <ul className="space-y-2 text-xs font-bold">
              <li>
                <a 
                  href="https://www.youtube.com/@jiwamutalks" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-all flex items-center gap-2 text-slate-300 bg-black/30 p-2.5 rounded-xl border border-slate-800 hover:border-red-500"
                >
                  <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                  YouTube: @jiwamutalks
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com/jiwamu.daily" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-all flex items-center gap-2 text-slate-300 bg-black/30 p-2.5 rounded-xl border border-slate-800 hover:border-pink-500"
                >
                  <Instagram className="w-4 h-4 text-pink-500 shrink-0" />
                  Instagram: @jiwamu.daily
                </a>
              </li>
              <li>
                <a 
                  href="https://www.tiktok.com/@jiwamu.daily" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-all flex items-center gap-2 text-slate-300 bg-black/30 p-2.5 rounded-xl border border-slate-800 hover:border-teal-400"
                >
                  <svg className="w-4 h-4 text-teal-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                  TikTok: @jiwamu.daily
                </a>
              </li>
              <li>
                <a 
                  href="https://web.facebook.com/profile.php?id=61590298628384" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-all flex items-center gap-2 text-slate-300 bg-black/30 p-2.5 rounded-xl border border-slate-800 hover:border-blue-500"
                >
                  <Facebook className="w-4 h-4 text-blue-500 shrink-0" />
                  Facebook: Jiwamu
                </a>
              </li>
              <li>
                <a 
                  href="https://www.threads.com/@jiwamu.daily" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-all flex items-center gap-2 text-slate-300 bg-black/30 p-2.5 rounded-xl border border-slate-800 hover:border-indigo-400"
                >
                  <AtSign className="w-4 h-4 text-indigo-400 shrink-0" />
                  Threads: @jiwamu.daily
                </a>
              </li>
              <li>
                <a 
                  href="https://shopee.co.id/jiwamu_store" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-all flex items-center gap-2 text-slate-300 bg-black/30 p-2.5 rounded-xl border border-slate-800 hover:border-orange-500"
                >
                  <ShoppingBag className="w-4 h-4 text-orange-500 shrink-0" />
                  Shopee: jiwamu_store
                </a>
              </li>

            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4 font-bold">
          <p>© 2026 PT Jiwa Media Utama. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
