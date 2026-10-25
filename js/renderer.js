/**
 * renderer.js
 * Mengubah objek respons dari AI Service menjadi elemen HTML.
 * Bantul Heritage AI
 */

/**
 * Buat elemen pesan pengguna.
 * @param {string} text
 * @returns {HTMLElement}
 */
export function createUserMessage(text) {
  const time = getCurrentTime();

  const msg = document.createElement('div');
  msg.className = 'message message--user';
  msg.setAttribute('role', 'article');
  msg.setAttribute('aria-label', `Pertanyaan Anda: ${text}`);

  msg.innerHTML = `
    <div class="message-avatar" aria-hidden="true">👤</div>
    <div class="message-body">
      <div class="message-content">
        <p>${escapeHtml(text)}</p>
      </div>
      <div class="message-meta">
        <span class="message-time" aria-label="Dikirim pukul ${time}">${time}</span>
      </div>
    </div>
  `;
  return msg;
}

/**
 * Buat elemen indikator loading (typing indicator).
 * @returns {HTMLElement}
 */
export function createLoadingMessage() {
  const msg = document.createElement('div');
  msg.className = 'message message--assistant message--loading';
  msg.id = 'loading-indicator';
  msg.setAttribute('role', 'status');
  msg.setAttribute('aria-label', 'Sedang memproses pertanyaan Anda...');

  msg.innerHTML = `
    <div class="message-avatar" aria-hidden="true">🏛️</div>
    <div class="message-body">
      <div class="message-content">
        <div class="typing-indicator" aria-hidden="true">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    </div>
  `;
  return msg;
}

/**
 * Buat elemen pesan jawaban asisten.
 * @param {object} response - Objek respons dari ai-service.js
 * @param {string} mode - 'demo' | 'live'
 * @returns {HTMLElement}
 */
export function createAssistantMessage(response, mode = 'demo') {
  const time = getCurrentTime();
  const isFallback = response.type === 'fallback';
  const isLive = response.type === 'live';

  const msg = document.createElement('div');
  msg.className = `message message--assistant${isFallback ? ' message--fallback' : ''}`;
  msg.setAttribute('role', 'article');

  // ---- Bangun konten utama ----
  let contentHtml = '';

  // Live error warning (jika Gemini gagal dan fallback ke demo)
  if (response._liveError) {
    const errMsg = escapeHtml(response._liveError);
    const showLink = response._liveError.includes('aistudio') || response._liveError.includes('diaktifkan');
    contentHtml += `
      <div class="answer-source" role="alert" style="border-left-color: var(--color-error); margin-bottom: 8px; background: #fff5f5;">
        ⚠️ <strong>Gemini AI gagal terhubung.</strong><br>
        <span style="font-size:0.85em">${errMsg}</span>
        ${showLink ? `<br><a href="https://aistudio.google.com/" target="_blank" rel="noopener" style="color:var(--color-primary);font-weight:600;">→ Buka Google AI Studio untuk aktifkan API</a>` : ''}
      </div>
    `;
  }

  // Judul
  contentHtml += `<p><strong>${escapeHtml(response.title)}</strong></p>`;

  // Ringkasan
  if (response.summary) {
    contentHtml += `<p>${escapeHtml(response.summary)}</p>`;
  }

  // Untuk jawaban live (Gemini) — tampilkan teks langsung dengan format paragraf
  if (isLive && response.sections.length === 0) {
    // Konten sudah ada di summary, tidak perlu section tambahan
  }

  // Untuk jawaban demo terstruktur
  if (response.sections && response.sections.length > 0) {
    contentHtml += `<div class="answer-section">`;
    contentHtml += `<p class="answer-section-title">Penjelasan Lebih Lanjut</p>`;

    for (const section of response.sections) {
      contentHtml += `
        <p><strong>📌 ${escapeHtml(section.subtopik)}</strong><br>
        ${escapeHtml(section.keterangan)}</p>
      `;
    }
    contentHtml += `</div>`;
  }

  // Signifikansi budaya
  if (response.significance) {
    contentHtml += `
      <div class="answer-section">
        <p class="answer-section-title">Makna & Signifikansi Budaya</p>
        <p><em>${escapeHtml(response.significance)}</em></p>
      </div>
    `;
  }

  // Saran pertanyaan (fallback)
  if (isFallback && response.suggestions && response.suggestions.length > 0) {
    contentHtml += `
      <div class="answer-section">
        <p class="answer-section-title">Coba Salah Satu Pertanyaan Ini:</p>
        <ul>
          ${response.suggestions.map(s => `<li><button class="suggestion-inline-btn" data-question="${escapeHtml(s)}">${escapeHtml(s)}</button></li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Sumber
  if (response.source) {
    contentHtml += `
      <div class="answer-source">
        📎 <strong>Sumber:</strong> ${escapeHtml(response.source)}
        ${response.trustNote ? `<br><em>${escapeHtml(response.trustNote)}</em>` : ''}
      </div>
    `;
  } else if (isFallback) {
    contentHtml += `
      <div class="answer-source">
        <em>${escapeHtml(response.trustNote)}</em>
      </div>
    `;
  }

  // ---- Badges ----
  const modeBadge = mode === 'live'
    ? `<span class="badge badge--info" title="Dijawab oleh Google Gemini AI">🤖 Mode Live AI</span>`
    : `<span class="badge badge--demo" title="Jawaban dari basis pengetahuan demo, bukan AI sungguhan">⚙️ Mode Demo</span>`;

  const trustBadge = response.trustLevel === 'verified'
    ? `<span class="badge badge--verified" title="${escapeHtml(response.trustNote || '')}">✅ Terverifikasi</span>`
    : `<span class="badge badge--unverified" title="${escapeHtml(response.trustNote || '')}">⚠️ Belum Diverifikasi</span>`;

  // ---- Rakit elemen ----
  msg.innerHTML = `
    <div class="message-avatar" aria-hidden="true">🏛️</div>
    <div class="message-body">
      <div class="message-content">
        ${contentHtml}
      </div>
      <div class="message-meta">
        ${modeBadge}
        ${trustBadge}
        <span class="message-time" aria-label="Diterima pukul ${time}">${time}</span>
      </div>
    </div>
  `;

  return msg;
}

/**
 * Buat pesan error sistem.
 * @param {string} errorText
 * @returns {HTMLElement}
 */
export function createErrorMessage(errorText) {
  const msg = document.createElement('div');
  msg.className = 'message message--assistant message--fallback';
  msg.setAttribute('role', 'alert');

  msg.innerHTML = `
    <div class="message-avatar" aria-hidden="true">⚠️</div>
    <div class="message-body">
      <div class="message-content">
        <p><strong>Terjadi Kesalahan</strong></p>
        <p>${escapeHtml(errorText)}</p>
        <p><em>Silakan coba lagi. Jika masalah berlanjut, muat ulang halaman.</em></p>
      </div>
      <div class="message-meta">
        <span class="badge badge--unverified">❌ Error</span>
      </div>
    </div>
  `;
  return msg;
}

// ---- Helpers ----

function getCurrentTime() {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Escape HTML untuk mencegah XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
