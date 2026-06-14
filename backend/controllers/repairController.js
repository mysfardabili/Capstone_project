import Repair from '../models/Repair.js';
import Asset from '../models/Asset.js';
import Notification from '../models/Notification.js';

// @desc    Get all repairs
// @route   GET /api/repairs
// @access  Private
export const getRepairs = async (req, res) => {
  try {
    const repairs = await Repair.findAll({
      include: [{ model: Asset, as: 'asset', attributes: ['name', 'room'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(repairs);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data perbaikan', error: error.message });
  }
};

// @desc    Create new repair report
// @route   POST /api/repairs
// @access  Private
export const createRepair = async (req, res) => {
  try {
    const { assetId, reporterName, description, priority } = req.body;

    const asset = await Asset.findByPk(assetId);
    if (!asset) {
      return res.status(404).json({ message: 'Aset tidak ditemukan' });
    }

    // Generate REP-001...
    const lastRepair = await Repair.findOne({
      order: [['id', 'DESC']],
    });
    let nextNum = 1;
    if (lastRepair && lastRepair.id.startsWith('REP-')) {
      const lastNum = parseInt(lastRepair.id.split('-')[1]);
      if (!isNaN(lastNum)) {
        nextNum = lastNum + 1;
      }
    }
    const id = `REP-${String(nextNum).padStart(3, '0')}`;

    // Handle photo file
    let photo = null;
    if (req.file) {
      photo = `/uploads/${req.file.filename}`;
    }

    const newRepair = await Repair.create({
      id,
      assetId,
      reporterName: reporterName || req.user.name,
      description,
      priority: priority || 'sedang',
      photo,
      status: 'Pending',
    });

    // Update asset condition to Rusak since it has a pending repair report
    asset.condition = 'Rusak';
    await asset.save();

    // Auto-create notification for technicians
    await Notification.create({
      type: 'warning',
      message: `Laporan kerusakan baru: ${asset.name} (${assetId}) - ${description}`,
      date: new Date(),
      relatedId: id,
    });

    res.status(201).json(newRepair);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat laporan perbaikan', error: error.message });
  }
};

// @desc    Update repair job status (In Progress, Completed)
// @route   PUT /api/repairs/:id
// @access  Private
export const updateRepair = async (req, res) => {
  const { id } = req.params;
  const { status, notes, technicianName, assetCondition } = req.body;

  try {
    const repair = await Repair.findByPk(id);

    if (!repair) {
      return res.status(404).json({ message: 'Data perbaikan tidak ditemukan' });
    }

    const asset = await Asset.findByPk(repair.assetId);

    // Map status strings
    let mappedStatus = status;
    if (status === 'In Progress') mappedStatus = 'Proses';
    if (status === 'Completed') mappedStatus = 'Selesai';

    repair.status = mappedStatus || repair.status;
    repair.notes = notes !== undefined ? notes : repair.notes;
    repair.technicianName = technicianName || repair.technicianName || req.user.name;

    if (req.file) {
      repair.photo = `/uploads/${req.file.filename}`;
    }

    if (mappedStatus === 'Selesai') {
      repair.completionDate = new Date().toISOString().split('T')[0];
      if (asset) {
        asset.condition = assetCondition || 'Baik';
        await asset.save();
      }
    } else if (mappedStatus === 'Proses') {
      if (asset) {
        asset.condition = 'Perbaikan';
        await asset.save();
      }
    }

    await repair.save();

    res.json(repair);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui perbaikan', error: error.message });
  }
};

// @desc    Update repair status specifically
// @route   PUT /api/repairs/:id/status
// @access  Private
export const updateRepairStatus = async (req, res) => {
  const { id } = req.params;
  const { status, notes, technicianName, assetCondition } = req.body;

  try {
    const repair = await Repair.findByPk(id);

    if (!repair) {
      return res.status(404).json({ message: 'Data perbaikan tidak ditemukan' });
    }

    const asset = await Asset.findByPk(repair.assetId);

    // Map status strings
    let mappedStatus = status;
    if (status === 'In Progress') mappedStatus = 'Proses';
    if (status === 'Completed') mappedStatus = 'Selesai';

    repair.status = mappedStatus || repair.status;
    repair.notes = notes !== undefined ? notes : repair.notes;
    repair.technicianName = technicianName || repair.technicianName || req.user.name;

    if (req.file) {
      repair.photo = `/uploads/${req.file.filename}`;
    }

    if (mappedStatus === 'Selesai') {
      repair.completionDate = new Date().toISOString().split('T')[0];
      if (asset) {
        asset.condition = assetCondition || 'Baik';
        await asset.save();
      }
    } else if (mappedStatus === 'Proses') {
      if (asset) {
        asset.condition = 'Perbaikan';
        await asset.save();
      }
    }

    await repair.save();

    res.json(repair);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui status perbaikan', error: error.message });
  }
};
