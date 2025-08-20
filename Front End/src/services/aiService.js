// aiservices.js

export const sendMessageToAI = async (message) => {
  // Cukup gunakan path relatif "/api/chat"
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("Gagal memanggil API backend");
  }

  const data = await res.json();
  return data.reply;
};
