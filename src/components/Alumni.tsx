import React, { useState } from "react";
import { initialAlumniList } from "../data/alumni";
import { Search, UserCheck, Shield, MapPin, Award } from "lucide-react";

export default function Alumni() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Semua");

  const certifications = [
    "Semua",
    "Attachment Facilitator (CAF)",
    "Attachment Coach (CAC)",
    "Attachment-Based Practitioner (CABP)",
    "Training of Trainers (TOT)",
    "Jiwamu Writing Lab"
  ];

  const filteredAlumni = initialAlumniList.filter((a) => {
    const matchesSearch = a.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.domisili.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.nia.includes(searchTerm);
    const matchesFilter = selectedFilter === "Semua" || a.pelatihan.includes(selectedFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero */}
      <section className="bg-[#FDF4FF] border-b-4 border-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] bg-[#FFD600] px-3.5 py-1.5 rounded-full w-fit brutal-border-thin shadow-sm mb-2 inline-block">
            Komunitas & Alumni
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Temukan daftar alumni kami
          </h1>
          <p className="text-slate-800 font-medium text-xs sm:text-sm max-w-2xl leading-relaxed">
            Daftar resmi alumni sertifikasi Jiwamu Academy yang telah menyelesaikan kurikulum kredensial, siap menjadi pembaca kebutuhan emosional, helper, dan pendamping relasional di masyarakat Indonesia.
          </p>
        </div>
      </section>

      {/* Table and search filter section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
        
        {/* Filter bar */}
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 font-black" />
            <input
              id="alumni-search-input"
              type="text"
              placeholder="Cari nama, kota, atau NIA..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-black rounded-xl text-xs focus:outline-none bg-white font-bold shadow-sm"
            />
          </div>

          {/* Certifications filter pills */}
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <button
                key={cert}
                onClick={() => setSelectedFilter(cert)}
                className={`px-3.5 py-2 rounded-xl text-xxs font-black cursor-pointer transition-all border-2 border-black active:translate-y-0.5 active:shadow-none shadow-sm ${
                  selectedFilter === cert 
                    ? "bg-[#8B5CF6] text-white shadow-none" 
                    : "bg-white text-black hover:bg-[#FDF4FF]"
                }`}
              >
                {cert === "Semua" ? "Semua Sertifikasi" : cert.split(" (")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Alumni Desktop Table View */}
        <div className="hidden md:block overflow-hidden bg-white rounded-3xl border-2 border-black brutal-shadow">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#FDF4FF] border-b-2 border-black text-[10px] font-mono font-black uppercase tracking-wider text-black">
                <th className="py-4 px-6 border-r border-black/10">NIA</th>
                <th className="py-4 px-6 border-r border-black/10">Nama Lengkap</th>
                <th className="py-4 px-6 border-r border-black/10">Domisili</th>
                <th className="py-4 px-6">Pelatihan / Sertifikasi Selesai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-slate-700">
              {filteredAlumni.map((al) => (
                <tr key={al.nia} className="hover:bg-[#FDF4FF]/30 transition-all">
                  <td className="py-4.5 px-6 font-mono font-black text-slate-500 border-r border-black/10">{al.nia}</td>
                  <td className="py-4.5 px-6 font-extrabold text-slate-900 border-r border-black/10">{al.nama}</td>
                  <td className="py-4.5 px-6 text-slate-800 font-bold border-r border-black/10">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {al.domisili}
                    </span>
                  </td>
                  <td className="py-4.5 px-6">
                    <div className="flex flex-wrap gap-1.5">
                      {al.pelatihan.map((p) => (
                        <span key={p} className="bg-[#FFD600] text-black text-[10px] font-black px-2.5 py-1 rounded-md border border-black shadow-sm">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAlumni.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-600 font-bold">
                    Tidak ditemukan alumni dengan kriteria pencarian tersebut.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Alumni Mobile Card List View */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredAlumni.map((al) => (
            <div key={al.nia} className="bg-white border-2 border-black p-5 rounded-3xl space-y-3.5 brutal-shadow">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-slate-500 font-bold block">NIA: {al.nia}</span>
                  <h3 className="font-sans text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">{al.nama}</h3>
                </div>
                <span className="text-xxs font-mono bg-[#FDF4FF] text-black border border-black px-2.5 py-1 rounded flex items-center gap-1 shrink-0 font-black">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {al.domisili}
                </span>
              </div>
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Sertifikasi:</span>
                <div className="flex flex-wrap gap-1.5">
                  {al.pelatihan.map((p) => (
                    <span key={p} className="bg-[#FFD600] text-black text-[9px] font-black px-2 py-0.5 rounded border border-black shadow-sm">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {filteredAlumni.length === 0 && (
            <div className="py-12 text-center text-slate-600 font-bold bg-white rounded-3xl border-2 border-black brutal-shadow">
              Tidak ditemukan alumni dengan kriteria pencarian tersebut.
            </div>
          )}
        </div>

      </section>

    </div>
  );
}
