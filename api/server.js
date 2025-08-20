// api/server.js

import express from "express";
import cors from "cors";
import Replicate from "replicate";
import dotenv from "dotenv";

// Load environment variables (Vercel akan otomatis menyediakannya)
dotenv.config();

// Inisialisasi aplikasi Express
const app = express();

// Gunakan CORS dan JSON middleware
app.use(cors());
app.use(express.json());

// Inisialisasi Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Definisikan rute POST untuk /api/chat
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Gunakan model yang aktif dan terbukti
    const model = "meta/llama-3-8b-instruct";
    const input = {
      prompt: message,
    };

    const output = await replicate.run(model, { input });
    const aiResponse = output.join("");

    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("Error saat memanggil Replicate API:", error);
    res.status(500).json({ error: "Gagal berkomunikasi dengan model AI." });
  }
});

// Export aplikasi untuk Vercel
export default app;
