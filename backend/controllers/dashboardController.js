import Asset from '../models/Asset.js';
import Repair from '../models/Repair.js';
import Request from '../models/Request.js';
import Mutation from '../models/Mutation.js';
import Calibration from '../models/Calibration.js';
import { Op } from 'sequelize';

// @desc    Get dashboard summary statistics
// @route   GET /api/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req, res) => {
  try {
    // 1. Core Summary Metrics
    const totalAssets = await Asset.count();
    const activeRepairs = await Repair.count({
      where: { status: { [Op.in]: ['Pending', 'Proses'] } }
    });
    const pendingRequests = await Request.count({
      where: { status: 'Pending' }
    });
    
    // Mutations this month (from start of current month)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const mutationsThisMonth = await Mutation.count({
      where: {
        date: { [Op.gte]: firstDayOfMonth }
      }
    });

    // 2. Asset Condition Distribution
    const condBaik = await Asset.count({ where: { condition: 'Baik' } });
    const condPerbaikan = await Asset.count({ where: { condition: 'Perbaikan' } });
    const condRusak = await Asset.count({ where: { condition: 'Rusak' } });

    // 3. Room Distribution
    const assetsByRoom = await Asset.findAll({
      attributes: ['room', [Asset.sequelize.fn('COUNT', Asset.sequelize.col('id')), 'count']],
      group: ['room'],
    });

    // 4. Upcoming Calibrations
    const upcomingCalibrations = await Calibration.findAll({
      where: { status: 'Menunggu' },
      include: [{ model: Asset, as: 'asset', attributes: ['name'] }],
      limit: 5,
      order: [['nextCalibrationDate', 'ASC']],
    });

    // 5. Pending Approvals (combines Requests and Mutations)
    const pendingRequestsList = await Request.findAll({
      where: { status: 'Pending' },
      limit: 3,
      order: [['date', 'DESC']],
    });

    const pendingMutationsList = await Mutation.findAll({
      where: { status: 'Pending' },
      include: [{ model: Asset, as: 'asset', attributes: ['name'] }],
      limit: 3,
      order: [['date', 'DESC']],
    });

    // 6. Recent Activities Feed (combines recent repairs and mutations)
    const recentRepairs = await Repair.findAll({
      include: [{ model: Asset, as: 'asset', attributes: ['name'] }],
      limit: 3,
      order: [['createdAt', 'DESC']],
    });

    const recentMutations = await Mutation.findAll({
      include: [{ model: Asset, as: 'asset', attributes: ['name'] }],
      limit: 3,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      summary: {
        totalAssets,
        activeRepairs,
        pendingRequests,
        mutationsThisMonth,
      },
      conditionDistribution: {
        baik: condBaik,
        perbaikan: condPerbaikan,
        rusak: condRusak,
      },
      roomDistribution: assetsByRoom.map(item => ({
        room: item.room,
        count: parseInt(item.getDataValue('count')) || 0,
      })),
      upcomingCalibrations: upcomingCalibrations.map(cal => {
        // Calculate days left
        const dueDate = new Date(cal.nextCalibrationDate);
        const diffTime = dueDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return {
          id: cal.id,
          assetName: cal.asset ? cal.asset.name : 'Aset',
          nextDue: cal.nextCalibrationDate,
          daysLeft: diffDays,
        };
      }),
      pendingApprovals: {
        requests: pendingRequestsList.map(reqItem => ({
          id: reqItem.id,
          type: 'request',
          title: `Pengajuan ${reqItem.assetName}`,
          subtitle: `${reqItem.department} • ${reqItem.qty} Unit • Oleh ${reqItem.requesterName}`,
        })),
        mutations: pendingMutationsList.map(mutItem => ({
          id: mutItem.id,
          type: 'mutation',
          title: `Mutasi ${mutItem.asset ? mutItem.asset.name : 'Aset'}`,
          subtitle: `${mutItem.sourceLocation} ke ${mutItem.targetLocation} • ${mutItem.requesterName}`,
        })),
      },
      recentActivities: [
        ...recentRepairs.map(rep => ({
          id: rep.id,
          type: 'repair',
          title: `Perbaikan Aset: ${rep.asset ? rep.asset.name : 'Aset'}`,
          description: `Dilaporkan oleh ${rep.reporterName}. Status: ${rep.status}`,
          date: rep.createdAt,
        })),
        ...recentMutations.map(mut => ({
          id: mut.id,
          type: 'mutation',
          title: `Mutasi Aset: ${mut.asset ? mut.asset.name : 'Aset'}`,
          description: `Dipindahkan ke ${mut.targetLocation} oleh ${mut.requesterName}. Status: ${mut.status}`,
          date: mut.createdAt,
        })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal merangkum data dashboard', error: error.message });
  }
};

// @desc    Get dashboard activities feed
// @route   GET /api/dashboard/activities
// @access  Private
export const getDashboardActivities = async (req, res) => {
  try {
    const recentRepairs = await Repair.findAll({
      include: [{ model: Asset, as: 'asset', attributes: ['name'] }],
      limit: 10,
      order: [['createdAt', 'DESC']],
    });

    const recentMutations = await Mutation.findAll({
      include: [{ model: Asset, as: 'asset', attributes: ['name'] }],
      limit: 10,
      order: [['createdAt', 'DESC']],
    });

    const activities = [
      ...recentRepairs.map(rep => ({
        id: rep.id,
        type: 'repair',
        title: `Perbaikan Aset: ${rep.asset ? rep.asset.name : 'Aset'}`,
        description: `Dilaporkan oleh ${rep.reporterName}. Status: ${rep.status}`,
        date: rep.createdAt,
      })),
      ...recentMutations.map(mut => ({
        id: mut.id,
        type: 'mutation',
        title: `Mutasi Aset: ${mut.asset ? mut.asset.name : 'Aset'}`,
        description: `Dipindahkan ke ${mut.targetLocation} oleh ${mut.requesterName}. Status: ${mut.status}`,
        date: mut.createdAt,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 15);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data aktivitas dashboard', error: error.message });
  }
};
