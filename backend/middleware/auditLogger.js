import AuditLog from '../models/AuditLog.js';

/**
 * Merekam aktivitas aksi tulis pengguna (CREATE, UPDATE, DELETE) ke database.
 * @param {Object} req - Objek Request Express untuk mengambil data pengguna & info koneksi
 * @param {Object} params - Parameter audit log
 * @param {string} params.action - Jenis aksi ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT')
 * @param {string} params.entityName - Nama model (misal: 'Asset', 'Mutation', 'Calibration')
 * @param {string} params.entityId - ID record entitas terkait
 * @param {Object} [params.oldValues] - Nilai data sebelum diubah (untuk UPDATE/DELETE)
 * @param {Object} [params.newValues] - Nilai data sesudah diubah (untuk CREATE/UPDATE)
 */
export const logActivity = async (req, { action, entityName, entityId, oldValues = null, newValues = null }) => {
  try {
    const userId = req.user ? req.user.id : null;
    const userName = req.user ? req.user.name : 'System';
    
    // Ambil IP Address (mendukung format proxy seperti Cloudflare/Nginx)
    const ipAddress = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || null;

    await AuditLog.create({
      userId,
      userName,
      action,
      entityName,
      entityId: String(entityId),
      oldValues: oldValues ? JSON.parse(JSON.stringify(oldValues)) : null,
      newValues: newValues ? JSON.parse(JSON.stringify(newValues)) : null,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error('Audit Logger Error:', error.message);
  }
};
