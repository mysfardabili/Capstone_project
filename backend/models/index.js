import sequelize from '../config/database.js';
import User from './User.js';
import Asset from './Asset.js';
import Request from './Request.js';
import Repair from './Repair.js';
import Calibration from './Calibration.js';
import Mutation from './Mutation.js';
import Notification from './Notification.js';

// Define associations
Asset.hasMany(Repair, { foreignKey: 'assetId', as: 'repairs', onDelete: 'CASCADE' });
Repair.belongsTo(Asset, { foreignKey: 'assetId', as: 'asset' });

Asset.hasMany(Calibration, { foreignKey: 'assetId', as: 'calibrations', onDelete: 'CASCADE' });
Calibration.belongsTo(Asset, { foreignKey: 'assetId', as: 'asset' });

Asset.hasMany(Mutation, { foreignKey: 'assetId', as: 'mutations', onDelete: 'CASCADE' });
Mutation.belongsTo(Asset, { foreignKey: 'assetId', as: 'asset' });

const seedDatabase = async () => {
  try {
    // Check if users already exist
    const userCount = await User.count();
    if (userCount > 0) return;

    console.log('Seeding initial database...');

    // Seed Users
    const admin = await User.create({
      name: 'Budi (Admin)',
      email: 'admin@asetra.com',
      password: 'admin123',
      role: 'admin',
    });

    const technician = await User.create({
      name: 'Andi (Teknisi)',
      email: 'teknisi@asetra.com',
      password: 'teknisi123',
      role: 'technician',
    });

    const nurse = await User.create({
      name: 'Ns. Ratna',
      email: 'ratna@asetra.com',
      password: 'nurse123',
      role: 'nurse',
    });

    // Seed Assets
    const assets = await Asset.bulkCreate([
      {
        id: 'AST-001',
        name: 'USG Machine Voluson E8',
        category: 'Alat Medis',
        room: 'Ruang Radiologi 1',
        serialNumber: 'SN-V8-001',
        price: 150000000,
        condition: 'Baik',
        status: 'Tersedia',
        purchaseDate: '2023-01-15',
        warrantyEnd: '2025-01-15',
        vendor: 'PT Medika Prima',
        img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400',
        description: 'Alat USG 4D berkualitas tinggi dengan teknologi canggih untuk diagnosis kebidanan, ginekologi, dan kardiologi.',
      },
      {
        id: 'AST-002',
        name: 'Patient Monitor B40',
        category: 'Alat Medis',
        room: 'IGD Bed 3',
        serialNumber: 'SN-PM-042',
        price: 25000000,
        condition: 'Rusak',
        status: 'Tersedia',
        purchaseDate: '2023-05-20',
        warrantyEnd: '2025-05-20',
        vendor: 'PT Medika Prima',
        img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400',
        description: 'Patient monitor untuk melacak tanda vital pasien secara real-time. Layar mengalami kerusakan minor/bergaris.',
      },
      {
        id: 'AST-003',
        name: 'Kursi Roda Standar',
        category: 'Non-Medis',
        room: 'Lobi Utama',
        serialNumber: 'SN-KR-112',
        price: 1500000,
        condition: 'Baik',
        status: 'Tersedia',
        purchaseDate: '2024-01-10',
        warrantyEnd: '2026-01-10',
        vendor: 'CV Alkesindo',
        description: 'Kursi roda standar manual untuk transportasi pasien lobi.',
      },
      {
        id: 'AST-004',
        name: 'Defibrillator Zoll',
        category: 'Alat Medis',
        room: 'RSUD Kota Seberang',
        serialNumber: 'SN-DF-099',
        price: 85000000,
        condition: 'Baik',
        status: 'Dipinjam',
        purchaseDate: '2022-11-05',
        warrantyEnd: '2024-11-05',
        vendor: 'PT Zoll Medical Indonesia',
        description: 'Alat kejut jantung darurat untuk pasien henti jantung. Dipinjamkan sementara ke RSUD Kota Seberang.',
      },
      {
        id: 'AST-005',
        name: 'Bed Pasien Elektrik',
        category: 'Fasilitas',
        room: 'Kamar Mawar 101',
        serialNumber: 'SN-BP-201',
        price: 12000000,
        condition: 'Baik',
        status: 'Tersedia',
        purchaseDate: '2023-08-15',
        warrantyEnd: '2025-08-15',
        vendor: 'PT Hospitalindo',
        description: 'Ranjang pasien elektrik dengan pengaturan posisi kepala, kaki, dan tinggi ranjang.',
      },
    ]);

    // Seed Mutations for AST-001
    await Mutation.bulkCreate([
      { id: 'M-05', assetId: 'AST-001', date: '2024-02-01', sourceLocation: 'Ruang Radiologi 1', targetLocation: 'Ruang Radiologi 2', requesterName: 'Siti (Kepala Ruangan)', status: 'Approved', notes: 'Mutasi rutin untuk penyeimbangan alat.' },
      { id: 'M-04', assetId: 'AST-001', date: '2024-01-10', sourceLocation: 'Gudang Alat', targetLocation: 'Ruang Radiologi 1', requesterName: 'Budi (Admin)', status: 'Approved', notes: 'Penyiapan operasional setelah maintenance.' },
      { id: 'M-03', assetId: 'AST-001', date: '2023-11-20', sourceLocation: 'Lab Sementara', targetLocation: 'Gudang Alat', requesterName: 'Budi (Admin)', status: 'Approved' },
      { id: 'M-02', assetId: 'AST-001', date: '2023-11-15', sourceLocation: 'Ruang Radiologi 1', targetLocation: 'Lab Sementara', requesterName: 'Siti (Kepala Ruangan)', status: 'Approved' },
      { id: 'M-01', assetId: 'AST-001', date: '2023-10-10', sourceLocation: 'Gudang Pusat', targetLocation: 'Ruang Radiologi 1', requesterName: 'Budi (Admin)', status: 'Approved' },
      { id: 'M-06', assetId: 'AST-005', date: '2026-06-12', sourceLocation: 'Kamar Mawar 101', targetLocation: 'Kamar Melati 202', requesterName: 'Ns. Ratna', status: 'Pending', notes: 'Bed dipindahkan karena kamar Mawar direnovasi.' },
    ]);

    // Seed Repairs for AST-001 & AST-002
    await Repair.bulkCreate([
      { id: 'R-05', assetId: 'AST-001', reporterName: 'Budi (Admin)', date: '2024-05-20', description: 'Pembersihan filter rutin', technicianName: 'Andi (Teknisi)', status: 'Selesai', notes: 'Filter dibersihkan dengan kompresor udara. Suhu operasional kembali stabil.', completionDate: '2024-05-20' },
      { id: 'R-04', assetId: 'AST-001', reporterName: 'Budi (Admin)', date: '2024-04-15', description: 'Kalibrasi ulang sensor', technicianName: 'Tono', status: 'Selesai', notes: 'Kalibrasi ulang diselesaikan menggunakan kalibrator eksternal.', completionDate: '2024-04-15' },
      { id: 'R-03', assetId: 'AST-001', reporterName: 'Budi (Admin)', date: '2024-04-02', description: 'Update firmware sistem', technicianName: 'Rudi', status: 'Selesai', notes: 'Firmware diperbarui ke v4.2.1.', completionDate: '2024-04-02' },
      { id: 'R-02', assetId: 'AST-001', reporterName: 'Budi (Admin)', date: '2024-03-12', description: 'Kabel power longgar', technicianName: 'Andi (Teknisi)', status: 'Selesai', notes: 'Konektor diganti dengan suku cadang baru.', completionDate: '2024-03-12' },
      { id: 'R-01', assetId: 'AST-001', reporterName: 'Ns. Ratna', date: '2024-01-05', description: 'Layar berkedip saat dinyalakan', technicianName: 'Tono', status: 'Selesai', notes: 'Masalah pada inverter layar. Disolder ulang.', completionDate: '2024-01-05' },
      { id: 'R-06', assetId: 'AST-002', reporterName: 'Ns. Ratna', date: '2026-06-11', description: 'Layar bergaris dan redup.', technicianName: 'Andi (Teknisi)', status: 'Proses', notes: 'Menunggu suku cadang LCD panel dari vendor.' },
    ]);

    // Seed Calibrations
    await Calibration.bulkCreate([
      { id: 'C-04', assetId: 'AST-001', calibrationDate: null, nextCalibrationDate: '2027-01-22', vendor: 'PT Kalibrasi Medika', status: 'Menunggu', notes: 'Jadwal kalibrasi tahunan.' },
      { id: 'C-03', assetId: 'AST-001', calibrationDate: '2024-01-22', nextCalibrationDate: '2025-01-22', vendor: 'PT Kalibrasi Medika', status: 'Lulus', certificateNumber: 'CERT-USG-2024-112' },
      { id: 'C-02', assetId: 'AST-001', calibrationDate: '2023-01-20', nextCalibrationDate: '2024-01-20', vendor: 'BMKG / internal', status: 'Lulus', certificateNumber: 'CERT-USG-2023-005' },
      { id: 'C-01', assetId: 'AST-001', calibrationDate: '2022-01-15', nextCalibrationDate: '2023-01-15', vendor: 'BMKG / internal', status: 'Lulus', certificateNumber: 'CERT-USG-2022-001' },
      { id: 'C-05', assetId: 'AST-004', calibrationDate: null, nextCalibrationDate: '2026-06-14', vendor: 'Balai Pengamanan Alat Kesehatan (BPAK)', status: 'Menunggu', notes: 'Jadwal mendesak.' },
    ]);

    // Seed Requests
    await Request.bulkCreate([
      { id: 'REQ-001', assetName: 'Kursi Roda Pasien', category: 'Non-Medis', qty: 2, requesterName: 'dr. Budi', department: 'IGD', status: 'Pending', notes: 'Kebutuhan mendesak karena kursi roda di IGD banyak yang rusak ringan.', date: '2026-06-10' },
      { id: 'REQ-002', assetName: 'Defibrillator Lifepak', category: 'Alat Medis', qty: 1, requesterName: 'Ns. Ratna', department: 'ICU', status: 'Disetujui', notes: 'Penggantian unit lama yang sudah tidak presisi.', date: '2026-06-08' },
    ]);

    // Seed Notifications
    await Notification.bulkCreate([
      { type: 'danger', message: 'Kalibrasi Defibrillator Zoll jatuh tempo dalam 2 hari!', date: new Date(Date.now() - 3600000) },
      { type: 'warning', message: 'Laporan kerusakan baru untuk Patient Monitor (AST-002) oleh Ns. Siti.', date: new Date(Date.now() - 7200000 * 2) },
      { type: 'info', message: 'Pengajuan Mutasi Bed Pasien dari Kamar Mawar 101 telah dikirim.', date: new Date(Date.now() - 7200000 * 5) },
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

export {
  sequelize,
  User,
  Asset,
  Request,
  Repair,
  Calibration,
  Mutation,
  Notification,
  seedDatabase,
};
