// api/server.js

import express from "express";
import cors from "cors";
import Replicate from "replicate"; // Pastikan Anda menggunakan Replicate atau Hugging Face
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Inisialisasi aplikasi Express
const app = express();

// Gunakan CORS
app.use(cors());

// Middleware untuk parse JSON
app.use(express.json());

// Inisialisasi Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Definisikan rute POST untuk /api/chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const model = "meta/llama-3-8b-instruct"; // Gunakan model yang aktif
    const input = {
      prompt: `[INST] ${message} [/INST]`,
      max_new_tokens: 1024,
    };

    const output = await replicate.run(model, { input });
    const aiResponse = output.join("");

    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("Error saat memanggil Replicate API:", error);
    res.status(500).json({ error: "Gagal berkomunikasi dengan model AI." });
  }
});

// Export aplikasi Express agar Vercel bisa menggunakannya
// Vercel akan secara otomatis menjalankan servernya.
export default app;
