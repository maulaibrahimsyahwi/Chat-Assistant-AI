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

> ⚠️ **Peringatan:** Proyek ini menggunakan arsitektur **frontend-backend terpisah** dengan alasan-alasan penting berikut

#### 🔐 **Keamanan API Key**

<table>
  <thead>
    <tr>
      <th>Komponen Keamanan</th>
      <th>Alasan</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Environment Variables</b></td>
      <td>Digunakan di React dan Vercel untuk mencegah eksposur sensitif data ke sisi klien (browser).</td>
    </tr>
    <tr>
      <td><b>API Keys</b></td>
      <td>Seperti <code>REPLICATE_API_TOKEN</code> akan terekspos di bundle JavaScript, sehingga perlu dihindari di sisi klien.</td>
    </tr>
    <tr>
      <td><b>Backend terpisah</b></td>
      <td>Menjaga keamanan kredensial dengan menyimpannya hanya di sisi server.</td>
    </tr>
  </tbody>
</table>

#### ⚙️ **Masalah Deployment Vercel**

**React Vite** project tidak otomatis mendeteksi folder `api/` sebagai serverless functions
**Vercel** membutuhkan konfigurasi khusus atau struktur Next.js untuk auto-detect API routes
**Repository terpisah** memastikan backend di-deploy sebagai dedicated API server

**Solution: Repository Terpisah**

```
frontend/          # React Vite - Deploy sebagai static site
backend/           # Node.js Express - Deploy sebagai API server
```

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

#### 2. Setup Frontend

```bash
# Install dependencies
npm install

# Setup required package.json
cp frontend

# setup Package.json di folder frontend
  "dependencies": {
    "@tailwindcss/vite": "^4.1.11",
    "@vercel/speed-insights": "^1.2.0",
    "groq-sdk": "^0.30.0",  #(opsional jika ingin menggunakan dari groq)
    "gsap": "^3.13.0",
    "katex": "^0.16.22",
    "lucide-react": "^0.539.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-katex": "^3.1.0",
    "react-markdown": "^10.1.0",
    "tailwindcss": "^4.1.11"
  },
```

**Konfigurasi .env (Frontend - Aman):**

```env
# ✅ Hanya URL endpoint backend - AMAN untuk frontend lokal server
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Chat Assistant AI

# ❌ JANGAN PERNAH simpan API keys di frontend jika ingin dideploy!
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

> **Detail API lengkap:** Lihat dokumentasi di [api-key-replicate repository](https://github.com/maulaibrahimsyahwi/api-key-replicate)

#### Frontend

<table>
  <thead>
    <tr>
      <th>React 19</th>
      <th>Vite</th>
      <th>Tailwind CSS</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Lucide React</td>
      <td>GSAP</td>
      <td>React Markdown</td>
    </tr>
    <tr>
      <td>React KaTeX</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

### Backend (Repository Terpisah)

<style>
  /* Menambahkan garis bawah pada header tabel */
  th {
    border-bottom: 2px solid #000;
  }
  
  /* Menambahkan garis bawah pada setiap baris data */
  td {
    border-bottom: 1px solid #ddd;
  }
</style>

<table>
  <thead>
    <tr>
      <th colspan="2">Teknologi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Node.js</td>
      <td>Express.js</td>
    </tr>
    <tr>
      <td>Replicate API</td>
      <td>IBM Granite 3.3</td>
    </tr>
  </tbody>
</table>

> Backend stack lengkap tersedia di [api-key-replicate](https://github.com/maulaibrahimsyahwi/api-key-replicate)

#### 🌐 Deployment

##### Frontend Deployment (Vercel)

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
   REPLICATE_API_TOKEN=r8-xxxxxxxxxxxxxxxxxxxxx
   ```

##### Backend Deployment

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

#### 🔒 **Security Benefits:**

<table>
  <tbody>
    <tr>
      <td>API Keys</td>
      <td>Environment variables</td>
    </tr>
    <tr>
      <td>CORS protection</td>
      <td>Rate limiting</td>
    </tr>
  </tbody>
</table>

#### ⚙️ Konfigurasi

##### Environment Variables

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

#### 📋 Related Repositories

<table>
  <thead>
    <tr>
      <th>Komponen</th>
      <th>Repositori</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Frontend</td>
      <td><a href="https://github.com/maulaibrahimsyahwi/Chat-Assistant-AI">Chat-Assistant-AI</a> (Repositori ini)</td>
    </tr>
    <tr>
      <td>Backend</td>
      <td><a href="https://github.com/maulaibrahimsyahwi/api-key-replicate">api-key-replicate</a> - Node.js API server dengan Replicate integration</td>
    </tr>
  </tbody>
</table>
