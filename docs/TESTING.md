# Rencana & Hasil Pengujian — Bantul Heritage AI
# Testing Plan & Results — Bantul Heritage AI

---

## TC-01: Pertanyaan dalam Cakupan Demo

**Skenario:** Pengguna menanyakan topik yang ada di knowledge base
**Input:** `"Apa makanan tradisional khas Bantul?"`
**Hasil yang Diharapkan:**
- Jawaban terstruktur muncul (judul, ringkasan, subtopik)
- Badge ✅ Terverifikasi ditampilkan
- Badge ⚙️ Mode Demo ditampilkan
- Sumber disebutkan

**Status:** [ ] Lulus / [ ] Gagal
**Catatan:**

---

## TC-02: Pertanyaan di Luar Cakupan

**Skenario:** Pengguna menanyakan hal yang tidak ada di knowledge base
**Input:** `"Berapa harga tiket masuk ke Bantul?"`
**Hasil yang Diharapkan:**
- Pesan fallback ditampilkan (bukan jawaban karangan)
- Saran pertanyaan yang bisa dicoba muncul
- Badge ⚠️ Belum Diverifikasi ditampilkan
- Tidak ada jawaban yang bersifat spekulatif atau menipu

**Status:** [ ] Lulus / [ ] Gagal
**Catatan:**

---

## TC-03: Input Kosong

**Skenario:** Pengguna klik Kirim tanpa mengetik apapun
**Input:** *(kosong)*
**Hasil yang Diharapkan:**
- Pesan validasi muncul: "Harap ketik pertanyaan terlebih dahulu"
- Tidak ada pesan baru di area chat
- Tidak ada error JavaScript di console
- Form tetap aktif (tidak crash)

**Status:** [ ] Lulus / [ ] Gagal
**Catatan:**

---

## TC-04: Klik Tombol Saran

**Skenario:** Pengguna mengklik salah satu pertanyaan saran
**Input:** Klik tombol `"Apa tradisi unik yang ada di Bantul?"`
**Hasil yang Diharapkan:**
- Pertanyaan langsung dikirim (tidak perlu klik Kirim lagi)
- Pesan pengguna muncul di area chat
- Loading indicator muncul sementara
- Jawaban terstruktur muncul

**Status:** [ ] Lulus / [ ] Gagal
**Catatan:**

---

## TC-05: Tampilan Mobile (375px)

**Skenario:** Pengguna membuka di layar smartphone kecil
**Cara Uji:** Buka DevTools browser → toggle device toolbar → pilih 375px
**Hasil yang Diharapkan:**
- Layout tidak rusak (tidak ada overflow horizontal)
- Chat input dapat digunakan dengan mudah
- Tombol Kirim mudah diklik
- Teks tetap terbaca (tidak terpotong)
- Pertanyaan saran tampil vertikal (satu kolom)

**Status:** [ ] Lulus / [ ] Gagal
**Catatan:**

---

## TC-06: Pertanyaan Ambigu

**Skenario:** Pertanyaan sangat umum
**Input:** `"Ceritakan tentang Bantul"`
**Hasil yang Diharapkan:**
- Jawaban paling relevan muncul ATAU
- Pesan fallback dengan saran pertanyaan lebih spesifik
- Tidak mengarang informasi

**Status:** [ ] Lulus / [ ] Gagal
**Catatan:**

---

## TC-07: Indikator Mode Demo Jelas

**Skenario:** Pengguna membuka aplikasi tanpa konfigurasi API key
**Hasil yang Diharapkan:**
- Badge "⚙️ Mode Demo" terlihat jelas di header
- Setiap jawaban memiliki badge "⚙️ Mode Demo"
- Catatan di area input: "Jawaban demo bukan dari AI sungguhan"
- Tidak ada klaim bahwa jawaban berasal dari AI

**Status:** [ ] Lulus / [ ] Gagal
**Catatan:**

---

## TC-08: Banyak Pesan Berturut-turut

**Skenario:** Pengguna mengirim beberapa pertanyaan cepat
**Input:** Kirim 5+ pertanyaan berturut-turut
**Hasil yang Diharapkan:**
- Setiap pertanyaan diproses satu per satu (tidak tumpang tindih)
- Chat otomatis scroll ke pesan terbaru
- Tidak ada pesan yang hilang atau terduplikasi
- UI tetap responsif

**Status:** [ ] Lulus / [ ] Gagal
**Catatan:**

---

## TC-09: Aksesibilitas Keyboard

**Skenario:** Navigasi menggunakan keyboard saja (tanpa mouse)
**Cara Uji:** Tab untuk navigasi, Enter untuk aksi
**Hasil yang Diharapkan:**
- Semua tombol dapat dijangkau via Tab
- Fokus terlihat jelas (outline)
- Tombol saran dapat diklik dengan Enter
- Form dapat disubmit dengan Enter

**Status:** [ ] Lulus / [ ] Gagal
**Catatan:**

---

## TC-10: Dark Mode

**Skenario:** Pengguna menggunakan sistem dark mode
**Cara Uji:** Ubah preferensi sistem ke dark mode
**Hasil yang Diharapkan:**
- Warna berubah ke tema gelap
- Teks tetap terbaca (kontras cukup)
- Tidak ada elemen yang menghilang
- Badge tetap terlihat

**Status:** [ ] Lulus / [ ] Gagal
**Catatan:**

---

## Cara Menjalankan Pengujian

1. Buka `index.html` via Live Server
2. Ikuti setiap test case di atas satu per satu
3. Tandai **[x] Lulus** atau **[x] Gagal** untuk setiap kasus
4. Catat temuan di kolom "Catatan"
5. Laporkan test case yang gagal untuk diperbaiki

---

*Bantul Heritage AI — Rencana Pengujian*
