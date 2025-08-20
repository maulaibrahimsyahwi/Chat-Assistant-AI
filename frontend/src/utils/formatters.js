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

export const formatDate = (timestamp) => {
  try {
    const date = ensureDate(timestamp);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

export const formatDateTime = (timestamp) => {
  try {
    const date = ensureDate(timestamp);
    return date.toLocaleString("id-ID", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return new Date().toLocaleString("id-ID", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};

// Fungsi tambahan untuk formatting yang lebih fleksibel
export const formatRelativeTime = (timestamp) => {
  try {
    const date = ensureDate(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
      return "Baru saja";
    } else if (diffMins < 60) {
      return `${diffMins} menit lalu`;
    } else if (diffHours < 24) {
      return `${diffHours} jam lalu`;
    } else if (diffDays === 1) {
      return "Kemarin";
    } else if (diffDays < 7) {
      return `${diffDays} hari lalu`;
    } else {
      return formatDate(date);
    }
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "Tidak diketahui";
  }
};

// Fungsi untuk format tanggal di sidebar (seperti yang sudah ada)
export const formatSidebarDate = (timestamp) => {
  try {
    const date = ensureDate(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Kemarin";
    } else if (diffDays < 7) {
      return `${diffDays} hari lalu`;
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
    }
  } catch (error) {
    console.error("Error formatting sidebar date:", error);
    return "Tidak diketahui";
  }
};

// Fungsi untuk validate dan normalize timestamp sebelum save
export const normalizeTimestamp = (timestamp) => {
  try {
    const date = ensureDate(timestamp);
    return date.toISOString(); // Always save as ISO string
  } catch (error) {
    console.error("Error normalizing timestamp:", error);
    return new Date().toISOString();
  }
};
