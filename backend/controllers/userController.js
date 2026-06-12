import User from '../models/User.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const { name, email, phone } = req.body;

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone !== undefined ? phone : user.phone;

    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profilePicture: user.profilePicture,
      emailNewRequest: user.emailNewRequest,
      emailCalibrationDue: user.emailCalibrationDue,
      weeklyReport: user.weeklyReport
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui profil', error: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
export const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Kata sandi saat ini salah' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Kata sandi berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui kata sandi', error: error.message });
  }
};

// @desc    Update user system preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updateUserPreferences = async (req, res) => {
  try {
    const { emailNewRequest, emailCalibrationDue, weeklyReport } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    if (emailNewRequest !== undefined) user.emailNewRequest = emailNewRequest;
    if (emailCalibrationDue !== undefined) user.emailCalibrationDue = emailCalibrationDue;
    if (weeklyReport !== undefined) user.weeklyReport = weeklyReport;

    await user.save();

    res.json({
      message: 'Preferensi berhasil diperbarui',
      preferences: {
        emailNewRequest: user.emailNewRequest,
        emailCalibrationDue: user.emailCalibrationDue,
        weeklyReport: user.weeklyReport
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui preferensi', error: error.message });
  }
};
