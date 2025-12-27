import api from './axios';

export const applicationsAPI = {
  create: (propertyId, data) => api.post(`/applications/${propertyId}`, data),
  
  getAll: () => api.get('/applications'),
  
  getById: (id) => api.get(`/applications/${id}`),
  
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
  
  getOwnerApplications: () => api.get('/owner/applications'),
};
