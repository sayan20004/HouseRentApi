import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  
  login: (data) => api.post('/auth/login', data),
  
  getProfile: () => api.get('/auth/me'),
  
  updateProfile: (data) => api.patch('/users/me', data),
  
  convertToOwner: () => api.patch('/users/me/role', { confirmRole: 'owner' }),
};
