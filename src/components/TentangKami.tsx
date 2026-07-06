import React from "react";
import { Shield, MapPin, Phone, Mail, Globe, Users, BookOpen, Layers, Award, TrendingUp } from "lucide-react";

interface TentangKamiProps {
  setHash: (hash: string) => void;
}

export default function TentangKami({ setHash }: TentangKamiProps) {
  const navigateTo = (target: string) => {
    setHash(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const initiatives = [
    {
      title: "Jiwamu Academy",
      desc: "Lembaga pelatihan sertifikasi. Melalui program bertingkat seperti Certification in Attachment Coaching (CAC) dan Certification in Attachment-Based Practitioner (CABP), Jiwamu Academy membantu peserta memahami pola relasi, luka kelekatan, dan penerapan attachment dalam kehidupan personal maupun profesional.",
      hash: "kelas",
      icon: Award
    },
    {
      title: "Jiwamu Center",
      desc: "Pusat layanan pendampingan coaching dan psikoanalisis. Layanan ini menyediakan ruang aman bagi individu yang ingin memahami diri, relasi, pengalaman emosional, dan pola hidup yang berulang secara lebih mendalam. Pendampingan dilakukan dengan batas, kerangka, dan ritme proses yang jelas.",
      hash: "layanan",
      icon: Users
    },
    {
      title: "Penerbit Jiwamu",
      desc: "Rumah penerbitan bagi buku-buku populer dan sastra psikologis. Kami menerbitkan karya yang berlandaskan sains, pengalaman, dan pengetahuan kejiwaan yang memadai, tetapi tetap disampaikan secara hangat, jernih, dan dekat dengan kehidupan sehari-hari.",
      hash: "buku",
      icon: BookOpen
    },
    {
      title: "Majalah Jiwamu",
      desc: "Ruang kolaborasi untuk membagikan, mempertemukan, dan menyatukan ide tentang jiwa dan kehidupan manusia. Majalah ini terbit berkala setiap bulan dan menjadi salah satu medium utama Jiwamu untuk membangun literasi kesehatan jiwa yang populer, reflektif, dan bertanggung jawab.",
      hash: "majalah",
      icon: Layers
    },
    {
      title: "Jiwamu Project",
      desc: "Laboratorium riset dekolonisasi kesehatan mental yang didukung oleh semangat kolektif. Melalui Jiwamu Project, kami berupaya membaca ulang kesehatan mental dalam konteks pengalaman hidup, budaya, sejarah, relasi kuasa, pertarungan gender, spiritualitas, dan kehidupan masyarakat Indonesia.",
      hash: "proyek",
      icon: TrendingUp
    }
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero */}
      <section className="bg-[#FDF4FF] border-b-4 border-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-2 inline-block">
            Tentang Jiwamu
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Ekosistem pengembangan diri <br />
            berbasis <span className="underline decoration-wavy decoration-[#8B5CF6]">teori kelekatan</span> (attachment).
          </h1>
          <p className="text-slate-800 font-bold text-xs sm:text-sm max-w-2xl leading-relaxed">
            Jiwamu hadir sebagai ruang belajar, pendampingan, penerbitan, media, dan gerakan sosial yang berangkat dari teori kelekatan — sebuah cabang empiris dari psikoanalisis.
          </p>
        </div>
      </section>

      {/* Corporate Structure and Legal (2 columns) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          <div className="md:col-span-7 space-y-6 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            <span className="text-xs font-black uppercase tracking-widest text-black bg-[#FF71CF] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-2 inline-block">
              Profil & Legalitas
            </span>
            <h2 className="font-sans text-xl sm:text-2xl font-extrabold text-slate-900">Merawat Pemahaman Manusia Secara Kolektif</h2>
            <p>
              Secara hukum, Jiwamu merupakan merek dagang resmi di bawah naungan <strong>PT Jiwa Media Utama</strong>. Kami percaya bahwa banyak persoalan hidup manusia modern tidak dapat dilepaskan dari pengalaman relasional: bagaimana kita belajar mencintai, merasa aman, terabaikan, terluka, bertahan, dan bertumbuh bersama orang lain.
            </p>
            <p>
              Jiwamu juga menjadi bagian integral dari <strong>Pusat Usaha dan Kaderisasi Perkumpulan Pamong Jiwa Indonesia (PUSAKA PANJI)</strong> bersama beberapa lembaga lain, seperti Institut Psikoanalisis Indonesia, Yayasan Pusat Psikoanalisis Indonesia, Penerbit Minerva, Hypnopreneur Indonesia, dan TBM Matahari. Kami berkolaborasi untuk membangun fondasi kesehatan mental yang membumi bagi bangsa Indonesia.
            </p>
          </div>

          <div className="md:col-span-5 bg-white border-2 border-black rounded-3xl p-6 sm:p-8 space-y-4 brutal-shadow">
            <h3 className="font-sans text-xs font-black uppercase tracking-wider text-slate-500">Afiliasi Lembaga Mitra</h3>
            <div className="space-y-3 text-xs text-slate-900 font-bold">
              {[
                "PT Jiwa Media Utama",
                "Institut Psikoanalisis Indonesia",
                "Yayasan Pusat Psikoanalisis Indonesia",
                "Penerbit Minerva & Penerbit Jiwamu",
                "Hypnopreneur Indonesia",
                "TBM Matahari"
              ].map((m, idx) => (
                <div key={idx} className="flex gap-2.5 items-center bg-[#FDF4FF] border border-black p-2.5 rounded-xl shadow-sm">
                  <Shield className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Initiatives (5 Card Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-2 inline-block">
            Inisiatif Utama
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900">Pilar-pilar Gerakan Jiwamu</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initiatives.map((init, idx) => {
            const Icon = init.icon;
            return (
              <div 
                key={idx} 
                className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 flex flex-col justify-between brutal-shadow h-full hover:translate-y-[-2px] transition-all"
              >
                <div className="space-y-4">
                  <div className="p-3 rounded-2xl bg-[#FF71CF] border-2 border-black text-black w-fit brutal-shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-sans text-base sm:text-lg font-extrabold text-slate-900">{init.title}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{init.desc}</p>
                </div>
                <div className="border-t-2 border-black pt-4 mt-6">
                  <button
                    onClick={() => navigateTo(init.hash)}
                    className="text-xs font-black text-[#8B5CF6] hover:text-[#FF71CF] cursor-pointer border border-black px-3 py-1.5 rounded-lg bg-white shadow-sm hover:shadow-none transition-all w-fit"
                  >
                    Kunjungi Halaman {init.title} →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact & Support info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#8B5CF6] text-white rounded-3xl p-8 sm:p-12 border-4 border-black brutal-shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-black bg-[#FFD600] text-black px-3 py-1 rounded-md border border-black shadow-sm mb-2 inline-block">
                Kontak & Sekretariat
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Hubungi Kami</h2>
              <p className="text-xs text-purple-100 leading-relaxed max-w-sm font-bold">
                Hubungi kami untuk kolaborasi riset, proposal kemitraan, pertanyaan sertifikasi, maupun pendampingan batin di seluruh Indonesia.
              </p>
              
              <div className="space-y-3 text-xs text-white font-bold">
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#FFD600] shrink-0" /> Perumahan Wisma Indah No. A49, Kedungwaru, Tulungagung, Jawa Timur</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#FFD600] shrink-0" /> WhatsApp: 0896-5388-1556</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#FFD600] shrink-0" /> Email: info@jiwamu.com</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              {[
                { label: "YouTube Talks", val: "@jiwamutalks", url: "https://www.youtube.com/@jiwamutalks" },
                { label: "Instagram", val: "@jiwamu.daily", url: "https://instagram.com/jiwamu.daily" },
                { label: "Shopee Store", val: "jiwamu_store", url: "https://shopee.co.id/jiwamu_store" },
                { label: "TikTok", val: "@jiwamu.daily", url: "https://www.tiktok.com/@jiwamu.daily" }
              ].map((c, i) => (
                <a 
                  key={i} 
                  href={c.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-5 bg-white text-black rounded-2xl border-2 border-black hover:bg-[#FF71CF] transition-all cursor-pointer brutal-shadow-sm active:translate-y-0.5 active:shadow-none"
                >
                  <span className="text-[#8B5CF6] block mb-1 text-[10px] font-mono font-black uppercase">{c.label}</span>
                  <span className="font-extrabold text-xs sm:text-sm text-[#1A1A1A] block">{c.val}</span>
                </a>
              ))}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
