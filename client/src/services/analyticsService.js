import api from '../utils/api';

export const analyticsService = {
  getPublicStats: async () => {
    const { data } = await api.get('/analytics/public-stats');
    return data;
  },
  getBusinessAnalytics: async () => {
    const { data } = await api.get('/analytics/business');
    return data;
  },
  getAdminAnalytics: async () => {
    const { data } = await api.get('/analytics/admin');
    return data;
  },
};

export default analyticsService;
