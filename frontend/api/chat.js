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

    const output = await replicate.run(
      "ibm-granite/granite-3.3-8b-instruct", // ganti model id
      { input: { prompt: message } }
    );

    res.status(200).json({ reply: output.join(" ") });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: error.message });
  }
}
