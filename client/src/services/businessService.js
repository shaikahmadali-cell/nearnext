import api from '../utils/api';

export const businessService = {
  getBusinesses: async (params = {}) => {
    const { data } = await api.get('/businesses', { params });
    return data;
  },
  getBusinessById: async (id) => {
    const { data } = await api.get(`/businesses/${id}`);
    return data;
  },
  getMyBusiness: async () => {
    const { data } = await api.get('/businesses/my/profile');
    return data;
  },
  createOrUpdateBusiness: async (businessData) => {
    const { data } = await api.post('/businesses', businessData);
    return data;
  },
  adminGetAllBusinesses: async () => {
    const { data } = await api.get('/businesses/admin/all');
    return data;
  },
  updateBusinessStatus: async (id, statusData) => {
    const { data } = await api.put(`/businesses/${id}/status`, statusData);
    return data;
  },
  deleteBusiness: async (id) => {
    const { data } = await api.delete(`/businesses/${id}`);
    return data;
  },
};

export default businessService;
