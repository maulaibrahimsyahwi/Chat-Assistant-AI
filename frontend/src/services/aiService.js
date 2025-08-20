// File: frontend/src/services/aiService.js

export const sendMessageToAI = async (message) => {
  try {
    // Untuk development dan production
    const baseURL =
      process.env.NODE_ENV === "production"
        ? "" // Akan menggunakan domain yang sama di production
        : "http://localhost:3000"; // Untuk development jika ada proxy

    const res = await fetch(`${baseURL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    return data.reply;
  } catch (error) {
    console.error("API Call Error:", error);
    throw new Error(`Gagal memanggil API backend: ${error.message}`);
  }
};
