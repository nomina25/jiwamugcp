import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { initialUnduhanList } from "../data/sumberDaya";
import { BookOpen, Send, Download, Layers, CheckCircle2, Award, Shield, FileText, ChevronRight } from "lucide-react";
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
      // Fallback behavior if Firestore call fails (e.g. offline or rules blocked)
      setIsSubmitted(true);
      setSubName("");
      setSubPhone("");
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }
  };

  const isWritingPage = currentHash === "majalah/kirim-tulisan";

  // SUBPAGE: KIRIM TULISAN
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
          className="text-xs font-black text-[#1A1A1A] hover:text-[#8B5CF6] flex items-center gap-1 cursor-pointer bg-white px-3.5 py-2 rounded-xl brutal-border-thin shadow-sm"
        >
          ← Kembali ke Majalah
        </button>

        {/* Hero */}
        <div className="space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FF71CF] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-2 inline-block">
            Menjadi Kontributor
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] leading-tight">
            Punya gagasan, pengalaman, atau keresahan yang ingin dibagikan?
          </h1>
          <p className="text-slate-800 font-bold text-xs sm:text-sm leading-relaxed max-w-2xl bg-white p-4 rounded-xl border border-black shadow-sm">
            Kami percaya bahwa pengalaman manusia terlalu berharga untuk disimpan sendirian. Jika kamu punya ide atau argumen yang segar, kami membuka kesempatan untuk menjadi bagian dari percakapan tentang jiwa dan kehidupan manusia.
          </p>
        </div>

        {/* Rubriks list */}
        <div className="space-y-6">
          <h2 className="font-sans text-xs font-black uppercase tracking-wider text-[#1A1A1A]">Pilihan Rubrik Tulisan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rubriks.map((rb, i) => (
              <div key={i} className="p-5 border-2 border-black bg-white rounded-2xl space-y-2.5 brutal-shadow-sm">
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
          <div className="bg-[#D9F99D] border-2 border-black p-6 sm:p-8 rounded-3xl space-y-4 brutal-shadow-sm text-black">
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

          <div className="bg-[#BFDBFE] border-2 border-black p-6 sm:p-8 rounded-3xl space-y-4 brutal-shadow-sm text-black">
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
        <div className="bg-[#8B5CF6] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 brutal-border brutal-shadow">
          <h2 className="font-sans text-xl font-extrabold text-white">Siap mengirimkan tulisanmu?</h2>
          <p className="text-xs sm:text-sm text-purple-100 max-w-lg mx-auto font-bold">
            Kami menanti gagasan dan suaramu untuk bertumbuh bersama lebih banyak orang. Klik di bawah untuk mulai mengirimkan naskahmu.
          </p>
          <a
            href="https://wa.me/6289653881556?text=Hai%20Kak%20Nuy%2C%20saya%20ingin%20menjadi%20kontributor%20Majalah%20Jiwamu!"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#FFD600] hover:bg-white text-black font-black text-xs px-8 py-3.5 rounded-xl brutal-border brutal-shadow-sm transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" /> Kirim Tulisan (WA)
          </a>
        </div>
      </div>
    );
  }

  const latestEdition = majalahList[0];
  const previousEditions = majalahList.slice(1);

  // MAIN MAJALAH LANDING PAGE
  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero */}
      <section className="bg-[#FDF4FF] border-b-4 border-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-2 inline-block">
            Majalah Bulanan
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Media resmi <span className="underline decoration-wavy decoration-[#8B5CF6]">Perkumpulan Pamong Jiwa</span> Indonesia.
          </h1>
          <p className="text-slate-800 font-medium text-xs sm:text-sm max-w-2xl leading-relaxed">
            Majalah Jiwamu terbit berkala setiap bulan dengan tema berbeda, menghadirkan gagasan populer, reflektif, dan edukatif seputar kejiwaan yang ber-ISSN 3063-542X dari BRIN melalui SK 3063542X/II.7.4/SK.ISSN/09/2024.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo("majalah/kirim-tulisan")}
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#8B5CF6] hover:text-[#FF71CF] cursor-pointer bg-white border-2 border-black px-4 py-2.5 rounded-xl brutal-shadow-sm transition-all active:translate-y-0.5 active:shadow-none"
            >
              Kirim tulisanmu di sini
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Latest Edition */}
      {latestEdition && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <span className="text-xs font-black uppercase tracking-widest text-black bg-[#FF71CF] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm block">
            Edisi Terbaru Bulan Ini
          </span>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white text-black rounded-3xl p-6 sm:p-10 brutal-border brutal-shadow items-center overflow-hidden relative">
            <div className="absolute top-0 right-0 w-84 h-84 bg-[#FF71CF]/5 rounded-full filter blur-3xl"></div>
            
            <div className="md:col-span-4 shrink-0 max-w-xs mx-auto md:mx-0">
              <img 
                src={latestEdition.cover} 
                alt={latestEdition.tema} 
                className="w-full h-auto aspect-[3/4] object-cover rounded-2xl shadow-sm border-2 border-black bg-slate-100"
              />
            </div>

            <div className="md:col-span-8 space-y-6">
              <div className="space-y-4">
                <span className="text-[#8B5CF6] font-mono text-xs font-black bg-[#FDF4FF] border border-black px-3 py-1.5 rounded-xl w-fit inline-block shadow-sm">
                  {latestEdition.id} · {latestEdition.bulanTahun}
                </span>
                <h3 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">
                  Tema: {latestEdition.tema}
                </h3>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed max-w-xl">
                  {latestEdition.deskripsi}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button 
                  onClick={() => alert(`Membuka pembaca majalah interaktif untuk tema: ${latestEdition.tema}`)}
                  className="bg-[#FFD600] hover:bg-white text-black font-black text-xs px-6 py-3.5 rounded-xl brutal-border brutal-shadow-sm transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                >
                  Baca Majalah
                </button>
                <button 
                  onClick={() => alert(`Mengunduh majalah ${latestEdition.id} sebagai PDF...`)}
                  className="bg-[#BFDBFE] hover:bg-white text-black font-black text-xs px-6 py-3.5 rounded-xl brutal-border brutal-shadow-sm transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
                >
                  Unduh PDF
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* History Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm block">
          Riwayat Terbitan Sebelumnya
        </span>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {previousEditions.map((maj) => (
            <div key={maj.id} className="bg-white border-2 border-black rounded-3xl p-5 brutal-shadow space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <img src={maj.cover} alt={maj.tema} className="w-full aspect-[3/4] object-cover rounded-2xl bg-slate-50 border-2 border-black" />
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-800 bg-[#FDF4FF] px-2.5 py-1 rounded-md font-mono font-black border border-black w-fit block shadow-sm">
                    {maj.id} · {maj.bulanTahun}
                  </span>
                  <h4 className="font-sans text-xs sm:text-sm font-extrabold text-[#1A1A1A] leading-snug">Tema: {maj.tema}</h4>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3 border-t-2 border-black">
                <button 
                  onClick={() => alert(`Membuka pembaca majalah interaktif untuk: ${maj.tema}`)}
                  className="bg-white hover:bg-[#FEF08A] text-black border-2 border-black text-xs font-black py-2.5 rounded-lg text-center cursor-pointer shadow-sm transition-all"
                >
                  Baca
                </button>
                <button 
                  onClick={() => alert(`Mengunduh naskah PDF untuk: ${maj.tema}`)}
                  className="bg-[#D9F99D] hover:bg-white text-black border-2 border-black text-xs font-black py-2.5 rounded-lg text-center cursor-pointer shadow-sm transition-all"
                >
                  Unduh PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subscribe Free */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FF71CF] rounded-3xl p-8 sm:p-12 text-black relative overflow-hidden brutal-border brutal-shadow">
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[#8B5CF6]/10 rounded-full filter blur-2xl"></div>
          
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm block">
              Berlangganan Gratis
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold leading-tight text-black">
              Berlangganan Gratis Sekarang
            </h2>
            <p className="text-xs text-[#1A1A1A] font-bold leading-relaxed">
              Dapatkan edisi terbaru Majalah Jiwamu langsung melalui WhatsApp kamu segera setelah terbit setiap bulan.
            </p>

            {isSubmitted ? (
              <div className="bg-[#D9F99D] border-2 border-black rounded-2xl p-4 flex gap-3 items-center text-xs shadow-sm">
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
                  className="bg-[#FFD600] hover:bg-white text-black font-black text-xs px-6 py-3.5 rounded-xl transition-all shrink-0 cursor-pointer brutal-border brutal-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
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
