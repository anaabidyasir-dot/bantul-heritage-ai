/**
 * modal.js
 * Logika modal konfigurasi API key untuk Bantul Heritage AI.
 * Mengelola buka/tutup modal, input API key, dan feedback pengguna.
 */

import { setApiKey, clearApiKey, hasApiKey, getCurrentMode } from './ai-service.js';

// ---- Elemen DOM ----
const modal          = document.getElementById('api-modal');
const openBtn        = document.getElementById('api-key-btn');
const closeBtn       = document.getElementById('modal-close');
const apiKeyForm     = document.getElementById('api-key-form');
const apiKeyInput    = document.getElementById('api-key-input');
const toggleVis      = document.getElementById('toggle-visibility');
const clearKeyBtn    = document.getElementById('clear-key-btn');
const modalStatus    = document.getElementById('modal-status');
const modeBadge      = document.getElementById('mode-badge');

/**
 * Inisialisasi modal.
 */
export function initModal() {
  if (!modal || !openBtn) return;

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  apiKeyForm.addEventListener('submit', handleSave);
  clearKeyBtn.addEventListener('click', handleClear);
  toggleVis.addEventListener('click', toggleVisibility);

  // Tutup modal saat klik overlay (di luar modal-box)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Tutup modal dengan Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // Sinkron status awal jika sudah ada API key di sessionStorage
  syncModalStatus();
}

/**
 * Buka modal.
 */
function openModal() {
  modal.hidden = false;
  document.body.style.overflow = 'hidden'; // cegah scroll halaman di belakang
  clearStatus();

  // Jika sudah ada key, tampilkan status aktif
  if (hasApiKey()) {
    apiKeyInput.value = '';
    apiKeyInput.placeholder = '••••••••••••••••••••• (sudah dikonfigurasi)';
    showStatus('✅ Mode Live AI aktif. Masukkan key baru untuk mengganti, atau klik Hapus untuk kembali ke Mode Demo.', 'success');
  } else {
    apiKeyInput.placeholder = 'AIzaSy...';
    apiKeyInput.value = '';
  }

  // Fokus ke input
  setTimeout(() => apiKeyInput.focus(), 50);
}

/**
 * Tutup modal.
 */
function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
  clearStatus();
  apiKeyInput.classList.remove('input--error');
  // Kembalikan fokus ke tombol pembuka
  openBtn.focus();
}

/**
 * Simpan API key.
 */
function handleSave(e) {
  e.preventDefault();
  const key = apiKeyInput.value.trim();

  if (!key) {
    showStatus('⚠️ Harap masukkan API key terlebih dahulu.', 'error');
    apiKeyInput.classList.add('input--error');
    apiKeyInput.focus();
    return;
  }

  if (key.length < 10) {
    showStatus('⚠️ API key terlalu pendek. Pastikan sudah menyalin key lengkap dari Google AI Studio.', 'error');
    apiKeyInput.classList.add('input--error');
    apiKeyInput.focus();
    return;
  }

  try {
    setApiKey(key);
    apiKeyInput.classList.remove('input--error');
    apiKeyInput.value = '';
    apiKeyInput.placeholder = '••••••••••••••••••••• (sudah dikonfigurasi)';
    showStatus('✅ API key berhasil disimpan! Mode Live AI aktif.', 'success');
    updateModeBadge();

    // Tutup modal setelah 1.5 detik
    setTimeout(closeModal, 1500);

  } catch (err) {
    showStatus(`❌ Gagal menyimpan API key: ${err.message}`, 'error');
  }
}

/**
 * Hapus API key dan kembali ke mode demo.
 */
function handleClear() {
  clearApiKey();
  apiKeyInput.value = '';
  apiKeyInput.placeholder = 'AIzaSy...';
  apiKeyInput.classList.remove('input--error');
  showStatus('🗑️ API key dihapus. Kembali ke Mode Demo.', 'success');
  updateModeBadge();

  setTimeout(closeModal, 1200);
}

/**
 * Toggle visibilitas API key (password ↔ text).
 */
function toggleVisibility() {
  const isHidden = apiKeyInput.type === 'password';
  apiKeyInput.type = isHidden ? 'text' : 'password';
  toggleVis.textContent = isHidden ? '🙈' : '👁️';
  toggleVis.setAttribute('aria-label', isHidden ? 'Sembunyikan API key' : 'Tampilkan API key');
}

/**
 * Tampilkan pesan status di dalam modal.
 */
function showStatus(message, type = 'success') {
  modalStatus.textContent = message;
  modalStatus.className = `modal-status status--${type}`;
}

/**
 * Hapus pesan status.
 */
function clearStatus() {
  modalStatus.textContent = '';
  modalStatus.className = 'modal-status';
}

/**
 * Sinkron badge mode di header.
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
 * Sinkron status saat halaman dimuat.
 */
function syncModalStatus() {
  updateModeBadge();
}
