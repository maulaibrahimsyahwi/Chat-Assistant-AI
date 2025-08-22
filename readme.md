# Chat Assistant AI

**Chat Assistant AI** adalah aplikasi frontend modern yang menyediakan antarmuka chat interaktif dengan AI assistant. Dibangun menggunakan React (Vite + Tailwind CSS) dan terintegrasi dengan backend terpisah yang menangani API Replicate.

> **Backend Repository:** [api-key-replicate](https://github.com/maulaibrahimsyahwi/api-key-replicate)

#### ✨ Fitur Utama

<table>
  <tbody>
    <tr>
      <td>💬 Chat Interaktif</td>
      <td>🚀 Performa Tinggi</td>
    </tr>
    <tr>
      <td>🎨 UI Modern</td>
      <td>🔗 API Integration</td>
    </tr>
    <tr>
      <td>📝 Markdown Support</td>
      <td>📊 Analytics</td>
    </tr>
    <tr>
      <td>➗ Math Rendering</td>
      <td>🌐 Responsive Design</td>
    </tr>
  </tbody>
</table>

> ⚠️ **Peringatan:** Proyek ini menggunakan arsitektur **frontend-backend terpisah** dengan alasan-alasan penting berikut:

#### 🔐 **Keamanan API Key**

**Environment Variables** di frontend dapat diakses oleh client (browser)
**API Keys** seperti `REPLICATE_API_TOKEN` akan terekspos di bundle JavaScript
**Backend terpisah** menjaga keamanan credentials di server-side only

#### ⚙️ **Masalah Deployment Vercel**

**React Vite** project tidak otomatis mendeteksi folder `api/` sebagai serverless functions
**Vercel** membutuhkan konfigurasi khusus atau struktur Next.js untuk auto-detect API routes
**Repository terpisah** memastikan backend di-deploy sebagai dedicated API server

> **Backend Repository:** [api-key-replicate](https://github.com/maulaibrahimsyahwi/api-key-replicate)

#### 📁 Struktur Proyek Frontend

```
Chat-Assistant-AI/
├── public/                     # Static assets
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/             # Reusable React components
│   │   ├── Chat/              # Chat-related components
│   │   ├── UI/                # General UI components
│   │   └── Layout/            # Layout components
│   ├── services/              # API service functions
│   │   └── apiService.js      # Backend API integration
│   ├── utils/                 # Utility functions
│   ├── styles/                # Global styles
│   ├── hooks/                 # Custom React hooks
│   ├── App.jsx               # Main App component
│   └── main.jsx              # Application entry point
├── package.json
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
└── README.md
```

### 🚀 Instalasi & Setup

### Prequisites

- Node.js 18+
- npm atau yarn
- Backend API server yang sudah running

#### 1. Clone Frontend Repository

```bash
git clone https://github.com/maulaibrahimsyahwi/Chat-Assistant-AI.git
cd Chat-Assistant-AI
```

> ##### ⚠️ **Peringatan Keamanan**
>
> **❌ JANGAN LAKUKAN (Berbahaya):**

```javascript
// ❌ DI FRONTEND - API Key akan terekspos!
const REPLICATE_API_TOKEN = "r8_xxxxxxxxxxxxxxxxxxxx"; // BAHAYA!

// ❌ Environment variable di Vite akan terbaca di browser
const token = import.meta.env.VITE_REPLICATE_API_TOKEN; // BAHAYA!
```

**✅ CARA YANG BENAR:**

```javascript
// ✅ DI FRONTEND - Hanya komunikasi ke backend
const response = await fetch("/api/generate", {
  method: "POST",
  body: JSON.stringify({ message }),
});

// ✅ API Key aman tersimpan di backend server
```

**Solution: Repository Terpisah**

```
frontend/          # React Vite - Deploy sebagai static site
backend/           # Node.js Express - Deploy sebagai API server
```

#### 3. Setup Frontend

```bash
# Install dependencies
npm install

# Setup environment variables (opsional)
cp .env.example .env
```

**Konfigurasi .env (Frontend - Aman):**

```env
# ✅ Hanya URL endpoint backend - AMAN untuk frontend
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Chat Assistant AI

# ❌ JANGAN PERNAH simpan API keys di frontend!
# VITE_REPLICATE_API_TOKEN=xxx  # BAHAYA! Akan terekspos di browser
```

**Jalankan development server:**

```bash
npm run dev
```

Frontend akan tersedia di `http://localhost:5173`

#### 🔌 API Integration

Frontend ini berkomunikasi dengan backend API yang terpisah untuk menangani request AI.

#### API Service Configuration

**File: `src/services/apiService.js`**

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const sendMessage = async (message) => {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
};
```

### 🚀 Backend API Endpoints

Backend repository menyediakan endpoint berikut:

**POST** `/api/generate`

> **Detail API lengkap:** Lihat dokumentasi di [api-key-replicate repository](https://github.com/maulaibrahimsyahwi/api-key-replicate)

#### Frontend

- **React 19**
- **Vite**
- **Tailwind CSS**
- **Lucide React**
- **GSAP**
- **React Markdown**
- **React KaTeX**

### Backend (Repository Terpisah)

**Node.js** **,** **Express.js** **,** **Replicate API** **,** **IBM Granite 3.3**

> Backend stack lengkap tersedia di [api-key-replicate](https://github.com/maulaibrahimsyahwi/api-key-replicate)

### 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Build aplikasi:**

   ```bash
   npm run build
   ```

2. **Deploy ke Vercel:**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel --prod
   ```

3. **Environment Variables di Vercel:**
   ```
   VITE_API_BASE_URL=https://your-backend-api.com/api
   ```

### 🚀 Backend Deployment

Backend di-deploy secara terpisah. Ikuti panduan deployment di [api-key-replicate repository](https://github.com/maulaibrahimsyahwi/api-key-replicate).

#### Konfigurasi CORS & Security

Pastikan backend dikonfigurasi untuk menerima request dari domain frontend yang authorized:

```javascript
// ✅ Di backend - CORS configuration
const allowedOrigins = [
  "http://localhost:5173", // Development frontend
  "https://your-frontend-domain.com", // Production frontend
];

// ✅ API Key tersimpan aman di backend environment
// process.env.REPLICATE_API_TOKEN (server-side only)
```

### 🔒 **Security Benefits:**

**API Keys** **,** **Environment variables** **,** **CORS protection** **,** **Rate limiting**

## ⚙️ Konfigurasi

### Environment Variables

**Development (.env):**

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Chat Assistant AI
VITE_DEBUG=true
```

**Production:**

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
REPLICATE_API_TOKEN=r8-xxxxxxxxxxxxxxxxxxx
```

### Vite Configuration

**vite.config.js:**

```javascript
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
```

### 📋 Related Repositories

- **Frontend**: [Chat-Assistant-AI](https://github.com/maulaibrahimsyahwi/Chat-Assistant-AI) (Repository ini)
- **Backend**: [api-key-replicate](https://github.com/maulaibrahimsyahwi/api-key-replicate) - Node.js API server dengan Replicate integration
