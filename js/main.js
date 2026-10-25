/**
 * main.js
 * Entry point aplikasi Bantul Heritage AI.
 * Menginisialisasi semua modul.
 */

import { initChat } from './chat.js';
import { initModal } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inisialisasi antarmuka chat
  initChat();

  // Inisialisasi modal API key
  initModal();

  // Perbarui tahun di footer jika ada elemen dinamis
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  console.info(
    '%c🏛️ Bantul Heritage AI v1.0',
    'color: #C8922A; font-weight: bold; font-size: 14px;'
  );
  console.info(
    '%cMode Demo aktif. Untuk mengaktifkan Gemini AI, konfigurasi API key.',
    'color: #7A5C42; font-size: 12px;'
  );
});
