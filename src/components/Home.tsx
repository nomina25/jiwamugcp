import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, HelpCircle, Send, CheckCircle2, Phone, Youtube, Facebook, Instagram, Radio, ShoppingBag } from "lucide-react";

interface HomeProps {
  setHash: (hash: string) => void;
}

export default function Home({ setHash }: HomeProps) {
  const [subName, setSubName] = useState("");
  const [subPhone, setSubPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName || !subPhone) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setSubName("");
      setSubPhone("");
    }, 4000);
  };

  const socialLinks = [
    { name: "WhatsApp", val: "0896-5388-1556", url: "https://wa.me/6289653881556?text=Hai%20Jiwamu%2C%20saya%20ingin%20tahu%20lebih%20banyak.", hoverBg: "hover:bg-[#D9F99D]" },
    { name: "YouTube", val: "@jiwamutalks", url: "https://www.youtube.com/@jiwamutalks", hoverBg: "hover:bg-red-200" },
    { name: "Facebook", val: "Jiwamu", url: "https://web.facebook.com/profile.php?id=61590298628384", hoverBg: "hover:bg-blue-200" },
    { name: "Instagram", val: "@jiwamu.daily", url: "https://instagram.com/jiwamu.daily", hoverBg: "hover:bg-pink-200" },
    { name: "Threads", val: "@jiwamu.daily", url: "https://www.threads.net/@jiwamu.daily", hoverBg: "hover:bg-slate-200" },
    { name: "TikTok", val: "@jiwamu.daily", url: "https://www.tiktok.com/@jiwamu.daily", hoverBg: "hover:bg-fuchsia-200" },
    { name: "Shopee", val: "jiwamu_store", url: "https://shopee.co.id/jiwamu_store", hoverBg: "hover:bg-orange-200" }
  ];

  return (
    <div className="space-y-24 pb-16 px-4">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#D9F99D] brutal-border rounded-3xl brutal-shadow max-w-7xl mx-auto mt-6">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop" 
            alt="Sunrise" 
            className="w-full h-full object-cover object-center opacity-25 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#D9F99D]/90 via-[#D9F99D]/85 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 sm:py-24">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1A1A1A] text-[#FFD600] text-xs font-black uppercase tracking-widest brutal-border-thin shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF71CF] animate-pulse"></span>
              #BertumbuhBersama
            </span>
            <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1A1A] leading-[1.1]">
              Ruang aman untuk <br />
              <span className="underline decoration-wavy decoration-[#FF71CF] decoration-3">bertumbuh</span> <span className="text-[#8B5CF6]">bersama.</span>
            </h1>
            <p className="text-[#1A1A1A] text-sm sm:text-base font-bold leading-relaxed max-w-xl bg-white/70 p-4 rounded-2xl brutal-border-thin">
              Jiwamu adalah ekosistem pengembangan diri dan media digital berbasis teori kelekatan — ruang belajar, pendampingan, penerbitan, media, dan gerakan sosial yang didesain inklusif bagi generasi muda.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="hero-mulai-perjalanan-btn"
                onClick={() => setHash("tes-kelekatan")}
                className="inline-flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#FF71CF] text-white font-extrabold text-xs sm:text-sm px-6 py-4 rounded-xl brutal-border brutal-shadow transition-all cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Mulai Perjalananmu
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://wa.me/6289653881556?text=Hai%20Kak%20Nuy%2C%20saya%20ingin%20tanya%20mengenai%20layanan%20pendampingan%20Jiwamu."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#FFD600] text-black font-extrabold text-xs sm:text-sm px-6 py-4 rounded-xl brutal-border brutal-shadow transition-all cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Tanya Kami
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-10 bg-[#BFDBFE] brutal-border rounded-3xl brutal-shadow text-center space-y-8">
        <span className="text-xs font-mono uppercase tracking-widest text-[#1A1A1A] block font-black bg-white w-fit mx-auto px-4 py-1.5 rounded-full brutal-border-thin">
          Manifesto Kami
        </span>
        <h2 className="text-xl sm:text-2xl lg:text-3xl text-[#1A1A1A] leading-relaxed font-extrabold max-w-3xl mx-auto">
          "Sebagian besar dari kita tumbuh dengan keyakinan bahwa masalah hidup bisa diselesaikan dengan cukup usaha, cukup kesabaran, atau cukup doa. Kita diajarkan untuk <span className="bg-[#FF71CF] text-black px-2 py-0.5 rounded-lg brutal-border-thin">kuat</span>. Untuk tidak cengeng."
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[#1A1A1A] font-bold text-xs sm:text-sm leading-relaxed text-left max-w-2xl mx-auto pt-4 border-t-2 border-[#1A1A1A]">
          <p>
            Di banyak keluarga, perasaan bukan sesuatu yang dibicarakan di meja makan. Perasaan adalah sesuatu yang ditelan bersama nasi dan lauk, lalu pura-pura kalau itu sudah berlalu.
          </p>
          <p>
            Kita menjadi kian mahir menggunakan topeng ‘si baik-baik saja’, namun tidak pernah benar-benar paham mengapa kita selalu berkubang di tempat yang sama. Sering kali, perasaan yang tak pernah dibicarakan justru menetap lebih lama di dalam diri.
          </p>
        </div>
        <div className="brutal-border pl-6 pr-4 py-3 text-left max-w-lg mx-auto bg-white rounded-2xl mt-8 brutal-shadow-sm">
          <p className="font-sans italic text-[#1A1A1A] font-extrabold text-sm sm:text-base leading-relaxed">
            "Jiwamu adalah wadah di mana segala rasa berlabuh tanpa dihakimi dan ruang di mana setiap proses bertumbuh aman melegakan."
          </p>
        </div>
      </section>

      {/* APA YANG KAMU BUTUHKAN SECTION */}
      <section className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-[#1A1A1A]">
            Apa yang kamu butuhkan?
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1A1A] font-bold uppercase tracking-wider">
            Tiga pintu masuk untuk bertumbuh bersama Jiwamu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-8 brutal-border brutal-shadow flex flex-col justify-between hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            <div className="space-y-4">
              <span className="font-mono text-3xl font-black text-[#1A1A1A] bg-[#FF71CF] px-3.5 py-1 rounded-xl brutal-border-thin shadow-sm inline-block">01</span>
              <h3 className="font-sans text-xl font-extrabold text-[#1A1A1A]">Kelas Pengembangan Diri</h3>
              <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                Mulai dan kembangkan kariermu untuk membantu sesama dengan para pengajar bereputasi.
              </p>
              <p className="text-[11px] text-slate-600 font-semibold leading-relaxed bg-[#FDF4FF] p-3 rounded-xl border border-black/10">
                Program sertifikasi attachment bertingkat: CAF, CAC, CABP. Dilengkapi modul, asesmen, dan komunitas alumni.
              </p>
            </div>
            <button
              onClick={() => setHash("kelas")}
              className="inline-flex items-center justify-center gap-1.5 bg-[#FFD600] hover:bg-[#8B5CF6] hover:text-white text-[#1A1A1A] font-black text-xs px-4 py-3 rounded-xl mt-8 brutal-border brutal-shadow-sm cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              Lihat Kelas
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-[#BFDBFE] rounded-3xl p-8 brutal-border brutal-shadow flex flex-col justify-between hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            <div className="space-y-4">
              <span className="font-mono text-3xl font-black text-[#1A1A1A] bg-[#FFD600] px-3.5 py-1 rounded-xl brutal-border-thin shadow-sm inline-block">02</span>
              <h3 className="font-sans text-xl font-extrabold text-[#1A1A1A]">Pendampingan Olah Jiwa</h3>
              <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                Dapatkan ruang aman untuk memahami diri, relasi, dan kehidupan emosionalmu bersama pendamping profesional.
              </p>
              <p className="text-[11px] text-slate-600 font-semibold leading-relaxed bg-white p-3 rounded-xl border border-black/10">
                Coaching dan psikoanalisis dengan sistem kontrak bulanan. 13 pendamping profesional dengan keahlian beragam.
              </p>
            </div>
            <button
              onClick={() => setHash("layanan")}
              className="inline-flex items-center justify-center gap-1.5 bg-[#FF71CF] hover:bg-[#8B5CF6] hover:text-white text-[#1A1A1A] font-black text-xs px-4 py-3 rounded-xl mt-8 brutal-border brutal-shadow-sm cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              Mulai Konsultasi
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-[#FEF08A] rounded-3xl p-8 brutal-border brutal-shadow flex flex-col justify-between hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            <div className="space-y-4">
              <span className="font-mono text-3xl font-black text-[#1A1A1A] bg-[#8B5CF6] text-white px-3.5 py-1 rounded-xl brutal-border-thin shadow-sm inline-block">03</span>
              <h3 className="font-sans text-xl font-extrabold text-[#1A1A1A]">Suplemen Batin</h3>
              <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                Buku dan medium reflektif untuk menemani perjalanan batin dan pertumbuhanmu.
              </p>
              <p className="text-[11px] text-slate-600 font-semibold leading-relaxed bg-white p-3 rounded-xl border border-black/10">
                Penerbit Jiwamu menerbitkan buku populer dan sastra psikologis. Tersedia juga Majalah Jiwamu bulanan ber-ISSN.
              </p>
            </div>
            <button
              onClick={() => setHash("buku")}
              className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#FF71CF] text-[#1A1A1A] font-black text-xs px-4 py-3 rounded-xl mt-8 brutal-border brutal-shadow-sm cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              Jelajahi Buku
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* BULAN INI DI JIWAMU (Promo Schedule) */}
      <section className="bg-[#8B5CF6] text-white py-16 overflow-hidden relative brutal-border rounded-3xl brutal-shadow max-w-7xl mx-auto">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full filter blur-3xl -mr-20 -mt-20"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FFD600] font-black block bg-[#1A1A1A] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm">
                Bulan Ini di Jiwamu
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Fokus: <span className="underline decoration-wavy decoration-[#FF71CF]">kelas terdekat</span>
              </h2>
              <p className="text-xs sm:text-sm text-purple-100 font-semibold leading-relaxed max-w-lg bg-[#1A1A1A]/30 p-4 rounded-xl brutal-border-thin">
                Pelatihan intensif Level 1 - Certification in Attachment Facilitator (CAF). Kelas satu hari penuh yang dirancang padat untuk mempelajari dasar attachment, membaca kebutuhan emosional, dan merespons orang lain dengan tepat.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/6289653881556?text=Hai%20Kak%20Nuy%2C%20saya%20ingin%20gabung%20kelas%20CAF!"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#FFD600] hover:bg-[#FF71CF] text-black font-black text-xs sm:text-sm px-6 py-4 rounded-xl brutal-border brutal-shadow transition-all cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white text-black rounded-3xl p-6 sm:p-8 brutal-border brutal-shadow space-y-6">
              <div className="flex justify-between items-start border-b-2 border-black pb-4">
                <div>
                  <span className="bg-[#FF71CF] text-black text-[10px] font-black px-2.5 py-1 rounded-full brutal-border-thin shadow-sm">LEVEL 1 · CAF</span>
                  <h3 className="font-sans text-base sm:text-lg font-black mt-3">Certification in Attachment Facilitator</h3>
                </div>
                <div className="text-right">
                  <span className="text-slate-600 text-xxs font-mono block font-bold">DURASI</span>
                  <span className="text-[#8B5CF6] font-black text-lg font-mono">9 Jam</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                <div>
                  <span className="text-slate-500 block mb-1 uppercase text-xxs tracking-wider">Tanggal</span>
                  <span className="font-black block">Sabtu, 11 Juli 2026</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1 uppercase text-xxs tracking-wider">Materi Fokus</span>
                  <span className="font-black block">Read Before Respond (RBR)</span>
                </div>
              </div>

              <div className="space-y-1 text-xs pt-2">
                <span className="text-slate-500 block mb-1.5 uppercase text-xxs tracking-wider font-bold">Kota Tersedia</span>
                <div className="flex flex-wrap gap-2">
                  {["Malang", "Jakarta", "Yogyakarta", "Bandung"].map(city => (
                    <span key={city} className="bg-[#FEF08A] border-2 border-black px-3 py-1.5 rounded-xl font-bold brutal-shadow-sm">
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MARI TERHUBUNG SECTION */}
      <section className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-[#1A1A1A]">
            Mari terhubung!
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-bold uppercase tracking-wider">
            Kami menanti di ruang-ruang yang nyaman bagimu.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {socialLinks.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className={`p-5 rounded-2xl bg-white brutal-border brutal-shadow flex flex-col items-center text-center justify-center gap-3 transition-all cursor-pointer hover:scale-105 active:translate-x-1 active:translate-y-1 active:shadow-none text-[#1A1A1A] ${item.hoverBg}`}
            >
              <span className="text-xs font-extrabold block uppercase tracking-wider">{item.name}</span>
              <span className="text-[10px] font-mono font-bold opacity-80 break-all leading-tight">{item.val}</span>
            </a>
          ))}
        </div>
      </section>

      {/* BERLANGGANAN SECTION */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-[#FF71CF] text-[#1A1A1A] rounded-3xl p-8 sm:p-12 relative overflow-hidden brutal-border brutal-shadow">
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full filter blur-2xl"></div>
          
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-black bg-[#FFD600] px-3 py-1 rounded-full w-fit font-black block brutal-border-thin shadow-sm">
              Berlangganan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Dapatkan edisi terbaru Majalah Jiwamu setiap bulan.
            </h2>
            <p className="text-xs text-black font-bold max-w-md leading-relaxed bg-white/40 p-3 rounded-xl border border-black/10">
              Gratis. Edisi terbitan resmi dari Perkumpulan Pamong Jiwa Indonesia (PANJI) akan langsung dikirimkan ke WhatsApp kamu.
            </p>

            {isSubmitted ? (
              <div className="bg-[#D9F99D] border-2 border-black rounded-2xl p-4 flex gap-3 items-center text-xs animate-fade-in brutal-shadow-sm text-black">
                <CheckCircle2 className="w-5 h-5 text-[#8B5CF6] shrink-0" />
                <div>
                  <p className="font-extrabold">Pendaftaran Berhasil!</p>
                  <p className="text-[11px] font-bold mt-0.5">Edisi terbaru akan kami kirimkan begitu rilis setiap bulannya.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  id="sub-name-input"
                  type="text"
                  placeholder="Nama Lengkap"
                  value={subName}
                  onChange={e => setSubName(e.target.value)}
                  className="bg-white border-2 border-black rounded-xl px-4 py-3 text-xs flex-1 placeholder:text-slate-400 font-bold"
                  required
                />
                <input
                  id="sub-phone-input"
                  type="tel"
                  placeholder="No. WhatsApp"
                  value={subPhone}
                  onChange={e => setSubPhone(e.target.value)}
                  className="bg-white border-2 border-black rounded-xl px-4 py-3 text-xs flex-1 placeholder:text-slate-400 font-mono font-bold"
                  required
                />
                <button
                  id="sub-submit-btn"
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
