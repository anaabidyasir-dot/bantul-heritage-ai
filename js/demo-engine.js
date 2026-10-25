/**
 * demo-engine.js
 * Mesin pencocokan pertanyaan untuk mode demo Bantul Heritage AI.
 * Menggunakan pencocokan kata kunci sederhana — BUKAN AI generatif.
 */

let knowledgeBase = null;

/**
 * Muat knowledge base dari file JSON.
 * @returns {Promise<void>}
 */
async function loadKnowledgeBase() {
  if (knowledgeBase) return; // sudah dimuat
  try {
    const response = await fetch('./data/knowledge-base.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    knowledgeBase = data.entries;
  } catch (err) {
    console.error('[DemoEngine] Gagal memuat knowledge base:', err);
    knowledgeBase = [];
  }
}

/**
 * Cari entri terbaik berdasarkan kata kunci pertanyaan.
 * @param {string} question - Pertanyaan dari pengguna
 * @returns {object|null} Entri yang paling cocok, atau null
 */
function findBestMatch(question) {
  if (!knowledgeBase || knowledgeBase.length === 0) return null;

  const normalised = question
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // hapus aksen
    .replace(/[^a-z0-9\s]/g, ' ');  // hapus tanda baca

  const words = normalised.split(/\s+/).filter(w => w.length > 2);

  let bestEntry = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    if (entry.topic === '_fallback') continue;

    let score = 0;

    // Cek kecocokan kata kunci
    for (const keyword of entry.keywords) {
      const normKeyword = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (normalised.includes(normKeyword)) {
        // kata kunci lebih panjang = lebih spesifik = nilai lebih tinggi
        score += normKeyword.split(/\s+/).length * 2;
      }
    }

    // Cek kecocokan contoh pertanyaan (bonus)
    for (const example of entry.question_examples) {
      const normExample = example.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const exampleWords = normExample.split(/\s+/).filter(w => w.length > 2);
      const overlap = words.filter(w => exampleWords.includes(w)).length;
      score += overlap;
    }

    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  // Threshold minimum — jika skor terlalu rendah, anggap tidak cocok
  return bestScore >= 1 ? bestEntry : null;
}

/**
 * Proses pertanyaan pengguna dalam mode demo.
 * @param {string} question - Pertanyaan dari pengguna
 * @returns {Promise<object>} Objek respons terstruktur
 */
export async function processQuestion(question) {
  await loadKnowledgeBase();

  // Simulasi delay — agar terasa seperti sedang "memproses"
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));

  const match = findBestMatch(question);

  if (!match) {
    return buildFallbackResponse(question);
  }

  return buildResponse(match);
}

/**
 * Bangun objek respons dari entri knowledge base.
 * @param {object} entry
 * @returns {object}
 */
function buildResponse(entry) {
  return {
    type: 'answer',
    title: entry.title,
    summary: entry.answer.ringkasan,
    sections: entry.answer.isi,
    significance: entry.answer.signifikansi,
    trustLevel: entry.trust_level,      // 'verified' | 'unverified'
    trustNote: entry.trust_note,
    source: 'Basis Pengetahuan Demo — Bantul Heritage AI v1.0',
    topic: entry.topic
  };
}

/**
 * Bangun respons fallback ketika tidak ada entri yang cocok.
 * @param {string} question
 * @returns {object}
 */
function buildFallbackResponse(question) {
  return {
    type: 'fallback',
    title: 'Pertanyaan di Luar Cakupan Demo',
    summary: `Maaf, saya belum dapat menemukan jawaban untuk pertanyaan: "${question}"`,
    sections: [],
    significance: '',
    trustLevel: 'unverified',
    trustNote: 'Jawaban tidak ditemukan dalam basis pengetahuan demo saat ini.',
    source: null,
    topic: '_fallback',
    suggestions: [
      'Apa tradisi unik yang ada di Bantul?',
      'Apa makanan tradisional khas Bantul?',
      'Apa kerajinan tangan khas Bantul?',
      'Apa seni pertunjukan tradisional di Bantul?',
      'Ceritakan tentang Kerajinan Gerabah Kasongan'
    ]
  };
}
