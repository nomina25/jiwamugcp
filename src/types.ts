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
  nama: string;
  gelar: string;
  pengalaman: string;
  foto: string;
}

export interface Pendamping {
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
}
