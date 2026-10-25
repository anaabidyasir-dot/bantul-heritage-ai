/**
 * chat.js
 * Logic antarmuka percakapan untuk Bantul Heritage AI.
 * Mengelola form input, pesan, scroll, dan interaksi.
 */

import { ask, getCurrentMode, hasApiKey } from './ai-service.js';
import {
  createUserMessage,
  createLoadingMessage,
  createAssistantMessage,
  createErrorMessage
} from './renderer.js';

// ---- Referensi elemen DOM ----
const chatForm     = document.getElementById('chat-form');
const chatInput    = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const sendBtn      = document.getElementById('send-btn');
const charCount    = document.getElementById('char-count');
const modeBadge    = document.getElementById('mode-badge');

// ---- State ----
let isProcessing = false;

/**
 * Inisialisasi komponen chat.
 */
export function initChat() {
  if (!chatForm || !chatInput || !chatMessages) {
    console.error('[Chat] Elemen DOM tidak ditemukan.');
    return;
  }

  bindEvents();
  updateModeBadge();
  setTimestamp();
}

/**
 * Pasang event listener.
 */
function bindEvents() {
  // Submit form
  chatForm.addEventListener('submit', handleSubmit);

  // Textarea: auto-resize, char count, Enter = submit
  chatInput.addEventListener('input', handleInputChange);
  chatInput.addEventListener('keydown', handleKeyDown);

  // Tombol saran (delegasi event)
  document.querySelector('.suggestions-grid')?.addEventListener('click', handleSuggestionClick);

  // Delegasi untuk tombol saran inline (di dalam pesan fallback)
  chatMessages.addEventListener('click', handleInlineSuggestionClick);
}

/**
 * Handle klik tombol saran.
 */
function handleSuggestionClick(e) {
  const btn = e.target.closest('.suggestion-btn');
  if (!btn) return;
  const question = btn.dataset.question;
  if (question) {
    chatInput.value = question;
    syncInputState();
    chatInput.focus();
    // Langsung kirim
    submitQuestion(question);
  }
}

/**
 * Handle klik tombol saran inline (di dalam pesan fallback).
 */
function handleInlineSuggestionClick(e) {
  const btn = e.target.closest('.suggestion-inline-btn');
  if (!btn) return;
  const question = btn.dataset.question;
  if (question) {
    chatInput.value = question;
    syncInputState();
    submitQuestion(question);
  }
}

/**
 * Handle perubahan input textarea.
 */
function handleInputChange() {
  autoResizeTextarea();
  syncInputState();
  removeValidationError();
}

/**
 * Handle keydown — Enter kirim, Shift+Enter baris baru.
 */
function handleKeyDown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.requestSubmit();
  }
}

/**
 * Handle submit form.
 */
async function handleSubmit(e) {
  e.preventDefault();
  const question = chatInput.value.trim();
  await submitQuestion(question);
}

/**
 * Proses pengiriman pertanyaan.
 * @param {string} question
 */
async function submitQuestion(question) {
  if (isProcessing) return;

  // Validasi
  if (!question) {
    showValidationError('Harap ketik pertanyaan terlebih dahulu. / Please type a question first.');
    chatInput.focus();
    return;
  }
  if (question.length > 500) {
    showValidationError('Pertanyaan terlalu panjang (maksimal 500 karakter).');
    return;
  }

  isProcessing = true;
  setFormDisabled(true);

  // Tampilkan pesan pengguna
  const userMsg = createUserMessage(question);
  appendMessage(userMsg);

  // Bersihkan input
  chatInput.value = '';
  syncInputState();

  // Tampilkan loading
  const loadingMsg = createLoadingMessage();
  appendMessage(loadingMsg);
  scrollToBottom();

  try {
    const mode = getCurrentMode();
    const response = await ask(question);

    // Hapus loading
    loadingMsg.remove();

    // Tampilkan jawaban
    const answerMsg = createAssistantMessage(response, mode);
    appendMessage(answerMsg);

  } catch (err) {
    loadingMsg.remove();
    const errorMsg = createErrorMessage(err.message || 'Terjadi kesalahan yang tidak diketahui.');
    appendMessage(errorMsg);
  } finally {
    isProcessing = false;
    setFormDisabled(false);
    chatInput.focus();
    scrollToBottom();
    updateModeBadge();
  }
}

// ---- Helpers ----

/**
 * Tambahkan elemen pesan ke chat window dan scroll.
 */
function appendMessage(element) {
  chatMessages.appendChild(element);
  scrollToBottom();
}

/**
 * Scroll chat ke bawah.
 */
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Auto-resize textarea sesuai konten.
 */
function autoResizeTextarea() {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
}

/**
 * Update char count display.
 */
function syncInputState() {
  const len = chatInput.value.length;
  charCount.textContent = `${len} / 500`;
  charCount.className = 'char-count';
  if (len > 400) charCount.classList.add('char-count--warn');
  if (len > 500) charCount.classList.add('char-count--over');
}

/**
 * Enable/disable form input.
 */
function setFormDisabled(disabled) {
  chatInput.disabled = disabled;
  sendBtn.disabled = disabled;
  if (disabled) {
    sendBtn.setAttribute('aria-busy', 'true');
    sendBtn.innerHTML = `<span class="send-icon" aria-hidden="true">⏳</span> <span class="send-label">Memproses...</span>`;
  } else {
    sendBtn.removeAttribute('aria-busy');
    sendBtn.innerHTML = `<span class="send-icon" aria-hidden="true">➤</span> <span class="send-label">Kirim</span>`;
  }
}

/**
 * Tampilkan pesan validasi error.
 */
function showValidationError(message) {
  let errorEl = document.getElementById('validation-error');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.id = 'validation-error';
    errorEl.className = 'validation-error';
    errorEl.setAttribute('role', 'alert');
    chatForm.appendChild(errorEl);
  }
  errorEl.textContent = message;
  errorEl.classList.add('visible');
  chatInput.classList.add('input--error');
}

/**
 * Hapus pesan validasi error.
 */
function removeValidationError() {
  const errorEl = document.getElementById('validation-error');
  if (errorEl) errorEl.classList.remove('visible');
  chatInput.classList.remove('input--error');
}

/**
 * Perbarui badge mode di header.
 */
function updateModeBadge() {
  if (!modeBadge) return;
  if (hasApiKey()) {
    modeBadge.textContent = '🤖 Mode Live AI';
    modeBadge.className = 'mode-badge mode-badge--live';
  } else {
    modeBadge.textContent = '⚙️ Mode Demo';
    modeBadge.className = 'mode-badge';
  }
}

/**
 * Set timestamp pada pesan sambutan.
 */
function setTimestamp() {
  const timeEl = document.querySelector('.message--assistant .message-time');
  if (timeEl) {
    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    timeEl.textContent = now;
    timeEl.setAttribute('aria-label', `Diterima pukul ${now}`);
  }
}
