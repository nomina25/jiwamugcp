import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Lock, Unlock, Database, Plus, Trash2, Edit2, Check, FileText, Video, 
  BookOpen, Layers, TrendingUp, Users, Heart, Shield, UserCheck, GraduationCap, Award, Search 
} from "lucide-react";
import { Buku, Proyek, Artikel, VideoItem, MajalahEdisi, ClassItem, AdminUser, Trainer, Pendamping } from "../types";
import { db } from "../firebase";
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { getUnsplashDirectUrl } from "../utils/image";

interface AdminProps {
  bukuList: Buku[];
  setBukuList: React.Dispatch<React.SetStateAction<Buku[]>>;
  proyekList: Proyek[];
  setProyekList: React.Dispatch<React.SetStateAction<Proyek[]>>;
  artikelList: Artikel[];
  setArtikelList: React.Dispatch<React.SetStateAction<Artikel[]>>;
  videoList: VideoItem[];
  setVideoList: React.Dispatch<React.SetStateAction<VideoItem[]>>;
  majalahList: MajalahEdisi[];
  setMajalahList: React.Dispatch<React.SetStateAction<MajalahEdisi[]>>;
  unduhanList?: any[];
  setUnduhanList?: React.Dispatch<React.SetStateAction<any[]>>;
  trainersList?: any[];
  setTrainersList?: React.Dispatch<React.SetStateAction<any[]>>;
  pamongList?: any[];
  setPamongList?: React.Dispatch<React.SetStateAction<any[]>>;
  classesList?: any[];
  setClassesList?: React.Dispatch<React.SetStateAction<any[]>>;
}

// Secure browser-native SHA-256 password hashing helper
async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// Utility to extract youtube video ID and get default high quality thumbnail
function extractYouTubeId(url: string): string {
  if (!url) return "";
  let videoId = "";
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  } else if (url.includes("youtube.com/watch")) {
    const params = new URLSearchParams(url.split("?")[1]);
    videoId = params.get("v") || "";
  } else if (url.includes("youtube.com/embed/")) {
    videoId = url.split("youtube.com/embed/")[1]?.split("?")[0];
  } else if (url.trim().length === 11) {
    videoId = url.trim();
  }
  return videoId;
}

export default function Admin({
  bukuList, setBukuList,
  proyekList, setProyekList,
  artikelList, setArtikelList,
  videoList, setVideoList,
  majalahList, setMajalahList,
  unduhanList = [], setUnduhanList,
  trainersList = [], setTrainersList,
  pamongList = [], setPamongList,
  classesList = [], setClassesList
}: AdminProps) {
  // Authentication & System States
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<AdminUser | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [checkingAdmins, setCheckingAdmins] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Login & Setup Fields
  const [loginEmail, setLoginEmail] = useState("pratama.dianf@gmail.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [setupPassword, setSetupPassword] = useState("");
  const [setupConfirmPassword, setSetupConfirmPassword] = useState("");

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<
    "artikel" | "video" | "buku" | "majalah" | "proyek" | "kelas" | "instructor" | "pelanggan" | "hasil_tes" | "admin_mgmt"
  >("artikel");

  // CRM Live Subscription States
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [loadingTestResults, setLoadingTestResults] = useState(false);

  // Instructor Management Toggle
  const [instructorType, setInstructorType] = useState<"trainer" | "pamong">("trainer");

  // Editing States
  const [editingId, setEditingId] = useState<string | null>(null);

  // Forms Fields States
  const [bukuForm, setBukuForm] = useState<Partial<Buku>>({
    judul: "", pengarang: "", slug: "", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    tahun: 2026, halaman: 200, ukuran: "13 x 19 cm", berat: "250 gram", penerbit: "Penerbit Jiwamu", harga: 125000,
    deskripsi: "", daftarIsi: []
  });
  const [tempDaftarIsi, setTempDaftarIsi] = useState("");

  const [proyekForm, setProyekForm] = useState<Partial<Proyek>>({
    id: "", judul: "", deskripsi: "", danaTerkumpul: 0, target: 10000000, status: "berjalan", detailText: ""
  });

  const [artikelForm, setArtikelForm] = useState<Partial<Artikel>>({
    id: "", judul: "", ringkasan: "", konten: "", penulis: "Dian Pratama", tanggal: "05 Juli 2026", kategori: "Umum", bacaMilik: "5 menit membaca", imageUrl: ""
  });

  const [videoForm, setVideoForm] = useState<Partial<VideoItem>>({
    id: "", judul: "", durasi: "10:00", youtubeId: "", thumbnail: "", deskripsi: ""
  });

  const [majalahForm, setMajalahForm] = useState<Partial<MajalahEdisi>>({
    id: "", nomor: "Edisi Baru", bulanTahun: "Juli 2026", tema: "", deskripsi: "", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f", pdfUrl: "#"
  });

  const [kelasForm, setKelasForm] = useState<Partial<ClassItem>>({
    id: "", code: "", level: "Level 1", title: "", desc: "", price: "Rp 2.500.000", investment: "Rp 2.500.000",
    rekeningBank: "Bank Mandiri No. Rekening: 1410039881313 An. Yayasan Pusat Psikoanalisis Indonesia",
    duration: "1 Hari Penuh (9 Jam intensif)"
  });
  const [tempJadwal, setTempJadwal] = useState("");
  const [tempMateri, setTempMateri] = useState("");
  const [tempCompetence, setTempCompetence] = useState("");

  const [trainerForm, setTrainerForm] = useState<Partial<Trainer>>({
    id: "", nama: "", gelar: "CABP", pengalaman: "Berpengalaman 10+ tahun", foto: ""
  });

  const [pamongForm, setPamongForm] = useState<Partial<Pendamping>>({
    id: "", nama: "", pengalaman: "Pendamping Jiwamu", keahlian: [], foto: ""
  });
  const [tempKeahlian, setTempKeahlian] = useState("");

  const [adminForm, setAdminForm] = useState<Partial<AdminUser>>({
    email: "", nama: "", role: "editor"
  });
  const [adminPassword, setAdminPassword] = useState("");

  // Subscriptions Listener for Admins
  useEffect(() => {
    const unsubAdmins = onSnapshot(collection(db, "admins"), (snapshot) => {
      const list = snapshot.docs.map(doc => doc.data() as AdminUser);
      setAdminUsers(list);
      setCheckingAdmins(false);
    }, (err) => {
      console.error("Error loading admin collection:", err);
      setCheckingAdmins(false);
    });
    return () => unsubAdmins();
  }, []);

  // Subscribers & Test Results CRM Listeners
  useEffect(() => {
    if (!isAuthorized) return;
    setLoadingSubscribers(true);
    const unsub = onSnapshot(collection(db, "subscribers"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a: any, b: any) => new Date(b.tanggalBerlangganan || 0).getTime() - new Date(a.tanggalBerlangganan || 0).getTime());
      setSubscribers(docs);
      setLoadingSubscribers(false);
    }, (err) => {
      console.error("Error fetching subscribers:", err);
      setLoadingSubscribers(false);
    });
    return () => unsub();
  }, [isAuthorized]);

  useEffect(() => {
    if (!isAuthorized) return;
    setLoadingTestResults(true);
    const unsub = onSnapshot(collection(db, "test_results"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a: any, b: any) => new Date(b.tanggalTes || 0).getTime() - new Date(a.tanggalTes || 0).getTime());
      setTestResults(docs);
      setLoadingTestResults(false);
    }, (err) => {
      console.error("Error fetching test results:", err);
      setLoadingTestResults(false);
    });
    return () => unsub();
  }, [isAuthorized]);

  // Auth Submit Handlers
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!loginEmail || !loginPassword) {
      setErrorMsg("Email dan kata sandi wajib diisi.");
      return;
    }
    const foundAdmin = adminUsers.find(a => a.email.toLowerCase() === loginEmail.toLowerCase().trim());
    if (!foundAdmin) {
      setErrorMsg(`Email "${loginEmail}" tidak terdaftar sebagai administrator.`);
      return;
    }
    try {
      const hashed = await hashPassword(loginPassword);
      if (hashed === foundAdmin.passwordHash) {
        setLoggedInUser(foundAdmin);
        setIsAuthorized(true);
        setErrorMsg("");
      } else {
        setErrorMsg("Kata sandi salah. Silakan coba lagi.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kesalahan sistem saat memverifikasi sandi.");
    }
  };

  const handleSetupSuperadmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!setupPassword) {
      setErrorMsg("Kata sandi tidak boleh kosong.");
      return;
    }
    if (setupPassword.length < 6) {
      setErrorMsg("Kata sandi harus minimal 6 karakter demi keamanan.");
      return;
    }
    if (setupPassword !== setupConfirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    try {
      const hashed = await hashPassword(setupPassword);
      const superAdmin: AdminUser = {
        email: "pratama.dianf@gmail.com",
        passwordHash: hashed,
        nama: "Dian Pratama",
        role: "superadmin",
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, "admins", "pratama.dianf@gmail.com"), superAdmin);
      setLoggedInUser(superAdmin);
      setIsAuthorized(true);
      setErrorMsg("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal melakukan inisialisasi akun superadmin.");
    }
  };

  // Helper for markdown toolbar support
  const appendMarkdown = (field: string, formSetter: any, formVal: any, syntax: string) => {
    const text = formVal[field] || "";
    let wrapped = "";
    if (syntax === "B") wrapped = `**${text}**`;
    else if (syntax === "I") wrapped = `*${text}*`;
    else if (syntax === "H2") wrapped = `\n## ${text}\n`;
    else if (syntax === "H3") wrapped = `\n### ${text}\n`;
    else if (syntax === "List") wrapped = `\n- ${text}`;
    else if (syntax === "Quote") wrapped = `\n> ${text}\n`;
    else if (syntax === "Link") wrapped = `[${text}](https://jiwamu.com)`;

    formSetter({ ...formVal, [field]: text + wrapped });
  };

  // Durable persistent CMS Save Actions writing to Firestore
  const handleSaveArtikel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artikelForm.judul) return;

    try {
      const id = editingId || `art-${Date.now()}`;
      const newArt: Artikel = {
        id,
        judul: artikelForm.judul || "",
        ringkasan: artikelForm.ringkasan || "",
        konten: artikelForm.konten || "",
        penulis: artikelForm.penulis || "Staf Jiwamu",
        tanggal: artikelForm.tanggal || new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }),
        kategori: artikelForm.kategori || "Umum",
        bacaMilik: artikelForm.bacaMilik || "5 menit",
        imageUrl: getUnsplashDirectUrl(artikelForm.imageUrl || "")
      };
      await setDoc(doc(db, "articles", id), newArt);
      resetForms();
    } catch (err) {
      console.error("Error saving article:", err);
      alert("Gagal mengunggah artikel ke database: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.judul || !videoForm.youtubeId) return;

    try {
      const id = editingId || `vid-${Date.now()}`;
      const videoId = extractYouTubeId(videoForm.youtubeId);
      
      const newVid: VideoItem & { url?: string } = {
        id,
        judul: videoForm.judul,
        durasi: videoForm.durasi || "10:00",
        youtubeId: videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`, // Fill both for absolute backward-compatibility
        thumbnail: videoForm.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        deskripsi: videoForm.deskripsi || ""
      };
      await setDoc(doc(db, "videos", id), newVid);
      resetForms();
    } catch (err) {
      console.error("Error saving video:", err);
      alert("Gagal mengunggah informasi video: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSaveBuku = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bukuForm.judul) return;

    try {
      const slug = editingId || bukuForm.judul?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `buku-${Date.now()}`;
      const listContents = tempDaftarIsi ? tempDaftarIsi.split("\n").filter(Boolean) : [];
      const updatedBuku: Buku = {
        slug,
        judul: bukuForm.judul || "",
        pengarang: bukuForm.pengarang || "Tim Jiwamu",
        cover: bukuForm.cover || "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
        tahun: Number(bukuForm.tahun) || 2026,
        halaman: Number(bukuForm.halaman) || 200,
        ukuran: bukuForm.ukuran || "13 x 19 cm",
        berat: bukuForm.berat || "250 gram",
        penerbit: bukuForm.penerbit || "Penerbit Jiwamu",
        harga: Number(bukuForm.harga) || 125000,
        deskripsi: bukuForm.deskripsi || "",
        daftarIsi: listContents
      };
      await setDoc(doc(db, "books", slug), updatedBuku);
      resetForms();
    } catch (err) {
      console.error("Error saving book:", err);
      alert("Gagal mengunggah spesifikasi buku: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSaveMajalah = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!majalahForm.tema) return;

    try {
      const id = editingId || `Ed. ${majalahList.length + 1}/${new Date().getFullYear()}`;
      const updatedMajalah: MajalahEdisi = {
        id,
        nomor: majalahForm.nomor || `Edisi ${majalahList.length + 1}`,
        bulanTahun: majalahForm.bulanTahun || "Juli 2026",
        tema: majalahForm.tema || "",
        deskripsi: majalahForm.deskripsi || "",
        cover: majalahForm.cover || "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
        pdfUrl: majalahForm.pdfUrl || "#"
      };
      await setDoc(doc(db, "magazines", id), updatedMajalah);
      resetForms();
    } catch (err) {
      console.error("Error saving magazine:", err);
      alert("Gagal mengunggah info majalah: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSaveProyek = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proyekForm.judul) return;

    try {
      const id = editingId || String(proyekList.length + 1).padStart(3, "0");
      const updatedProyek: Proyek = {
        id,
        judul: proyekForm.judul || "",
        deskripsi: proyekForm.deskripsi || "",
        danaTerkumpul: Number(proyekForm.danaTerkumpul) || 0,
        target: Number(proyekForm.target) || 10000000,
        status: proyekForm.status || "berjalan",
        detailText: proyekForm.detailText || ""
      };
      await setDoc(doc(db, "projects", id), updatedProyek);
      resetForms();
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Gagal mengunggah informasi program crowdfunding riset: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSaveKelas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kelasForm.title || !kelasForm.code) return;

    try {
      const id = editingId || kelasForm.code.toLowerCase().trim();
      
      const lineJadwal = tempJadwal.split("\n").filter(Boolean);
      const jadwalArray = lineJadwal.map(line => {
        const parts = line.split("|").map(p => p.trim());
        return {
          city: parts[0] || "Online",
          hotel: parts[1] || "Zoom Meeting",
          date: parts[2] || "Sesuai Pendaftaran"
        };
      });

      const materiArray = tempMateri.split("\n").filter(Boolean);
      const competenceArray = tempCompetence.split("\n").filter(Boolean);

      const updatedClass: ClassItem = {
        id,
        code: kelasForm.code.toUpperCase(),
        level: kelasForm.level || "Level 1",
        title: kelasForm.title,
        desc: kelasForm.desc || "",
        price: kelasForm.price || "Rp 2.500.000",
        investment: kelasForm.investment || "Rp 2.500.000",
        rekeningBank: kelasForm.rekeningBank || "Bank Mandiri No. Rekening: 1410039881313 An. Yayasan Pusat Psikoanalisis Indonesia",
        duration: kelasForm.duration || "1 Hari Penuh",
        jadwal: jadwalArray,
        materi: materiArray,
        competence: competenceArray
      };

      await setDoc(doc(db, "classes", id), updatedClass);
      resetForms();
    } catch (err) {
      console.error("Error saving class:", err);
      alert("Gagal menyinkronkan data kelas ke database: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSaveInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (instructorType === "trainer") {
      if (!trainerForm.nama) return;
      try {
        const id = editingId || `tr-${Date.now()}`;
        const data: Trainer = {
          id,
          nama: trainerForm.nama,
          gelar: trainerForm.gelar || "CABP",
          pengalaman: trainerForm.pengalaman || "Berpengalaman 10+ tahun",
          foto: trainerForm.foto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop"
        };
        await setDoc(doc(db, "trainers", id), data);
        resetForms();
      } catch (err) {
        console.error("Error saving trainer:", err);
        alert("Gagal menyimpan data Trainer: " + (err instanceof Error ? err.message : String(err)));
      }
    } else {
      if (!pamongForm.nama) return;
      try {
        const id = editingId || `pmg-${Date.now()}`;
        const keahlianArray = tempKeahlian.split(",").map(k => k.trim()).filter(Boolean);
        const data: Pendamping = {
          id,
          nama: pamongForm.nama,
          pengalaman: pamongForm.pengalaman || "Pendamping Jiwamu",
          keahlian: keahlianArray,
          foto: pamongForm.foto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
        };
        await setDoc(doc(db, "pamong", id), data);
        resetForms();
      } catch (err) {
        console.error("Error saving pamong:", err);
        alert("Gagal menyimpan data Pamong: " + (err instanceof Error ? err.message : String(err)));
      }
    }
  };

  const handleSaveAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminForm.email || !adminForm.nama) return;
    if (!editingId && !adminPassword) {
      alert("Kata sandi wajib ditentukan untuk admin baru.");
      return;
    }

    try {
      const emailLower = adminForm.email.toLowerCase().trim();
      let passwordHash = "";

      if (editingId) {
        const existing = adminUsers.find(a => a.email.toLowerCase() === editingId.toLowerCase());
        passwordHash = existing?.passwordHash || "";
        if (adminPassword) {
          passwordHash = await hashPassword(adminPassword);
        }
      } else {
        passwordHash = await hashPassword(adminPassword);
      }

      const updatedAdmin: AdminUser = {
        email: emailLower,
        nama: adminForm.nama,
        passwordHash,
        role: adminForm.role || "editor",
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, "admins", emailLower), updatedAdmin);
      resetForms();
    } catch (err) {
      console.error("Error saving admin:", err);
      alert("Gagal mendaftarkan administrator baru: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Delete Actions
  const handleDelete = async (id: string, type: string) => {
    // Standard validation
    if (loggedInUser?.role !== "superadmin" && (type === "pelanggan" || type === "hasil_tes" || type === "admin")) {
      alert("Akses Terbatas: Hanya akun Super Admin yang dapat menghapus data log / pengguna.");
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus item ini secara permanen dari database Firestore?`)) return;

    try {
      if (type === "artikel") await deleteDoc(doc(db, "articles", id));
      if (type === "video") await deleteDoc(doc(db, "videos", id));
      if (type === "buku") await deleteDoc(doc(db, "books", id));
      if (type === "majalah") await deleteDoc(doc(db, "magazines", id));
      if (type === "proyek") await deleteDoc(doc(db, "projects", id));
      if (type === "kelas") await deleteDoc(doc(db, "classes", id));
      if (type === "trainer") await deleteDoc(doc(db, "trainers", id));
      if (type === "pamong") await deleteDoc(doc(db, "pamong", id));
      if (type === "admin") {
        if (id === "pratama.dianf@gmail.com") {
          alert("Gagal: Akun Super Admin utama 'pratama.dianf@gmail.com' tidak dapat dihapus demi keamanan.");
          return;
        }
        if (id.toLowerCase() === loggedInUser?.email.toLowerCase()) {
          alert("Gagal: Anda tidak dapat menghapus akun Anda sendiri.");
          return;
        }
        await deleteDoc(doc(db, "admins", id));
      }
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      alert(`Gagal menghapus data ${type} dari cloud: ` + (err instanceof Error ? err.message : String(err)));
    }
  };

  const resetForms = () => {
    setEditingId(null);
    setBukuForm({
      judul: "", pengarang: "", slug: "", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
      tahun: 2026, halaman: 200, ukuran: "13 x 19 cm", berat: "250 gram", penerbit: "Penerbit Jiwamu", harga: 125000,
      deskripsi: "", daftarIsi: []
    });
    setTempDaftarIsi("");
    setProyekForm({
      id: "", judul: "", deskripsi: "", danaTerkumpul: 0, target: 10000000, status: "berjalan", detailText: ""
    });
    setArtikelForm({
      id: "", judul: "", ringkasan: "", konten: "", penulis: loggedInUser?.nama || "Dian Pratama", tanggal: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }), kategori: "Umum", bacaMilik: "5 menit membaca", imageUrl: ""
    });
    setVideoForm({
      id: "", judul: "", durasi: "10:00", youtubeId: "", thumbnail: "", deskripsi: ""
    });
    setMajalahForm({
      id: "", nomor: "Edisi Baru", bulanTahun: "Juli 2026", tema: "", deskripsi: "", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f", pdfUrl: "#"
    });
    setKelasForm({
      id: "", code: "", level: "Level 1", title: "", desc: "", price: "Rp 2.500.000", investment: "Rp 2.500.000",
      rekeningBank: "Bank Mandiri No. Rekening: 1410039881313 An. Yayasan Pusat Psikoanalisis Indonesia",
      duration: "1 Hari Penuh (9 Jam intensif)"
    });
    setTempJadwal("");
    setTempMateri("");
    setTempCompetence("");
    setTrainerForm({
      id: "", nama: "", gelar: "CABP", pengalaman: "Berpengalaman 10+ tahun", foto: ""
    });
    setPamongForm({
      id: "", nama: "", pengalaman: "Pendamping Jiwamu", keahlian: [], foto: ""
    });
    setTempKeahlian("");
    setAdminForm({
      email: "", nama: "", role: "editor"
    });
    setAdminPassword("");
  };

  const handleStartEdit = (item: any, type: string) => {
    setEditingId(type === "buku" ? item.slug : (type === "admin" ? item.email : item.id));
    if (type === "artikel") setArtikelForm(item);
    if (type === "video") {
      setVideoForm({
        ...item,
        youtubeId: item.youtubeId || item.url || ""
      });
    }
    if (type === "buku") {
      setBukuForm(item);
      setTempDaftarIsi((item.daftarIsi || []).join("\n"));
    }
    if (type === "majalah") setMajalahForm(item);
    if (type === "proyek") setProyekForm(item);
    if (type === "kelas") {
      setKelasForm(item);
      setTempJadwal((item.jadwal || []).map((j: any) => `${j.city} | ${j.hotel} | ${j.date}`).join("\n"));
      setTempMateri((item.materi || []).join("\n"));
      setTempCompetence((item.competence || []).join("\n"));
    }
    if (type === "trainer") {
      setInstructorType("trainer");
      setTrainerForm(item);
    }
    if (type === "pamong") {
      setInstructorType("pamong");
      setPamongForm(item);
      setTempKeahlian((item.keahlian || []).join(", "));
    }
    if (type === "admin") {
      setAdminForm({
        email: item.email,
        nama: item.nama,
        role: item.role
      });
      setAdminPassword("");
    }
  };

  // Auth Gate: Checking database connection
  if (checkingAdmins) {
    return (
      <div className="max-w-md mx-auto py-32 px-4 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-black border-t-[#8B5CF6] rounded-full animate-spin mb-4"></div>
        <p className="font-mono text-xs font-black text-slate-800">MENGHUBUNGKAN KE FIRESTORE...</p>
      </div>
    );
  }

  // Auth Gate: Welcome Dian Pratama & Setup password on empty collection
  if (adminUsers.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <div className="bg-white rounded-3xl p-8 border-4 border-black brutal-shadow">
          <div className="inline-flex p-3 rounded-2xl bg-[#D9F99D] border-2 border-black text-black mb-4 shadow-sm">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="font-sans text-xl font-black text-slate-900 mb-2">Aktivasi CMS Jiwamu</h2>
          <p className="text-xs text-slate-700 leading-relaxed font-semibold mb-6">
            Halo <strong className="text-[#8B5CF6]">Dian Pratama</strong>! Sistem mendeteksi CMS ini diluncurkan untuk pertama kalinya. Tentukan kata sandi aman Anda untuk email <strong className="font-mono text-[#FF71CF]">pratama.dianf@gmail.com</strong> agar dapat masuk ke konsol admin dan melakukan manajemen konten secara aman.
          </p>

          <form onSubmit={handleSetupSuperadmin} className="space-y-4">
            <div>
              <label className="block text-xxs font-mono uppercase font-black text-slate-500 mb-1">Dian's Email (Super Admin)</label>
              <input
                type="text"
                disabled
                value="pratama.dianf@gmail.com"
                className="w-full px-4 py-2.5 border-2 border-black bg-slate-100 rounded-xl font-mono text-xs font-bold text-slate-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Buat Kata Sandi Baru</label>
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={setupPassword}
                onChange={(e) => setSetupPassword(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-black rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] font-mono font-bold shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Konfirmasi Kata Sandi</label>
              <input
                type="password"
                placeholder="Masukkan ulang kata sandi"
                value={setupConfirmPassword}
                onChange={(e) => setSetupConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-black rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] font-mono font-bold shadow-sm"
              />
            </div>
            {errorMsg && <p className="text-xs text-red-600 font-black">{errorMsg}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-[#D9F99D] text-black border-2 border-black rounded-xl font-black transition-all text-xs cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none hover:bg-[#8B5CF6] hover:text-white"
            >
              Simpan & Aktifkan Super Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Auth Gate: Regular Secure Sign-In Screen
  if (!isAuthorized || !loggedInUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <div className="bg-white rounded-3xl p-8 border-4 border-black brutal-shadow">
          <div className="inline-flex p-3 rounded-2xl bg-[#FFD600] border-2 border-black text-black mb-4 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-sans text-xl font-black text-slate-900 mb-1">CMS Sign In</h2>
          <p className="text-xs text-slate-600 font-semibold mb-6">
            Masuk dengan kredensial administrator terdaftar Anda untuk melanjutkan.
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Email Admin</label>
              <input
                type="email"
                placeholder="email@jiwamu.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-black rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] font-mono font-bold shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Kata Sandi</label>
              <input
                type="password"
                placeholder="Masukkan kata sandi"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-black rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] font-mono font-bold shadow-sm"
              />
            </div>
            {errorMsg && <p className="text-xs text-red-600 font-black">{errorMsg}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-[#8B5CF6] text-white border-2 border-black rounded-xl font-black transition-all text-xs cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none hover:bg-[#FF71CF] hover:text-black"
            >
              Masuk Konsol Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authorised Main CMS Panel Screen
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-4 border-black pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xxs font-mono text-black bg-[#FF71CF] border border-black px-2.5 py-1 rounded-full font-black flex items-center gap-1 shadow-sm w-fit">
              <Unlock className="w-3 h-3" /> ADMIN SYSTEM CONNECTED
            </span>
            {loggedInUser.role === "superadmin" ? (
              <span className="text-xxs font-mono text-white bg-purple-600 border border-black px-2.5 py-1 rounded-full font-black flex items-center gap-1 shadow-sm w-fit">
                <Shield className="w-3 h-3" /> SUPER ADMIN ACCESS
              </span>
            ) : (
              <span className="text-xxs font-mono text-slate-700 bg-blue-100 border border-black px-2.5 py-1 rounded-full font-black flex items-center gap-1 shadow-sm w-fit">
                <UserCheck className="w-3 h-3" /> EDITOR ACCESS (TERBATAS)
              </span>
            )}
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-black text-slate-900 pt-3 flex items-center gap-2">
            CMS Konsol Jiwamu
          </h1>
          <p className="text-xs text-slate-600 font-semibold pt-1">
            Selamat bekerja, <strong className="text-slate-900">{loggedInUser.nama}</strong> ({loggedInUser.email}).
            Informasi tersinkronisasi langsung ke Firebase Firestore secara real-time.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsAuthorized(false);
              setLoggedInUser(null);
            }}
            className="px-4 py-2 bg-white border-2 border-black text-black text-xs font-black rounded-xl hover:bg-[#FF71CF] transition-all cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none"
          >
            Keluar (Lock)
          </button>
        </div>
      </div>

      {/* Main CMS Navigation Tab Panel */}
      <div className="flex flex-wrap gap-2 mb-8 border-b-2 border-black pb-4">
        {[
          { key: "artikel", label: "Artikel", icon: FileText },
          { key: "video", label: "Video Talks", icon: Video },
          { key: "buku", label: "Katalog Buku", icon: BookOpen },
          { key: "majalah", label: "Majalah Bulanan", icon: Layers },
          { key: "proyek", label: "Riset Proyek", icon: TrendingUp },
          { key: "kelas", label: "Kelola Kelas", icon: GraduationCap },
          { key: "instructor", label: "Pamong & Trainer", icon: Award },
          { key: "pelanggan", label: "Pelanggan", icon: Users },
          { key: "hasil_tes", label: "Hasil Tes Kelekatan", icon: Heart },
          ...(loggedInUser.role === "superadmin" ? [{ key: "admin_mgmt", label: "Kelola Admin", icon: Shield }] : [])
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key as any); resetForms(); }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border-2 border-black shadow-sm active:translate-y-0.5 active:shadow-none ${
                isActive ? "bg-[#8B5CF6] text-white" : "bg-white text-black hover:bg-[#FDF4FF]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Alert Banner for Editors */}
      {loggedInUser.role !== "superadmin" && (
        <div className="bg-amber-50 border-2 border-black p-3 rounded-xl mb-6 text-xs text-amber-800 font-bold flex items-center gap-2 shadow-sm animate-fade-in">
          <Shield className="w-4 h-4 text-amber-600" />
          <span>Akses Terbatas (Editor): Anda dapat menambahkan dan memperbarui konten, tetapi tidak diizinkan untuk menghapus data pelanggan, hasil tes, atau memanipulasi hak akses administratif.</span>
        </div>
      )}

      {/* Main CMS Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: EDITOR FORMS */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border-2 border-black brutal-shadow h-fit">
          <h2 className="font-sans text-xs font-extrabold uppercase tracking-wider text-[#8B5CF6] mb-4 flex items-center gap-2">
            <Database className="w-4 h-4" />
            {activeTab === "pelanggan" || activeTab === "hasil_tes" 
              ? "Dashboard Analisis CRM" 
              : (editingId ? "Edit Item Terpilih" : `Tambah ${activeTab.toUpperCase()}`)}
          </h2>

          {/* Form: ARTIKEL */}
          {activeTab === "artikel" && (
            <form onSubmit={handleSaveArtikel} className="space-y-4">
              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Judul Artikel</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mengurai Luka Kelekatan Masa Kecil"
                  value={artikelForm.judul || ""}
                  onChange={(e) => setArtikelForm({ ...artikelForm, judul: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs focus:ring-2 focus:ring-[#8B5CF6] font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Penulis</label>
                <input
                  type="text"
                  placeholder="Dian Pratama"
                  value={artikelForm.penulis || ""}
                  onChange={(e) => setArtikelForm({ ...artikelForm, penulis: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Kategori</label>
                  <select
                    value={artikelForm.kategori || "Teoretis"}
                    onChange={(e) => setArtikelForm({ ...artikelForm, kategori: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="Populer">Populer</option>
                    <option value="Teoretis">Teoretis</option>
                    <option value="Relasi">Relasi</option>
                    <option value="Keluarga">Keluarga</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Waktu Baca</label>
                  <input
                    type="text"
                    placeholder="5 min"
                    value={artikelForm.bacaMilik || ""}
                    onChange={(e) => setArtikelForm({ ...artikelForm, bacaMilik: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Ilustrasi Gambar (URL)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={artikelForm.imageUrl || ""}
                  onChange={(e) => setArtikelForm({ ...artikelForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                />
                <p className="text-[10px] text-slate-400 font-bold mt-1">
                  *Mendukung link foto Unsplash langsung (Contoh: unsplash.com/photos/...) maupun gambar direct.
                </p>
                {artikelForm.imageUrl && (
                  <div className="mt-2 aspect-video w-full rounded-xl overflow-hidden border-2 border-black bg-slate-50 relative">
                    <img 
                      src={getUnsplashDirectUrl(artikelForm.imageUrl)} 
                      alt="Ilustrasi Preview" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Safe fallback inside iframe
                        console.error("Image failed to load in preview");
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Ringkasan Pendek</label>
                <textarea
                  required
                  placeholder="Tulis abstraksi ringkas artikel untuk tampilan katalog kartu..."
                  value={artikelForm.ringkasan || ""}
                  onChange={(e) => setArtikelForm({ ...artikelForm, ringkasan: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xxs font-mono uppercase font-black text-slate-700">Konten Artikel (Markdown)</label>
                  <div className="flex gap-1">
                    {["B", "I", "H2", "H3", "List", "Quote"].map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => appendMarkdown("konten", setArtikelForm, artikelForm, tag)}
                        className="px-1.5 py-0.5 border border-black rounded text-[9px] font-black bg-slate-100 hover:bg-[#FF71CF]"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  required
                  placeholder="Ketik seluruh konten artikel di sini dengan format standar Markdown..."
                  value={artikelForm.konten || ""}
                  onChange={(e) => setArtikelForm({ ...artikelForm, konten: e.target.value })}
                  rows={10}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-medium font-mono outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#8B5CF6] text-white border-2 border-black rounded-xl font-black text-xs shadow-sm hover:bg-[#FF71CF] hover:text-black cursor-pointer"
                >
                  {editingId ? "Perbarui Artikel" : "Terbitkan Artikel"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForms}
                    className="px-4 py-2 bg-white border-2 border-black text-black rounded-xl text-xs font-black hover:bg-slate-100"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Form: VIDEO */}
          {activeTab === "video" && (
            <form onSubmit={handleSaveVideo} className="space-y-4">
              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Judul Video Edukasi</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Membongkar Siklus Hubungan Toksik"
                  value={videoForm.judul || ""}
                  onChange={(e) => setVideoForm({ ...videoForm, judul: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Durasi Video</label>
                  <input
                    type="text"
                    placeholder="12:45"
                    value={videoForm.durasi || ""}
                    onChange={(e) => setVideoForm({ ...videoForm, durasi: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Link atau ID YouTube</label>
                  <input
                    type="text"
                    required
                    placeholder="https://youtu.be/... atau ID"
                    value={videoForm.youtubeId || ""}
                    onChange={(e) => setVideoForm({ ...videoForm, youtubeId: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Thumbnail Cover Gambar (Opsional)</label>
                <input
                  type="text"
                  placeholder="Kosongkan untuk otomatis dari YouTube"
                  value={videoForm.thumbnail || ""}
                  onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                />
                {videoForm.youtubeId && (
                  <div className="mt-2 aspect-video w-full rounded-xl overflow-hidden border border-black bg-slate-900 flex items-center justify-center relative">
                    <img 
                      src={videoForm.thumbnail || `https://img.youtube.com/vi/${extractYouTubeId(videoForm.youtubeId)}/mqdefault.jpg`} 
                      alt="Thumbnail Preview" 
                      className="w-full h-full object-cover opacity-80" 
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3" }}
                    />
                    <div className="absolute w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">▶</div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Deskripsi Ringkas Video</label>
                <textarea
                  placeholder="Ulasan singkat mengenai isi konten YouTube..."
                  value={videoForm.deskripsi || ""}
                  onChange={(e) => setVideoForm({ ...videoForm, deskripsi: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#8B5CF6] text-white border-2 border-black rounded-xl font-black text-xs shadow-sm hover:bg-[#FF71CF] hover:text-black cursor-pointer"
                >
                  {editingId ? "Perbarui Video" : "Tambahkan Video"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForms}
                    className="px-4 py-2 bg-white border-2 border-black text-black rounded-xl text-xs font-black hover:bg-slate-100"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Form: BUKU */}
          {activeTab === "buku" && (
            <form onSubmit={handleSaveBuku} className="space-y-4">
              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Judul Buku</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What the Wound Knows"
                  value={bukuForm.judul || ""}
                  onChange={(e) => setBukuForm({ ...bukuForm, judul: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Pengarang</label>
                  <input
                    type="text"
                    placeholder="Cin Hapsari"
                    value={bukuForm.pengarang || ""}
                    onChange={(e) => setBukuForm({ ...bukuForm, pengarang: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Harga (Angka)</label>
                  <input
                    type="number"
                    placeholder="125000"
                    value={bukuForm.harga || ""}
                    onChange={(e) => setBukuForm({ ...bukuForm, harga: Number(e.target.value) })}
                    className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <div>
                  <label className="block text-[8px] font-mono uppercase font-black text-slate-700 mb-1">Tahun Terbit</label>
                  <input
                    type="number"
                    value={bukuForm.tahun || 2026}
                    onChange={(e) => setBukuForm({ ...bukuForm, tahun: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 border-2 border-black rounded-lg text-xs font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono uppercase font-black text-slate-700 mb-1">Jumlah Halaman</label>
                  <input
                    type="number"
                    value={bukuForm.halaman || 200}
                    onChange={(e) => setBukuForm({ ...bukuForm, halaman: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 border-2 border-black rounded-lg text-xs font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono uppercase font-black text-slate-700 mb-1">Ukuran Fisik</label>
                  <input
                    type="text"
                    value={bukuForm.ukuran || "13 x 19 cm"}
                    onChange={(e) => setBukuForm({ ...bukuForm, ukuran: e.target.value })}
                    className="w-full px-2 py-1.5 border-2 border-black rounded-lg text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Cover Buku (URL)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={bukuForm.cover || ""}
                  onChange={(e) => setBukuForm({ ...bukuForm, cover: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Resensi / Deskripsi</label>
                <textarea
                  placeholder="Ulasan deskripsi buku dan mengapa pembaca harus memilikinya..."
                  value={bukuForm.deskripsi || ""}
                  onChange={(e) => setBukuForm({ ...bukuForm, deskripsi: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Daftar Isi (Satu baris per bab)</label>
                <textarea
                  placeholder="Bab 1: Asal Usul Luka Batin&#10;Bab 2: Membaca Sinyal Tubuh&#10;Bab 3: Pemulihan Mandiri"
                  value={tempDaftarIsi}
                  onChange={(e) => setTempDaftarIsi(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-medium font-mono outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#8B5CF6] text-white border-2 border-black rounded-xl font-black text-xs shadow-sm hover:bg-[#FF71CF]"
                >
                  {editingId ? "Perbarui Spesifikasi Buku" : "Terbitkan Buku Baru"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForms} className="px-4 py-2 bg-white border-2 border-black text-black rounded-xl text-xs font-black">
                    Batal
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Form: MAJALAH */}
          {activeTab === "majalah" && (
            <form onSubmit={handleSaveMajalah} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Nomor Edisi</label>
                  <input
                    type="text"
                    required
                    placeholder="Edisi 23"
                    value={majalahForm.nomor || ""}
                    onChange={(e) => setMajalahForm({ ...majalahForm, nomor: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Bulan & Tahun</label>
                  <input
                    type="text"
                    required
                    placeholder="Juli 2026"
                    value={majalahForm.bulanTahun || ""}
                    onChange={(e) => setMajalahForm({ ...majalahForm, bulanTahun: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Tema Utama Majalah</label>
                <input
                  type="text"
                  required
                  placeholder="Membongkar Topeng Si Baik-Baik Saja"
                  value={majalahForm.tema || ""}
                  onChange={(e) => setMajalahForm({ ...majalahForm, tema: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Cover Depan (URL)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={majalahForm.cover || ""}
                  onChange={(e) => setMajalahForm({ ...majalahForm, cover: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Abstraksi Deskripsi Edisi</label>
                <textarea
                  placeholder="Tulis ulasan ringkas mengenai artikel utama edisi majalah ini..."
                  value={majalahForm.deskripsi || ""}
                  onChange={(e) => setMajalahForm({ ...majalahForm, deskripsi: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#8B5CF6] text-white border-2 border-black rounded-xl font-black text-xs shadow-sm hover:bg-[#FF71CF]"
                >
                  {editingId ? "Perbarui Majalah" : "Terbitkan Majalah Edisi Baru"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForms} className="px-4 py-2 bg-white border-2 border-black text-black rounded-xl text-xs font-black">
                    Batal
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Form: RISET PROYEK */}
          {activeTab === "proyek" && (
            <form onSubmit={handleSaveProyek} className="space-y-4">
              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Judul Riset / Proyek</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Riset Pemetaan Laku Tirakat Nasional"
                  value={proyekForm.judul || ""}
                  onChange={(e) => setProyekForm({ ...proyekForm, judul: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Dana Terkumpul (Rp)</label>
                  <input
                    type="number"
                    placeholder="3500000"
                    value={proyekForm.danaTerkumpul || ""}
                    onChange={(e) => setProyekForm({ ...proyekForm, danaTerkumpul: Number(e.target.value) })}
                    className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Target Pendanaan (Rp)</label>
                  <input
                    type="number"
                    placeholder="10000000"
                    value={proyekForm.target || ""}
                    onChange={(e) => setProyekForm({ ...proyekForm, target: Number(e.target.value) })}
                    className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Status Proyek</label>
                <select
                  value={proyekForm.status || "berjalan"}
                  onChange={(e) => setProyekForm({ ...proyekForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none bg-white"
                >
                  <option value="berjalan">Sedang Berjalan (Crowdfunding Terbuka)</option>
                  <option value="selesai">Selesai (Pendanaan Terpenuhi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Keterangan Abstraksi</label>
                <textarea
                  placeholder="Abstraksi singkat proyek riset untuk tampilan kartu..."
                  value={proyekForm.deskripsi || ""}
                  onChange={(e) => setProyekForm({ ...proyekForm, deskripsi: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Detail Narasi Lengkap (Markdown)</label>
                <textarea
                  placeholder="Tuliskan latar belakang ilmiah, tujuan riset, tim pelaksana, serta progres riset batin secara lengkap di sini..."
                  value={proyekForm.detailText || ""}
                  onChange={(e) => setProyekForm({ ...proyekForm, detailText: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-medium font-mono outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#8B5CF6] text-white border-2 border-black rounded-xl font-black text-xs shadow-sm hover:bg-[#FF71CF]"
                >
                  {editingId ? "Perbarui Informasi Proyek" : "Daftarkan Proyek Crowdfunding"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForms} className="px-4 py-2 bg-white border-2 border-black text-black rounded-xl text-xs font-black">
                    Batal
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Form: KELOLA KELAS */}
          {activeTab === "kelas" && (
            <form onSubmit={handleSaveKelas} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Kode Kelas</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CAF atau CAC"
                    value={kelasForm.code || ""}
                    onChange={(e) => setKelasForm({ ...kelasForm, code: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Tingkatan / Level</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Level 1 atau Special Path"
                    value={kelasForm.level || ""}
                    onChange={(e) => setKelasForm({ ...kelasForm, level: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Judul Sertifikasi / Program</label>
                <input
                  type="text"
                  required
                  placeholder="Certification in Attachment Facilitator"
                  value={kelasForm.title || ""}
                  onChange={(e) => setKelasForm({ ...kelasForm, title: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Harga Cetak</label>
                  <input
                    type="text"
                    placeholder="Rp 2.500.000"
                    value={kelasForm.price || ""}
                    onChange={(e) => setKelasForm({ ...kelasForm, price: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Investasi Minimal</label>
                  <input
                    type="text"
                    placeholder="Rp 2.500.000"
                    value={kelasForm.investment || ""}
                    onChange={(e) => setKelasForm({ ...kelasForm, investment: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Durasi Pelaksanaan</label>
                <input
                  type="text"
                  placeholder="1 Hari Penuh (9 Jam intensif)"
                  value={kelasForm.duration || ""}
                  onChange={(e) => setKelasForm({ ...kelasForm, duration: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Rekening Pembayaran</label>
                <textarea
                  placeholder="Nomor rekening transfer..."
                  value={kelasForm.rekeningBank || ""}
                  onChange={(e) => setKelasForm({ ...kelasForm, rekeningBank: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Deskripsi Singkat Program</label>
                <textarea
                  placeholder="Ulasan pengantar materi pembelajaran..."
                  value={kelasForm.desc || ""}
                  onChange={(e) => setKelasForm({ ...kelasForm, desc: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8B5CF6] text-xxs font-mono uppercase font-black mb-1">
                  Jadwal Event (Format: Kota | Lokasi Hotel | Tanggal)
                </label>
                <textarea
                  placeholder="Malang | Grand Cakra Hotel | Sabtu, 11 Juli 2026&#10;Jakarta | Santika Premier | Sabtu, 11 Juli 2026"
                  value={tempJadwal}
                  onChange={(e) => setTempJadwal(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-medium font-mono outline-none bg-purple-50/50"
                />
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">
                  Materi Pokok (Satu baris per materi)
                </label>
                <textarea
                  placeholder="Home Is Where We Start From&#10;What is Attachment?&#10;Safe Haven dan Secure Base"
                  value={tempMateri}
                  onChange={(e) => setTempMateri(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-medium font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">
                  Kompetensi Akhir (Satu baris per kompetensi)
                </label>
                <textarea
                  placeholder="Memahami blueprint kelekatan batin&#10;Mampu melakukan fasilitasi asertif"
                  value={tempCompetence}
                  onChange={(e) => setTempCompetence(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-medium font-mono outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#8B5CF6] text-white border-2 border-black rounded-xl font-black text-xs shadow-sm hover:bg-[#FF71CF]"
                >
                  {editingId ? "Perbarui Informasi Kelas" : "Terbitkan Kelas Sertifikasi Baru"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForms} className="px-4 py-2 bg-white border-2 border-black text-black rounded-xl text-xs font-black">
                    Batal
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Form: INSTRUCTORS (Trainers & Pamong) */}
          {activeTab === "instructor" && (
            <form onSubmit={handleSaveInstructor} className="space-y-4">
              <div className="flex gap-2 p-1.5 border-2 border-black rounded-2xl bg-slate-50">
                <button
                  type="button"
                  onClick={() => { setInstructorType("trainer"); resetForms(); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all border ${
                    instructorType === "trainer" ? "bg-[#8B5CF6] text-white border-black shadow" : "bg-white text-slate-800 border-transparent hover:bg-slate-200"
                  }`}
                >
                  Trainers Utama
                </button>
                <button
                  type="button"
                  onClick={() => { setInstructorType("pamong"); resetForms(); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all border ${
                    instructorType === "pamong" ? "bg-[#FF71CF] text-black border-black shadow" : "bg-white text-slate-800 border-transparent hover:bg-slate-200"
                  }`}
                >
                  Pamong / Pendamping
                </button>
              </div>

              {instructorType === "trainer" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Nama Trainer</label>
                    <input
                      type="text"
                      required
                      placeholder="Fakhrun Siraj, CABP"
                      value={trainerForm.nama || ""}
                      onChange={(e) => setTrainerForm({ ...trainerForm, nama: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Gelar Profesional / Sertifikasi</label>
                    <input
                      type="text"
                      placeholder="CABP"
                      value={trainerForm.gelar || ""}
                      onChange={(e) => setTrainerForm({ ...trainerForm, gelar: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Pengalaman / Spesialisasi</label>
                    <input
                      type="text"
                      placeholder="Berpengalaman 10+ tahun, Penulis 75+ Buku"
                      value={trainerForm.pengalaman || ""}
                      onChange={(e) => setTrainerForm({ ...trainerForm, pengalaman: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Foto Trainer (URL)</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={trainerForm.foto || ""}
                      onChange={(e) => setTrainerForm({ ...trainerForm, foto: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Nama Pamong</label>
                    <input
                      type="text"
                      required
                      placeholder="Cin Hapsari"
                      value={pamongForm.nama || ""}
                      onChange={(e) => setPamongForm({ ...pamongForm, nama: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Pengalaman / Jabatan</label>
                    <input
                      type="text"
                      placeholder="Penulis & Pendamping Senior Jiwamu"
                      value={pamongForm.pengalaman || ""}
                      onChange={(e) => setPamongForm({ ...pamongForm, pengalaman: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">
                      Keahlian Pokok (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      placeholder="Relasi Pasutri, Attachment Anak, Inner Child"
                      value={tempKeahlian}
                      onChange={(e) => setTempKeahlian(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Foto Pamong (URL)</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={pamongForm.foto || ""}
                      onChange={(e) => setPamongForm({ ...pamongForm, foto: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#8B5CF6] text-white border-2 border-black rounded-xl font-black text-xs shadow-sm hover:bg-[#FF71CF]"
                >
                  {editingId ? "Perbarui Profil Pengajar" : `Daftarkan ${instructorType.toUpperCase()} Baru`}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForms} className="px-4 py-2 bg-white border-2 border-black text-black rounded-xl text-xs font-black">
                    Batal
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Form: KELOLA ADMIN ACCOUNTS */}
          {activeTab === "admin_mgmt" && loggedInUser.role === "superadmin" && (
            <form onSubmit={handleSaveAdminUser} className="space-y-4">
              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Email Administrator</label>
                <input
                  type="email"
                  required
                  disabled={!!editingId}
                  placeholder="e.g. dian@jiwamu.com"
                  value={adminForm.email || ""}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold font-mono outline-none disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Dian Pratama"
                  value={adminForm.nama || ""}
                  onChange={(e) => setAdminForm({ ...adminForm, nama: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">Hak Akses (Role)</label>
                <select
                  value={adminForm.role || "editor"}
                  disabled={adminForm.email?.toLowerCase() === "pratama.dianf@gmail.com"}
                  onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value as any })}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none bg-white disabled:bg-slate-100"
                >
                  <option value="editor">Editor (Hanya update konten)</option>
                  <option value="superadmin">Super Admin (Akses Penuh / CRM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xxs font-mono uppercase font-black text-slate-700 mb-1">
                  {editingId ? "Ganti Kata Sandi (Kosongkan jika tetap)" : "Tentukan Kata Sandi"}
                </label>
                <input
                  type="password"
                  required={!editingId}
                  placeholder={editingId ? "Ganti sandi baru..." : "Masukkan kata sandi..."}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-bold outline-none font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 text-white border-2 border-black rounded-xl font-black text-xs shadow-sm hover:bg-black hover:text-white"
                >
                  {editingId ? "Perbarui Akun Admin" : "Daftarkan Admin Baru"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForms} className="px-4 py-2 bg-white border-2 border-black text-black rounded-xl text-xs font-black">
                    Batal
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Form Side Dashboard for PELANGGAN / CRM */}
          {activeTab === "pelanggan" && (
            <div className="space-y-6 text-xs sm:text-sm font-bold text-[#1A1A1A]">
              <div className="bg-[#D9F99D] border-2 border-black p-4 rounded-xl shadow-sm">
                <h3 className="text-sm font-black mb-1">Total Pelanggan Majalah</h3>
                <p className="text-3xl font-black text-slate-950">{subscribers.length}</p>
                <p className="text-[10px] text-slate-700 font-bold mt-1">
                  ● Sinkronisasi dengan Google Firebase Firestore secara real-time
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">Info Distribusi</h4>
                <p className="text-slate-800 text-xs font-medium leading-relaxed">
                  Data nomor WhatsApp pelanggan ini digunakan untuk mengirimkan pemberitahuan terbitan bulanan Majalah Jiwamu yang resmi ber-ISSN dari BRIN. Anda dapat mengekspor data ini untuk diintegrasikan dengan tools pengirim WhatsApp broadcast otomatis.
                </p>
                <button
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," 
                      + ["Nama,WhatsApp,Tanggal"].join(",") + "\n"
                      + subscribers.map(s => `"${s.nama}","${s.whatsapp}","${s.tanggalBerlangganan}"`).join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `subscribers_jiwamu_${new Date().toISOString().slice(0,10)}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-full py-2 bg-[#FFD600] text-black border-2 border-black rounded-lg text-xs font-black hover:bg-white transition-all cursor-pointer shadow-sm active:translate-y-0.5"
                >
                  Ekspor CSV Pelanggan
                </button>
              </div>
            </div>
          )}

          {/* Form Side Dashboard for HASIL TES KELEKATAN */}
          {activeTab === "hasil_tes" && (() => {
            const total = testResults.length;
            const styleCounts: Record<string, number> = {
              "Secure": 0,
              "Anxious": 0,
              "Avoidant": 0,
              "Disorganized": 0
            };

            testResults.forEach(r => {
              const style = r.gayaKelekatan || "";
              if (style.toLowerCase().includes("secure") || style.toLowerCase().includes("aman")) {
                styleCounts["Secure"]++;
              } else if (style.toLowerCase().includes("anxious") || style.toLowerCase().includes("cemas")) {
                styleCounts["Anxious"]++;
              } else if (style.toLowerCase().includes("avoidant") || style.toLowerCase().includes("menghindar") && !style.toLowerCase().includes("disorganized") && !style.toLowerCase().includes("ketakutan")) {
                styleCounts["Avoidant"]++;
              } else {
                styleCounts["Disorganized"]++;
              }
            });

            const getPercentage = (count: number) => {
              if (total === 0) return 0;
              return Math.round((count / total) * 100);
            };

            return (
              <div className="space-y-6 text-xs sm:text-sm font-bold text-[#1A1A1A]">
                <div className="bg-[#BFDBFE] border-2 border-black p-4 rounded-xl shadow-sm">
                  <h3 className="text-sm font-black mb-1">Total Pengisi Tes</h3>
                  <p className="text-3xl font-black text-slate-950">{total}</p>
                  <p className="text-[10px] text-slate-700 font-bold mt-1">
                    ● Total tes psikologi tipe attachment terdaftar di cloud database
                  </p>
                </div>

                <div className="bg-white border-2 border-black p-4 rounded-xl space-y-3 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Distribusi Gaya Attachment</h4>
                  <div className="space-y-2 pt-1 font-sans">
                    {[
                      { key: "Secure", label: "Aman (Secure)", color: "bg-green-500" },
                      { key: "Anxious", label: "Cemas (Anxious)", color: "bg-yellow-500" },
                      { key: "Avoidant", label: "Menghindar (Avoidant)", color: "bg-orange-500" },
                      { key: "Disorganized", label: "Takut-Cemas (Disorganized)", color: "bg-purple-600" }
                    ].map(st => {
                      const pct = getPercentage(styleCounts[st.key]);
                      return (
                        <div key={st.key} className="space-y-1">
                          <div className="flex justify-between text-xxs font-bold text-slate-700">
                            <span>{st.label} ({styleCounts[st.key]} orang)</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 border border-black rounded-full overflow-hidden">
                            <div className={`${st.color} h-full`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8," 
                        + ["Nama,WhatsApp,Style,Cemas,Menghindar,Tanggal"].join(",") + "\n"
                        + testResults.map(r => `"${r.nama}","${r.whatsapp}","${r.gayaKelekatan}","${r.anxietyScore}","${r.avoidanceScore}","${r.tanggalTes}"`).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `attachment_test_results_${new Date().toISOString().slice(0,10)}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-full py-2 bg-[#8B5CF6] text-white border-2 border-black rounded-lg text-xs font-black hover:bg-black transition-all cursor-pointer shadow-sm mt-3"
                  >
                    Ekspor CSV Hasil Tes
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        {/* RIGHT COLUMN: SEARCH & CONTENT LISTINGS */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border-2 border-black brutal-shadow h-fit">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <h2 className="font-sans text-sm font-extrabold uppercase tracking-wider text-black flex items-center gap-1">
              <span>Database Konten:</span>
              <span className="text-[#FF71CF] font-black">{activeTab.toUpperCase()}</span>
            </h2>
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border-2 border-black rounded-xl text-xs font-semibold outline-none"
              />
            </div>
          </div>

          <div className="max-h-[640px] overflow-y-auto pr-2">
            
            {/* List: ARTIKEL */}
            {activeTab === "artikel" && artikelList
              .filter(a => a.judul.toLowerCase().includes(searchQuery.toLowerCase()) || a.ringkasan.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((art) => (
                <div key={art.id} className="p-3 border-2 border-black rounded-xl hover:bg-[#FDF4FF] transition-all flex justify-between items-start gap-4 mb-3 brutal-shadow-sm bg-white animate-fade-in">
                  <div className="flex gap-3 items-center">
                    {art.imageUrl ? (
                      <img 
                        src={getUnsplashDirectUrl(art.imageUrl)} 
                        alt={art.judul} 
                        className="w-12 h-12 object-cover rounded-lg border border-black bg-slate-50 shrink-0" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 flex items-center justify-center rounded-lg border border-black text-slate-400 font-mono text-[9px] shrink-0">No Img</div>
                    )}
                    <div className="space-y-0.5">
                      <div className="flex gap-1.5 items-center flex-wrap">
                        <span className="bg-purple-100 text-[#8B5CF6] text-[9px] font-black px-1.5 py-0.5 border border-black rounded-md">{art.kategori}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-bold">{art.tanggal}</span>
                      </div>
                      <h3 className="font-sans font-extrabold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-1">{art.judul}</h3>
                      <p className="text-[10px] text-slate-500 font-semibold line-clamp-1">{art.ringkasan}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => handleStartEdit(art, "artikel")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-[#FF71CF] text-black cursor-pointer shadow-sm active:translate-y-0.5">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(art.id, "artikel")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-red-500 hover:text-white text-red-500 cursor-pointer shadow-sm active:translate-y-0.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

            {/* List: VIDEO */}
            {activeTab === "video" && videoList
              .filter(v => v.judul.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((vid) => (
                <div key={vid.id} className="p-3 border-2 border-black rounded-xl hover:bg-[#FDF4FF] transition-all flex justify-between items-start gap-4 mb-3 brutal-shadow-sm bg-white animate-fade-in">
                  <div className="flex gap-3 items-center">
                    <img src={vid.thumbnail} alt={vid.judul} className="w-16 h-10 object-cover rounded border border-black bg-slate-900 shrink-0" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#8B5CF6] font-mono font-black">YouTube ID: {vid.youtubeId}</span>
                      <h3 className="font-sans font-extrabold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-1">{vid.judul}</h3>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => handleStartEdit(vid, "video")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-[#FF71CF] text-black cursor-pointer shadow-sm active:translate-y-0.5">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(vid.id, "video")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-red-500 hover:text-white text-red-500 cursor-pointer shadow-sm active:translate-y-0.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

            {/* List: BUKU */}
            {activeTab === "buku" && bukuList
              .filter(b => b.judul.toLowerCase().includes(searchQuery.toLowerCase()) || b.pengarang.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((buk) => (
                <div key={buk.slug} className="p-3 border-2 border-black rounded-xl hover:bg-[#FDF4FF] transition-all flex justify-between items-start gap-4 mb-3 brutal-shadow-sm bg-white animate-fade-in">
                  <div className="flex gap-3 items-center">
                    <img src={buk.cover} alt={buk.judul} className="w-10 h-14 object-cover rounded border border-black bg-slate-100 shrink-0" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 font-mono font-bold">Rp {buk.harga.toLocaleString("id-ID")}</span>
                      <h3 className="font-sans font-extrabold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-1">{buk.judul}</h3>
                      <p className="text-[10px] text-slate-600 font-semibold">{buk.pengarang}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => handleStartEdit(buk, "buku")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-[#FF71CF] text-black cursor-pointer shadow-sm active:translate-y-0.5">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(buk.slug, "buku")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-red-500 hover:text-white text-red-500 cursor-pointer shadow-sm active:translate-y-0.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

            {/* List: MAJALAH */}
            {activeTab === "majalah" && majalahList
              .filter(m => m.tema.toLowerCase().includes(searchQuery.toLowerCase()) || m.nomor.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((maj) => (
                <div key={maj.id} className="p-3 border-2 border-black rounded-xl hover:bg-[#FDF4FF] transition-all flex justify-between items-start gap-4 mb-3 brutal-shadow-sm bg-white animate-fade-in">
                  <div className="flex gap-3 items-center">
                    <img src={maj.cover} alt={maj.tema} className="w-10 h-14 object-cover rounded border border-black bg-slate-100 shrink-0" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 font-mono font-bold">{maj.id} ({maj.bulanTahun})</span>
                      <h3 className="font-sans font-extrabold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-1">Tema: {maj.tema}</h3>
                      <p className="text-[10px] text-slate-600 font-semibold">{maj.nomor}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => handleStartEdit(maj, "majalah")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-[#FF71CF] text-black cursor-pointer shadow-sm active:translate-y-0.5">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(maj.id, "majalah")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-red-500 hover:text-white text-red-500 cursor-pointer shadow-sm active:translate-y-0.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

            {/* List: RISET PROYEK */}
            {activeTab === "proyek" && proyekList
              .filter(p => p.judul.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((pro) => (
                <div key={pro.id} className="p-3 border-2 border-black rounded-xl hover:bg-[#FDF4FF] transition-all flex justify-between items-start gap-4 mb-3 brutal-shadow-sm bg-white animate-fade-in">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[9px] font-black px-2.5 py-0.5 border border-black rounded-full shadow-sm ${
                        pro.status === "berjalan" ? "bg-[#FF71CF] text-black" : "bg-slate-200 text-slate-600"
                      }`}>
                        {pro.status === "berjalan" ? "Berjalan" : "Selesai"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono font-bold">ID: {pro.id}</span>
                    </div>
                    <h3 className="font-sans font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">{pro.judul}</h3>
                    <p className="text-[11px] text-slate-600 font-semibold">
                      Rp {pro.danaTerkumpul.toLocaleString("id-ID")} / Rp {pro.target.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => handleStartEdit(pro, "proyek")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-[#FF71CF] text-black cursor-pointer shadow-sm active:translate-y-0.5">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(pro.id, "proyek")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-red-500 hover:text-white text-red-500 cursor-pointer shadow-sm active:translate-y-0.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

            {/* List: KELOLA KELAS */}
            {activeTab === "kelas" && classesList
              .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((cls) => (
                <div key={cls.id} className="p-4 border-2 border-black rounded-xl hover:bg-purple-50/20 transition-all flex justify-between items-start gap-4 mb-3 brutal-shadow-sm bg-white animate-fade-in">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-white bg-purple-600 border border-black px-2 py-0.5 rounded font-black">{cls.code}</span>
                      <span className="text-[10px] font-semibold text-slate-500">{cls.level}</span>
                    </div>
                    <h3 className="font-sans font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">{cls.title}</h3>
                    <p className="text-xxs text-slate-500 line-clamp-2">{cls.desc}</p>
                    <div className="flex gap-3 text-[10px] text-slate-600 font-bold pt-1">
                      <span>Harga: {cls.price}</span>
                      <span>•</span>
                      <span>Durasi: {cls.duration}</span>
                    </div>
                    {cls.jadwal && cls.jadwal.length > 0 && (
                      <div className="mt-2 border-t border-dashed border-slate-100 pt-2">
                        <span className="text-[9px] font-mono uppercase text-slate-400 font-black">Jadwal Terdekat:</span>
                        <div className="space-y-1 mt-1">
                          {cls.jadwal.map((j: any, i: number) => (
                            <div key={i} className="text-[10px] text-slate-700 bg-slate-50 border border-slate-200/50 rounded p-1 flex justify-between">
                              <span><strong>{j.city}</strong> ({j.hotel})</span>
                              <span className="font-mono font-bold text-xxs text-[#8B5CF6]">{j.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => handleStartEdit(cls, "kelas")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-[#FF71CF] text-black cursor-pointer shadow-sm active:translate-y-0.5">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(cls.id, "kelas")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-red-500 hover:text-white text-red-500 cursor-pointer shadow-sm active:translate-y-0.5">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

            {/* List: INSTRUCTORS */}
            {activeTab === "instructor" && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] font-mono font-black uppercase text-[#8B5CF6]">Database Trainer Utama</span>
                  <div className="mt-2 space-y-2">
                    {trainersList
                      .filter(t => t.nama.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(tr => (
                        <div key={tr.id} className="p-3 bg-white border-2 border-black rounded-xl flex justify-between items-center gap-3">
                          <div className="flex gap-3 items-center">
                            <img src={tr.foto} alt={tr.nama} className="w-9 h-9 object-cover rounded-full border border-black shrink-0 bg-slate-100" />
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-black text-slate-900">{tr.nama}</h4>
                              <p className="text-[10px] text-[#8B5CF6] font-mono font-bold">{tr.gelar || "CABP"} • {tr.pengalaman}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => handleStartEdit(tr, "trainer")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-[#FF71CF] text-black cursor-pointer">
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleDelete(tr.id!, "trainer")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-red-500 hover:text-white text-red-500 cursor-pointer">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] font-mono font-black uppercase text-[#FF71CF]">Database Pamong & Pendamping</span>
                  <div className="mt-2 space-y-2">
                    {pamongList
                      .filter(p => p.nama.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(pmg => (
                        <div key={pmg.id} className="p-3 bg-white border-2 border-black rounded-xl flex justify-between items-center gap-3">
                          <div className="flex gap-3 items-center">
                            <img src={pmg.foto} alt={pmg.nama} className="w-9 h-9 object-cover rounded-full border border-black shrink-0 bg-slate-100" />
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-black text-slate-900">{pmg.nama}</h4>
                              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{pmg.pengalaman}</p>
                              {pmg.keahlian && pmg.keahlian.length > 0 && (
                                <div className="flex gap-1 flex-wrap pt-0.5">
                                  {pmg.keahlian.map((kh: string, i: number) => (
                                    <span key={i} className="text-[8px] bg-slate-100 border text-slate-600 px-1.5 rounded-full">{kh}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => handleStartEdit(pmg, "pamong")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-[#FF71CF] text-black cursor-pointer">
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleDelete(pmg.id!, "pamong")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-red-500 hover:text-white text-red-500 cursor-pointer">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* List: KELOLA ADMIN ACCOUNTS */}
            {activeTab === "admin_mgmt" && loggedInUser.role === "superadmin" && (
              <div className="space-y-3">
                {adminUsers
                  .filter(a => a.nama.toLowerCase().includes(searchQuery.toLowerCase()) || a.email.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((adm) => (
                    <div key={adm.email} className="p-4 border-2 border-black rounded-xl hover:bg-purple-50/20 transition-all flex justify-between items-center gap-4 brutal-shadow-sm bg-white animate-fade-in">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-sans font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">{adm.nama}</h3>
                          {adm.role === "superadmin" ? (
                            <span className="text-[8px] font-mono text-white bg-purple-600 border border-black px-1.5 py-0.5 rounded font-black uppercase">Super Admin</span>
                          ) : (
                            <span className="text-[8px] font-mono text-slate-800 bg-blue-100 border border-black px-1.5 py-0.5 rounded font-black uppercase">Editor</span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-[#8B5CF6] font-black">{adm.email}</p>
                        <p className="text-[9px] text-slate-400 font-semibold">Aktif sejak: {adm.createdAt ? new Date(adm.createdAt).toLocaleDateString("id-ID") : "-"}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={() => handleStartEdit(adm, "admin")} className="p-2 border border-black rounded-lg bg-white hover:bg-black hover:text-white cursor-pointer shadow-sm active:translate-y-0.5">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(adm.email, "admin")} 
                          disabled={adm.email === "pratama.dianf@gmail.com"}
                          className="p-2 border border-black rounded-lg bg-white hover:bg-red-500 hover:text-white text-red-500 cursor-pointer shadow-sm active:translate-y-0.5 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* List: PELANGGAN (Read-only for CRM) */}
            {activeTab === "pelanggan" && (
              <div className="space-y-3">
                {loadingSubscribers && (
                  <p className="text-xs font-bold text-slate-500 animate-pulse py-4 text-center">Memuat data dari Firestore...</p>
                )}
                {!loadingSubscribers && subscribers.length === 0 && (
                  <p className="text-xs text-slate-400 font-bold py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">Belum ada pelanggan terdaftar.</p>
                )}
                {subscribers
                  .filter(s => s.nama.toLowerCase().includes(searchQuery.toLowerCase()) || s.whatsapp.includes(searchQuery))
                  .map((sub) => (
                    <div key={sub.id} className="p-4 border-2 border-black rounded-xl hover:bg-[#FDF4FF] transition-all flex justify-between items-center gap-4 brutal-shadow-sm bg-white animate-fade-in">
                      <div className="space-y-1">
                        <h3 className="font-sans font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">{sub.nama}</h3>
                        <p className="text-xs font-mono text-[#8B5CF6] font-black">{sub.whatsapp}</p>
                        <div className="flex gap-2 items-center text-[10px] text-slate-500 font-semibold">
                          <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-600">{sub.sumber || "Majalah Sub"}</span>
                          <span>•</span>
                          <span>{sub.tanggalBerlangganan ? new Date(sub.tanggalBerlangganan).toLocaleString("id-ID") : "-"}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteSubscriber(sub.id)} 
                        className="p-2 border border-black rounded-lg bg-white hover:bg-red-500 hover:text-white text-red-500 cursor-pointer shadow-sm active:translate-y-0.5 shrink-0"
                        title="Hapus dari Firestore"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {/* List: HASIL TES KELEKATAN (Read-only for CRM) */}
            {activeTab === "hasil_tes" && (
              <div className="space-y-3">
                {loadingTestResults && (
                  <p className="text-xs font-bold text-slate-500 animate-pulse py-4 text-center">Memuat data dari Firestore...</p>
                )}
                {!loadingTestResults && testResults.length === 0 && (
                  <p className="text-xs text-slate-400 font-bold py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">Belum ada hasil tes masuk.</p>
                )}
                {testResults
                  .filter(r => r.nama.toLowerCase().includes(searchQuery.toLowerCase()) || r.gayaKelekatan?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((res) => {
                    const style = res.gayaKelekatan || "";
                    let colorClass = "bg-slate-200 text-slate-800";
                    if (style.toLowerCase().includes("secure") || style.toLowerCase().includes("aman")) colorClass = "bg-[#D9F99D] text-black border-green-400";
                    else if (style.toLowerCase().includes("anxious") || style.toLowerCase().includes("cemas")) colorClass = "bg-[#FEF08A] text-black border-yellow-400";
                    else if (style.toLowerCase().includes("avoidant") || style.toLowerCase().includes("menghindar") && !style.toLowerCase().includes("disorganized")) colorClass = "bg-[#F97316] text-white border-orange-500";
                    else colorClass = "bg-[#8B5CF6] text-white border-purple-500";

                    return (
                      <div key={res.id} className="p-4 border-2 border-black rounded-xl hover:bg-[#FDF4FF] transition-all flex justify-between items-center gap-4 brutal-shadow-sm bg-white animate-fade-in">
                        <div className="space-y-1">
                          <div className="flex gap-2 items-center flex-wrap">
                            <span className={`text-[9px] font-black px-2 py-0.5 border border-black rounded-md ${colorClass}`}>
                              {style}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono font-bold">
                              Cemas: {res.anxietyScore} | Menghindar: {res.avoidanceScore}
                            </span>
                          </div>
                          <h3 className="font-sans font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">{res.nama}</h3>
                          <p className="text-xs font-mono text-[#8B5CF6] font-black">{res.whatsapp}</p>
                          <p className="text-[10px] text-slate-500 font-semibold">
                            Waktu Tes: {res.tanggalTes ? new Date(res.tanggalTes).toLocaleString("id-ID") : "-"}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleDeleteTestResult(res.id)} 
                          className="p-2 border border-black rounded-lg bg-white hover:bg-red-500 hover:text-white text-red-500 cursor-pointer shadow-sm active:translate-y-0.5 shrink-0"
                          title="Hapus dari Firestore"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Helper delete callbacks
  async function handleDeleteSubscriber(id: string) {
    if (loggedInUser?.role !== "superadmin") {
      alert("Akses Terbatas: Hanya Super Admin yang diizinkan menghapus data log.");
      return;
    }
    if (!confirm("Apakah Anda yakin ingin menghapus pelanggan ini dari database Firestore?")) return;
    try {
      await deleteDoc(doc(db, "subscribers", id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus.");
    }
  }

  async function handleDeleteTestResult(id: string) {
    if (loggedInUser?.role !== "superadmin") {
      alert("Akses Terbatas: Hanya Super Admin yang diizinkan menghapus data log.");
      return;
    }
    if (!confirm("Apakah Anda yakin ingin menghapus hasil tes ini dari database Firestore?")) return;
    try {
      await deleteDoc(doc(db, "test_results", id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus.");
    }
  }
}
