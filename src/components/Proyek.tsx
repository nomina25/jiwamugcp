import React, { useState } from "react";
import { Proyek } from "../types";
import { CreditCard, TrendingUp, ShieldCheck, CheckCircle, HeartHandshake, X } from "lucide-react";

interface ProyekProps {
  proyekList: Proyek[];
  setProyekList: React.Dispatch<React.SetStateAction<Proyek[]>>;
}

export default function ProyekComponent({ proyekList, setProyekList }: ProyekProps) {
  const [selectedProyek, setSelectedProyek] = useState<Proyek | null>(null);
  const [donationAmount, setDonationAmount] = useState(50000);
  const [successDonation, setSuccessDonation] = useState(false);

  const activeProyek = proyekList.filter(p => p.status === "berjalan");
  const completedProyek = proyekList.filter(p => p.status === "selesai");

  const handleSimulateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProyek) return;

    // Simulate update state
    setProyekList(proyekList.map((p) => {
      if (p.id === selectedProyek.id) {
        return {
          ...p,
          danaTerkumpul: p.danaTerkumpul + donationAmount
        };
      }
      return p;
    }));

    setSuccessDonation(true);
    setTimeout(() => {
      setSuccessDonation(false);
      setSelectedProyek(null);
    }, 4500);
  };

  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero */}
      <section className="bg-[#FDF4FF] border-b-4 border-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-4 inline-block">
            Gerakan Sosial & Riset
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Jiwamu Project: Laboratorium <br />
            riset <span className="underline decoration-wavy decoration-[#8B5CF6]">dekolonisasi</span> kesehatan mental.
          </h1>
          <p className="text-slate-800 font-bold text-xs sm:text-sm max-w-2xl leading-relaxed">
            Kolaborasi antara Yayasan Pusat Psikoanalisis Indonesia dan PT Jiwa Media Utama untuk mengembangkan kajian kesehatan mental yang lebih dekat dengan sejarah, budaya, spiritualitas, dan pengalaman hidup masyarakat Indonesia.
          </p>
        </div>
      </section>

      {/* Proyek Berjalan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-black bg-[#FF71CF] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-2 inline-block">Active Researches</span>
          <h2 className="font-sans text-xl sm:text-2xl font-extrabold text-slate-900">Proyek Riset Sedang Berjalan</h2>
          <p className="text-xs text-slate-700 font-bold">Dukung perjalanan dekolonisasi literasi kesehatan mental di Indonesia.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeProyek.map((pro) => {
            const progress = Math.min((pro.danaTerkumpul / pro.target) * 100, 100);
            return (
              <div 
                key={pro.id} 
                className="bg-white border-2 border-black rounded-3xl p-6 flex flex-col justify-between brutal-shadow h-full hover:translate-y-[-2px] transition-all"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="bg-[#FF71CF] text-black border border-black font-black px-2.5 py-1 rounded-full uppercase tracking-wider text-[9px] shadow-sm">
                      Donasi Dibuka
                    </span>
                    <span className="font-mono text-slate-900 font-black">KODE: {pro.id}</span>
                  </div>
                  <h3 className="font-sans text-base sm:text-lg font-extrabold text-slate-900 leading-snug">{pro.judul}</h3>
                  <p className="text-xs text-slate-700 font-semibold leading-relaxed line-clamp-4">{pro.detailText}</p>
                </div>

                <div className="pt-6 border-t-2 border-black mt-6 space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xxs text-slate-800 font-mono font-black">
                      <span>Rp {pro.danaTerkumpul.toLocaleString("id-ID")}</span>
                      <span>Target: Rp {pro.target.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="w-full bg-[#FDF4FF] border-2 border-black h-4 rounded-full overflow-hidden p-0.5 shadow-sm">
                      <div className="bg-[#8B5CF6] h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  <button
                    id={`btn-donate-${pro.id}`}
                    onClick={() => { setSelectedProyek(pro); setSuccessDonation(false); }}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-[#FFD600] text-black border-2 border-black font-black text-xs py-2.5 rounded-xl hover:bg-[#FF71CF] transition-all cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none"
                  >
                    Donasi Sekarang!
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Proyek Selesai */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-black bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-2 inline-block">Past Achievements</span>
          <h2 className="font-sans text-xl sm:text-2xl font-extrabold text-slate-900">Proyek Riset yang Telah Selesai</h2>
          <p className="text-xs text-slate-700 font-bold">Daftar buku dan publikasi hasil kerja kolektif komunitas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {completedProyek.map((pro) => (
            <div 
              key={pro.id} 
              className="bg-white border-2 border-black rounded-3xl p-6 flex flex-col justify-between brutal-shadow h-full"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-[#8B5CF6] text-white border border-black font-black px-2.5 py-1 rounded-full uppercase tracking-wider text-[9px] shadow-sm">
                    Selesai & Diterbitkan
                  </span>
                  <span className="font-mono text-slate-900 font-black">KODE: {pro.id}</span>
                </div>
                <h3 className="font-sans text-base sm:text-lg font-extrabold text-slate-900 leading-snug">{pro.judul}</h3>
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">{pro.detailText}</p>
              </div>

              <div className="pt-6 border-t-2 border-black mt-6 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold">Total Dana Riset:</span>
                <span className="font-mono font-black text-slate-900">Rp {pro.target.toLocaleString("id-ID")}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Donation Information Instruction */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[#8B5CF6] text-white rounded-3xl p-8 sm:p-10 border-4 border-black space-y-6 brutal-shadow">
          <span className="bg-[#FFD600] text-black border border-black text-xs font-black px-3 py-1.5 rounded-full w-fit shadow-sm">Protokol Saluran Donasi</span>
          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed font-bold">
            Untuk memastikan perjalanan riset berkelanjutan, setiap dukungan finansial dapat Anda salurkan melalui rekening resmi Yayasan. Tambahkan kode proyek di akhir nominal donasi sebagai tanda alokasi dana.
          </p>
          <div className="bg-white text-black p-5 rounded-2xl border-2 border-black space-y-3 max-w-md brutal-shadow-sm">
            <p className="text-xxs font-mono text-slate-500 uppercase font-black">REKENING BANK MANDIRI</p>
            <p className="font-mono text-lg font-black text-slate-900 tracking-wide">1410039881313</p>
            <p className="text-xs text-slate-800 font-bold">a.n. Yayasan Pusat Psikoanalisis Indonesia</p>
            <p className="text-xxs text-red-500 font-black leading-relaxed pt-1.5 border-t border-slate-200">
              * Contoh: Rp150.004 → untuk mendukung Proyek 004 (Psikologi Sukerta)
            </p>
          </div>
        </div>
      </section>

      {/* Interactive simulated donation popup */}
      {selectedProyek && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full relative border-4 border-black brutal-shadow space-y-6 animate-scale-up">
            <button 
              onClick={() => setSelectedProyek(null)}
              className="absolute top-4 right-4 p-1.5 border-2 border-black rounded-xl bg-white hover:bg-[#FF71CF] hover:text-black text-black cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none"
            >
              <X className="w-4 h-4" />
            </button>

            {successDonation ? (
              <div className="text-center py-6 space-y-4 animate-fade-in">
                <div className="p-3 bg-[#FF71CF] text-black border-2 border-black rounded-2xl inline-flex shadow-sm">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-sans text-lg font-extrabold text-slate-900">Simulasi Donasi Berhasil!</h3>
                <p className="text-xs text-slate-700 font-bold leading-relaxed max-w-sm mx-auto">
                  Terima kasih! Dana simulasi sebesar <strong>Rp {donationAmount.toLocaleString("id-ID")}</strong> berhasil ditambahkan ke progress target Proyek {selectedProyek.judul} (Kode {selectedProyek.id}) secara real-time.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black bg-[#FFD600] border border-black text-black px-2 py-0.5 rounded-full uppercase shadow-sm">Donasi Riset</span>
                  <h3 className="font-sans text-base sm:text-lg font-extrabold text-slate-900 pt-2">Dukung Proyek {selectedProyek.judul}</h3>
                  <p className="text-xxs text-slate-500 font-bold">Kode Alokasi: {selectedProyek.id}</p>
                </div>

                <form onSubmit={handleSimulateDonation} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xxs font-black text-slate-500 uppercase">Jumlah Simulasi Donasi (Rp)</label>
                    <select
                      id="sim-donation-amount-select"
                      value={donationAmount}
                      onChange={e => setDonationAmount(parseInt(e.target.value))}
                      className="w-full p-3 border-2 border-black rounded-xl text-xs bg-white focus:outline-none font-bold shadow-sm font-mono"
                    >
                      <option value="10000">Rp 10.000</option>
                      <option value="50000">Rp 50.000</option>
                      <option value="100000">Rp 100.000</option>
                      <option value="500000">Rp 500.000</option>
                      <option value="1000000">Rp 1.000.000</option>
                    </select>
                  </div>

                  <div className="bg-[#FDF4FF] border-2 border-black p-4 rounded-xl text-xxs text-slate-800 space-y-1 font-mono">
                    <p className="font-black text-slate-900 font-sans">Instruksi Transfer Asli:</p>
                    <p>Transfer Bank Mandiri 1410039881313</p>
                    <p>a.n. Yayasan Pusat Psikoanalisis Indonesia</p>
                    <p className="text-[#8B5CF6] font-black">Nominal Transfer: Rp {(donationAmount + parseInt(selectedProyek.id)).toLocaleString("id-ID")}</p>
                  </div>

                  <button
                    id="submit-sim-donation-btn"
                    type="submit"
                    className="w-full py-3.5 bg-[#8B5CF6] text-white border-2 border-black rounded-xl text-xs font-black flex items-center justify-center gap-1.5 hover:bg-[#FF71CF] hover:text-black transition-all cursor-pointer shadow-sm active:translate-y-0.5 active:shadow-none"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    Kirim Simulasi Transfer
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
