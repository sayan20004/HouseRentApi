import api from './axios';

export const propertiesAPI = {
  getAll: (params) => api.get('/properties', { params }),
  
  getById: (id) => api.get(`/properties/${id}`),
  
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'images' && Array.isArray(data[key])) {
        data[key].forEach((file) => formData.append('images', file));
      } else if (key === 'location' || key === 'maintenance' || key === 'amenities') {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post('/properties', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  update: (id, data) => api.patch(`/properties/${id}`, data),
  
  delete: (id) => api.delete(`/properties/${id}`),
  
  getOwnerProperties: () => api.get('/owner/properties'),
  
  addFavorite: (id) => api.post(`/properties/${id}/favorite`),
  
  removeFavorite: (id) => api.delete(`/properties/${id}/favorite`),
  
  getFavorites: () => api.get('/favorites'),
};
