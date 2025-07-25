const API_BASE_URL = 'https://lifestyle-store-backend.onrender.com/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    products: '/products',
    categories: '/categories',
    orders: '/orders'
  }
};

export default API_BASE_URL;
