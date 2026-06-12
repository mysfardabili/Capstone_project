import Request from '../models/Request.js';

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
      order: [['createdAt', 'DESC']],
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

    request.status = mappedStatus;
    await request.save();

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

    request.status = 'Disetujui';
    await request.save();

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

    request.status = 'Ditolak';
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menolak permintaan', error: error.message });
  }
};
