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
