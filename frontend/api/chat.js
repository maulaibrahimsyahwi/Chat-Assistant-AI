async function askGranite() {
  const res = await fetch("https://api-key-replicate.vercel.app/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Tuliskan pantun tentang koding!" }),
  });

  const data = await res.json();
  console.log("AI Reply:", data.reply);
}

askGranite();
