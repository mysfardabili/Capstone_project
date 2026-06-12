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

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Gagal mengambil data dari server');
    }
    return response.json();
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Gagal mengirim data ke server');
    }
    return response.json();
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Gagal memperbarui data di server');
    }
    return response.json();
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Gagal menghapus data di server');
    }
    return response.json();
  },
};
