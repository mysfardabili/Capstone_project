import Asset from '../models/Asset.js';
import Repair from '../models/Repair.js';
import Calibration from '../models/Calibration.js';
import Mutation from '../models/Mutation.js';
import { Op } from 'sequelize';

// @desc    Get all assets (with search and filters)
// @route   GET /api/assets
// @access  Private
export const getAssets = async (req, res) => {
  const { search, category, condition, status } = req.query;

  const whereClause = {};

  if (search) {
    whereClause[Op.or] = [
      { id: { [Op.like]: `%${search}%` } },
      { name: { [Op.like]: `%${search}%` } },
      { serialNumber: { [Op.like]: `%${search}%` } },
    ];
  }

  if (category) {
    // Frontend options: medis, non-medis, fasilitas, it
    // Store maps or matches
    let catVal = category;
    if (category === 'medis') catVal = 'Alat Medis';
    if (category === 'non-medis') catVal = 'Non-Medis';
    if (category === 'fasilitas') catVal = 'Fasilitas';
    if (category === 'it') catVal = 'Perangkat IT';
    
    whereClause.category = catVal;
  }

  if (condition) {
    whereClause.condition = condition;
  }

  if (status) {
    whereClause.status = status;
  }

  try {
    const assets = await Asset.findAll({
      where: whereClause,
      order: [['id', 'ASC']],
    });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data aset', error: error.message });
  }
};

// @desc    Get single asset detail with histories
// @route   GET /api/assets/:id
// @access  Private
export const getAssetById = async (req, res) => {
  const { id } = req.params;

  try {
    const asset = await Asset.findByPk(id, {
      include: [
        { model: Repair, as: 'repairs', order: [['date', 'DESC']] },
        { model: Calibration, as: 'calibrations', order: [['nextCalibrationDate', 'DESC']] },
        { model: Mutation, as: 'mutations', order: [['date', 'DESC']] },
      ],
    });

    if (!asset) {
      return res.status(404).json({ message: 'Aset tidak ditemukan' });
    }

    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil detail aset', error: error.message });
  }
};

// @desc    Create new asset
// @route   POST /api/assets
// @access  Private
export const createAsset = async (req, res) => {
  try {
    let {
      id,
      name,
      category,
      room,
      serialNumber,
      price,
      condition,
      status,
      purchaseDate,
      warrantyEnd,
      description,
    } = req.body;

    // Handle automated ID generation if not provided
    if (!id) {
      const lastAsset = await Asset.findOne({
        order: [['createdAt', 'DESC']],
      });
      let nextNum = 1;
      if (lastAsset && lastAsset.id.startsWith('AST-')) {
        const lastNum = parseInt(lastAsset.id.split('-')[1]);
        if (!isNaN(lastNum)) {
          nextNum = lastNum + 1;
        }
      }
      id = `AST-${String(nextNum).padStart(3, '0')}`;
    }

    // Handle file uploads (image and document)
    let img = null;
    let manualBook = null;
    if (req.files) {
      if (req.files['image'] && req.files['image'].length > 0) {
        img = `/uploads/${req.files['image'][0].filename}`;
      }
      if (req.files['document'] && req.files['document'].length > 0) {
        manualBook = `/uploads/${req.files['document'][0].filename}`;
      }
    }

    // Map categories/rooms from frontend values to readable names if needed
    const catMap = {
      'medis': 'Alat Medis',
      'non-medis': 'Non-Medis',
      'fasilitas': 'Fasilitas',
      'it': 'Perangkat IT',
    };
    const roomMap = {
      'igd': 'IGD Bed 3',
      'radiologi': 'Ruang Radiologi 1',
      'operasi': 'Ruang Operasi 1',
      'rawat-inap': 'Kamar Mawar 101',
    };

    const formattedCategory = catMap[category] || category || 'Alat Medis';
    const formattedRoom = roomMap[room] || room || 'Gudang Alat';

    const newAsset = await Asset.create({
      id,
      name,
      category: formattedCategory,
      room: formattedRoom,
      serialNumber,
      price: parseFloat(price) || 0,
      condition: condition || 'Baik',
      status: status || 'Tersedia',
      purchaseDate: purchaseDate || null,
      warrantyEnd: warrantyEnd || null,
      img,
      manualBook,
      description,
    });

    res.status(201).json(newAsset);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat aset baru', error: error.message });
  }
};

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Private
export const updateAsset = async (req, res) => {
  const { id } = req.params;

  try {
    const asset = await Asset.findByPk(id);

    if (!asset) {
      return res.status(404).json({ message: 'Aset tidak ditemukan' });
    }

    let {
      name,
      category,
      room,
      serialNumber,
      price,
      condition,
      status,
      purchaseDate,
      warrantyEnd,
      description,
    } = req.body;

    // Handle file uploads update
    let img = asset.img;
    let manualBook = asset.manualBook;
    
    if (req.files) {
      if (req.files['image'] && req.files['image'].length > 0) {
        img = `/uploads/${req.files['image'][0].filename}`;
      }
      if (req.files['document'] && req.files['document'].length > 0) {
        manualBook = `/uploads/${req.files['document'][0].filename}`;
      }
    }

    // Map categories/rooms from frontend values to readable names
    const catMap = {
      'medis': 'Alat Medis',
      'non-medis': 'Non-Medis',
      'fasilitas': 'Fasilitas',
      'it': 'Perangkat IT',
    };
    const roomMap = {
      'igd': 'IGD Bed 3',
      'radiologi': 'Ruang Radiologi 1',
      'operasi': 'Ruang Operasi 1',
      'rawat-inap': 'Kamar Mawar 101',
    };

    if (category && catMap[category]) category = catMap[category];
    if (room && roomMap[room]) room = roomMap[room];

    await asset.update({
      name: name !== undefined ? name : asset.name,
      category: category !== undefined ? category : asset.category,
      room: room !== undefined ? room : asset.room,
      serialNumber: serialNumber !== undefined ? serialNumber : asset.serialNumber,
      price: price !== undefined ? parseFloat(price) : asset.price,
      condition: condition !== undefined ? condition : asset.condition,
      status: status !== undefined ? status : asset.status,
      purchaseDate: purchaseDate !== undefined ? purchaseDate : asset.purchaseDate,
      warrantyEnd: warrantyEnd !== undefined ? warrantyEnd : asset.warrantyEnd,
      img,
      manualBook,
      description: description !== undefined ? description : asset.description,
    });

    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui aset', error: error.message });
  }
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private
export const deleteAsset = async (req, res) => {
  const { id } = req.params;

  try {
    const asset = await Asset.findByPk(id);

    if (!asset) {
      return res.status(404).json({ message: 'Aset tidak ditemukan' });
    }

    await asset.destroy();
    res.json({ message: 'Aset berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus aset', error: error.message });
  }
};
