import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute — Mencegah akses halaman tanpa login.
 * Jika token tidak ada → redirect ke /login.
 * Jika role tidak sesuai → redirect ke /login.
 * 
 * @param {string[]} allowedRoles - Daftar role yang diizinkan ('admin', 'technician')
 * @param {ReactNode} children - Komponen yang dilindungi
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  // Jika tidak ada token, redirect ke login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada pembatasan role, periksa apakah role user sesuai
  if (allowedRoles && allowedRoles.length > 0) {
    try {
      const user = JSON.parse(userRaw || '{}');
      if (!allowedRoles.includes(user.role)) {
        // Role tidak sesuai, arahkan ke halaman yang benar
        if (user.role === 'technician') {
          return <Navigate to="/technician" replace />;
        }
        return <Navigate to="/login" replace />;
      }
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
