/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Alumni {
  nia: string;
  nama: string;
  domisili: string;
  pelatihan: string[];
}

export interface Buku {
  slug: string;
  judul: string;
  pengarang: string;
  cover: string;
  tahun: number;
  halaman: number;
  ukuran: string;
  berat: string;
  penerbit: string;
  harga: number;
  deskripsi: string;
  daftarIsi: string[];
}

export interface Proyek {
  id: string; // e.g. "004"
  judul: string;
  deskripsi: string;
  danaTerkumpul: number;
  target: number;
  status: "berjalan" | "selesai";
  detailText: string;
}

export interface Trainer {
  id?: string;
  nama: string;
  gelar: string;
  pengalaman: string;
  foto: string;
}

export interface Pendamping {
  id?: string;
  nama: string;
  pengalaman: string;
  keahlian: string[];
  foto: string;
}

export interface MajalahEdisi {
  id: string; // e.g. "Ed. 01/2026"
  nomor: string;
  bulanTahun: string;
  tema: string;
  deskripsi: string;
  cover: string;
  pdfUrl: string;
  flipbookUrl?: string; // e.g. "https://online.fliphtml5.com/MajalahJiwamu/..."
  slug?: string;        // e.g. "edisi1" or "edisi-agustus-2026"
}

export interface Artikel {
  id: string;
  judul: string;
  ringkasan: string;
  konten: string;
  penulis: string;
  tanggal: string;
  kategori: string;
  bacaMilik: string; // reading time, e.g. "5 min"
  imageUrl?: string; // Illustration/visual
}

export interface VideoItem {
  id: string;
  judul: string;
  durasi: string;
  youtubeId: string;
  thumbnail: string;
  deskripsi: string;
}

export interface UnduhanItem {
  id: string;
  judul: string;
  ukuran: string;
  format: string;
  url: string;
  deskripsi: string;
  imageUrl?: string; // Illustration/visual
}

export interface ClassItem {
  id: string;
  code: string;
  level: string;
  title: string;
  desc: string;
  price: string;
  investment: string;
  rekeningBank: string;
  duration: string;
  jadwal: { city: string; hotel: string; date: string }[];
  materi: string[];
  competence: string[];
}

export interface AdminUser {
  email: string;
  passwordHash: string;
  nama: string;
  role: "superadmin" | "editor";
  createdAt: string;
}

export interface DokumenKhusus {
  id: string;
  slug: string;
  judul: string;
  tipe: string;
  karakter: string;
  badge: string;
  warnaBadge?: "emerald" | "amber" | "blue" | "rose" | "purple" | "slate";
  deskripsi: string;
  pdfUrl: string;
  fileSize?: string;
  pageCount?: string;
  penulis?: string;
  organisasi?: string;
  coverUrl?: string;
  catatanAkses?: string;
  isAktif?: boolean;
  createdAt?: string;
  downloadCount?: number;
}


