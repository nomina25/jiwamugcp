import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Lock, Unlock, Database, Plus, Trash2, Edit2, Check, FileText, Video, BookOpen, Layers, TrendingUp, Users, Heart } from "lucide-react";
import { Buku, Proyek, Artikel, VideoItem, MajalahEdisi } from "../types";
import { db } from "../firebase";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";

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
}

export default function Admin({
  bukuList, setBukuList,
  proyekList, setProyekList,
  artikelList, setArtikelList,
  videoList, setVideoList,
  majalahList, setMajalahList
}: AdminProps) {
  const [token, setToken] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"artikel" | "video" | "buku" | "majalah" | "proyek" | "pelanggan" | "hasil_tes">("artikel");
  const [errorMsg, setErrorMsg] = useState("");

  // Live Firebase CRM States
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [loadingTestResults, setLoadingTestResults] = useState(false);

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

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pelanggan ini dari database Firestore?")) return;
    try {
      await deleteDoc(doc(db, "subscribers", id));
    } catch (err) {
      console.error("Error deleting subscriber document:", err);
      alert("Gagal menghapus data dari Firestore.");
    }
  };

  const handleDeleteTestResult = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus hasil tes ini dari database Firestore?")) return;
    try {
      await deleteDoc(doc(db, "test_results", id));
    } catch (err) {
      console.error("Error deleting test result document:", err);
      alert("Gagal menghapus data dari Firestore.");
    }
  };

  // Editing states
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
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
    id: "", judul: "", ringkasan: "", konten: "", penulis: "Staf Jiwamu", tanggal: "05 Juli 2026", kategori: "Umum", bacaMilik: "5 menit membaca"
  });

  const [videoForm, setVideoForm] = useState<Partial<VideoItem>>({
    id: "", judul: "", durasi: "10:00", youtubeId: "dQw4w9WgXcQ", thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3", deskripsi: ""
  });

  const [majalahForm, setMajalahForm] = useState<Partial<MajalahEdisi>>({
    id: "", nomor: "Edisi Baru", bulanTahun: "Juli 2026", tema: "", deskripsi: "", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f", pdfUrl: "#"
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim() === "pamongjiwa") {
      setIsAuthorized(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Token tidak valid. Silakan gunakan token 'pamongjiwa'");
    }
  };

  // Helper for markdown toolbar
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

  // CRUD Actions
  const handleSaveArtikel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artikelForm.judul) return;

    if (editingId) {
      setArtikelList(artikelList.map(a => a.id === editingId ? { ...a, ...artikelForm } as Artikel : a));
    } else {
      const newArt: Artikel = {
        id: `art-${Date.now()}`,
        judul: artikelForm.judul || "",
        ringkasan: artikelForm.ringkasan || "",
        konten: artikelForm.konten || "",
        penulis: artikelForm.penulis || "Staf Jiwamu",
        tanggal: artikelForm.tanggal || "05 Juli 2026",
        kategori: artikelForm.kategori || "Umum",
        bacaMilik: artikelForm.bacaMilik || "5 menit"
      };
      setArtikelList([newArt, ...artikelList]);
    }
    resetForms();
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.judul) return;

    if (editingId) {
      setVideoList(videoList.map(v => v.id === editingId ? { ...v, ...videoForm } as VideoItem : v));
    } else {
      const newVid: VideoItem = {
        id: `vid-${Date.now()}`,
        judul: videoForm.judul || "",
        durasi: videoForm.durasi || "10:00",
        youtubeId: videoForm.youtubeId || "",
        thumbnail: videoForm.thumbnail || "",
        deskripsi: videoForm.deskripsi || ""
      };
      setVideoList([newVid, ...videoList]);
    }
    resetForms();
  };

  const handleSaveBuku = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bukuForm.judul) return;

    const listContents = tempDaftarIsi ? tempDaftarIsi.split("\n").filter(Boolean) : [];

    const updatedBuku = {
      ...bukuForm,
      daftarIsi: listContents
    } as Buku;

    if (editingId) {
      setBukuList(bukuList.map(b => b.slug === editingId ? updatedBuku : b));
    } else {
      const newSlug = bukuForm.judul?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `buku-${Date.now()}`;
      setBukuList([{ ...updatedBuku, slug: newSlug }, ...bukuList]);
    }
    resetForms();
  };

  const handleSaveMajalah = (e: React.FormEvent) => {
    e.preventDefault();
    if (!majalahForm.tema) return;

    if (editingId) {
      setMajalahList(majalahList.map(m => m.id === editingId ? { ...m, ...majalahForm } as MajalahEdisi : m));
    } else {
      const newId = `Ed. ${majalahList.length + 1}/${new Date().getFullYear()}`;
      setMajalahList([{ ...majalahForm, id: newId } as MajalahEdisi, ...majalahList]);
    }
    resetForms();
  };

  const handleSaveProyek = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proyekForm.judul) return;

    if (editingId) {
      setProyekList(proyekList.map(p => p.id === editingId ? { ...p, ...proyekForm } as Proyek : p));
    } else {
      const newId = String(proyekList.length + 1).padStart(3, "0");
      setProyekList([{ ...proyekForm, id: newId } as Proyek, ...proyekList]);
    }
    resetForms();
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
      id: "", judul: "", ringkasan: "", konten: "", penulis: "Staf Jiwamu", tanggal: "05 Juli 2026", kategori: "Umum", bacaMilik: "5 menit membaca"
    });
    setVideoForm({
      id: "", judul: "", durasi: "10:00", youtubeId: "dQw4w9WgXcQ", thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3", deskripsi: ""
    });
    setMajalahForm({
      id: "", nomor: "Edisi Baru", bulanTahun: "Juli 2026", tema: "", deskripsi: "", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f", pdfUrl: "#"
    });
  };

  const handleDelete = (id: string, type: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus item ini?`)) return;
    if (type === "artikel") setArtikelList(artikelList.filter(a => a.id !== id));
    if (type === "video") setVideoList(videoList.filter(v => v.id !== id));
    if (type === "buku") setBukuList(bukuList.filter(b => b.slug !== id));
    if (type === "majalah") setMajalahList(majalahList.filter(m => m.id !== id));
    if (type === "proyek") setProyekList(proyekList.filter(p => p.id !== id));
  };

  const handleStartEdit = (item: any, type: string) => {
    setEditingId(type === "buku" ? item.slug : item.id);
    if (type === "artikel") setArtikelForm(item);
    if (type === "video") setVideoForm(item);
    if (type === "buku") {
      setBukuForm(item);
      setTempDaftarIsi(item.daftarIsi.join("\n"));
    }
    if (type === "majalah") setMajalahForm(item);
    if (type === "proyek") setProyekForm(item);
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto py-24 px-4">
        <div className="bg-white rounded-3xl p-8 border-4 border-black brutal-shadow text-center">
          <div className="inline-flex p-3 rounded-2xl bg-[#FFD600] border-2 border-black text-black mb-4 shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-sans text-xl font-extrabold text-slate-900 mb-2">Akses Terbatas: Admin Console</h2>
          <p className="text-xs text-slate-700 font-bold mb-6">
            Silakan masukkan token admin untuk menyunting materi website Jiwamu.
            <br />
            <span className="text-[#8B5CF6] font-mono text-xxs mt-2 block font-black bg-[#FDF4FF] py-1 border border-black rounded-md">Petunjuk: Masukkan token 'pamongjiwa'</span>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                id="admin-token-input"
                type="password"
                placeholder="Masukkan Token Sandi"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] font-mono font-bold shadow-sm"
              />
            </div>
            {errorMsg && <p className="text-xs text-red-600 font-black">{errorMsg}</p>}
            <button
              id="admin-submit-btn"
              type="submit"
              className="w-full py-3 bg-[#8B5CF6] text-white border-2 border-black rounded-xl font-black transition-all text-sm cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none hover:bg-[#FF71CF] hover:text-black"
            >
              Masuk Konsol Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-black pb-6 mb-8 gap-4">
        <div>
          <span className="text-xs font-mono text-black bg-[#FF71CF] border border-black px-2.5 py-1 rounded-full font-black flex items-center gap-1 shadow-sm w-fit">
            <Unlock className="w-3.5 h-3.5" /> ADMIN ACTIVE ACCESS
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-black text-slate-900 pt-3">Jiwamu CMS Dashboard</h1>
          <p className="text-xs text-slate-700 font-semibold pt-1">Gunakan antarmuka ini untuk melakukan simulasi pembaruan data secara real-time pada seluruh halaman website.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAuthorized(false)}
            className="px-4 py-2 bg-white border-2 border-black text-black text-xs font-black rounded-xl hover:bg-[#FF71CF] transition-all cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none"
          >
            Keluar (Lock)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b-2 border-black pb-4">
        {[
          { key: "artikel", label: "Artikel", icon: FileText },
          { key: "video", label: "Video Talks", icon: Video },
          { key: "buku", label: "Katalog Buku", icon: BookOpen },
          { key: "majalah", label: "Majalah Bulanan", icon: Layers },
          { key: "proyek", label: "Riset Proyek", icon: TrendingUp },
          { key: "pelanggan", label: "Pelanggan Majalah", icon: Users },
          { key: "hasil_tes", label: "Hasil Tes Kelekatan", icon: Heart }
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Form Column */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border-2 border-black brutal-shadow h-fit">
          <h2 className="font-sans text-sm font-extrabold uppercase tracking-wider text-[#8B5CF6] mb-4 flex items-center gap-2">
            <Database className="w-4 h-4" />
            {activeTab === "pelanggan" || activeTab === "hasil_tes" 
              ? "Dashboard Analisis CRM" 
              : (editingId ? "Edit Item Terpilih" : `Tambah ${activeTab.toUpperCase()}`)}
          </h2>

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
                  Data nomor WhatsApp pelanggan ini digunakan untuk mengirimkan pemberitahuan terbitan bulanan Majalah Jiwamu yang resmi ber-ISSN dari BRIN. Anda dapat mengimpor data ini untuk diintegrasikan dengan tools pengirim WhatsApp broadcast otomatis.
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
                    ● Terhubung langsung ke database Firebase Firestore
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">Distribusi Gaya Kelekatan</h4>
                  
                  {total === 0 ? (
                    <p className="text-xs text-slate-400 font-bold">Belum ada data hasil tes yang masuk.</p>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xxs font-black text-emerald-800 mb-1">
                          <span>Aman (Secure)</span>
                          <span>{styleCounts["Secure"]} ({getPercentage(styleCounts["Secure"])}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                          <div className="bg-[#D9F99D] h-full" style={{ width: `${getPercentage(styleCounts["Secure"])}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xxs font-black text-amber-800 mb-1">
                          <span>Cemas (Anxious)</span>
                          <span>{styleCounts["Anxious"]} ({getPercentage(styleCounts["Anxious"])}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                          <div className="bg-[#FEF08A] h-full" style={{ width: `${getPercentage(styleCounts["Anxious"])}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xxs font-black text-orange-800 mb-1">
                          <span>Menghindar (Avoidant)</span>
                          <span>{styleCounts["Avoidant"]} ({getPercentage(styleCounts["Avoidant"])}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                          <div className="bg-[#F97316] h-full" style={{ width: `${getPercentage(styleCounts["Avoidant"])}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xxs font-black text-purple-800 mb-1">
                          <span>Disorganisasi (Disorganized)</span>
                          <span>{styleCounts["Disorganized"]} ({getPercentage(styleCounts["Disorganized"])}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                          <div className="bg-[#8B5CF6] h-full" style={{ width: `${getPercentage(styleCounts["Disorganized"])}%` }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8," 
                        + ["Nama,WhatsApp,Gaya Kelekatan,Skor Cemas,Skor Menghindar,Tanggal"].join(",") + "\n"
                        + testResults.map(t => `"${t.nama}","${t.whatsapp}","${t.gayaKelekatan}",${t.anxietyScore},${t.avoidanceScore},"${t.tanggalTes}"`).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `attachment_test_jiwamu_${new Date().toISOString().slice(0,10)}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-full py-2 bg-[#FF71CF] text-black border-2 border-black rounded-lg text-xs font-black hover:bg-white transition-all cursor-pointer shadow-sm active:translate-y-0.5"
                  >
                    Ekspor CSV Hasil Tes
                  </button>
                </div>
              </div>
            );
          })()}

          {activeTab === "artikel" && (
            <form onSubmit={handleSaveArtikel} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Judul Artikel</label>
                <input
                  id="art-form-judul"
                  type="text"
                  value={artikelForm.judul || ""}
                  onChange={e => setArtikelForm({ ...artikelForm, judul: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                  placeholder="Ketik judul artikel..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Kategori</label>
                  <input
                    id="art-form-kategori"
                    type="text"
                    value={artikelForm.kategori || ""}
                    onChange={e => setArtikelForm({ ...artikelForm, kategori: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                    placeholder="e.g. Kelekatan"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Durasi Baca</label>
                  <input
                    id="art-form-bacamilik"
                    type="text"
                    value={artikelForm.bacaMilik || ""}
                    onChange={e => setArtikelForm({ ...artikelForm, bacaMilik: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                    placeholder="e.g. 5 menit membaca"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Penulis</label>
                <input
                  id="art-form-penulis"
                  type="text"
                  value={artikelForm.penulis || ""}
                  onChange={e => setArtikelForm({ ...artikelForm, penulis: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Ringkasan Pendek</label>
                <textarea
                  id="art-form-ringkasan"
                  rows={2}
                  value={artikelForm.ringkasan || ""}
                  onChange={e => setArtikelForm({ ...artikelForm, ringkasan: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                  placeholder="Ringkasan di halaman depan..."
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xxs font-black text-slate-500 uppercase">Konten Lengkap</label>
                  <div className="flex gap-1">
                    {["B", "I", "H2", "H3", "List", "Quote", "Link"].map(tool => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => appendMarkdown("konten", setArtikelForm, artikelForm, tool)}
                        className="px-1.5 py-0.5 border border-black bg-white hover:bg-[#FFD600] text-black text-xxs font-mono font-black rounded shadow-sm cursor-pointer"
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  id="art-form-konten"
                  rows={6}
                  value={artikelForm.konten || ""}
                  onChange={e => setArtikelForm({ ...artikelForm, konten: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-mono font-semibold"
                  placeholder="Ketik isi artikel dengan markdown..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-[#8B5CF6] text-white border-2 border-black font-black rounded-lg text-xs cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none hover:bg-[#FF71CF] hover:text-black">
                  {editingId ? "Update Artikel" : "Simpan Artikel"}
                </button>
                <button type="button" onClick={resetForms} className="px-4 py-2 bg-white border-2 border-black text-black font-black rounded-lg text-xs cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none">Batal</button>
              </div>
            </form>
          )}

          {activeTab === "video" && (
            <form onSubmit={handleSaveVideo} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Judul Video</label>
                <input
                  id="vid-form-judul"
                  type="text"
                  value={videoForm.judul || ""}
                  onChange={e => setVideoForm({ ...videoForm, judul: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Durasi</label>
                  <input
                    id="vid-form-durasi"
                    type="text"
                    value={videoForm.durasi || ""}
                    onChange={e => setVideoForm({ ...videoForm, durasi: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                    placeholder="e.g. 15:40"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-black text-slate-500 uppercase mb-1">YouTube Video ID</label>
                  <input
                    id="vid-form-ytid"
                    type="text"
                    value={videoForm.youtubeId || ""}
                    onChange={e => setVideoForm({ ...videoForm, youtubeId: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                    placeholder="e.g. dQw4w9WgXcQ"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Thumbnail URL</label>
                <input
                  id="vid-form-thumb"
                  type="text"
                  value={videoForm.thumbnail || ""}
                  onChange={e => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Deskripsi Singkat</label>
                <textarea
                  id="vid-form-desc"
                  rows={3}
                  value={videoForm.deskripsi || ""}
                  onChange={e => setVideoForm({ ...videoForm, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-[#8B5CF6] text-white border-2 border-black font-black rounded-lg text-xs cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none hover:bg-[#FF71CF] hover:text-black">Simpan Video</button>
                <button type="button" onClick={resetForms} className="px-4 py-2 bg-white border-2 border-black text-black font-black rounded-lg text-xs cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none">Batal</button>
              </div>
            </form>
          )}

          {activeTab === "buku" && (
            <form onSubmit={handleSaveBuku} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Judul Buku</label>
                <input
                  id="buku-form-judul"
                  type="text"
                  value={bukuForm.judul || ""}
                  onChange={e => setBukuForm({ ...bukuForm, judul: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Pengarang</label>
                  <input
                    id="buku-form-pengarang"
                    type="text"
                    value={bukuForm.pengarang || ""}
                    onChange={e => setBukuForm({ ...bukuForm, pengarang: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Harga (Rp)</label>
                  <input
                    id="buku-form-harga"
                    type="number"
                    value={bukuForm.harga || 0}
                    onChange={e => setBukuForm({ ...bukuForm, harga: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Tahun Terbit</label>
                  <input
                    id="buku-form-tahun"
                    type="number"
                    value={bukuForm.tahun || 2026}
                    onChange={e => setBukuForm({ ...bukuForm, tahun: parseInt(e.target.value) || 2026 })}
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Halaman</label>
                  <input
                    id="buku-form-halaman"
                    type="number"
                    value={bukuForm.halaman || 200}
                    onChange={e => setBukuForm({ ...bukuForm, halaman: parseInt(e.target.value) || 200 })}
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Cover URL</label>
                <input
                  id="buku-form-cover"
                  type="text"
                  value={bukuForm.cover || ""}
                  onChange={e => setBukuForm({ ...bukuForm, cover: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Deskripsi Buku</label>
                <textarea
                  id="buku-form-desc"
                  rows={3}
                  value={bukuForm.deskripsi || ""}
                  onChange={e => setBukuForm({ ...bukuForm, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Daftar Isi (Satu baris per bab)</label>
                <textarea
                  id="buku-form-daftarisi"
                  rows={3}
                  value={tempDaftarIsi}
                  onChange={e => setTempDaftarIsi(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-mono font-bold"
                  placeholder="Bab 1: Pengantar&#10;Bab 2: Pembahasan..."
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-[#8B5CF6] text-white border-2 border-black font-black rounded-lg text-xs cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none hover:bg-[#FF71CF] hover:text-black">Simpan Buku</button>
                <button type="button" onClick={resetForms} className="px-4 py-2 bg-white border-2 border-black text-black font-black rounded-lg text-xs cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none">Batal</button>
              </div>
            </form>
          )}

          {activeTab === "majalah" && (
            <form onSubmit={handleSaveMajalah} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Tema Utama</label>
                <input
                  id="maj-form-tema"
                  type="text"
                  value={majalahForm.tema || ""}
                  onChange={e => setMajalahForm({ ...majalahForm, tema: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                  placeholder="e.g. Ruang Aman Relasi"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Nomor Edisi</label>
                  <input
                    id="maj-form-nomor"
                    type="text"
                    value={majalahForm.nomor || ""}
                    onChange={e => setMajalahForm({ ...majalahForm, nomor: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                    placeholder="e.g. Edisi 22"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Bulan/Tahun</label>
                  <input
                    id="maj-form-bulantahun"
                    type="text"
                    value={majalahForm.bulanTahun || ""}
                    onChange={e => setMajalahForm({ ...majalahForm, bulanTahun: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-mono font-bold"
                    placeholder="e.g. Juli 2026"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Cover URL</label>
                <input
                  id="maj-form-cover"
                  type="text"
                  value={majalahForm.cover || ""}
                  onChange={e => setMajalahForm({ ...majalahForm, cover: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Deskripsi Edisi</label>
                <textarea
                  id="maj-form-desc"
                  rows={3}
                  value={majalahForm.deskripsi || ""}
                  onChange={e => setMajalahForm({ ...majalahForm, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-[#8B5CF6] text-white border-2 border-black font-black rounded-lg text-xs cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none hover:bg-[#FF71CF] hover:text-black">Simpan Edisi</button>
                <button type="button" onClick={resetForms} className="px-4 py-2 bg-white border-2 border-black text-black font-black rounded-lg text-xs cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none">Batal</button>
              </div>
            </form>
          )}

          {activeTab === "proyek" && (
            <form onSubmit={handleSaveProyek} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Judul Riset</label>
                <input
                  id="pro-form-judul"
                  type="text"
                  value={proyekForm.judul || ""}
                  onChange={e => setProyekForm({ ...proyekForm, judul: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Target Dana (Rp)</label>
                  <input
                    id="pro-form-target"
                    type="number"
                    value={proyekForm.target || 0}
                    onChange={e => setProyekForm({ ...proyekForm, target: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Dana Terkumpul (Rp)</label>
                  <input
                    id="pro-form-terkumpul"
                    type="number"
                    value={proyekForm.danaTerkumpul || 0}
                    onChange={e => setProyekForm({ ...proyekForm, danaTerkumpul: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Status</label>
                <select
                  id="pro-form-status"
                  value={proyekForm.status || "berjalan"}
                  onChange={e => setProyekForm({ ...proyekForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs bg-white font-bold"
                >
                  <option value="berjalan">Berjalan (Donasi Dibuka)</option>
                  <option value="selesai">Selesai (Donasi Ditutup)</option>
                </select>
              </div>
              <div>
                <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Deskripsi Singkat</label>
                <textarea
                  id="pro-form-desc"
                  rows={2}
                  value={proyekForm.deskripsi || ""}
                  onChange={e => setProyekForm({ ...proyekForm, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xxs font-black text-slate-500 uppercase mb-1">Paparan Detail Riset</label>
                <textarea
                  id="pro-form-detail"
                  rows={4}
                  value={proyekForm.detailText || ""}
                  onChange={e => setProyekForm({ ...proyekForm, detailText: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-[#8B5CF6] text-white border-2 border-black font-black rounded-lg text-xs cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none hover:bg-[#FF71CF] hover:text-black">Simpan Riset</button>
                <button type="button" onClick={resetForms} className="px-4 py-2 bg-white border-2 border-black text-black font-black rounded-lg text-xs cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none">Batal</button>
              </div>
            </form>
          )}
        </div>

        {/* List Columns */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border-2 border-black brutal-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-sans text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Daftar {activeTab === "pelanggan" ? "Pelanggan" : activeTab === "hasil_tes" ? "Hasil Tes" : activeTab} Saat Ini
            </h2>
            <span className="text-xxs font-mono font-black text-black bg-[#FF71CF] border border-black px-2.5 py-1 rounded-full shadow-sm">
              {activeTab === "artikel" && `${artikelList.length} Items`}
              {activeTab === "video" && `${videoList.length} Items`}
              {activeTab === "buku" && `${bukuList.length} Items`}
              {activeTab === "majalah" && `${majalahList.length} Items`}
              {activeTab === "proyek" && `${proyekList.length} Items`}
              {activeTab === "pelanggan" && `${subscribers.length} Pelanggan`}
              {activeTab === "hasil_tes" && `${testResults.length} Rekor`}
            </span>
          </div>
 
          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-2">
            {activeTab === "artikel" && artikelList.map((art) => (
              <div key={art.id} className="p-3 border-2 border-black rounded-xl hover:bg-[#FDF4FF] transition-all flex justify-between items-start gap-4 mb-3 brutal-shadow-sm bg-white">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-[#FFD600] text-black border border-black text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">{art.kategori}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-bold">{art.tanggal}</span>
                  </div>
                  <h3 className="font-sans font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">{art.judul}</h3>
                  <p className="text-[11px] text-slate-600 font-semibold line-clamp-1">{art.ringkasan}</p>
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
 
            {activeTab === "video" && videoList.map((vid) => (
              <div key={vid.id} className="p-3 border-2 border-black rounded-xl hover:bg-[#FDF4FF] transition-all flex justify-between items-start gap-4 mb-3 brutal-shadow-sm bg-white">
                <div className="flex gap-3 items-center">
                  <img src={vid.thumbnail} alt={vid.judul} className="w-14 h-10 object-cover rounded-lg border border-black bg-slate-100" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 font-mono font-bold">{vid.durasi} | ID: {vid.youtubeId}</span>
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
 
            {activeTab === "buku" && bukuList.map((bk) => (
              <div key={bk.slug} className="p-3 border-2 border-black rounded-xl hover:bg-[#FDF4FF] transition-all flex justify-between items-start gap-4 mb-3 brutal-shadow-sm bg-white">
                <div className="flex gap-3 items-center">
                  <img src={bk.cover} alt={bk.judul} className="w-10 h-14 object-cover rounded border border-black bg-slate-100" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 font-mono font-bold">Rp {bk.harga.toLocaleString("id-ID")}</span>
                    <h3 className="font-sans font-extrabold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-1">{bk.judul}</h3>
                    <p className="text-[10px] text-slate-600 font-semibold">{bk.pengarang}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleStartEdit(bk, "buku")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-[#FF71CF] text-black cursor-pointer shadow-sm active:translate-y-0.5">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(bk.slug, "buku")} className="p-1.5 border border-black rounded-lg bg-white hover:bg-red-500 hover:text-white text-red-500 cursor-pointer shadow-sm active:translate-y-0.5">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
 
            {activeTab === "majalah" && majalahList.map((maj) => (
              <div key={maj.id} className="p-3 border-2 border-black rounded-xl hover:bg-[#FDF4FF] transition-all flex justify-between items-start gap-4 mb-3 brutal-shadow-sm bg-white">
                <div className="flex gap-3 items-center">
                  <img src={maj.cover} alt={maj.tema} className="w-10 h-14 object-cover rounded border border-black bg-slate-100" />
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
 
            {activeTab === "proyek" && proyekList.map((pro) => (
              <div key={pro.id} className="p-3 border-2 border-black rounded-xl hover:bg-[#FDF4FF] transition-all flex justify-between items-start gap-4 mb-3 brutal-shadow-sm bg-white">
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

            {activeTab === "pelanggan" && (
              <div className="space-y-3">
                {loadingSubscribers && (
                  <p className="text-xs font-bold text-slate-500 animate-pulse py-4 text-center">Memuat data dari Firestore...</p>
                )}
                {!loadingSubscribers && subscribers.length === 0 && (
                  <p className="text-xs text-slate-400 font-bold py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">Belum ada pelanggan terdaftar.</p>
                )}
                {subscribers.map((sub) => (
                  <div key={sub.id} className="p-4 border-2 border-black rounded-xl hover:bg-[#FDF4FF] transition-all flex justify-between items-center gap-4 brutal-shadow-sm bg-white">
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

            {activeTab === "hasil_tes" && (
              <div className="space-y-3">
                {loadingTestResults && (
                  <p className="text-xs font-bold text-slate-500 animate-pulse py-4 text-center">Memuat data dari Firestore...</p>
                )}
                {!loadingTestResults && testResults.length === 0 && (
                  <p className="text-xs text-slate-400 font-bold py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">Belum ada hasil tes masuk.</p>
                )}
                {testResults.map((res) => {
                  const style = res.gayaKelekatan || "";
                  let colorClass = "bg-slate-200 text-slate-800";
                  if (style.toLowerCase().includes("secure") || style.toLowerCase().includes("aman")) colorClass = "bg-[#D9F99D] text-black border-green-400";
                  else if (style.toLowerCase().includes("anxious") || style.toLowerCase().includes("cemas")) colorClass = "bg-[#FEF08A] text-black border-yellow-400";
                  else if (style.toLowerCase().includes("avoidant") || style.toLowerCase().includes("menghindar") && !style.toLowerCase().includes("disorganized")) colorClass = "bg-[#F97316] text-white border-orange-500";
                  else colorClass = "bg-[#8B5CF6] text-white border-purple-500";

                  return (
                    <div key={res.id} className="p-4 border-2 border-black rounded-xl hover:bg-[#FDF4FF] transition-all flex justify-between items-center gap-4 brutal-shadow-sm bg-white">
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
}
