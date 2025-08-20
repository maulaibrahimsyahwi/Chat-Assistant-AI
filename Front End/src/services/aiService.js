// aiservices.js

export const sendMessageToAI = async (message) => {
  const res = await fetch("http://localhost:3001/api/chat", {
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
