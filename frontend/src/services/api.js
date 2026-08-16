import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Car API endpoints
export const carAPI = {
  getAllCars: (filters = {}) => apiClient.get('/cars', { params: filters }),
  getCarById: (id) => apiClient.get(`/cars/${id}`),
  getRecommendations: (query) =>
    apiClient.post('/cars/recommendations', { query }),
  compareCars: (car1Id, car2Id) =>
    apiClient.post('/cars/compare', { car1Id, car2Id }),
};

export default apiClient;
