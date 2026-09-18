import api from '../utils/api';

export const enquiryService = {
  createEnquiry: async (enquiryData) => {
    const { data } = await api.post('/enquiries', enquiryData);
    return data;
  },
  getCustomerEnquiries: async () => {
    const { data } = await api.get('/enquiries/customer');
    return data;
  },
  getBusinessEnquiries: async () => {
    const { data } = await api.get('/enquiries/business');
    return data;
  },
  replyEnquiry: async (id, message) => {
    const { data } = await api.post(`/enquiries/${id}/reply`, { message });
    return data;
  },
  updateEnquiryStatus: async (id, status) => {
    const { data } = await api.put(`/enquiries/${id}/status`, { status });
    return data;
  },
};

export default enquiryService;
