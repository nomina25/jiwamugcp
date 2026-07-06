import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, ChevronDown, Menu, X, ArrowRight, UserCheck } from "lucide-react";
import logoIkon from "@/logo-ikon.png";

interface HeaderProps {
  currentHash: string;
  setHash: (hash: string) => void;
}

export default function Header({ currentHash, setHash }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"sumber-daya" | "gerakan" | null>(null);

  const navigateTo = (targetHash: string) => {
    setHash(targetHash);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const menuItems = [
    { label: "Kelas", hash: "kelas" },
    { label: "Layanan", hash: "layanan" },
    { label: "Buku", hash: "buku" },
    { label: "Majalah", hash: "majalah" },
  ];

  const subResources = [
    { label: "Artikel", hash: "artikel" },
    { label: "Video", hash: "video" },
    { label: "Unduhan", hash: "unduhan" },
  ];

  const subMovement = [
    { label: "Tentang Kami", hash: "tentangkami" },
    { label: "Proyek", hash: "proyek" },
    { label: "Alumni", hash: "alumni" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FDF4FF]/80 backdrop-blur-md py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 bg-white brutal-border brutal-shadow rounded-2xl px-6">
          
          {/* Logo */}
          <div 
            onClick={() => navigateTo("")} 
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="relative shrink-0 transition-transform group-hover:scale-105">
              {/* Brutalist offset 3D shadow */}
              <div className="absolute inset-0 bg-[#1A1A1A] rounded-xl translate-x-[3px] translate-y-[3px] transition-transform group-hover:translate-x-[1px] group-hover:translate-y-[1px]" />
              {/* Main logo block */}
              <div className="relative w-12 h-12 bg-white border-2 border-black rounded-xl flex items-center justify-center p-1.5 transition-all">
                <img 
                  src={logoIkon} 
                  alt="Jiwamu Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div>
              <span className="font-sans font-extrabold text-xl text-[#1A1A1A] tracking-tighter block leading-none">
                JIWAMU
              </span>
              <span className="text-[10px] font-mono text-[#1A1A1A]/70 block font-bold uppercase tracking-wider mt-1">
                Ecosystem
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                id={`nav-${item.hash}`}
                onClick={() => navigateTo(item.hash)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  currentHash === item.hash 
                    ? "bg-[#FFD600] text-[#1A1A1A] brutal-border-thin" 
                    : "text-[#1A1A1A] hover:text-[#8B5CF6] hover:bg-[#FDF4FF]"
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Sumber Daya Dropdown */}
            <div className="relative">
              <button
                id="nav-sumber-daya-dropdown"
                onClick={() => setActiveDropdown(activeDropdown === "sumber-daya" ? null : "sumber-daya")}
                onMouseEnter={() => setActiveDropdown("sumber-daya")}
                className={`flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  subResources.some(r => r.hash === currentHash)
                    ? "bg-[#FFD600] text-[#1A1A1A] brutal-border-thin"
                    : "text-[#1A1A1A] hover:text-[#8B5CF6] hover:bg-[#FDF4FF]"
                }`}
              >
                Sumber Daya
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              
              <AnimatePresence>
                {activeDropdown === "sumber-daya" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute right-0 mt-2 w-44 bg-white rounded-xl brutal-border brutal-shadow py-1.5 z-50 overflow-hidden"
                  >
                    {subResources.map((sub) => (
                      <button
                        key={sub.label}
                        id={`nav-sub-${sub.hash}`}
                        onClick={() => navigateTo(sub.hash)}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold block cursor-pointer transition-all ${
                          currentHash === sub.hash 
                            ? "bg-[#FEF08A] text-[#1A1A1A] font-extrabold" 
                            : "text-slate-700 hover:bg-[#FDF4FF] hover:text-[#8B5CF6]"
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Gerakan Dropdown */}
            <div className="relative">
              <button
                id="nav-gerakan-dropdown"
                onClick={() => setActiveDropdown(activeDropdown === "gerakan" ? null : "gerakan")}
                onMouseEnter={() => setActiveDropdown("gerakan")}
                className={`flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  subMovement.some(m => m.hash === currentHash)
                    ? "bg-[#FFD600] text-[#1A1A1A] brutal-border-thin"
                    : "text-[#1A1A1A] hover:text-[#8B5CF6] hover:bg-[#FDF4FF]"
                }`}
              >
                Gerakan
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              <AnimatePresence>
                {activeDropdown === "gerakan" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute right-0 mt-2 w-44 bg-white rounded-xl brutal-border brutal-shadow py-1.5 z-50 overflow-hidden"
                  >
                    {subMovement.map((sub) => (
                      <button
                        key={sub.label}
                        id={`nav-sub-${sub.hash}`}
                        onClick={() => navigateTo(sub.hash)}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold block cursor-pointer transition-all ${
                          currentHash === sub.hash 
                            ? "bg-[#FEF08A] text-[#1A1A1A] font-extrabold" 
                            : "text-slate-700 hover:bg-[#FDF4FF] hover:text-[#8B5CF6]"
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="cta-tes-kelekatan-header"
              onClick={() => navigateTo("tes-kelekatan")}
              className="inline-flex items-center gap-1.5 bg-[#FF71CF] hover:bg-[#8B5CF6] hover:text-white text-black text-xs font-extrabold px-5 py-2.5 rounded-xl brutal-border brutal-shadow transition-all cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              Tes Kelekatan
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => navigateTo("tes-kelekatan")}
              className="bg-[#FFD600] text-black border-2 border-black font-extrabold py-2 px-3.5 rounded-xl text-xs"
            >
              Tes
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border-2 border-black rounded-xl hover:bg-[#FDF4FF] text-black cursor-pointer bg-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white brutal-border brutal-shadow rounded-2xl mt-3 mx-4 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigateTo(item.hash)}
                  className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl block cursor-pointer transition-all ${
                    currentHash === item.hash ? "bg-[#FFD600] text-black border-2 border-black" : "text-[#1A1A1A] hover:bg-[#FDF4FF]"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="border-t-2 border-black pt-3">
                <span className="block px-4 text-xxs font-extrabold text-[#1A1A1A]/60 uppercase tracking-wider mb-2">
                  Sumber Daya
                </span>
                {subResources.map((sub) => (
                  <button
                    key={sub.label}
                    onClick={() => navigateTo(sub.hash)}
                    className={`w-full text-left px-6 py-2 text-sm font-bold rounded-xl block cursor-pointer transition-all ${
                      currentHash === sub.hash ? "bg-[#FEF08A] text-black border-2 border-black" : "text-[#1A1A1A] hover:bg-[#FDF4FF]"
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              <div className="border-t-2 border-black pt-3">
                <span className="block px-4 text-xxs font-extrabold text-[#1A1A1A]/60 uppercase tracking-wider mb-2">
                  Gerakan
                </span>
                {subMovement.map((sub) => (
                  <button
                    key={sub.label}
                    onClick={() => navigateTo(sub.hash)}
                    className={`w-full text-left px-6 py-2 text-sm font-bold rounded-xl block cursor-pointer transition-all ${
                      currentHash === sub.hash ? "bg-[#FEF08A] text-black border-2 border-black" : "text-[#1A1A1A] hover:bg-[#FDF4FF]"
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              <div className="border-t-2 border-black pt-4">
                <a
                  href="https://wa.me/6289653881556?text=Hai%20Kak%20Nuy%2C%20saya%20ingin%20tanya-tanya%20mengenai%20layanan%20atau%20kelas%20Jiwamu."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#FF71CF] hover:bg-[#8B5CF6] hover:text-white text-black font-extrabold py-3 rounded-xl text-sm brutal-border brutal-shadow transition-all"
                >
                  Hubungi via WhatsApp
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
