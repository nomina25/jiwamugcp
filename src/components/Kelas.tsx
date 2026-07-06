import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, BookOpen, Clock, CreditCard, HelpCircle, MapPin, Users, CheckCircle, ChevronDown, ChevronUp, Download, Send } from "lucide-react";

interface KelasProps {
  currentHash: string;
  setHash: (hash: string) => void;
  classesList?: any[];
  trainersList?: any[];
}

const defaultClasses = [
  {
    id: "caf",
    code: "CAF",
    level: "Level 1",
    title: "Certification in Attachment Facilitator",
    desc: "Dalam pelatihan ini, kamu akan mempelajari dasar-dasar attachment untuk membaca pola relasi, memahami kebutuhan emosional, mengelola konflik, dan merespons orang lain dengan lebih tepat: kapan cukup hadir dan mendengarkan, kapan perlu memberi arahan.",
    price: "Rp 2.500.000",
    investment: "Rp 2.500.000",
    rekeningBank: "Bank Mandiri No. Rekening: 1410039881313 An. Yayasan Pusat Psikoanalisis Indonesia",
    duration: "1 Hari Penuh (9 Jam intensif)",
    jadwal: [
      { city: "Malang", hotel: "Grand Cakra Hotel", date: "Sabtu, 11 Juli 2026" },
      { city: "Jakarta", hotel: "Santika Premier", date: "Sabtu, 11 Juli 2026" },
      { city: "Yogyakarta", hotel: "Melia Purosani", date: "Sabtu, 11 Juli 2026" },
      { city: "Bandung", hotel: "de Braga by ARTOTEL", date: "Sabtu, 11 Juli 2026" }
    ],
    materi: [
      "Home Is Where We Start From", "What is Attachment?", "Brief History of Attachment Studies",
      "Attachment and Loss", "Safe Haven dan Secure Base", "Read Before Respond (RBR)",
      "RBR Diagnostic Pathway", "Skill 1: Read Before Respond (RBR)", "Attachment Systems",
      "Attachment Pattern", "Internal Working Models", "Attachment Style", "ECR-R",
      "Skill 2: Measuring", "Attachment Rupture", "Dimensions of Wound", "Attachment Wound Cycle",
      "Window of Tolerance", "Skill 3: 4-Step Window", "Attachment Secure Cycle", "Rupture-Repair",
      "Skill 4: 4-Step Repair", "Secure Repetition Principle"
    ],
    competence: [
      "Memahami kebutuhan terdalam manusia akan rasa aman",
      "Menyelami pola bawah sadar yang membentuk caramu mencintai dan menjalin relasi",
      "Menguasai pendekatan yang tepat: kapan mendengarkan dan kapan memberikan arahan?",
      "Mengurai kekuatan dan tantangan dari setiap gaya attachment",
      "Mengidentifikasi kecenderungan gaya attachment (langsung asesmen di kelas)",
      "Memahami akar konflik, kecemburuan, ketakutan ditinggalkan, dan pola menjauh dalam hubungan",
      "Mendeteksi, mencegah, dan memperbaiki berbagai bentuk masalah dengan pasangan, keluarga, dan pertemanan."
    ]
  },
  {
    id: "cac",
    code: "CAC",
    level: "Level 2",
    title: "Certification in Attachment Coaching",
    desc: "Kelas ini merupakan pelatihan lanjutan bagi peserta yang telah menyelesaikan Certification in Attachment Facilitator (CAF). Program ini dirancang untuk membantu peserta memahami berbagai kebutuhan attachment di setiap rentang usia, bagaimana luka attachment terbentuk, bagaimana ia hidup dalam cerita diri, dan bagaimana pola tidak aman terus berulang dalam hubungan.",
    price: "Rp 3.000.000",
    investment: "Rp 3.000.000",
    rekeningBank: "Bank Mandiri No. Rekening: 1410039881313 An. Yayasan Pusat Psikoanalisis Indonesia",
    duration: "1 Hari Penuh (9 Jam intensif)",
    jadwal: [
      { city: "Malang", hotel: "Grand Cakra Hotel", date: "Minggu, 12 Juli 2026" },
      { city: "Jakarta", hotel: "Santika Premier", date: "Minggu, 12 Juli 2026" },
      { city: "Yogyakarta", hotel: "Melia Purosani", date: "Minggu, 12 Juli 2026" },
      { city: "Bandung", hotel: "de Braga by ARTOTEL", date: "Minggu, 12 Juli 2026" }
    ],
    materi: [
      "Remembering Attachment Systems", "Dimensions of Wound", "Defensive Strategy",
      "IWM: The Meaning of Rupture", "Fear: The Threat of Rupture", "Shame: The Self in Rupture",
      "Self-Fulfilling Prophecy", "Attachment Narrative", "Fundamental Rule", "Mentalization",
      "Healing Journey", "Informed Consent", "Framework and Setting", "Attachment Screen-Replay (ASR)",
      "Hypno-Introspection", "Mirror-Image Technique", "Breaking Narrative Thought",
      "Narrative Defusion", "(M)other Expectation", "Creative-Aggression Technique",
      "Emotional Attunement", "Separation Dialogue", "Instigation Technique"
    ],
    competence: [
      "Memahami blueprint yang membentuk caramu melihat diri dan orang lain",
      "Mengidentifikasi luka attachment yang memengaruhi pola hubunganmu saat ini",
      "Membaca struktur “lingkaran ketakutan” yang mengaktifkan reaksi otomatis dalam konflik",
      "Mengurai bagaimana siklus tidak aman terbentuk dan mengapa ia terus berulang",
      "Membangun 'lingkaran aman' sebagai pola relasi yang lebih sehat",
      "Menguasai teknik merekonstruksi narasi hidup agar tidak lagi terjebak pada cerita lama",
      "Menerapkan berbagai teknik healing untuk meningkatkan kesadaran dan kepekaan."
    ]
  },
  {
    id: "cabp",
    code: "CABP",
    level: "Level 3",
    title: "Certification in Attachment-Based Practitioner",
    desc: "Kelas ini adalah level tertinggi dalam jalur sertifikasi Jiwamu. Program ini dirancang bagi peserta yang telah memiliki pemahaman mengenai Attachment Facilitating dan Attachment Coaching, serta ingin mengembangkan kompetensi praktik berbasis attachment dalam berbagai bidang kehidupan.",
    price: "Rp 13.000.000",
    investment: "Rp 13.000.000",
    rekeningBank: "Bank Mandiri No. Rekening: 1410039881313 An. Yayasan Pusat Psikoanalisis Indonesia",
    duration: "3 Bulan (100 Jam Pembelajaran)",
    jadwal: [
      { city: "Yogyakarta", hotel: "Melia Purosani", date: "Sabtu, 22 Agustus 2026" }
    ],
    materi: [
      "Modul 1 – Writing for Publication", "Modul 2 – Attachment and Mental Health",
      "Modul 3 – Attachment and Education", "Modul 4 – Attachment and Workplace",
      "Modul 5 – Attachment and Parenting", "Modul 6 – Attachment and Romantic Relationship",
      "Modul 7 – Attachment and Spirituality", "Modul 8 – Attachment and Money",
      "Modul 9 – Attachment and Social Justice", "Modul 10 – Start Your Practice!"
    ],
    competence: [
      "Praktik klinis profesional terstandarisasi",
      "Mampu merancang modul pendampingan berbasis riset",
      "Akses menulis di platform dan media Jiwamu",
      "Kompetensi advokasi keadilan sosial",
      "Pemahaman mendalam attachment lintas disiplin ilmu"
    ]
  },
  {
    id: "professionalbridging",
    code: "BRIDGING",
    level: "Special Path",
    title: "CABP Professional Bridging Program",
    desc: "Program jalur khusus untuk psikolog (HIMPSI), psikolog klinis (IPK.ID), dokter (IDI), psikoanalis (API), konselor (IKI), perawat (PPNI), bidan (IBI), kesehatan masyarakat (IAKMI), hipnoterapis (PKHI dan PRAHIPTI), dan coach (ICF).",
    price: "Rp 15.000.000",
    investment: "Rp 15.000.000",
    rekeningBank: "Bank Mandiri No. Rekening: 1410039881313 An. Yayasan Pusat Psikoanalisis Indonesia",
    duration: "Program Khusus",
    jadwal: [
      { city: "Jakarta", hotel: "Online & Offline Modular", date: "Sesuai Pendaftaran" }
    ],
    materi: [
      "Integrasi Klinis & Attachment", "Metodologi Asesmen Lanjut", "Supervisi Kasus Komplex"
    ],
    competence: [
      "Integrasi metodologi attachment dalam praktik profesional",
      "Supervisi klinis mandiri"
    ]
  },
  {
    id: "writinglab",
    code: "WRITINGLAB",
    level: "Bootcamp",
    title: "Jiwamu Writing Lab",
    desc: "Kelas untuk mendampingi para pemengaruh, pemerhati, dan profesional kesehatan mental dalam menulis untuk buku dari pengembangan ide hingga naskah siap diterbitkan.",
    price: "Rp 500.000",
    investment: "Rp 500.000",
    rekeningBank: "Bank Mandiri No. Rekening: 1410039881313 An. Yayasan Pusat Psikoanalisis Indonesia",
    duration: "Bootcamp Inkubasi",
    jadwal: [
      { city: "Yogyakarta", hotel: "Creative Space Hub", date: "Juli - Agustus 2026" }
    ],
    materi: [
      "Inkubasi Ide & Premise", "Seni Menulis Reflektif", "Publishing Industry 101"
    ],
    competence: [
      "Pembuatan naskah buku siap terbit",
      "Teknik penulisan populer & ilmiah"
    ]
  }
];

export default function Kelas({ currentHash, setHash, classesList = [], trainersList = [] }: KelasProps) {
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

  const getClassData = (id: string) => {
    const fallback = defaultClasses.find(c => c.id === id);
    if (classesList && classesList.length > 0) {
      const cls = classesList.find(c => c.id === id);
      return cls || fallback;
    }
    return fallback;
  };

  const toggleFaq = (idx: number) => {
    setFaqOpen({ ...faqOpen, [idx]: !faqOpen[idx] });
  };

  const navigateTo = (target: string) => {
    setHash(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const trainers = trainersList && trainersList.length > 0 ? trainersList : [
    { id: "tr-01", nama: "Fakhrun Siraj, CABP", exp: "Berpengalaman 10+ tahun", desc: "Penulis, editor, dan penerjemah dari 75+ buku", foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop" },
    { id: "tr-02", nama: "Cin Hapsari Tomoidjojo, CABP", exp: "Berpengalaman 10+ tahun", desc: "Penulis buku What the Wound Knows", foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop" },
    { id: "tr-03", nama: "Muhammad Syibbli Z., CABP", exp: "Berpengalaman 10+ tahun", desc: "Spesialis nilai hidup dan kelekatan", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop" },
    { id: "tr-04", nama: "Juan Lee (Yen), CABP", exp: "Berpengalaman 10+ tahun", desc: "Spesialis dinamika kelekatan sosial", foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop" }
  ];

  // SUBPAGE: LEVEL 1 - CAF (Attachment Facilitator)
  if (currentHash === "kelas/attachmentfacilitator") {
    const competence = [
      "Memahami kebutuhan terdalam manusia akan rasa aman",
      "Menyelami pola bawah sadar yang membentuk caramu mencintai dan menjalin relasi",
      "Menguasai pendekatan yang tepat: kapan mendengarkan dan kapan memberikan arahan?",
      "Mengurai kekuatan dan tantangan dari setiap gaya attachment",
      "Mengidentifikasi kecenderungan gaya attachment (langsung asesmen di kelas)",
      "Memahami akar konflik, kecemburuan, ketakutan ditinggalkan, dan pola menjauh dalam hubungan",
      "Mendeteksi, mencegah, dan memperbaiki berbagai bentuk masalah dengan pasangan, keluarga, dan pertemanan."
    ];

    const curriculum = [
      "Home Is Where We Start From", "What is Attachment?", "Brief History of Attachment Studies",
      "Attachment and Loss", "Safe Haven dan Secure Base", "Read Before Respond (RBR)",
      "RBR Diagnostic Pathway", "Skill 1: Read Before Respond (RBR)", "Attachment Systems",
      "Attachment Pattern", "Internal Working Models", "Attachment Style", "ECR-R",
      "Skill 2: Measuring", "Attachment Rupture", "Dimensions of Wound", "Attachment Wound Cycle",
      "Window of Tolerance", "Skill 3: 4-Step Window", "Attachment Secure Cycle", "Rupture-Repair",
      "Skill 4: 4-Step Repair", "Secure Repetition Principle"
    ];

    const faqs = [
      { q: "Mengapa Attachment penting untuk dipelajari?", a: "Karena banyak persoalan hidup sebenarnya berakar pada relasi, seperti bagaimana kita mencintai, menghadapi konflik, merasa aman, takut ditinggalkan, atau justru menjauh dari kedekatan. Attachment membantu kita memahami pola-pola tersebut dengan lebih sadar dan manusiawi." },
      { q: "Apakah kelas ini hanya untuk profesional kesehatan mental?", a: "Tidak. CAF dirancang untuk masyarakat umum, orang tua, guru, helper, coach, HR, maupun siapa saja yang ingin memahami manusia dan relasi secara lebih mendalam. Banyak peserta justru datang karena ingin memahami dirinya, pasangan, keluarga, atau pola hubungan yang terus berulang dalam hidupnya." },
      { q: "Bagaimana kelas ini dibawakan?", a: "CAF dirancang sebagai kelas yang aplikatif dan reflektif. Selain memahami teori attachment, kamu juga akan mengikuti asesmen, mempelajari studi kasus, berlatih membaca kebutuhan emosional, dan mempraktikkan berbagai keterampilan dasar attachment coaching." },
      { q: "Setelah mengikuti CAF, apakah saya langsung bisa membuka praktik?", a: "CAF merupakan pelatihan foundational level. Sebagian peserta menggunakan ilmu dan keterampilan di dalamnya untuk kehidupan pribadi, pengasuhan, pekerjaan, komunitas, atau pendampingan dasar. Sementara untuk praktik yang lebih mendalam dan profesional, peserta disarankan melanjutkan ke Level 2 dan Level 3." },
      { q: "Saya takut kelas seperti ini terlalu menghakimi atau membuat saya merasa 'rusak'.", a: "Justru sebaliknya. CAF dirancang sebagai ruang belajar yang membantu peserta memahami bahwa banyak pola relasi manusia terbentuk dari pengalaman hidup dan kebutuhan akan rasa aman. Kami tidak percaya bahwa manusia bisa dipahami hanya dari label semata. Kami percaya manusia lebih dari segala nama." },
      { q: "Apakah saya harus membongkar pengalaman pribadi saya di kelas?", a: "Tidak ada kewajiban untuk membuka pengalaman pribadi secara detail. Peserta tetap memiliki kendali penuh atas batas nyaman masing-masing. Kami menghormati privasi dan ritme setiap individu dalam proses belajar." },
      { q: "Mengapa saya perlu belajar Attachment bersama Jiwamu?", a: "Karena di Jiwamu, kamu tidak hanya mengikuti kelas lalu selesai. Kamu akan masuk ke dalam ekosistem belajar dan komunitas yang terus bertumbuh melalui komunitas alumni, pertemuan nasional, media dan majalah, pengembangan profesional, hingga peluang menjadi penulis, coach, trainer, atau partner Jiwamu." }
    ];

    const classData = getClassData("caf") || {
      title: "Certification in Attachment Facilitator",
      desc: "Dalam pelatihan ini, kamu akan mempelajari dasar-dasar attachment untuk membaca pola relasi, memahami kebutuhan emosional, mengelola konflik, dan merespons orang lain dengan lebih tepat: kapan cukup hadir dan mendengarkan, kapan perlu memberi arahan.",
      investment: "Rp 2.500.000",
      rekeningBank: "Bank Mandiri No. Rekening: 1410039881313 An. Yayasan Pusat Psikoanalisis Indonesia",
      duration: "1 Hari Penuh (9 Jam intensif)",
      jadwal: [
        { city: "Malang", hotel: "Grand Cakra Hotel", date: "Sabtu, 11 Juli 2026" },
        { city: "Jakarta", hotel: "Santika Premier", date: "Sabtu, 11 Juli 2026" },
        { city: "Yogyakarta", hotel: "Melia Purosani", date: "Sabtu, 11 Juli 2026" },
        { city: "Bandung", hotel: "de Braga by ARTOTEL", date: "Sabtu, 11 Juli 2026" }
      ]
    };

    return (
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-16 animate-fade-in">
        {/* Back Link */}
        <button onClick={() => navigateTo("kelas")} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">
          ← Kembali ke Sertifikasi
        </button>
 
        {/* Hero */}
        <div className="space-y-6">
          <span className="bg-blue-50 text-blue-600 text-xxs font-mono font-bold px-3 py-1 rounded-full">Level 1 · CAF</span>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{classData.title}</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
            {classData.desc}
          </p>
          <p className="text-slate-500 text-xs sm:text-sm">
            Program ini cocok untuk kamu yang ingin memahami diri, memperbaiki hubungan, atau mulai mengembangkan keterampilan dasar dalam membantu sesama.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="https://wa.me/6289653881556?text=Hai%20Kak%20Nuy%2C%20saya%20ingin%20gabung%20kelas%20CAF!" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer">
              <Send className="w-3.5 h-3.5" /> Daftar via WhatsApp
            </a>
            <button className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer">
              <Download className="w-3.5 h-3.5" /> Unduh Brosur (PDF)
            </button>
          </div>
        </div>

        {/* Competencies */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-blue-600 mb-6">Standar Kompetensi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competence.map((item, idx) => (
              <div key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Curriculum */}
        <div className="space-y-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-blue-600">Materi Pelajaran</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {curriculum.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-white border border-slate-100 rounded-xl text-xs text-slate-700 font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Investment & Facilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-slate-100 rounded-3xl p-8 space-y-6 bg-white flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xxs font-mono font-bold text-slate-400 uppercase tracking-widest block">INVESTASI PELATIHAN</span>
              <h3 className="font-sans text-3xl font-bold text-slate-900 font-mono">{classData.investment}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Durasi: {classData.duration}. Format padat, aplikatif, langsung dapat diterapkan.
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl text-xxs text-slate-600 space-y-1.5 border border-slate-100">
                <p className="font-semibold text-slate-700">Pembayaran melalui Transfer:</p>
                <p className="text-slate-900 font-medium font-mono whitespace-pre-line">{classData.rekeningBank}</p>
              </div>
            </div>
            <p className="text-xxs text-amber-600 font-semibold">* Hubungi kami untuk penawaran harga kelompok terbaik.</p>
          </div>

          <div className="bg-blue-50/20 border border-blue-50/50 rounded-3xl p-8 space-y-4">
            <span className="text-xxs font-mono font-bold text-blue-600 uppercase tracking-widest block">FASILITAS PESERTA</span>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {[
                "Sebutan Certified Attachment Facilitator (CAF)",
                "Modul dan Starter Kit Eksklusif",
                "Laporan Asesmen Pola Attachment",
                "Buku Attachment Guidebook",
                "Sertifikat Keikutsertaan dari Jiwamu",
                "Sertifikat Keanggotaan Pratama di PANJI",
                "Akses Fellow-Roasting setiap bulan",
                "Konsultasi lanjutan dengan trainer",
                "Mengulang materi CAF gratis di seluruh Indonesia",
                "Diskon 15% untuk setiap buku PUSAKA PANJI"
              ].map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trainers */}
        <div className="space-y-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-blue-600">Staf Pengajar (Trainers)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trainers.map((tr, i) => (
              <div key={i} className="text-center space-y-2">
                <img src={tr.foto} alt={tr.nama} className="w-24 h-24 rounded-full object-cover mx-auto bg-slate-100 shadow-sm" />
                <h4 className="font-sans text-xs sm:text-sm font-bold text-slate-900">{tr.nama}</h4>
                <p className="text-[10px] text-slate-500 font-medium font-mono">{tr.exp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-blue-600">Jadwal Terdekat</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {classData.jadwal && classData.jadwal.map((sc, i) => (
              <div key={i} className="p-4 border border-slate-100 rounded-2xl bg-white space-y-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h4 className="font-sans text-sm font-bold text-slate-900">{sc.city}</h4>
                <p className="text-xxs text-slate-500 leading-tight">{sc.hotel}</p>
                <p className="text-[10px] font-mono font-bold text-blue-600 pt-1">{sc.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-blue-600">Pertanyaan Umum (FAQ)</h2>
          <div className="space-y-2.5 max-w-3xl">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
                <button onClick={() => toggleFaq(i)} className="w-full px-5 py-4 text-left font-sans text-xs sm:text-sm font-semibold text-slate-900 flex justify-between items-center bg-slate-50/50 cursor-pointer">
                  <span>{faq.q}</span>
                  {faqOpen[i] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                <AnimatePresence>
                  {faqOpen[i] && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="px-5 py-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-blue-600 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="font-sans text-xl sm:text-2xl font-bold">Siap memulai karier barumu?</h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto">
            Daftar sekarang dan jadilah Certified Attachment Facilitator (CAF). Mari bertumbuh bersama Jiwamu.
          </p>
          <a href="https://wa.me/6289653881556?text=Hai%20Kak%20Nuy%2C%20saya%20ingin%20gabung%20kelas%20CAF!" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-blue-600 font-bold text-xs px-8 py-3.5 rounded-xl transition-all">
            Daftar Sekarang
          </a>
        </div>
      </div>
    );
  }

  // SUBPAGE: LEVEL 2 - CAC (Attachment Coaching)
  if (currentHash === "kelas/attachmentcoaching") {
    const competence = [
      "Memahami blueprint yang membentuk caramu melihat diri dan orang lain",
      "Mengidentifikasi luka attachment yang memengaruhi pola hubunganmu saat ini",
      "Membaca struktur “lingkaran ketakutan” yang mengaktifkan reaksi otomatis dalam konflik",
      "Mengurai bagaimana siklus tidak aman terbentuk dan mengapa ia terus berulang",
      "Membangun 'lingkaran aman' sebagai pola relasi yang lebih sehat",
      "Menguasai teknik merekonstruksi narasi hidup agar tidak lagi terjebak pada cerita lama",
      "Menerapkan berbagai teknik healing untuk meningkatkan kesadaran dan kepekaan."
    ];

    const curriculum = [
      "Remembering Attachment Systems", "Dimensions of Wound", "Defensive Strategy",
      "IWM: The Meaning of Rupture", "Fear: The Threat of Rupture", "Shame: The Self in Rupture",
      "Self-Fulfilling Prophecy", "Attachment Narrative", "Fundamental Rule", "Mentalization",
      "Healing Journey", "Informed Consent", "Framework and Setting", "Attachment Screen-Replay (ASR)",
      "Hypno-Introspection", "Mirror-Image Technique", "Breaking Narrative Thought",
      "Narrative Defusion", "(M)other Expectation", "Creative-Aggression Technique",
      "Emotional Attunement", "Separation Dialogue", "Instigation Technique"
    ];

    const faqs = [
      { q: "Apa bedanya Attachment Coaching dengan pendekatan coaching lainnya?", a: "Banyak pendekatan coaching berfokus pada perubahan perilaku, target, atau motivasi. Attachment Coaching berangkat dari sesuatu yang lebih mendasar: kebutuhan manusia untuk merasa aman dalam hubungan. Karena sering kali, seseorang sulit berubah bukan karena kurang disiplin, tetapi karena takut ditolak, takut gagal, atau terbiasa hidup dalam pola relasi tertentu sejak lama. Attachment Coaching membantu kita memahami manusia sebelum berusaha memperbaikinya." },
      { q: "Apakah saya harus mengikuti CAF sebelum mengikuti CAC?", a: "Ya. CAC adalah program lanjutan dari CAF. Peserta perlu memiliki fondasi attachment terlebih dahulu agar dapat mengikuti materi healing dengan lebih utuh dan aman." },
      { q: "Apa perbedaan CAF dan CAC?", a: "CAF berfokus pada kemampuan membaca kebutuhan emosional, memahami gaya attachment, dan merespons masalah relasional sehari-hari. CAC masuk lebih dalam pada berbagai kebutuhan batin, luka attachment, narasi hidup, siklus tidak aman, dan teknik pemulihan batin." },
      { q: "Jika saya sudah memiliki latar belakang dalam layanan berbantuan, apakah saya boleh menerapkan materi CAC?", a: "Tentu saja. Program ini dapat memperkaya praktik pendampingan, layanan kesehatan mental, praktis medis, coaching, pendidikan, parenting, maupun pelayanan kemanusiaan sesuai latar belakang dan kewenangan masing-masing peserta." },
      { q: "Apakah CAC berarti saya sudah bisa membuka praktik?", a: "CAC memberikan keterampilan attachment tingkat lanjutan, tetapi belum untuk akses praktik secara komprehensif di ekosistem. Untuk mendapatkannya, peserta dianjurkan untuk melanjutkan hingga Level 3 (CABP)." }
    ];

    const classData = getClassData("cac") || {
      title: "Certification in Attachment Coaching",
      desc: "Kelas ini merupakan pelatihan lanjutan bagi peserta yang telah menyelesaikan Certification in Attachment Facilitator (CAF). Program ini dirancang untuk membantu peserta memahami berbagai kebutuhan attachment di setiap rentang usia, bagaimana luka attachment terbentuk, bagaimana ia hidup dalam cerita diri, dan bagaimana pola tidak aman terus berulang dalam hubungan.",
      investment: "Rp 3.000.000",
      rekeningBank: "Bank Mandiri No. Rekening: 1410039881313 An. Yayasan Pusat Psikoanalisis Indonesia",
      duration: "1 Hari Penuh (9 Jam intensif)",
      jadwal: [
        { city: "Malang", hotel: "Grand Cakra Hotel", date: "Minggu, 12 Juli 2026" },
        { city: "Jakarta", hotel: "Santika Premier", date: "Minggu, 12 Juli 2026" },
        { city: "Yogyakarta", hotel: "Melia Purosani", date: "Minggu, 12 Juli 2026" },
        { city: "Bandung", hotel: "de Braga by ARTOTEL", date: "Minggu, 12 Juli 2026" }
      ]
    };

    return (
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-16 animate-fade-in">
        <button onClick={() => navigateTo("kelas")} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">
          ← Kembali ke Sertifikasi
        </button>

        <div className="space-y-6">
          <span className="bg-blue-50 text-blue-600 text-xxs font-mono font-bold px-3 py-1 rounded-full">Level 2 · CAC</span>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{classData.title}</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
            {classData.desc}
          </p>
          <p className="text-slate-500 text-xs sm:text-sm">
            Kamu akan belajar membaca luka sebagai jejak pengalaman relasional yang menunggu untuk dipahami, diproses, dan ditata ulang dengan lebih aman.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="https://wa.me/6289653881556?text=Hai%20Kak%20Nuy%2C%20saya%20ingin%20gabung%20kelas%20CAC!" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer">
              <Send className="w-3.5 h-3.5" /> Daftar via WhatsApp
            </a>
          </div>
        </div>

        {/* Competencies */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-blue-600 mb-6">Standar Kompetensi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competence.map((item, idx) => (
              <div key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Curriculum */}
        <div className="space-y-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-blue-600">Materi Pelajaran</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {curriculum.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-white border border-slate-100 rounded-xl text-xs text-slate-700 font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Investasi & Facilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-slate-100 rounded-3xl p-8 space-y-6 bg-white flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xxs font-mono font-bold text-slate-400 uppercase tracking-widest block">INVESTASI PELATIHAN</span>
              <h3 className="font-sans text-3xl font-bold text-slate-900 font-mono">{classData.investment}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Durasi: {classData.duration}. Format modular dan praktis untuk pendampingan lanjutan.
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl text-xxs text-slate-600 space-y-1.5 border border-slate-100">
                <p className="font-semibold text-slate-700">Pembayaran melalui Transfer:</p>
                <p className="text-slate-900 font-medium font-mono whitespace-pre-line">{classData.rekeningBank}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/20 border border-blue-50/50 rounded-3xl p-8 space-y-4">
            <span className="text-xxs font-mono font-bold text-blue-600 uppercase tracking-widest block">FASILITAS PESERTA</span>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {[
                "Sebutan Certified Attachment Coach (CAC)",
                "Modul dan Starter Kit Eksklusif",
                "Sertifikat Keikutsertaan dari Jiwamu",
                "Sertifikat Keanggotaan Madya di PANJI",
                "Kesempatan konsultasi lanjutan dengan trainer",
                "Mengulang materi CAC gratis di seluruh Indonesia",
                "Undangan keterlibatan dalam proyek penelitian lapangan",
                "Diskon 30% untuk setiap buku PUSAKA PANJI"
              ].map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-blue-600">Jadwal Terdekat</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {classData.jadwal && classData.jadwal.map((sc, i) => (
              <div key={i} className="p-4 border border-slate-100 rounded-2xl bg-white space-y-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h4 className="font-sans text-sm font-bold text-slate-900">{sc.city}</h4>
                {sc.hotel && <p className="text-xxs text-slate-500 leading-tight">{sc.hotel}</p>}
                <p className="text-[10px] font-mono font-bold text-blue-600 pt-1">{sc.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-blue-600">Pertanyaan Umum (FAQ)</h2>
          <div className="space-y-2.5 max-w-3xl">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
                <button onClick={() => toggleFaq(i)} className="w-full px-5 py-4 text-left font-sans text-xs sm:text-sm font-semibold text-slate-900 flex justify-between items-center bg-slate-50/50 cursor-pointer">
                  <span>{faq.q}</span>
                  {faqOpen[i] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                <AnimatePresence>
                  {faqOpen[i] && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="px-5 py-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // SUBPAGE: LEVEL 3 - CABP (Attachment-Based Practitioner)
  if (currentHash === "kelas/attachmentpractitioner") {
    const classData = getClassData("cabp") || {
      title: "Certification in Attachment-Based Practitioner",
      desc: "Kelas ini adalah level tertinggi dalam jalur sertifikasi Jiwamu. Program ini dirancang bagi peserta yang telah memiliki pemahaman mengenai Attachment Facilitating dan Attachment Coaching, serta ingin mengembangkan kompetensi praktik berbasis attachment dalam berbagai bidang kehidupan.",
      investment: "Rp 13.000.000",
      rekeningBank: "Bank Mandiri No. Rekening: 1410039881313 An. Yayasan Pusat Psikoanalisis Indonesia",
      duration: "3 Bulan (100 Jam Pembelajaran)",
      jadwal: [
        { city: "Yogyakarta", hotel: "Melia Purosani", date: "Sabtu, 22 Agustus 2026" }
      ],
      materi: [
        "Modul 1 – Writing for Publication", "Modul 2 – Attachment and Mental Health",
        "Modul 3 – Attachment and Education", "Modul 4 – Attachment and Workplace",
        "Modul 5 – Attachment and Parenting", "Modul 6 – Attachment and Romantic Relationship",
        "Modul 7 – Attachment and Spirituality", "Modul 8 – Attachment and Money",
        "Modul 9 – Attachment and Social Justice", "Modul 10 – Start Your Practice!"
      ]
    };

    return (
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-16 animate-fade-in">
        <button onClick={() => navigateTo("kelas")} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">
          ← Kembali ke Sertifikasi
        </button>

        <div className="space-y-6">
          <span className="bg-blue-50 text-blue-600 text-xxs font-mono font-bold px-3 py-1 rounded-full">Level 3 · CABP</span>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{classData.title}</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
            {classData.desc}
          </p>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-3xl">
            Lulusan CABP berkesempatan untuk mengembangkan layanan berbasis attachment melalui ekosistem Jiwamu, termasuk membuka profil layanan di jiwamu.com sesuai ketentuan dan standardisasi yang berlaku, serta dukungan penuh untuk publikasi dan pengembangan kompetensi.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="https://wa.me/6289653881556?text=Hai%20Kak%20Nuy%2C%20saya%20ingin%20gabung%20kelas%20CABP!" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer">
              <Send className="w-3.5 h-3.5" /> Daftar via WhatsApp
            </a>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-blue-600">Materi Pelajaran</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {classData.materi && classData.materi.map((m: string, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs sm:text-sm font-mono text-slate-800 font-semibold flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Duration, Investasi & Facilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-6">
            <span className="text-xxs font-mono font-bold text-slate-400 uppercase tracking-widest block">DURASI & INVESTASI</span>
            <div className="space-y-2">
              <p className="text-xs text-slate-500">Durasi:</p>
              <h4 className="font-sans text-lg font-bold text-slate-800">{classData.duration}</h4>
              <p className="text-xs text-slate-500">Format padat, modular, blended learning.</p>
            </div>
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500">Investasi:</p>
              <h3 className="font-sans text-2xl font-bold text-slate-900 font-mono">{classData.investment}</h3>
              <p className="text-[10px] text-slate-400 mt-1 whitespace-pre-line">{classData.rekeningBank}</p>
            </div>
          </div>

          <div className="bg-blue-50/20 border border-blue-50/50 rounded-3xl p-8 space-y-4">
            <span className="text-xxs font-mono font-bold text-blue-600 uppercase tracking-widest block">FASILITAS EXCLUSIVE</span>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {[
                "Sebutan Certified Attachment-Based Practitioner (CABP)",
                "Akses untuk menawarkan layanan konseling di Jiwamu Center",
                "Prospek untuk bergabung dengan Training of Trainers (TOT)",
                "Total 11 Modul dan Starter Kit Eksklusif",
                "Paket Edisi Bahasa Indonesia John Bowlby (4 Buku)",
                "Sertifikat Keikutsertaan dari Jiwamu",
                "Sertifikat Keanggotaan Praktisi di PANJI",
                "Gratis mengulang materi CABP gratis di seluruh Indonesia",
                "Undangan proyek riset lapangan dan publikasi nasional",
                "Diskon 50% untuk setiap buku PUSAKA PANJI"
              ].map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-4 max-w-lg">
          <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-blue-600">Jadwal Terdekat</h3>
          <div className="space-y-3">
            {classData.jadwal && classData.jadwal.map((sc: any, i: number) => (
              <div key={i} className="text-xs text-slate-700 flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <p className="font-black text-slate-900">{sc.city}</p>
                  <p className="text-[10px] text-slate-500">{sc.hotel} — {sc.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // SUBPAGE: CABP Professional Bridging Program
  if (currentHash === "kelas/professionalbridging") {
    const classData = getClassData("professionalbridging") || {
      title: "CABP Professional Bridging Program",
      desc: "Kami mengakui pengalaman profesional Anda. Program ini merupakan jalur khusus untuk psikolog (HIMPSI), psikolog klinis (IPK.ID), dokter (IDI), psikoanalis (API), konselor (IKI), perawat (PPNI), bidan (IBI), kesehatan masyarakat (IAKMI), hipnoterapis (PKHI dan PRAHIPTI), dan coach (ICF). Ini adalah wujud komitmen kami untuk bersinergi bersama.",
      investment: "Rp 15.000.000",
      rekeningBank: "Bank Mandiri No. Rekening: 1410039881313 An. Yayasan Pusat Psikoanalisis Indonesia",
      duration: "3 Bulan (100 Jam) + 6 Jam Matrikulasi"
    };

    const modules = [
      "Matrikulasi 1 – Introduction to Attachment Studies",
      "Matrikulasi 2 – Measuring Attachment Style",
      "Matrikulasi 3 – Attachment Across the Lifespan",
      "Modul 1 – Writing for Publication",
      "Modul 2 – Attachment and Mental Health",
      "Modul 3 – Attachment and Education",
      "Modul 4 – Attachment and Workplace",
      "Modul 5 – Attachment and Parenting",
      "Modul 6 – Attachment and Romantic Relationship",
      "Modul 7 – Attachment and Spirituality",
      "Modul 8 – Attachment and Money",
      "Modul 9 – Attachment and Social Justice",
      "Modul 10 – Start Your Practice!"
    ];

    return (
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-16 animate-fade-in">
        <button onClick={() => navigateTo("kelas")} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">
          ← Kembali ke Sertifikasi
        </button>

        <div className="space-y-6">
          <span className="bg-blue-50 text-blue-600 text-xxs font-mono font-bold px-3 py-1 rounded-full">Jalur Khusus Profesional</span>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{classData.title}</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
            {classData.desc}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="https://wa.me/6289653881556?text=Hai%20Kak%20Nuy%2C%20saya%20ingin%20gabung%20kelas%20CABP%20Professional%20Bridging%20Program!" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer">
              <Send className="w-3.5 h-3.5" /> Daftar via WhatsApp
            </a>
          </div>
        </div>

        {/* Modules & Matrikulasi */}
        <div className="space-y-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-blue-600">Modul & Matrikulasi Tambahan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modules.map((m, idx) => (
              <div key={idx} className={`p-4 rounded-xl text-xs font-mono font-semibold flex items-center gap-3 ${
                m.includes("Matrikulasi") ? "bg-amber-50 text-amber-800 border border-amber-100" : "bg-slate-50 text-slate-800 border border-slate-100"
              }`}>
                <span className={`w-2 h-2 rounded-full ${m.includes("Matrikulasi") ? "bg-amber-500" : "bg-blue-500"}`}></span>
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Duration & Investasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-6">
            <span className="text-xxs font-mono font-bold text-slate-400 uppercase tracking-widest block">DURASI & INVESTASI</span>
            <div className="space-y-2">
              <h4 className="font-sans text-lg font-bold text-slate-800">{classData.duration}</h4>
              <p className="text-xs text-slate-500">Sistem Blended Learning gabungan online dan offline.</p>
            </div>
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500 font-semibold text-slate-400 uppercase">INVESTASI PROFESSIONAL</p>
              <h3 className="font-sans text-2xl font-bold text-slate-900 font-mono">{classData.investment}</h3>
              <p className="text-[10px] text-slate-400 mt-1 whitespace-pre-line">{classData.rekeningBank}</p>
            </div>
          </div>

          <div className="bg-blue-50/20 border border-blue-50/50 rounded-3xl p-8 space-y-4">
            <span className="text-xxs font-mono font-bold text-blue-600 uppercase tracking-widest block">FASILITAS TAMBAHAN</span>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {[
                "Sebutan Certified Attachment-Based Practitioner (CABP)",
                "Akses menawarkan layanan dan publikasi di ekosistem Jiwamu",
                "Total 13 Modul Kurikulum Lengkap + Starter Kit",
                "Paket Buku John Bowlby Bahasa Indonesia",
                "Mengulang materi gratis di seluruh Indonesia"
              ].map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // SUBPAGE: Jiwamu Writing Lab
  if (currentHash === "kelas/writinglab") {
    const classData = getClassData("writinglab") || {
      title: "Jiwamu Writing Lab",
      desc: "Ini adalah kelas inkubasi menulis bagi pemengaruh, pemerhati, pendidik, dan profesional kesehatan mental yang ingin mengembangkan gagasan menjadi naskah buku. Peserta akan didampingi mulai dari pengembangan ide, penyusunan konsep, penulisan awal, hingga menuju naskah yang siap diterbitkan.",
      investment: "Rp 500.000",
      rekeningBank: "Bank Mandiri No. Rekening: 1410039881313 An. Yayasan Pusat Psikoanalisis Indonesia",
      duration: "Bootcamp Inkubasi"
    };

    const sessions = [
      { t: "Sesi 1 — Membaca Dunia Buku", d: "Membahas dunia perbukuan di Indonesia, mitos tentang bakat menulis, mengapa menulis penting bagi profesional dan pemengaruh, serta berkenalan dengan anatomi buku." },
      { t: "Sesi 2 — Tahapan Menulis", d: "Membahas proses menulis dari awal hingga siap dikembangkan menemukan ide, pratulis, menulis draf, merevisi, dan swasunting." },
      { t: "Sesi 3 — Strategi Pengembangan Naskah", d: "Membahas teknik pengembangan naskah, termasuk teknik FREE, transkripsi, pengembangan bahan mentah, serta batas sehat penggunaan AI dalam proses penulisan." },
      { t: "Sesi 4 — Inkubasi Naskah", d: "Peserta mulai menyiapkan arah naskah masing-masing dan menyusun rencana penulisan untuk proses inkubasi lanjutan." }
    ];

    return (
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-16 animate-fade-in">
        <button onClick={() => navigateTo("kelas")} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">
          ← Kembali ke Sertifikasi
        </button>

        <div className="space-y-6">
          <span className="bg-blue-50 text-blue-600 text-xxs font-mono font-bold px-3 py-1 rounded-full">Bootcamp</span>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{classData.title}</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
            {classData.desc}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="https://wa.me/6289653881556?text=Hai%20Kak%20Nuy%2C%20saya%20ingin%20gabung%20kelas%20Jiwamu%20Writing%20Lab!" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer">
              <Send className="w-3.5 h-3.5" /> Daftar via WhatsApp
            </a>
          </div>
        </div>

        {/* Sessions */}
        <div className="space-y-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-blue-600">Tahapan Kelas Inkubasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sessions.map((ses, idx) => (
              <div key={idx} className="p-6 border border-slate-100 bg-white rounded-2xl space-y-3 shadow-sm">
                <span className="text-[10px] font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-semibold">SESI {idx+1}</span>
                <h4 className="font-sans text-sm font-bold text-slate-900">{ses.t}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{ses.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Duration & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-4">
            <span className="text-xxs font-mono font-bold text-slate-400 uppercase tracking-widest block">DURASI & REGISTRASI</span>
            <p className="text-xs text-slate-600">
              <strong>Durasi:</strong> {classData.duration}. Setelah sesi selesai, peserta tetap didampingi dan difasilitasi dalam inkubasi lanjutan hingga naskah siap terbit.
            </p>
            <div className="pt-2 border-t border-slate-100 mt-4">
              <span className="text-xxs font-semibold text-slate-400 block uppercase mb-1">REGISTRASI</span>
              <h3 className="font-sans text-2xl font-bold text-slate-900 font-mono">{classData.investment}</h3>
              <p className="text-[10px] text-slate-400 mt-1 whitespace-pre-line">{classData.rekeningBank}</p>
            </div>
          </div>

          <div className="bg-blue-50/20 border border-blue-50/50 rounded-3xl p-8 space-y-4">
            <span className="text-xxs font-mono font-bold text-blue-600 uppercase tracking-widest block">FASILITAS PESERTA</span>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {[
                "E-Sertifikat Keikutsertaan resmi dari Jiwamu",
                "Sertifikat publikasi setelah buku berhasil diterbitkan",
                "Kesempatan menerbitkan buku melalui Penerbit Jiwamu",
                "Pendampingan pengembangan gagasan hingga naskah utuh",
                "Peluang menjadi kontributor di Majalah Jiwamu bulanan",
                "Sesi umpan balik (feedback) naskah langsung dari trainer"
              ].map((item, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // MAIN CERTIFICATION LANDING PAGE
  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero */}
      <section className="bg-[#FDF4FF] border-b-4 border-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-2 inline-block">
            Sertifikasi & Pelatihan
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Mulai dan kembangkan kariermu <br />
            untuk <span className="underline decoration-wavy decoration-[#8B5CF6]">memahami diri</span> dan membantu sesama.
          </h1>
          <p className="text-slate-800 font-bold text-xs sm:text-sm max-w-2xl leading-relaxed">
            Jiwamu menghadirkan program sertifikasi attachment yang dirancang khusus untuk masyarakat umum, helper, konselor, profesional, maupun siapa saja yang ingin bertumbuh bersama.
          </p>
        </div>
      </section>

      {/* Certification Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-black bg-[#FF71CF] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-2 inline-block">Certification Pathways</span>
          <h2 className="font-sans text-xl sm:text-2xl font-extrabold text-slate-900">Jalur Sertifikasi Bertingkat</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              level: "Level 1",
              code: "CAF",
              title: "Certification in Attachment Facilitator",
              desc: "Pelajari keahlian untuk membaca kebutuhan dasar seseorang “apakah didengarkan atau diarahkan?”, memahami kecenderungan gaya kelekatan, mengelola emosi dalam hubungan, dan menyelesaikan berbagai masalah dalam kehidupan sehari-hari.",
              hash: "kelas/attachmentfacilitator",
              price: "Rp 2.500.000"
            },
            {
              level: "Level 2",
              code: "CAC",
              title: "Certification in Attachment Coaching",
              desc: "Pelajari keahlian untuk menguraikan “cerita hidup” seseorang, memproses luka kelekatan, dan menerapkan berbagai pendekatan untuk pemulihan batin di setiap rentang kehidupan.",
              hash: "kelas/attachmentcoaching",
              price: "Rp 3.000.000"
            },
            {
              level: "Level 3",
              code: "CABP",
              title: "Certification in Attachment-Based Practitioner",
              desc: "Pelajari keahlian lanjutan untuk memahami dinamika kelekatan dalam berbagai rentang usia dan terapkan untuk pengasuhan, percintaan, pendidikan, industri dan organisasi, spiritual, dan keadilan sosial.",
              hash: "kelas/attachmentpractitioner",
              price: "Rp 13.000.000"
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border-2 border-black flex flex-col justify-between h-full brutal-shadow hover:translate-y-[-2px] transition-all">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-black font-mono">
                  <span className="text-[#8B5CF6] font-bold">{item.level}</span>
                  <span className="bg-[#FF71CF] text-black border border-black font-black px-2.5 py-0.5 rounded-md shadow-sm">{item.code}</span>
                </div>
                <h3 className="font-sans text-base sm:text-lg font-extrabold text-slate-900 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{item.desc}</p>
              </div>
              <div className="border-t-2 border-black pt-6 mt-8 flex justify-between items-center">
                <span className="font-mono text-xs font-black text-slate-900">{item.price}</span>
                <button
                  id={`btn-${item.code.toLowerCase()}-detail`}
                  onClick={() => navigateTo(item.hash)}
                  className="text-xs font-black text-[#8B5CF6] hover:text-[#FF71CF] cursor-pointer bg-white border border-black px-3 py-1.5 rounded-lg shadow-sm hover:shadow-none transition-all"
                >
                  Detail Pelatihan →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Path & Writing Lab */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Bridging program */}
        <div className="bg-[#8B5CF6] text-white p-8 sm:p-10 rounded-3xl border-4 border-black flex flex-col justify-between relative overflow-hidden brutal-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full filter blur-2xl"></div>
          <div className="space-y-4 relative z-10">
            <span className="bg-[#FFD600] text-black text-xxs font-mono font-black px-2.5 py-1 rounded-full border border-black shadow-sm">BRIDGING PATH</span>
            <h3 className="font-sans text-lg sm:text-xl font-extrabold text-white">CABP Professional Bridging Program</h3>
            <p className="text-xs text-purple-100 leading-relaxed font-semibold">
              Program jalur khusus untuk psikolog (HIMPSI), psikolog klinis (IPK.ID), dokter (IDI), psikoanalis (API), konselor (IKI), perawat (PPNI), bidan (IBI), kesehatan masyarakat (IAKMI), hipnoterapis (PKHI dan PRAHIPTI), dan coach (ICF).
            </p>
          </div>
          <div className="border-t-2 border-black pt-6 mt-8 flex justify-between items-center relative z-10">
            <span className="font-mono text-xs font-black text-white">Rp 15.000.000</span>
            <button
              id="btn-bridging-detail"
              onClick={() => navigateTo("kelas/professionalbridging")}
              className="bg-white hover:bg-[#FF71CF] hover:text-black text-black text-xs font-black px-4.5 py-2.5 rounded-xl transition-all cursor-pointer border-2 border-black shadow-sm active:translate-y-0.5 active:shadow-none"
            >
              Lihat Program
            </button>
          </div>
        </div>

        {/* Writing Lab */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-black flex flex-col justify-between brutal-shadow">
          <div className="space-y-4">
            <span className="bg-[#FF71CF] text-black text-xxs font-mono font-black px-2.5 py-1 rounded-full border border-black shadow-sm">BOOTCAMP INKUBASI</span>
            <h3 className="font-sans text-lg sm:text-xl font-extrabold text-slate-900">Jiwamu Writing Lab</h3>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Kelas untuk mendampingi para pemengaruh, pemerhati, dan profesional kesehatan mental dalam menulis untuk buku dari pengembangan ide hingga naskah siap diterbitkan.
            </p>
          </div>
          <div className="border-t-2 border-black pt-6 mt-8 flex justify-between items-center">
            <span className="font-mono text-xs font-black text-slate-900">Rp 500.000</span>
            <button
              id="btn-writinglab-detail"
              onClick={() => navigateTo("kelas/writinglab")}
              className="bg-[#8B5CF6] text-white border-2 border-black text-xs font-black px-4.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none"
            >
              Lihat Kelas
            </button>
          </div>
        </div>

      </section>

      {/* Community / Alumni banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-2 border-black rounded-3xl p-8 sm:p-12 bg-[#FDF4FF] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 brutal-shadow">
          <div className="space-y-3 max-w-xl">
            <h3 className="font-sans text-lg sm:text-xl font-extrabold text-slate-900">
              Temukan daftar alumni kami
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Bergabunglah dengan ekosistem belajar dan komunitas yang terus bertumbuh melalui komunitas alumni, pertemuan nasional, media dan majalah, pengembangan profesional, hingga peluang menjadi penulis, coach, trainer, atau partner Jiwamu.
            </p>
          </div>
          <button
            id="btn-alumni-redirect"
            onClick={() => navigateTo("alumni")}
            className="inline-flex items-center gap-1.5 bg-[#FFD600] text-black border-2 border-black font-black text-xs px-6 py-3.5 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer active:translate-y-0.5 active:shadow-none"
          >
            Lihat Alumni →
          </button>
        </div>
      </section>

    </div>
  );
}
