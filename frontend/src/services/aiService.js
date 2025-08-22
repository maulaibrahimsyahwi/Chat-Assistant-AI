export async function sendMessageToAI(message) {
  try {
    const response = await fetch(
      "https://api-key-replicate.vercel.app/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();

    // pastikan selalu string
    let replyText = "";
    if (typeof data.reply === "string") {
      replyText = data.reply;
    } else if (Array.isArray(data.reply)) {
      replyText = data.reply.join(" ");
    } else if (typeof data.reply === "object" && data.reply !== null) {
      replyText = JSON.stringify(data.reply);
    } else {
      replyText = String(data.reply || "");
    }

    return replyText;
  } catch (error) {
    console.error("API Call Error:", error);
    throw new Error(`Gagal memanggil API backend: ${error.message}`);
  }
}
