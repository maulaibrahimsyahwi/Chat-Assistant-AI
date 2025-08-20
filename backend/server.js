// index.js (Backend Server)

import express from "express";
import cors from "cors";
import Replicate from "replicate";
import dotenv from "dotenv";

// Muat environment variables dari file .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Inisialisasi Replicate dengan API Token Anda
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.get("/", (req, res) => {
  res.send("Backend untuk Replicate sudah jalan!");
});

// Modifikasi endpoint /api/chat untuk memanggil Replicate
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log(`Menerima pesan: "${message}", memanggil model Granite...`);

    // Nama model yang digunakan di Replicate
    const model = "ibm-granite/granite-3.3-8b-instruct";

    // Siapkan input untuk model
    const input = {
      prompt: `[INST] ${message} [/INST]`, // Format prompt yang umum untuk model chat
      max_new_tokens: 1024, // Batasi panjang respons
    };

    // Panggil Replicate.run() untuk mendapatkan output
    const output = await replicate.run(model, { input });

    // Output dari Replicate biasanya berupa array string, kita gabungkan menjadi satu teks
    const aiResponse = output.join("");

    console.log(`Respons dari AI: "${aiResponse}"`);

    // Kirim balasan dari AI ke frontend
    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("Error saat memanggil Replicate API:", error);
    res.status(500).json({ error: "Gagal berkomunikasi dengan model AI." });
  }
});

// Jika tidak (artinya berjalan lokal), maka jalankan server.
if (process.env.VERCEL_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

// Baris ini tetap ada agar Vercel bisa mengimpornya
export default app;
