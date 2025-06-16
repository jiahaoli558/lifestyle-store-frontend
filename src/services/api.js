import API_BASE_URL from '../config/api.js';

export const fetchProducts = async ( ) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    // 映射 products 字段并转换命名
    return (data.products || []).map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      rating: product.rating,
      is_new: product.isNew,
      stock: product.stock,
      description: product.description,
      original_price: product.originalPrice,
      discount: product.discount,
      reviews: product.reviews
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

const authedFetch = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // Spread any headers from options
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Basic error handling or response processing can be added here if desired
  // For now, just return the response for the caller to handle
  return response;
};

export const fetchUserProfile = async () => {
  try {
    const response = await authedFetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
    });
    if (!response.ok) {
      // If response is not OK, try to parse error message from backend
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch user profile and parse error failed.' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Re-throw the error so the calling component can handle it
    throw error; 
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
