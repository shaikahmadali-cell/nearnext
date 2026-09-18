import api from '../utils/api';

export const offerService = {
  getOffers: async (params = {}) => {
    const { data } = await api.get('/offers', { params });
    return data;
  },
  getOfferById: async (id) => {
    const { data } = await api.get(`/offers/${id}`);
    return data;
  },
  getMyOffers: async () => {
    const { data } = await api.get('/offers/my/all');
    return data;
  },
  createOffer: async (offerData) => {
    const { data } = await api.post('/offers', offerData);
    return data;
  },
  updateOffer: async (id, offerData) => {
    const { data } = await api.put(`/offers/${id}`, offerData);
    return data;
  },
  deleteOffer: async (id) => {
    const { data } = await api.delete(`/offers/${id}`);
    return data;
  },
  toggleSaveOffer: async (id) => {
    const { data } = await api.post(`/offers/${id}/save`);
    return data;
  },
  getSavedOffers: async () => {
    const { data } = await api.get('/offers/customer/saved');
    return data;
  },
  adminGetAllOffers: async () => {
    const { data } = await api.get('/offers/admin/all');
    return data;
  },
};

export default offerService;
