# Keterbatasan yang Diketahui — Bantul Heritage AI
# Known Limitations — Bantul Heritage AI

---

## Keterbatasan Mode Demo

| # | Keterbatasan | Detail |
|---|---|---|
| L-01 | **Cakupan terbatas** | Hanya ~10 topik budaya tersedia di mode demo |
| L-02 | **Pencocokan kata kunci, bukan AI** | Sistem mencocokkan kata kunci, tidak memahami maksud pertanyaan |
| L-03 | **Tidak ada memori percakapan** | Setiap pertanyaan berdiri sendiri, tanpa konteks sebelumnya |
| L-04 | **Konten statis** | Informasi tidak diperbarui otomatis |
| L-05 | **Jawaban sudah ditulis sebelumnya** | Tidak ada generasi teks baru — semua jawaban ada di knowledge-base.json |
| L-06 | **Bahasa terbatas** | Pencocokan optimal untuk Bahasa Indonesia; Inggris kurang optimal |

---

## Keterbatasan Mode Live (Gemini AI)

| # | Keterbatasan | Detail |
|---|---|---|
| L-07 | **Memerlukan API key** | Pengguna harus mendapatkan sendiri dari Google AI Studio |
| L-08 | **Biaya penggunaan** | Google Gemini memiliki batas penggunaan gratis; melampaui batas dikenakan biaya |
| L-09 | **Koneksi internet wajib** | Mode live tidak berfungsi tanpa internet |
| L-10 | **Jawaban AI tidak selalu akurat** | Model AI dapat menghasilkan informasi yang tidak tepat (hallucination) |
| L-11 | **Tidak ada verifikasi sumber** | Jawaban AI tidak otomatis dilengkapi sumber terverifikasi |

---

## Keterbatasan Konten

| # | Keterbatasan | Detail |
|---|---|---|
| L-12 | **Bukan sumber akademis resmi** | Konten bersifat informatif, bukan pengganti jurnal atau buku teks |
| L-13 | **Tidak mencakup semua kebudayaan** | Bantul memiliki ratusan tradisi; demo hanya mencakup sebagian kecil |
| L-14 | **Tidak real-time** | Informasi tentang acara budaya terbaru tidak tersedia |
| L-15 | **Pengetahuan tradisional terbatas** | Beberapa pengetahuan adat bersifat terbatas dan tidak dipublikasikan |

---

## Keterbatasan Teknis

| # | Keterbatasan | Detail |
|---|---|---|
| L-16 | **Memerlukan HTTP server** | ES Modules tidak berfungsi dengan file:// protocol di beberapa browser |
| L-17 | **Tidak ada backend** | Semua pemrosesan di sisi client (browser) |
| L-18 | **Tidak ada autentikasi** | Aplikasi tidak memiliki sistem login atau manajemen pengguna |
| L-19 | **API key di sessionStorage** | API key hilang saat tab ditutup; harus dimasukkan ulang |

---

## Hal yang Direncanakan untuk Versi Berikutnya

- [ ] Input API key melalui UI (modal/form) yang lebih ramah pengguna
- [ ] Tambah lebih banyak topik di knowledge base
- [ ] Riwayat percakapan (simpan di localStorage)
- [ ] Fitur pencarian topik budaya
- [ ] Halaman detail per topik budaya

---

*Bantul Heritage AI — Dokumentasi Keterbatasan*
