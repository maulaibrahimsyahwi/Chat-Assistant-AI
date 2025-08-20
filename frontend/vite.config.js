import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],

  // KONFIGURASI PROXY INI HANYA UNTUK DEVELOPMENT LOKAL
  // TIDAK BERPENGARUH DI VERCEL
  server: {
    proxy: {
      "/api": {
        // Pastikan target ini sesuai dengan server API lokal Anda
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },

  // TAMBAHKAN BAGIAN INI UNTUK MEMASTIKAN KOMPATIBILITAS BROWSER
  build: {
    // Target 'es2015' akan mengonversi kode Anda ke sintaks yang
    // didukung oleh sebagian besar browser selama bertahun-tahun.
    target: "es2015",
  },
});
