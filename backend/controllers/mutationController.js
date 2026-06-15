import Mutation from '../models/Mutation.js';
import Asset from '../models/Asset.js';
import { logActivity } from '../middleware/auditLogger.js';

// @desc    Get all mutations
// @route   GET /api/mutations
// @access  Private
export const getMutations = async (req, res) => {
  try {
    const mutations = await Mutation.findAll({
      include: [{ model: Asset, as: 'asset', attributes: ['name'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(mutations);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data mutasi', error: error.message });
  }
};

// @desc    Create new mutation request
// @route   POST /api/mutations
// @access  Private
export const createMutation = async (req, res) => {
  try {
    const { assetId, targetLocation, notes, requesterName } = req.body;

    const asset = await Asset.findByPk(assetId);
    if (!asset) {
      return res.status(404).json({ message: 'Aset tidak ditemukan' });
    }

    if (asset.condition !== 'Baik') {
      return res.status(400).json({ 
        message: `Aset tidak dapat dimutasi karena sedang dalam kondisi ${asset.condition.toLowerCase()}.` 
      });
    }

    // Generate MUT-001...
    const lastMut = await Mutation.findOne({
      order: [['id', 'DESC']],
    });
    let nextNum = 1;
    if (lastMut && lastMut.id.startsWith('MUT-')) {
      const lastNum = parseInt(lastMut.id.split('-')[1]);
      if (!isNaN(lastNum)) {
        nextNum = lastNum + 1;
      }
    }
    const id = `MUT-${String(nextNum).padStart(3, '0')}`;

    // Map target room from select value if needed
    const roomMap = {
      'igd': 'IGD Bed 3',
      'radiologi': 'Ruang Radiologi 1',
      'operasi': 'Ruang Operasi 1',
      'rawat-inap': 'Kamar Mawar 101',
    };
    const formattedTarget = roomMap[targetLocation] || targetLocation;

    const newMutation = await Mutation.create({
      id,
      assetId,
      sourceLocation: asset.room,
      targetLocation: formattedTarget,
      requesterName: requesterName || req.user.name,
      notes,
      status: 'Pending',
    });

    await logActivity(req, {
      action: 'CREATE',
      entityName: 'Mutation',
      entityId: newMutation.id,
      newValues: newMutation
    });

    res.status(201).json(newMutation);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengajukan mutasi', error: error.message });
  }
};

// @desc    Update mutation status (Approve/Reject)
// @route   PUT /api/mutations/:id
// @access  Private
export const updateMutationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Approved or Rejected

  try {
    const mutation = await Mutation.findByPk(id);

    if (!mutation) {
      return res.status(404).json({ message: 'Data mutasi tidak ditemukan' });
    }

    const oldValues = { ...mutation.dataValues };
    mutation.status = status;
    await mutation.save();

    // If approved, update the asset's room
    if (status === 'Approved') {
      const asset = await Asset.findByPk(mutation.assetId);
      if (asset) {
        const oldAssetValues = { ...asset.dataValues };
        asset.room = mutation.targetLocation;
        await asset.save();

        await logActivity(req, {
          action: 'UPDATE',
          entityName: 'Asset',
          entityId: asset.id,
          oldValues: oldAssetValues,
          newValues: asset
        });
      }
    }

    await logActivity(req, {
      action: 'UPDATE',
      entityName: 'Mutation',
      entityId: mutation.id,
      oldValues: oldValues,
      newValues: mutation
    });

    res.json(mutation);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui status mutasi', error: error.message });
  }
};
