import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return res.status(401).json({ message: 'User tidak ditemukan' });
      }

      next();
    } catch (error) {
      console.error('JWT verification error:', error);
      res.status(401).json({ message: 'Sesi habis, silakan login kembali' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Akses ditolak, token tidak tersedia' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Peran Anda (${req.user?.role || 'Guest'}) tidak diizinkan untuk mengakses fitur ini`
      });
    }
    next();
  };
};

export { protect, authorize };
