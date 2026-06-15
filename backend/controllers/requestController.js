import Request from '../models/Request.js';
import { logActivity } from '../middleware/auditLogger.js';
import { sendEmail } from '../services/emailService.js';

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private
export const getRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data permintaan', error: error.message });
  }
};

// @desc    Create new request
// @route   POST /api/requests
// @access  Private
export const createRequest = async (req, res) => {
  try {
    const { assetName, category, qty, requesterName, department, notes } = req.body;

    // Auto ID generation REQ-001...
    const lastRequest = await Request.findOne({
      order: [['id', 'DESC']],
    });
    let nextNum = 1;
    if (lastRequest && lastRequest.id.startsWith('REQ-')) {
      const lastNum = parseInt(lastRequest.id.split('-')[1]);
      if (!isNaN(lastNum)) {
        nextNum = lastNum + 1;
      }
    }
    const id = `REQ-${String(nextNum).padStart(3, '0')}`;

    const newRequest = await Request.create({
      id,
      assetName,
      category,
      qty: parseInt(qty) || 1,
      requesterName: requesterName || req.user.name,
      department: department || 'Umum',
      notes,
      status: 'Pending',
    });

    await logActivity(req, {
      action: 'CREATE',
      entityName: 'Request',
      entityId: newRequest.id,
      newValues: newRequest
    });

    // Kirim notifikasi email ke Admin
    await sendEmail({
      to: 'admin@asetra.com',
      subject: `[ASETRA] Pengajuan Aset Baru - ${newRequest.id}`,
      text: `Halo Admin,\n\nAda pengajuan aset baru dengan detail:\nID Pengajuan: ${newRequest.id}\nNama Aset: ${newRequest.assetName}\nKategori: ${newRequest.category}\nJumlah: ${newRequest.qty}\nDiajukan Oleh: ${newRequest.requesterName} (${newRequest.department})\nCatatan: ${newRequest.notes || '-'}\n\nSilakan tinjau pengajuan ini di dashboard ASETRA.`,
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat permintaan baru', error: error.message });
  }
};

// @desc    Update request status (Approve/Reject)
// @route   PUT /api/requests/:id
// @access  Private
export const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Approved or Rejected

  try {
    const request = await Request.findByPk(id);

    if (!request) {
      return res.status(404).json({ message: 'Permintaan tidak ditemukan' });
    }

    let mappedStatus = status;
    if (status === 'Approved') mappedStatus = 'Disetujui';
    if (status === 'Rejected') mappedStatus = 'Ditolak';

    const oldValues = { ...request.dataValues };
    request.status = mappedStatus;
    await request.save();

    await logActivity(req, {
      action: 'UPDATE',
      entityName: 'Request',
      entityId: request.id,
      oldValues: oldValues,
      newValues: request
    });

    // Notifikasi email status pengajuan
    await sendEmail({
      to: 'requester@asetra.com',
      subject: `[ASETRA] Status Pengajuan Aset ${request.id} - ${request.status}`,
      text: `Halo,\n\nPengajuan aset Anda (${request.assetName}) telah diperbarui dengan status: ${request.status}.\n\nSalam,\nTim ASETRA`,
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui status permintaan', error: error.message });
  }
};

// @desc    Approve request
// @route   PUT /api/requests/:id/approve
// @access  Private
export const approveRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await Request.findByPk(id);

    if (!request) {
      return res.status(404).json({ message: 'Permintaan tidak ditemukan' });
    }

    const oldValues = { ...request.dataValues };
    request.status = 'Disetujui';
    await request.save();

    await logActivity(req, {
      action: 'UPDATE',
      entityName: 'Request',
      entityId: request.id,
      oldValues: oldValues,
      newValues: request
    });

    await sendEmail({
      to: 'requester@asetra.com',
      subject: `[ASETRA] Pengajuan Aset Disetujui - ${request.id}`,
      text: `Halo,\n\nKabar baik! Pengajuan aset Anda (${request.assetName}) telah DISETUJUI oleh Admin.\n\nSalam,\nTim ASETRA`,
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menyetujui permintaan', error: error.message });
  }
};

// @desc    Reject request
// @route   PUT /api/requests/:id/reject
// @access  Private
export const rejectRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await Request.findByPk(id);

    if (!request) {
      return res.status(404).json({ message: 'Permintaan tidak ditemukan' });
    }

    const oldValues = { ...request.dataValues };
    request.status = 'Ditolak';
    await request.save();

    await logActivity(req, {
      action: 'UPDATE',
      entityName: 'Request',
      entityId: request.id,
      oldValues: oldValues,
      newValues: request
    });

    await sendEmail({
      to: 'requester@asetra.com',
      subject: `[ASETRA] Pengajuan Aset Ditolak - ${request.id}`,
      text: `Halo,\n\nMohon maaf, pengajuan aset Anda (${request.assetName}) ditolak.\n\nSalam,\nTim ASETRA`,
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menolak permintaan', error: error.message });
  }
};
