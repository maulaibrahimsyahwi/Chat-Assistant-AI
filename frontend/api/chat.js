// pages/api/chat.js
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const output = await replicate.run("ibm-granite/granite-3.3-8b-instruct", {
      input: {
        prompt: message,
        max_new_tokens: 200,
      },
    });

    const reply = Array.isArray(output) ? output.join("") : String(output);

    res.status(200).json({ reply, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ error: err.message });
  }
}
