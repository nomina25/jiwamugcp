import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Kelas from "./components/Kelas";
import Layanan from "./components/Layanan";
import BukuComponent from "./components/Buku";
import Majalah from "./components/Majalah";
import TentangKami from "./components/TentangKami";
import ProyekComponent from "./components/Proyek";
import Alumni from "./components/Alumni";
import TesKelekatan from "./components/TesKelekatan";
import Admin from "./components/Admin";

import { Buku, Proyek, Artikel, VideoItem, MajalahEdisi, UnduhanItem, Trainer, Pendamping, Alumni as AlumniType } from "./types";
import { initialAlumniList } from "./data/alumni";
import { initialBukuList } from "./data/buku";
import { initialProyekList } from "./data/proyek";
import { initialArtikelList, initialVideoList, initialUnduhanList } from "./data/sumberDaya";
import { initialPendampingList } from "./data/layanan";
import { db } from "./firebase";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import { Play, X } from "lucide-react";
import { getUnsplashDirectUrl, handleImageError } from "./utils/image";

// Magazines static list
const initialMajalahList: MajalahEdisi[] = [
  {
    id: "Ed. 22-2026",
    nomor: "Edisi 22",
    bulanTahun: "Juni 2026",
    tema: "Membongkar Topeng 'Si Baik-Baik Saja'",
    deskripsi: "Mengupas bagaimana kebudayaan ketimuran membentuk pola represi emosional sejak dini, dan cara melatih kepekaan asertif untuk menyatakan kebutuhan emosional kita tanpa takut dianggap lemah atau cengeng.",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "Ed. 21-2026",
    nomor: "Edisi 21",
    bulanTahun: "Mei 2026",
    tema: "Rupture-Repair dalam Pertemanan",
    deskripsi: "Kenapa konflik kecil bisa membuat kita menjauh dari sahabat dekat? Meninjau keretakan hubungan relasional dari sudut pandang teori kelekatan, serta formula praktis mereparasi rasa aman yang sempat pudar.",
    cover: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=600&auto=format&fit=crop",
    pdfUrl: "#"
  },
  {
    id: "Ed. 20-2026",
    nomor: "Edisi 20",
    bulanTahun: "April 2026",
    tema: "Dekolonisasi Batin Nusantara",
    deskripsi: "Eksplorasi panjang tim peneliti PANJI mengenai cara masyarakat Indonesia merawat kewarasan jiwanya secara komunal lewat laku tirakat, kidung penyembuhan, dan kearifan gotong royong sebelum maraknya terapi modern.",
    cover: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=600&auto=format&fit=crop",
    pdfUrl: "#"
  }
];

// Classes Default List
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

export default function App() {
  const [currentHash, setCurrentHash] = useState("");
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  // Lifted dynamic states synced to Cloud Firebase Firestore
  const [bukuList, setBukuList] = useState<Buku[]>([]);
  const [proyekList, setProyekList] = useState<Proyek[]>([]);
  const [artikelList, setArtikelList] = useState<Artikel[]>([]);
  const [videoList, setVideoList] = useState<VideoItem[]>([]);
  const [majalahList, setMajalahList] = useState<MajalahEdisi[]>([]);
  const [unduhanList, setUnduhanList] = useState<UnduhanItem[]>([]);
  const [trainersList, setTrainersList] = useState<Trainer[]>([]);
  const [pamongList, setPamongList] = useState<Pendamping[]>([]);
  const [classesList, setClassesList] = useState<any[]>([]);
  const [alumniList, setAlumniList] = useState<AlumniType[]>([]);
  const [layananSettings, setLayananSettings] = useState<any>(null);
  const [tentangKamiSettings, setTentangKamiSettings] = useState<any>(null);

  // Synchronize Firestore Database with real-time listeners and self-healing seeds
  useEffect(() => {
    // 1. Articles Sync
    const unsubArticles = onSnapshot(collection(db, "articles"), (snap) => {
      if (snap.empty) {
        initialArtikelList.forEach(item => {
          setDoc(doc(db, "articles", item.id), item);
        });
      } else {
        const list = snap.docs.map(d => d.data() as Artikel);
        setArtikelList(list);
      }
    });

    // 2. Videos Sync
    const unsubVideos = onSnapshot(collection(db, "videos"), (snap) => {
      if (snap.empty) {
        initialVideoList.forEach(item => {
          setDoc(doc(db, "videos", item.id), item);
        });
      } else {
        const list = snap.docs.map(d => d.data() as VideoItem);
        setVideoList(list);
      }
    });

    // 3. Books Sync
    const unsubBooks = onSnapshot(collection(db, "books"), (snap) => {
      if (snap.empty) {
        initialBukuList.forEach(item => {
          setDoc(doc(db, "books", item.slug), item);
        });
      } else {
        const list = snap.docs.map(d => d.data() as Buku);
        setBukuList(list);
      }
    });

    // 4. Magazines Sync
    const unsubMagazines = onSnapshot(collection(db, "magazines"), (snap) => {
      if (snap.empty) {
        initialMajalahList.forEach(item => {
          setDoc(doc(db, "magazines", item.id), item);
        });
      } else {
        const list = snap.docs.map(d => d.data() as MajalahEdisi);
        setMajalahList(list);
      }
    });

    // 5. Projects Sync
    const unsubProjects = onSnapshot(collection(db, "projects"), (snap) => {
      if (snap.empty) {
        initialProyekList.forEach(item => {
          setDoc(doc(db, "projects", item.id), item);
        });
      } else {
        const list = snap.docs.map(d => d.data() as Proyek);
        setProyekList(list);
      }
    });

    // 6. Downloads Sync
    const unsubDownloads = onSnapshot(collection(db, "downloads"), (snap) => {
      if (snap.empty) {
        initialUnduhanList.forEach(item => {
          setDoc(doc(db, "downloads", item.id), item);
        });
      } else {
        const list = snap.docs.map(d => d.data() as UnduhanItem);
        setUnduhanList(list);
      }
    });

    // 7. Trainers Sync
    const defaultTrainers: Trainer[] = [
      { id: "tr-01", nama: "Fakhrun Siraj, CABP", gelar: "CABP", pengalaman: "Berpengalaman 10+ tahun", foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop" },
      { id: "tr-02", nama: "Cin Hapsari Tomoidjojo, CABP", gelar: "CABP", pengalaman: "Berpengalaman 10+ tahun", foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop" },
      { id: "tr-03", nama: "Muhammad Syibbli Z., CABP", gelar: "CABP", pengalaman: "Berpengalaman 10+ tahun", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop" },
      { id: "tr-04", nama: "Juan Lee (Yen), CABP", gelar: "CABP", pengalaman: "Berpengalaman 10+ tahun", foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop" }
    ];
    const unsubTrainers = onSnapshot(collection(db, "trainers"), (snap) => {
      if (snap.empty) {
        defaultTrainers.forEach(item => {
          setDoc(doc(db, "trainers", item.id || `tr-${Date.now()}`), item);
        });
      } else {
        const list = snap.docs.map(d => d.data() as Trainer);
        setTrainersList(list);
      }
    });

    // 8. Pamong Sync
    const unsubPamong = onSnapshot(collection(db, "pamong"), (snap) => {
      if (snap.empty) {
        initialPendampingList.forEach((item, idx) => {
          const id = `pmg-${100 + idx}`;
          setDoc(doc(db, "pamong", id), { ...item, id });
        });
      } else {
        const list = snap.docs.map(d => d.data() as Pendamping);
        setPamongList(list);
      }
    });

    // 9. Classes Sync
    const unsubClasses = onSnapshot(collection(db, "classes"), (snap) => {
      if (snap.empty) {
        defaultClasses.forEach(item => {
          setDoc(doc(db, "classes", item.id), item);
        });
      } else {
        const list = snap.docs.map(d => d.data());
        setClassesList(list);
      }
    });

    // 10. Alumni Sync
    const unsubAlumni = onSnapshot(collection(db, "alumni"), (snap) => {
      if (snap.empty) {
        initialAlumniList.forEach(item => {
          setDoc(doc(db, "alumni", item.nia), item);
        });
      } else {
        const list = snap.docs.map(d => d.data() as AlumniType);
        setAlumniList(list);
      }
    });

    // 11. Layanan Settings Sync
    const unsubLayananSettings = onSnapshot(doc(db, "settings", "layanan"), (snapshot) => {
      if (snapshot.exists()) {
        setLayananSettings(snapshot.data());
      } else {
        setLayananSettings(null);
      }
    });

    // 12. Tentang Kami Settings Sync
    const unsubTentangKamiSettings = onSnapshot(doc(db, "settings", "tentang_kami"), (snapshot) => {
      if (snapshot.exists()) {
        setTentangKamiSettings(snapshot.data());
      } else {
        setTentangKamiSettings(null);
      }
    });

    return () => {
      unsubArticles();
      unsubVideos();
      unsubBooks();
      unsubMagazines();
      unsubProjects();
      unsubDownloads();
      unsubTrainers();
      unsubPamong();
      unsubClasses();
      unsubAlumni();
      unsubLayananSettings();
      unsubTentangKamiSettings();
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      // Parse the hash string (remove leading '#')
      const hash = window.location.hash.substring(1);
      setCurrentHash(hash);
      if (hash !== "artikel") {
        setActiveArticleId(null);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Initialize on first render
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const setHash = (newHash: string) => {
    window.location.hash = newHash;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-800">
      
      {/* HEADER SECTION */}
      <Header currentHash={currentHash} setHash={setHash} />

      {/* DYNAMIC CONTENT ROUTER */}
      <main className="flex-1">
        {currentHash === "" && (
          <Home 
            setHash={setHash} 
            artikelList={artikelList} 
            videoList={videoList} 
            onViewArticle={(id) => {
              setActiveArticleId(id);
              setHash("artikel");
            }}
          />
        )}

        {currentHash.startsWith("kelas") && (
          <Kelas currentHash={currentHash} setHash={setHash} classesList={classesList} trainersList={trainersList} />
        )}

        {currentHash === "layanan" && (
          <Layanan pamongList={pamongList} settings={layananSettings} />
        )}

        {currentHash.startsWith("buku") && (
          <BukuComponent 
            bukuList={bukuList} 
            currentHash={currentHash} 
            setHash={setHash} 
          />
        )}

        {currentHash.startsWith("majalah") && (
          <Majalah 
            majalahList={majalahList} 
            currentHash={currentHash} 
            setHash={setHash} 
          />
        )}

        {currentHash === "tentangkami" && (
          <TentangKami setHash={setHash} settings={tentangKamiSettings} />
        )}

        {currentHash === "proyek" && (
          <ProyekComponent 
            proyekList={proyekList} 
            setProyekList={setProyekList} 
          />
        )}

        {currentHash === "alumni" && (
          <Alumni alumniList={alumniList} />
        )}

        {currentHash === "tes-kelekatan" && (
          <TesKelekatan />
        )}

        {currentHash === "admin" && (
          <Admin 
            bukuList={bukuList}
            setBukuList={setBukuList}
            proyekList={proyekList}
            setProyekList={setProyekList}
            artikelList={artikelList}
            setArtikelList={setArtikelList}
            videoList={videoList}
            setVideoList={setVideoList}
            majalahList={majalahList}
            setMajalahList={setMajalahList}
            unduhanList={unduhanList}
            setUnduhanList={setUnduhanList}
            trainersList={trainersList}
            setTrainersList={setTrainersList}
            pamongList={pamongList}
            setPamongList={setPamongList}
            classesList={classesList}
            setClassesList={setClassesList}
            alumniList={alumniList}
            setAlumniList={setAlumniList}
            layananSettings={layananSettings}
            tentangKamiSettings={tentangKamiSettings}
          />
        )}

        {/* ARTICLES LISTING PAGE */}
        {currentHash === "artikel" && (
          <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-12 animate-fade-in">
            {activeArticleId ? (
              (() => {
                const selectedArt = artikelList.find(a => a.id === activeArticleId);
                if (!selectedArt) {
                  return (
                    <div className="text-center py-12 bg-white rounded-3xl border-2 border-black brutal-shadow animate-fade-in">
                      <p className="text-sm font-bold text-slate-800">Artikel tidak ditemukan.</p>
                      <button 
                        onClick={() => setActiveArticleId(null)}
                        className="mt-4 inline-flex items-center gap-2 bg-[#FFD600] text-black text-xs font-black px-4 py-2 rounded-xl border-2 border-black brutal-shadow-sm transition-all"
                      >
                        Kembali ke Katalog
                      </button>
                    </div>
                  );
                }
                return (
                  <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
                    {/* Back Button */}
                    <div>
                      <button 
                        onClick={() => setActiveArticleId(null)}
                        className="inline-flex items-center gap-2 bg-white hover:bg-[#FFD600] text-black text-xs font-black px-4 py-2.5 rounded-xl border-2 border-black brutal-shadow-sm transition-all cursor-pointer active:translate-y-0.5 active:shadow-none"
                      >
                        ← Kembali ke Katalog Artikel
                      </button>
                    </div>

                    {/* Category & Read Time */}
                    <div className="flex flex-wrap gap-3 items-center text-xs">
                      <span className="bg-[#FFD600] text-black px-3 py-1 rounded-full border-2 border-black font-black uppercase text-[10px] tracking-wider shadow-sm">
                        {selectedArt.kategori}
                      </span>
                      <span className="text-slate-500 font-bold font-mono">
                        {selectedArt.bacaMilik}
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight pt-2">
                      {selectedArt.judul}
                    </h1>

                    {/* Author Profile Card */}
                    <div className="flex gap-4 items-center bg-white border-2 border-black rounded-2xl p-4 w-fit brutal-shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-[#BFDBFE] border border-black flex items-center justify-center font-black text-xs text-black">
                        {selectedArt.penulis.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-950">Ditulis oleh {selectedArt.penulis}</p>
                        <p className="text-[10px] font-mono text-slate-500 font-bold">{selectedArt.tanggal}</p>
                      </div>
                    </div>

                    {/* Cover Image */}
                    {selectedArt.imageUrl && (
                      <div className="w-full aspect-[16/10] sm:aspect-video md:aspect-[16/9] max-h-[480px] overflow-hidden rounded-3xl border-4 border-black brutal-shadow my-6 bg-slate-50">
                        <img 
                          src={getUnsplashDirectUrl(selectedArt.imageUrl)} 
                          alt={selectedArt.judul} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageError(e, selectedArt.judul)}
                        />
                      </div>
                    )}

                    {/* Article Body */}
                    <div className="prose max-w-3xl mx-auto font-sans text-sm sm:text-base text-slate-800 leading-relaxed space-y-6 pt-4">
                      {selectedArt.konten.split("\n").map((para, i) => {
                        const trimmed = para.trim();
                        if (!trimmed) return null;
                        
                        // Styled blockquote for quotes or highlights
                        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
                          return (
                            <blockquote key={i} className="pl-5 border-l-4 border-[#8B5CF6] italic font-serif text-slate-700 text-lg my-6 bg-[#FDF4FF] py-3 pr-4 rounded-r-xl">
                              {trimmed}
                            </blockquote>
                          );
                        }
                        
                        return (
                          <p key={i} className="font-semibold text-slate-800">
                            {trimmed}
                          </p>
                        );
                      })}
                    </div>

                    {/* Engagement / CTA Block */}
                    <div className="max-w-3xl mx-auto border-t-2 border-black pt-8 mt-12">
                      <div className="bg-[#D9F99D] border-4 border-black rounded-3xl p-6 sm:p-8 brutal-shadow flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="space-y-2 text-left">
                          <h3 className="font-sans text-lg font-black text-black">Apakah artikel ini membantumu?</h3>
                          <p className="text-xs text-slate-800 font-bold max-w-md">Terhubung bersama kami di WhatsApp untuk berdiskusi seputar kesehatan mental, relasi, dan dekolonisasi batin secara mendalam.</p>
                        </div>
                        <a 
                          href={`https://wa.me/6289653881556?text=Hai%20Jiwamu%2C%20saya%20baru%20saja%20membaca%20artikel%20"${encodeURIComponent(selectedArt.judul)}"%20dan%20tertarik%20berdiskusi!`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-[#8B5CF6] text-white border-2 border-black font-black text-xs px-6 py-3 rounded-xl hover:bg-[#FF71CF] hover:text-black transition-all cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none shrink-0"
                        >
                          Diskusi via WhatsApp
                        </a>
                      </div>
                    </div>

                    {/* Bottom Back Button */}
                    <div className="flex justify-center pt-8">
                      <button 
                        onClick={() => {
                          setActiveArticleId(null);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="inline-flex items-center gap-2 bg-[#FFD600] hover:bg-[#8B5CF6] hover:text-white text-black text-xs font-black px-6 py-3 rounded-xl border-2 border-black brutal-shadow transition-all cursor-pointer active:translate-y-0.5"
                      >
                        ← Kembali ke Daftar Artikel
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <>
                <div className="space-y-3">
                  <span className="text-xxs font-mono uppercase tracking-widest text-[#8B5CF6] font-black bg-[#FFD600] border-2 border-black px-3 py-1 rounded-full w-fit shadow-sm block">
                    Artikel & Edukasi
                  </span>
                  <h1 className="font-sans text-3xl font-black text-slate-900 tracking-tight">Katalog Artikel Jiwamu</h1>
                  <p className="text-xs sm:text-sm text-slate-700 font-bold max-w-xl">Ulasan populer dan teoretis seputar kesehatan mental, gaya attachment, relasi, dan dekolonisasi kejiwaan Indonesia.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                  {artikelList.map((art) => (
                    <div key={art.id} className="bg-white border-2 border-black rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all flex flex-col justify-between brutal-shadow animate-fade-in">
                      <div>
                        {art.imageUrl && (
                          <div className="aspect-video w-full overflow-hidden bg-slate-100 border-b-2 border-black">
                            <img 
                              src={getUnsplashDirectUrl(art.imageUrl)} 
                              alt={art.judul} 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer" 
                              onError={(e) => handleImageError(e, art.judul)}
                            />
                          </div>
                        )}
                        <div className="p-6 space-y-3">
                          <div className="flex justify-between items-center text-[10px] font-mono font-black text-slate-400">
                            <span className="bg-[#D9F99D] text-black border-2 border-black px-2.5 py-1 rounded-md text-[9px] font-black shadow-sm">{art.kategori}</span>
                            <span>{art.bacaMilik}</span>
                          </div>
                          <h3 className="font-sans font-black text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">{art.judul}</h3>
                          <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3 font-semibold">{art.ringkasan}</p>
                        </div>
                      </div>
                      
                      <div className="px-6 pb-6 pt-4 border-t-2 border-black flex justify-between items-center bg-slate-50">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-black text-slate-800 block">{art.penulis}</span>
                          <span className="text-[9px] text-slate-400 block font-mono font-bold">{art.tanggal}</span>
                        </div>
                        <button 
                          onClick={() => {
                            setActiveArticleId(art.id);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="text-xxs font-black text-blue-600 hover:underline cursor-pointer"
                        >
                          Baca Lengkap
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* VIDEOS LISTING PAGE WITH EMBED SUPPORT */}
        {currentHash === "video" && <VideoListingPage videoList={videoList} />}

        {/* DOWNLOADS LISTING PAGE */}
        {currentHash === "unduhan" && (
          <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-12 animate-fade-in">
            <div className="space-y-3">
              <span className="text-xxs font-mono uppercase tracking-widest text-blue-600 font-bold block">Pusat Unduhan</span>
              <h1 className="font-sans text-3xl font-bold text-slate-900 tracking-tight">Materi & Lembar Kerja Mandiri</h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl font-sans">Unduh panduan awal, kurikulum lengkap, maupun lembar pemetaan batin mandiri secara cuma-cuma.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {unduhanList.map((dl) => (
                <div key={dl.id} className="bg-white border-2 border-black rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-all brutal-shadow">
                  <div>
                    {dl.imageUrl && (
                      <div className="aspect-video w-full overflow-hidden bg-slate-100 border-b-2 border-black">
                        <img src={dl.imageUrl} alt={dl.judul} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-50 text-blue-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded">{dl.format}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-bold">{dl.ukuran}</span>
                      </div>
                      <h3 className="font-sans font-bold text-sm text-slate-900 leading-snug">{dl.judul}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{dl.deskripsi}</p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => alert(`Mengunduh berkas "${dl.judul}" (${dl.format} - ${dl.ukuran})`)}
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 rounded-xl transition-all cursor-pointer"
                    >
                      Unduh Berkas
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER SECTION */}
      <Footer setHash={setHash} />

    </div>
  );
}

function getYouTubeEmbedUrl(url: string): string {
  if (!url) return "";
  let videoId = "";
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  } else if (url.includes("youtube.com/watch")) {
    const params = new URLSearchParams(url.split("?")[1]);
    videoId = params.get("v") || "";
  } else if (url.includes("youtube.com/embed/")) {
    videoId = url.split("youtube.com/embed/")[1]?.split("?")[0];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

function VideoListingPage({ videoList }: { videoList: VideoItem[] }) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-12 animate-fade-in">
      <div className="space-y-3">
        <span className="text-xxs font-mono uppercase tracking-widest text-blue-600 font-bold block">Video Edukasi</span>
        <h1 className="font-sans text-3xl font-bold text-slate-900 tracking-tight">Jiwamu Talks YouTube</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl">Dokumentasi diskusi panel, ulasan literatur, dan bimbingan relasional visual dari para praktisi senior kami.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {videoList.map((vid) => (
          <div key={vid.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="group cursor-pointer" onClick={() => setActiveVideo(vid)}>
              <div className="aspect-video relative overflow-hidden bg-slate-900 flex items-center justify-center">
                <img src={vid.thumbnail} alt={vid.judul} className="w-full h-full object-cover opacity-80 transition-all group-hover:scale-105 group-hover:opacity-70" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:bg-blue-700 transition-all scale-95 group-hover:scale-105">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/75 px-2 py-0.5 text-xxs font-mono text-white rounded font-semibold">
                  {vid.durasi}
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-sans font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2">{vid.judul}</h3>
                <p className="text-xxs text-slate-500 leading-relaxed line-clamp-3">{vid.deskripsi}</p>
              </div>
            </div>
            <div className="px-5 pb-5 pt-2 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-400">YouTube Talks</span>
              <button 
                onClick={() => setActiveVideo(vid)}
                className="text-xxs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Tonton Sekarang
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full z-10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full bg-black">
              {activeVideo.url && (activeVideo.url.includes("youtube.com") || activeVideo.url.includes("youtu.be")) ? (
                <iframe
                  src={getYouTubeEmbedUrl(activeVideo.url)}
                  title={activeVideo.judul}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center space-y-4">
                  <Play className="w-12 h-12 text-slate-600" />
                  <p className="text-sm">Bukan link embed YouTube yang valid. Klik tombol di bawah untuk membukanya langsung.</p>
                  <a href={activeVideo.url} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl">
                    Buka Link Video
                  </a>
                </div>
              )}
            </div>
            <div className="p-6 space-y-2 bg-slate-950 text-white">
              <h3 className="font-sans font-bold text-sm sm:text-base">{activeVideo.judul}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{activeVideo.deskripsi}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
