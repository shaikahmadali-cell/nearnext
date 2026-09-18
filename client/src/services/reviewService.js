import axios from 'axios';

const API_URL = '/api';

const getReviewsForBusiness = async (businessId) => {
  const response = await axios.get(`${API_URL}/businesses/${businessId}/reviews`);
  return response.data;
};

const createReview = async (businessId, reviewData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    `${API_URL}/businesses/${businessId}/reviews`,
    reviewData,
    config
  );
  return response.data;
};

const deleteReview = async (reviewId) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${API_URL}/reviews/${reviewId}`, config);
  return response.data;
};

const reviewService = {
  getReviewsForBusiness,
  createReview,
  deleteReview,
};

export default reviewService;
