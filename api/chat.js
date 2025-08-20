// File: api/chat.js
// Lokasi: ROOT_PROJECT/api/chat.js (BUKAN di dalam frontend!)

export default function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only POST allowed
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      allowedMethods: ["POST"],
    });
  }

  try {
    const { message } = req.body;

    // Validate message
    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    // Simple AI response (replace with your AI logic)
    const reply = `AI Response: You said "${message}". This is a test response from the API.`;

    return res.status(200).json({
      reply,
      timestamp: new Date().toISOString(),
      status: "success",
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
