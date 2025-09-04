// src/constants.js

export const TYPING_EFFECT = {
  DEFAULT_SPEED: 40,
  INITIAL_DELAY: 0,
  LOOP_DELAY: 2000,
  CURSOR_BLINK_DURATION: 1,
};

export const CHAT_CONFIG = {
  DEFAULT_TITLE: "Chat Baru",
  TITLE_MAX_LENGTH: 60,
  HISTORY_MAX_LENGTH: 20,
  HISTORY_LIMIT: 50,
  SAVE_DELAY: 100,
};

export const TEXTAREA_STYLE = {
  MIN_HEIGHT_MOBILE: 36,
  MIN_HEIGHT_DESKTOP: 40,
  MAX_HEIGHT_MOBILE: 120,
  MAX_HEIGHT_DESKTOP: 200,
};

export const ERROR_MESSAGES = {
  AI_API_ERROR:
    "Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi.",
  API_BACKEND_FAILED: (message) => `Gagal memanggil API backend: ${message}`,
};
