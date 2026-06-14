<div align="center">

# 🏥 ASETRA
### Sistem Manajemen Aset Rumah Sakit

**A**set **S**ehat, **E**fisien, **T**erintegrasi, **R**eliabl**A**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 📋 Tentang Proyek

**ASETRA** adalah aplikasi manajemen aset rumah sakit berbasis web untuk membantu pihak rumah sakit dalam mengelola aset medis dan non-medis secara digital dan terintegrasi.

### 🎯 Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🔐 **Autentikasi** | Login dengan JWT Token, role-based access (Admin & Teknisi) |
| 📦 **Manajemen Aset** | CRUD aset lengkap dengan upload foto & dokumen PDF |
| 🔧 **Laporan Perbaikan** | Sistem tiket kerusakan dari lapor hingga selesai |
| 📋 **Pengajuan Aset** | Workflow permintaan aset baru dengan approve/reject |
| 🔄 **Mutasi Aset** | Pemindahan aset antar ruangan/rumah sakit |
| 📅 **Kalibrasi** | Penjadwalan dan tracking kalibrasi dengan upload sertifikat PDF |
| 🔔 **Notifikasi** | Notifikasi real-time untuk kalibrasi jatuh tempo & perbaikan mendesak |
| 📊 **Dashboard** | Statistik ringkasan, grafik aktivitas, dan laporan mendatang |
| 📱 **Dashboard Teknisi** | Antarmuka mobile-first khusus untuk teknisi lapangan |

---

## 🏗️ Arsitektur Sistem

```
PT.AMK/
├── src/                        # Frontend (React + Vite)
│   ├── components/             # Komponen reusable (Layout, Toast, ProtectedRoute, dll)
│   ├── pages/
│   │   ├── dashboard/          # Halaman Admin
│   │   └── technician/         # Halaman Teknisi (mobile-first)
│   └── services/
│       └── api.js              # Centralized API client dengan global 401 handler
│
├── backend/                    # Backend (Node.js + Express)
│   ├── config/
│   │   └── database.js         # Konfigurasi Sequelize + SQLite
│   ├── controllers/            # Business logic tiap modul
│   ├── middleware/
│   │   └── auth.js             # JWT protect + role authorize
│   ├── models/                 # Sequelize ORM models
│   ├── routes/                 # Express router dengan RBAC
│   ├── uploads/                # File uploads (foto aset, sertifikat PDF)
│   └── server.js               # Entry point + auto-seeder
│
└── public/                     # Static assets (logo, dll)
```

---

## ⚙️ Teknologi

### Frontend
- **React 18** + **Vite 5** — UI framework & build tool
- **React Router v6** — Client-side routing dengan `ProtectedRoute`
- **Lucide React** — Ikon modern
- **Vanilla CSS** — Styling tanpa framework CSS

### Backend
- **Node.js 18+** — Runtime JavaScript
- **Express 4** — REST API framework
- **Sequelize ORM** — Database abstraction layer
- **SQLite** — Database ringan (tidak perlu instalasi server DB terpisah)
- **JWT (jsonwebtoken)** — Autentikasi stateless
- **Multer** — Upload file (gambar & PDF multi-field)
- **bcryptjs** — Hashing password

---

## 🚀 Cara Menjalankan

### Prasyarat
- [Node.js](https://nodejs.org/) versi **18 atau lebih baru**
- npm (sudah termasuk bersama Node.js)
- Git

### 1. Clone Repositori

```bash
git clone https://github.com/<username>/asetra.git
cd asetra
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di dalam folder `backend/`:

```env
PORT=5000
NODE_ENV=development
DB_TYPE=sqlite
DB_STORAGE=database.sqlite
JWT_SECRET=ganti_dengan_secret_key_yang_aman_dan_panjang
```

Jalankan server backend:

> **Catatan**: Pastikan Anda berada di direktori backend (`cd backend`) sebelum menjalankan perintah berikut.

```bash
npm run dev
```

Backend berjalan di: **http://localhost:5000**

> ℹ️ **Auto Seed:** Database SQLite (`database.sqlite`) dibuat otomatis saat pertama kali dijalankan, lengkap dengan data demo (aset, pengguna, perbaikan, kalibrasi, dll).

### 3. Setup Frontend

Buka **terminal baru** (jangan tutup terminal backend):

> **Catatan**: Pastikan Anda berada di direktori root folder project (`PT.AMK/`) sebelum menjalankan perintah berikut.

```bash
# Dari root folder project (PT.AMK/)
npm install
npm run dev
```

Frontend berjalan di: **http://localhost:5173**

---

## 👤 Akun Demo

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@asetra.com` | `admin123` |
| **Teknisi** | `teknisi@asetra.com` | `teknisi123` |

---

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| POST | `/auth/login` | Public | Login & dapatkan JWT token |
| GET | `/auth/me` | Auth | Data user yang sedang login |

### Aset
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/assets` | Auth | Daftar aset (support `?search=`) |
| GET | `/assets/:id` | Auth | Detail aset + relasi |
| POST | `/assets` | Admin | Tambah aset (multipart: `image` + `document`) |
| PUT | `/assets/:id` | Admin | Edit aset |
| DELETE | `/assets/:id` | Admin | Hapus aset |

### Perbaikan
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/repairs` | Auth | Daftar laporan perbaikan |
| POST | `/repairs` | Auth | Buat laporan kerusakan |
| PUT | `/repairs/:id` | Admin/Teknisi | Update status (`Pending` → `Proses` → `Selesai`) |

### Pengajuan Aset
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/requests` | Auth | Daftar pengajuan |
| POST | `/requests` | Admin | Buat pengajuan baru |
| PUT | `/requests/:id/approve` | Admin | Setujui pengajuan |
| PUT | `/requests/:id/reject` | Admin | Tolak pengajuan |

### Kalibrasi
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/calibrations` | Auth | Daftar kalibrasi |
| GET | `/calibrations/upcoming` | Auth | Kalibrasi mendatang (H-30) |
| POST | `/calibrations` | Admin | Catat kalibrasi baru |
| PUT | `/calibrations/:id` | Admin | Update hasil + upload sertifikat PDF |

### Mutasi
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/mutations` | Auth | Daftar mutasi |
| POST | `/mutations` | Admin | Ajukan mutasi baru |
| PUT | `/mutations/:id` | Admin | Approve/Reject mutasi |

### Dashboard & Notifikasi
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/dashboard/summary` | Admin | Statistik ringkasan |
| GET | `/dashboard/activities` | Admin | Aktivitas terbaru |
| GET | `/notifications` | Auth | Daftar notifikasi |
| PUT | `/notifications/:id/read` | Auth | Tandai notifikasi dibaca |

---

## 🔒 Sistem Role & Otorisasi

ASETRA menggunakan **Role-Based Access Control (RBAC)** di dua lapisan:

**Frontend (React Router):** `ProtectedRoute` component memastikan:
- `/dashboard/*` hanya bisa diakses oleh role `admin`
- `/technician/*` hanya bisa diakses oleh role `technician`
- Jika tidak login → redirect ke `/login`

**Backend (Express Middleware):** Middleware `authorize()` memvalidasi role per endpoint.

Setiap request ke endpoint yang dilindungi harus menyertakan header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📁 Model Database

| Model | Kolom Penting |
|-------|--------------|
| `User` | `id`, `name`, `email`, `password`, `role`, `profilePicture` |
| `Asset` | `id`, `name`, `category`, `room`, `condition`, `status`, `img`, `manualBook` |
| `Repair` | `id`, `assetId`, `status` (`Pending/Proses/Selesai`), `reporterName`, `description` |
| `Request` | `id`, `assetName`, `department`, `qty`, `status` (`Pending/Disetujui/Ditolak`) |
| `Calibration` | `id`, `assetId`, `nextCalibrationDate`, `status`, `certificateUrl` |
| `Mutation` | `id`, `assetId`, `sourceLocation`, `targetLocation`, `status` |
| `Notification` | `id`, `type`, `message`, `isRead`, `date` |

---

## 🐛 Troubleshooting

**Database error saat start?**
```bash
# Hapus dan buat ulang database
del backend\database.sqlite   # Windows
# atau
rm backend/database.sqlite    # Mac/Linux

# Lalu restart backend
npm run dev
```

**Upload gambar/PDF gagal?**
```bash
# Pastikan folder uploads ada
mkdir backend\uploads    # Windows
mkdir backend/uploads    # Mac/Linux
```

**Login berhasil tapi langsung balik ke /login?**
> Pastikan backend berjalan terlebih dahulu di port 5000 sebelum membuka frontend.

**Token expired / harus login ulang terus?**
> Token berlaku selama **30 hari**. Jika sudah expired, sistem otomatis redirect ke `/login` dan membersihkan data session.

---

## 📸 Preview Aplikasi

| Halaman | Deskripsi |
|---------|-----------|
| Dashboard Admin | Statistik ringkasan, grafik, aktivitas terkini |
| Manajemen Aset | Tabel aset dengan search, pagination, QR print |
| Laporan Perbaikan | Sistem tiket kerusakan end-to-end |
| Dashboard Teknisi | UI mobile-first untuk teknisi lapangan |

---

## 👥 Tim Pengembang

| Nama | Role |
|------|------|
| Taufik Bagas Anjaya | Project Manager |
| Adelia Rahma Saputri | UI/UX Designer |
| Lina Sapitri | UI/UX Designer |
| Faradis Putra Aditia Assagaf | Frontend Developer |
| Yoga Pangestu | Frontend Developer |
| M Yusuf Ardabili | Backend Developer |
| Yoga Adi Pamungkas | QA Engineer |
| Grahita Humaira Nasywa Putri | QA Engineer |


---

<div align="center">
  <p><strong>PT. AMK — ASETRA </strong></p>
</div>
