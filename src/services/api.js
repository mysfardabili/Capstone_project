const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Handle 401 Unauthorized globally:
 * Token expired atau tidak valid → hapus data dan redirect ke /login
 */
const handleUnauthorized = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    handleUnauthorized();
    throw new Error('Sesi Anda telah habis. Silakan login kembali.');
  }
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Terjadi kesalahan pada server');
  }
  return response.json();
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  post: async (endpoint, data, isMultipart = false) => {
    const headers = getHeaders();
    if (isMultipart) {
      delete headers['Content-Type']; // Let browser set boundary automatically
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: isMultipart ? data : JSON.stringify(data),
    });
    return handleResponse(response);
  },

  put: async (endpoint, data, isMultipart = false) => {
    const headers = getHeaders();
    if (isMultipart) {
      delete headers['Content-Type'];
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: headers,
      body: isMultipart ? data : JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
