# Bantul Heritage AI

> Asisten pengetahuan budaya Kabupaten Bantul, Daerah Istimewa Yogyakarta.
> *Cultural knowledge assistant for Bantul Regency, Special Region of Yogyakarta.*

---

## Tentang Proyek / About

**Bantul Heritage AI** adalah aplikasi web edukasi yang membantu pengguna menjelajahi kekayaan budaya Kabupaten Bantul — tradisi, kuliner, kerajinan, seni pertunjukan, dan warisan budaya lainnya — melalui antarmuka percakapan yang mudah digunakan.

*A conversational web application that helps users explore the cultural heritage of Bantul Regency, including traditions, food, crafts, and performing arts.*

---

## Fitur / Features

- 💬 Antarmuka chat bilingual (Bahasa Indonesia & Inggris)
- 🏛️ Basis pengetahuan budaya Bantul (10+ topik terdokumentasi)
- ✅ Label kepercayaan informasi (Terverifikasi / Belum Terverifikasi)
- 🤖 Siap integrasi Google Gemini AI (mode live)
- ⚙️ Mode demo bawaan (tanpa API key)
- 📱 Responsif desktop & mobile
- ♿ Aksesibel (ARIA labels, keyboard navigation, dark mode)
- 🔒 Tidak menyimpan data percakapan

---

## Cara Menjalankan / Quick Start

Lihat [`docs/SETUP.md`](docs/SETUP.md) untuk panduan lengkap.

**Cara tercepat (tanpa install apapun):**

```
Buka file index.html langsung di browser.
```

> ⚠️ Karena menggunakan ES Modules, untuk development gunakan local server.
> Lihat docs/SETUP.md untuk instruksi lengkap.

---

## Struktur Proyek / Project Structure

```
bantul-heritage-ai/
├── index.html              # Halaman utama
├── README.md               # Dokumentasi ini
├── .env.example            # Contoh konfigurasi API key
│
├── css/
│   ├── main.css            # Layout & desain motif Jawa
│   ├── chat.css            # Komponen percakapan
│   └── responsive.css      # Mobile & dark mode
│
├── js/
│   ├── main.js             # Entry point
│   ├── chat.js             # Logic antarmuka chat
│   ├── ai-service.js       # Abstraksi AI (demo/live)
│   ├── demo-engine.js      # Mesin pencocokan kata kunci
│   └── renderer.js         # Render pesan HTML
│
├── data/
│   └── knowledge-base.json # Basis pengetahuan budaya Bantul
│
└── docs/
    ├── SETUP.md            # Panduan setup
    ├── USAGE.md            # Panduan penggunaan
    ├── TESTING.md          # Rencana & hasil pengujian
    └── LIMITATIONS.md      # Keterbatasan yang diketahui
```

---

## Stack Teknologi / Tech Stack

| Teknologi | Versi | Alasan |
|---|---|---|
| HTML5 | — | Standar web, tidak perlu install |
| CSS3 (Vanilla) | — | Tidak butuh framework, lebih ringan |
| JavaScript ES6+ | — | Modules, async/await, bawaan browser |
| Google Gemini API | v1beta | AI gratis untuk deployment, sesuai kebutuhan |
| Netlify | — | Hosting statis gratis, deployment mudah |

**Tidak menggunakan:** React, Vue, Node.js, database, atau backend server.

---

## Status Proyek / Project Status

| Fase | Status | Keterangan |
|---|---|---|
| Fase 1 — Fondasi UI | ✅ Selesai | Homepage, chat, CSS responsif |
| Fase 2 — Demo Engine | ✅ Selesai | Knowledge base, pencocokan kata kunci |
| Fase 3 — AI Service Layer | ✅ Selesai | Abstraksi demo/live, Gemini integration |
| Fase 4 — Konten & Docs | ✅ Selesai | 10 topik, dokumentasi lengkap |
| Fase 5 — Testing & Deploy | 🔄 Berikutnya | Pengujian & deployment Netlify |

---

## Lisensi / License

Proyek ini dibuat untuk tujuan edukasi. Konten budaya bersifat informatif dan tidak menggantikan sumber akademis primer.

*This project is created for educational purposes. Cultural content is informational and does not replace primary academic sources.*
