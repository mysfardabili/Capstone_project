/**
 * index.js — Entrypoint utama server ASETRA
 *
 * Urutan yang benar di ESM (Node.js):
 * 1. Load dotenv PERTAMA agar process.env tersedia untuk semua module
 * 2. Validasi env vars — matikan server jika ada yang kurang
 * 3. Baru jalankan server.js utama
 *
 * Gunakan: `node index.js` (bukan `node server.js` langsung)
 */
import dotenv from 'dotenv';
dotenv.config();

import { validateEnv } from './config/validateEnv.js';
validateEnv();

// Jalankan server setelah semua konfigurasi valid
import './server.js';
