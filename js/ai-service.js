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

// Konstanta
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
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
        role: 'user',
        parts: [{ text: `${SYSTEM_PROMPT}\n\nPertanyaan pengguna: ${question}` }]
      }
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1024,
    }
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (response.status === 400) {
      throw new Error('Permintaan tidak valid. Periksa format pertanyaan Anda.');
    }
    if (response.status === 403 || response.status === 401) {
      clearApiKey();
      throw new Error('API key tidak valid atau tidak memiliki akses. Kembali ke mode demo.');
    }
    if (response.status === 429) {
      throw new Error('Terlalu banyak permintaan. Harap tunggu beberapa saat dan coba lagi.');
    }
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Respons dari Gemini tidak valid atau kosong.');
    }

    return {
      type: 'live',
      title: 'Jawaban dari Gemini AI',
      summary: text,
      sections: [],
      significance: '',
      trustLevel: 'unverified',
      trustNote: 'Jawaban dihasilkan oleh model AI Google Gemini. Selalu verifikasi dengan sumber primer untuk penggunaan akademis.',
      source: 'Google Gemini AI (Live Mode)',
      topic: 'live'
    };

  } catch (err) {
    // Jika API gagal, fallback ke demo dengan notifikasi
    console.error('[AIService] Gemini error:', err.message);
    const demoResult = await demoProcess(question);
    demoResult._liveError = err.message;
    return demoResult;
  }
}
