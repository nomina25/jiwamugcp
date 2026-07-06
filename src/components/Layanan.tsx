import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { initialPendampingList } from "../data/layanan";
import { Search, Heart, Shield, Check, Send, ChevronDown, ChevronUp, Star, Filter } from "lucide-react";

export default function Layanan() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKeahlian, setSelectedKeahlian] = useState("Semua");
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

  const toggleFaq = (idx: number) => {
    setFaqOpen({ ...faqOpen, [idx]: !faqOpen[idx] });
  };

  // Get unique list of specialties (keahlian)
  const allKeahlian = ["Semua"];
  initialPendampingList.forEach((p) => {
    p.keahlian.forEach((k) => {
      if (!allKeahlian.includes(k)) {
        allKeahlian.push(k);
      }
    });
  });

  const filteredPendamping = initialPendampingList.filter((p) => {
    const matchesSearch = p.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.keahlian.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesKeahlian = selectedKeahlian === "Semua" || p.keahlian.includes(selectedKeahlian);
    return matchesSearch && matchesKeahlian;
  });

  const expects = [
    "Ruang untuk didengarkan tanpa penghakiman",
    "Pendekatan yang menghormati ritme dan kesiapan batin masing-masing",
    "Pendampingan dengan batas dan kerangka yang jelas",
    "Privasi dan kerahasiaan yang dijaga dengan sungguh-sungguh",
    "Proses yang tidak hanya berfokus pada gejala, tetapi juga pola relasi dan pengalaman hidup yang melatarbelakanginya",
    "Kesempatan untuk memahami diri, emosi, dan hubungan secara lebih utuh."
  ];

  const pathways = [
    { title: "Pre-Treatment", desc: "Sesi pengenalan awal selama 30 menit tanpa biaya agar kamu dapat mengenal pendampingmu terlebih dahulu dan mempertimbangkan apakah layanan ini sesuai dengan kebutuhanmu." },
    { title: "Assessment & Case Formulation", desc: "Proses memahami gambaran kebutuhan, kekuatan, kerentanan, pola batin, serta kondisi emosionalmu saat ini." },
    { title: "Trial Sessions", desc: "Tahap awal untuk membiasakan diri dengan proses pendampingan sekaligus memastikan kecocokan proses kerja bersama." },
    { title: "Core Sessions", desc: "Tahap pendalaman untuk memahami dan memproses emosi sulit, memperkuat kualitas positif, dan membangun pola relasi yang lebih aman." },
    { title: "Trial Termination", desc: "Tahap persiapan mencukupkan layanan secara bertahap agar wawasan dan pengalaman yang diperoleh dapat mulai diterapkan dalam kehidupan sehari-hari." },
    { title: "Final Termination", desc: "Tahap penutupan dan tindak lanjut untuk membantu proses transisi secara lebih sehat dan sadar." }
  ];

  const faqs = [
    { q: "Apakah layanan di Jiwamu sama dengan terapi?", a: "Layanan di Jiwamu berfokus pada pendampingan refleksi diri dan proses memahami pengalaman emosional secara lebih mendalam. Pendekatan yang digunakan dapat berbeda-beda sesuai kebutuhan, latar belakang, dan kesepakatan proses kerja bersama." },
    { q: "Apakah saya harus sedang “sakit” untuk mengikuti layanan?", a: "Tidak. Banyak orang datang bukan karena mengalami krisis berat, tetapi karena ingin memahami dirinya, memperbaiki pola relasi, atau memiliki ruang refleksi yang lebih aman dan terarah." },
    { q: "Mengapa layanan menggunakan sistem bulanan dan bukan per sesi?", a: "Karena kami percaya proses memahami diri membutuhkan kontinuitas. Sistem bulanan membantu proses pendampingan berlangsung lebih stabil, konsisten, dan memiliki arah yang lebih jelas. Lagi pula, jika kita sepakat bahwa kesehatan mental itu penting, bukankah lebih baik membawanya sedekat mungkin dengan kehidupan kita?" },
    { q: "Apakah saya boleh memilih pendamping?", a: "Ya. Kamu dapat memilih pendamping berdasarkan kenyamanan, kebutuhan, atau bidang perhatian masing-masing." },
    { q: "Apakah layanan dilakukan secara online?", a: "Ya. Layanan tersedia secara online maupun offline sesuai ketersediaan dan kesepakatan bersama." },
    { q: "Apakah semua cerita saya akan dirahasiakan?", a: "Ya. Privasi dan kerahasiaan merupakan bagian penting dalam proses pendampingan di Jiwamu." }
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="bg-[#FDF4FF] border-b-4 border-black py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-4 inline-block">
            Layanan Pendampingan
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-snug">
            Tidak semua hal dalam hidup perlu segera diperbaiki. <br />
            <span className="underline decoration-wavy decoration-[#8B5CF6]">Sebagian perlu untuk dipahami bersama.</span>
          </h1>
          <p className="text-slate-800 font-bold text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Jiwamu menyediakan ruang pendampingan untuk kamu yang ingin memahami diri, pola hubungan, pengalaman emosional, dan kehidupan batin secara lebih utuh. Kami percaya bahwa setiap manusia memiliki ritme pertumbuhan yang berbeda.
          </p>
        </div>
      </section>

      {/* Expectation list */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-black bg-[#FF71CF] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-2 inline-block">
              Harapan Bersama
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] leading-snug">
              Apa yang bisa kamu harapkan dari kami?
            </h2>
            <div className="space-y-4">
              {expects.map((exp, i) => (
                <div key={i} className="flex gap-3 items-start text-xs sm:text-sm text-slate-800 font-bold">
                  <div className="p-1 rounded-full bg-[#FFD600] border border-black text-black shrink-0">
                    <Check className="w-3.5 h-3.5 font-black" />
                  </div>
                  <span>{exp}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#8B5CF6] text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden border-4 border-black brutal-shadow">
            <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/20 rounded-full filter blur-3xl"></div>
            <div className="space-y-4 relative z-10">
              <Heart className="w-8 h-8 fill-current text-[#FF71CF]" />
              <p className="font-serif italic text-lg sm:text-xl leading-relaxed font-semibold">
                "Kami percaya bahwa kamu lebih dari segala nama yang disematkan padamu. Kami bekerja denganmu dan hanya untukmu, secara utuh dan mendalam."
              </p>
              <div className="border-t-2 border-black pt-4 mt-6 text-xs text-[#FFD600] font-black uppercase tracking-wider">
                — Filosofi Jiwamu Center
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Model (Bulanan) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-black bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-2 inline-block">
            Model Layanan
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900">Apa yang kami lakukan?</h2>
          <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
            Layanan kami dirancang sebagai proses pendampingan berkelanjutan, bukan sekadar percakapan satu atau dua sesi. Karena itu, layanan kami menggunakan sistem kontrak bulanan agar proses dapat berlangsung lebih stabil, lebih aman, dan lebih terarah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Coaching */}
          <div className="bg-white rounded-3xl p-8 border-2 border-black flex flex-col justify-between brutal-shadow">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-black bg-[#FF71CF] px-3.5 py-1 rounded-full border border-black shadow-sm mb-2 inline-block">COACHING</span>
              <p className="text-xs text-slate-800 leading-relaxed font-bold">Cocok bagi kamu yang:</p>
              <ul className="space-y-2.5 text-xs text-slate-700 font-semibold">
                <li className="flex gap-2">• Memiliki tujuan yang lebih fokus dan terbatas</li>
                <li className="flex gap-2">• Sedang menghadapi persoalan tertentu dan segera ingin diselesaikan</li>
                <li className="flex gap-2">• Membutuhkan ruang refleksi, arahan, atau pengembangan diri secara lebih terstruktur</li>
              </ul>
            </div>
            <div className="border-t-2 border-black pt-6 mt-8">
              <p className="text-xxs font-mono text-slate-500 uppercase tracking-wider mb-1 font-black">Format Layanan</p>
              <p className="text-xs font-black text-slate-900">4 sesi setiap bulan | durasi 60–120 menit per sesi</p>
            </div>
          </div>

          {/* Psikoanalisis */}
          <div className="bg-[#8B5CF6] text-white rounded-3xl p-8 border-2 border-black flex flex-col justify-between brutal-shadow">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-black bg-[#FFD600] px-3.5 py-1 rounded-full border border-black shadow-sm mb-2 inline-block">PSIKOANALISIS</span>
              <p className="text-xs text-purple-100 leading-relaxed font-bold">Cocok bagi kamu yang:</p>
              <p className="text-xs text-purple-100 leading-relaxed font-semibold">
                Ingin menjadikan proses memahami diri sebagai bagian dari gaya hidup yang berkelanjutan, persis seperti gosok gigi dan olahraga.
              </p>
              <p className="text-xs text-purple-100 leading-relaxed font-semibold">
                Pendekatan ini berfokus pada pola berulang, dinamika bawah sadar, pengalaman relasional, dan kehidupan emosional yang lebih mendalam.
              </p>
            </div>
            <div className="border-t-2 border-black pt-6 mt-8">
              <p className="text-xxs font-mono text-purple-200 uppercase tracking-wider mb-1 font-black">Format Layanan</p>
              <p className="text-xs font-black text-[#FFD600]">Minimal 12 sesi setiap bulan | durasi 60 menit per sesi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Healing Pathway (fase) */}
      <section className="bg-[#FDF4FF] border-y-4 border-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-black bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-2 inline-block">
              Healing Pathway
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900">Alur Perjalanan Pemulihan</h2>
            <p className="text-xs text-slate-700 font-bold leading-relaxed">
              Setiap individu memiliki ritme dan kebutuhan yang berbeda. Karena itu, proses pendampingan di Jiwamu berlangsung secara bertahap melalui beberapa fase terstruktur berikut.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pathways.map((pw, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border-2 border-black space-y-3 brutal-shadow-sm">
                <span className="font-mono text-xs font-black text-[#8B5CF6] bg-[#FFD600] border border-black px-2.5 py-1 rounded-md shadow-sm">FASE 0{i+1}</span>
                <h4 className="font-sans text-sm font-extrabold text-slate-900 pt-1">{pw.title}</h4>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">{pw.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pendamping Section (Interactive search and specialty filter) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-3 max-w-lg">
            <span className="text-xs font-black uppercase tracking-widest text-black bg-[#FF71CF] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-2 inline-block">Pamong Pendamping</span>
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900">Pendengar setiamu . . .</h2>
            <p className="text-xs text-slate-600 font-bold leading-relaxed">
              Kamu dapat menyaring pendamping berdasarkan minat keahlian atau mencari langsung nama pendamping yang paling sesuai dengan kebutuhan batinmu.
            </p>
          </div>
          
          {/* Filters */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 font-black" />
              <input
                id="layanan-search-input"
                type="text"
                placeholder="Cari nama atau keahlian..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-black rounded-xl text-xs focus:outline-none bg-white font-bold shadow-sm"
              />
            </div>
            
            <div className="relative">
              <select
                id="layanan-filter-select"
                value={selectedKeahlian}
                onChange={e => setSelectedKeahlian(e.target.value)}
                className="pl-4 pr-10 py-2.5 border-2 border-black rounded-xl text-xs focus:outline-none bg-white appearance-none cursor-pointer font-bold shadow-sm"
              >
                {allKeahlian.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none font-black" />
            </div>
          </div>
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPendamping.map((p, idx) => (
              <motion.div
                key={p.nama}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white border-2 border-black rounded-3xl p-6 flex flex-col justify-between brutal-shadow h-full hover:translate-y-[-2px] transition-all"
              >
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <img src={p.foto} alt={p.nama} className="w-16 h-16 rounded-2xl object-cover bg-slate-100 shrink-0 border-2 border-black shadow-sm" />
                    <div>
                      <h3 className="font-sans text-xs sm:text-sm font-extrabold text-slate-900">{p.nama}</h3>
                      <span className="text-[10px] font-mono font-black text-[#8B5CF6] block mt-0.5">{p.pengalaman}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 pt-2">
                    <span className="text-xxs font-black text-slate-400 uppercase tracking-wider block">Keahlian Utama:</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.keahlian.map((k) => (
                        <span key={k} className="bg-[#FFD600] text-black text-[10px] font-black px-2.5 py-1 rounded-md border border-black shadow-sm">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-black pt-4 mt-6">
                  <a
                    href={`https://wa.me/6289653881556?text=Hai%20Kak%20Nuy%2C%20saya%20ingin%20berkonsultasi%20dengan%20pendamping%20${encodeURIComponent(p.nama)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-[#8B5CF6] text-white border-2 border-black text-xs font-black py-2.5 rounded-xl hover:bg-[#FF71CF] hover:text-black transition-all cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none"
                  >
                    Mulai Sesi Bersama {p.nama.split(",")[0]}
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredPendamping.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-600 bg-white rounded-3xl border-2 border-black brutal-shadow">
              <p className="text-xs font-bold">Tidak ditemukan pendamping dengan kriteria pencarian tersebut.</p>
              <button onClick={() => { setSearchTerm(""); setSelectedKeahlian("Semua"); }} className="text-xs text-[#8B5CF6] font-black hover:underline mt-2 cursor-pointer">
                Reset Pencarian
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-2 inline-block">FAQs</span>
          <h2 className="font-sans text-2xl font-extrabold text-slate-900">Pertanyaan Tentang Layanan</h2>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, i) => (
            <div key={i} className="border-2 border-black rounded-2xl overflow-hidden bg-white brutal-shadow-sm mb-3">
              <button onClick={() => toggleFaq(i)} className="w-full px-5 py-4 text-left font-sans text-xs sm:text-sm font-extrabold text-slate-900 flex justify-between items-center bg-[#FDF4FF] cursor-pointer">
                <span>{faq.q}</span>
                {faqOpen[i] ? <ChevronUp className="w-4 h-4 text-slate-600 font-black" /> : <ChevronDown className="w-4 h-4 text-slate-600 font-black" />}
              </button>
              <AnimatePresence>
                {faqOpen[i] && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-5 py-4 text-xs sm:text-sm text-slate-800 leading-relaxed border-t-2 border-black bg-white font-medium">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[#8B5CF6] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 border-4 border-black brutal-shadow">
          <h2 className="font-sans text-xl sm:text-2xl font-extrabold text-white">Siap memulai perjalananmu?</h2>
          <p className="text-xs sm:text-sm text-purple-100 max-w-lg mx-auto font-bold">
            Hubungi Kak Nuy untuk berkonsultasi mengenai pendampingan yang tepat, atau langsung menjadwalkan sesi Pre-Treatment gratis dengan pendamping pilihanmu.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/6289653881556?text=Hai%20Kak%20Nuy%2C%20saya%20butuh%20teman%20pendengar!" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#FFD600] text-black border-2 border-black font-black text-xs px-8 py-3.5 rounded-xl transition-all cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none">
              <Send className="w-3.5 h-3.5 font-black" /> Mulai Konsultasi (WA)
            </a>
            <button className="inline-flex items-center gap-2 border-2 border-black bg-white text-black font-black text-xs px-8 py-3.5 rounded-xl transition-all cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none">
              <Shield className="w-3.5 h-3.5 font-black" /> Unduh Brosur Layanan (PDF)
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
