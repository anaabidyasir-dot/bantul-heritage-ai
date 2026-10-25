/**
 * ai-service.js
 * Abstraksi layer AI untuk Bantul Heritage AI.
 *
 * Mode Demo  : Menggunakan demo-engine.js (pencocokan kata kunci lokal)
 * Mode Live  : Menggunakan Google Gemini API (memerlukan API key)
 *
 * KEAMANAN: API key TIDAK PERNAH disimpan di kode ini.
 * Konfigurasi dilakukan melalui variabel lingkungan atau input pengguna
 * yang tersimpan di sessionStorage (tidak persisten).
 */

import { processQuestion as demoProcess } from './demo-engine.js';

// ---- State mode saat ini ----
let currentMode = 'demo'; // 'demo' | 'live'
let geminiApiKey = null;

// Konstanta — daftar model dicoba berurutan sampai berhasil
const GEMINI_BASE_DIRECT = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_BASE_PROXY  = '/api/gemini';          // via server.js lokal (atasi CORS file://)
const GEMINI_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
  'gemini-pro',
];

/**
 * Deteksi apakah aplikasi berjalan via HTTP server (localhost/127.0.0.1)
 * atau dibuka langsung sebagai file:// .
 * - HTTP server → pakai proxy lokal (server.js) agar tidak CORS
 * - file://      → langsung ke Gemini (mungkin CORS, tapi coba dulu)
 */
function isRunningOnServer() {
  return (
    window.location.protocol === 'http:' ||
    window.location.protocol === 'https:'
  );
}

function buildGeminiUrl(model, key) {
  if (isRunningOnServer()) {
    // Pakai proxy → key tidak masuk URL browser history
    return `${GEMINI_BASE_PROXY}?model=${encodeURIComponent(model)}&key=${encodeURIComponent(key)}`;
  }
  // Fallback: langsung ke Google (mungkin kena CORS kalau file://)
  return `${GEMINI_BASE_DIRECT}/${model}:generateContent?key=${key}`;
}
const SYSTEM_PROMPT = `Kamu adalah asisten pengetahuan budaya untuk Kabupaten Bantul, Daerah Istimewa Yogyakarta, Indonesia.
Tugas kamu adalah menjawab pertanyaan tentang tradisi, kuliner, kerajinan, seni pertunjukan, dan warisan budaya Bantul.
Panduan:
- Jawab dalam Bahasa Indonesia yang jelas dan mudah dipahami
- Jika pertanyaan dalam bahasa Inggris, jawab bilingual (Indonesia + Inggris singkat)
- Selalu bedakan antara fakta yang terdokumentasi dan informasi umum
- Jika tidak yakin, katakan dengan jujur bahwa kamu tidak memiliki informasi yang cukup
- Jangan mengarang fakta sejarah, nama tokoh, atau tanggal yang tidak kamu ketahui dengan pasti
- Fokus pada informasi yang edukatif, akurat, dan menghormati budaya lokal
- Sertakan konteks mengapa tradisi atau budaya tersebut penting`;

/**
 * Periksa apakah API key tersedia (dari sessionStorage).
 * @returns {boolean}
 */
export function hasApiKey() {
  if (geminiApiKey) return true;
  const stored = sessionStorage.getItem('bh_api_key');
  if (stored) {
    geminiApiKey = stored;
    currentMode = 'live';
    return true;
  }
  return false;
}

/**
 * Simpan API key untuk sesi ini (sessionStorage saja — hilang saat tab ditutup).
 * @param {string} key
 */
export function setApiKey(key) {
  if (!key || typeof key !== 'string' || key.trim().length < 10) {
    throw new Error('API key tidak valid.');
  }
  geminiApiKey = key.trim();
  sessionStorage.setItem('bh_api_key', geminiApiKey);
  currentMode = 'live';
}

/**
 * Hapus API key dan kembali ke mode demo.
 */
export function clearApiKey() {
  geminiApiKey = null;
  sessionStorage.removeItem('bh_api_key');
  currentMode = 'demo';
}

/**
 * Dapatkan mode saat ini.
 * @returns {'demo'|'live'}
 */
export function getCurrentMode() {
  if (hasApiKey()) return 'live';
  return 'demo';
}

/**
 * Kirim pertanyaan ke service yang aktif (demo atau live).
 * @param {string} question
 * @returns {Promise<object>} Respons terstruktur
 */
export async function ask(question) {
  if (!question || question.trim().length === 0) {
    throw new Error('Pertanyaan tidak boleh kosong.');
  }

  const mode = getCurrentMode();

  if (mode === 'live') {
    return await askGemini(question);
  } else {
    return await demoProcess(question);
  }
}

/**
 * Kirim pertanyaan ke Google Gemini API.
 * Mencoba beberapa model secara berurutan sampai berhasil.
 * @param {string} question
 * @returns {Promise<object>}
 */
async function askGemini(question) {
  const key = geminiApiKey || sessionStorage.getItem('bh_api_key');
  if (!key) {
    clearApiKey();
    return await demoProcess(question);
  }

  const body = {
    contents: [
      {
        parts: [{ text: `${SYSTEM_PROMPT}\n\nPertanyaan pengguna: ${question}` }]
      }
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1024,
    }
  };

  let lastError = null;

  // Coba setiap model sampai salah satu berhasil
  for (const model of GEMINI_MODELS) {
    try {
      const url = buildGeminiUrl(model, key);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      // API key tidak valid — langsung berhenti, jangan coba model lain
      if (response.status === 400) {
        const errData = await response.json().catch(() => ({}));
        const msg = errData?.error?.message || 'API key tidak valid.';
        clearApiKey();
        throw new Error(`API key ditolak: ${msg}`);
      }
      if (response.status === 401 || response.status === 403) {
        clearApiKey();
        throw new Error('API key tidak memiliki izin akses Gemini API. Pastikan Gemini API sudah diaktifkan di Google AI Studio.');
      }
      if (response.status === 429) {
        throw new Error('Kuota habis atau terlalu banyak permintaan. Tunggu beberapa menit lalu coba lagi.');
      }

      // 404 = model ini tidak tersedia untuk key ini, coba model berikutnya
      if (response.status === 404) {
        console.warn(`[AIService] Model ${model} tidak tersedia (404), mencoba model berikutnya...`);
        lastError = `Model ${model} tidak tersedia`;
        continue;
      }

      if (!response.ok) {
        lastError = `HTTP ${response.status} dari model ${model}`;
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        lastError = `Respons kosong dari model ${model}`;
        continue;
      }

      // Berhasil — simpan model yang bekerja untuk dipakai lagi
      console.info(`[AIService] Berhasil menggunakan model: ${model}`);
      return {
        type: 'live',
        title: 'Jawaban dari Gemini AI',
        summary: text,
        sections: [],
        significance: '',
        trustLevel: 'unverified',
        trustNote: 'Jawaban dihasilkan oleh model AI Google Gemini. Selalu verifikasi dengan sumber primer untuk penggunaan akademis.',
        source: `Google Gemini AI — ${model}`,
        topic: 'live'
      };

    } catch (err) {
      // Error yang bukan 404 (misal: API key invalid) — langsung lempar, jangan retry
      if (err.message.includes('API key') || err.message.includes('izin') || err.message.includes('Kuota')) {
        console.error('[AIService] Fatal error:', err.message);
        const demoResult = await demoProcess(question);
        demoResult._liveError = err.message;
        return demoResult;
      }
      lastError = err.message;
      continue;
    }
  }

  // Semua model gagal
  console.error('[AIService] Semua model gagal. Error terakhir:', lastError);
  const demoResult = await demoProcess(question);
  demoResult._liveError = `Semua model Gemini tidak dapat diakses dengan API key ini. Pastikan Gemini API sudah diaktifkan di: https://aistudio.google.com/`;
  return demoResult;
}
