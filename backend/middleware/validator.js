/**
 * Middleware untuk memvalidasi input data Asset.
 */
export const validateAsset = (req, res, next) => {
  const { name, category, room, price, serialNumber } = req.body;
  const errors = [];

  // Validasi khusus untuk pembuatan (POST)
  if (req.method === 'POST') {
    if (!name || String(name).trim() === '') {
      errors.push('Nama aset wajib diisi');
    }
    if (!category || String(category).trim() === '') {
      errors.push('Kategori aset wajib diisi');
    }
    if (!room || String(room).trim() === '') {
      errors.push('Lokasi/Ruangan aset wajib diisi');
    }
  }

  // Validasi harga (jika ada)
  if (price !== undefined && price !== '') {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      errors.push('Harga aset harus berupa angka desimal/bulat positif');
    }
  }

  // Validasi serial number (jika ada)
  if (serialNumber !== undefined && serialNumber !== '') {
    if (String(serialNumber).trim().length < 3) {
      errors.push('Nomor seri (Serial Number) harus memiliki minimal 3 karakter');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validasi gagal', errors });
  }

  next();
};

/**
 * Middleware untuk memvalidasi input data perbaikan (Repair).
 */
export const validateRepair = (req, res, next) => {
  const { assetId, description, priority } = req.body;
  const errors = [];

  if (!assetId || String(assetId).trim() === '') {
    errors.push('ID Aset wajib diisi');
  }
  if (!description || String(description).trim() === '') {
    errors.push('Deskripsi kerusakan wajib diisi');
  }
  if (priority && !['rendah', 'sedang', 'tinggi'].includes(priority)) {
    errors.push('Prioritas perbaikan harus salah satu dari: rendah, sedang, tinggi');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validasi gagal', errors });
  }

  next();
};
