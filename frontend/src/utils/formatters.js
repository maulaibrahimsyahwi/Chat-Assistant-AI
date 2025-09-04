// src/utils/formatters.js
import { CHAT_CONFIG } from "../constants";

// Utility function untuk ensure timestamp adalah Date object
const ensureDate = (timestamp) => {
  if (!timestamp) return new Date();
  // Jika sudah Date object
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Jika string atau number, convert ke Date
  const date = new Date(timestamp);
  // Check jika valid date
  if (isNaN(date.getTime())) {
    console.warn("Invalid timestamp:", timestamp);
    return new Date(); // fallback ke current time
  }

  return date;
};

export const formatTime = (timestamp) => {
  try {
    const date = ensureDate(timestamp);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};

// ... (fungsi format lainnya yang mungkin sudah ada) ...

// KODE BARU DIMULAI DARI SINI
/**
 * Membuat judul chat dari pesan pertama.
 */
export const generateChatTitle = (firstMessage) => {
  if (!firstMessage) return CHAT_CONFIG.DEFAULT_TITLE;
  let title = firstMessage.trim().substring(0, CHAT_CONFIG.TITLE_MAX_LENGTH);
  if (firstMessage.trim().length > CHAT_CONFIG.TITLE_MAX_LENGTH) {
    title += "...";
  }
  return title || CHAT_CONFIG.DEFAULT_TITLE;
};

/**
 * Membuat objek data chat yang siap disimpan untuk menghindari duplikasi.
 */
export const createChatDataObject = ({
  chatId,
  currentTitle,
  firstMessageText,
  messages,
  conversationHistory,
  existingChat,
}) => {
  const finalId = chatId || Date.now().toString();

  const title =
    currentTitle === CHAT_CONFIG.DEFAULT_TITLE && firstMessageText
      ? generateChatTitle(firstMessageText)
      : currentTitle;

  return {
    id: finalId,
    title,
    messages,
    conversationHistory,
    timestamp: existingChat?.timestamp || new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    messageCount: messages.length,
  };
};
