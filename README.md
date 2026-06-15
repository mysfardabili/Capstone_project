<div align="center">

# ASETRA
### Sistem Informasi Manajemen Aset Rumah Sakit

**A**set **S**ehat, **E**fisien, **T**erintegrasi, **R**eliabl**A**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql&logoColor=white)](https://supabase.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Uploads-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)

</div>

---

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Teknologi](#teknologi)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Cara Menjalankan](#cara-menjalankan)
- [Akun Demo](#akun-demo)
- [API Endpoints](#api-endpoints)
- [Sistem Role & Otorisasi](#sistem-role--otorisasi)
- [Model Database](#model-database)
- [Fitur Unggulan](#fitur-unggulan)
- [Troubleshooting](#troubleshooting)
- [Preview Aplikasi](#preview-aplikasi)
- [Tim Pengembang](#tim-pengembang)

---

## Tentang Proyek

**ASETRA** adalah aplikasi manajemen aset rumah sakit berbasis web yang membantu pihak rumah sakit dalam mengelola aset medis dan non-medis secara digital dan terintegrasi. Aplikasi ini mencakup manajemen aset, pelacakan perbaikan, pengajuan aset, penjadwalan kalibrasi, mutasi aset, serta identifikasi aset melalui QR Code — semuanya dalam satu sistem terpusat dengan dua antarmuka berbeda untuk Admin dan Teknisi.

---

## Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Autentikasi & RBAC** | Login dengan JWT, role-based access (Admin / Teknisi / Perawat) |
| **Manajemen Aset** | CRUD aset lengkap dengan upload foto & dokumen PDF ke Cloudinary |
| **Laporan Perbaikan** | Tiket kerusakan end-to-end: lapor → proses → selesai + upload foto |
| **Pengajuan Aset** | Workflow permintaan aset baru dengan approve/reject |
| **Mutasi Aset** | Pemindahan aset antar ruangan/unit, otomatis update lokasi |
| **Kalibrasi** | Penjadwalan & tracking kalibrasi dengan upload sertifikat PDF |
| **QR Code Scanner** | Identifikasi aset via kamera smartphone (html5-qrcode) |
| **Dashboard Admin** | Statistik ringkasan, grafik distribusi kondisi/ruangan, aktivitas terkini |
| **Dashboard Teknisi** | Antarmuka mobile-first untuk teknisi lapangan |
| **Notifikasi Real-time** | Peringatan kalibrasi jatuh tempo & perbaikan mendesak |
| **Dark Mode** | Tampilan gelap/terang dengan persistensi ke localStorage |
| **Audit Log** | Catat semua perubahan data (CREATE/UPDATE/DELETE) untuk traceability |
| **Cloudinary Upload** | Semua file (foto, PDF) otomatis tersimpan di Cloudinary |

---

## Teknologi

### Frontend

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **React** | 19.2.5 | UI framework |
| **Vite** | 5.4.11 | Build tool & dev server |
| **React Router DOM** | 7.15.0 | Client-side routing |
| **Tailwind CSS** | 3.4.19 | Utility-first CSS framework (dark mode: `class` strategy) |
| **Lucide React** | 1.14.0 | Icons |
| **html5-qrcode** | 2.3.8 | QR Code scanner via browser camera |
| **PostCSS** | 8.5.15 | CSS processing |
| **Autoprefixer** | 10.5.0 | Vendor prefix CSS |

### Backend

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Node.js** | 18+ | Runtime |
| **Express** | 4.19.2 | REST API framework |
| **Sequelize ORM** | 6.37.1 | Database ORM (PostgreSQL) |
| **PostgreSQL (pg)** | 8.21.0 | Database (Supabase) |
| **jsonwebtoken** | 9.0.2 | JWT authentication (8 jam expiry) |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Multer** | 1.4.5 | File upload handling (memoryStorage → Cloudinary) |
| **Cloudinary SDK** | 1.41.3 | Cloud file storage |
| **express-rate-limit** | 8.5.2 | Rate limiting (global + login brute-force) |
| **dotenv** | 16.4.5 | Environment variables |
| **cors** | 2.8.5 | CORS configuration |
| **nodemon** (dev) | 3.1.0 | Auto-restart saat development |

---

## Arsitektur Sistem

```
PT.AMK/
├── src/                            # Frontend (React + Vite)
│   ├── components/                 # Komponen reusable
│   │   ├── DashboardLayout.jsx     # Layout Admin: sidebar, topbar, outlet
│   │   ├── TechnicianLayout.jsx    # Layout Teknisi: topbar, bottom nav, outlet
│   │   ├── ProtectedRoute.jsx      # Route guard: token + role
│   │   ├── Pagination.jsx          # Pagination component
│   │   └── Toast.jsx               # Auto-dismiss notification
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx         # Landing page (hero, fitur, cara kerja, FAQ, footer)
│   │   ├── Login.jsx               # Login form + dark mode toggle
│   │   ├── NotFound.jsx            # 404 page
│   │   │
│   │   ├── dashboard/              # Halaman Admin
│   │   │   ├── DashboardHome.jsx       # Statistik ringkasan & grafik
│   │   │   ├── Assets.jsx              # Tabel aset + search + filter
│   │   │   ├── AssetDetail.jsx         # Detail aset + riwayat tabs
│   │   │   ├── AddAsset.jsx            # Tambah aset (baru/lama) + upload
│   │   │   ├── EditAsset.jsx           # Edit aset
│   │   │   ├── Requests.jsx            # Pengajuan aset + approve/reject
│   │   │   ├── AddRequest.jsx          # Pengajuan aset baru
│   │   │   ├── Repairs.jsx             # Laporan perbaikan
│   │   │   ├── AddRepair.jsx           # Lapor kerusakan
│   │   │   ├── Calibration.jsx         # Jadwal kalibrasi
│   │   │   ├── AddCalibration.jsx      # Catat kalibrasi baru
│   │   │   ├── Mutation.jsx            # Mutasi aset + approve/reject
│   │   │   ├── AddMutation.jsx         # Mutasi aset baru
│   │   │   ├── Notifications.jsx       # Semua notifikasi
│   │   │   └── Settings.jsx            # Profil, password, preferensi email
│   │   │
│   │   └── technician/             # Halaman Teknisi (mobile-first)
│   │       ├── TechnicianDashboard.jsx     # Ringkasan tugas & alert kalibrasi
│   │       ├── TechnicianRepairs.jsx       # Daftar perbaikan + update status
│   │       ├── TechnicianScan.jsx          # QR Code scanner + cari manual
│   │       ├── TechnicianHistory.jsx       # Riwayat perbaikan selesai
│   │       ├── TechnicianProfile.jsx       # Profil & ganti password
│   │       └── TechnicianNotifications.jsx # Notifikasi teknisi
│   │
│   └── services/
│       └── api.js                  # HTTP client: JWT Bearer, global 401 handler
│
├── backend/                        # Backend (Node.js + Express)
│   ├── config/
│   │   ├── database.js             # Sequelize + PostgreSQL (Supabase) + SSL
│   │   └── validateEnv.js          # Validasi env vars saat startup
│   │
│   ├── middleware/
│   │   ├── auth.js                 # JWT protect + role authorize
│   │   ├── rateLimiter.js          # Rate limiter (global + login)
│   │   ├── validator.js            # Input validation (asset, repair)
│   │   └── auditLogger.js          # Audit log otomatis
│   │
│   ├── models/
│   │   ├── index.js                # Loader + asosiasi + auto-seeder
│   │   ├── User.js                 # id, name, email, password, role, profilePicture
│   │   ├── Asset.js                # id (AST-XXX), name, category, room, condition, dll
│   │   ├── Repair.js               # id (REP-XXX), assetId, status, priority, dll
│   │   ├── Request.js              # id (REQ-XXX), assetName, status, dll
│   │   ├── Calibration.js          # id (CAL-XXX), assetId, dates, certificate, dll
│   │   ├── Mutation.js             # id (MUT-XXX), assetId, source/target, dll
│   │   ├── Notification.js         # type, message, isRead, relatedId
│   │   └── AuditLog.js             # userId, action, entityName, old/new values
│   │
│   ├── controllers/
│   │   ├── authController.js       # login, getMe
│   │   ├── assetController.js      # CRUD aset + Cloudinary + audit
│   │   ├── repairController.js     # CRUD perbaikan + update status
│   │   ├── requestController.js    # CRUD pengajuan + approve/reject + email
│   │   ├── calibrationController.js # CRUD kalibrasi + upcoming
│   │   ├── mutationController.js   # CRUD mutasi + update status
│   │   ├── dashboardController.js  # Summary + activities
│   │   ├── notificationController.js # Get + mark read
│   │   └── userController.js       # Update profil, password, preferensi
│   │
│   ├── routes/
│   │   ├── auth.js                 # POST /login, GET /me
│   │   ├── assets.js               # GET/POST/PUT/DELETE /assets
│   │   ├── repairs.js              # GET/POST/PUT /repairs
│   │   ├── requests.js             # GET/POST/PUT /requests
│   │   ├── calibrations.js         # GET/POST/PUT /calibrations
│   │   ├── mutations.js            # GET/POST/PUT /mutations
│   │   ├── dashboard.js            # GET /dashboard/summary, /activities
│   │   ├── notifications.js        # GET/PUT /notifications
│   │   └── users.js                # PUT /users/profile, /password, /preferences
│   │
│   ├── services/
│   │   ├── emailService.js         # SMTP mail (mock di development)
│   │   └── cloudinaryService.js    # Upload & delete ke Cloudinary
│   │
│   ├── uploads/                    # Fallback upload lokal
│   ├── server.js                   # Entry point: Express, CORS, routes, sync, seed
│   ├── database.sqlite             # Legacy SQLite (tidak aktif)
│   ├── package.json
│   └── .env                        # DB credentials, JWT secret, Cloudinary keys
│
├── public/                         # Static assets (logo, hero mockup, favicon)
├── tailwind.config.js              # Tailwind: darkMode class, custom colors, animasi
├── vite.config.js                  # Vite config (React plugin)
├── postcss.config.js               # PostCSS: Tailwind + Autoprefixer
├── index.html                      # Entry HTML
├── package.json                    # Frontend dependencies
└── README.md
```

---

## Cara Menjalankan

### Prasyarat

- [Node.js](https://nodejs.org/) versi **18 atau lebih baru**
- npm (sudah termasuk bersama Node.js)
- Git
- Koneksi internet (untuk Cloudinary upload & database Supabase)

### 1. Clone Repositori

```bash
git clone https://github.com/mysfardabili/Capstone_project.git
cd Capstone_project
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Pastikan file `.env` di dalam folder `backend/` sudah terisi:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=4s3tr4-H0sp1t4l-4ss3t-Mgmt-Pr0j3ct-JWT-S3cr3t-K3y-2026-...

# PostgreSQL (Supabase)
DATABASE_URL=postgresql://postgres.xrfeztglotuuqzsnkcap:%40AMK_Asetra01@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Penting**: Backend menggunakan PostgreSQL (Supabase), bukan SQLite. Pastikan koneksi database tersedia.

Jalankan server backend:

```bash
npm run dev
```

Backend berjalan di: **http://localhost:5000**

> **Auto Seed:** Tabel dan data demo dibuat otomatis saat pertama kali server dijalankan, termasuk akun demo, aset contoh, perbaikan, kalibrasi, mutasi, dan notifikasi.

### 3. Setup Frontend

pastikan file .env di frontend terisi dengan url backend yang benar, defaultnya http://localhost:5000/api
Buka **terminal baru** (jangan tutup terminal backend):

```bash
# Dari root folder project (PT.AMK/)
npm install
npm run dev
```

Frontend berjalan di: **http://localhost:5173**

---

## Akun Demo

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@asetra.com` | `admin123` |
| **Teknisi** | `teknisi@asetra.com` | `teknisi123` |
| **Perawat** | `ratna@asetra.com` | `nurse123` |

---

## API Endpoints

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| POST | `/auth/login` | Public | Login & dapatkan JWT token (8 jam) |
| GET | `/auth/me` | Auth | Data user yang sedang login |

### Aset
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/assets` | Auth | Daftar aset (support `?search=` & filter) |
| GET | `/assets/:id` | Auth | Detail aset + relasi (repairs, calibrations, mutations) |
| POST | `/assets` | Admin | Tambah aset (multipart: `image` + `document`) |
| PUT | `/assets/:id` | Admin | Edit aset |
| DELETE | `/assets/:id` | Admin | Hapus aset (cascade ke relasi) |

### Perbaikan
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/repairs` | Auth | Daftar laporan perbaikan (support search) |
| POST | `/repairs` | Auth | Buat laporan kerusakan (otomatis update kondisi aset) |
| PUT | `/repairs/:id` | Admin/Teknisi | Update data perbaikan |
| PUT | `/repairs/:id/status` | Admin/Teknisi | Update status (`Pending` → `Proses` → `Selesai`) |

### Pengajuan Aset
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/requests` | Auth | Daftar pengajuan |
| POST | `/requests` | Admin/Perawat | Buat pengajuan baru (notifikasi email) |
| PUT | `/requests/:id` | Admin | Update pengajuan |
| PUT | `/requests/:id/approve` | Admin | Setujui pengajuan |
| PUT | `/requests/:id/reject` | Admin | Tolak pengajuan |

### Kalibrasi
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/calibrations` | Auth | Daftar kalibrasi |
| GET | `/calibrations/upcoming` | Admin | Kalibrasi mendatang (H-30) |
| POST | `/calibrations` | Admin | Catat kalibrasi baru |
| PUT | `/calibrations/:id` | Admin | Update hasil + upload sertifikat PDF |

### Mutasi
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/mutations` | Auth | Daftar mutasi |
| POST | `/mutations` | Admin | Ajukan mutasi baru (validasi kondisi aset) |
| PUT | `/mutations/:id` | Admin | Approve/Reject mutasi (otomatis update ruangan aset) |

### Dashboard & Notifikasi
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| GET | `/dashboard/summary` | Admin | Statistik ringkasan (jumlah, kondisi, ruangan, kalibrasi, approval) |
| GET | `/dashboard/activities` | Admin | Aktivitas terbaru |
| GET | `/notifications` | Auth | Daftar notifikasi |
| PUT | `/notifications/:id/read` | Auth | Tandai notifikasi dibaca |

### User Settings
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| PUT | `/users/profile` | Auth | Update nama, email, no telepon, foto profil |
| PUT | `/users/password` | Auth | Ganti password |
| PUT | `/users/preferences` | Auth | Update preferensi notifikasi email |

---

## Sistem Role & Otorisasi

ASETRA menggunakan **Role-Based Access Control (RBAC)** di dua lapisan:

**Frontend (React Router):** `ProtectedRoute` component memastikan:
- `/dashboard/*` hanya bisa diakses oleh role `admin`
- `/technician/*` hanya bisa diakses oleh role `technician`
- Jika tidak login → redirect ke `/login`

**Backend (Express Middleware):**
- Middleware `protect()` — memvalidasi JWT token
- Middleware `authorize('admin', 'technician')` — memvalidasi role per endpoint

Setiap request ke endpoint yang dilindungi harus menyertakan header:
```
Authorization: Bearer <JWT_TOKEN>
```

**Keamanan Tambahan:**
- **Rate Limiting**: Global 200 request / 10 menit, Login 10 request / 15 menit
- **Input Validation**: Validasi payload untuk aset & perbaikan
- **Audit Logging**: Semua CREATE/UPDATE/DELETE tercatat dengan detail (user, nilai lama, nilai baru, IP)
- **Password Hashing**: bcryptjs dengan salt rounds
- **User Enumeration Prevention**: Pesan error identik untuk email salah vs password salah

---

## Model Database

| Model | Primary Key | Kolom Penting | Relasi |
|-------|-------------|---------------|--------|
| `User` | UUID | name, email, password (bcrypt), role (`admin`/`technician`/`nurse`/`staff`), profilePicture, phone | → AuditLog |
| `Asset` | STRING (AST-XXX) | name, category, room, serialNumber, price, condition (`Baik`/`Rusak`/`Perbaikan`), status (`Tersedia`/`Dipinjam`), img, manualBook, invoice | → Repair, Calibration, Mutation |
| `Repair` | STRING (REP-XXX) | assetId (FK), reporterName, description, status (`Pending`/`Proses`/`Selesai`), priority (`rendah`/`sedang`/`tinggi`), photo, notes, technicianName | → Asset |
| `Request` | STRING (REQ-XXX) | assetName, category, qty, requesterName, department, notes, status (`Pending`/`Disetujui`/`Ditolak`) | - |
| `Calibration` | STRING (CAL-XXX) | assetId (FK), calibrationDate, nextCalibrationDate, vendor, certificateNumber, certificateUrl, status (`Lulus`/`Gagal`/`Menunggu`), notes | → Asset |
| `Mutation` | STRING (MUT-XXX) | assetId (FK), sourceLocation, targetLocation, requesterName, status (`Pending`/`Approved`/`Rejected`) | → Asset (auto-update room) |
| `Notification` | UUID | type, message, isRead, date, relatedId | - |
| `AuditLog` | UUID | userId (FK), userName, action (`CREATE`/`UPDATE`/`DELETE`/`LOGIN`/`LOGOUT`), entityName, entityId, oldValues (JSON), newValues (JSON), ipAddress, userAgent | → User |

---

## Fitur Unggulan

### Dark Mode
- Toggle di LandingPage, Login, dan Layout Teknisi
- Tersimpan di localStorage
- Menggunakan Tailwind `class` strategy + CSS custom properties
- Konsisten di semua halaman Admin dan Teknisi

### 📱 Mobile-First (Teknisi)
Layout teknisi dioptimalkan untuk smartphone:
- Bottom navigation (Dashboard, Perbaikan, Scan, History, Profil)
- QR Code scanner langsung dari browser
- Task cards dengan status badge
- Scrollable layout untuk manual input ID

### Keamanan Berlapis
- JWT token 8 jam dengan refresh via re-login
- Rate limiting global & per-endpoint login
- Validasi input server-side
- Audit trail untuk semua perubahan data
- CORS whitelist

### Cloudinary Integration
Semua upload file otomatis ke Cloudinary:
- Foto aset (asset image)
- Dokumen manual book / invoice (PDF)
- Sertifikat kalibrasi (PDF)
- Foto perbaikan
- Foto profil user

### Auto-generate ID
Setiap entitas memiliki ID format unik dengan nomor urut:
- Aset: `AST-001`, `AST-002`, ...
- Perbaikan: `REP-001`, `REP-002`, ...
- Pengajuan: `REQ-001`, `REQ-002`, ...
- Kalibrasi: `CAL-001`, `CAL-002`, ...
- Mutasi: `MUT-001`, `MUT-002`, ...

---

## Troubleshooting

**Database error saat start?**
```
Pastikan koneksi ke Supabase PostgreSQL tersedia.
Cek DATABASE_URL di backend/.env.
```

**Upload gambar/PDF gagal?**
```
Pastikan credentials Cloudinary di backend/.env sudah benar.
Jika ingin fallback ke lokal, pastikan folder backend/uploads/ ada.
```

**Login berhasil tapi langsung balik ke /login?**
```
Pastikan backend berjalan terlebih dahulu di port 5000 sebelum membuka frontend.
Cek console browser untuk error 401.
```

**Token expired?**
```
Token JWT berlaku selama 8 jam. Jika expired, sistem otomatis redirect ke /login.
Login ulang untuk mendapatkan token baru.
```

**Mode gelap tidak berfungsi?**
```
Pastikan kelas .dark ada di <body> (cek DevTools > Elements).
Toggle tombol Moon/Sun di pojok kanan atas halaman.
```

---

## Preview Aplikasi

| Halaman | Deskripsi |
|---------|-----------|
| **Landing Page** | Hero section, fitur utama, cara kerja, FAQ, footer dengan dark mode toggle |
| **Login** | Form login dengan validasi, dark mode toggle, redirect based on role |
| **Dashboard Admin** | Kartu statistik, grafik distribusi kondisi, distribusi ruangan, approval pending, aktivitas |
| **Manajemen Aset** | Tabel aset dengan search, filter kategori/kondisi/status, pagination, QR print |
| **Detail Aset** | Info lengkap + tab riwayat perbaikan, kalibrasi, mutasi |
| **Laporan Perbaikan** | Tiket kerusakan dengan status management (Pending → Proses → Selesai) |
| **Kalibrasi** | Jadwal kalibrasi dengan status Aman / Jatuh Tempo / Kadaluarsa |
| **Mutasi Aset** | Pemindahan aset dengan approve/reject workflow |
| **Dashboard Teknisi** | Ringkasan tugas, item mendesak, alert kalibrasi (mobile-first) |
| **Perbaikan Teknisi** | Task cards dengan filter (Semua/Mendesak/Tertunda/Maintenance) + update status |
| **Scan QR** | Pemindaian QR Code via kamera + input manual ID aset |

---

## Tim Pengembang

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
  <p><strong>PT. AMK — ASETRA</strong></p>
  <p>Sistem Informasi Manajemen Aset Rumah Sakit</p>
</div>
