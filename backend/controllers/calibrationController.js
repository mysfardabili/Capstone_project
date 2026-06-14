import Calibration from '../models/Calibration.js';
import Asset from '../models/Asset.js';
import { Op } from 'sequelize';

// @desc    Get all calibrations
// @route   GET /api/calibrations
// @access  Private
export const getCalibrations = async (req, res) => {
  try {
    const calibrations = await Calibration.findAll({
      include: [{ model: Asset, as: 'asset', attributes: ['name', 'room'] }],
      order: [['nextCalibrationDate', 'ASC']],
    });
    res.json(calibrations);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data kalibrasi', error: error.message });
  }
};

// @desc    Create new calibration schedule
// @route   POST /api/calibrations
// @access  Private
export const createCalibration = async (req, res) => {
  try {
    const { assetId, nextCalibrationDate, vendor, notes } = req.body;

    const asset = await Asset.findByPk(assetId);
    if (!asset) {
      return res.status(404).json({ message: 'Aset tidak ditemukan' });
    }

    // Generate CAL-001...
    const lastCal = await Calibration.findOne({
      order: [['id', 'DESC']],
    });
    let nextNum = 1;
    if (lastCal && lastCal.id.startsWith('CAL-')) {
      const lastNum = parseInt(lastCal.id.split('-')[1]);
      if (!isNaN(lastNum)) {
        nextNum = lastNum + 1;
      }
    }
    const id = `CAL-${String(nextNum).padStart(3, '0')}`;

    const newCalibration = await Calibration.create({
      id,
      assetId,
      nextCalibrationDate,
      vendor,
      status: 'Menunggu',
      notes,
    });

    res.status(201).json(newCalibration);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menjadwalkan kalibrasi', error: error.message });
  }
};

// @desc    Update/complete calibration
// @route   PUT /api/calibrations/:id
// @access  Private
export const updateCalibration = async (req, res) => {
  const { id } = req.params;
  const { status, certificateNumber, notes, calibrationDate, nextCalibrationDate } = req.body;

  try {
    const calibration = await Calibration.findByPk(id);

    if (!calibration) {
      return res.status(404).json({ message: 'Data kalibrasi tidak ditemukan' });
    }

    calibration.status = status || calibration.status;
    calibration.certificateNumber = certificateNumber !== undefined ? certificateNumber : calibration.certificateNumber;
    calibration.notes = notes !== undefined ? notes : calibration.notes;
    calibration.calibrationDate = calibrationDate || new Date().toISOString().split('T')[0];
    
    if (nextCalibrationDate) {
      calibration.nextCalibrationDate = nextCalibrationDate;
    }

    if (req.file) {
      calibration.certificateUrl = `/uploads/${req.file.filename}`;
    }

    await calibration.save();

    res.json(calibration);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui data kalibrasi', error: error.message });
  }
};

// @desc    Get upcoming calibrations (within 30 days)
// @route   GET /api/calibrations/upcoming
// @access  Private
export const getUpcomingCalibrations = async (req, res) => {
  try {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 30);

    const todayStr = today.toISOString().split('T')[0];
    const futureDateStr = futureDate.toISOString().split('T')[0];

    const upcoming = await Calibration.findAll({
      where: {
        nextCalibrationDate: {
          [Op.between]: [todayStr, futureDateStr]
        },
        status: 'Menunggu'
      },
      include: [{ model: Asset, as: 'asset', attributes: ['name', 'room'] }],
      order: [['nextCalibrationDate', 'ASC']]
    });

    res.json(upcoming);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data kalibrasi mendatang', error: error.message });
  }
};
