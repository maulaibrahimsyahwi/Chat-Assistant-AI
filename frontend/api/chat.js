await fetch("/api/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: "gambar kucing lucu",
  }),
});
