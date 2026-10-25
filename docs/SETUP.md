# Panduan Setup — Bantul Heritage AI
# Setup Guide — Bantul Heritage AI

---

## Cara 1: Buka Langsung (Paling Mudah)

> ⚠️ Cara ini mungkin tidak berfungsi di beberapa browser karena ES Modules
> memerlukan HTTP server. Gunakan Cara 2 untuk development.

1. Unduh atau clone proyek ini
2. Buka file `index.html` di browser

---

## Cara 2: Menggunakan Live Server (Direkomendasikan untuk Development)

### Prasyarat
- [VS Code](https://code.visualstudio.com/) terinstal
- Extension [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) terinstal

### Langkah
1. Buka folder proyek di VS Code
2. Klik kanan pada `index.html`
3. Pilih **"Open with Live Server"**
4. Browser akan terbuka otomatis di `http://127.0.0.1:5500`

---

## Cara 3: Menggunakan Python (Alternatif)

Jika Python sudah terinstal di komputer Anda:

```bash
# Python 3
python -m http.server 8000

# Kemudian buka browser: http://localhost:8000
```

---

## Mengaktifkan Mode Live AI (Google Gemini)

> Mode demo dapat digunakan tanpa API key. Langkah ini hanya diperlukan
> jika ingin menggunakan Google Gemini AI sungguhan.

### Langkah mendapatkan API Key:
1. Buka [Google AI Studio](https://aistudio.google.com/)
2. Login dengan akun Google
3. Klik **"Get API key"** → **"Create API key"**
4. Salin API key yang dihasilkan

### Cara menggunakan API Key (sesi sementara):
Saat ini, API key dapat dimasukkan melalui Console browser:

```javascript
// Buka Developer Tools (F12) → Console
// Ketik perintah berikut:
import('./js/ai-service.js').then(m => m.setApiKey('ISI_API_KEY_ANDA_DI_SINI'));
```

> 🔒 **KEAMANAN PENTING:**
> - JANGAN menulis API key langsung di file kode apapun
> - JANGAN commit API key ke Git / GitHub
> - API key yang dimasukkan hanya bertahan selama tab browser terbuka
> - Lihat `.env.example` untuk referensi konfigurasi

---

## Deployment ke Netlify

1. Buat akun di [netlify.com](https://netlify.com) (gratis)
2. Klik **"Add new site"** → **"Deploy manually"**
3. Seret (drag & drop) seluruh folder proyek ke area upload Netlify
4. Tunggu deployment selesai — situs Anda akan mendapatkan URL gratis

> ⚠️ **Sebelum deploy:** Pastikan tidak ada API key atau data sensitif
> dalam file apapun. Periksa kembali semua file di folder proyek.

---

## Struktur File Setelah Setup

```
bantul-heritage-ai/
├── index.html          ← Buka file ini di browser
├── css/                ← Style (tidak perlu diedit)
├── js/                 ← Logic (tidak perlu diedit untuk penggunaan biasa)
├── data/               ← knowledge-base.json (BISA diedit untuk tambah konten)
└── docs/               ← Dokumentasi
```

---

## Menambahkan Konten Baru ke Knowledge Base

Edit file `data/knowledge-base.json` untuk menambahkan topik baru.
Ikuti format yang sudah ada. Setiap entri harus memiliki:

- `id` — unik, format `kb-XXX`
- `topic` — nama topik singkat
- `keywords` — kata-kata kunci untuk pencocokan
- `question_examples` — contoh pertanyaan
- `title` — judul jawaban
- `answer` — objek berisi ringkasan, isi, signifikansi
- `trust_level` — `"verified"` atau `"unverified"`
- `trust_note` — catatan sumber/kepercayaan

---

*Bantul Heritage AI — Dokumentasi Teknis*
