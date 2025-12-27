import api from './axios';

export const visitRequestsAPI = {
  create: (propertyId, data) => api.post(`/visit-requests/${propertyId}`, data),
  
  getAll: () => api.get('/visit-requests'),
  
  updateStatus: (id, status) => api.patch(`/visit-requests/${id}/status`, { status }),
  
  getOwnerRequests: () => api.get('/owner/visit-requests'),
};
